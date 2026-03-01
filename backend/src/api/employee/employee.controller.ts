import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AppHeaders } from 'src/decorators/app-headers.decorator';
import { EmployeeService } from './employee.service';

import { JwtAuthGuard } from 'src/passport/jwt-auth.guard';
import { RolesGuard } from 'src/passport/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRoles } from 'src/constants/user.constant';
import { I18n, I18nContext } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { plainToInstance } from 'class-transformer';
import { User } from '../user/entities/user.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { UNAUTHORIZE_RESPONSE } from 'src/swagger/responses/app.response';
import {
  CREATE_EMPLOYEE_RESPONSE,
  DELETE_EMPLOYEE_RESPONSE,
  GET_ALL_EMPLOYEES_RESPONSE,
  UPDATE_EMPLOYEE_RESPONSE,
  UPDATE_EMPLOYEE_STATUS_RESPONSE,
} from 'src/swagger/responses/user.response';
import { DEFAULT_COUNT, DEFAULT_LIMIT } from 'src/constants/app.constant';

@ApiTags('Employees')
@Controller('api/v1/employee')
@UsePipes(ValidationPipe)
@ApiBearerAuth()
@AppHeaders()
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get()
  @ApiOperation({ summary: 'Get all employees (admin only)' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'count', example: 0, required: false })
  @ApiQuery({ name: 'limit', example: 10, required: false })
  @ApiQuery({ name: 'isActive', example: true, type: Boolean, required: false })
  @HttpCode(HttpStatus.OK)
  @ApiResponse(UNAUTHORIZE_RESPONSE)
  @ApiResponse(GET_ALL_EMPLOYEES_RESPONSE)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)

  /**
   * Get all employees
   * @param i18n
   * @param search
   * @param count
   * @param limit
   * @param isActive
   * @returns
   */
  async getAllEmployees(
    @I18n() i18n: I18nContext<I18nTranslations>,
    @Query('search') search?: string,
    @Query('count') count?: number,
    @Query('limit') limit?: number,
    @Query('isActive') isActive?: boolean,
  ) {
    count = Number(count) || DEFAULT_COUNT;
    limit = Number(limit) || DEFAULT_LIMIT;
    let parsedIsActive: boolean | undefined;
    if (String(isActive) === 'true') parsedIsActive = true;
    if (String(isActive) === 'false') parsedIsActive = false;

    const { users, total, counts } = await this.employeeService.getAllEmployees(
      search,
      count,
      limit,
      parsedIsActive,
    );
    return {
      statusCode: HttpStatus.OK,
      message: i18n.t('translate.SUCCESS'),
      data: {
        summary: {
          totalUsers: counts.totalUsers,
          activeUsers: counts.activeUsers,
          inactiveUsers: counts.inactiveUsers,
        },
        users: plainToInstance(User, users, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        }),
      },
      meta: {
        totalItems: total,
        itemsPerPage: limit,
        totalPages: Math.ceil(Number(total) / limit),
        currentCount: count + users.length,
      },
    };
  }

  /**
   * Create an employee
   * @param createEmployeeDto
   * @param i18n
   * @returns
   */
  @Post()
  @ApiOperation({ summary: 'Create an employee (admin only)' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse(UNAUTHORIZE_RESPONSE)
  @ApiResponse(CREATE_EMPLOYEE_RESPONSE)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  async createEmployee(
    @Body() createEmployeeDto: CreateEmployeeDto,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ) {
    const user = await this.employeeService.createEmployee(createEmployeeDto);
    return {
      statusCode: HttpStatus.OK,
      message: i18n.t('translate.CREATED', { args: { property: 'Employee' } }),
      data: plainToInstance(User, user, {
        enableImplicitConversion: true,
        excludeExtraneousValues: true,
      }),
    };
  }

  /**
   * Update an employee status
   * @param uid
   * @param i18n
   * @returns
   */
  @Patch(':uid/status')
  @ApiOperation({ summary: 'Update an employee status (admin only)' })
  @ApiParam({ name: 'uid', type: String, example: '1234567890' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse(UNAUTHORIZE_RESPONSE)
  @ApiResponse(UPDATE_EMPLOYEE_STATUS_RESPONSE)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  async updateEmployeeStatus(
    @Param('uid') uid: string,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ) {
    const user = await this.employeeService.updateEmployeeStatus(uid);
    return {
      statusCode: HttpStatus.OK,
      message: i18n.t('translate.EMPLOYEE_STATUS_CHANGE', {
        args: {
          property: user?.isActive ? 'activated' : 'deactivated',
        },
      }),
    };
  }

  /**
   * Update an employee
   * @param uid
   * @param updateEmployeeDto
   * @param i18n
   * @returns
   */
  @Put(':uid')
  @ApiOperation({ summary: 'Update an employee (admin only)' })
  @ApiParam({ name: 'uid', type: String, example: 'U3d8be6da1768902921' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse(UNAUTHORIZE_RESPONSE)
  @ApiResponse(UPDATE_EMPLOYEE_RESPONSE)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  async updateEmployee(
    @Param('uid') uid: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ) {
    const user = await this.employeeService.updateEmployee(uid, updateEmployeeDto);

    return {
      statusCode: HttpStatus.OK,
      message: i18n.t('translate.UPDATED', { args: { property: 'Employee' } }),
      data: plainToInstance(User, user, {
        enableImplicitConversion: true,
        excludeExtraneousValues: true,
      }),
    };
  }

  /**
   * Delete an employee
   * @param uid
   * @param i18n
   * @returns
   */
  @Delete(':uid')
  @ApiOperation({ summary: 'Delete an employee (admin only)' })
  @ApiParam({ name: 'uid', type: String, example: '1234567890' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse(UNAUTHORIZE_RESPONSE)
  @ApiResponse(DELETE_EMPLOYEE_RESPONSE)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  async deleteEmployee(@Param('uid') uid: string, @I18n() i18n: I18nContext<I18nTranslations>) {
    await this.employeeService.deleteEmployee(uid);
    return {
      statusCode: HttpStatus.OK,
      message: i18n.t('translate.DELETED', { args: { property: 'Employee' } }),
    };
  }
}
