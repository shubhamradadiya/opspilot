import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './database/data-source';
import { ConfigModule } from '@nestjs/config';
import { ApiModule } from './api/api.module';
import { AcceptLanguageResolver, HeaderResolver, I18nModule } from 'nestjs-i18n';
import { join } from 'path';
import { Languages } from './constants/app.constant';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      cache: true,
    }),
    I18nModule.forRoot({
      fallbackLanguage: Languages.EN,
      loaderOptions: { path: join(__dirname, '/i18n/'), watch: true },
      typesOutputPath: join(__dirname, '../src/generated/i18n.generated.ts'),
      resolvers: [{ use: HeaderResolver, options: ['Accept-Language'] }, AcceptLanguageResolver],
    }),
    //Module import
    ApiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
