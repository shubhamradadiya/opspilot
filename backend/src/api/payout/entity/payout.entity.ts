import { Expose, Transform, Type } from 'class-transformer';
import { User } from 'src/api/user/entities/user.entity';
import { dateToTimestamp } from 'src/helpers/date-format.helper';
import { castToStorage } from 'src/helpers/file-upload.helper';
import { isUrlValid } from 'src/helpers/utils.helper';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'payout' })
export class Payout {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Transform(({ value }) => Number(value))
  id: number;

  @Expose()
  @Column({ unique: true })
  pId: string;

  @Expose()
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  amount: number;

  @Expose()
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  loanAmount: number;

  @Expose()
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  paidAmount: number;

  @Expose()
  @Column({ type: 'boolean', default: false })
  isPaid: boolean;

  @Expose()
  @Type(() => User)
  @ManyToOne(() => User, user => user.id, {
    onDelete: 'CASCADE',
  })
  user: Relation<User>;

  @Expose()
  @Column({ nullable: true, default: null })
  @Transform(({ value }) => (isUrlValid(value) ? value : castToStorage(value)))
  employeeSignature: string;

  @Expose()
  @CreateDateColumn()
  @Transform(({ value }) => (value ? dateToTimestamp(value) : null))
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
