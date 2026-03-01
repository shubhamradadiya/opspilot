import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({ example: 'admin@opspilot.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
