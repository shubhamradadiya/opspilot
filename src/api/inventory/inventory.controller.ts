import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRoles } from 'src/constants/user.constant';
import { JwtAuthGuard } from 'src/passport/jwt-auth.guard';
import { RolesGuard } from 'src/passport/roles.guard';
import { AppHeaders } from 'src/decorators/app-headers.decorator';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { I18n, I18nContext } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { User } from '../user/entities/user.entity';
import { plainToInstance } from 'class-transformer';
import { Inventory } from './entity/inventory.entity';
import { DEFAULT_COUNT, DEFAULT_LIMIT } from 'src/constants/app.constant';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { NOT_FOUND_RESPONSE, UNAUTHORIZE_RESPONSE } from 'src/swagger/responses/app.response';
import { InventoryActivityLog } from 'src/resources/inventory-activity-log.resource';

@Controller('/api/v1')
@ApiTags('Inventory')
@UsePipes(ValidationPipe)
@AppHeaders()
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post('/inventory')
  @ApiOperation({
    summary: `Create inventory`,
    description: `Create inventory`,
  })
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse(UNAUTHORIZE_RESPONSE)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.USER)
  async createInventory(
    @AuthUser() authUser: User,
    @I18n() i18n: I18nContext<I18nTranslations>,
    @Body() createInventoryDto: CreateInventoryDto,
  ) {
    const inventory = await this.inventoryService.createInventory(authUser, createInventoryDto);

    return {
      statusCode: HttpStatus.CREATED,
      message: i18n.t('translate.CREATED', { args: { property: 'Inventory' } }),
      data: plainToInstance(Inventory, inventory, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      }),
    };
  }

  @Get('/inventory')
  @ApiOperation({
    summary: `Get all inventories`,
    description: `Get all inventories`,
  })
  @HttpCode(HttpStatus.OK)
  @ApiResponse(UNAUTHORIZE_RESPONSE)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.USER)
  @ApiQuery({ name: 'count', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'startTimestamp', required: false, type: Number })
  @ApiQuery({ name: 'endTimestamp', required: false, type: Number })
  async getAllInventories(
    @AuthUser() authUser: User,
    @I18n() i18n: I18nContext<I18nTranslations>,
    @Query('count') _count?: number,
    @Query('limit') _limit?: number,
    @Query('startTimestamp') startTimestamp?: number,
    @Query('endTimestamp') endTimestamp?: number,
  ) {
    const count = Number(_count) || DEFAULT_COUNT;
    const limit = Number(_limit) || DEFAULT_LIMIT;

    const { inventories, total } = await this.inventoryService.getAllInventories(
      authUser,
      count,
      limit,
      startTimestamp,
      endTimestamp,
    );

    return {
      statusCode: HttpStatus.OK,
      message: i18n.t('translate.SUCCESS'),
      data: plainToInstance(Inventory, inventories, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      }),
      meta: {
        totalItems: total,
        itemsPerPage: limit,
        totalPages: Math.ceil(Number(total) / limit),
        currentCount: count + inventories.length,
      },
    };
  }

  @Delete('/inventory/:iId')
  @ApiOperation({
    summary: `Delete inventory`,
    description: `Delete inventory`,
  })
  @HttpCode(HttpStatus.OK)
  @ApiResponse(UNAUTHORIZE_RESPONSE)
  @ApiResponse(NOT_FOUND_RESPONSE)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.USER)
  @ApiParam({ name: 'iId', type: String, example: '1234567890', required: true })
  async deleteInventory(
    @Param('iId') iId: string,
    @AuthUser() authUser: User,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ) {
    await this.inventoryService.deleteInventory(iId, authUser);

    return {
      statusCode: HttpStatus.OK,
      message: i18n.t('translate.DELETED', { args: { property: 'Inventory' } }),
    };
  }

  @Put('/inventory/:iId')
  @ApiOperation({
    summary: `Update inventory`,
    description: `Update inventory`,
  })
  @HttpCode(HttpStatus.OK)
  @ApiResponse(UNAUTHORIZE_RESPONSE)
  @ApiResponse(NOT_FOUND_RESPONSE)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.USER)
  @ApiBody({ type: UpdateInventoryDto })
  @ApiParam({ name: 'iId', type: String, example: '1234567890', required: true })
  async updateInventory(
    @Param('iId') iId: string,
    @AuthUser() authUser: User,
    @Body() updateInventoryDto: UpdateInventoryDto,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ) {
    const inventory = await this.inventoryService.updateInventory(
      iId,
      authUser,
      updateInventoryDto,
    );

    return {
      statusCode: HttpStatus.OK,
      message: i18n.t('translate.UPDATED', { args: { property: 'Inventory' } }),
      data: plainToInstance(Inventory, inventory, {
        enableImplicitConversion: true,
        excludeExtraneousValues: true,
      }),
    };
  }

  @Get('/inventory/activity-logs')
  @ApiOperation({
    summary: `Get all inventory activity logs (admin only)`,
    description: `Get all inventory activity logs (admin only)`,
  })
  @HttpCode(HttpStatus.OK)
  @ApiResponse(UNAUTHORIZE_RESPONSE)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.USER)
  @ApiQuery({ name: 'count', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async inventoryActivityLogs(
    @AuthUser() authUser: User,
    @I18n() i18n: I18nContext<I18nTranslations>,
    @Query('count') _count?: number,
    @Query('limit') _limit?: number,
  ) {
    const count = Number(_count) || DEFAULT_COUNT;
    const limit = Number(_limit) || DEFAULT_LIMIT;

    const { inventoryActivityLogs, total } = await this.inventoryService.getAllInventoryActivities(
      authUser,
      count,
      limit,
    );

    return {
      statusCode: HttpStatus.OK,
      message: i18n.t('translate.SUCCESS'),
      data: plainToInstance(InventoryActivityLog, inventoryActivityLogs, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      }),
      meta: {
        totalItems: total,
        itemsPerPage: limit,
        totalPages: Math.ceil(Number(total) / limit),
        currentCount: count + inventoryActivityLogs.length,
      },
    };
  }

  @Put('/inventory/activity-log/read')
  @ApiOperation({
    summary: 'Mark inventory activity log as read (admin only)',
    description:
      'If there is no ilId passed when calling this endpoint then all the logs will be read of that user',
  })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  @ApiResponse(UNAUTHORIZE_RESPONSE)
  @ApiResponse(NOT_FOUND_RESPONSE)
  @ApiQuery({ name: 'ilId', required: false, type: String })
  async markInventoryActivityLogAsRead(
    @AuthUser() authUser: User,
    @I18n() i18n: I18nContext<I18nTranslations>,
    @Query('ilId') ilId?: string,
  ) {
    await this.inventoryService.markInventoryActivityLogAsRead(authUser, ilId);

    return {
      statusCode: HttpStatus.OK,
      message: i18n.t('translate.UPDATED', {
        args: { property: ilId ? `Inventory Activity Log` : `Inventory Activity Logs` },
      }),
    };
  }
}
