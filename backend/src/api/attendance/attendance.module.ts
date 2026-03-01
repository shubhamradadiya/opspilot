import { Module } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserLog } from './entity/user-logs.entity';
import { User } from '../user/entities/user.entity';
import { Payout } from '../payout/entity/payout.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserLog, User, Payout])],
  controllers: [AttendanceController],
  providers: [AttendanceService],
  exports: [AttendanceService],
})
export class AttendanceModule {}
