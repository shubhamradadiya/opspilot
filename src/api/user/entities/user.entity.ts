import { Expose, Transform, Type } from 'class-transformer';
import { Languages } from 'src/constants/app.constant';
import { PriceUnit, UserRoles } from 'src/constants/user.constant';
import { dateToTimestamp } from 'src/helpers/date-format.helper';
import { castToStorage } from 'src/helpers/file-upload.helper';
import { isUrlValid } from 'src/helpers/utils.helper';
import { IRequestHeader } from 'src/interfaces/request-header.interface';
import { AuthTokenResource } from 'src/resources/auth-token.resource';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  public jti?: string;

  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Transform(({ value }) => Number(value))
  id: number;

  @Expose()
  @Column({ unique: true })
  uid: string;

  @Expose()
  @Column({ type: 'enum', enum: Languages, default: Languages.EN })
  language: Languages | string;

  @Expose()
  @Column({ type: 'enum', enum: UserRoles, default: UserRoles.USER })
  role: UserRoles | string;

  @Expose()
  @Column({ nullable: true })
  timeZone: string;

  @Expose()
  @Column({ nullable: true })
  email: string;

  @Expose()
  @Column({ nullable: true })
  isoCode: string;

  @Expose()
  @Column({ nullable: true })
  countryCode: string;

  @Expose()
  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true, type: 'text' })
  password: string;

  @Expose()
  @Column({ nullable: true, default: null })
  @Transform(({ value }) => (isUrlValid(value) ? value : castToStorage(value)))
  profilePicture: string;

  @Expose()
  @Column({ nullable: true })
  fullName: string;

  @Expose()
  @Column({ type: 'enum', enum: PriceUnit, default: PriceUnit.USD })
  priceUnit: PriceUnit | string;

  @Expose()
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  perHourRate: number;

  @Expose()
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  loanAmount: number;

  @Expose()
  @Column({ default: true })
  isActive: boolean;

  @Expose()
  @Column({ default: false })
  isClockInClockOutEnabled: boolean;

  @Expose()
  @Column({ default: false })
  isInventoryEnabled: boolean;

  @Expose()
  @Column({ default: false })
  isPayoutEnabled: boolean;

  @Expose()
  @Column({ default: false })
  isContainerEnabled: boolean;

  @Expose()
  @Column({ default: false })
  isExpenseEnabled: boolean;

  @Expose()
  @Column({ default: false })
  isWalkInCustomerEnabled: boolean;

  @Expose()
  @Column({ default: false })
  isRingCustomerEnabled: boolean;

  @Expose()
  @Column({ type: 'timestamp', nullable: true })
  @Transform(({ value }) => dateToTimestamp(value))
  verifiedAt: Date | null;

  @Column({ type: 'text', nullable: true })
  forgotPasswordCode: string | null;

  @Column({ type: 'timestamp', nullable: true })
  forgotPasswordCodeExpiresAt: Date | null;

  @Expose()
  @Transform(({ value }) => dateToTimestamp(value))
  @Column({ type: 'timestamp', nullable: true })
  forgotPasswordVerifiedAt: Date | null;

  @Expose()
  @Column({ default: true })
  isNotificationOn: boolean;

  @Expose()
  @CreateDateColumn()
  @Transform(({ value }) => dateToTimestamp(value))
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;

  @Expose()
  @Type(() => AuthTokenResource)
  authentication: AuthTokenResource;

  requestHeader: IRequestHeader | null;
}
