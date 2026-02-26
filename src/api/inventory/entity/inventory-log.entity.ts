import { Expose, Transform, Type } from 'class-transformer';
import { User } from 'src/api/user/entities/user.entity';
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
import { Inventory } from './inventory.entity';
import { ActivityLogType } from 'src/constants/user.constant';

@Entity({ name: 'inventory_logs' })
export class InventoryLog {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Transform(({ value }) => Number(value))
  id: number;

  @Expose()
  @Column({ unique: true })
  ilId: string;

  @Expose()
  @Column({
    type: 'enum',
    enum: ActivityLogType,
    nullable: true,
  })
  activityLogType: ActivityLogType;

  @Expose()
  @Type(() => User)
  @ManyToOne(() => User, user => user.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: Relation<User>;

  @Expose()
  @Type(() => Inventory)
  @ManyToOne(() => Inventory, inventory => inventory.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  inventory: Relation<Inventory>;

  @Expose()
  @Transform(({ value }) => (value ? dateToTimestamp(value) : null))
  @Column({ type: 'timestamp', nullable: true })
  inventoryDate: Date;

  @Expose()
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  carTiresCount: number | null;

  @Expose()
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  truckTiresCount: number | null;

  @Expose()
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  mixedTiresCount: number | null;

  @Expose()
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  bales: number | null;

  @Expose()
  @Column({ type: 'boolean', default: false })
  isRead: boolean;

  @Expose()
  @CreateDateColumn()
  @Transform(({ value }) => (value ? dateToTimestamp(value) : null))
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
