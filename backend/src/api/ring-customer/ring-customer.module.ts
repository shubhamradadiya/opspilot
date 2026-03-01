import { Module } from '@nestjs/common';
import { RingCustomerService } from './ring-customer.service';
import { RingCustomerController } from './ring-customer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RingCustomer } from './entity/ring-customer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RingCustomer])],
  controllers: [RingCustomerController],
  providers: [RingCustomerService],
})
export class RingCustomerModule {}
