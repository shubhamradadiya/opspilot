import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional } from 'class-validator';

export class UpdateUserProfileDto {
  @ApiPropertyOptional({ example: 'John Doe', required: false })
  @IsOptional()
  fullName: string;

  @ApiPropertyOptional({ example: 'john.doe@example.com', required: false })
  @IsOptional()
  @IsEmail()
  email: string;

  // Profile picture
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @IsOptional()
  profilePicture: string;
}
