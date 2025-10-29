import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { MetricsModule } from './metrics/metrics.module';

@Module({
  imports: [
    //! Env variables globally
    ConfigModule.forRoot({ isGlobal: true }),

    //! PostgreSQL config
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true,
    }),

    UsersModule,
    MetricsModule,
  ],
  controllers: [  ],
  providers: [   ],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Configure middleware here if needed
  }
}