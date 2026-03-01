import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { UserModule } from './user/user.module';
import { AccessTokenModule } from './access-token/access-token.module';
import { RefreshTokenModule } from './refresh-token/refresh-token.module';
import { AuthModule } from './auth/auth.module';
import { EmployeeModule } from './employee/employee.module';
import { CountryModule } from './country/country.module';
import { AttendanceModule } from './attendance/attendance.module';
import { PayoutModule } from './payout/payout.module';
import { InventoryModule } from './inventory/inventory.module';
import { ContainerModule } from './container/container.module';
import { ExpenseModule } from './expense/expense.module';
import { RingCustomerModule } from './ring-customer/ring-customer.module';
import { WalkInCustomerModule } from './walk-in-customer/walk-in-customer.module';

@Module({
  controllers: [ApiController],
  providers: [ApiService],
  imports: [
    AuthModule,
    AccessTokenModule,
    RefreshTokenModule,
    UserModule,
    EmployeeModule,
    CountryModule,
    AttendanceModule,
    PayoutModule,
    InventoryModule,
    ContainerModule,
    ExpenseModule,
    RingCustomerModule,
    WalkInCustomerModule,
  ],
})
export class ApiModule {}
