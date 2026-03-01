import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';
import { RingCustomerStatus } from 'src/constants/user.constant';

export class CreateRingCustomerDto {
  @ApiProperty({
    example: 1705276800000,
    description: 'Date for which ring customer entry is being added',
  })
  @IsPositive()
  @IsInt()
  @IsNotEmpty()
  ringCustomerDate: number;

  @ApiProperty({
    example: 'John Doe',
    description: 'Customer name',
  })
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @ApiProperty({
    example: 2500,
    description: 'Ordered ring count',
  })
  @Min(0)
  @IsInt()
  @IsNotEmpty()
  orderedRingCount: number;

  @ApiProperty({
    example: 60,
    description: 'Price',
  })
  @Min(0)
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiPropertyOptional({
    example: 10.5,
    description: 'Delivery fee',
  })
  @Min(0)
  @IsNumber()
  @IsOptional()
  deliveryFee?: number;

  @ApiPropertyOptional({
    example: RingCustomerStatus.PENDING,
    description: `Ring customer status ${Object.values(RingCustomerStatus).join(', ')}`,
  })
  @IsEnum(RingCustomerStatus)
  @IsOptional()
  status?: string;
}
