import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import morgan from 'morgan';
import { join } from 'path';
import { AllExceptionsFilter } from './helpers/exceptions-filter.helper';
import basicAuth from 'express-basic-auth';
import { I18nValidationPipe } from 'nestjs-i18n';
import { I18nValidationExceptionFilter } from './helpers/i18n-validation-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  const swaggerUsername = configService.get('SWAGGER_USERNAME')! as string;
  const swaggerPassword = configService.get('SWAGGER_PASSWORD')! as string;
  /**
   *
   * Swagger Documentation
   */
  app.use(
    ['/api/documentation'],
    basicAuth({
      challenge: true,
      users: { [swaggerUsername]: swaggerPassword },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle(configService.get('APP_NAME') as string)
    .setDescription(`APIs for ${configService.get('APP_NAME') as string} app.`)
    .addServer(configService.get('APP_URL') as string)
    .setVersion(configService.get('API_VERSION') as string)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/documentation', app, document, {
    swaggerOptions: { persistAuthorization: true, docExpansion: 'none' },
    customfavIcon: `${configService.get<string>('APP_URL')}/images/favicon.ico`,
    customSiteTitle: `${configService.get('APP_NAME') as string} | API Documentation`,
  });

  // // Header for public assets
  // app.use((req, res, next) => {
  //   if (req.url.startsWith('/storage')) {
  //     res.setHeader('Access-Control-Allow-Origin', '*');
  //     next();
  //   }
  // });

  // Static Assets
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.useStaticAssets(join(__dirname, '..', 'src/assets'));
  app.useStaticAssets(join(__dirname, '..', 'src/views'));
  app.setBaseViewsDir(join(__dirname, '..', 'src/views'));
  app.setViewEngine('ejs');

  app.use(morgan('dev'));

  // Validation
  app.useGlobalPipes(
    new I18nValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  // Exception filter
  const { httpAdapter } = app.get(HttpAdapterHost);

  app.useGlobalFilters(
    new AllExceptionsFilter(httpAdapter),
    new I18nValidationExceptionFilter({ detailedErrors: true }),
  );

  // Cors
  const allowedOrigins = configService.get<string>('CORS_DOMAINS') || '';
  const allowedOriginsArray = allowedOrigins.split(',').map((item: string) => item.trim());

  app.enableCors({
    origin: allowedOriginsArray,
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
    credentials: true,
  });

  await app.listen(configService.get<string>('PORT') as string, () => {
    console.log(`Application running on: ${configService.get('APP_URL') as string}`);
  });
}
bootstrap();
