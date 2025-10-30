import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'Road 123' })
  @IsString()
  address?: string | null;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  name: string;

  @ApiProperty({ example: 30 })
  @IsNumber()
  age: number;

  @ApiProperty({ example: '1993-01-01' })
  @IsString()
  dateOfBirth: Date;

  @ApiProperty({ example: true })
  @IsString()
  isActive: boolean;
}
