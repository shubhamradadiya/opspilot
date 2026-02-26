import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ example: 'password', required: true })
  @IsString()
  @MinLength(6)
  oldPassword: string;

  @ApiProperty({ example: 'newpassword', required: true })
  @IsString()
  @MinLength(6)
  newPassword: string;
}
