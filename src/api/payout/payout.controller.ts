import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import type { Express } from 'express';
import { PayoutService } from './payout.service';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AppHeaders } from 'src/decorators/app-headers.decorator';
import { RolesGuard } from 'src/passport/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { DEFAULT_TIME_ZONE, UserRoles } from 'src/constants/user.constant';
import { I18n, I18nContext } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from 'src/passport/jwt-auth.guard';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { User } from '../user/entities/user.entity';
import { CalenderSlotTypes, DEFAULT_COUNT, DEFAULT_LIMIT } from 'src/constants/app.constant';
import { UserWiseAttendancePayoutsResource } from 'src/resources/user-wise-attendance-payouts.resource';
import { AddLoanDto } from './dto/add-loan.dto';
import { CreatePayoutDto } from './dto/create-payout.dto';
import { Payout } from './entity/payout.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { SelfPayoutListResource } from 'src/resources/self-payout-list.resource';

@Controller('/api/v1')
@ApiTags('Payout')
@UsePipes(ValidationPipe)
@AppHeaders()
export class PayoutController {
  constructor(private readonly payoutService: PayoutService) {}

  @Post('/payout/add-loan')
  @ApiOperation({
    summary: `Add loan for user (admin only)`,
    description: `Add loan for user (admin only)`,
  })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  async addLoan(@Body() addLoanDto: AddLoanDto, @I18n() i18n: I18nContext<I18nTranslations>) {
    const user = await this.payoutService.addLoan(addLoanDto);

    return {
      statusCode: HttpStatus.OK,
      message: i18n.t('translate.UPDATED', { args: { property: 'User' } }),
      data: plainToInstance(User, user, {
        enableImplicitConversion: true,
        excludeExtraneousValues: true,
      }),
    };
  }

  @Post('/payout')
  @ApiOperation({
    summary: `Create payout for user (admin only)`,
    description: `Create payout for user (admin only)`,
  })
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('employeeSignature'))
  @ApiQuery({ name: 'startTimestamp', required: true, type: Number })
  @ApiQuery({ name: 'endTimestamp', required: true, type: Number })
  async createPayout(
    @AuthUser() authUser: User,
    @Body() createPayoutDto: CreatePayoutDto,
    @I18n() i18n: I18nContext<I18nTranslations>,
    @Query('startTimestamp') startTimestamp: number,
    @Query('endTimestamp') endTimestamp: number,
    @UploadedFile() employeeSignature: Express.Multer.File,
  ) {
    const data = await this.payoutService.createPayout(
      authUser,
      createPayoutDto,
      startTimestamp,
      endTimestamp,
      employeeSignature,
    );

    return {
      statusCode: HttpStatus.CREATED,
      message: i18n.t('translate.CREATED', { args: { property: 'Payout' } }),
      data: plainToInstance(Payout, data, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      }),
    };
  }

  @Get('/payouts/self-payouts')
  @ApiOperation({
    summary: `Get logged in user's payout list (self payouts)`,
    description: `Get logged in user's payout list (self payouts)`,
  })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.USER)
  @ApiQuery({ name: 'count', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'startTimestamp', required: false, type: Number })
  @ApiQuery({ name: 'endTimestamp', required: false, type: Number })
  async getSelfPayoutList(
    @I18n() i18n: I18nContext<I18nTranslations>,
    @AuthUser() authUser: User,
    @Query('count') _count?: number,
    @Query('limit') _limit?: number,
    @Query('startTimestamp') startTimestamp?: number,
    @Query('endTimestamp') endTimestamp?: number,
  ) {
    const timeZone = authUser?.requestHeader?.timezone || authUser?.timeZone || DEFAULT_TIME_ZONE;

    const count = Number(_count) || DEFAULT_COUNT;
    const limit = Number(_limit) || DEFAULT_LIMIT;

    const { payouts, total } = await this.payoutService.getSelfPayoutList(
      authUser,
      timeZone,
      count,
      limit,
      startTimestamp,
      endTimestamp,
    );

    return {
      statusCode: HttpStatus.OK,
      message: i18n.t('translate.RETRIEVED', { args: { property: 'Payouts' } }),
      data: plainToInstance(SelfPayoutListResource, payouts, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      }),
      meta: {
        totalItems: total,
        itemsPerPage: limit,
        totalPages: Math.ceil(Number(total) / limit),
        currentCount: count + payouts.length,
      },
    };
  }

  @Get('/payouts/all-payouts')
  @ApiOperation({
    summary: `Get all user's payout list (admin only)`,
    description: `
      Calender slot types : ${Object.values(CalenderSlotTypes).join(', ')}
      `,
  })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  @ApiQuery({
    name: 'calenderSlotType',
    required: true,
    default: CalenderSlotTypes.DAY,
    type: String,
    enum: CalenderSlotTypes,
  })
  @ApiQuery({ name: 'startTimestamp', required: true, type: Number })
  @ApiQuery({ name: 'endTimestamp', required: true, type: Number })
  @ApiQuery({ name: 'count', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false })
  async getAllUsersPayoutList(
    @AuthUser() authUser: User,
    @I18n() i18n: I18nContext<I18nTranslations>,
    @Query('calenderSlotType') calenderSlotType: CalenderSlotTypes,
    @Query('startTimestamp') startTimestamp: number,
    @Query('endTimestamp') endTimestamp: number,
    @Query('count') _count?: number,
    @Query('limit') _limit?: number,
    @Query('search') search?: string,
  ) {
    const count = Number(_count) || DEFAULT_COUNT;
    const limit = Number(_limit) || DEFAULT_LIMIT;
    calenderSlotType = calenderSlotType || CalenderSlotTypes.DAY;

    const { payouts, total } = await this.payoutService.getAllUsersPayoutListV2(
      authUser,
      calenderSlotType,
      startTimestamp,
      endTimestamp,
      count,
      limit,
      search,
    );

    return {
      statusCode: HttpStatus.OK,
      message: i18n.t('translate.RETRIEVED', { args: { property: 'Payouts' } }),
      data: {
        calenderSlotType,
        payouts: plainToInstance(UserWiseAttendancePayoutsResource, payouts, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        }),
      },
      meta: {
        totalItems: total,
        itemsPerPage: limit,
        totalPages: Math.ceil(Number(total) / limit),
        currentCount: count + payouts.length,
      },
    };
  }

  @Get('/payout/download-payout-receipt')
  @ApiOperation({
    summary: `Download payout receipt PDF`,
    description: `Download payout receipt PDF`,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.USER)
  @ApiQuery({ name: 'uid', required: true, type: String, example: '1234567890' })
  @ApiQuery({ name: 'startTimestamp', required: true, type: Number })
  @ApiQuery({ name: 'endTimestamp', required: true, type: Number })
  async downloadPayoutReceiptPDF(
    @AuthUser() authUser: User,
    @Query('uid') uid: string,
    @Query('startTimestamp') startTimestamp: number,
    @Query('endTimestamp') endTimestamp: number,
  ) {
    const timeZone = authUser?.requestHeader?.timezone || authUser?.timeZone || DEFAULT_TIME_ZONE;

    const data = await this.payoutService.generatePayoutReceiptPDF(
      timeZone,
      uid,
      startTimestamp,
      endTimestamp,
    );

    return {
      statusCode: HttpStatus.OK,
      message: 'success',
      data,
    };
  }
}
