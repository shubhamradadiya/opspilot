import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class DeleteUserLogsManuallyDto {
  @ApiProperty({
    example: ['UL1234567890', 'UL1234567891'],
    description: 'User log IDs to delete',
  })
  @IsString({ each: true })
  @ArrayNotEmpty()
  @IsArray()
  userLogIds: string[];
}
