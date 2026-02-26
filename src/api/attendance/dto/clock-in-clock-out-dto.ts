import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ClockInClockOutDto {
  @ApiProperty({
    example: 'U123456789',
    description: 'User Id',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  uid: string;

  @ApiPropertyOptional({
    example: 'UL123456789',
    description: 'User Log Id',
    required: false,
  })
  @IsOptional()
  @IsString()
  ulId?: string;
}
