import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CheckStatusDto {
  @ApiProperty({ example: 'IN', required: true })
  @IsNotEmpty()
  @IsString()
  isoCode: string;

  @ApiProperty({ example: '+91', required: true })
  @IsNotEmpty()
  @IsString()
  countryCode: string;

  @ApiProperty({ example: '1234567890', required: true })
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;
}
