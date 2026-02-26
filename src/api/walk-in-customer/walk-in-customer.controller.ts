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
import { WalkInCustomerService } from './walk-in-customer.service';
import { User } from '../user/entities/user.entity';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { CreateWalkInCustomerDto } from './dto/create-walk-in-customer.dto';
import { I18n, I18nContext } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { NOT_FOUND_RESPONSE, UNAUTHORIZE_RESPONSE } from 'src/swagger/responses/app.response';
import { JwtAuthGuard } from 'src/passport/jwt-auth.guard';
import { RolesGuard } from 'src/passport/roles.guard';
import { DEFAULT_TIME_ZONE, UserRoles, WalkInCustomerStatus } from 'src/constants/user.constant';
import { Roles } from 'src/decorators/roles.decorator';
import { AppHeaders } from 'src/decorators/app-headers.decorator';
import { plainToInstance } from 'class-transformer';
import { WalkInCustomer } from './entity/walk-in-customer.entity';
import { UpdateWalkInCustomerDto } from './dto/update-walk-in-customer.dto';
import { CalenderSlotTypes, DEFAULT_COUNT, DEFAULT_LIMIT } from 'src/constants/app.constant';
import { WeeklyWalkInCustomersResource } from 'src/resources/weekly-walk-in-customers.resource';

@Controller('/api/v1')
@ApiTags('Walk-In Customer')
@UsePipes(ValidationPipe)
@AppHeaders()
export class WalkInCustomerController {
  constructor(private readonly walkInCustomerService: WalkInCustomerService) {}

  @Post('/walk-in-customer')
  @ApiOperation({
    summary: `Create walk-in customer`,
    description: `
      Walk-in customer status : ${Object.values(WalkInCustomerStatus).join(', ')}
      `,
  })
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse(UNAUTHORIZE_RESPONSE)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.USER)
  async createWalkInCustomer(
    @AuthUser() authUser: User,
    @I18n() i18n: I18nContext<I18nTranslations>,
    @Body() createWalkInCustomerDto: CreateWalkInCustomerDto,
  ) {
    const createdWalkInCustomer = await this.walkInCustomerService.createWalkInCustomer(
      authUser,
      createWalkInCustomerDto,
    );

    return {
      statusCode: HttpStatus.CREATED,
      message: i18n.t('translate.CREATED', { args: { property: 'Walk-in customer' } }),
      data: plainToInstance(WalkInCustomer, createdWalkInCustomer, {
        enableImplicitConversion: true,
        excludeExtraneousValues: true,
      }),
    };
  }

  @Get('/walk-in-customers')
  @ApiOperation({
    summary: `Get all walk-in customers`,
    description: `Get all walk-in customers`,
  })
  @HttpCode(HttpStatus.OK)
  @ApiResponse(UNAUTHORIZE_RESPONSE)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.USER)
  @ApiQuery({
    name: 'calenderSlotType',
    required: true,
    default: CalenderSlotTypes.DAY,
    type: String,
    enum: CalenderSlotTypes,
  })
  @ApiQuery({ name: 'count', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'startTimestamp', required: false, type: Number })
  @ApiQuery({ name: 'endTimestamp', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false })
  async getAllWalkInCustomers(
    @AuthUser() authUser: User,
    @I18n() i18n: I18nContext<I18nTranslations>,
    @Query('calenderSlotType') calenderSlotType: CalenderSlotTypes,
    @Query('count') _count?: number,
    @Query('limit') _limit?: number,
    @Query('startTimestamp') startTimestamp?: number,
    @Query('endTimestamp') endTimestamp?: number,
    @Query('search') search?: string,
  ) {
    const count = Number(_count) || DEFAULT_COUNT;
    const limit = Number(_limit) || DEFAULT_LIMIT;

    const { walkInCustomers, total, totalAmount } =
      await this.walkInCustomerService.getAllWalkInCustomers(
        authUser,
        calenderSlotType,
        count,
        limit,
        startTimestamp,
        endTimestamp,
        search,
      );

    return {
      statusCode: HttpStatus.OK,
      message: i18n.t('translate.SUCCESS'),
      data: {
        walkInCustomers:
          calenderSlotType === CalenderSlotTypes.DAY
            ? plainToInstance(WalkInCustomer, walkInCustomers, {
                enableImplicitConversion: true,
                excludeExtraneousValues: true,
              })
            : plainToInstance(WeeklyWalkInCustomersResource, walkInCustomers, {
                enableImplicitConversion: true,
                excludeExtraneousValues: true,
              }),
        totalAmount,
      },
      meta: {
        totalItems: total,
        itemsPerPage: limit,
        totalPages: Math.ceil(Number(total) / limit),
        currentCount: count + walkInCustomers.length,
      },
    };
  }

  @Put('/walk-in-customer/:wcId')
  @ApiOperation({
    summary: `Update walk-in customer`,
    description: `
      Walk-in customer status : ${Object.values(WalkInCustomerStatus).join(', ')}
      `,
  })
  @HttpCode(HttpStatus.OK)
  @ApiResponse(UNAUTHORIZE_RESPONSE)
  @ApiResponse(NOT_FOUND_RESPONSE)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.USER)
  @ApiParam({ name: 'wcId', type: String, example: 'WC1234567890', required: true })
  async updateWalkInCustomer(
    @AuthUser() authUser: User,
    @I18n() i18n: I18nContext<I18nTranslations>,
    @Param('wcId') wcId: string,
    @Body() updateWalkInCustomerDto: UpdateWalkInCustomerDto,
  ) {
    const updatedWalkInCustomer = await this.walkInCustomerService.updateWalkInCustomer(
      authUser,
      wcId,
      updateWalkInCustomerDto,
    );

    return {
      statusCode: HttpStatus.OK,
      message: i18n.t('translate.UPDATED', { args: { property: 'Walk-in customer' } }),
      data: plainToInstance(WalkInCustomer, updatedWalkInCustomer, {
        enableImplicitConversion: true,
        excludeExtraneousValues: true,
      }),
    };
  }

  @Put('/walk-in-customers/status')
  @ApiOperation({
    summary: `Update walk-in customers status`,
    description: `
      Walk-in customer status : ${Object.values(WalkInCustomerStatus).join(', ')}
      `,
  })
  @HttpCode(HttpStatus.OK)
  @ApiResponse(UNAUTHORIZE_RESPONSE)
  @ApiResponse(NOT_FOUND_RESPONSE)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.USER)
  @ApiQuery({ name: 'customerName', required: true, type: String, example: 'John Doe' })
  @ApiQuery({ name: 'startTimestamp', required: true, type: Number })
  @ApiQuery({ name: 'endTimestamp', required: true, type: Number })
  @ApiQuery({
    name: 'status',
    required: true,
    default: WalkInCustomerStatus.PAID,
    type: String,
    enum: WalkInCustomerStatus,
  })
  async updateWalkInCustomersStatus(
    @AuthUser() authUser: User,
    @Query('customerName') customerName: string,
    @Query('startTimestamp') startTimestamp: number,
    @Query('endTimestamp') endTimestamp: number,
    @Query('status') status: WalkInCustomerStatus,
  ) {
    const response = await this.walkInCustomerService.updateWalkInCustomersStatus(
      authUser,
      customerName,
      startTimestamp,
      endTimestamp,
      status,
    );

    return {
      statusCode: HttpStatus.OK,
      message: response.message,
    };
  }

  @Delete('/walk-in-customer/:wcId')
  @ApiOperation({
    summary: `Delete walk-in customer`,
    description: `Delete walk-in customer`,
  })
  @HttpCode(HttpStatus.OK)
  @ApiResponse(NOT_FOUND_RESPONSE)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.USER)
  @ApiParam({ name: 'wcId', type: String, example: 'WC1234567890', required: true })
  async deleteWalkInCustomer(
    @AuthUser() authUser: User,
    @I18n() i18n: I18nContext<I18nTranslations>,
    @Param('wcId') wcId: string,
  ) {
    await this.walkInCustomerService.deleteWalkInCustomer(authUser, wcId);

    return {
      statusCode: HttpStatus.OK,
      message: i18n.t('translate.DELETED', { args: { property: 'Walk-in customer' } }),
    };
  }

  @Get('/walk-in-customer/customer-names')
  @ApiOperation({
    summary: `Get walk-in customer names`,
    description: `Get walk-in customer names`,
  })
  @HttpCode(HttpStatus.OK)
  @ApiResponse(UNAUTHORIZE_RESPONSE)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.USER)
  @ApiQuery({ name: 'count', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false })
  async customerNamesForWalkInCustomer(
    @I18n() i18n: I18nContext<I18nTranslations>,
    @Query('count') _count?: number,
    @Query('limit') _limit?: number,
    @Query('search') search?: string,
  ) {
    const count = Number(_count) || DEFAULT_COUNT;
    const limit = Number(_limit) || DEFAULT_LIMIT;

    const { customerNames, total } =
      await this.walkInCustomerService.customerNamesForWalkInCustomer(count, limit, search);

    return {
      statusCode: HttpStatus.OK,
      message: i18n.t('translate.RETRIEVED', { args: { property: 'Walk-in customers names' } }),
      data: customerNames,
      meta: {
        totalItems: total,
        itemsPerPage: limit,
        totalPages: Math.ceil(Number(total) / limit),
        currentCount: count + customerNames.length,
      },
    };
  }

  @Get('/walk-in-customer/download-invoice')
  @ApiOperation({
    summary: `Get walk-in customer invoice PDF HTML code`,
    description: `Get walk-in customer invoice PDF HTML code`,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.USER)
  @ApiQuery({ name: 'customerName', required: true, type: String, example: 'John Doe' })
  @ApiQuery({ name: 'startTimestamp', required: true, type: Number })
  @ApiQuery({ name: 'endTimestamp', required: true, type: Number })
  async generateWalkInCustomerInvoiceHTML(
    @AuthUser() authUser: User,
    @I18n() i18n: I18nContext<I18nTranslations>,
    @Query('customerName') customerName: string,
    @Query('startTimestamp') startTimestamp: number,
    @Query('endTimestamp') endTimestamp: number,
  ) {
    const timeZone = authUser?.requestHeader?.timezone || authUser?.timeZone || DEFAULT_TIME_ZONE;

    const data = await this.walkInCustomerService.generateWalkInCustomerInvoiceHTML(
      authUser,
      timeZone,
      customerName,
      startTimestamp,
      endTimestamp,
    );

    return {
      statusCode: HttpStatus.OK,
      message: i18n.t('translate.SUCCESS'),
      data,
    };
  }
}
