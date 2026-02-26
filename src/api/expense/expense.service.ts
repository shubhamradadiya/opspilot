import { ForbiddenException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Expense } from './entity/expense.entity';
import { Brackets, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UserRoles } from 'src/constants/user.constant';
import { I18nService } from 'nestjs-i18n';
import { generateUniqueId } from 'src/helpers/utils.helper';
import moment from 'moment-timezone';
import { ExpenseType } from 'src/constants/app.constant';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,

    private readonly userService: UserService,

    private readonly i18n: I18nService,
  ) {}

  /**
   * Create a new expense
   * @param authUser Authenticated user
   * @param createExpenseDto Expense data
   * @returns Created expense
   */
  async createExpense(authUser: User, createExpenseDto: CreateExpenseDto) {
    // Check if user has the permission to access expense
    if (authUser.role === UserRoles.USER && !authUser.isExpenseEnabled) {
      throw new ForbiddenException(
        this.i18n.t('exception.USER_PERMISSION_DENIED', { args: { property: 'Expense' } }),
      );
    }

    let vendor: User | null = null;

    if (createExpenseDto?.vendorId) {
      vendor = await this.userService.findByUid(createExpenseDto.vendorId);
      if (!vendor) {
        throw new NotFoundException(
          this.i18n.t('exception.NOT_FOUND', { args: { property: 'Vendor user' } }),
        );
      }
    }

    const expenseObject = this.expenseRepository.create({
      eId: generateUniqueId('E'),
      user: { id: authUser.id },
      ...(vendor && { vendor: { id: vendor.id } }),
      expenseDate: moment(createExpenseDto.expenseDate).toDate(),
      vendorName: createExpenseDto.vendorName,
      totalExpense: Number(createExpenseDto.totalExpense || 0),
      description: createExpenseDto?.description,
      expenseType: createExpenseDto?.expenseType ?? ExpenseType.MANUAL,
    });

    const expense = await this.expenseRepository.save(expenseObject);

    return await this.getDetailedExpenseByEid(expense.eId);
  }

  /**
   * Get all expenses
   * @param authUser Authenticated user
   * @param count The number of records to skip
   * @param limit The limit of records to return
   * @param startTimestamp The start timestamp to filter the expense timestamps
   * @param endTimestamp The end timestamp to filter the expense timestamps
   * @param search The search query
   * @returns The expenses and total count
   */
  async getAllExpenses(
    authUser: User,
    count: number,
    limit: number,
    startTimestamp?: number,
    endTimestamp?: number,
    search?: string,
  ) {
    // Check if user has the permission to access expense
    if (authUser.role === UserRoles.USER && !authUser.isExpenseEnabled) {
      throw new ForbiddenException(
        this.i18n.t('exception.USER_PERMISSION_DENIED', { args: { property: 'Expense' } }),
      );
    }

    const normalizedSearch = search?.trim().toLowerCase();
    const numericSearch = Number(normalizedSearch);

    const hasDateFilter =
      startTimestamp && endTimestamp && startTimestamp !== null && endTimestamp !== null;

    const expenseQb = this.expenseRepository
      .createQueryBuilder('expense')
      .leftJoinAndSelect('expense.user', 'user')
      .leftJoinAndSelect('expense.vendor', 'vendor')
      .where('expense.deletedAt IS NULL');

    if (hasDateFilter) {
      expenseQb.andWhere('expense.expenseDate BETWEEN :startDate AND :endDate', {
        startDate: moment(startTimestamp).toDate(),
        endDate: moment(endTimestamp).toDate(),
      });
    }

    if (normalizedSearch) {
      expenseQb.andWhere(
        new Brackets(qb => {
          qb.where('LOWER(expense.vendorName) LIKE :search', {
            search: `%${normalizedSearch}%`,
          })
            .orWhere('LOWER(expense.description) LIKE :search', {
              search: `%${normalizedSearch}%`,
            })
            .orWhere('LOWER(expense."expenseType"::text) LIKE :search', {
              search: `%${normalizedSearch}%`,
            })
            .orWhere(`to_char(expense."expenseDate", 'YYYY-MM-DD') LIKE :search`, {
              search: `%${normalizedSearch}%`,
            });

          if (!isNaN(numericSearch)) {
            qb.orWhere('expense.totalExpense = :totalExpense', {
              totalExpense: numericSearch,
            });
          }
        }),
      );
    }

    const [expenses, total] = await expenseQb
      .orderBy('expense.createdAt', 'DESC')
      .skip(count)
      .take(limit)
      .getManyAndCount();

    for (const expense of expenses) {
      const vendor = expense?.vendor;
      const expenseDate = moment(expense.expenseDate).format('YYYY-MM-DD');
      const expenseType = expense.expenseType;
      const vendorName = vendor?.fullName;
      const totalExpense = expense.totalExpense;

      if (expense.description?.trim()) {
        continue;
      }

      switch (expenseType) {
        case ExpenseType.PAYOUT:
          expense.description = vendorName
            ? `Payout to ${vendorName} on ${expenseDate} — $${totalExpense}`
            : `Payout on ${expenseDate} — $${totalExpense}`;
          break;

        default:
          expense.description = `Expense recorded on ${expenseDate} — $${totalExpense}`;
          break;
      }
    }

    // Total expense from all the expenses data
    const totalExpenseResult = await this.expenseRepository
      .createQueryBuilder('expense')
      .select('SUM(expense.totalExpense)', 'totalExpense')
      .where('expense.deletedAt IS NULL')
      .getRawOne();

    const totalExpense = Number(totalExpenseResult?.totalExpense || 0);

    return { expenses, total, totalExpense };
  }

  /**
   * Update an existing expense
   * @param authUser Authenticated user
   * @param eId The expense ID
   * @param updateExpenseDto Expense data
   * @returns Updated expense
   */
  async updateExpense(authUser: User, eId: string, updateExpenseDto: UpdateExpenseDto) {
    // Check if user has the permission to access expense
    if (authUser.role === UserRoles.USER && !authUser.isExpenseEnabled) {
      throw new ForbiddenException(
        this.i18n.t('exception.USER_PERMISSION_DENIED', { args: { property: 'Expense' } }),
      );
    }

    const existingExpense = await this.getExpenseByEid(eId);

    if (!existingExpense) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND', { args: { property: 'Expense' } }),
      );
    }

    if (updateExpenseDto.vendorId) {
      const vendor = await this.userService.findByUid(updateExpenseDto.vendorId);
      if (!vendor) {
        throw new NotFoundException(
          this.i18n.t('exception.NOT_FOUND', { args: { property: 'Vendor user' } }),
        );
      }
      existingExpense.vendor = vendor;
    }

    const expenseDate = updateExpenseDto.expenseDate
      ? moment(updateExpenseDto.expenseDate).toDate()
      : existingExpense.expenseDate;

    Object.assign(existingExpense, {
      expenseDate,
      vendorName: updateExpenseDto.vendorName ?? existingExpense.vendorName,
      totalExpense: updateExpenseDto.totalExpense ?? existingExpense.totalExpense,
      description: updateExpenseDto?.description ?? existingExpense.description,
      expenseType: updateExpenseDto?.expenseType ?? existingExpense.expenseType,
    });

    const updatedExpense = await this.expenseRepository.save(existingExpense);

    return await this.getDetailedExpenseByEid(updatedExpense.eId);
  }

  /**
   * Delete an existing expense
   * @param authUser Authenticated user
   * @param eId The expense ID
   * @returns The deleted expense
   */
  async deleteExpense(authUser: User, eId: string) {
    // Check if user has the permission to access expense
    if (authUser.role === UserRoles.USER && !authUser.isExpenseEnabled) {
      throw new ForbiddenException(
        this.i18n.t('exception.USER_PERMISSION_DENIED', { args: { property: 'Expense' } }),
      );
    }

    const existingExpense = await this.getExpenseByEid(eId);

    if (!existingExpense) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND', { args: { property: 'Expense' } }),
      );
    }

    await this.expenseRepository.softDelete({ eId: existingExpense.eId });

    return {
      statusCode: HttpStatus.OK,
      message: this.i18n.t('translate.DELETED', { args: { property: 'Expense' } }),
    };
  }

  /**
   * Get vendor names for expense
   * @param count The number of records to skip
   * @param limit The limit of records to return
   * @param search The search query
   * @returns The vendor names
   */
  async vendorNamesForExpense(count: number, limit: number, search?: string) {
    const normalizedSearch = search?.trim();

    const baseQb = this.expenseRepository
      .createQueryBuilder('expense')
      .select(['expense.vendorName AS name'])
      .distinct(true)
      .where('expense.deletedAt IS NULL')
      .andWhere('expense.vendorName IS NOT NULL')
      .andWhere("TRIM(expense.vendorName) <> ''");

    if (normalizedSearch) {
      baseQb.andWhere('expense.vendorName ILIKE :search', { search: `%${normalizedSearch}%` });
      baseQb.addSelect('CASE WHEN expense.vendorName ILIKE :startsWith THEN 0 ELSE 1 END', 'rank');
    }

    const vendorsQb = await baseQb
      .clone()
      .orderBy(normalizedSearch ? 'rank' : 'expense.vendorName', 'ASC')
      .addOrderBy('expense.vendorName', 'ASC');

    if (normalizedSearch) {
      vendorsQb.setParameters({
        search: `%${normalizedSearch}%`,
        startsWith: `${normalizedSearch}%`,
      });
    }

    const vendors = await vendorsQb.skip(count).take(limit).getRawMany();

    const vendorsNames = vendors && vendors.length > 0 ? vendors.map(vendor => vendor.name) : [];

    const totalResult = await baseQb
      .clone()
      .select('COUNT(DISTINCT expense.vendorName)', 'total')
      .getRawOne();

    const total = Number(totalResult?.total || 0);

    return { vendorsNames, total };
  }

  /**
   * Get detailed expense by eId
   * @param eId Expense ID
   * @returns Expense with user details or null
   */
  async getDetailedExpenseByEid(eId: string): Promise<Expense | null> {
    return await this.expenseRepository
      .createQueryBuilder('expense')
      .leftJoinAndSelect('expense.user', 'user')
      .where('expense.deletedAt IS NULL')
      .andWhere('expense.eId = :eId', { eId })
      .getOne();
  }

  /**
   * Get expense by eId
   * @param eId Expense ID
   * @returns Expense details or null
   */
  async getExpenseByEid(eId: string): Promise<Expense | null> {
    return await this.expenseRepository
      .createQueryBuilder('expense')
      .where('expense.deletedAt IS NULL')
      .andWhere('expense.eId = :eId', { eId })
      .getOne();
  }
}
