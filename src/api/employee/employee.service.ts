import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { I18nService } from 'nestjs-i18n';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import moment from 'moment';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Brackets, Repository } from 'typeorm';
import { UserRoles } from 'src/constants/user.constant';
import { encodePassword } from 'src/helpers/bcrypt.helper';

@Injectable()
export class EmployeeService {
  constructor(
    private readonly userService: UserService,
    private readonly i18n: I18nService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Get all employees
   * @param search
   * @param count
   * @param limit
   * @param isActive
   * @returns
   */
  async getAllEmployees(search?: string, count?: number, limit?: number, isActive?: boolean) {
    const query = this.userRepository
      .createQueryBuilder('user')
      .where('user.role = :role', { role: UserRoles.USER });

    if (search && search !== 'undefined') {
      search = search.trim();

      query.andWhere(
        new Brackets(qb => {
          qb.where('LOWER(user.fullName) ILIKE :search', {
            search: `%${search}%`,
          })
            .orWhere('LOWER(user.email) ILIKE :search', {
              search: `%${search}%`,
            })
            .orWhere('CONCAT(user.countryCode, user.phone) ILIKE :search', {
              search: `%${search}%`,
            })
            .orWhere(`CONCAT(user.countryCode, ' ', user.phone) ILIKE :search`, {
              search: `%${search}%`,
            });
        }),
      );
    }

    const totalUsers = await query.getCount();
    const activeUsers = await query.clone().andWhere('user.isActive = true').getCount();

    const inactiveUsers = await query.clone().andWhere('user.isActive = false').getCount();

    if (isActive !== undefined) {
      query.andWhere('user.isActive = :isActive', { isActive: Boolean(isActive) });
    }

    const total = await query.getCount();

    const users = await query.orderBy('user.createdAt', 'DESC').take(limit).skip(count).getMany();

    return { users, total, counts: { totalUsers, activeUsers, inactiveUsers } };
  }

  /**
   * Create an employee
   * @param createEmployeeDto
   * @returns
   */
  async createEmployee(createEmployeeDto: CreateEmployeeDto) {
    const { phone, countryCode, isoCode, email } = createEmployeeDto;

    if (email) {
      const emailUser = await this.userService.findByEmail(email);
      if (emailUser) {
        throw new BadRequestException(this.i18n.t('exception.EMAIL_USER_ALREADY_REGISTERED'));
      }
    }

    if (phone) {
      const phoneUser = await this.userService.findByPhone(phone, countryCode, isoCode);
      if (phoneUser) {
        throw new BadRequestException(this.i18n.t('exception.PHONE_USER_ALREADY_REGISTERED'));
      }
    }
    return await this.userService.createOrUpdateUser({
      ...createEmployeeDto,
      password: encodePassword(createEmployeeDto.password),
      verifiedAt: moment().toDate(),
    });
  }

  /**
   * Update an employee
   * @param uid
   * @param updateEmployeeDto
   * @returns
   */
  async updateEmployee(uid: string, updateEmployeeDto: UpdateEmployeeDto) {
    const existingUser = await this.userService.findByUid(uid);
    if (!existingUser) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND', { args: { property: 'Employee' } }),
      );
    }

    const { phone, countryCode, isoCode, email } = updateEmployeeDto;

    const validationPromises: Promise<void>[] = [];

    // Validate email
    if (email && email.trim().toLowerCase() !== existingUser.email?.toLowerCase()) {
      validationPromises.push(
        this.userService.findByEmailExcludingUser(email, existingUser.id).then(emailUser => {
          if (emailUser) {
            throw new BadRequestException(this.i18n.t('exception.EMAIL_USER_ALREADY_REGISTERED'));
          }
        }),
      );
    }

    // Validate phone
    if (phone && countryCode && isoCode) {
      const isPhoneDifferent =
        phone.trim() !== existingUser.phone?.trim() ||
        countryCode.trim() !== existingUser.countryCode?.trim() ||
        isoCode.trim() !== existingUser.isoCode?.trim();

      if (isPhoneDifferent) {
        validationPromises.push(
          this.userService
            .findByPhoneExcludingUser(phone, countryCode, isoCode, existingUser.id)
            .then(phoneUser => {
              if (phoneUser) {
                throw new BadRequestException(
                  this.i18n.t('exception.PHONE_USER_ALREADY_REGISTERED'),
                );
              }
            }),
        );
      }
    }

    await Promise.all(validationPromises);

    return await this.userService.createOrUpdateUser(
      {
        ...updateEmployeeDto,
        password: updateEmployeeDto?.password
          ? encodePassword(updateEmployeeDto?.password)
          : undefined,
      },
      existingUser.id,
    );
  }

  /**
   * Update an employee status
   * @param uid
   * @returns
   */
  async updateEmployeeStatus(uid: string) {
    const user = await this.userService.findByUid(uid);
    if (!user) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND', { args: { property: 'Employee' } }),
      );
    }

    const updatedUser = { isActive: user.isActive ? false : true };

    return await this.userService.createOrUpdateUser(updatedUser, user.id);
  }

  /**
   * Delete employee
   * @param uid
   * @returns
   */
  async deleteEmployee(uid: string) {
    const user = await this.userService.findByUid(uid);
    if (!user) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND', { args: { property: 'Employee' } }),
      );
    }

    return await this.userRepository.softDelete({ id: user.id });
  }
}
