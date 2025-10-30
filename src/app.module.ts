import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
  Provider,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { MetricsModule } from './metrics/metrics.module';
import { ProductModule } from './product/product.module';
import { OrdersModule } from './orders/orders.module';
import { AuthModule } from './auth/auth.module';
import { PaymentModule } from './payment/payment.module';
import { NotificationModule } from './notification/notification.module';
import { Payment } from './payment/entity/payment.schema';
import { EmailNotification } from './notification/entity/email-notification.schema';

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
      entities: [Payment, EmailNotification],
    }),
    
    //! Feature Modules
    UsersModule,
    ProductModule,
    OrdersModule,
    AuthModule,
    MetricsModule,
    PaymentModule,
    NotificationModule,
  ],
  controllers: [  ],
  providers: [   ],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}