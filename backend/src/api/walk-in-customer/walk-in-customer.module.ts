import { Module } from '@nestjs/common';
import { WalkInCustomerService } from './walk-in-customer.service';
import { WalkInCustomerController } from './walk-in-customer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalkInCustomer } from './entity/walk-in-customer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WalkInCustomer])],
  controllers: [WalkInCustomerController],
  providers: [WalkInCustomerService],
})
export class WalkInCustomerModule {}
