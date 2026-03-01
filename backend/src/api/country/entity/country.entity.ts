import { Expose } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'countries' })
export class Country {
  @Expose()
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ nullable: true, type: 'text' })
  @Expose()
  name: string;

  @Column({ nullable: true, type: 'text' })
  @Expose()
  officialName: string;

  @Column({ nullable: true, type: 'text' })
  @Expose()
  flagPng: string;

  @Column({ nullable: true, type: 'text' })
  @Expose()
  flagSvg: string;

  @Column({ nullable: true, type: 'text' })
  @Expose()
  isoCode: string;

  @Column({ nullable: true, type: 'text' })
  @Expose()
  isoCode3: string;

  @Column({ nullable: true, type: 'text' })
  @Expose()
  phoneCode: string;

  @Column({ nullable: true, type: 'text' })
  @Expose()
  suffixes: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
