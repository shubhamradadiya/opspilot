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

@Entity({ name: 'inventories' })
export class Inventory {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Transform(({ value }) => Number(value))
  id: number;

  @Expose()
  @Column({ unique: true })
  iId: string;

  @Expose()
  @Transform(({ value }) => (value ? dateToTimestamp(value) : null))
  @Column({ type: 'timestamp' })
  inventoryDate: Date;

  @Expose()
  @Transform(({ value }) => (value ? Number(value) : null))
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  carTiresCount: number | null;

  @Expose()
  @Transform(({ value }) => (value ? Number(value) : null))
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  truckTiresCount: number | null;

  @Expose()
  @Transform(({ value }) => (value ? Number(value) : null))
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  mixedTiresCount: number | null;

  @Expose()
  @Transform(({ value }) => (value ? Number(value) : null))
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  bales: number | null;

  @Expose()
  @Type(() => User)
  @ManyToOne(() => User, user => user.id, {
    onDelete: 'CASCADE',
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
