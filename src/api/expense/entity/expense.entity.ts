import { Expose, Transform, Type } from 'class-transformer';
import { User } from 'src/api/user/entities/user.entity';
import { ExpenseType } from 'src/constants/app.constant';
import { dateToTimestamp } from 'src/helpers/date-format.helper';
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

@Entity({ name: 'expenses' })
export class Expense {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Transform(({ value }) => Number(value))
  id: number;

  @Expose()
  @Column({ unique: true })
  eId: string;

  @Expose()
  @Transform(({ value }) => (value ? dateToTimestamp(value) : null))
  @Column({ type: 'timestamp' })
  expenseDate: Date;

  @Expose()
  @Column()
  vendorName: string;

  @Expose()
  @Column({ type: 'text', nullable: true })
  description: string;

  @Expose()
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalExpense: number;

  @Expose()
  @Column({ type: 'enum', enum: ExpenseType, nullable: true })
  expenseType: ExpenseType | string | null;

  @Expose()
  @Type(() => User)
  @ManyToOne(() => User, user => user.id, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    nullable: true
  })
  user: Relation<User>;

  @Expose()
  @Type(() => User)
  @ManyToOne(() => User, vendor => vendor.id, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  vendor: Relation<User>;

  @Expose()
  @CreateDateColumn()
  @Transform(({ value }) => (value ? dateToTimestamp(value) : null))
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
