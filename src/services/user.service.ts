import { User } from '../entities/user.entity';
import { BaseService } from './base.service';
import { AppDataSource } from '../config/database.config';
import { AppError } from '../middlewares/error-handler.middleware';
import { hashPassword } from '../utils/auth.utils';

export class UserService extends BaseService<User> {
  constructor() {
    super(AppDataSource.getRepository(User));
  }

  async create(data: Partial<User>): Promise<User> {
    if (!data.password) {
      throw new AppError(400, 'Password is required');
    }

    const existingUser = await this.repository.findOne({
      where: { email: data.email }
    });

    if (existingUser) {
      throw new AppError(400, 'User with this email already exists');
    }

    const hashedPassword = await hashPassword(data.password);
    return super.create({
      ...data,
      password: hashedPassword
    });
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    if (data.password) {
      data.password = await hashPassword(data.password);
    }
    return super.update(id, data);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } });
  }
}
