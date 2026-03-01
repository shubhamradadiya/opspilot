import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserLog } from './entity/user-logs.entity';
import { Brackets, In, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { I18nService } from 'nestjs-i18n';
import moment, { Moment } from 'moment-timezone';
import { generateStartEndTimestampsWithTimezone, generateUniqueId } from 'src/helpers/utils.helper';
import { CheckStatusDto } from './dto/check-status.dto';
import { ClockInClockOutDto } from './dto/clock-in-clock-out-dto';
import { AttendanceStatus, UserRoles } from 'src/constants/user.constant';
import { Payout } from '../payout/entity/payout.entity';
import { CalenderSlotTypes } from 'src/constants/app.constant';
import { AddManualUserLogDto } from './dto/add-manual-user-log.dto';
import { DeleteUserLogsManuallyDto } from './dto/delete-user-logs-manually.dto';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(UserLog)
    private readonly userLogRepository: Repository<UserLog>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Payout)
    private readonly payoutRepository: Repository<Payout>,

    private readonly i18n: I18nService,
  ) {}

  /**
   * Check if user is already clocked in
   * @param checkStatusDto Check status DTO
   * @returns Active log and user
   */
  async checkStatus(checkStatusDto: CheckStatusDto) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.phone = :phone', { phone: checkStatusDto.phoneNumber })
      .andWhere('user.countryCode = :countryCode', { countryCode: checkStatusDto.countryCode })
      .andWhere('user.isoCode = :isoCode', { isoCode: checkStatusDto.isoCode })
      .andWhere('user.isActive = :isActive', { isActive: true })
      .andWhere('user.deletedAt IS NULL')
      .getOne();

    if (!user) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND', { args: { property: 'User' } }),
      );
    }

    // Check permission for clock in and clock out is enabled for this user or not
    if (!user.isClockInClockOutEnabled) {
      throw new ForbiddenException(
        this.i18n.t('exception.USER_PERMISSION_DENIED', {
          args: { property: 'Clock in - Clock out' },
        }),
      );
    }

    // Check if user already clocked in
    const activeLog = await this.userLogRepository
      .createQueryBuilder('userLogs')
      .where('userLogs.deletedAt IS NULL')
      .andWhere('userLogs.checkedOutAt IS NULL')
      .andWhere('userLogs.userId = :userId', { userId: user.id })
      .getOne();

    return activeLog ? { activeLog, user } : { activeLog: null, user };
  }

  /**
   * Clock in or clock out user
   * @param clockInClockOutDto Clock in/clock out DTO
   * @returns User log
   */
  async clockInClockOut(clockInClockOutDto: ClockInClockOutDto) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.uid = :uid', { uid: clockInClockOutDto.uid })
      .andWhere('user.isActive = :isActive', { isActive: true })
      .andWhere('user.deletedAt IS NULL')
      .getOne();

    if (!user) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND', { args: { property: 'User' } }),
      );
    }

    // Check permission for clock in and clock out is enabled for this user or not
    if (!user.isClockInClockOutEnabled) {
      throw new ForbiddenException(
        this.i18n.t('exception.USER_PERMISSION_DENIED', {
          args: { property: 'Clock in - Clock out' },
        }),
      );
    }

    // If user log Id is provided, it's a clock out
    if (clockInClockOutDto?.ulId) {
      // check for existing active log
      const activeLog = await this.userLogRepository
        .createQueryBuilder('userLogs')
        .where('userLogs.deletedAt IS NULL')
        .andWhere('userLogs.checkedInAt IS NOT NULL')
        .andWhere('userLogs.checkedOutAt IS NULL')
        .andWhere('userLogs.userId = :userId', { userId: user.id })
        .andWhere('userLogs.ulId = :ulId', { ulId: clockInClockOutDto.ulId })
        .getOne();

      if (!activeLog) {
        throw new NotFoundException(
          this.i18n.t('exception.NOT_FOUND', { args: { property: 'Clock In Record' } }),
        );
      }

      // Update the existing log with clock out time
      activeLog.checkedOutAt = moment().toDate();
      activeLog.status = AttendanceStatus.CLOCKED_OUT;

      await this.userLogRepository.save(activeLog);

      return await this.userLogRepository.findOne({
        where: { id: activeLog.id },
        relations: { user: true },
      });
    }

    // Check if user already clocked in
    const activeLog = await this.userLogRepository
      .createQueryBuilder('userLogs')
      .where('userLogs.deletedAt IS NULL')
      .andWhere('userLogs.checkedInAt IS NOT NULL')
      .andWhere('userLogs.checkedOutAt IS NULL')
      .andWhere('userLogs.userId = :userId', { userId: user.id })
      .getOne();

    if (activeLog) {
      throw new BadRequestException(this.i18n.t('exception.ATTENDANCE_CLOCK_IN_ALREADY_EXISTS'));
    }

    // Create new log
    const clockIn = this.userLogRepository.create({
      ulId: generateUniqueId('UL'),
      user: { id: user.id },
      status: AttendanceStatus.CLOCKED_IN,
      checkedInAt: moment().toDate(),
      checkedOutAt: null,
    });

    await this.userLogRepository.save(clockIn);
    return await this.userLogRepository.findOne({
      where: { id: clockIn.id },
      relations: { user: true },
    });
  }

  /**
   * Add manual user log by admin
   * @param addManualUserLogDto Add manual user log DTO
   * @returns User log
   */
  async addManualUserLog(addManualUserLogDto: AddManualUserLogDto) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.uid = :uid', { uid: addManualUserLogDto.uid })
      .andWhere('user.deletedAt IS NULL')
      .andWhere('user.isActive = :isActive', { isActive: true })
      .getOne();

    if (!user) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND', { args: { property: 'User' } }),
      );
    }

    const userLogObject = this.userLogRepository.create({
      ulId: generateUniqueId('UL'),
      user: { id: user.id },
      status: AttendanceStatus.CLOCKED_OUT,
      checkedInAt: moment(addManualUserLogDto.checkedInAt).toDate(),
      checkedOutAt: moment(addManualUserLogDto.checkedOutAt).toDate(),
    });

    const userLog = await this.userLogRepository.save(userLogObject);

    return await this.userLogRepository.findOne({
      where: { id: userLog.id },
      relations: { user: true },
    });
  }

  /**
   * Delete user logs manually by admin
   * @param deleteUserLogsManuallyDto Delete user logs manually DTO
   * @returns Success message
   */
  async deleteUserLogManually(deleteUserLogsManuallyDto: DeleteUserLogsManuallyDto) {
    const { userLogIds } = deleteUserLogsManuallyDto;

    if (!userLogIds?.length) {
      throw new BadRequestException(
        this.i18n.t('exception.NOT_FOUND', { args: { property: 'User log Ids' } }),
      );
    }

    const userLogs = await this.userLogRepository
      .createQueryBuilder('userLog')
      .where('userLog.deletedAt IS NULL')
      .andWhere('userLog.ulId In (:...ulIds)', { ulIds: userLogIds })
      .getMany();

    if (!userLogs.length) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND', { args: { property: 'User Logs' } }),
      );
    }

    const foundIds = new Set(userLogs.map(log => log.ulId));
    const missingIds = userLogIds.filter(id => !foundIds.has(id));

    if (missingIds.length) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND', { args: { property: 'User Logs for some Ids' } }),
      );
    }

    const invalidLogs = userLogs.filter(log => log.status !== AttendanceStatus.CLOCKED_OUT);

    if (invalidLogs.length > 0) {
      throw new BadRequestException(this.i18n.t('exception.CANNOT_DELETE_ACTIVE_LOGS'));
    }

    const idsToDelete = userLogs.map(log => log.ulId);

    await this.userLogRepository.softDelete({ ulId: In(idsToDelete) });

    return {
      statusCode: HttpStatus.OK,
      message: this.i18n.t('translate.DELETED', {
        args: { property: `${idsToDelete.length === 1 ? 'User Log' : 'User Logs'}` },
      }),
    };
  }

  /**
   * Get attendance logs for a user date wise
   * @param authUser Authenticated user
   * @param timeZone Time zone
   * @param count Count
   * @param limit Limit
   * @param startTimestamp Start timestamp
   * @param endTimestamp End timestamp
   * @param uid User Id
   * @returns User logs and total
   */
  async getDateWiseLogs(
    authUser: User,
    timeZone: string,
    count: number,
    limit: number,
    startTimestamp?: number,
    endTimestamp?: number,
    uid?: string,
  ) {
    let user: User | null = null;

    if (authUser.role === UserRoles.ADMIN) {
      user = await this.userRepository
        .createQueryBuilder('user')
        .where('user.uid = :uid', { uid: uid })
        .andWhere('user.deletedAt IS NULL')
        .andWhere('user.isActive = :isActive', { isActive: true })
        .getOne();

      if (!user) {
        throw new NotFoundException(
          this.i18n.t('exception.NOT_FOUND', { args: { property: 'User' } }),
        );
      }
    } else {
      user = authUser;
    }

    const userId = authUser.role === UserRoles.ADMIN ? user.id : authUser.id;

    // Build base WHERE
    let baseWhere = `userLogs.userId = :userId
    AND userLogs.checkedInAt IS NOT NULL
    AND userLogs.deletedAt IS NULL`;

    const params: { userId: number; start?: Date; end?: Date } = { userId };

    // Add date range filter if provided
    if (startTimestamp && endTimestamp) {
      baseWhere += `
        AND userLogs.checkedInAt BETWEEN :start AND :end`;
      params.start = moment(startTimestamp).toDate();
      params.end = moment(endTimestamp).toDate();
    }

    // Fetch distinct dates
    const rawDates = await this.userLogRepository
      .createQueryBuilder('userLogs')
      .leftJoin('userLogs.user', 'user')
      .select('DATE(userLogs.checkedInAt)', 'date')
      .where(baseWhere, params)
      .groupBy('DATE(userLogs.checkedInAt)')
      .orderBy('DATE(userLogs.checkedInAt)', 'DESC')
      .offset(count)
      .limit(limit)
      .getRawMany();

    const dates = rawDates.map(r => r.date);

    if (!dates.length) {
      return { groupedLogs: [], total: 0 };
    }

    // Fetch logs for those dates
    const userLogs = await this.userLogRepository
      .createQueryBuilder('userLogs')
      .where('userLogs.userId = :userId', { userId })
      .andWhere('DATE(userLogs.checkedInAt) IN (:...dates)', { dates })
      .andWhere('userLogs.deletedAt IS NULL')
      .orderBy('userLogs.checkedInAt', 'DESC')
      .getMany();

    // Group & calculate durations
    const grouped: Record<
      string,
      {
        date: string;
        totalSeconds: number;
        totalMinutes: number;
        totalHours: number;
        logs: UserLog[];
      }
    > = {};

    for (const log of userLogs) {
      const dateKey = this.getDateKey(
        moment(log.checkedInAt)
          .tz(authUser?.timeZone || timeZone)
          .toDate(),
      );
      const workedSeconds = this.calculateDuration(log);

      if (!grouped[dateKey]) {
        grouped[dateKey] = {
          date: dateKey,
          totalSeconds: 0,
          totalMinutes: 0,
          totalHours: 0,
          logs: [],
        };
      }

      grouped[dateKey].logs.push({
        ...log,
        checkedInAt: moment(log.checkedInAt)
          .tz(authUser?.timeZone || timeZone)
          .toDate(),
        checkedOutAt: log.checkedOutAt
          ? moment(log.checkedOutAt)
              .tz(authUser?.timeZone || timeZone)
              .toDate()
          : null,
      });

      grouped[dateKey].totalSeconds += workedSeconds;
      grouped[dateKey].totalMinutes += Number((workedSeconds / 60).toFixed(2));
      grouped[dateKey].totalHours += Number((workedSeconds / 3600).toFixed(2));
    }

    // Calculate attendance states like today's hours, this week's hours, etc.
    const { todayHours, thisWeekHours, thisWeekPayout, lastWeekPayout } =
      await this.calculateAttendanceStates(timeZone, userId);

    const totalResult = await this.userLogRepository
      .createQueryBuilder('userLogs')
      .select('COUNT(DISTINCT DATE(userLogs.checkedInAt))', 'total')
      .where(baseWhere, params)
      .getRawOne();

    const total = Number(totalResult?.total || 0);

    return {
      groupedLogs: Object.values(grouped),
      total,
      todayHours,
      thisWeekHours,
      thisWeekPayout,
      lastWeekPayout,
    };
  }

  /**
   * Get today's attendance logs
   * @param timeZone Time zone
   * @param count The number of records to skip
   * @param limit The limit of records to return
   * @param search The search query to filter the attendance logs
   * @returns Today's attendance logs and total
   */
  async getTodayAttendanceLogs(timeZone: string, count: number, limit: number, search?: string) {
    const normalizedSearch = search?.trim().toLowerCase();

    const startOfToday = moment().tz(timeZone).startOf('day').toDate();
    const endOfToday = moment().tz(timeZone).endOf('day').toDate();

    const queryBuilder = this.userLogRepository
      .createQueryBuilder('userLog')
      .innerJoin('userLog.user', 'user')
      .where('userLog.deletedAt IS NULL')
      .andWhere('userLog.checkedInAt BETWEEN :startOfToday AND :endOfToday', {
        startOfToday,
        endOfToday,
      })
      .select([
        'user.uid AS "userId"',
        'user.fullName AS "fullName"',
        'user.countryCode AS "countryCode"',
        'user.phone AS "phone"',
        'user.profilePicture AS "profilePicture"',
        'MIN("userLog"."checkedInAt") AS "firstCheckIn"',
        'MAX("userLog"."checkedOutAt") AS "lastCheckOut"',
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
      .groupBy('user.uid')
      .addGroupBy('user.fullName')
      .addGroupBy('user.countryCode')
      .addGroupBy('user.phone')
      .addGroupBy('user.profilePicture')
      .orderBy('"firstCheckIn"', 'ASC');

    if (normalizedSearch) {
      queryBuilder.andWhere(
        new Brackets(qb => {
          qb.where('LOWER(user.fullName) LIKE :search', {
            search: `%${normalizedSearch}%`,
          }).orWhere('LOWER(user.phone) LIKE :search', {
            search: `%${normalizedSearch}%`,
          });
        }),
      );
    }

    queryBuilder.offset(count).limit(limit);

    const userWiseAttendanceRows = await queryBuilder.getRawMany();

    let userIds: string[] = userWiseAttendanceRows.map(row => row.userId);
    userIds = [...new Set(userIds)];

    if (!userIds.length) {
      return {
        todayAttendanceLogs: [],
        total: 0,
      };
    }

    const userLogs = await this.userLogRepository
      .createQueryBuilder('userLog')
      .innerJoin('userLog.user', 'user')
      .addSelect(['user.uid'])
      .where('userLog.deletedAt IS NULL')
      .andWhere('user.uid IN (:...userIds)', { userIds })
      .andWhere('userLog.checkedInAt BETWEEN :startOfToday AND :endOfToday', {
        startOfToday,
        endOfToday,
      })
      .getMany();

    const logsByUser: Record<string, Partial<UserLog>[]> = {};

    for (const userLog of userLogs) {
      const uid = userLog.user.uid;

      if (!logsByUser[uid]) {
        logsByUser[uid] = [];
      }

      logsByUser[uid].push({
        ...userLog,
        user: undefined,
      });
    }

    const totalQb = await this.userLogRepository
      .createQueryBuilder('userLogs')
      .innerJoin('userLogs.user', 'user')
      .where('userLogs.deletedAt IS NULL')
      .andWhere('userLogs.checkedInAt BETWEEN :startOfToday AND :endOfToday', {
        startOfToday,
        endOfToday,
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
    const totalRows = Number(totalResult?.total || 0);

    if (!userWiseAttendanceRows || userWiseAttendanceRows.length === 0) {
      return {
        todayAttendanceLogs: [],
        total: 0,
      };
    }

    const result = {
      todayAttendanceLogs: userWiseAttendanceRows.map(row => {
        const userId = row.userId;
        const fullName = row.fullName;
        const countryCode = row.countryCode;
        const phone = row.phone;
        const profilePicture = row.profilePicture;
        const userLogs = logsByUser[userId] || [];
        const totalSeconds = row?.totalSeconds ? Number(row.totalSeconds) : 0;
        const totalMinutes = totalSeconds ? Number(totalSeconds) / 60 : 0;
        const totalHours = totalMinutes ? Number(totalMinutes) / 60 : 0;
        const attendanceStatus = userLogs.length > 0 ? this.getAttendanceStatus(userLogs) : null;

        return {
          userId,
          fullName,
          countryCode,
          phone,
          profilePicture,
          attendanceStatus,
          userLogs,
          totalHours,
          totalMinutes,
          totalSeconds,
        };
      }),
      total: totalRows || 0,
    };

    return result;
  }

  /**
   * Get attendance timestamps of all users
   * @param count The number of records to skip
   * @param limit The limit of records to return
   * @param startTimestamp The start timestamp to filter the attendance timestamps
   * @param endTimestamp The end timestamp to filter the attendance timestamps
   * @param isWeeklyView Whether the view is weekly or monthly
   * @param search The search query to filter the attendance timestamps
   * @returns The attendance timestamps
   */
  async getAttendanceTimestampsOfAllUsers(
    count: number,
    limit: number,
    startTimestamp: number,
    endTimestamp: number,
    isWeeklyView: boolean,
    search?: string,
  ) {
    const normalizedSearch = search?.trim().toLowerCase();

    isWeeklyView = String(isWeeklyView) === 'true';

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

    userIdsSubQuery.offset(count).limit(limit);

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

    const paginatedUsers = await userIdsSubQuery.getRawMany();

    let userIds: string[] = paginatedUsers.map(user => user.userId);
    userIds = [...new Set(userIds)];

    if (userIds.length === 0) {
      return {
        attendanceData: [],
        total: 0,
      };
    }

    const queryBuilder = await this.userLogRepository
      .createQueryBuilder('userLog')
      .innerJoin('userLog.user', 'user')
      .where('userLog.deletedAt IS NULL')
      .andWhere('userLog.checkedInAt BETWEEN :startTime AND :endTime', {
        startTime,
        endTime,
      })
      .andWhere('user.uid IN (:...userIds)', { userIds })
      .select([
        'user.uid AS "userId"',
        'user.fullName AS "fullName"',
        'user.countryCode AS "countryCode"',
        'user.phone AS "phone"',
        'user.profilePicture AS "profilePicture"',
        `DATE("userLog"."checkedInAt") AS "attendanceDate"`,
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
      .groupBy('user.uid')
      .addGroupBy('user.fullName')
      .addGroupBy('user.countryCode')
      .addGroupBy('user.phone')
      .addGroupBy('user.profilePicture')
      .addGroupBy(`DATE("userLog"."checkedInAt")`)
      .orderBy('"attendanceDate"', 'ASC');

    const userAndDateWiseAttendanceRows = await queryBuilder.getRawMany();

    const attendanceMap: Record<
      string,
      {
        userId: string;
        fullName: string;
        countryCode: string;
        phone: string;
        profilePicture: string;
        dailyAttendance: {
          date: Moment;
          durationInHours: number | null;
          durationInMinutes: number | null;
          durationInSeconds: number | null;
        }[];
        weeklyAttendance?: {
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
      }
    > = {};

    for (const row of userAndDateWiseAttendanceRows) {
      const durationInHours = row.totalSeconds / 3600;
      const durationInMinutes = Math.floor(row.totalSeconds / 60);
      const durationInSeconds = Math.floor(row.totalSeconds);

      if (!attendanceMap[row.userId]) {
        attendanceMap[row.userId] = {
          userId: row.userId,
          fullName: row.fullName,
          countryCode: row.countryCode,
          phone: row.phone,
          profilePicture: row.profilePicture,
          dailyAttendance: [],
          totalDurationInHours: 0,
          totalDurationInMinutes: 0,
          totalDurationInSeconds: 0,
        };
      }

      attendanceMap[row.userId].dailyAttendance.push({
        date: moment(row.attendanceDate),
        durationInHours,
        durationInMinutes,
        durationInSeconds,
      });

      attendanceMap[row.userId].totalDurationInHours += durationInHours;
      attendanceMap[row.userId].totalDurationInMinutes += durationInMinutes;
      attendanceMap[row.userId].totalDurationInSeconds += durationInSeconds;

      attendanceMap[row.userId].weeklyAttendance = [];
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
      const filledDailyAttendance: typeof userData.dailyAttendance = [];
      const dailyAttendance = userData.dailyAttendance;

      // get all the dates from dailyAttendance array
      const dates = dailyAttendance.map(day => day.date);

      while (dateKey.isSameOrBefore(endDate, 'day')) {
        const existingDay = dates.find(date => date.isSame(dateKey, 'day'));

        if (existingDay) {
          filledDailyAttendance.push(
            ...dailyAttendance.filter(day => day.date.isSame(dateKey, 'day')),
          );
        } else {
          filledDailyAttendance.push({
            date: dateKey.clone(),
            durationInHours: null,
            durationInMinutes: null,
            durationInSeconds: null,
          });
        }

        dateKey.add(1, 'day');
      }

      // replace dailyAttendance with filledDailyAttendance
      userData.dailyAttendance = filledDailyAttendance;
      dateKey = startDate.clone();

      // reset dateKey to startDate for next user data
      // dateKey = startDate;
    }

    if (isWeeklyView) {
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

        if (userData.dailyAttendance.length > 0) {
          for (const day of userData.dailyAttendance) {
            const { weekRange, weekStartDate, weekEndDate } = this.getWeekRangeLabel(
              day.date.clone(),
            );

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

            weeklyMap[weekRange].durationInHours += day.durationInHours || 0;
            weeklyMap[weekRange].durationInMinutes += day.durationInMinutes || 0;
            weeklyMap[weekRange].durationInSeconds += day.durationInSeconds || 0;
          }

          // Replace dailyAttendance with weeklyAttendance
          userData.weeklyAttendance = Object.values(weeklyMap);

          // Fill missing week ranges with null duration ---------------------------------------------

          // initialize the array to store the filled weekly attendance
          const newWeeklyAttendance: typeof userData.weeklyAttendance = [];

          // loop through each week of weekWiseAttendance array
          for (const week of userData.weeklyAttendance) {
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
              const durationInSeconds = userData.dailyAttendance.find(day =>
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
              newWeeklyAttendance.push({
                weekRange,
                weekStartDate,
                weekEndDate,
                durationInHours: null,
                durationInMinutes: null,
                durationInSeconds: null,
              });
              continue;
            }

            // otherwise push it to newWeeklyAttendance array with same duration
            newWeeklyAttendance.push(week);
          }

          // replace weeklyAttendance with newWeeklyAttendance
          userData.weeklyAttendance = newWeeklyAttendance;
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

    return { attendanceData, total, isWeeklyView };
  }

  async getAttendanceTimestampsOfAllUsersV2(
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
      return { attendanceData: [], total: 0 };
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
        'user.countryCode AS "countryCode"',
        'user.phone AS "phone"',
        'user.profilePicture AS "profilePicture"',
        `DATE("userLog"."checkedInAt") AS "attendanceDate"`,
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
      .groupBy('user.uid')
      .addGroupBy('user.fullName')
      .addGroupBy('user.countryCode')
      .addGroupBy('user.phone')
      .addGroupBy('user.profilePicture')
      .addGroupBy(`DATE("userLog"."checkedInAt")`)
      .orderBy('"attendanceDate"', 'ASC');

    const rows = await logsQb.getRawMany();

    if (!rows.length) {
      return { attendanceData: [], total };
    }

    /* -------------------------------------------
            BUILD MAP
        --------------------------------------------*/
    const attendanceMap: Record<
      string,
      {
        userId: string;
        fullName: string;
        countryCode: string;
        phone: string;
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
      }
    > = {};

    for (const row of rows) {
      const userId = row.userId;

      const totalSeconds = Number(row.totalSeconds || 0);

      const hours = totalSeconds / 3600;

      if (!attendanceMap[userId]) {
        attendanceMap[userId] = {
          userId,
          fullName: row.fullName,
          countryCode: row.countryCode,
          phone: row.phone,
          profilePicture: row.profilePicture,
          attendance: [],
          totalDurationInHours: 0,
          totalDurationInMinutes: 0,
          totalDurationInSeconds: 0,
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

    return { attendanceData, total };
  }

  private getAttendanceStatus(userLogs: Partial<UserLog>[]): AttendanceStatus {
    const hasAnyClockIn = userLogs.some(log => log.status === AttendanceStatus.CLOCKED_IN);
    return hasAnyClockIn ? AttendanceStatus.CLOCKED_IN : AttendanceStatus.CLOCKED_OUT;
  }

  /**
   * Get the date key for a given date
   * @param date The date to get the key for
   * @returns The date key in YYYY-MM-DD format
   */
  getDateKey(date: Date): string {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
  }

  /**
   * Calculate the duration of a user log in seconds
   * @param log The user log to calculate the duration for
   * @returns The duration in seconds
   */
  calculateDuration(log: UserLog): number {
    const end = log?.checkedOutAt ? moment(log.checkedOutAt).toDate() : moment().toDate();
    const start = moment(log.checkedInAt).toDate();
    return Math.floor((end.getTime() - start.getTime()) / 1000);
  }

  /**
   * Calculate the attendance states for a user
   * @param userId The user ID to calculate the attendance states for
   * @returns The attendance states
   */
  async calculateAttendanceStates(timeZone: string, userId: number) {
    let todayHours = 0;
    let thisWeekHours = 0;
    let thisWeekPayout = 0;
    let lastWeekPayout = 0;

    const startOfToday = moment().tz(timeZone).startOf('day').toDate();
    const endOfToday = moment().tz(timeZone).endOf('day').toDate();

    // In Ops Pilot system, Working week is Friday to Thursday
    const now = moment().tz(timeZone)

    // 5 = Friday
    const startOfWeek = now.clone().day(5).startOf('day');

    // If today is before Friday, go back 1 week
    if (now.day() < 5) {
      startOfWeek.subtract(7, 'days');
    }

    const endOfWeek = startOfWeek.clone().add(6, 'days').endOf('day');

    // Calculating last week's start and end dates
    const startOfLastWeek = startOfWeek.clone().subtract(7, 'days');
    const endOfLastWeek = startOfLastWeek.clone().add(6, 'days').endOf('day');

    // 1. Calculating today's logged hours
    const todayLogs = await this.userLogRepository
      .createQueryBuilder('userLog')
      .where('userLog.userId = :userId', { userId })
      .andWhere('userLog.deletedAt IS NULL')
      .andWhere('userLog.checkedInAt IS NOT NULL')
      .andWhere('userLog.checkedInAt BETWEEN :startOfToday AND :endOfToday', {
        startOfToday,
        endOfToday,
      })
      .getMany();

    const todayDurationInSeconds = todayLogs.reduce(
      (acc, log) => acc + this.calculateDuration(log),
      0,
    );
    todayHours = Number((todayDurationInSeconds / 3600).toFixed(1));

    // 2. Calculating this week's logged hours
    const thisWeekLogs = await this.userLogRepository
      .createQueryBuilder('userLog')
      .where('userLog.userId = :userId', { userId })
      .andWhere('userLog.deletedAt IS NULL')
      .andWhere('userLog.checkedInAt IS NOT NULL')
      .andWhere('userLog.checkedInAt BETWEEN :startOfWeek AND :endOfWeek', {
        startOfWeek,
        endOfWeek,
      })
      .getMany();

    const thisWeekDurationInSeconds = thisWeekLogs.reduce(
      (acc, log) => acc + this.calculateDuration(log),
      0,
    );
    thisWeekHours = Number((thisWeekDurationInSeconds / 3600).toFixed(1));

    // 3. Calculating this week's payout amount
    const thisWeeksLogsWithPayout = await this.userLogRepository
      .createQueryBuilder('userLog')
      .leftJoinAndSelect('userLog.payout', 'payout')
      .where('userLog.userId = :userId', { userId })
      .andWhere('userLog.deletedAt IS NULL')
      .andWhere('userLog.checkedInAt IS NOT NULL')
      .andWhere('userLog.payoutId IS NOT NULL')
      .andWhere('userLog.checkedInAt BETWEEN :startOfWeek AND :endOfWeek', {
        startOfWeek,
        endOfWeek,
      })
      .getMany();

    const thisWeeksPayoutIds = thisWeeksLogsWithPayout.length
      ? Array.from(new Set(thisWeeksLogsWithPayout.map(log => log?.payout?.id))).filter(
          id => id !== null,
        )
      : [];

    if (thisWeeksPayoutIds.length > 0) {
      const thisWeeksPayoutAmount = await this.payoutRepository
        .createQueryBuilder('payout')
        .select('SUM(payout.paidAmount)', 'totalPayoutAmount')
        .where('payout.deletedAt IS NULL')
        .andWhere('payout.id IN (:...thisWeeksPayoutIds)', { thisWeeksPayoutIds })
        .getRawOne();

      thisWeekPayout = Number(Number(thisWeeksPayoutAmount?.totalPayoutAmount || 0).toFixed(2));
    }

    // 4. Calculating last week's payout amount
    const lastWeeksLogsWithPayout = await this.userLogRepository
      .createQueryBuilder('userLog')
      .leftJoinAndSelect('userLog.payout', 'payout')
      .where('userLog.userId = :userId', { userId })
      .andWhere('userLog.deletedAt IS NULL')
      .andWhere('userLog.checkedInAt IS NOT NULL')
      .andWhere('userLog.payoutId IS NOT NULL')
      .andWhere('userLog.checkedInAt BETWEEN :startOfLastWeek AND :endOfLastWeek', {
        startOfLastWeek,
        endOfLastWeek,
      })
      .getMany();

    const lastWeeksPayoutIds = lastWeeksLogsWithPayout.length
      ? Array.from(new Set(lastWeeksLogsWithPayout.map(log => log?.payout?.id))).filter(
          id => id !== null,
        )
      : [];

    if (lastWeeksPayoutIds.length > 0) {
      const lastWeeksPayoutAmount = await this.payoutRepository
        .createQueryBuilder('payout')
        .select('SUM(payout.paidAmount)', 'totalPayoutAmount')
        .where('payout.deletedAt IS NULL')
        .andWhere('payout.id IN (:...lastWeeksPayoutIds)', { lastWeeksPayoutIds })
        .getRawOne();

      lastWeekPayout = Number(Number(lastWeeksPayoutAmount?.totalPayoutAmount || 0).toFixed(2));
    }

    return {
      todayHours: todayHours || 0,
      thisWeekHours: thisWeekHours || 0,
      thisWeekPayout: thisWeekPayout || 0,
      lastWeekPayout: lastWeekPayout || 0,
    };
  }

  /**
   * Get the start of the week (Friday) for a given Moment object
   * @param date The date to calculate the week start for
   * @returns The start of the week (friday) as a Moment object
   */
  getWeekStartFriday(date: moment.Moment): moment.Moment {
    const momentDate = moment(date);
    // 1 - Mon, 2 - Tue, 3 - Wed, 4 - Thu, 5 - Fri, 6 - Sat, 7 - Sun
    const day = momentDate.isoWeekday();
    const diff = day >= 5 ? day - 5 : day + 2; // Friday = 5

    return date.clone().subtract(diff, 'days').startOf('day');
  }

  /**
   * Get the week range label for a given date
   * @param date The date to calculate the week range for
   * @returns The week range label (e.g., "2025-10-17 → 2025-10-23")
   */
  getWeekRangeLabel(date: moment.Moment): {
    weekRange: string;
    weekStartDate: moment.Moment;
    weekEndDate: moment.Moment;
  } {
    const m = moment(date);
    const start = this.getWeekStartFriday(m);
    const end = start.clone().add(6, 'days');

    return {
      weekRange: `${start.format('YYYY-MM-DD')} - ${end.format('YYYY-MM-DD')}`,
      weekStartDate: moment(start),
      weekEndDate: moment(end),
    };
  }
}
