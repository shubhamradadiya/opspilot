import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Inventory } from './entity/inventory.entity';
import { In, Repository } from 'typeorm';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { User } from '../user/entities/user.entity';
import { ActivityLogType, UserRoles } from 'src/constants/user.constant';
import { I18nService } from 'nestjs-i18n';
import { generateUniqueId } from 'src/helpers/utils.helper';
import moment from 'moment-timezone';
import { InventoryLog } from './entity/inventory-log.entity';
import { UpdateInventoryDto } from './dto/update-inventory.dto';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,

    @InjectRepository(InventoryLog)
    private readonly inventoryLogRepository: Repository<InventoryLog>,

    private readonly i18n: I18nService,
  ) {}

  /**
   * Create Inventory
   * @param authUser - Authenticated user
   * @param createInventoryDto - The create inventory dto
   * @returns The created inventory
   */
  async createInventory(authUser: User, createInventoryDto: CreateInventoryDto) {
    // Check if user has the permission to access inventory
    if (authUser.role === UserRoles.USER && !authUser.isInventoryEnabled) {
      throw new ForbiddenException(
        this.i18n.t('exception.USER_PERMISSION_DENIED', { args: { property: 'Inventory' } }),
      );
    }

    const { carTiresCount, truckTiresCount, mixedTiresCount, bales } = createInventoryDto;

    if (!carTiresCount && !truckTiresCount && !mixedTiresCount && !bales) {
      throw new BadRequestException(this.i18n.t('exception.INVALID_INVENTORY_INPUT'));
    }

    const inventoryDate = moment(createInventoryDto.inventoryDate).toDate();

    const inventoryObject: Inventory = this.inventoryRepository.create({
      iId: generateUniqueId('I'),
      inventoryDate,
      carTiresCount: carTiresCount ? Number(carTiresCount) : null,
      truckTiresCount: truckTiresCount ? Number(truckTiresCount) : null,
      mixedTiresCount: mixedTiresCount ? Number(mixedTiresCount) : null,
      bales: bales ? Number(bales) : null,
      user: { id: authUser.id },
    });

    const inventory = await this.inventoryRepository.save(inventoryObject);

    const inventoryLogObject = this.inventoryLogRepository.create({
      ilId: generateUniqueId('IL'),
      user: { id: authUser.id },
      inventory: { id: inventory.id },
      inventoryDate,
      activityLogType: ActivityLogType.CREATED,
      carTiresCount: inventory.carTiresCount ? Number(inventory.carTiresCount) : null,
      truckTiresCount: inventory.truckTiresCount ? Number(inventory.truckTiresCount) : null,
      mixedTiresCount: inventory.mixedTiresCount ? Number(inventory.mixedTiresCount) : null,
      bales: inventory.bales ? Number(inventory.bales) : null,
    });

    await this.inventoryLogRepository.save(inventoryLogObject);

    return await this.getDetailedInventory(inventory.iId);
  }

  /**
   * Get all inventories
   * @param authUser Authenticated user
   * @param count The number of records to skip
   * @param limit The limit of records to return
   * @param startTimestamp The start timestamp to filter the attendance timestamps
   * @param endTimestamp The end timestamp to filter the attendance timestamps
   * @returns The inventories and total
   */
  async getAllInventories(
    authUser: User,
    count: number,
    limit: number,
    startTimestamp?: number,
    endTimestamp?: number,
  ) {
    // Check if user has the permission to access inventory
    if (authUser.role === UserRoles.USER && !authUser.isInventoryEnabled) {
      throw new ForbiddenException(
        this.i18n.t('exception.USER_PERMISSION_DENIED', { args: { property: 'Inventory' } }),
      );
    }

    const queryBuilder = this.inventoryRepository
      .createQueryBuilder('inventory')
      .leftJoinAndSelect('inventory.user', 'user')
      .where('inventory.deletedAt IS NULL');

    // Add date range filter if provided
    if (startTimestamp && endTimestamp && startTimestamp !== null && endTimestamp !== null) {
      queryBuilder.andWhere('inventory.inventoryDate BETWEEN :startTime AND :endTime', {
        startTime: moment(startTimestamp).toDate(),
        endTime: moment(endTimestamp).toDate(),
      });
    }

    const [inventories, total] = await queryBuilder
      .skip(count)
      .take(limit)
      .orderBy('inventory.inventoryDate', 'DESC')
      .getManyAndCount();

    return { inventories, total };
  }

  /**
   * Delete inventory by ID
   * @param iId Inventory ID
   * @param authUser Authenticated user
   * @returns success message
   */
  async deleteInventory(iId: string, authUser: User) {
    // Check if user has the permission to access inventory
    if (authUser.role === UserRoles.USER && !authUser.isInventoryEnabled) {
      throw new ForbiddenException(
        this.i18n.t('exception.USER_PERMISSION_DENIED', { args: { property: 'Inventory' } }),
      );
    }

    const inventory = await this.getDetailedInventory(iId);

    if (!inventory) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND', { args: { property: 'Inventory' } }),
      );
    }

    const inventoryLogObject = this.inventoryLogRepository.create({
      ilId: generateUniqueId('IL'),
      user: { id: authUser.id },
      inventory: { id: inventory.id },
      inventoryDate: inventory.inventoryDate,
      activityLogType: ActivityLogType.DELETED,
      carTiresCount: Number(inventory.carTiresCount || 0),
      truckTiresCount: Number(inventory.truckTiresCount || 0),
      mixedTiresCount: Number(inventory.mixedTiresCount || 0),
      bales: Number(inventory.bales || 0),
    });

    await this.inventoryLogRepository.save(inventoryLogObject);

    await this.inventoryRepository.softDelete(inventory.id);

    return {
      statusCode: HttpStatus.OK,
      message: this.i18n.t('translate.DELETED', { args: { property: 'Inventory' } }),
    };
  }

  /**
   * Update inventory by ID
   * @param iId Inventory ID
   * @param authUser Authenticated user
   * @param updateInventoryDto Update inventory DTO
   * @returns Updated inventory
   */
  async updateInventory(iId: string, authUser: User, updateInventoryDto: UpdateInventoryDto) {
    // Check if user has the permission to access inventory
    if (authUser.role === UserRoles.USER && !authUser.isInventoryEnabled) {
      throw new ForbiddenException(
        this.i18n.t('exception.USER_PERMISSION_DENIED', { args: { property: 'Inventory' } }),
      );
    }

    const { carTiresCount, truckTiresCount, mixedTiresCount, bales } = updateInventoryDto;

    if (!carTiresCount && !truckTiresCount && !mixedTiresCount && !bales) {
      throw new BadRequestException(this.i18n.t('exception.INVALID_INVENTORY_INPUT'));
    }

    const inventory = await this.getDetailedInventory(iId);

    if (!inventory) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND', { args: { property: 'Inventory' } }),
      );
    }

    const inventoryDate = updateInventoryDto.inventoryDate
      ? moment(updateInventoryDto.inventoryDate).toDate()
      : inventory.inventoryDate;

    Object.assign(inventory, {
      ...updateInventoryDto,
      inventoryDate,
    });

    await this.inventoryRepository.save(inventory);

    const updatedInventory = await this.getDetailedInventory(iId);

    if (updatedInventory) {
      const inventoryLogObject = this.inventoryLogRepository.create({
        ilId: generateUniqueId('IL'),
        user: { id: authUser.id },
        inventory: { id: updatedInventory.id },
        inventoryDate: updatedInventory.inventoryDate,
        activityLogType: ActivityLogType.UPDATED,
        carTiresCount: Number(updatedInventory.carTiresCount || 0),
        truckTiresCount: Number(updatedInventory.truckTiresCount || 0),
        mixedTiresCount: Number(updatedInventory.mixedTiresCount || 0),
        bales: Number(updatedInventory.bales || 0),
      });

      await this.inventoryLogRepository.save(inventoryLogObject);
    }

    return updatedInventory;
  }

  /**
   * Get all inventory activities
   * @param authUser Authenticated user
   * @param count The number of records to skip
   * @param limit The limit of records to return
   * @returns inventory activities along with text body and total
   */
  async getAllInventoryActivities(authUser, count: number, limit: number) {
    const queryBuilder = this.inventoryLogRepository
      .createQueryBuilder('inventoryLog')
      .leftJoinAndSelect('inventoryLog.user', 'user')
      .leftJoinAndSelect('inventoryLog.inventory', 'inventory')
      .where('inventoryLog.deletedAt IS NULL')
      .andWhere('inventoryLog.isRead = :isRead', { isRead: false });

    const [activityLogs, total] = await queryBuilder
      .skip(count)
      .take(limit)
      .orderBy('inventoryLog.createdAt', 'DESC')
      .getManyAndCount();

    const inventoryActivityLogs: {
      ilId: string;
      user: User;
      text: string;
      isRead: boolean;
      createdAt: Date;
    }[] = [];

    for (const log of activityLogs) {
      const userName = log.user?.fullName ?? 'Unknown User';
      const activityLogType = log.activityLogType;
      const inventoryDate = log.inventoryDate
        ? moment(log.inventoryDate).format('DD MMM YYYY')
        : null;
      const carTiresCount = log.carTiresCount ? Number(log.carTiresCount) : null;
      const truckTiresCount = log.truckTiresCount ? Number(log.truckTiresCount) : null;
      const mixedTiresCount = log.mixedTiresCount ? Number(log.mixedTiresCount) : null;
      const bales = log.bales ? Number(log.bales) : null;
      const isRead = log.isRead;
      const actor = authUser.id === log.user?.id ? 'You' : userName;

      const inventoryActivityLog: {
        ilId: string;
        user: User;
        text: string;
        isRead: boolean;
        createdAt: Date;
      } = {
        ilId: log.ilId,
        user: log.user,
        text: '',
        isRead,
        createdAt: log.createdAt,
      };

      switch (activityLogType) {
        case ActivityLogType.CREATED:
          inventoryActivityLog.text += `${actor} created an inventory for date ${inventoryDate}`;
          break;

        case ActivityLogType.UPDATED: {
          const parts: string[] = [];

          if (carTiresCount) parts.push(`${carTiresCount} car tires`);
          if (truckTiresCount) parts.push(`${truckTiresCount} truck tires`);
          if (mixedTiresCount) parts.push(`${mixedTiresCount} mixed tires`);
          if (bales) parts.push(`${bales} bales`);

          inventoryActivityLog.text +=
            `${actor} updated an inventory for date ${inventoryDate}: ` +
            (parts.length ? `: ${parts.join(', ')}` : '');

          break;
        }
        case ActivityLogType.DELETED:
          inventoryActivityLog.text += `${actor} deleted an inventory for date ${inventoryDate}`;
          break;

        default:
          inventoryActivityLog.text += '';
          break;
      }

      inventoryActivityLogs.push(inventoryActivityLog);
    }

    return { inventoryActivityLogs, total };
  }

  /**
   * Mark inventory activity log as read
   * @param authUser Authenticated User
   * @param ilId Inventory Activity Log ID
   * @returns success message
   */
  async markInventoryActivityLogAsRead(authUser: User, ilId?: string) {
    if (ilId) {
      const inventoryActivityLog = await this.inventoryLogRepository
        .createQueryBuilder('inventoryLog')
        .where('inventoryLog.ilId = :ilId', { ilId })
        .andWhere('inventoryLog.deletedAt IS NULL')
        .andWhere('inventoryLog.isRead = :isRead', { isRead: false })
        .getOne();

      if (!inventoryActivityLog) {
        throw new NotFoundException(
          this.i18n.t('exception.NOT_FOUND', { args: { property: 'Inventory Activity Log' } }),
        );
      }

      inventoryActivityLog.isRead = true;
      await this.inventoryLogRepository.save(inventoryActivityLog);

      return {
        statusCode: HttpStatus.OK,
        message: this.i18n.t('translate.UPDATED', { args: { property: 'Inventory Activity Log' } }),
      };
    }

    const inventoryActivityLogs = await this.inventoryLogRepository
      .createQueryBuilder('inventoryLog')
      .where('inventoryLog.deletedAt IS NULL')
      .andWhere('inventoryLog.userId = :userId', { userId: authUser.id })
      .andWhere('inventoryLog.isRead = :isRead', { isRead: false })
      .getMany();

    if (!inventoryActivityLogs || inventoryActivityLogs.length === 0) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND', { args: { property: 'Inventory Activity Logs' } }),
      );
    }

    const ilIds = inventoryActivityLogs.map(log => log.ilId);

    await this.inventoryLogRepository.update({ ilId: In(ilIds) }, { isRead: true });

    return {
      statusCode: HttpStatus.OK,
      message: this.i18n.t('translate.UPDATED', { args: { property: 'Inventory Activity Logs' } }),
    };
  }

  /**
   * Get inventory details along with user details for provided inventory ID
   * @param iId Inventory ID
   * @returns inventory data
   */
  async getDetailedInventory(iId: string) {
    return await this.inventoryRepository
      .createQueryBuilder('inventory')
      .leftJoinAndSelect('inventory.user', 'user')
      .where('inventory.deletedAt IS NULL')
      .andWhere('inventory.iId = :inventoryId', { inventoryId: iId })
      .getOne();
  }

  /**
   * Get inventory details for provided inventory ID
   * @param iId Inventory ID
   * @returns detailed inventory data with user details
   */
  async getInventory(iId: string) {
    return await this.inventoryRepository
      .createQueryBuilder('inventory')
      .leftJoinAndSelect('inventory.user', 'user')
      .where('inventory.deletedAt IS NULL')
      .andWhere('inventory.iId = :inventoryId', { inventoryId: iId })
      .getOne();
  }
}
