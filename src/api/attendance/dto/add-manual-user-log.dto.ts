import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class AddManualUserLogDto {
  @ApiProperty({
    example: 'U123456789',
    description: 'User Id',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  uid: string;

  @ApiProperty({
    example: 1705276800000,
    description: 'Checked-in timestamp in milliseconds',
    required: true,
  })
  @IsPositive()
  @IsInt()
  @IsNotEmpty()
  checkedInAt: number;

  @ApiProperty({
    example: 1705276800000,
    description: 'Checked-out timestamp in milliseconds',
    required: true,
  })
  @IsPositive()
  @IsInt()
  @IsNotEmpty()
  checkedOutAt: number;
}
