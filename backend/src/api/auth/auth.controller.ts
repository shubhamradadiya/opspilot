import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppHeaders } from 'src/decorators/app-headers.decorator';
import { I18n, I18nContext } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { plainToInstance } from 'class-transformer';
import { User } from 'src/api/user/entities/user.entity';
import {
  CHANGE_PASSWORD_SUCCESS_RESPONSE,
  EMAIL_NOT_FOUND_RESPONSE,
  FORGET_PASSWORD_CODE_SENT_RESPONSE,
  INVALID_CREDENTIALS_RESPONSE,
  INVALID_OLD_PASSWORD_RESPONSE,
  INVALID_OTP_RESPONSE,
  INVALID_PASSWORD_RESPONSE,
  LOGIN_RESPONSE,
  LOGOUT_RESPONSE,
  OTP_VERIFIED_RESPONSE,
  RESET_PASSWORD_SUCCESS_RESPONSE,
} from 'src/swagger/responses/user.response';
import { UNAUTHORIZE_RESPONSE } from 'src/swagger/responses/app.response';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from 'src/passport/jwt-auth.guard';
import { RolesGuard } from 'src/passport/roles.guard';
import { DEFAULT_TIME_ZONE, UserRoles } from 'src/constants/user.constant';
import { Roles } from 'src/decorators/roles.decorator';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@ApiTags('Auth')
@Controller('api/v1/')
@UsePipes(ValidationPipe)
@AppHeaders()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Admin login
   * @param adminLoginDto
   * @param i18n
   * @returns
   */
  @Post('auth/login')
  @ApiOperation({ summary: 'Login' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse(LOGIN_RESPONSE)
  @ApiResponse(INVALID_CREDENTIALS_RESPONSE)
  @ApiResponse(INVALID_PASSWORD_RESPONSE)
  async login(
    @Body() loginDto: LoginDto,
    @I18n() i18n: I18nContext<I18nTranslations>,
    @Headers() headers: Record<string, string>,
  ) {
    const timeZone = (headers['timezone'] as string) || DEFAULT_TIME_ZONE;
    const user = await this.authService.login(loginDto, timeZone);
    return {
      statusCode: HttpStatus.OK,
      message: i18n.t('translate.LOGGED_IN'),
      data: plainToInstance(User, user, {
        enableImplicitConversion: true,
        excludeExtraneousValues: true,
      }),
    };
  }

  @Post('auth/forgot-password/send-otp')
  @ApiOperation({ summary: 'Admin forgot password' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse(EMAIL_NOT_FOUND_RESPONSE)
  @ApiResponse(FORGET_PASSWORD_CODE_SENT_RESPONSE)
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ) {
    await this.authService.forgotPassword(forgotPasswordDto);
    return {
      statusCode: HttpStatus.OK,
      message: i18n.t('translate.FORGET_PASSWORD_CODE_SENT'),
    };
  }

  /**
   * Verify forgot password OTP
   * @param verifyOtpDto
   * @param i18n
   * @returns
   */
  @Post('auth/forgot-password/verify-otp')
  @ApiOperation({ summary: 'Verify forgot password OTP' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse(OTP_VERIFIED_RESPONSE)
  @ApiResponse(INVALID_OTP_RESPONSE)
  async verifyForgotPasswordOtp(
    @Body() verifyOtpDto: VerifyOtpDto,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ) {
    await this.authService.verifyForgotPasswordOtp(verifyOtpDto);
    return {
      statusCode: HttpStatus.OK,
      message: i18n.t('translate.OTP_VERIFIED'),
    };
  }

  @Post('auth/reset-password')
  @ApiOperation({ summary: 'Reset password for Admin' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse(RESET_PASSWORD_SUCCESS_RESPONSE)
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ) {
    await this.authService.resetPassword(resetPasswordDto);
    return {
      statusCode: HttpStatus.OK,
      message: i18n.t('translate.PASSWORD_CHANGED'),
    };
  }
  /**
   * Change password
   * @param authUser
   * @param adminChangePasswordDto
   * @param i18n
   * @returns
   */
  @Post('auth/change-password')
  @ApiOperation({ summary: 'Change password' })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.USER)
  @ApiResponse(UNAUTHORIZE_RESPONSE)
  @ApiResponse(INVALID_OLD_PASSWORD_RESPONSE)
  @ApiResponse(CHANGE_PASSWORD_SUCCESS_RESPONSE)
  async changePassword(
    @AuthUser() authUser: User,
    @Body() changePasswordDto: ChangePasswordDto,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ) {
    await this.authService.changePassword(authUser, changePasswordDto);
    return {
      statusCode: HttpStatus.OK,
      message: i18n.t('translate.PASSWORD_CHANGED'),
    };
  }

  /**
   * Logout
   * @param authUser
   * @param i18n
   * @returns
   */
  @Post('auth/logout')
  @ApiOperation({ summary: 'Logout' })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.USER)
  @ApiResponse(UNAUTHORIZE_RESPONSE)
  @ApiResponse(LOGOUT_RESPONSE)
  async logout(@AuthUser() authUser: User, @I18n() i18n: I18nContext<I18nTranslations>) {
    await this.authService.logout(authUser);
    return {
      statusCode: HttpStatus.OK,
      message: i18n.t('translate.LOGGED_OUT'),
    };
  }

  /**
   * Dashboard data
   * @param req
   * @param res
   * @returns
   */
  @Get('admin/dashboard')
  @ApiOperation({
    summary: 'Get admin dashboard data',
    description: 'Get admin dashboard data (admin only)',
  })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  async adminDashboard(
    @AuthUser() authUser: User,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ) {
    const timeZone = authUser?.requestHeader?.timezone || authUser?.timeZone || DEFAULT_TIME_ZONE;

    const data = await this.authService.adminDashboardData(timeZone);

    return { statusCode: HttpStatus.OK, message: i18n.t('translate.SUCCESS'), data };
  }
}
