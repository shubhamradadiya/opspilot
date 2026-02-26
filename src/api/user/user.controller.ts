import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import type { Express } from 'express';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppHeaders } from 'src/decorators/app-headers.decorator';
import { UserService } from './user.service';
import { UNAUTHORIZE_RESPONSE } from 'src/swagger/responses/app.response';
import { USER_DETAILS_RESPONSE } from 'src/swagger/responses/user.response';
import { RolesGuard } from 'src/passport/roles.guard';
import { JwtAuthGuard } from 'src/passport/jwt-auth.guard';
import { UserRoles } from 'src/constants/user.constant';
import { Roles } from 'src/decorators/roles.decorator';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { User } from './entities/user.entity';
import { I18n, I18nContext } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { plainToInstance } from 'class-transformer';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';

@ApiTags('User')
@Controller('api/v1/user')
@UsePipes(ValidationPipe)
@ApiBearerAuth()
@AppHeaders()
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Get login user details
   * @param authUser
   * @param i18n
   * @returns
   */
  @Get()
  @ApiOperation({ summary: 'Get login user details' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse(UNAUTHORIZE_RESPONSE)
  @ApiResponse(USER_DETAILS_RESPONSE)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.USER)
  async userDetails(@AuthUser() authUser: User, @I18n() i18n: I18nContext<I18nTranslations>) {
    const user = await this.userService.getUserDetails(authUser.id);
    return {
      statusCode: HttpStatus.OK,
      message: i18n.t('translate.SUCCESS'),
      data: plainToInstance(User, user, {
        enableImplicitConversion: true,
        excludeExtraneousValues: true,
      }),
    };
  }

  @Put('/profile')
  @ApiOperation({ summary: 'Update user profile' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse(UNAUTHORIZE_RESPONSE)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('profilePicture'))
  @Roles(UserRoles.USER)
  async updateProfile(
    @AuthUser() authUser: User,
    @Body() updateUserProfileDto: UpdateUserProfileDto,
    @I18n() i18n: I18nContext<I18nTranslations>,
    @UploadedFile() profilePicture: Express.Multer.File,
  ) {
    const user = await this.userService.updateUserProfile(
      updateUserProfileDto,
      authUser,
      profilePicture,
      i18n,
    );

    return {
      statusCode: HttpStatus.OK,
      message: i18n.t('translate.UPDATED', { args: { property: 'User profile' } }),
      data: plainToInstance(User, user, {
        enableImplicitConversion: true,
        excludeExtraneousValues: true,
      }),
    };
  }
}
