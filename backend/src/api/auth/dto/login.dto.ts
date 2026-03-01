import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  ValidateIf,
} from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'john.doe@gmail.com',
    required: false,
  })
  @ValidateIf(o => !o.phone)
  @IsDefined({ message: 'Email is required' })
  @IsString()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: '+91', required: false })
  @ValidateIf(o => o.phone)
  @IsDefined({ message: 'Country code is required when phone is provided' })
  @IsString()
  countryCode?: string;

  @ApiProperty({ example: 'IN', required: false })
  @ValidateIf(o => o.phone)
  @IsDefined({ message: 'ISO code is required when phone is provided' })
  @IsString()
  isoCode?: string;

  @ApiProperty({ example: '9999999999', required: false })
  @ValidateIf(o => !o.email)
  @IsDefined({ message: 'Email or phone is required' })
  @Length(6, 15, { message: 'Phone number must be 6 to 15 digits long' })
  @Matches(/^[0-9]+$/, { message: 'Phone number must contain only digits' })
  @IsString()
  phone?: string;

  @ApiProperty({ example: '123456', required: true })
  @IsNotEmpty()
  @IsString()
  password: string;
}
