import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDefined,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Matches,
  Min,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class UpdateEmployeeDto {
  @ApiProperty({ example: 'John Doe', required: false })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiProperty({ example: '9999999999', required: false })
  @IsOptional()
  @Length(6, 15, { message: 'Phone number must be 6 to 15 digits long' })
  @Matches(/^[0-9]+$/, { message: 'Phone number must contain only digits' })
  @IsString()
  phone?: string;

  @ApiProperty({ example: '+91', required: false })
  @ValidateIf(o => o.phone)
  @IsDefined({ message: 'ISO code is required when phone is provided' })
  @IsString()
  countryCode?: string;

  @ApiProperty({ example: 'IN', required: false })
  @ValidateIf(o => o.phone)
  @IsDefined({ message: 'Country code is required when phone is provided' })
  @IsString()
  isoCode?: string;

  @ApiProperty({ example: 'john.doe@gmail.com', required: false })
  @IsOptional()
  @IsString()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: '123456', required: false })
  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password?: string;

  @ApiProperty({ example: 25, required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  perHourRate?: number;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isClockInClockOutEnabled?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isInventoryEnabled?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isPayoutEnabled?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isContainerEnabled?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isExpenseEnabled?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isWalkInCustomerEnabled?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isRingCustomerEnabled?: boolean;
}
