import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';
import { ExpenseType } from 'src/constants/app.constant';

export class UpdateExpenseDto {
  @ApiProperty({
    example: 1705276800000,
    description: 'Date for which expense is being added',
  })
  @IsPositive()
  @IsInt()
  @IsNotEmpty()
  expenseDate: number;

  @ApiProperty({
    example: 'John Doe',
    description: 'Vendor name',
  })
  @IsString()
  @IsNotEmpty()
  vendorName: string;

  @ApiProperty({
    example: 1000,
    description: 'Total expense',
  })
  @Min(0)
  @IsNumber()
  @IsNotEmpty()
  totalExpense: number;

  @ApiPropertyOptional({ example: '', description: 'Description of the expense' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: ExpenseType.MANUAL,
    description: `Expense type ${Object.values(ExpenseType).join(', ')}`,
  })
  @IsEnum(ExpenseType)
  @IsNotEmpty()
  expenseType: string;

  @ApiPropertyOptional({
    example: 'U1234567890',
    description: 'Vendor id',
  })
  @IsString()
  @IsOptional()
  vendorId?: string;
}
