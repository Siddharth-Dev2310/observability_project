import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('orders')
export class Orders {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @Column('json')
    orderItems: {
        productId: number;
        quantity: number;
        price: number;
        total: number;
    }[];

    @Column('decimal', { precision: 10, scale: 2, transformer: {
        to: (value: number) => value,
        from: (value: string) => parseFloat(value)
    }})
    totalAmount: number;

    @Column()
    status: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP'
    })
    updatedAt: Date;
}
