import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'updateduser@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'newpassword123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'John Sen' })
  @IsString()
  name: string;

  @ApiProperty({ example: 20 })
  @IsNumber()
  age: number;

  @ApiProperty({ example: '1993-11-01' })
  @IsString()
  dateOfBirth: Date;

  @ApiProperty({ example: true })
  @IsString()
  isActive: boolean;
}
