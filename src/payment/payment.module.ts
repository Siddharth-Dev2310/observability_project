import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entity/payment.schema';

@Module({
    imports: [TypeOrmModule.forFeature([Payment])],
    exports: [TypeOrmModule],
})
export class PaymentModule {}