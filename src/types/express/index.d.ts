import { User } from '../../users/entity/users.schema';

declare global {
  namespace Express {
    interface Request {
      user: Omit<User, 'password' | 'refreshToken'>;
    }
  }
}