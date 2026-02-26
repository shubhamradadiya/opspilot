import { Expose, Transform, Type } from 'class-transformer';
import { User } from 'src/api/user/entities/user.entity';
import { WalkInCustomerStatus } from 'src/constants/user.constant';
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

@Entity({ name: 'walk_in_customers' })
export class WalkInCustomer {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Transform(({ value }) => Number(value))
  id: number;

  @Expose()
  @Column({ unique: true })
  wcId: string;

  @Expose()
  @Column({ type: 'timestamp' })
  @Transform(({ value }) => (value ? dateToTimestamp(value) : null))
  walkInCustomerDate: Date;

  @Expose()
  @Column()
  customerName: string;

  @Expose()
  @Transform(({ value }) => (value ? Number(value) : null))
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  carTiresCount: number | null;

  @Expose()
  @Transform(({ value }) => (value ? Number(value) : null))
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  carTiresPrice: number | null;

  @Expose()
  @Transform(({ value }) => (value ? Number(value) : null))
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  truckTiresCount: number | null;

  @Expose()
  @Transform(({ value }) => (value ? Number(value) : null))
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  truckTiresPrice: number | null;

  @Expose()
  @Transform(({ value }) => (value ? Number(value) : null))
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  rimsCount: number | null;

  @Expose()
  @Transform(({ value }) => (value ? Number(value) : null))
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  rimsPrice: number | null;

  @Expose()
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalAmount: number;

  @Expose()
  @Column({ type: 'enum', enum: WalkInCustomerStatus, nullable: true })
  status: WalkInCustomerStatus | string | null;

  @Expose()
  @Type(() => User)
  @ManyToOne(() => User, user => user.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: Relation<User>;

  @Expose()
  @CreateDateColumn()
  @Transform(({ value }) => (value ? dateToTimestamp(value) : null))
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
