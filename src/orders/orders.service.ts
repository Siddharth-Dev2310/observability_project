import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { Orders } from './entity/orders.schema';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrderDto } from './DTO/create-orders.dto';
import { Product } from '../product/entity/products.schema';

@Injectable()
export class OrdersService {
    // Business logic for orders would go here
    constructor(
        @InjectRepository(Orders)
        private readonly ordersRepository: Repository<Orders>,
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        private readonly usersService: UsersService,
    ) {}

    async createOrder(orderData: CreateOrderDto, userId: number) {
        // Validate if user exists
        const user = await this.usersService.findUserById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Validate products and calculate total amount
        let totalAmount = 0;
        const validatedOrderItems: { productId: number; quantity: number; price: number; total: number; }[] = [];

        for (const item of orderData.orderItems) {
            const product = await this.productRepository.findOne({
                where: { id: item.productId }
            });

            if (!product) {
                throw new NotFoundException(`Product with ID ${item.productId} not found`);
            }

            // Check if product is available (assuming there's a price field)
            if (!product.price) {
                throw new BadRequestException(`Product ${product.id} is not available for purchase`);
            }

            // Calculate item total and add to order total
            const itemTotal = product.price * item.quantity;
            totalAmount += itemTotal;

            validatedOrderItems.push({
                ...item,
                price: product.price, // Store the price at time of order
                total: itemTotal
            });
        }

        // Create new order instance with calculated total
        const newOrder = this.ordersRepository.create({
            userId: user.id,
            orderItems: validatedOrderItems,
            totalAmount,
            status: 'PENDING',
            createdAt: new Date(),
            updatedAt: new Date()
        });

        // Save the order to database
        try {
            const savedOrder = await this.ordersRepository.save(newOrder);
            return savedOrder;
        } catch (error) {
            throw new ConflictException('Failed to create order: ' + error.message);
        }
    }

    async getOrdersByUser(userId: number) {
        return this.ordersRepository.find({ where: { userId } });
    }

    async getOrderById(orderId: number) {
        const order = await this.ordersRepository.findOne({ where: { id: orderId } });
        if (!order) {
            throw new Error('Order not found');
        }
        return order;
    }

    async updateOrderStatus(orderId: number, status: string) {
        const order = await this.ordersRepository.findOne({ where: { id: orderId } });
        if (!order) {
            throw new Error('Order not found');
        }
        order.status = status;
        return this.ordersRepository.save(order);
    }
}
