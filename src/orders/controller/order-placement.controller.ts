import { Controller, Post, Body, UseGuards, Req, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { OrderPlacementService } from '../services/order-placement.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PlaceOrderDto } from '../DTO/place-order.dto';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import type { Request } from 'express';

@ApiTags('order-placement')
@Controller('order-placement')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
export class OrderPlacementController {
    constructor(private readonly orderPlacementService: OrderPlacementService) {}

    @Post('place')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Place an order with payment and confirmation' })
    @ApiResponse({ status: 200, description: 'Order successfully placed' })
    @ApiResponse({ status: 400, description: 'Invalid order state or payment failure' })
    @ApiResponse({ status: 404, description: 'Order not found' })
    async placeOrder(
        @Body() placeOrderDto: PlaceOrderDto,
        @Req() req: Request
    ) {
        return this.orderPlacementService.processOrderPlacement(
            placeOrderDto.orderId,
            placeOrderDto.paymentMethodId,
            req.user.id
        );
    }
}