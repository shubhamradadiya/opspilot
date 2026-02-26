import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreatePayoutDto {
  @ApiProperty({
    example: 'U123456789',
    description: 'User Id',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  uid: string;

  @ApiProperty({
    example: 250,
    description: 'Pending amount : (total amount - total paid amount) for provided week or month)',
    required: true,
  })
  @Min(0)
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ example: 250, description: 'Loan amount', required: true })
  @Min(0)
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  loanAmount: number;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @IsOptional()
  employeeSignature: string;
}
