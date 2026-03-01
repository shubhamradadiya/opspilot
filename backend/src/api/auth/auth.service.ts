import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { AccessTokenService } from '../access-token/access-token.service';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { comparePassword, encodePassword } from 'src/helpers/bcrypt.helper';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import moment from 'moment';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UserRoles } from 'src/constants/user.constant';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Inventory } from '../inventory/entity/inventory.entity';
import { Container } from '../container/entity/container.entity';
import { Expense } from '../expense/entity/expense.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private i18n: I18nService,
    private accessTokenService: AccessTokenService,
    private refreshTokenService: RefreshTokenService,
    private userService: UserService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,

    @InjectRepository(Container)
    private readonly containerRepository: Repository<Container>,

    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
  ) {}

  /**
   * Login
   * @param loginDto Login data
   * @param timeZone Time zone
   * @returns
   */
  async login(loginDto: LoginDto, timeZone: string): Promise<User> {
    const { email, countryCode, isoCode, phone, password } = loginDto;

    let user: User | null = null;
    if (email) {
      user = await this.userService.findByEmail(email);
      // if (user?.role !== UserRoles.ADMIN) {
      //   throw new BadRequestException(this.i18n.t('exception.EMAIL_LOGIN_NOT_ALLOWED'));
      // }
    } else if (phone && countryCode && isoCode) {
      user = await this.userService.findByPhone(phone, countryCode, isoCode);
    }
    if (!user) {
      throw new NotFoundException(this.i18n.t('exception.INVALID_CREDENTIALS'));
    }
    if (user.isActive === false) {
      throw new BadRequestException(this.i18n.t('exception.ACCOUNT_DISABLED'));
    }


    if (!comparePassword(password, user.password)) {
      throw new ConflictException(this.i18n.t('exception.INVALID_PASSWORD'));
    }

    // if user time zone is not set or different from the one provided, update it
    if (!user.timeZone || user.timeZone === null || user.timeZone !== timeZone) {
      user.timeZone = timeZone;
      await this.userService.createOrUpdateUser({ timeZone }, user.id);
    }
    const authentication = await this.generateTokens(user);

    return { ...user, authentication };
  }

  /**
   * Forgot password send OTP
   * @param forgotPasswordDto
   * @returns
   */
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    const email = forgotPasswordDto.email?.toLocaleLowerCase().trim();
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND', { args: { property: 'User' } }),
      );
    }
    if (user.role !== UserRoles.ADMIN) {
      throw new BadRequestException(this.i18n.t('exception.ONLY_ADMIN_CAN_FORGET_PASSWORD'));
    }
    const updatedData: Partial<User> = {
      forgotPasswordCode: '000000',
      forgotPasswordCodeExpiresAt: moment().add(10, 'minutes').toDate(),
    };
    await this.userService.createOrUpdateUser(updatedData, user.id);

    this.sendVerificationCode(user);
    return;
  }

  /**
   * Verify forgot password OTP
   * @param verifyOtpDto
   * @returns
   */
  async verifyForgotPasswordOtp(verifyOtpDto: VerifyOtpDto): Promise<void> {
    const { email, otp } = verifyOtpDto;
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND', { args: { property: 'User' } }),
      );
    }
    if (user.forgotPasswordCode !== otp) {
      throw new BadRequestException(this.i18n.t('exception.INVALID_OTP'));
    }

    // Check if OTP has expired
    if (
      user.forgotPasswordCodeExpiresAt &&
      moment().isAfter(moment(user.forgotPasswordCodeExpiresAt))
    ) {
      throw new BadRequestException(this.i18n.t('exception.OTP_EXPIRED'));
    }
    const updatedData: Partial<User> = {
      forgotPasswordCode: null,
      forgotPasswordCodeExpiresAt: null,
      forgotPasswordVerifiedAt: moment().toDate(),
    };
    await this.userService.createOrUpdateUser(updatedData, user.id);
    return;
  }

  /**
   * Reset password
   * @param resetPasswordDto
   * @returns
   */
  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const email = resetPasswordDto.email?.toLocaleLowerCase().trim();
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND', { args: { property: 'User' } }),
      );
    }
    if (user.forgotPasswordVerifiedAt) {
      await this.userService.createOrUpdateUser(
        {
          password: encodePassword(resetPasswordDto.password),
          forgotPasswordVerifiedAt: null,
        },
        user.id,
      );
    } else {
      throw new BadRequestException(this.i18n.t('exception.OTP_NOT_VERIFIED'));
    }
    return;
  }

  /**
   * Change password
   * @param authUser
   * @param adminChangePasswordDto
   * @returns
   */
  async changePassword(authUser: User, changePasswordDto: ChangePasswordDto): Promise<void> {
    const { oldPassword, newPassword } = changePasswordDto;
    if (!comparePassword(oldPassword, authUser.password)) {
      throw new BadRequestException(this.i18n.t('exception.ENTER_VALID_PASSWORD'));
    }
    if (comparePassword(newPassword, authUser.password)) {
      throw new BadRequestException(this.i18n.t('exception.NEW_PASSWORD_CANNOT_BE_SAME'));
    }
    await this.userService.createOrUpdateUser(
      {
        password: encodePassword(changePasswordDto.newPassword),
      },
      authUser.id,
    );

    return;
  }

  /**
   * Logout
   * @param authUser
   * @param logoutDto
   */
  async logout(user: User) {
    const jti = user.jti || null;

    // Revoke tokens if jti is present
    if (jti) {
      this.accessTokenService.revokeToken(jti);
      this.refreshTokenService.revokeTokenUsingJti(jti);
    }
    return;
  }

  /**
   * Generate JWT tokens
   * @param user user
   * @returns
   */
  async generateTokens(user: User, refreshToken?: string) {
    const { decodedToken, jwtToken } = await this.accessTokenService.createToken(user);
    if (!refreshToken) {
      refreshToken = await this.refreshTokenService.createToken(decodedToken);
    }
    return {
      accessToken: jwtToken,
      refreshToken,
      expiresAt: decodedToken['exp'],
    };
  }

  /**
   * Send verification code to email
   * @param user
   * @returns
   */
  sendVerificationCode(user: User) {
    this.logger.log(
      `Sending verification code ${user?.forgotPasswordCode} to email: ${user.email}`,
    );
  }
  /**
   * Dashboard data
   * @param timeZone time zone
   * @returns Dashboard data
   */
  async adminDashboardData(timeZone: string) {
    // Get start and end date of last month
    const startDateOfLastMonth = moment()
      .tz(timeZone)
      .startOf('month')
      .subtract(1, 'month')
      .toDate();
    const endDateOfLastMonth = moment()
      .tz(timeZone)
      .startOf('month')
      .subtract(1, 'month')
      .endOf('month')
      .toDate();

    // Get start and end date of this month
    const startOfThisMonth = moment().tz(timeZone).startOf('month').toDate();
    const endOfThisMonth = moment().tz(timeZone).endOf('month').toDate();

    // 1. Total active employees ------------------------------------------------

    const totalActiveEmployees = await this.userRepository
      .createQueryBuilder('u')
      .where('u.role = :role', { role: UserRoles.USER })
      .andWhere('u.isActive = :isActive', { isActive: true })
      .getCount();

    // 2. Total inventories ------------------------------------------------

    const inventoryQb = this.inventoryRepository
      .createQueryBuilder('inventory')
      .where('inventory.deletedAt IS NULL');

    const totalInventories = await inventoryQb.clone().getCount();

    const totalInventoriesInLastMonth = await inventoryQb
      .clone()
      .andWhere('inventory.inventoryDate BETWEEN :startDate AND :endDate', {
        startDate: startDateOfLastMonth,
        endDate: endDateOfLastMonth,
      })
      .getCount();

    const totalInventoriesInCurrentMonth = await inventoryQb
      .clone()
      .andWhere('inventory.inventoryDate BETWEEN :startDate AND :endDate', {
        startDate: startOfThisMonth,
        endDate: endOfThisMonth,
      })
      .getCount();

    const inventoryProgressInPercentage =
      totalInventoriesInLastMonth === 0
        ? totalInventoriesInCurrentMonth > 0
          ? 100
          : 0
        : Number((totalInventoriesInCurrentMonth / totalInventoriesInLastMonth) * 100) - 100;

    // 3. Total containers ------------------------------------------------

    const containerQb = this.containerRepository
      .createQueryBuilder('container')
      .where('container.deletedAt IS NULL');

    const totalContainers = await containerQb.clone().getCount();

    const totalContainersInLastMonth = await containerQb
      .clone()
      .andWhere('container.loadingDate BETWEEN :startDate AND :endDate', {
        startDate: startDateOfLastMonth,
        endDate: endDateOfLastMonth,
      })
      .getCount();

    const totalContainersInCurrentMonth = await containerQb
      .clone()
      .andWhere('container.loadingDate BETWEEN :startDate AND :endDate', {
        startDate: startOfThisMonth,
        endDate: endOfThisMonth,
      })
      .getCount();

    const containerProgressInPercentage =
      totalContainersInLastMonth === 0
        ? totalContainersInCurrentMonth > 0
          ? 100
          : 0
        : Number((totalContainersInCurrentMonth / totalContainersInLastMonth) * 100) - 100;

    // 4. Total expenses ------------------------------------------------

    const expenseQb = this.expenseRepository
      .createQueryBuilder('expense')
      .where('expense.deletedAt IS NULL');

    const totalExpenseResult = await expenseQb
      .clone()
      .select('SUM(expense.totalExpense)', 'totalExpense')
      .getRawOne();

    const totalExpense = Number(totalExpenseResult?.totalExpense || 0);

    const totalExpenseInLastMonthResult = await expenseQb
      .clone()
      .andWhere('expense.expenseDate BETWEEN :startDate AND :endDate', {
        startDate: startDateOfLastMonth,
        endDate: endDateOfLastMonth,
      })
      .select('SUM(expense.totalExpense)', 'totalExpenseInLastMonth')
      .getRawOne();

    const totalExpenseInLastMonth = Number(
      totalExpenseInLastMonthResult?.totalExpenseInLastMonth || 0,
    );

    const totalExpenseInCurrentMonthResult = await expenseQb
      .clone()
      .andWhere('expense.expenseDate BETWEEN :startDate AND :endDate', {
        startDate: startOfThisMonth,
        endDate: endOfThisMonth,
      })
      .select('SUM(expense.totalExpense)', 'totalExpenseInCurrentMonth')
      .getRawOne();

    const totalExpenseInCurrentMonth = Number(
      totalExpenseInCurrentMonthResult?.totalExpenseInCurrentMonth || 0,
    );

    const expenseProgressInPercentage =
      totalExpenseInLastMonth === 0
        ? totalExpenseInCurrentMonth > 0
          ? 100
          : 0
        : Number((totalExpenseInCurrentMonth / totalExpenseInLastMonth) * 100) - 100;

    return {
      totalActiveEmployees,
      totalInventories: {
        totalInventories,
        totalInventoriesInLastMonth,
        totalInventoriesInCurrentMonth,
        inventoryProgressInPercentage: Number(inventoryProgressInPercentage.toFixed(2)),
      },
      totalContainer: {
        totalContainers,
        totalContainersInLastMonth,
        totalContainersInCurrentMonth,
        containerProgressInPercentage: Number(containerProgressInPercentage.toFixed(2)),
      },
      totalExpense: {
        totalExpense,
        totalExpenseInLastMonth,
        totalExpenseInCurrentMonth,
        expenseProgressInPercentage: Number(expenseProgressInPercentage.toFixed(2)),
      },
    };
  }
}
