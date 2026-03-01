import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventory } from './entity/inventory.entity';
import { User } from '../user/entities/user.entity';
import { InventoryLog } from './entity/inventory-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Inventory, User, InventoryLog])],
  controllers: [InventoryController],
  providers: [InventoryService],
})
export class InventoryModule {}
