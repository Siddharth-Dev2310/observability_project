import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Param,
  UseGuards,
  Req,
  HttpStatus,
  HttpCode,
  ParseIntPipe,
} from '@nestjs/common';
import { OrdersService } from '../orders.service';
import { CreateOrderDto } from '../DTO/create-orders.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import type { Request } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('orders')
@Controller('orders')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard) // Protect all order routes
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createOrder(
    @Body() orderData: CreateOrderDto,
    @Req() req: Request,
  ) {
    return this.ordersService.createOrder(orderData, req.user.id);
  }

  @Get('my-orders')
  @HttpCode(HttpStatus.OK)
  async getMyOrders(@Req() req: Request) {
    return this.ordersService.getOrdersByUser(req.user.id);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getOrder(@Param('id', ParseIntPipe) orderId: number) {
    return this.ordersService.getOrderById(orderId);
  }

  @Put(':id/status')
  @HttpCode(HttpStatus.OK)
  async updateOrderStatus(
    @Param('id', ParseIntPipe) orderId: number,
    @Body('status') status: string,
  ) {
    return this.ordersService.updateOrderStatus(orderId, status);
  }
}
