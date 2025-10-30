import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Orders } from '../../orders/entity/orders.schema';

@Entity()
export class Payment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    orderId: number;

    @Column({ 
        type: 'decimal', 
        precision: 10, 
        scale: 2,
        transformer: {
            to: (value: number) => value,
            from: (value: string) => parseFloat(value)
        }
    })
    amount: number;

    @Column()
    paymentMethodId: string;

    @Column({
        type: 'enum',
        enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'],
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