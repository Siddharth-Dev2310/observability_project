import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from '../users.service';
import { CreateUserDto } from '../DTO/create-users.dto';
import { UpdateUserDto } from '../DTO/update-users.dto';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  @Public()
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Get('by-email')
  @Public()
  async getUserByEmail(@Query('email') email: string) {
    const user = await this.usersService.getUserByEmail(email);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  @Get(':id')
  @Public()
  async findUserById(@Param('id') id: number) {
    const user = await this.usersService.findUserById(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  @Put(':id')
  @Public()
  async updateUser(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @Public()
  async deleteUser(@Param('id') id: number) {
    await this.usersService.deleteUser(id);
    return { message: 'User deleted successfully' };
  }
}
