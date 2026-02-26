import { Expose, Transform, Type } from 'class-transformer';
import { Payout } from 'src/api/payout/entity/payout.entity';
import { User } from 'src/api/user/entities/user.entity';
import { AttendanceStatus } from 'src/constants/user.constant';
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

@Entity({ name: 'user_logs' })
export class UserLog {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Transform(({ value }) => Number(value))
  id: number;

  @Expose()
  @Column({ unique: true })
  ulId: string;

  @Expose()
  @Column({
    type: 'enum',
    enum: AttendanceStatus,
    default: null,
    nullable: true,
  })
  status: AttendanceStatus | string | null;

  @Expose()
  @Transform(({ value }) => (value ? dateToTimestamp(value) : null))
  @Column({ type: 'timestamp' })
  checkedInAt: Date;

  @Expose()
  @Transform(({ value }) => (value ? dateToTimestamp(value) : null))
  @Column({ type: 'timestamp', nullable: true })
  checkedOutAt: Date | null;

  @Expose()
  @Type(() => User)
  @ManyToOne(() => User, user => user.id, {
    onDelete: 'CASCADE',
  })
  user: Relation<User>;

  @Expose()
  @Type(() => Payout)
  @ManyToOne(() => Payout, payout => payout.id, {
    onUpdate: 'CASCADE',
    nullable: true,
  })
  payout: Relation<Payout>;

  @Expose()
  @CreateDateColumn()
  @Transform(({ value }) => (value ? dateToTimestamp(value) : null))
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
