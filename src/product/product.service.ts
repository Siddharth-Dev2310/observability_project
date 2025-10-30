import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entity/products.schema';
import { CreateProductDto } from './DTO/create-product.dto';
import { UpdateProductDto } from './DTO/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async createProduct(productData: CreateProductDto, user: any) {
    if (!user || !user.isActive) {
      throw new UnauthorizedException('User is not active');
    }

    const existingProduct = await this.productsRepository.findOne({
      where: { name: productData.name, userId: user.id },
    });

    if (existingProduct) {
      throw new ConflictException('Product already exists');
    }

    const product = this.productsRepository.create({
      ...productData,
      userId: user.id,
    });

    await this.productsRepository.save(product);
    return product;
  }

  async getAllProducts() {
    return this.productsRepository.find();
  }

  async getProductById(id: number) {
    const product = await this.productsRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async deleteProduct(id: number) {
    return this.productsRepository.delete(id);
  }

  async updateProduct(id: number, updateData: UpdateProductDto, user: any) {
    const existingProduct = await this.productsRepository.findOne({ where: { id } });

    if (!existingProduct) {
      throw new NotFoundException('Product not found');
    }

    if (existingProduct.userId !== user.id) {
      throw new UnauthorizedException('You are not authorized to update this product');
    }

    await this.productsRepository.update(id, updateData);
    return this.productsRepository.findOne({ where: { id } });
  }
}
