import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { AccessTokenModule } from '../access-token/access-token.module';
import { RefreshTokenModule } from '../refresh-token/refresh-token.module';
import { JwtStrategy } from 'src/passport/jwt.strategy';
import { UserService } from '../user/user.service';
import { Inventory } from '../inventory/entity/inventory.entity';
import { Container } from '../container/entity/container.entity';
import { Expense } from '../expense/entity/expense.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Inventory, Container, Expense]),
    AccessTokenModule,
    RefreshTokenModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, UserService],
})
export class AuthModule {}
