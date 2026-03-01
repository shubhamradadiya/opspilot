import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsInt,
  IsPositive,
  IsOptional,
  IsNumber,
  IsEnum,
  IsString,
} from 'class-validator';
import { WalkInCustomerStatus } from 'src/constants/user.constant';

export class UpdateWalkInCustomerDto {
  @ApiProperty({
    example: 1705276800000,
    description: 'Date for which walk-in customer entry is being added',
  })
  @IsPositive()
  @IsInt()
  @IsNotEmpty()
  walkInCustomerDate: number;

  @ApiProperty({
    example: 'John Doe',
    description: 'Customer name',
  })
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @ApiPropertyOptional({
    example: 2500,
    description: 'Car tires count',
  })
  @IsPositive()
  @IsInt()
  @IsOptional()
  carTiresCount?: number;

  @ApiPropertyOptional({
    example: 35,
    description: 'Car tires price',
    required: false,
  })
  @Type(() => Number)
  @IsPositive()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsOptional()
  carTiresPrice?: number;

  @ApiPropertyOptional({
    example: 1700,
    description: 'Truck tires count',
    required: false,
  })
  @IsPositive()
  @IsInt()
  @IsOptional()
  truckTiresCount?: number;

  @ApiPropertyOptional({
    example: 40,
    description: 'Truck tires price',
    required: false,
  })
  @Type(() => Number)
  @IsPositive()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsOptional()
  truckTiresPrice?: number;

  @ApiPropertyOptional({
    example: 2100,
    description: 'Rims count',
    required: false,
  })
  @IsPositive()
  @IsInt()
  @IsOptional()
  rimsCount?: number;

  @ApiPropertyOptional({
    example: 50.5,
    description: 'Rims price',
    required: false,
  })
  @Type(() => Number)
  @IsPositive()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsOptional()
  rimsPrice?: number;

  @ApiProperty({
    example: 26155,
    description:
      'Total amount ( = carTiresPrice * carTiresCount + truckTiresPrice * truckTiresCount + rimsPrice * rimsCount)',
  })
  @Type(() => Number)
  @IsPositive()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  totalAmount: number;

  @ApiProperty({
    example: WalkInCustomerStatus.PENDING,
    description: `Walk-in customer status ${Object.values(WalkInCustomerStatus).join(', ')}`,
  })
  @IsEnum(WalkInCustomerStatus)
  @IsNotEmpty()
  status: string;
}
