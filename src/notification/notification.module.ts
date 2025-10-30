import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailNotification } from './entity/email-notification.schema';

@Module({
    imports: [TypeOrmModule.forFeature([EmailNotification])],
    exports: [TypeOrmModule],
})
export class NotificationModule {}