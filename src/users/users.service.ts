import { ConflictException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/users.schema';
import { CreateUserDto } from './DTO/create-users.dto';
import { UpdateUserDto } from './DTO/update-users.dto';
import { hash } from 'bcryptjs';
import { Counter, Gauge } from 'prom-client';
import { MetricsService } from '../utils/metrics.service';

@Injectable()
export class UsersService {
  private userCreatedCounter: Counter<string>;
  private userDeletedCounter: Counter<string>;
  private userUpdatedCounter: Counter<string>;
  private totalUsersGauge: Gauge<string>;

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly metricsService: MetricsService,
  ) {
    // Initialize metrics
    this.userCreatedCounter = new Counter({
      name: 'users_created_total',
      help: 'Total number of users created',
      registers: [this.metricsService.getRegister()],
    });

    this.userDeletedCounter = new Counter({
      name: 'users_deleted_total',
      help: 'Total number of users deleted',
      registers: [this.metricsService.getRegister()],
    });

    this.userUpdatedCounter = new Counter({
      name: 'users_updated_total',
      help: 'Total number of users updated',
      registers: [this.metricsService.getRegister()],
    });

    this.totalUsersGauge = new Gauge({
      name: 'users_total',
      help: 'Total number of users in the system',
      registers: [this.metricsService.getRegister()],
    });

    // Initialize total users gauge
    this.updateTotalUsersGauge();
  }

  private async updateTotalUsersGauge() {
    const count = await this.usersRepository.count();
    this.totalUsersGauge.set(count);
  }

  async createUser(userData: CreateUserDto): Promise<User> {
    try {
      const existingUser = await this.usersRepository.findOne({
        where: { email: userData.email },
      });

      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }

      const user = this.usersRepository.create(userData);
      user.password = await hash(userData.password, 10);

      const createdUser = await this.usersRepository.save(user);

      if (!createdUser) {
        throw new ConflictException('Failed to create user');
      }

      // Increment metrics
      this.userCreatedCounter.inc();
      await this.updateTotalUsersGauge();

      return createdUser;
    } catch (error) {
      throw new ConflictException('Failed to create user : ' + error.message);
    }
  }

  async getAllUsers(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async updateUser(id: number, updateData: Partial<UpdateUserDto>) {
    const findUser = await this.usersRepository.findOne({ where: { id } });
    if (!findUser) {
      throw new ConflictException('User not found');
    }

    const updatedUser = await this.usersRepository.update(id, updateData);
    if (updatedUser.affected === 0) {
      throw new ConflictException('Failed to update user');
    }

    // Increment update counter
    this.userUpdatedCounter.inc();

    return this.usersRepository.findOne({ where: { id } });
  }

  async findUserById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async deleteUser(id: number): Promise<void> {
    const deleteResult = await this.usersRepository.delete(id);
    if (deleteResult.affected === 0) {
      throw new ConflictException('Failed to delete user');
    }
      // Increment delete counter and update total users
      this.userDeletedCounter.inc();
      await this.updateTotalUsersGauge();
    
      return;
  }
}
