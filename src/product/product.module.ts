import { Module, Provider } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './controller/product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entity/products.schema';
import { User } from '../users/entity/users.schema';
import { AuthModule } from 'src/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Module({
  imports: [
  TypeOrmModule.forFeature([Product, User]),
  AuthModule,
  ],
  controllers: [ProductController],
   providers: [
    ProductService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    } as Provider,
  ],
  exports: [ProductService],
})
export class ProductModule {}