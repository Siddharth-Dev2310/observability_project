import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Orders } from '../../orders/entity/orders.schema';

@Entity()
export class EmailNotification {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    orderId: number;

    @Column()
    userId: number;

    @Column()
    emailType: string;

    @Column({
        type: 'enum',
        enum: ['PENDING', 'SENT', 'FAILED'],
        default: 'PENDING'
    })
    status: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    processingTime: number;

    @Column({ nullable: true })
    errorMessage: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Orders)
    @JoinColumn({ name: 'orderId' })
    order: Orders;
}