import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WalkInCustomer } from './entity/walk-in-customer.entity';
import { Brackets, In, Repository } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { CreateWalkInCustomerDto } from './dto/create-walk-in-customer.dto';
import { User } from '../user/entities/user.entity';
import { UserRoles, WalkInCustomerStatus } from 'src/constants/user.constant';
import moment from 'moment-timezone';
import { generateUniqueId } from 'src/helpers/utils.helper';
import { UpdateWalkInCustomerDto } from './dto/update-walk-in-customer.dto';
import { CalenderSlotTypes } from 'src/constants/app.constant';
import * as fs from 'fs';
import * as path from 'path';
import * as cheerio from 'cheerio';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WalkInCustomerService {
  constructor(
    @InjectRepository(WalkInCustomer)
    private readonly walkInCustomerRepository: Repository<WalkInCustomer>,

    private readonly i18n: I18nService,

    private readonly configService: ConfigService,
  ) {}

  /**
   * Create walk-in customer
   * @param authUser Authenticated user
   * @param createWalkInCustomerDto Create walk-in customer DTO
   * @returns The created walk-in customer
   */
  async createWalkInCustomer(authUser: User, createWalkInCustomerDto: CreateWalkInCustomerDto) {
    // Check if user has the permission to access walk-in customer
    if (authUser.role === UserRoles.USER && !authUser.isWalkInCustomerEnabled) {
      throw new ForbiddenException(
        this.i18n.t('exception.USER_PERMISSION_DENIED', { args: { property: 'Walk-in customer' } }),
      );
    }

    const {
      walkInCustomerDate,
      customerName,
      carTiresCount,
      carTiresPrice,
      truckTiresCount,
      truckTiresPrice,
      rimsCount,
      rimsPrice,
      totalAmount,
      status,
    } = createWalkInCustomerDto;

    const hasCarTires =
      carTiresCount != null &&
      carTiresCount != undefined &&
      carTiresPrice != null &&
      carTiresPrice != undefined;
    const hasTruckTires =
      truckTiresCount != null &&
      truckTiresCount != undefined &&
      truckTiresPrice != null &&
      truckTiresPrice != undefined;
    const hasRims =
      rimsCount != null && rimsCount != undefined && rimsPrice != null && rimsPrice != undefined;

    if (!hasCarTires && !hasTruckTires && !hasRims) {
      throw new BadRequestException(this.i18n.t('exception.INVALID_WALK_IN_CUSTOMER_INPUT'));
    }

    const walkInCustomerObject = this.walkInCustomerRepository.create({
      wcId: generateUniqueId('WC'),
      walkInCustomerDate: moment(walkInCustomerDate).toDate(),
      customerName: customerName?.trim(),
      carTiresCount: hasCarTires ? carTiresCount : null,
      truckTiresCount: hasTruckTires ? truckTiresCount : null,
      rimsCount: hasRims ? rimsCount : null,
      carTiresPrice: hasCarTires ? carTiresPrice : null,
      truckTiresPrice: hasTruckTires ? truckTiresPrice : null,
      rimsPrice: hasRims ? rimsPrice : null,
      totalAmount,
      status: status ?? WalkInCustomerStatus.PENDING,
      user: { id: authUser.id },
    });

    const walkInCustomer = await this.walkInCustomerRepository.save(walkInCustomerObject);

    return await this.findDetailedWalkInCustomerByWcId(walkInCustomer.wcId);
  }

  /**
   * Get all walk-in customers
   * @param authUser - The authenticated user
   * @param calenderSlotType - The calendar slot type
   * @param startTimestamp - The start timestamp
   * @param endTimestamp - The end timestamp
   * @param count - The count
   * @param limit - The limit
   * @param search - The search
   * @returns The all walk-in customers and total count
   */
  async getAllWalkInCustomers(
    authUser: User,
    calenderSlotType: CalenderSlotTypes,
    count: number,
    limit: number,
    startTimestamp?: number,
    endTimestamp?: number,
    search?: string,
  ) {
    if (calenderSlotType === CalenderSlotTypes.DAY) {
      return this.getWalkInCustomersDayView(
        authUser,
        count,
        limit,
        startTimestamp,
        endTimestamp,
        search,
      );
    }

    return this.getWalkInCustomersWeekView(
      authUser,
      count,
      limit,
      startTimestamp,
      endTimestamp,
      search,
    );
  }

  /**
   * Get walk-in customers day view
   * @param authUser - The authenticated user
   * @param count - The count
   * @param limit - The limit
   * @param startTimestamp - The start timestamp
   * @param endTimestamp - The end timestamp
   * @param search - The search
   * @returns The all walk-in customers and total count
   */
  async getWalkInCustomersDayView(
    authUser: User,
    count: number,
    limit: number,
    startTimestamp?: number,
    endTimestamp?: number,
    search?: string,
  ) {
    // Check if user has the permission to access walk-in customer
    if (authUser.role === UserRoles.USER && !authUser.isWalkInCustomerEnabled) {
      throw new ForbiddenException(
        this.i18n.t('exception.USER_PERMISSION_DENIED', { args: { property: 'Walk-in customer' } }),
      );
    }

    const normalizedSearch = search?.trim().toLowerCase();
    const numericSearch = Number(normalizedSearch);

    const hasDateFilter =
      startTimestamp && endTimestamp && startTimestamp !== null && endTimestamp !== null;

    const startDate = hasDateFilter ? moment(startTimestamp).toDate() : null;
    const endDate = hasDateFilter ? moment(endTimestamp).toDate() : null;

    const baseQb = this.walkInCustomerRepository
      .createQueryBuilder('walkInCustomer')
      .leftJoinAndSelect('walkInCustomer.user', 'user')
      .where('walkInCustomer.deletedAt IS NULL');

    if (hasDateFilter) {
      baseQb.andWhere('walkInCustomer.walkInCustomerDate BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    if (normalizedSearch) {
      baseQb.andWhere(
        new Brackets(qb => {
          qb.where('"walkInCustomer"."customerName" ILIKE :search', {
            search: `%${normalizedSearch}%`,
          })
            .orWhere('"walkInCustomer"."status"::text ILIKE :search', {
              search: `%${normalizedSearch}%`,
            })
            .orWhere(`to_char("walkInCustomer"."walkInCustomerDate", 'YYYY-MM-DD') LIKE :search`, {
              search: `%${normalizedSearch}%`,
            });

          if (!isNaN(numericSearch)) {
            qb.orWhere('"walkInCustomer"."carTiresCount" = :n', { n: numericSearch });
            qb.orWhere('"walkInCustomer"."carTiresPrice" = :n', { n: numericSearch });
            qb.orWhere('"walkInCustomer"."truckTiresCount" = :n', { n: numericSearch });
            qb.orWhere('"walkInCustomer"."truckTiresPrice" = :n', { n: numericSearch });
            qb.orWhere('"walkInCustomer"."rimsCount" = :n', { n: numericSearch });
            qb.orWhere('"walkInCustomer"."rimsPrice" = :n', { n: numericSearch });
            qb.orWhere('"walkInCustomer"."totalAmount" = :n', { n: numericSearch });
          }
        }),
      );
    }

    const [walkInCustomers, total] = await baseQb
      .orderBy('walkInCustomer.walkInCustomerDate', 'DESC')
      .addOrderBy('walkInCustomer.customerName', 'ASC')
      .skip(count)
      .take(limit)
      .getManyAndCount();

    // Total amount from all the walk-in customers data
    const totalAmount = await this.getTotalAmount();

    return { walkInCustomers, total, totalAmount };
  }

  /**
   * Get walk-in customers week view
   * @param authUser - The authenticated user
   * @param count - The count
   * @param limit - The limit
   * @param startTimestamp - The start timestamp
   * @param endTimestamp - The end timestamp
   * @param search - The search
   * @returns The all walk-in customers and total count
   */
  async getWalkInCustomersWeekView(
    authUser: User,
    count: number,
    limit: number,
    startTimestamp?: number,
    endTimestamp?: number,
    search?: string,
  ) {
    // Check if user has the permission to access walk-in customer
    if (authUser.role === UserRoles.USER && !authUser.isWalkInCustomerEnabled) {
      throw new ForbiddenException(
        this.i18n.t('exception.USER_PERMISSION_DENIED', { args: { property: 'Walk-in customer' } }),
      );
    }

    const normalizedSearch = search?.trim().toLowerCase();
    const numericSearch = Number(normalizedSearch);

    const hasDateFilter =
      startTimestamp && endTimestamp && startTimestamp !== null && endTimestamp !== null;

    if (!hasDateFilter) {
      throw new BadRequestException(this.i18n.t('exception.DATE_FILTER_REQUIRED_IN_WEEk_VIEW'));
    }

    const startDate = moment(startTimestamp).toDate();
    const endDate = moment(endTimestamp).toDate();

    const customerNamesQb = this.walkInCustomerRepository
      .createQueryBuilder('walkInCustomer')
      .select('DISTINCT LOWER(walkInCustomer.customerName)', 'customerName')
      .where('walkInCustomer.deletedAt IS NULL');

    customerNamesQb.andWhere('walkInCustomer.walkInCustomerDate BETWEEN :startDate AND :endDate', {
      startDate,
      endDate,
    });

    if (normalizedSearch) {
      customerNamesQb.andWhere(
        new Brackets(qb => {
          qb.where('"walkInCustomer"."customerName" ILIKE :search', {
            search: `%${normalizedSearch}%`,
          })
            .orWhere('"walkInCustomer"."status"::text ILIKE :search', {
              search: `%${normalizedSearch}%`,
            })
            .orWhere(`to_char("walkInCustomer"."walkInCustomerDate", 'YYYY-MM-DD') LIKE :search`, {
              search: `%${normalizedSearch}%`,
            });

          if (!isNaN(numericSearch)) {
            qb.orWhere('"walkInCustomer"."totalAmount" = :n', { n: numericSearch });
          }
        }),
      );
    }

    const totalResult = await customerNamesQb
      .clone()
      .select('COUNT(DISTINCT LOWER(walkInCustomer.customerName))', 'count')
      .getRawOne();

    const total = Number(totalResult?.count || 0);

    const pagedCustomerNames = await customerNamesQb
      .orderBy('LOWER(walkInCustomer.customerName)', 'ASC')
      .offset(count)
      .limit(limit)
      .getRawMany();

    if (!pagedCustomerNames.length) {
      const totalAmount = await this.getTotalAmount();
      return { walkInCustomers: [], total, totalAmount };
    }

    const customerNames = pagedCustomerNames.map(r => r.customerName);

    const recordsQb = this.walkInCustomerRepository
      .createQueryBuilder('walkInCustomer')
      .where('walkInCustomer.deletedAt IS NULL')
      .andWhere('LOWER(walkInCustomer.customerName) IN (:...customerNames)', { customerNames })
      .andWhere('walkInCustomer.walkInCustomerDate BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });

    const records = await recordsQb.getMany();

    const groupedMap: Record<
      string,
      {
        startDate: Date;
        endDate: Date;
        customerName: string;
        totalAmount: number;
        status: WalkInCustomerStatus;
      }
    > = {};

    records.forEach(row => {
      const key = row.customerName.trim().toLowerCase();

      if (!groupedMap[key]) {
        groupedMap[key] = {
          startDate,
          endDate,
          customerName: row.customerName,
          totalAmount: 0,
          status: WalkInCustomerStatus.PAID,
        };
      }

      groupedMap[key].totalAmount += Number(row.totalAmount || 0);

      if (row.status === WalkInCustomerStatus.PENDING) {
        groupedMap[key].status = WalkInCustomerStatus.PENDING;
      }
    });

    const walkInCustomers = Object.values(groupedMap);

    // Total amount from all the walk-in customers data
    const totalAmount = await this.getTotalAmount();

    return { walkInCustomers, total, totalAmount };
  }

  /**
   * Update walk-in customer
   * @param authUser Authenticated user
   * @param wcId Walk-in customer ID
   * @param updateWalkInCustomer Update walk-in customer DTO
   * @returns The updated walk-in customer
   */
  async updateWalkInCustomer(
    authUser: User,
    wcId: string,
    updateWalkInCustomer: UpdateWalkInCustomerDto,
  ) {
    // Check if user has the permission to access walk-in customer
    if (authUser.role === UserRoles.USER && !authUser.isWalkInCustomerEnabled) {
      throw new ForbiddenException(
        this.i18n.t('exception.USER_PERMISSION_DENIED', { args: { property: 'Walk-in customer' } }),
      );
    }

    const { carTiresCount, carTiresPrice, truckTiresCount, truckTiresPrice, rimsCount, rimsPrice } =
      updateWalkInCustomer;

    const hasCarTires =
      carTiresCount != null &&
      carTiresCount != undefined &&
      carTiresPrice != null &&
      carTiresPrice != undefined;
    const hasTruckTires =
      truckTiresCount != null &&
      truckTiresCount != undefined &&
      truckTiresPrice != null &&
      truckTiresPrice != undefined;
    const hasRims =
      rimsCount != null && rimsCount != undefined && rimsPrice != null && rimsPrice != undefined;

    if (!hasCarTires && !hasTruckTires && !hasRims) {
      throw new BadRequestException(this.i18n.t('exception.INVALID_WALK_IN_CUSTOMER_INPUT'));
    }

    const existingWalkInCustomer = await this.findWalkInCustomerByWcId(wcId);

    if (!existingWalkInCustomer) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND', { args: { property: 'Walk-in customer' } }),
      );
    }

    const walkInCustomerDate = updateWalkInCustomer.walkInCustomerDate
      ? moment(updateWalkInCustomer.walkInCustomerDate).toDate()
      : existingWalkInCustomer.walkInCustomerDate;

    const carTiresBothNotUndefined = carTiresCount !== undefined && carTiresPrice !== undefined;
    const truckTiresBothNotUndefined =
      truckTiresCount !== undefined && truckTiresPrice !== undefined;
    const rimsBothNotUndefined = rimsCount !== undefined && rimsPrice !== undefined;

    const updateWalkInCustomerObject = {
      ...updateWalkInCustomer,
      carTiresCount: carTiresBothNotUndefined
        ? carTiresCount
        : existingWalkInCustomer.carTiresCount,
      truckTiresCount: truckTiresBothNotUndefined
        ? truckTiresCount
        : existingWalkInCustomer.truckTiresCount,
      rimsCount: rimsBothNotUndefined ? rimsCount : existingWalkInCustomer.rimsCount,
      carTiresPrice: carTiresBothNotUndefined
        ? carTiresPrice
        : existingWalkInCustomer.carTiresPrice,
      truckTiresPrice: truckTiresBothNotUndefined
        ? truckTiresPrice
        : existingWalkInCustomer.truckTiresPrice,
      rimsPrice: rimsBothNotUndefined ? rimsPrice : existingWalkInCustomer.rimsPrice,
      walkInCustomerDate,
    };

    Object.assign(existingWalkInCustomer, updateWalkInCustomerObject);

    const updatedWalkInCustomer = await this.walkInCustomerRepository.save(existingWalkInCustomer);

    return await this.findDetailedWalkInCustomerByWcId(updatedWalkInCustomer.wcId);
  }

  /**
   * Update status of walk-in customers
   * @param authUser Authenticated user
   * @param customerName Customer name
   * @param startTimestamp Start timestamp
   * @param endTimestamp End timestamp
   * @param status Walk-in customer status
   * @returns updated walk-in customers
   */
  async updateWalkInCustomersStatus(
    authUser: User,
    customerName: string,
    startTimestamp: number,
    endTimestamp: number,
    status: WalkInCustomerStatus,
  ) {
    // Check if user has the permission to access walk-in customer
    if (authUser.role === UserRoles.USER && !authUser.isWalkInCustomerEnabled) {
      throw new ForbiddenException(
        this.i18n.t('exception.USER_PERMISSION_DENIED', { args: { property: 'Walk-in customer' } }),
      );
    }

    const normalizedCustomerName = customerName?.trim().toLowerCase();

    const walkInCustomers = await this.walkInCustomerRepository
      .createQueryBuilder('walkInCustomer')
      .where('walkInCustomer.deletedAt IS NULL')
      .andWhere('walkInCustomer.customerName ILIKE :customerName', {
        customerName: normalizedCustomerName,
      })
      .andWhere('walkInCustomer.walkInCustomerDate BETWEEN :startDate AND :endDate', {
        startDate: moment(startTimestamp).toDate(),
        endDate: moment(endTimestamp).toDate(),
      })
      .orderBy('walkInCustomer.walkInCustomerDate', 'ASC')
      .getMany();

    if (!walkInCustomers.length) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND', {
          args: { property: 'Walk-in customers in this time range' },
        }),
      );
    }

    const customerIds = walkInCustomers
      .filter(customer => customer.status !== status)
      .map(customer => customer.id);

    if (customerIds.length === 0) {
      throw new BadRequestException(this.i18n.t('exception.INVALID_WALK_IN_CUSTOMER_STATUS'));
    }

    await this.walkInCustomerRepository.update({ id: In(customerIds) }, { status });

    return {
      statusCode: HttpStatus.OK,
      message: this.i18n.t('translate.UPDATED', {
        args: { property: `${customerIds.length > 1 ? 'Walk-in customers' : 'Walk-in customer'}` },
      }),
    };
  }

  /**
   * Delete walk-in customer by ID
   * @param authUser Authenticated user
   * @param wcId Walk-in customer ID
   * @returns success message
   */
  async deleteWalkInCustomer(authUser: User, wcId: string) {
    // Check if user has the permission to access walk-in customer
    if (authUser.role === UserRoles.USER && !authUser.isWalkInCustomerEnabled) {
      throw new ForbiddenException(
        this.i18n.t('exception.USER_PERMISSION_DENIED', { args: { property: 'Walk-in customer' } }),
      );
    }

    const existingWalkInCustomer = await this.findWalkInCustomerByWcId(wcId);

    if (!existingWalkInCustomer) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND', { args: { property: 'Walk-in customer' } }),
      );
    }

    await this.walkInCustomerRepository.softDelete({ wcId });

    return {
      statusCode: HttpStatus.OK,
      message: this.i18n.t('translate.DELETED', { args: { property: 'Walk-in customer' } }),
    };
  }

  /**
   * Get customer names for walk-in customer
   * @param count The number of customer names to retrieve
   * @param limit The maximum number of customer names to retrieve
   * @param search The search query
   * @returns The customer names
   */
  async customerNamesForWalkInCustomer(count: number, limit: number, search?: string) {
    const normalizedSearch = search?.trim();

    const baseQb = this.walkInCustomerRepository
      .createQueryBuilder('walkInCustomer')
      .select(['walkInCustomer.customerName AS name'])
      .distinct(true)
      .where('walkInCustomer.deletedAt IS NULL')
      .andWhere('walkInCustomer.customerName IS NOT NULL')
      .andWhere("TRIM(walkInCustomer.customerName) <> ''");

    if (normalizedSearch) {
      baseQb.andWhere('walkInCustomer.customerName ILIKE :search', {
        search: `%${normalizedSearch}%`,
      });
      baseQb.addSelect(
        'CASE WHEN walkInCustomer.customerName ILIKE :startsWith THEN 0 ELSE 1 END',
        'rank',
      );
    }

    const customersQb = await baseQb
      .clone()
      .orderBy(normalizedSearch ? 'rank' : 'walkInCustomer.customerName', 'ASC')
      .addOrderBy('walkInCustomer.customerName', 'ASC');

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
      .select('COUNT(DISTINCT walkInCustomer.customerName)', 'total')
      .getRawOne();

    const total = Number(totalResult?.total || 0);

    return { customerNames, total };
  }

  /**
   * Generate walk-in customer invoice HTML
   * @param authUser Authenticated user
   * @param timeZone Timezone
   * @param customerName Customer name
   * @param startTimestamp Start timestamp
   * @param endTimestamp End timestamp
   * @returns Invoice HTML
   */
  async generateWalkInCustomerInvoiceHTML(
    authUser: User,
    timeZone: string,
    customerName: string,
    startTimestamp: number,
    endTimestamp: number,
  ) {
    try {
      // Check if user has the permission to access walk-in customer
      if (authUser.role === UserRoles.USER && !authUser.isWalkInCustomerEnabled) {
        throw new ForbiddenException(
          this.i18n.t('exception.USER_PERMISSION_DENIED', {
            args: { property: 'Walk-in customer' },
          }),
        );
      }

      const normalizedCustomerName = customerName?.trim().toLowerCase();

      const walkInCustomers = await this.walkInCustomerRepository
        .createQueryBuilder('walkInCustomer')
        .where('walkInCustomer.deletedAt IS NULL')
        .andWhere('walkInCustomer.customerName ILIKE :customerName', {
          customerName: normalizedCustomerName,
        })
        .andWhere('walkInCustomer.walkInCustomerDate BETWEEN :startDate AND :endDate', {
          startDate: moment(startTimestamp).toDate(),
          endDate: moment(endTimestamp).toDate(),
        })
        .orderBy('walkInCustomer.walkInCustomerDate', 'ASC')
        .getMany();

      if (!walkInCustomers.length) {
        throw new NotFoundException(
          this.i18n.t('exception.NOT_FOUND', {
            args: { property: 'Walk-in customers in this time range' },
          }),
        );
      }

      // Read the HTML template
      const templatePath = path.join(__dirname, '../../../public/invoice/invoice-template.html');

      if (!fs.existsSync(templatePath)) {
        throw new Error(`Template file not found at: ${templatePath}`);
      }

      let htmlContent = fs.readFileSync(templatePath, 'utf8');

      if (!htmlContent) {
        throw new Error('HTML template file content is empty');
      }

      // embed logo as base64
      const logoPath = path.join(__dirname, '../../../public/images/logo.png');
      let logoBase64 = '';

      if (fs.existsSync(logoPath)) {
        const logoBuffer = fs.readFileSync(logoPath);
        logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`;
      }

      // Build invoice number
      const invoiceNumber = walkInCustomers[0]?.id.toString() ?? '---';

      // Build issued date
      const latestDate = walkInCustomers[walkInCustomers.length - 1]?.walkInCustomerDate;

      const issuedDate = latestDate
        ? moment(latestDate).tz(timeZone).format('M/D/YYYY')
        : walkInCustomers[0]?.walkInCustomerDate
          ? moment(walkInCustomers[0].walkInCustomerDate).tz(timeZone).format('M/D/YYYY')
          : moment(startTimestamp).tz(timeZone).format('M/D/YYYY');

      // Build customer name
      const billToName = walkInCustomers[0]?.customerName ?? customerName;

      // Build company details
      const COMPANY_NAME = this.configService.get<string>('COMPANY_NAME') || 'Uvin Tire Reuse LLC';
      const COMPANY_PHONE_NUMBER =
        this.configService.get<string>('COMPANY_PHONE_NUMBER') || '5105669355';
      const COMPANY_EMAIL =
        this.configService.get<string>('COMPANY_EMAIL') || 'uvintirereuse@gmail.com';
      const COMPANY_ADDRESS =
        this.configService.get<string>('COMPANY_ADDRESS') || '5312, E Huston RD, Huston, TX 77028';

      // // Build line item rows
      const itemRows = walkInCustomers
        .flatMap(record => {
          const rows: string[] = [];
          const date = moment(record.walkInCustomerDate).tz(timeZone).format('MM/DD');

          if (
            record.truckTiresCount != null &&
            record.truckTiresCount != undefined &&
            record.truckTiresPrice != null &&
            record.truckTiresPrice != undefined
          ) {
            const amount = (
              Number(record.truckTiresCount) * Number(record.truckTiresPrice)
            ).toFixed(2);

            rows.push(`
            <tr>
              <td>
                <div class="item-description">Truck Tires</div>
                <div class="item-date">(${date})</div>
              </td>
              <td class="right">${Number(record.truckTiresCount).toFixed(0)}</td>
              <td class="right">$${Number(record.truckTiresPrice).toFixed(2)}</td>
              <td class="right">$${amount}</td>
            </tr>
          `);
          }

          if (
            record.carTiresCount != null &&
            record.carTiresCount != undefined &&
            record.carTiresPrice != null &&
            record.carTiresPrice != undefined
          ) {
            const amount = (Number(record.carTiresCount) * Number(record.carTiresPrice)).toFixed(2);

            rows.push(`
            <tr>
              <td>
                <div class="item-description">Car tires</div>
                <div class="item-date">(${date})</div>
              </td>
              <td class="right">${Number(record.carTiresCount).toFixed(0)}</td>
              <td class="right">$${Number(record.carTiresPrice).toFixed(2)}</td>
              <td class="right">$${amount}</td>
            </tr>
          `);
          }

          if (
            record.rimsCount != null &&
            record.rimsCount != undefined &&
            record.rimsPrice != null &&
            record.rimsPrice != undefined
          ) {
            // Standalone rims (not combined with car tires)
            const amount = (Number(record.rimsCount) * Number(record.rimsPrice)).toFixed(2);

            rows.push(`
            <tr>
              <td>
                <div class="item-description">Rims</div>
                <div class="item-date">(${date})</div>
              </td>
              <td class="right">${Number(record.rimsCount).toFixed(0)}</td>
              <td class="right">$${Number(record.rimsPrice).toFixed(2)}</td>
              <td class="right">$${amount}</td>
            </tr>
          `);
          }

          return rows;
        })
        .join('');

      // Calculate total amount
      const totalAmount = walkInCustomers
        .reduce((sum, r) => {
          const truck = Number(r.truckTiresCount || 0) * Number(r.truckTiresPrice || 0);
          const car = Number(r.carTiresCount || 0) * Number(r.carTiresPrice || 0);
          const rims = Number(r.rimsCount || 0) * Number(r.rimsPrice || 0);
          return sum + truck + car + rims;
        }, 0)
        .toFixed(2);

      // Replace template placeholders
      htmlContent = htmlContent
        .replace('{{COMPANY_NAME}}', COMPANY_NAME)
        .replace('{{COMPANY_PHONE_NUMBER}}', COMPANY_PHONE_NUMBER)
        .replace('{{COMPANY_EMAIL}}', COMPANY_EMAIL)
        .replace('{{COMPANY_ADDRESS}}', COMPANY_ADDRESS)
        .replace('{{LOGO_BASE64}}', logoBase64)
        .replace(/{{INVOICE_NUMBER}}/g, invoiceNumber)
        .replace('{{ISSUED_DATE}}', issuedDate)
        .replace('{{CUSTOMER_NAME}}', billToName)
        .replace('{{ITEMS_ROWS}}', itemRows)
        .replace('{{TOTAL_AMOUNT}}', totalAmount);

      const $ = cheerio.load(htmlContent);

      const modifiedHTML = $.html();

      return modifiedHTML;
    } catch (error) {
      console.error('Error generating walk-in customer invoice PDF:', error);
      throw new Error(`Failed to generate walk-in customer invoice PDF: ${error.message}`);
    }
  }

  /**
   * Get walk-in customer by wcId
   * @param wcId The walk-in customer ID
   * @returns The walk-in customer
   */
  async findWalkInCustomerByWcId(wcId: string) {
    return await this.walkInCustomerRepository
      .createQueryBuilder('walkInCustomer')
      .where('walkInCustomer.deletedAt IS NULL')
      .andWhere('walkInCustomer.wcId = :wcId', { wcId })
      .getOne();
  }

  /**
   * Get detailed walk-in customer by wcId
   * @param wcId The walk-in customer ID
   * @returns The detailed walk-in customer
   */
  async findDetailedWalkInCustomerByWcId(wcId: string) {
    return await this.walkInCustomerRepository
      .createQueryBuilder('walkInCustomer')
      .leftJoinAndSelect('walkInCustomer.user', 'user')
      .where('walkInCustomer.deletedAt IS NULL')
      .andWhere('walkInCustomer.wcId = :wcId', { wcId })
      .getOne();
  }

  private async getTotalAmount(): Promise<number> {
    const result = await this.walkInCustomerRepository
      .createQueryBuilder('walkInCustomer')
      .where('walkInCustomer.deletedAt IS NULL')
      .select('SUM(walkInCustomer.totalAmount)', 'totalAmount')
      .getRawOne();

    return Number(result?.totalAmount || 0);
  }
}
