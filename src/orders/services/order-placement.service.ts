import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Orders } from '../entity/orders.schema';
import { Product } from '../../product/entity/products.schema';
import { User } from '../../users/entity/users.schema';
import { Payment } from '../../payment/entity/payment.schema';
import { EmailNotification } from '../../notification/entity/email-notification.schema';
import { Counter, Histogram, Gauge } from 'prom-client';
import { MetricsService } from '../../metrics/metrics.service';

@Injectable()
export class OrderPlacementService {
    private orderPlacementCounter: Counter<string>;
    private orderProcessingDuration: Histogram<string>;
    private paymentProcessingDuration: Histogram<string>;
    private emailProcessingDuration: Histogram<string>;
    private productValidationDuration: Histogram<string>;
    private activeOrders: Gauge<string>;

    constructor(
        @InjectRepository(Orders)
        private readonly ordersRepository: Repository<Orders>,
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Payment)
        private readonly paymentRepository: Repository<Payment>,
        @InjectRepository(EmailNotification)
        private readonly emailNotificationRepository: Repository<EmailNotification>,
        private readonly metricsService: MetricsService,
    ) {
        // Initialize metrics
        this.orderPlacementCounter = new Counter({
            name: 'orders_placed_total',
            help: 'Total number of orders placed',
            labelNames: ['status'],
            registers: [this.metricsService.getRegister()],
        });

        this.orderProcessingDuration = new Histogram({
            name: 'order_processing_duration_seconds',
            help: 'Time taken to process orders',
            buckets: [5, 10, 20, 30, 60],
            registers: [this.metricsService.getRegister()],
        });

        this.paymentProcessingDuration = new Histogram({
            name: 'payment_processing_duration_seconds',
            help: 'Time taken to process payments',
            buckets: [5, 10, 15, 20, 25],
            registers: [this.metricsService.getRegister()],
        });

        this.emailProcessingDuration = new Histogram({
            name: 'email_processing_duration_seconds',
            help: 'Time taken to send email notifications',
            buckets: [2, 5, 8, 10, 15],
            registers: [this.metricsService.getRegister()],
        });

        this.productValidationDuration = new Histogram({
            name: 'product_validation_duration_seconds',
            help: 'Time taken to validate products',
            buckets: [1, 2, 5, 8, 10],
            registers: [this.metricsService.getRegister()],
        });

        this.activeOrders = new Gauge({
            name: 'active_orders',
            help: 'Number of orders currently being processed',
            registers: [this.metricsService.getRegister()],
        });
    }

    private async simulatePaymentProcessing(orderId: number, paymentMethodId: string, amount: number): Promise<boolean> {
        const startTime = Date.now();
        const endTimer = this.paymentProcessingDuration.startTimer();
        
        // Create payment record
        const payment = this.paymentRepository.create({
            orderId,
            paymentMethodId,
            amount: parseFloat(amount.toString()), // Convert to number and handle decimals
            status: 'PROCESSING'
        });
        await this.paymentRepository.save(payment);

        try {
            // Increased to 15 seconds for better visibility
            await new Promise(resolve => setTimeout(resolve, 15000));
            const success = Math.random() < 0.95;

            // Update payment record with result
            payment.status = success ? 'COMPLETED' : 'FAILED';
            payment.processingTime = (Date.now() - startTime) / 1000; // Convert to seconds
            if (!success) {
                payment.errorMessage = 'Payment processing failed';
            }
            await this.paymentRepository.save(payment);

            if (success) {
                this.orderPlacementCounter.inc({ status: 'payment_success' });
            } else {
                this.orderPlacementCounter.inc({ status: 'payment_failed' });
            }
            return success;
        } catch (error) {
            payment.status = 'FAILED';
            payment.errorMessage = error.message;
            payment.processingTime = (Date.now() - startTime) / 1000;
            await this.paymentRepository.save(payment);
            throw error;
        } finally {
            endTimer();
        }
    }

    private async simulateEmailNotification(orderId: number, userId: number): Promise<void> {
        const startTime = Date.now();
        const endTimer = this.emailProcessingDuration.startTimer();

        // Create email notification record
        const emailNotification = this.emailNotificationRepository.create({
            orderId,
            userId,
            emailType: 'ORDER_CONFIRMATION',
            status: 'PENDING'
        });
        await this.emailNotificationRepository.save(emailNotification);

        try {
            // Increased to 8 seconds for better visibility
            await new Promise(resolve => setTimeout(resolve, 8000));
            
            // Update email notification record
            emailNotification.status = 'SENT';
            emailNotification.processingTime = (Date.now() - startTime) / 1000;
            await this.emailNotificationRepository.save(emailNotification);
            
            this.orderPlacementCounter.inc({ status: 'email_sent' });
        } catch (error) {
            emailNotification.status = 'FAILED';
            emailNotification.errorMessage = error.message;
            emailNotification.processingTime = (Date.now() - startTime) / 1000;
            await this.emailNotificationRepository.save(emailNotification);
            throw error;
        } finally {
            endTimer();
        }
    }

    private async validateProductAvailability(orderItems: any[]): Promise<void> {
        const endTimer = this.productValidationDuration.startTimer();
        try {
            for (const item of orderItems) {
                const product = await this.productRepository.findOne({
                    where: { id: item.productId }
                });

                if (!product) {
                    this.orderPlacementCounter.inc({ status: 'product_not_found' });
                    throw new NotFoundException(`Product ${item.productId} no longer available`);
                }

                // Increased to 2 seconds per product for better visibility
                await new Promise(resolve => setTimeout(resolve, 2000));

                if (!product.isActive) {
                    this.orderPlacementCounter.inc({ status: 'product_inactive' });
                    throw new BadRequestException(`Product ${product.id} is not active`);
                }
            }
            this.orderPlacementCounter.inc({ status: 'products_validated' });
        } finally {
            endTimer();
        }
    }

    private async validateUserStatus(userId: number): Promise<void> {
        const user = await this.userRepository.findOne({
            where: { id: userId }
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Simulate complex user validation
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second

        if (!user.isActive) {
            throw new BadRequestException('User account is not active');
        }

        // Add more user validations as needed
    }

    async processOrderPlacement(orderId: number, paymentMethodId: string, userId: number): Promise<any> {
        const endTimer = this.orderProcessingDuration.startTimer();
        this.activeOrders.inc();
        
        try {
            const order = await this.ordersRepository.findOne({
                where: { id: orderId }
            });

            if (!order) {
                this.orderPlacementCounter.inc({ status: 'order_not_found' });
                throw new NotFoundException('Order not found');
            }

            if (order.userId !== userId) {
                this.orderPlacementCounter.inc({ status: 'unauthorized_access' });
                throw new ConflictException('Order does not belong to this user');
            }

            if (order.status !== 'PENDING') {
                this.orderPlacementCounter.inc({ status: 'invalid_state' });
                throw new BadRequestException('Order is not in PENDING state');
            }

            // 1. Validate user status (1 second)
            await this.validateUserStatus(userId);
            this.orderPlacementCounter.inc({ status: 'user_validated' });

            // 2. Validate all products in order (2 sec per product)
            await this.validateProductAvailability(order.orderItems);

            // 3. Process payment (15 seconds)
            const paymentSuccess = await this.simulatePaymentProcessing(
                orderId,
                paymentMethodId,
                parseFloat(order.totalAmount.toString()) // Ensure proper number conversion
            );
            if (!paymentSuccess) {
                throw new BadRequestException('Payment processing failed');
            }

            // 4. Update order status
            order.status = 'PROCESSING';
            await this.ordersRepository.save(order);
            this.orderPlacementCounter.inc({ status: 'processing' });

            // 5. Send confirmation email (8 seconds)
            await this.simulateEmailNotification(orderId, userId);

            // 6. Final order update
            order.status = 'PLACED';
            const finalOrder = await this.ordersRepository.save(order);
            this.orderPlacementCounter.inc({ status: 'completed' });

            // Update metrics
            this.orderPlacementCounter.inc();
            endTimer();

            return {
                message: 'Order successfully placed',
                order: finalOrder
            };
        } catch (error) {
            endTimer();
            throw error;
        }
    }
}