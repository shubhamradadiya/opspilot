import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Not, Repository } from 'typeorm';
import { cleanEmptyFields, generateUniqueId } from 'src/helpers/utils.helper';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { I18nContext } from 'nestjs-i18n';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { deleteFile, uploadFile, validateFileType } from 'src/helpers/file-upload.helper';
import { IMAGE_EXTENSIONS } from 'src/constants/app.constant';
import type { Express } from 'express';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Find a user by email
   * @param email
   * @returns
   */
  async findByEmail(email: string) {
    return await this.userRepository.findOne({
      where: {
        email: email.trim().toLocaleLowerCase(),
      },
    });
  }

  /**
   * Find a user by phone
   * @param phone
   * @param countryCode
   * @param isoCode
   * @returns
   */
  async findByPhone(phone: string, countryCode: string, isoCode: string) {
    return await this.userRepository.findOne({
      where: {
        phone: phone.trim(),
        countryCode: countryCode.trim(),
        isoCode: isoCode.trim(),
      },
    });
  }

  /**
   * Find a user by uid
   * @param uid
   * @returns
   */
  async findByUid(uid: string) {
    return await this.userRepository.findOne({
      where: { uid },
    });
  }

  /**
   * Find a user by email excluding a specific user
   * @param email
   * @param excludeUserId
   * @returns
   */
  async findByEmailExcludingUser(email: string, excludeUserId: number) {
    return await this.userRepository.findOne({
      where: {
        email: email.trim().toLocaleLowerCase(),
        id: Not(excludeUserId),
      },
    });
  }

  /**
   * Find a user by phone excluding a specific user
   * @param phone
   * @param countryCode
   * @param isoCode
   * @param excludeUserId
   * @returns
   */
  async findByPhoneExcludingUser(
    phone: string,
    countryCode: string,
    isoCode: string,
    excludeUserId: number,
  ) {
    return await this.userRepository.findOne({
      where: {
        phone: phone.trim(),
        countryCode: countryCode.trim(),
        isoCode: isoCode.trim(),
        id: Not(excludeUserId),
      },
    });
  }

  /**
   * Get the details of a user
   * @param user
   * @returns
   */
  async getUserDetails(userId: number) {
    return await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id: userId })
      .getOne();
  }

  /**
   * Create or update a user
   * @param updateData
   * @param userId
   * @returns
   */
  async createOrUpdateUser(updateData: Partial<User>, userId: number | null = null) {
    if (userId) {
      await this.userRepository.update(userId, updateData);
    } else {
      const user = await this.userRepository.save({
        ...updateData,
        uid: generateUniqueId('U'),
      });
      userId = user.id;
    }
    return await this.getUserDetails(userId);
  }

  async updateUserProfile(
    updateUserProfileDto: UpdateUserProfileDto,
    authUser: User,
    profilePicture: Express.Multer.File,
    i18n: I18nContext<I18nTranslations>,
  ) {
    cleanEmptyFields(updateUserProfileDto);

    if (updateUserProfileDto.email) {
      const existingUser = await this.findByEmailExcludingUser(
        updateUserProfileDto.email,
        authUser.id,
      );
      if (existingUser) {
        throw new BadRequestException(
          i18n.t('exception.ALREADY_EXISTS', {
            args: { property: 'Email associated with another account' },
          }),
        );
      }
    }

    if (profilePicture) {
      if (!validateFileType(profilePicture, IMAGE_EXTENSIONS)) {
        throw new BadRequestException(
          i18n.t('exception.ONLY_IMAGES_ALLOWED', {
            args: { property: 'Profile Picture' },
          }),
        );
      }
      updateUserProfileDto.profilePicture = uploadFile('profile-pictures', profilePicture);
      if (authUser.profilePicture) {
        deleteFile(authUser.profilePicture);
      }
    }

    await this.userRepository.update(authUser.id, updateUserProfileDto);
    return await this.getUserDetails(authUser.id);
  }
}
