import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class AddLoanDto {
  @ApiProperty({
    example: 'U123456789',
    description: 'User Id',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  uid: string;

  @ApiProperty({ example: 250, description: 'Loan amount', required: true })
  @Min(0)
  @IsNumber()
  @IsNotEmpty()
  loanAmount: number;
}
