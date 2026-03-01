import { Module } from '@nestjs/common';
import { AccessTokenService } from './access-token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { AccessToken } from './entities/access-token.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccessToken]),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('APP_KEY'),
        signOptions: { expiresIn: '28 days' },
      }),
      inject: [ConfigService],
    }),
    UserModule,
  ],
  providers: [AccessTokenService],
  exports: [AccessTokenService],
})
export class AccessTokenModule {}
