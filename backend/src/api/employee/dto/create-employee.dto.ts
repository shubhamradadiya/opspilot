import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Matches,
  Min,
  MinLength,
} from 'class-validator';

export class CreateEmployeeDto {
  @ApiProperty({ example: 'John Doe', required: true })
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiProperty({ example: '9999999999', required: true })
  @IsNotEmpty()
  @Length(6, 15, { message: 'Phone number must be 6 to 15 digits long' })
  @Matches(/^[0-9]+$/, { message: 'Phone number must contain only digits' })
  @IsString()
  phone: string;

  @ApiProperty({ example: '+91', required: true })
  @IsNotEmpty()
  @IsString()
  countryCode: string;

  @ApiProperty({ example: 'IN', required: true })
  @IsNotEmpty()
  @IsString()
  isoCode: string;

  @ApiProperty({ example: 'john.doe@gmail.com', required: false })
  @IsOptional()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456', required: true })
  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @ApiProperty({ example: 25, required: true })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  perHourRate: number;

  @ApiProperty({ example: true, required: true })
  @IsNotEmpty()
  @IsBoolean()
  isClockInClockOutEnabled: boolean;

  @ApiProperty({ example: true, required: true })
  @IsNotEmpty()
  @IsBoolean()
  isInventoryEnabled: boolean;

  @ApiProperty({ example: true, required: true })
  @IsNotEmpty()
  @IsBoolean()
  isPayoutEnabled: boolean;

  @ApiProperty({ example: true, required: true })
  @IsNotEmpty()
  @IsBoolean()
  isContainerEnabled: boolean;

  @ApiProperty({ example: true, required: true })
  @IsNotEmpty()
  @IsBoolean()
  isExpenseEnabled: boolean;

  @ApiProperty({ example: true, required: true })
  @IsNotEmpty()
  @IsBoolean()
  isWalkInCustomerEnabled: boolean;

  @ApiProperty({ example: true, required: true })
  @IsNotEmpty()
  @IsBoolean()
  isRingCustomerEnabled: boolean;
}
