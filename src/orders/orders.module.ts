import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './controller/orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Orders } from './entity/orders.schema';
import { User } from '../users/entity/users.schema';
import { Product } from '../product/entity/products.schema';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { OrderPlacementService } from './services/order-placement.service';
import { MetricsModule } from '../metrics/metrics.module';
import { OrderPlacementController } from './controller/order-placement.controller';
import { EmailNotification } from 'src/notification/entity/email-notification.schema';
import { Payment } from 'src/payment/entity/payment.schema';

@Module({
  imports: [
    TypeOrmModule.forFeature([Orders, User, Product, Payment, EmailNotification]),
    UsersModule,
    AuthModule,
    MetricsModule,
  ],
  controllers: [OrdersController, OrderPlacementController],
  providers: [OrdersService, OrderPlacementService],
  exports: [OrdersService, OrderPlacementService],
})
export class OrdersModule {}
