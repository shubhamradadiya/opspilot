import { Module } from '@nestjs/common';
import { PayoutService } from './payout.service';
import { PayoutController } from './payout.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payout } from './entity/payout.entity';
import { UserModule } from '../user/user.module';
import { UserLog } from '../attendance/entity/user-logs.entity';
import { AttendanceModule } from '../attendance/attendance.module';
import { ExpenseModule } from '../expense/expense.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payout, UserLog]),
    UserModule,
    AttendanceModule,
    ExpenseModule,
  ],
  controllers: [PayoutController],
  providers: [PayoutService],
  exports: [],
})
export class PayoutModule {}
