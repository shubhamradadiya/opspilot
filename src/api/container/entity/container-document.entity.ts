import { Expose, Transform, Type } from 'class-transformer';
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
import { isUrlValid } from 'src/helpers/utils.helper';
import { castToStorage } from 'src/helpers/file-upload.helper';
import { DocumentType } from 'src/constants/app.constant';
import { Container } from './container.entity';

@Entity('container_documents')
export class ContainerDocument {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Transform(({ value }) => Number(value))
  id: number;

  @Expose()
  @Column({ unique: true })
  cdId: string;

  @Expose()
  @Type(() => Container)
  @ManyToOne(() => Container, container => container.id, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  container: Relation<Container>;

  @Expose()
  @Column({ nullable: true, default: null })
  @Transform(({ value }) => (isUrlValid(value) ? value : castToStorage(value)))
  document: string;

  @Expose()
  @Column({ nullable: true, type: 'enum', enum: DocumentType })
  documentType: DocumentType | string | null;

  @Expose()
  @Column({ nullable: true, comment: 'Size in bytes' })
  documentSize: string;

  @Expose()
  @Column({ nullable: true })
  documentName: string;

  @Expose()
  @CreateDateColumn()
  @Transform(({ value }) => (value ? dateToTimestamp(value) : null))
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
