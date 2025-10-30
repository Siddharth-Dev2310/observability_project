import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsString, MinLength } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Sample Product' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'This is a sample product description.' })
  @IsString()
  description: string;

  @ApiProperty({ example: 99.99 })
  @IsNumber()
  price: number;

  @ApiProperty({ example: 100 })
  @IsNumber()
  stock: number;
}
