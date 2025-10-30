import { IsNumber, IsArray, IsPositive, ValidateNested, Min, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class OrderItemDto {
    @ApiProperty({ 
      example: 1, 
      description: 'Product ID to order' 
    })
    @IsNumber()
    @IsPositive()
    productId: number;

    @ApiProperty({ 
      example: 2, 
      description: 'Quantity of product to order',
      minimum: 1 
    })
    @IsNumber()
    @Min(1)
    quantity: number;
}

export class CreateOrderDto {
    @IsArray()
    @ArrayMinSize(1)
    @ApiProperty({ 
      type: [OrderItemDto],
      description: 'Array of order items. Must contain at least one item.'
    })
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    orderItems: OrderItemDto[];
}