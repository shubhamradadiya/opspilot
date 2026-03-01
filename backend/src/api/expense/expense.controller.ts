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
import { ExpenseService } from './expense.service';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { User } from '../user/entities/user.entity';
import { I18n, I18nContext } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { CreateExpenseDto } from './dto/create-expense.dto';
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
import { UserRoles } from 'src/constants/user.constant';
import { Roles } from 'src/decorators/roles.decorator';
import { plainToInstance } from 'class-transformer';
import { Expense } from './entity/expense.entity';
import { DEFAULT_COUNT, DEFAULT_LIMIT, ExpenseType } from 'src/constants/app.constant';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@Controller('/api/v1')
@ApiTags('Expense')
@UsePipes(ValidationPipe)
@AppHeaders()
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post('/expense')
  @ApiOperation({
    summary: `Create expense`,
    description: `Create expense`,
  })
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse(UNAUTHORIZE_RESPONSE)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.USER)
  async createExpense(
    @AuthUser() authUser: User,
    @I18n() i18n: I18nContext<I18nTranslations>,
    @Body() createExpenseDto: CreateExpenseDto,
  ) {
    const expense = await this.expenseService.createExpense(authUser, createExpenseDto);

    return {
      statusCode: HttpStatus.CREATED,
      message: i18n.t('translate.CREATED', { args: { property: 'Expense' } }),
      data: plainToInstance(Expense, expense, {
        enableImplicitConversion: true,
        excludeExtraneousValues: true,
      }),
    };
  }

  @Get('/expenses')
  @ApiOperation({
    summary: `Get all expenses`,
    description: `Get all expenses`,
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
  async getAllExpenses(
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

    const { expenses, total, totalExpense } = await this.expenseService.getAllExpenses(
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
        expenses: plainToInstance(Expense, expenses, {
          enableImplicitConversion: true,
          excludeExtraneousValues: true,
        }),
        totalExpense,
      },
      meta: {
        totalItems: total,
        itemsPerPage: limit,
        totalPages: Math.ceil(Number(total) / limit),
        currentCount: count + expenses.length,
      },
    };
  }

  @Put('/expense/:eId')
  @ApiOperation({
    summary: `Update expense`,
    description: `
      Expense type : ${Object.values(ExpenseType).join(', ')}
      `,
  })
  @HttpCode(HttpStatus.OK)
  @ApiResponse(UNAUTHORIZE_RESPONSE)
  @ApiResponse(NOT_FOUND_RESPONSE)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.USER)
  @ApiParam({ name: 'eId', type: String, example: '1234567890' })
  async updateExpense(
    @AuthUser() authUser: User,
    @I18n() i18n: I18nContext<I18nTranslations>,
    @Param('eId') eId: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
  ) {
    const updatedExpense = await this.expenseService.updateExpense(authUser, eId, updateExpenseDto);

    return {
      statusCode: HttpStatus.OK,
      message: i18n.t('translate.UPDATED', { args: { property: 'Expense' } }),
      data: plainToInstance(Expense, updatedExpense, {
        enableImplicitConversion: true,
        excludeExtraneousValues: true,
      }),
    };
  }

  @Delete('/expense/:eId')
  @ApiOperation({
    summary: `Delete expense`,
    description: `Delete expense`,
  })
  @HttpCode(HttpStatus.OK)
  @ApiResponse(UNAUTHORIZE_RESPONSE)
  @ApiResponse(NOT_FOUND_RESPONSE)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.USER)
  @ApiParam({ name: 'eId', type: String, example: '1234567890' })
  async deleteExpense(
    @AuthUser() authUser: User,
    @I18n() i18n: I18nContext<I18nTranslations>,
    @Param('eId') eId: string,
  ) {
    await this.expenseService.deleteExpense(authUser, eId);

    return {
      statusCode: HttpStatus.OK,
      message: i18n.t('translate.DELETED', { args: { property: 'Expense' } }),
    };
  }

  @Get('/expense/vendor-names')
  @ApiOperation({
    summary: `Get vendor names for expense`,
    description: `Get vendor names for expense`,
  })
  @HttpCode(HttpStatus.OK)
  @ApiResponse(UNAUTHORIZE_RESPONSE)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.USER)
  @ApiQuery({ name: 'count', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false })
  async vendorNamesForExpense(
    @I18n() i18n: I18nContext<I18nTranslations>,
    @Query('count') _count?: number,
    @Query('limit') _limit?: number,
    @Query('search') search?: string,
  ) {
    const count = Number(_count) || DEFAULT_COUNT;
    const limit = Number(_limit) || DEFAULT_LIMIT;

    const { vendorsNames, total } = await this.expenseService.vendorNamesForExpense(
      count,
      limit,
      search,
    );

    return {
      statusCode: HttpStatus.OK,
      message: i18n.t('translate.RETRIEVED', { args: { property: 'Vendor names' } }),
      data: vendorsNames,
      meta: {
        totalItems: total,
        itemsPerPage: limit,
        totalPages: Math.ceil(Number(total) / limit),
        currentCount: count + vendorsNames.length,
      },
    };
  }
}
