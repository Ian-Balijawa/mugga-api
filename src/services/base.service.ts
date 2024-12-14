import { Repository, DeepPartial, FindOptionsWhere, ObjectLiteral } from 'typeorm';
import { AppError } from '../middlewares/error-handler.middleware';

export abstract class BaseService<T extends ObjectLiteral> {
  constructor(protected repository: Repository<T>) {}

  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  }

  async findById(id: string): Promise<T> {
    const entity = await this.repository.findOne({
      where: { id } as unknown as FindOptionsWhere<T>
    });
    if (!entity) {
      throw new AppError(404, 'Entity not found');
    }
    return entity;
  }

  async findAll(): Promise<T[]> {
    return await this.repository.find();
  }

  async update(id: string, data: DeepPartial<T>): Promise<T> {
    await this.repository.update(id, data as any);
    return await this.findById(id);
  }

  async delete(id: string): Promise<void> {
    const result = await this.repository.delete(id);
    if (result.affected === 0) {
      throw new AppError(404, 'Entity not found');
    }
  }
}
