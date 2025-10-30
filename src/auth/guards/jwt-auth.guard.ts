// src/auth/guards/jwt-auth.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entity/users.schema';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers['authorization'] || request.headers['x-access-token'];
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header missing');
    }

    const token = authHeader.replace('Bearer ', '');
    try {
      // verify token
      const decodedToken: any = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET!,
      );

      // find user in DB
      const user = await this.userRepo.findOne({
        where: { id: decodedToken?.id },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid access token');
      }

      // remove sensitive fields
      const { password, ...userSafe } = user;
      request.user = userSafe; // attach to request
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }
}
