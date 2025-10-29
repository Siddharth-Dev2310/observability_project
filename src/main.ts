import './tracing';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ResponseInterceptor } from './utils/ResponseInterceptor.utils';
import { AllExceptionsFilter } from './utils/AllExceptionsFilter.utils';
import { WinstonModule } from 'nest-winston';
import { LoggerErrorInterceptor } from 'nestjs-pino';
import * as winston from 'winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp({
              format: 'YYYY-MM-DD HH:mm:ss'
            }),
            winston.format.printf(({ level, message, timestamp }) => {
              return `[${timestamp}] ${level}: ${message}`;
            })
          ),
        }),
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
          )
        })
      ],
    }),
  });
  
  // Swagger setup
  const config = new DocumentBuilder()
  .setTitle('Observability Project API')
  .setDescription('API documentation for Observability Project')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  
  // Global Response Interceptor
  // Global Interceptors and Filters
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  
  await app.listen(process.env.PORT || 3000);

  console.log(`Application is running on:  http://localhost:${process.env.PORT || 3000}`);
  console.log(`Swagger docs available at: http://localhost:${process.env.PORT || 3000}/api-docs`);
}
bootstrap();