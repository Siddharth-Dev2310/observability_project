import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './controller/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/users.schema';
import { MetricsService } from '../metrics/metrics.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, MetricsService],
  exports: [UsersService],
})
export class UsersModule {}
