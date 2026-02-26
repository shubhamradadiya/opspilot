import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, In, Repository } from 'typeorm';
import { Payout } from './entity/payout.entity';
import { I18nService } from 'nestjs-i18n';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import moment, { Moment } from 'moment';
import { UserLog } from '../attendance/entity/user-logs.entity';
import { AttendanceService } from '../attendance/attendance.service';
import { AddLoanDto } from './dto/add-loan.dto';
import { CreatePayoutDto } from './dto/create-payout.dto';
import { generateStartEndTimestampsWithTimezone, generateUniqueId } from 'src/helpers/utils.helper';
import { castToStorage, uploadFile, validateFileType } from 'src/helpers/file-upload.helper';
import { CalenderSlotTypes, ExpenseType, IMAGE_EXTENSIONS } from 'src/constants/app.constant';
import * as fs from 'fs';
import * as path from 'path';
import * as cheerio from 'cheerio';
import axios from 'axios';
import { ExpenseService } from '../expense/expense.service';

@Injectable()
export class PayoutService {
  constructor(
    @InjectRepository(Payout)
    private readonly payoutRepository: Repository<Payout>,

    @InjectRepository(UserLog)
    private readonly userLogRepository: Repository<UserLog>,

    private readonly userService: UserService,

    private readonly attendanceService: AttendanceService,

    private readonly expenseService: ExpenseService,

    private readonly i18n: I18nService,
  ) {}

  /**
   * Add loan to user
   * @param addLoanDto - The add loan dto
   * @returns The updated user
   */
  async addLoan(addLoanDto: AddLoanDto) {
    const user = await this.userService.findByUid(addLoanDto.uid);

    if (!user) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND', { args: { property: 'User' } }),
      );
    }

    const existingLoanAmount = Number(user.loanAmount || 0);
    const newLoanAmount = existingLoanAmount + addLoanDto.loanAmount;

    const updatedData: Partial<User> = {
      loanAmount: Number(newLoanAmount),
    };

    await this.userService.createOrUpdateUser(updatedData, user.id);

    return await this.userService.findByUid(user.uid);
  }

  /**
   * Create payout for user
   * @param createPayoutDto - The create payout dto
   * @param startTimestamp - The start timestamp
   * @param endTimestamp - The end timestamp
   * @returns The created payout
   */
  async createPayout(
    authUser: User,
    createPayoutDto: CreatePayoutDto,
    startTimestamp: number,
    endTimestamp: number,
    employeeSignature: Express.Multer.File,
  ) {
    if (!employeeSignature) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND', { args: { property: 'Employee Signature' } }),
      );
    }

    // 1. Find user for which payout is being created
    const user = await this.userService.findByUid(createPayoutDto.uid);

    if (!user) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND', { args: { property: 'User' } }),
      );
    }

    // 2. Get user logs for the given date range
    const startTime = moment(startTimestamp).toDate();
    const endTime = moment(endTimestamp).toDate();

    const userLogs = await this.userLogRepository
      .createQueryBuilder('userLog')
      .where('userLog.deletedAt IS NULL')
      .andWhere('userLog.userId = :userId', { userId: user.id })
      .andWhere('userLog.checkedInAt BETWEEN :startTime AND :endTime', {
        startTime,
        endTime,
      })
      .andWhere('userLog.checkedOutAt IS NOT NULL')
      .andWhere('userLog.payoutId IS NULL')
      .getMany();

    if (!userLogs || userLogs.length === 0) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND', { args: { property: 'User logs for this date range' } }),
      );
    }

    // 3. Calculate total payout amount and loan amount
    const totalPayoutAmount = Number(createPayoutDto.amount || 0);
    const totalPayoutLoanAmount = Number(createPayoutDto.loanAmount || 0);
    let remainingLoanAmount = 0;
    let paidAmount = 0;

    if (totalPayoutAmount <= 0) {
      throw new BadRequestException(this.i18n.t('exception.INVALID_PAYOUT_AMOUNT'));
    }

    // 4. Calculate remaining loan amount
    // const oldLoanAmount = Number(user.loanAmount || 0);
    // const remainingLoanAmount = Number(oldLoanAmount - totalPayoutLoanAmount);
    if (totalPayoutAmount > totalPayoutLoanAmount) {
      remainingLoanAmount = 0;
    } else {
      remainingLoanAmount = Number(totalPayoutLoanAmount - totalPayoutAmount);
    }

    // 5. Check for user has sufficient loan amount or not
    if (remainingLoanAmount < 0) {
      throw new BadRequestException(this.i18n.t('exception.INSUFFICIENT_LOAN_AMOUNT'));
    }

    // 6. Calculate paid amount based on user's loan amount
    if (totalPayoutAmount > totalPayoutLoanAmount) {
      paidAmount = totalPayoutAmount - totalPayoutLoanAmount;
    }

    // 7. Upload employee signature
    if (employeeSignature) {
      if (!validateFileType(employeeSignature, IMAGE_EXTENSIONS)) {
        throw new BadRequestException(
          this.i18n.t('exception.ONLY_IMAGES_ALLOWED', {
            args: { property: 'Employee Signature' },
          }),
        );
      }
      createPayoutDto.employeeSignature = uploadFile('employee-signatures', employeeSignature);
    }

    // 8. Create payout object
    const payoutObject = this.payoutRepository.create({
      pId: generateUniqueId('P'),
      amount: totalPayoutAmount,
      user: { id: user.id },
      loanAmount: Number(createPayoutDto.loanAmount),
      paidAmount,
      isPaid: true,
      employeeSignature: createPayoutDto.employeeSignature,
    });

    // 9. Update user's loan amount if loan amount is added
    if (createPayoutDto.loanAmount && totalPayoutLoanAmount >= 0) {
      await this.userService.createOrUpdateUser({ loanAmount: remainingLoanAmount }, user.id);
    }

    // 10. Save payout
    const payout = await this.payoutRepository.save(payoutObject);

    const userLogsIds = userLogs.map(log => log.id);

    // 11. Update user logs with payout id
    await this.userLogRepository.update({ id: In(userLogsIds) }, { payout: { id: payout.id } });

    // 12. If user is being paid with the amount greater than 0 then make the expense entry
    if (paidAmount > 0) {
      await this.expenseService.createExpense(authUser, {
        expenseDate: moment().toDate().getTime(),
        vendorName: user?.fullName,
        totalExpense: paidAmount,
        vendorId: user.uid,
        expenseType: ExpenseType.PAYOUT,
      });
    }

    return await this.getPayoutDetails(payout.pId);
  }

  /**
   * Get logged in user's payout list
   * @param authUser - The authenticated user
   * @param timeZone - The timezone
   * @param count - The count
   * @param limit - The limit
   * @param startTimestamp - The start timestamp
   * @param endTimestamp - The end timestamp
   * @returns The payout list and total count
   */
  async getSelfPayoutList(
    authUser: User,
    timeZone: string,
    count: number,
    limit: number,
    startTimestamp?: number,
    endTimestamp?: number,
  ) {
    // Build query to get paid payouts for the user
    const queryBuilder = this.payoutRepository
      .createQueryBuilder('payout')
      .leftJoinAndSelect('payout.user', 'user')
      .where('payout.userId = :userId', { userId: authUser.id })
      .andWhere('payout.isPaid = :isPaid', { isPaid: true })
      .andWhere('payout.deletedAt IS NULL')
      .orderBy('payout.createdAt', 'DESC');

    // Add date range filter if provided
    if (startTimestamp && endTimestamp) {
      const startTime = moment(startTimestamp).toDate();
      const endTime = moment(endTimestamp).toDate();

      queryBuilder.andWhere('payout.createdAt BETWEEN :startTime AND :endTime', {
        startTime,
        endTime,
      });
    }

    // Get total count
    const total = await queryBuilder.getCount();

    // Apply pagination
    const payouts = await queryBuilder.skip(count).take(limit).getMany();

    if (!payouts || payouts.length === 0) {
      return { payouts: [], total: 0 };
    }

    // Get payout IDs
    const payoutIds = payouts.map(p => p.id);

    // Get all user logs associated with these payouts
    const userLogs = await this.userLogRepository
      .createQueryBuilder('userLog')
      .leftJoinAndSelect('userLog.payout', 'payout')
      .leftJoinAndSelect('payout.user', 'user')
      .where('userLog.payoutId IN (:...payoutIds)', { payoutIds })
      .andWhere('userLog.deletedAt IS NULL')
      .andWhere('userLog.checkedInAt IS NOT NULL')
      .andWhere('userLog.checkedOutAt IS NOT NULL')
      .getMany();

    // Group logs by payout ID
    const logsByPayoutId: Record<number, UserLog[]> = {};
    for (const log of userLogs) {
      const payoutId = log.payout?.id;
      if (payoutId) {
        if (!logsByPayoutId[payoutId]) {
          logsByPayoutId[payoutId] = [];
        }
        logsByPayoutId[payoutId].push(log);
      }
    }

    // Build response with payout details, hours, and date range
    const payoutList = payouts.map(payout => {
      const logs = logsByPayoutId[payout.id] || [];

      // Calculate total hours from logs
      let totalSeconds = 0;
      let minDate: Date | null = null;
      let maxDate: Date | null = null;

      for (const log of logs) {
        // Since we filter by checkedOutAt IS NOT NULL, we can safely use checkedOutAt
        const end = moment(log.checkedOutAt).toDate();
        const start = moment(log.checkedInAt).toDate();
        const durationInSeconds = (end.getTime() - start.getTime()) / 1000;
        totalSeconds += durationInSeconds;

        const checkedInDate = moment(log.checkedInAt).toDate();
        if (!minDate || checkedInDate < minDate) {
          minDate = moment(checkedInDate).startOf('day').toDate();
        }
        if (!maxDate || checkedInDate > maxDate) {
          maxDate = moment(checkedInDate).endOf('day').toDate();
        }
      }

      // Floor the total seconds at the end for consistency
      const flooredTotalSeconds = Math.floor(totalSeconds);
      const totalHours = Number((flooredTotalSeconds / 3600).toFixed(2));
      const totalMinutes = Math.floor(flooredTotalSeconds / 60);

      // Format date range
      let dateRange = '';
      if (minDate && maxDate) {
        const startDateStr = moment(minDate)
          .tz(authUser?.timeZone || timeZone)
          .format('YYYY-MM-DD');
        const endDateStr = moment(maxDate)
          .tz(authUser?.timeZone || timeZone)
          .format('YYYY-MM-DD');
        dateRange = `${startDateStr} - ${endDateStr}`;
      }
      return {
        perHourRate: payout.user?.perHourRate,
        loanAmount: payout.loanAmount,
        totalAmount: payout.amount,
        durationInHours: totalHours,
        durationInMinutes: totalMinutes,
        durationInSeconds: flooredTotalSeconds,
        startDate: minDate || null,
        endDate: maxDate || null,
        weekRange: dateRange,
        weekStartDate: minDate || null,
        weekEndDate: maxDate || null,
      };
    });

    return {
      payouts: payoutList,
      total,
    };
  }

  // Old commented out method below
  // async getSelfPayoutList(
  //   authUser: User,
  //   timeZone: string,
  //   count: number,
  //   limit: number,
  //   startTimestamp?: number,
  //   endTimestamp?: number,
  // ) {
  //   // Build base WHERE
  //   let baseWhere = `
  //       userLog.userId = :userId
  //       AND userLog.checkedInAt IS NOT NULL
  //       AND userLog.deletedAt IS NULL
  //   `;

  //   const params: { userId: number; start?: Date; end?: Date } = { userId: authUser.id };

  //   // Add date range filter if provided
  //   if (startTimestamp && endTimestamp && startTimestamp !== null && endTimestamp !== null) {
  //     baseWhere += `
  //           AND userLog.checkedInAt BETWEEN :start AND :end`;
  //     params.start = moment(startTimestamp).toDate();
  //     params.end = moment(endTimestamp).toDate();
  //   }

  //   // Fetch distinct dates
  //   const rawDates = await this.userLogRepository
  //     .createQueryBuilder('userLog')
  //     .leftJoin('userLog.user', 'user')
  //     .select('DATE(userLog.checkedInAt)', 'date')
  //     .where(baseWhere, params)
  //     .andWhere('userLog.payoutId IS NOT NULL')
  //     .groupBy('DATE(userLog.checkedInAt)')
  //     .orderBy('DATE(userLog.checkedInAt)', 'DESC')
  //     .getRawMany();

  //   let dates: string[] = rawDates.map(r => r.date);
  //   dates = [...new Set(dates)];

  //   if (!dates.length) {
  //     return { weeklyPayouts: [], total: 0 };
  //   }

  //   // Convert dates → unique weeks (ordered)
  //   const orderedWeeks: string[] = [];
  //   const weekSeen = new Set<string>();

  //   for (const date of dates) {
  //     const { weekRange } = this.attendanceService.getWeekRangeLabel(date);

  //     if (!weekSeen.has(weekRange)) {
  //       weekSeen.add(weekRange);
  //       orderedWeeks.push(weekRange);
  //     }
  //   }

  //   // Paginate weeks - slice the array
  //   const paginatedWeeks = orderedWeeks.slice(count, count + limit);

  //   // Filter dates belonging to paginated weeks only
  //   const paginatedDates = dates.filter(date => {
  //     const { weekRange } = this.attendanceService.getWeekRangeLabel(date);
  //     return paginatedWeeks.includes(weekRange);
  //   });

  //   if (!paginatedDates.length) {
  //     return { weeklyPayouts: [], total: 0 };
  //   }

  //   // Fetch logs for those dates
  //   const userLogs = await this.userLogRepository
  //     .createQueryBuilder('userLog')
  //     .leftJoinAndSelect('userLog.payout', 'payout')
  //     .where('userLog.userId = :userId', { userId: authUser.id })
  //     .andWhere('DATE(userLog.checkedInAt) IN (:...paginatedDates)', { paginatedDates })
  //     .andWhere('userLog.payoutId IS NOT NULL')
  //     .andWhere('userLog.deletedAt IS NULL')
  //     .orderBy('userLog.checkedInAt', 'DESC')
  //     .getMany();

  //   // Group & calculate durations
  //   const grouped: Record<
  //     string,
  //     {
  //       date: string;
  //       durationInSeconds: number;
  //       durationInMinutes: number;
  //       durationInHours: number;
  //       perHourRate: number;
  //       loanAmount: number;
  //       totalAmount: number;
  //       logs: UserLog[];
  //       totalPaidAmount: number;
  //     }
  //   > = {};

  //   for (const log of userLogs) {
  //     const dateKey = this.attendanceService.getDateKey(moment(log.checkedInAt).toDate());

  //     const durationInSeconds = this.attendanceService.calculateDuration(log);
  //     const durationInMinutes = Number((durationInSeconds / 60).toFixed(2));
  //     const durationInHours = Number((durationInSeconds / 3600).toFixed(2));

  //     const perHourRate = Number(authUser.perHourRate) || 0;
  //     const loanAmount = Number(authUser.loanAmount) || 0;

  //     const paidAmount = Number(log?.payout?.paidAmount || 0) || 0;

  //     if (!grouped[dateKey]) {
  //       grouped[dateKey] = {
  //         date: dateKey,
  //         durationInSeconds: 0,
  //         durationInMinutes: 0,
  //         durationInHours: 0,
  //         perHourRate: 0,
  //         loanAmount: 0,
  //         totalAmount: 0,
  //         logs: [],
  //         totalPaidAmount: 0,
  //       };
  //     }

  //     grouped[dateKey].logs.push({
  //       ...log,
  //       checkedInAt: moment(log.checkedInAt)
  //         .tz(authUser?.timeZone || timeZone)
  //         .toDate(),
  //       checkedOutAt: log.checkedOutAt
  //         ? moment(log.checkedOutAt)
  //             .tz(authUser?.timeZone || timeZone)
  //             .toDate()
  //         : null,
  //     });

  //     grouped[dateKey].perHourRate = perHourRate;
  //     grouped[dateKey].loanAmount = loanAmount;
  //     grouped[dateKey].totalAmount += durationInHours * perHourRate;

  //     grouped[dateKey].durationInSeconds += durationInSeconds;
  //     grouped[dateKey].durationInMinutes += durationInMinutes;
  //     grouped[dateKey].durationInHours += durationInHours;

  //     if (log?.payout?.pId && log.payout.pId !== null) {
  //       grouped[dateKey].totalPaidAmount += paidAmount;
  //     }
  //   }

  //   // formatting date wise response to range wise response
  //   const rangeGrouped: Record<
  //     string,
  //     {
  //       weekRange: string;
  //       weekStartDate: string;
  //       weekEndDate: string;
  //       durationInSeconds: number;
  //       durationInMinutes: number;
  //       durationInHours: number;
  //       perHourRate: number;
  //       loanAmount: number;
  //       totalAmount: number;
  //       logs: UserLog[];
  //       totalPaidAmount: number;
  //     }
  //   > = {};

  //   for (const [dateKey, data] of Object.entries(grouped)) {
  //     const { weekRange, weekStartDate, weekEndDate } =
  //       this.attendanceService.getWeekRangeLabel(dateKey);

  //     if (!rangeGrouped[weekRange]) {
  //       rangeGrouped[weekRange] = {
  //         weekRange,
  //         weekStartDate,
  //         weekEndDate,
  //         durationInSeconds: 0,
  //         durationInMinutes: 0,
  //         durationInHours: 0,
  //         perHourRate: Number(data.perHourRate),
  //         loanAmount: Number(data.loanAmount),
  //         totalAmount: 0,
  //         logs: [],
  //         totalPaidAmount: 0,
  //       };
  //     }

  //     rangeGrouped[weekRange].durationInSeconds += data.durationInSeconds;
  //     rangeGrouped[weekRange].durationInMinutes += data.durationInMinutes;
  //     rangeGrouped[weekRange].durationInHours += data.durationInHours;
  //     rangeGrouped[weekRange].totalAmount += Number(data.totalAmount);
  //     rangeGrouped[weekRange].logs.push(...data.logs);
  //     rangeGrouped[weekRange].totalPaidAmount += Number(data.totalPaidAmount);
  //   }

  //   const weeklyPayouts = paginatedWeeks.map(week => rangeGrouped[week]).filter(Boolean);

  //   return {
  //     weeklyPayouts,
  //     total: orderedWeeks.length || 0,
  //   };
  // }

  /**
   * Get all users payout list
   * @param isMonthlyPayout - Is monthly payout or not
   * @param count - The count
   * @param limit - The limit
   * @param startTimestamp - The start timestamp
   * @param endTimestamp - The end timestamp
   * @param search - The search query
   * @returns The all users payout list and total count
   */
  async getAllUsersPayoutList(
    isMonthlyPayout: boolean,
    startTimestamp: number,
    endTimestamp: number,
    count: number,
    limit: number,
    search?: string,
  ) {
    const normalizedSearch = search?.trim().toLowerCase();

    isMonthlyPayout = String(isMonthlyPayout) === 'true';

    const startTime = moment(startTimestamp).toDate();
    const endTime = moment(endTimestamp).toDate();

    const userIdsSubQuery = this.userLogRepository
      .createQueryBuilder('userLog')
      .innerJoin('userLog.user', 'user')
      .select('user.uid', 'userId')
      .where('userLog.deletedAt IS NULL')
      .andWhere('userLog.checkedInAt BETWEEN :startTime AND :endTime', {
        startTime,
        endTime,
      })
      .groupBy('user.uid')
      .orderBy('user.uid', 'DESC');

    if (normalizedSearch) {
      userIdsSubQuery.andWhere(
        new Brackets(qb => {
          qb.where('LOWER(user.fullName) LIKE :search', {
            search: `%${normalizedSearch}%`,
          }).orWhere('LOWER(user.phone) LIKE :search', {
            search: `%${normalizedSearch}%`,
          });
        }),
      );
    }

    userIdsSubQuery.offset(count).limit(limit);

    const paginatedUsers = await userIdsSubQuery.getRawMany();

    let userIds: string[] = paginatedUsers?.map(user => user.userId) || [];
    userIds = [...new Set(userIds)];

    if (userIds.length === 0) {
      return {
        payouts: [],
        total: 0,
      };
    }

    const queryBuilder = this.userLogRepository
      .createQueryBuilder('userLog')
      .innerJoin('userLog.user', 'user')
      .leftJoin('userLog.payout', 'payout')
      .where('userLog.deletedAt IS NULL')
      .andWhere('userLog.checkedInAt BETWEEN :startTime AND :endTime', {
        startTime,
        endTime,
      })
      .andWhere('userLog.checkedOutAt IS NOT NULL')
      .andWhere('user.uid IN (:...userIds)', { userIds })
      .select([
        'user.uid AS "userId"',
        'user.fullName AS "fullName"',
        'user.profilePicture AS "profilePicture"',
        'user.perHourRate AS "perHourRate"',
        'user.loanAmount AS "loanAmount"',
        // 'payout.pId AS "pId"',
        // 'payout.isPaid AS "isPaid"',
        `DATE("userLog"."checkedInAt") AS "attendanceDate"`,

        // 1. Total worked time (all logs)
        `
        SUM(
          EXTRACT(
            EPOCH FROM (
              "userLog"."checkedOutAt" - "userLog"."checkedInAt"
            )
          )
        ) AS "totalSeconds"
        `,

        // 2. Paid worked time ONLY
        `
        SUM(
          CASE
            WHEN payout.isPaid IS true
            THEN EXTRACT(
              EPOCH FROM (
                "userLog"."checkedOutAt" - "userLog"."checkedInAt"
              )
            )
            ELSE 0
          END
        ) AS "paidSeconds"
        `,
      ])
      .groupBy('user.uid')
      .addGroupBy('user.fullName')
      .addGroupBy('user.profilePicture')
      .addGroupBy('user.perHourRate')
      .addGroupBy('user.loanAmount')
      // .addGroupBy('payout.pId')
      // .addGroupBy('payout.isPaid')
      .addGroupBy(`DATE("userLog"."checkedInAt")`)
      .orderBy('"attendanceDate"', 'ASC');

    const userAndDateWiseAttendanceRows = await queryBuilder.getRawMany();

    if (userAndDateWiseAttendanceRows && !userAndDateWiseAttendanceRows.length) {
      return {
        payouts: [],
        total: 0,
      };
    }

    const attendanceMap: Record<
      string,
      {
        userId: string;
        fullName: string;
        profilePicture: string;
        dayWiseAttendance: {
          date: Moment;
          durationInHours: number | null;
          durationInMinutes: number | null;
          durationInSeconds: number | null;
        }[];
        weekWiseAttendance?: {
          weekRange: string;
          weekStartDate: Moment;
          weekEndDate: Moment;
          durationInHours: number | null;
          durationInMinutes: number | null;
          durationInSeconds: number | null;
        }[];
        totalDurationInHours: number;
        totalDurationInMinutes: number;
        totalDurationInSeconds: number;
        perHourRate: number;
        loanAmount: number;
        totalAmount: number;
        totalPaidAmount: number;
        isPaid: boolean;
      }
    > = {};

    for (const row of userAndDateWiseAttendanceRows) {
      const userId = row.userId;
      const totalSeconds = Number(row?.totalSeconds) || 0;
      const paidSeconds = Number(row?.paidSeconds) || 0;

      const durationInHours = totalSeconds / 3600;
      const durationInMinutes = Math.floor(totalSeconds / 60);
      const durationInSeconds = Math.floor(totalSeconds);

      const paidDurationInHours = paidSeconds / 3600;

      const perHourRate = Number(row?.perHourRate || 0);
      const loanAmount = Number(row?.loanAmount || 0);

      if (!attendanceMap[row.userId]) {
        attendanceMap[userId] = {
          userId,
          fullName: row.fullName,
          profilePicture: row.profilePicture,
          dayWiseAttendance: [],
          weekWiseAttendance: [],
          totalDurationInHours: 0,
          totalDurationInMinutes: 0,
          totalDurationInSeconds: 0,
          perHourRate: 0,
          loanAmount: 0,
          totalAmount: 0,
          totalPaidAmount: 0,
          isPaid: true,
        };
      }

      attendanceMap[userId].dayWiseAttendance.push({
        date: moment(row.attendanceDate),
        durationInHours,
        durationInMinutes,
        durationInSeconds,
      });

      attendanceMap[userId].perHourRate = perHourRate;
      attendanceMap[userId].loanAmount = loanAmount;
      attendanceMap[userId].totalAmount += durationInHours * perHourRate;

      // if (row.pId && row.pId !== null) {
      //   attendanceMap[userId].totalPaidAmount += durationInHours * perHourRate;
      // }
      // if (String(row.isPaid) !== 'true') {
      //   attendanceMap[userId].isPaid = false;
      // }

      attendanceMap[userId].totalPaidAmount += paidDurationInHours * perHourRate;

      if (paidSeconds < totalSeconds) {
        attendanceMap[userId].isPaid = false;
      }

      attendanceMap[userId].totalDurationInHours += durationInHours;
      attendanceMap[userId].totalDurationInMinutes += durationInMinutes;
      attendanceMap[userId].totalDurationInSeconds += durationInSeconds;
    }

    const attendanceData = Object.values(attendanceMap);

    // Fill missing dates with null duration ---------------------------------------------

    // start and end date which is provided by user
    const startDate = moment(startTimestamp);
    const endDate = moment(endTimestamp);

    // take startDate to fill the missing dates and later we'll increment the dateKey
    let dateKey = startDate.clone();

    // fill missing dates with null duration one by one for every user
    for (const userData of attendanceData) {
      // initialize the array to store the filled day wise attendance
      const filledDayWiseAttendance: typeof userData.dayWiseAttendance = [];
      const dayWiseAttendance = userData.dayWiseAttendance;

      // get all the dates from dayWiseAttendance array
      const dates = dayWiseAttendance.map(day => day.date);

      while (dateKey.isSameOrBefore(endDate, 'day')) {
        const existingDay = dates.find(date => date.isSame(dateKey, 'day'));

        if (existingDay) {
          filledDayWiseAttendance.push(
            ...dayWiseAttendance.filter(day => day.date.isSame(dateKey, 'day')),
          );
        } else {
          filledDayWiseAttendance.push({
            date: dateKey.clone(),
            durationInHours: null,
            durationInMinutes: null,
            durationInSeconds: null,
          });
        }

        dateKey.add(1, 'day');
      }

      // // replace dayWiseAttendance with filledDayWiseAttendance
      userData.dayWiseAttendance = filledDayWiseAttendance;
      dateKey = startDate.clone();

      // // reset dateKey to startDate for next user data
      // dateKey = startDate;
    }

    if (isMonthlyPayout) {
      for (const userData of attendanceData) {
        const weeklyMap: Record<
          string,
          {
            weekRange: string;
            weekStartDate: Moment;
            weekEndDate: Moment;
            durationInHours: number;
            durationInMinutes: number;
            durationInSeconds: number;
          }
        > = {};

        if (userData.dayWiseAttendance.length > 0) {
          for (const day of userData.dayWiseAttendance) {
            const { weekRange, weekStartDate, weekEndDate } =
              this.attendanceService.getWeekRangeLabel(day.date.clone());

            const durationInHours = day.durationInHours;
            const durationInMinutes = day.durationInMinutes;
            const durationInSeconds = day.durationInSeconds;

            if (!weeklyMap[weekRange]) {
              weeklyMap[weekRange] = {
                weekRange,
                weekStartDate,
                weekEndDate,
                durationInHours: 0,
                durationInMinutes: 0,
                durationInSeconds: 0,
              };
            }

            weeklyMap[weekRange].durationInHours += durationInHours || 0;
            weeklyMap[weekRange].durationInMinutes += durationInMinutes || 0;
            weeklyMap[weekRange].durationInSeconds += durationInSeconds || 0;
          }

          // Replace dailyAttendance with weeklyAttendance
          userData.weekWiseAttendance = Object.values(weeklyMap);

          // Fill missing week ranges with null duration ---------------------------------------------

          // initialize the array to store the filled week wise attendance
          const newWeekWiseAttendance: typeof userData.weekWiseAttendance = [];

          // loop through each week of weekWiseAttendance array
          for (const week of userData.weekWiseAttendance) {
            // get week range and start and end date of week
            const { weekRange, weekStartDate, weekEndDate } = week;
            // const weekStartDate = weekRange.split(' - ')[0];
            // const weekEndDate = weekRange.split(' - ')[1];

            // get duration of each date of week for decide whether week is with null entry or not
            const durationOfEachDates: (number | null | undefined)[] = [];

            // take week start date as currentDate
            let currentDate = weekStartDate.clone();

            // loop through each date of week until weekEndDate
            while (currentDate.isSameOrBefore(weekEndDate, 'day')) {
              // get duration of each date of week and push it to durationOfEachDates array
              const durationInSeconds = userData.dayWiseAttendance.find(day =>
                day.date.isSame(currentDate, 'day'),
              )?.durationInSeconds;
              durationOfEachDates.push(durationInSeconds);

              // increment the currentDate by 1 day
              currentDate = currentDate.add(1, 'day');
            }

            // Check if all dates of week are null or undefined and if it is then push it to newWeekWiseAttendance array with null duration and continue for next week
            if (
              durationOfEachDates.every(duration => duration === null || duration === undefined)
            ) {
              newWeekWiseAttendance.push({
                weekRange,
                weekStartDate,
                weekEndDate,
                durationInHours: null,
                durationInMinutes: null,
                durationInSeconds: null,
              });
              continue;
            }

            // otherwise push it to newWeekWiseAttendance array with same duration
            newWeekWiseAttendance.push(week);
          }

          // replace weekWiseAttendance with newWeekWiseAttendance
          userData.weekWiseAttendance = newWeekWiseAttendance;
        }
      }
    }

    const totalQb = await this.userLogRepository
      .createQueryBuilder('userLog')
      .innerJoin('userLog.user', 'user')
      .where('userLog.deletedAt IS NULL')
      .andWhere('userLog.checkedInAt BETWEEN :startTime AND :endTime', {
        startTime,
        endTime,
      });

    if (normalizedSearch) {
      totalQb.andWhere(
        new Brackets(qb => {
          qb.where('LOWER(user.fullName) LIKE :search', {
            search: `%${normalizedSearch}%`,
          }).orWhere('LOWER(user.phone) LIKE :search', {
            search: `%${normalizedSearch}%`,
          });
        }),
      );
    }

    const totalResult = await totalQb.select('COUNT(DISTINCT user.uid)', 'total').getRawOne();

    const total = Number(totalResult?.total || 0);

    return { payouts: attendanceData, total };
  }

  /**
   * Get all users payout list
   * @param authUser - The authenticated user
   * @param calenderSlotType - The calendar slot type
   * @param startTimestamp - The start timestamp
   * @param endTimestamp - The end timestamp
   * @param count - The count
   * @param limit - The limit
   * @param search - The search
   * @returns The users payout list
   */
  async getAllUsersPayoutListV2(
    authUser: User,
    calenderSlotType: CalenderSlotTypes,
    startTimestamp: number,
    endTimestamp: number,
    count: number,
    limit: number,
    search?: string,
  ) {
    const normalizedSearch = search?.trim().toLowerCase();
    const unixStartTimestamp = Math.floor(Number(startTimestamp) / 1000);
    const unixEndTimestamp = Math.floor(Number(endTimestamp) / 1000);

    const timezone = authUser?.requestHeader?.timezone || 'UTC';

    // Already UTC & startOf/endOf
    const startTime = moment(startTimestamp);
    const endTime = moment(endTimestamp);

    /* -------------------------------------------
        BASE QUERY
    --------------------------------------------*/
    const baseQb = this.userLogRepository
      .createQueryBuilder('userLog')
      .innerJoin('userLog.user', 'user')
      .leftJoin('userLog.payout', 'payout')
      .where('userLog.deletedAt IS NULL')
      .andWhere('userLog.checkedInAt BETWEEN :startTime AND :endTime', { startTime, endTime });

    /* -------------------------------------------
        USER IDS QUERY (Pagination)
    --------------------------------------------*/
    const userIdsQb = baseQb
      .clone()
      .select('user.uid', 'userId')
      .groupBy('user.uid')
      .orderBy('user.uid', 'DESC');

    /* -------------------------------------------
        TOTAL COUNT QUERY
    --------------------------------------------*/
    const totalQb = baseQb.clone();

    if (normalizedSearch) {
      const searchBracket = new Brackets(qb => {
        qb.where('LOWER(user.fullName) LIKE :search', {
          search: `%${normalizedSearch}%`,
        }).orWhere('LOWER(user.phone) LIKE :search', {
          search: `%${normalizedSearch}%`,
        });
      });

      userIdsQb.andWhere(searchBracket);
      totalQb.andWhere(searchBracket);
    }

    userIdsQb.offset(count).limit(limit);

    const paginatedUsers = await userIdsQb.getRawMany();

    if (!paginatedUsers.length) {
      return { payouts: [], total: 0 };
    }

    const userIds = paginatedUsers.map(u => u.userId);

    const totalResult = await totalQb.select('COUNT(DISTINCT user.uid)', 'total').getRawOne();

    const total = Number(totalResult?.total || 0);

    /* -------------------------------------------
        ATTENDANCE AGGREGATION
    --------------------------------------------*/
    const logsQb = baseQb
      .clone()
      .andWhere('user.uid IN (:...userIds)', { userIds })
      .select([
        'user.uid AS "userId"',
        'user.fullName AS "fullName"',
        'user.profilePicture AS "profilePicture"',
        'user.perHourRate AS "perHourRate"',
        'user.loanAmount AS "loanAmount"',
        `DATE("userLog"."checkedInAt") AS "attendanceDate"`,

        `
        SUM(
          EXTRACT(EPOCH FROM 
            ("userLog"."checkedOutAt" - "userLog"."checkedInAt")
          )
        ) AS "totalSeconds"
        `,

        `
        SUM(
          CASE 
            WHEN payout.isPaid IS true THEN
              EXTRACT(EPOCH FROM 
                ("userLog"."checkedOutAt" - "userLog"."checkedInAt")
              )
            ELSE 0
          END
        ) AS "paidSeconds"
        `,
      ])
      .groupBy('user.uid')
      .addGroupBy('user.fullName')
      .addGroupBy('user.profilePicture')
      .addGroupBy('user.perHourRate')
      .addGroupBy('user.loanAmount')
      .addGroupBy(`DATE("userLog"."checkedInAt")`)
      .orderBy('"attendanceDate"', 'ASC');

    const rows = await logsQb.getRawMany();

    if (!rows.length) {
      return { payouts: [], total };
    }

    /* -------------------------------------------
        BUILD MAP
    --------------------------------------------*/
    const attendanceMap: Record<
      string,
      {
        userId: string;
        fullName: string;
        profilePicture: string;
        attendance: {
          date: Moment;
          durationInHours: number | null;
          durationInMinutes: number | null;
          durationInSeconds: number | null;
        }[];
        totalDurationInHours: number;
        totalDurationInMinutes: number;
        totalDurationInSeconds: number;
        perHourRate: number;
        loanAmount: number;
        totalAmount: number;
        totalPaidAmount: number;
        isPaid: boolean;
      }
    > = {};

    for (const row of rows) {
      const userId = row.userId;

      const totalSeconds = Number(row.totalSeconds || 0);
      const paidSeconds = Number(row.paidSeconds || 0);

      const hours = totalSeconds / 3600;

      if (!attendanceMap[userId]) {
        attendanceMap[userId] = {
          userId,
          fullName: row.fullName,
          profilePicture: row.profilePicture,
          perHourRate: Number(row.perHourRate || 0),
          loanAmount: Number(row.loanAmount || 0),
          attendance: [],
          totalDurationInHours: 0,
          totalDurationInMinutes: 0,
          totalDurationInSeconds: 0,
          totalAmount: 0,
          totalPaidAmount: 0,
          isPaid: true,
        };
      }

      attendanceMap[userId].attendance.push({
        date: moment(row.attendanceDate),
        durationInHours: hours,
        durationInMinutes: Math.floor(totalSeconds / 60),
        durationInSeconds: Math.floor(totalSeconds),
      });

      attendanceMap[userId].totalDurationInHours += hours;
      attendanceMap[userId].totalDurationInMinutes += Math.floor(totalSeconds / 60);
      attendanceMap[userId].totalDurationInSeconds += Math.floor(totalSeconds);

      attendanceMap[userId].totalAmount += hours * attendanceMap[userId].perHourRate;

      attendanceMap[userId].totalPaidAmount +=
        (paidSeconds / 3600) * attendanceMap[userId].perHourRate;

      if (paidSeconds < totalSeconds) {
        attendanceMap[userId].isPaid = false;
      }
    }

    const attendanceData = Object.values(attendanceMap);

    const timeSlots = generateStartEndTimestampsWithTimezone(
      unixStartTimestamp,
      unixEndTimestamp,
      calenderSlotType,
      timezone,
    );

    const slicedTimeSlots = timeSlots.slice(-15);

    for (const user of attendanceData) {
      const filled: any[] = [];

      for (const timeSlot of slicedTimeSlots) {
        const { start, end, startDate, endDate } = timeSlot;
        const startMoment = moment(startDate).tz(timezone);
        const endMoment = moment(endDate).tz(timezone);

        const existing = user.attendance.filter(d => {
          const date = moment(d.date).tz(timezone);

          return date.isBetween(startMoment, endMoment, undefined, '[]');
        });

        const totalSeconds = existing.reduce((sum, record) => {
          sum += record.durationInSeconds || 0;
          return sum;
        }, 0);

        filled.push({
          startDate: start,
          endDate: end,
          durationInSeconds: totalSeconds || null,
          durationInMinutes: totalSeconds ? Math.floor(totalSeconds / 60) : null,
          durationInHours: totalSeconds ? Number((totalSeconds / 3600).toFixed(2)) : null,
        });
      }

      user.attendance = filled;
    }

    return { payouts: attendanceData, total };
  }

  /**
   * Generate payout receipt PDF
   * @param timeZone - The timezone
   * @param uid - The user ID
   * @param startTimestamp - The start timestamp
   * @param endTimestamp - The end timestamp
   * @returns The payout receipt PDF HTML content
   */
  async generatePayoutReceiptPDF(
    timeZone: string,
    uid: string,
    startTimestamp: number,
    endTimestamp: number,
  ) {
    try {
      const user = await this.userService.findByUid(uid);

      if (!user) {
        throw new NotFoundException(
          this.i18n.t('exception.NOT_FOUND', { args: { entity: 'User' } }),
        );
      }

      const startTime = moment(startTimestamp).toDate();
      const endTime = moment(endTimestamp).toDate();

      // Calculating total paid amount and total logged hours inn given time range
      const userLogsWithPayout = await this.userLogRepository
        .createQueryBuilder('userLog')
        .leftJoin('userLog.payout', 'payout')
        .select([
          'userLog.id AS "userLogId"',
          'payout.id AS "payoutId"',
          'payout.employeeSignature AS "employeeSignature"',
          'userLog.checkedInAt AS "checkedInAt"',
          `
          SUM(
            EXTRACT(
              EPOCH FROM (
                COALESCE("userLog"."checkedOutAt", NOW())
                - "userLog"."checkedInAt"
              )
            )
          ) AS "totalSeconds"
          `,
        ])
        .where('userLog.userId = :userId', { userId: user.id })
        .andWhere('userLog.deletedAt IS NULL')
        .andWhere('userLog.checkedInAt IS NOT NULL')
        .andWhere('userLog.payoutId IS NOT NULL')
        .andWhere('userLog.checkedInAt BETWEEN :startTime AND :endTime', {
          startTime,
          endTime,
        })
        .groupBy('userLog.id')
        .addGroupBy('payout.id')
        .addGroupBy('payout.employeeSignature')
        .addGroupBy('userLog.checkedInAt')
        .getRawMany();

      const payoutMap: Record<
        string,
        {
          payoutId: string;
          employeeSignature: string | null;
          totalSeconds: number;
          minDate: Date;
          maxDate: Date;
        }
      > = {};

      for (const log of userLogsWithPayout) {
        const payoutId = log.payoutId;
        const checkInDate = new Date(log.checkedInAt);

        if (!payoutMap[payoutId]) {
          payoutMap[payoutId] = {
            payoutId,
            employeeSignature: log.employeeSignature,
            totalSeconds: 0,
            minDate: checkInDate,
            maxDate: checkInDate,
          };
        }

        payoutMap[payoutId].totalSeconds += Number(log.totalSeconds);

        if (checkInDate < payoutMap[payoutId].minDate) {
          payoutMap[payoutId].minDate = checkInDate;
        }
        if (checkInDate > payoutMap[payoutId].maxDate) {
          payoutMap[payoutId].maxDate = checkInDate;
        }
      }

      const payoutIds = userLogsWithPayout.length
        ? Array.from(new Set(userLogsWithPayout.map(log => log?.payoutId))).filter(
            id => id !== null,
          )
        : [];

      if (payoutIds.length === 0) {
        throw new NotFoundException(
          this.i18n.t('exception.NOT_FOUND', { args: { property: 'Payouts' } }),
        );
      }

      const payouts = await this.payoutRepository
        .createQueryBuilder('payout')
        .select(['payout.id AS "id"', 'payout.paidAmount AS "paidAmount"'])
        .where('payout.deletedAt IS NULL')
        .andWhere('payout.id IN (:...payoutIds)', { payoutIds })
        .getRawMany();

      const paidAmountMap = Object.fromEntries(payouts.map(p => [p.id, Number(p.paidAmount || 0)]));

      const receiptDate = moment().tz(timeZone).format('YYYY-MM-DD');

      const employeeName = user?.fullName || '';

      const receipt: string[] = [];

      // Read the HTML template
      const templatePath = path.join(
        __dirname,
        '../../../public/payout/payout-receipt-template.html',
      );

      if (!fs.existsSync(templatePath)) {
        throw new Error(`Template file not found at: ${templatePath}`);
      }

      const htmlContent = fs.readFileSync(templatePath, 'utf8');

      if (!htmlContent) {
        throw new Error('HTML template file content is empty');
      }

      for (const payout of Object.values(payoutMap)) {
        const totalHours = Number((payout.totalSeconds / 3600).toFixed(2));
        const totalPaidAmount = Number((paidAmountMap[payout.payoutId] || 0).toFixed(2));
        const minDate = moment(payout.minDate).tz(timeZone).format('YYYY-MM-DD');
        const maxDate = moment(payout.maxDate).tz(timeZone).format('YYYY-MM-DD');

        const payoutWeekRange = minDate === maxDate ? `${minDate}` : `${minDate} - ${maxDate}`;

        const $ = cheerio.load(htmlContent);

        // Header
        $('.receipt-date').text(receiptDate);

        // Content
        $('.amount').text(`$${totalPaidAmount.toFixed(2)}`);
        $('.hours').text(totalHours.toFixed(2));
        $('.week-range').text(payoutWeekRange);

        // Signature
        $('.employee-name').text(employeeName);
        $('.date-line').text(receiptDate);

        if (payout.employeeSignature) {
          const base64Image = await this.urlToBase64(castToStorage(payout.employeeSignature));

          $('.signature-image').attr('src', base64Image as unknown as string);
        } else {
          $('.signature-image').remove();
        }

        receipt.push(`<div class="page">${$.html()}</div>`);
      }

      return receipt;
    } catch (error) {
      console.error('Error generating payout receipt PDF:', error);
      throw new Error(`Failed to generate payout receipt PDF: ${error.message}`);
    }
  }

  /**
   * Get payout details by payout ID
   * @param pId - The payout ID
   * @returns The payout details
   */
  async getPayoutDetails(pId: string) {
    return await this.payoutRepository
      .createQueryBuilder('payout')
      .leftJoinAndSelect('payout.user', 'user')
      .where('payout.pId = :pId', { pId })
      .getOne();
  }

  async urlToBase64(imageUrl: string): Promise<string> {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const base64 = Buffer.from(response.data).toString('base64');
    const contentType = response.headers['content-type'] || 'image/png';
    return `data:${contentType};base64,${base64}`;
  }
}
