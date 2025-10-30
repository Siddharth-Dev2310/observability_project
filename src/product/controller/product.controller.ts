import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Put,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ProductService } from '../product.service';
import { CreateProductDto } from '../DTO/create-product.dto';
import { UpdateProductDto } from '../DTO/update-product.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import type { Request } from 'express';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('products')
@ApiTags('products')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'Product has been created successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
  async createProduct(
    @Req() req: Request,
    @Body() productData: CreateProductDto,
  ) {
    console.log("req.user: " ,req.user);
    const user = req.user;
    return this.productService.createProduct(productData, user);
  }

  @Get()
  async getAllProducts() {
    return this.productService.getAllProducts();
  }

  @Get(':id')
  async getProductById(@Param('id') id: number) {
    return this.productService.getProductById(id);
  }

  @Put(':id')
  async updateProduct(
    @Param('id') id: number,
    @Body() updateData: UpdateProductDto,
    @Req() req: Request,
  ) {
    const user = req.user;
    return this.productService.updateProduct(id, updateData, user);
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: number) {
    return this.productService.deleteProduct(id);
  }
}
