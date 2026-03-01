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
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ContainerService } from './container.service';
import { AppHeaders } from 'src/decorators/app-headers.decorator';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { NOT_FOUND_RESPONSE, UNAUTHORIZE_RESPONSE } from 'src/swagger/responses/app.response';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/passport/roles.guard';
import { JwtAuthGuard } from 'src/passport/jwt-auth.guard';
import { ContainerStatus, UserRoles } from 'src/constants/user.constant';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { User } from '../user/entities/user.entity';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { I18n, I18nContext } from 'nestjs-i18n';
import { plainToInstance } from 'class-transformer';
import { Container } from './entity/container.entity';
import type { Express } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UpdateContainerDto } from './dto/update-container.dto';
import { DEFAULT_COUNT, DEFAULT_LIMIT } from 'src/constants/app.constant';
import { AddContainerDto } from './dto/add-container.dto';

@Controller('/api/v1')
@ApiTags('Container')
@UsePipes(ValidationPipe)
@AppHeaders()
export class ContainerController {
  constructor(private readonly containerService: ContainerService) {}

  @Post('/container')
  @ApiOperation({
    summary: `Add container`,
    description: `
      Container status : ${Object.values(ContainerStatus).join(', ')}
      `,
  })
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse(UNAUTHORIZE_RESPONSE)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.USER)
  @ApiBody({ type: AddContainerDto })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('containerDocuments'))
  async addContainer(
    @AuthUser() authUser: User,
    @I18n() i18n: I18nContext<I18nTranslations>,
    @Body() addContainerDto: AddContainerDto,
    @UploadedFiles() containerDocuments: Express.Multer.File[],
  ) {
    const container = await this.containerService.addContainer(
      authUser,
      addContainerDto,
      containerDocuments,
    );

    return {
      statusCode: HttpStatus.CREATED,
      message: i18n.t('translate.CREATED', { args: { property: 'Booking' } }),
      data: plainToInstance(Container, container, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      }),
    };
  }

  @Put('/container/:cId')
  @ApiOperation({
    summary: `Update container`,
    description: `
      Container status : ${Object.values(ContainerStatus).join(', ')}
      `,
  })
  @HttpCode(HttpStatus.OK)
  @ApiResponse(UNAUTHORIZE_RESPONSE)
  @ApiResponse(NOT_FOUND_RESPONSE)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.USER)
  @ApiBody({ type: UpdateContainerDto })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('containerDocuments'))
  @ApiParam({ name: 'cId', type: String, example: '1234567890' })
  async updateContainer(
    @AuthUser() authUser: User,
    @I18n() i18n: I18nContext<I18nTranslations>,
    @Param('cId') cId: string,
    @Body() updateContainerDto: UpdateContainerDto,
    @UploadedFiles() containerDocuments: Express.Multer.File[],
  ) {
    const updatedContainer = await this.containerService.updateContainer(
      authUser,
      cId,
      updateContainerDto,
      containerDocuments,
    );

    return {
      statusCode: HttpStatus.OK,
      message: i18n.t('translate.UPDATED', { args: { property: 'Booking' } }),
      data: plainToInstance(Container, updatedContainer, {
        enableImplicitConversion: true,
        excludeExtraneousValues: true,
      }),
    };
  }

  @Delete('/container/:cId')
  @ApiOperation({
    summary: `Delete container`,
    description: `Delete container`,
  })
  @HttpCode(HttpStatus.OK)
  @ApiResponse(UNAUTHORIZE_RESPONSE)
  @ApiResponse(NOT_FOUND_RESPONSE)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.USER)
  @ApiParam({ name: 'cId', type: String, example: '1234567890' })
  async deleteContainer(
    @AuthUser() authUser: User,
    @I18n() i18n: I18nContext<I18nTranslations>,
    @Param('cId') cId: string,
  ) {
    await this.containerService.deleteContainer(authUser, cId);

    return {
      statusCode: HttpStatus.OK,
      message: i18n.t('translate.DELETED', { args: { property: 'Booking' } }),
    };
  }

  @Get('/containers')
  @ApiOperation({
    summary: `Get all containers`,
    description: `Get all containers`,
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
  async getAllContainers(
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

    const { containers, total } = await this.containerService.getAllContainers(
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
      data: plainToInstance(Container, containers, {
        enableImplicitConversion: true,
        excludeExtraneousValues: true,
      }),
      meta: {
        totalItems: total,
        itemsPerPage: limit,
        totalPages: Math.ceil(Number(total) / limit),
        currentCount: count + containers.length,
      },
    };
  }

  @Get('/container/booking-numbers')
  @ApiOperation({
    summary: `Get booking numbers for containers`,
    description: `Get booking numbers for containers`,
  })
  @HttpCode(HttpStatus.OK)
  @ApiResponse(UNAUTHORIZE_RESPONSE)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.USER)
  @ApiQuery({ name: 'count', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false })
  async getBookingNumbersForContainers(
    @I18n() i18n: I18nContext<I18nTranslations>,
    @Query('count') _count?: number,
    @Query('limit') _limit?: number,
    @Query('search') search?: string,
  ) {
    const count = Number(_count) || DEFAULT_COUNT;
    const limit = Number(_limit) || DEFAULT_LIMIT;

    const { bookingNumbers, total } = await this.containerService.getBookingNumbersForContainers(
      count,
      limit,
      search,
    );

    return {
      statusCode: HttpStatus.OK,
      message: i18n.t('translate.RETRIEVED', { args: { property: 'Booking numbers' } }),
      data: bookingNumbers,
      meta: {
        totalItems: total,
        itemsPerPage: limit,
        totalPages: Math.ceil(Number(total) / limit),
        currentCount: count + bookingNumbers.length,
      },
    };
  }
}
