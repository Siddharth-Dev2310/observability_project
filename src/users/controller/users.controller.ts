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

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    async createUser(@Body() createUserDto: CreateUserDto) {
        return this.usersService.createUser(createUserDto);
    }

    @Get()
    async getAllUsers() {
        return this.usersService.getAllUsers();
    }

    @Get('by-email')
    async getUserByEmail(@Query('email') email: string) {
        const user = await this.usersService.getUserByEmail(email);
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        return user;
    }

    @Get(':id')
    async findUserById(@Param('id') id: number) {
        const user = await this.usersService.findUserById(id);
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        return user;
    }

    @Put(':id')
    async updateUser(
        @Param('id') id: number,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        return this.usersService.updateUser(id, updateUserDto);
    }

    @Delete(':id')
    async deleteUser(@Param('id') id: number) {
        await this.usersService.deleteUser(id);
        return { message: 'User deleted successfully' };
    }
}