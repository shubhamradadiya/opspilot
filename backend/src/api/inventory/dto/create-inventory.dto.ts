import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsPositive, Min } from 'class-validator';

export class CreateInventoryDto {
  @ApiProperty({
    example: 1705276800000,
    description: 'Date for which inventory is being added',
  })
  @IsPositive()
  @IsInt()
  @IsNotEmpty()
  inventoryDate: number;

  @ApiPropertyOptional({
    example: 2500,
    description: 'Car tires count',
    required: false,
  })
  @Min(0)
  @IsInt()
  @IsOptional()
  carTiresCount?: number;

  @ApiPropertyOptional({
    example: 1500,
    description: 'Truck tires count',
    required: false,
  })
  @Min(0)
  @IsInt()
  @IsOptional()
  truckTiresCount?: number;

  @ApiPropertyOptional({
    example: 1000,
    description: 'Mixed tires count',
    required: false,
  })
  @Min(0)
  @IsInt()
  @IsOptional()
  mixedTiresCount?: number;

  @ApiPropertyOptional({
    example: 2000,
    description: 'Bales',
    required: false,
  })
  @Min(0)
  @IsInt()
  @IsOptional()
  bales?: number;
}
