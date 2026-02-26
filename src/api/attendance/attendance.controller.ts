import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppHeaders } from 'src/decorators/app-headers.decorator';
import { JwtAuthGuard } from 'src/passport/jwt-auth.guard';
import { RolesGuard } from 'src/passport/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { DEFAULT_TIME_ZONE, UserRoles } from 'src/constants/user.constant';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { I18n, I18nContext } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { User } from '../user/entities/user.entity';
import { plainToInstance } from 'class-transformer';
import { UserLog } from './entity/user-logs.entity';
import { CalenderSlotTypes, DEFAULT_COUNT, DEFAULT_LIMIT } from 'src/constants/app.constant';
import { DateWiseUserLogs } from 'src/resources/date-wise-user-logs.resource';
import { CheckStatusDto } from './dto/check-status.dto';
import { AttendanceStatusResource } from 'src/resources/attendance-status.resource';
import { ClockInClockOutDto } from './dto/clock-in-clock-out-dto';
import { UserWiseTodayAttendanceResource } from 'src/resources/user-wise-today-attendance.resource';
import { UserWiseAttendanceTimestamp } from 'src/resources/user-wise-attendance-timestamp.resource';
import { AddManualUserLogDto } from './dto/add-manual-user-log.dto';
import { NOT_FOUND_RESPONSE, UNAUTHORIZE_RESPONSE } from 'src/swagger/responses/app.response';
import { DeleteUserLogsManuallyDto } from './dto/delete-user-logs-manually.dto';

@Controller('api/v1')
@ApiTags('Attendance')
@UsePipes(ValidationPipe)
@AppHeaders()
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('/attendance/check-status')
  @ApiOperation({
    summary: 'Check attendance status',
    description: 'Check attendance status',
  })
  @HttpCode(HttpStatus.OK)
  async checkStatus(
    @I18n() i18n: I18nContext<I18nTranslations>,
    @Body() checkStatusDto: CheckStatusDto,
  ) {
    const data = await this.attendanceService.checkStatus(checkStatusDto);

    return {
      statusCode: HttpStatus.OK,
      message: i18n.t('translate.SUCCESS'),
      data: plainToInstance(AttendanceStatusResource, data, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      }),
    };
  }

  @Post('/attendance/clock-in-clock-out')
  @ApiOperation({
    summary: 'Clock in / clock out',
    description: 'Clock in / clock out',
  })
  @HttpCode(HttpStatus.OK)
  async clockInClockOut(
    @I18n() i18n: I18nContext<I18nTranslations>,
    @Body() clockInClockOutDto: ClockInClockOutDto,
  ) {
    const data = await this.attendanceService.clockInClockOut(clockInClockOutDto);

    return {
      statusCode: HttpStatus.OK,
      message: i18n.t('translate.SUCCESS'),
      data: plainToInstance(UserLog, data, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      }),
    };
  }

  @Post('/attendance/log')
  @ApiOperation({
    summary: `Add manual user log (admin only)`,
    description: `Add manual user log (admin only)`,
  })
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse(UNAUTHORIZE_RESPONSE)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  async addManualUserLog(
    @I18n() i18n: I18nContext<I18nTranslations>,
    @Body() addManualUserLogDto: AddManualUserLogDto,
  ) {
    const userLog = await this.attendanceService.addManualUserLog(addManualUserLogDto);

    return {
      statusCode: HttpStatus.CREATED,
      message: i18n.t('translate.CREATED', { args: { property: 'User log' } }),
      data: plainToInstance(UserLog, userLog, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      }),
    };
  }

  @Delete('/attendance/logs')
  @ApiOperation({
    summary: `Delete user logs manually (admin only)`,
    description: `Delete user logs manually (admin only)`,
  })
  @HttpCode(HttpStatus.OK)
  @ApiResponse(UNAUTHORIZE_RESPONSE)
  @ApiResponse(NOT_FOUND_RESPONSE)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  async deleteUserLogManually(@Body() deleteUserLogsManuallyDto: DeleteUserLogsManuallyDto) {
    const response = await this.attendanceService.deleteUserLogManually(deleteUserLogsManuallyDto);

    return {
      statusCode: response.statusCode,
      message: response.message,
    };
  }

  @Get('/attendance/logs')
  @ApiOperation({
    summary: `Get logged in or passed user's attendance logs`,
    description: `Get logged in or passed user's attendance logs`,
  })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.USER)
  @ApiQuery({ name: 'count', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'startTimestamp', required: false, type: Number })
  @ApiQuery({ name: 'endTimestamp', required: false, type: Number })
  @ApiQuery({ name: 'uid', required: false, type: String })
  async getDateWiseLogs(
    @AuthUser() authUser: User,
    @I18n() i18n: I18nContext<I18nTranslations>,
    @Query('count') _count?: number,
    @Query('limit') _limit?: number,
    @Query('startTimestamp') startTimestamp?: number,
    @Query('endTimestamp') endTimestamp?: number,
    @Query('uid') uid?: string,
  ) {
    const timeZone = authUser?.requestHeader?.timezone || authUser?.timeZone || DEFAULT_TIME_ZONE;

    const count = Number(_count) || DEFAULT_COUNT;
    const limit = Number(_limit) || DEFAULT_LIMIT;

    const { groupedLogs, total, todayHours, thisWeekHours, thisWeekPayout, lastWeekPayout } =
      await this.attendanceService.getDateWiseLogs(
        authUser,
        timeZone,
        count,
        limit,
        startTimestamp,
        endTimestamp,
        uid,
      );

    return {
      statusCode: HttpStatus.OK,
      message: i18n.t('translate.SUCCESS'),
      data: {
        userLogs: plainToInstance(DateWiseUserLogs, groupedLogs, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        }),
        attendanceSummary: {
          todayHours,
          thisWeekHours,
          thisWeekPayout,
          lastWeekPayout,
        },
      },
      meta: {
        totalItems: total,
        itemsPerPage: limit,
        totalPages: Math.ceil(Number(total) / limit),
        currentCount: count + groupedLogs.length,
      },
    };
  }

  @Get('/attendance/logs/today')
  @ApiOperation({
    summary: `Get today's attendance logs of all users (admin only)`,
    description: `Get today's attendance logs of all users (admin only)`,
  })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  @ApiQuery({ name: 'count', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false })
  async getTodayAttendanceLogs(
    @AuthUser() authUser: User,
    @I18n() i18n: I18nContext<I18nTranslations>,
    @Query('count') _count?: number,
    @Query('limit') _limit?: number,
    @Query('search') search?: string,
  ) {
    const timeZone = authUser?.requestHeader?.timezone || authUser?.timeZone || DEFAULT_TIME_ZONE;

    const count = Number(_count) || DEFAULT_COUNT;
    const limit = Number(_limit) || DEFAULT_LIMIT;

    const { todayAttendanceLogs, total } = await this.attendanceService.getTodayAttendanceLogs(
      timeZone,
      count,
      limit,
      search,
    );

    return {
      statusCode: HttpStatus.OK,
      message: i18n.t('translate.SUCCESS'),
      data: plainToInstance(UserWiseTodayAttendanceResource, todayAttendanceLogs, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      }),
      meta: {
        totalItems: total,
        itemsPerPage: limit,
        totalPages: Math.ceil(Number(total) / limit),
        currentCount: count + todayAttendanceLogs.length,
      },
    };
  }

  @Get('/attendance/timestamps')
  @ApiOperation({
    summary: `Get attendance timestamps of all users by days or weeks (admin only)`,
    description: `Get attendance timestamps of all users by days or weeks (admin only)`,
  })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  @ApiQuery({ name: 'count', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'startTimestamp', required: true, type: Number })
  @ApiQuery({ name: 'endTimestamp', required: true, type: Number })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({
    name: 'calenderSlotType',
    required: true,
    default: CalenderSlotTypes.DAY,
    type: 'enum',
    enum: CalenderSlotTypes,
  })
  async getAttendanceTimestamps(
    @AuthUser() authUser: User,
    @Query('startTimestamp') startTimestamp: number,
    @Query('endTimestamp') endTimestamp: number,
    @I18n() i18n: I18nContext<I18nTranslations>,
    @Query('calenderSlotType') calenderSlotType: CalenderSlotTypes,
    @Query('count') _count?: number,
    @Query('limit') _limit?: number,
    @Query('search') search?: string,
  ) {
    const count = Number(_count) || DEFAULT_COUNT;
    const limit = Number(_limit) || DEFAULT_LIMIT;
    calenderSlotType = calenderSlotType || CalenderSlotTypes.DAY;

    const { attendanceData, total } =
      await this.attendanceService.getAttendanceTimestampsOfAllUsersV2(
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
      message: i18n.t('translate.SUCCESS'),
      data: {
        calenderSlotType,
        attendanceData: plainToInstance(UserWiseAttendanceTimestamp, attendanceData, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        }),
      },
      meta: {
        totalItems: total,
        itemsPerPage: limit,
        totalPages: Math.ceil(Number(total) / limit),
        currentCount: count + attendanceData.length,
      },
    };
  }
}
