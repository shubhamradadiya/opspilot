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
import { ContainerDocument } from './container-document.entity';
import { ContainerStatus } from 'src/constants/user.constant';

@Entity({ name: 'containers' })
export class Container {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Transform(({ value }) => Number(value))
  id: number;

  @Expose()
  @Column({ unique: true })
  cId: string;

  @Expose()
  @Column()
  bookingNumber: string;

  @Expose()
  @Type(() => User)
  @ManyToOne(() => User, user => user.id, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  user: Relation<User>;

  @Expose()
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  containerCount: number;

  @Expose()
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  avgWeightInKgs: number;

  @Expose()
  @Transform(({ value }) => (value ? dateToTimestamp(value) : null))
  @Column({
    type: 'timestamp',
    nullable: true,
    comment: 'Date for which container is being loading',
  })
  loadingDate: Date | null;

  @Expose()
  @Transform(({ value }) => (value ? dateToTimestamp(value) : null))
  @Column({
    type: 'timestamp',
    nullable: true,
    comment: 'Expected Time of Departure',
  })
  etdDate: Date | null;

  @Expose()
  @Transform(({ value }) => (value ? dateToTimestamp(value) : null))
  @Column({
    type: 'timestamp',
    nullable: true,
    comment: 'Expected Time of Arrival',
  })
  etaDate: Date | null;

  @Expose()
  @Column({ nullable: true, type: 'enum', enum: ContainerStatus, default: ContainerStatus.LOADING })
  status: ContainerStatus | string | null;

  @Expose()
  @Type(() => ContainerDocument)
  containerDocuments: Relation<ContainerDocument[]>;

  @Expose()
  @CreateDateColumn()
  @Transform(({ value }) => (value ? dateToTimestamp(value) : null))
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
