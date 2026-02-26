import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { ContainerStatus } from 'src/constants/user.constant';

export class UpdateContainerDto {
  @ApiProperty({
    example: '59c245671',
    description: 'Booking number',
  })
  @IsString({ message: i18nValidationMessage('validation.isString') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.isNotEmpty') })
  bookingNumber: string;

  @ApiPropertyOptional({
    example: 5,
    description: 'Number of containers',
    nullable: true,
  })
  @Min(0, {
    message: i18nValidationMessage('validation.min'),
  })
  @Max(999, {
    message: i18nValidationMessage('validation.max'),
  })
  @IsNumber({}, { message: i18nValidationMessage('validation.isNumber') })
  @Type(() => Number)
  @IsOptional()
  containerCount: number;

  @ApiPropertyOptional({
    example: 510,
    description: 'Average weight of containers in kgs',
    nullable: true,
  })
  @Min(0, {
    message: i18nValidationMessage('validation.min'),
  })
  @Max(99999999, {
    message: i18nValidationMessage('validation.max'),
  })
  @IsNumber({}, { message: i18nValidationMessage('validation.isNumber') })
  @Type(() => Number)
  @IsOptional()
  avgWeightInKgs: number;

  @ApiPropertyOptional({
    example: 1705276800000,
    description: 'Date for which booking is being loading',
    nullable: true,
  })
  @Min(0, {
    message: i18nValidationMessage('validation.min'),
  })
  @IsInt({ message: i18nValidationMessage('validation.isInt') })
  @Type(() => Number)
  @IsOptional()
  loadingDate: number;

  @ApiPropertyOptional({
    example: 1705276800000,
    description: 'Date on which container is expected to depart from origin (ETD)',
    nullable: true,
  })
  @Min(0, {
    message: i18nValidationMessage('validation.min'),
  })
  @IsInt({ message: i18nValidationMessage('validation.isInt') })
  @Type(() => Number)
  @IsOptional()
  etdDate: number;

  @ApiPropertyOptional({
    example: 1705276800000,
    description: 'Date on which container is expected to arrive at destination (ETA)',
    nullable: true,
  })
  @Min(0, {
    message: i18nValidationMessage('validation.min'),
  })
  @IsInt({ message: i18nValidationMessage('validation.isInt') })
  @Type(() => Number)
  @IsOptional()
  etaDate: number;

  @ApiProperty({
    example: ContainerStatus.LOADING,
    description: `Container status ${Object.values(ContainerStatus).join(', ')}`,
    type: 'string',
    enum: ContainerStatus,
  })
  @IsEnum(ContainerStatus, {
    message: i18nValidationMessage('validation.isEnum'),
  })
  @IsNotEmpty({ message: i18nValidationMessage('validation.isNotEmpty') })
  status: string;

  @ApiProperty({
    example: 'CD1234567890, CD1234567891, CD1234567892',
    description: 'Container document IDs to delete',
    required: false,
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.isString') })
  deleteDocumentIds?: string;

  @ApiProperty({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    required: false,
    description: 'Array of container documents to upload',
  })
  @IsOptional()
  @IsString({ each: true, message: i18nValidationMessage('validation.isString') })
  containerDocuments?: string[];
}
