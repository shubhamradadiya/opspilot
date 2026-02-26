import { ForbiddenException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RingCustomer } from './entity/ring-customer.entity';
import { Brackets, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { CreateRingCustomerDto } from './dto/create-ring-customer.dto';
import { RingCustomerStatus, UserRoles } from 'src/constants/user.constant';
import { I18nService } from 'nestjs-i18n';
import { generateUniqueId } from 'src/helpers/utils.helper';
import moment from 'moment-timezone';
import { UpdateRingCustomerDto } from './dto/update-ring-customer.dto';

@Injectable()
export class RingCustomerService {
  constructor(
    @InjectRepository(RingCustomer)
    private readonly ringCustomerRepository: Repository<RingCustomer>,

    private readonly i18n: I18nService,
  ) {}

  /**
   * Create a new ring customer
   * @param authUser Authenticated user
   * @param createRingCustomerDto Ring customer data
   * @returns Created ring customer
   */
  async createRingCustomer(authUser: User, createRingCustomerDto: CreateRingCustomerDto) {
    // Check if user has the permission to access ring customer
    if (authUser.role === UserRoles.USER && !authUser.isRingCustomerEnabled) {
      throw new ForbiddenException(
        this.i18n.t('exception.USER_PERMISSION_DENIED', { args: { property: 'Ring customer' } }),
      );
    }

    // Calculate total amount from ordered ring count, price and delivery fee (delivery fee is optional)
    const orderedRingCount = Number(createRingCustomerDto.orderedRingCount || 0);
    const price = Number(createRingCustomerDto.price || 0);
    const deliveryFee = Number(createRingCustomerDto?.deliveryFee || 0);

    const totalAmount = orderedRingCount * price + deliveryFee;

    const ringCustomerObject = this.ringCustomerRepository.create({
      rcId: generateUniqueId('RC'),
      ringCustomerDate: moment(createRingCustomerDto.ringCustomerDate).toDate(),
      customerName: createRingCustomerDto.customerName,
      orderedRingCount: Number(createRingCustomerDto.orderedRingCount || 0),
      price: Number(createRingCustomerDto.price || 0),
      deliveryFee: Number(createRingCustomerDto?.deliveryFee || 0),
      totalAmount: Number(totalAmount || 0),
      status: createRingCustomerDto?.status ?? RingCustomerStatus.PENDING,
      user: { id: authUser.id },
    });

    const ringCustomer = await this.ringCustomerRepository.save(ringCustomerObject);

    return await this.findDetailedRingCustomerByRcId(ringCustomer.rcId);
  }

  /**
   * Update an existing ring customer
   * @param authUser Authenticated user
   * @param rcId The ring customer ID
   * @param updateRingCustomerDto Ring customer data
   * @returns Updated ring customer
   */
  async updateRingCustomer(
    authUser: User,
    rcId: string,
    updateRingCustomerDto: UpdateRingCustomerDto,
  ) {
    // Check if user has the permission to access ring customer
    if (authUser.role === UserRoles.USER && !authUser.isRingCustomerEnabled) {
      throw new ForbiddenException(
        this.i18n.t('exception.USER_PERMISSION_DENIED', { args: { property: 'Ring customer' } }),
      );
    }

    const existingRingCustomer = await this.findRingCustomerByRcId(rcId);

    if (!existingRingCustomer) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND', { args: { property: 'Ring customer' } }),
      );
    }

    const ringCustomerDate = updateRingCustomerDto.ringCustomerDate
      ? moment(updateRingCustomerDto.ringCustomerDate).toDate()
      : existingRingCustomer.ringCustomerDate;

    // Calculate total amount from ordered ring count, price and delivery fee (delivery fee is optional)
    const orderedRingCount =
      updateRingCustomerDto.orderedRingCount ?? existingRingCustomer.orderedRingCount;
    const price = updateRingCustomerDto.price ?? existingRingCustomer.price;
    const deliveryFee = updateRingCustomerDto.deliveryFee ?? existingRingCustomer.deliveryFee ?? 0;

    const totalAmount = Number(orderedRingCount) * Number(price) + Number(deliveryFee);

    const updatedRingCustomerObject = {
      ringCustomerDate,
      customerName: updateRingCustomerDto.customerName ?? existingRingCustomer.customerName,
      orderedRingCount,
      price,
      deliveryFee,
      totalAmount,
      status: updateRingCustomerDto.status ?? existingRingCustomer.status,
    };

    Object.assign(existingRingCustomer, updatedRingCustomerObject);

    const updatedRingCustomer = await this.ringCustomerRepository.save(existingRingCustomer);

    return await this.findDetailedRingCustomerByRcId(updatedRingCustomer.rcId);
  }

  /**
   * Delete a ring customer
   * @param authUser Authenticated user
   * @param rcId The ring customer ID
   * @returns The deleted ring customer
   */
  async deleteRingCustomer(authUser: User, rcId: string) {
    // Check if user has the permission to access ring customer
    if (authUser.role === UserRoles.USER && !authUser.isRingCustomerEnabled) {
      throw new ForbiddenException(
        this.i18n.t('exception.USER_PERMISSION_DENIED', { args: { property: 'Ring customer' } }),
      );
    }

    const existingRingCustomer = await this.findRingCustomerByRcId(rcId);

    if (!existingRingCustomer) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND', { args: { property: 'Ring customer' } }),
      );
    }

    await this.ringCustomerRepository.softDelete({ rcId });

    return {
      statusCode: HttpStatus.OK,
      message: this.i18n.t('translate.DELETED', { args: { property: 'Ring customer' } }),
    };
  }

  /**
   * Get all ring customers
   * @param authUser Authenticated user
   * @param count The number of records to skip
   * @param limit The limit of records to return
   * @param startTimestamp The start timestamp to filter ring customer timestamps
   * @param endTimestamp The end timestamp to filter ring customer timestamps
   * @param search The search query
   * @returns The ring customers and total count
   */
  async getAllRingCustomers(
    authUser: User,
    count: number,
    limit: number,
    startTimestamp?: number,
    endTimestamp?: number,
    search?: string,
  ) {
    // Check if user has the permission to access expense
    if (authUser.role === UserRoles.USER && !authUser.isRingCustomerEnabled) {
      throw new ForbiddenException(
        this.i18n.t('exception.USER_PERMISSION_DENIED', { args: { property: 'Ring customer' } }),
      );
    }

    const normalizedSearch = search?.trim().toLowerCase();
    const numericSearch = Number(normalizedSearch);

    const hasDateFilter =
      startTimestamp && endTimestamp && startTimestamp !== null && endTimestamp !== null;

    const ringCustomerQb = this.ringCustomerRepository
      .createQueryBuilder('ringCustomer')
      .leftJoinAndSelect('ringCustomer.user', 'user')
      .where('ringCustomer.deletedAt IS NULL');

    if (hasDateFilter) {
      ringCustomerQb.andWhere('ringCustomer.ringCustomerDate BETWEEN :startDate AND :endDate', {
        startDate: moment(startTimestamp).toDate(),
        endDate: moment(endTimestamp).toDate(),
      });
    }

    if (normalizedSearch) {
      ringCustomerQb.andWhere(
        new Brackets(qb => {
          qb.where('"ringCustomer"."customerName" ILIKE :search', {
            search: `%${normalizedSearch}%`,
          })
            .orWhere('"ringCustomer"."status"::text ILIKE :search', {
              search: `%${normalizedSearch}%`,
            })
            .orWhere(`to_char("ringCustomer"."ringCustomerDate", 'YYYY-MM-DD') LIKE :search`, {
              search: `%${normalizedSearch}%`,
            });

          if (!isNaN(numericSearch)) {
            qb.orWhere('"ringCustomer"."orderedRingCount" = :orderedRingCount', {
              orderedRingCount: numericSearch,
            })
              .orWhere('"ringCustomer"."price" = :price', { price: numericSearch })
              .orWhere('"ringCustomer"."deliveryFee" = :deliveryFee', {
                deliveryFee: numericSearch,
              })
              .orWhere('"ringCustomer"."totalAmount" = :totalAmount', {
                totalAmount: numericSearch,
              });
          }
        }),
      );
    }

    const [ringCustomers, total] = await ringCustomerQb
      .orderBy('ringCustomer.createdAt', 'DESC')
      .skip(count)
      .take(limit)
      .getManyAndCount();

    // Total amount from all the ring customers data
    const totalAmountResult = await this.ringCustomerRepository
      .createQueryBuilder('ringCustomer')
      .where('ringCustomer.deletedAt IS NULL')
      .select('SUM(ringCustomer.totalAmount)', 'totalAmount')
      .getRawOne();

    const totalAmount = Number(totalAmountResult?.totalAmount || 0);

    return { ringCustomers, total, totalAmount };
  }

  /**
   * Get customer names for ring customer
   * @param count The number of records to skip
   * @param limit The limit of records to return
   * @param search The search query
   * @returns The customer names
   */
  async customerNamesForRingCustomer(count: number, limit: number, search?: string) {
    const normalizedSearch = search?.trim();

    const baseQb = this.ringCustomerRepository
      .createQueryBuilder('ringCustomer')
      .select(['ringCustomer.customerName AS name'])
      .distinct(true)
      .where('ringCustomer.deletedAt IS NULL')
      .andWhere('ringCustomer.customerName IS NOT NULL')
      .andWhere("TRIM(ringCustomer.customerName) <> ''");

    if (normalizedSearch) {
      baseQb.andWhere('ringCustomer.customerName ILIKE :search', {
        search: `%${normalizedSearch}%`,
      });
      baseQb.addSelect(
        'CASE WHEN ringCustomer.customerName ILIKE :startsWith THEN 0 ELSE 1 END',
        'rank',
      );
    }

    const customersQb = await baseQb
      .clone()
      .orderBy(normalizedSearch ? 'rank' : 'ringCustomer.customerName', 'ASC')
      .addOrderBy('ringCustomer.customerName', 'ASC');

    if (normalizedSearch) {
      customersQb.setParameters({
        search: `%${normalizedSearch}%`,
        startsWith: `${normalizedSearch}%`,
      });
    }

    const customers = await customersQb.skip(count).take(limit).getRawMany();

    const customerNames =
      customers && customers.length > 0 ? customers.map(customer => customer.name) : [];

    const totalResult = await baseQb
      .clone()
      .select('COUNT(DISTINCT ringCustomer.customerName)', 'total')
      .getRawOne();

    const total = Number(totalResult?.total || 0);

    return { customerNames, total };
  }

  /**
   * Get ring customer by rcId
   * @param rcId The ring customer ID
   * @returns The ring customer
   */
  async findRingCustomerByRcId(rcId: string) {
    return await this.ringCustomerRepository
      .createQueryBuilder('ringCustomer')
      .where('ringCustomer.deletedAt IS NULL')
      .andWhere('ringCustomer.rcId = :rcId', { rcId })
      .getOne();
  }

  /**
   * Get detailed ring customer by rcId
   * @param rcId The ring customer ID
   * @returns The detailed ring customer
   */
  async findDetailedRingCustomerByRcId(rcId: string) {
    return await this.ringCustomerRepository
      .createQueryBuilder('ringCustomer')
      .leftJoinAndSelect('ringCustomer.user', 'user')
      .where('ringCustomer.deletedAt IS NULL')
      .andWhere('ringCustomer.rcId = :rcId', { rcId })
      .getOne();
  }
}
