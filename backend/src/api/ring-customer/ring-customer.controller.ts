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
import { RingCustomerService } from './ring-customer.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AppHeaders } from 'src/decorators/app-headers.decorator';
import { NOT_FOUND_RESPONSE, UNAUTHORIZE_RESPONSE } from 'src/swagger/responses/app.response';
import { JwtAuthGuard } from 'src/passport/jwt-auth.guard';
import { RolesGuard } from 'src/passport/roles.guard';
import { RingCustomerStatus, UserRoles } from 'src/constants/user.constant';
import { Roles } from 'src/decorators/roles.decorator';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { User } from '../user/entities/user.entity';
import { I18n, I18nContext } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { CreateRingCustomerDto } from './dto/create-ring-customer.dto';
import { plainToInstance } from 'class-transformer';
import { RingCustomer } from './entity/ring-customer.entity';
import { DEFAULT_COUNT, DEFAULT_LIMIT } from 'src/constants/app.constant';
import { UpdateRingCustomerDto } from './dto/update-ring-customer.dto';

@Controller('/api/v1')
@ApiTags('Ring Customer')
@UsePipes(ValidationPipe)
@AppHeaders()
export class RingCustomerController {
  constructor(private readonly ringCustomerService: RingCustomerService) {}

  @Post('/ring-customer')
  @ApiOperation({
    summary: `Create ring customer`,
    description: `
      Ring customer status : ${Object.values(RingCustomerStatus).join(', ')}
      `,
  })
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse(UNAUTHORIZE_RESPONSE)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.USER)
  async createRingCustomer(
    @AuthUser() authUser: User,
    @I18n() i18n: I18nContext<I18nTranslations>,
    @Body() createRingCustomerDto: CreateRingCustomerDto,
  ) {
    const ringCustomer = await this.ringCustomerService.createRingCustomer(
      authUser,
      createRingCustomerDto,
    );

    return {
      statusCode: HttpStatus.CREATED,
      message: i18n.t('translate.CREATED', { args: { property: 'Ring Customer' } }),
      data: plainToInstance(RingCustomer, ringCustomer, {
        enableImplicitConversion: true,
        excludeExtraneousValues: true,
      }),
    };
  }

  @Get('/ring-customers')
  @ApiOperation({
    summary: `Get all ring customers`,
    description: `Get all ring customers`,
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
  @ApiQuery({ name: 'search', required: false })
  async getAllRingCustomers(
    @AuthUser() authUser: User,
    @I18n() i18n: I18nContext<I18nTranslations>,
    @Query('count') _count?: number,
    @Query('limit') _limit?: number,
    @Query('startTimestamp') startTimestamp?: number,
    @Query('endTimestamp') endTimestamp?: number,
    @Query('search') search?: string,
  ) {
    const count = Number(_count) || DEFAULT_COUNT;
    const limit = Number(_limit) || DEFAULT_LIMIT;

    const { ringCustomers, total, totalAmount } =
      await this.ringCustomerService.getAllRingCustomers(
        authUser,
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
        ringCustomers: plainToInstance(RingCustomer, ringCustomers, {
          enableImplicitConversion: true,
          excludeExtraneousValues: true,
        }),
        totalAmount,
      },
      meta: {
        totalItems: total,
        itemsPerPage: limit,
        totalPages: Math.ceil(Number(total) / limit),
        currentCount: count + ringCustomers.length,
      },
    };
  }

  @Put('/ring-customer/:rcId')
  @ApiOperation({
    summary: `Update ring customer`,
    description: `
        Ring customer status : ${Object.values(RingCustomerStatus).join(', ')}
        `,
  })
  @HttpCode(HttpStatus.OK)
  @ApiResponse(UNAUTHORIZE_RESPONSE)
  @ApiResponse(NOT_FOUND_RESPONSE)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.USER)
  @ApiParam({ name: 'rcId', type: String, example: '1234567890' })
  async updateRingCustomer(
    @AuthUser() authUser: User,
    @I18n() i18n: I18nContext<I18nTranslations>,
    @Param('rcId') rcId: string,
    @Body() updateRingCustomerDto: UpdateRingCustomerDto,
  ) {
    const updatedRingCustomer = await this.ringCustomerService.updateRingCustomer(
      authUser,
      rcId,
      updateRingCustomerDto,
    );

    return {
      statusCode: HttpStatus.OK,
      message: i18n.t('translate.UPDATED', { args: { property: 'Ring customer' } }),
      data: plainToInstance(RingCustomer, updatedRingCustomer, {
        enableImplicitConversion: true,
        excludeExtraneousValues: true,
      }),
    };
  }

  @Delete('/ring-customer/:rcId')
  @ApiOperation({
    summary: `Delete ring customer`,
    description: `Delete ring customer`,
  })
  @HttpCode(HttpStatus.OK)
  @ApiResponse(UNAUTHORIZE_RESPONSE)
  @ApiResponse(NOT_FOUND_RESPONSE)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.USER)
  @ApiParam({ name: 'rcId', type: String, example: '1234567890' })
  async deleteRingCustomer(
    @AuthUser() authUser: User,
    @I18n() i18n: I18nContext<I18nTranslations>,
    @Param('rcId') rcId: string,
  ) {
    await this.ringCustomerService.deleteRingCustomer(authUser, rcId);

    return {
      statusCode: HttpStatus.OK,
      message: i18n.t('translate.DELETED', { args: { property: 'Ring customer' } }),
    };
  }

  @Get('/ring-customer/customer-names')
  @ApiOperation({
    summary: `Get ring customer names`,
    description: `Get ring customer names`,
  })
  @HttpCode(HttpStatus.OK)
  @ApiResponse(UNAUTHORIZE_RESPONSE)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.USER)
  @ApiQuery({ name: 'count', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false })
  async customerNamesForRingCustomer(
    @I18n() i18n: I18nContext<I18nTranslations>,
    @Query('count') _count?: number,
    @Query('limit') _limit?: number,
    @Query('search') search?: string,
  ) {
    const count = Number(_count) || DEFAULT_COUNT;
    const limit = Number(_limit) || DEFAULT_LIMIT;

    const { customerNames, total } = await this.ringCustomerService.customerNamesForRingCustomer(
      count,
      limit,
      search,
    );

    return {
      statusCode: HttpStatus.OK,
      message: i18n.t('translate.RETRIEVED', { args: { property: 'Ring customer names' } }),
      data: customerNames,
      meta: {
        totalItems: total,
        itemsPerPage: limit,
        totalPages: Math.ceil(Number(total) / limit),
        currentCount: count + customerNames.length,
      },
    };
  }
}
