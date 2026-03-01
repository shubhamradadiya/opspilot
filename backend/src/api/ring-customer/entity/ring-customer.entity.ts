import { Expose, Transform, Type } from 'class-transformer';
import { User } from 'src/api/user/entities/user.entity';
import { RingCustomerStatus } from 'src/constants/user.constant';
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

@Entity({ name: 'ring_customers' })
export class RingCustomer {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Transform(({ value }) => Number(value))
  id: number;

  @Expose()
  @Column({ unique: true })
  rcId: string;

  @Expose()
  @Transform(({ value }) => (value ? dateToTimestamp(value) : null))
  @Column({ type: 'timestamp' })
  ringCustomerDate: Date;

  @Expose()
  @Column()
  customerName: string;

  @Expose()
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  orderedRingCount: number;

  @Expose()
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;

  @Expose()
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  deliveryFee: number;

  @Expose()
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalAmount: number;

  @Expose()
  @Type(() => User)
  @ManyToOne(() => User, user => user.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: Relation<User>;

  @Expose()
  @Column({ type: 'enum', enum: RingCustomerStatus, nullable: true })
  status: RingCustomerStatus | string | null;

  @Expose()
  @CreateDateColumn()
  @Transform(({ value }) => (value ? dateToTimestamp(value) : null))
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
