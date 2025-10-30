import { IsNumber, IsArray, IsString, ValidateNested, IsOptional, IsPositive, Min, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrderItemDto {
    @ApiProperty({ 
      example: 1, 
      description: 'Product ID to update',
      required: false 
    })
    @IsNumber()
    @IsPositive()
    @IsOptional()
    productId?: number;

    @ApiProperty({ 
      example: 2, 
      description: 'New quantity of product',
      minimum: 1,
      required: false 
    })
    @IsNumber()
    @Min(1)
    @IsOptional()
    quantity?: number;
}

export class UpdateOrderDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UpdateOrderItemDto)
    @IsOptional()
    @ArrayMinSize(1)
    @ApiProperty({ 
      type: [UpdateOrderItemDto],
      description: 'Array of order items to update. Must contain at least one item if provided.',
      required: false 
    })
    orderItems?: UpdateOrderItemDto[];

    @ApiProperty({ 
      enum: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
      description: 'New status for the order',
      required: false 
    })
    @IsString()
    @IsOptional()
    status?: string;
}