import { Repository, DeepPartial, FindOptionsWhere } from 'typeorm';
import { BaseEntity } from '../entities/base.entity';
import { AppError } from '../middlewares/error-handler.middleware';

export abstract class BaseService<T extends BaseEntity> {
  protected repository: Repository<T>;

  constructor( repository: Repository<T> ) {
    this.repository = repository;
  }

  async findAll(): Promise<T[]> {
    return this.repository.find( {
      withDeleted: false
    } );
  }

  async findById( id: string ): Promise<T> {
    const entity = await this.repository.findOne( {
      where: { id } as FindOptionsWhere<T>,
      withDeleted: false
    } );

    if ( !entity ) {
      throw new AppError( 404, 'Entity not found' );
    }

    return entity;
  }

  async create( data: DeepPartial<T> ): Promise<T> {
    const entity = this.repository.create( data );
    return this.repository.save( entity );
  }

  async update( id: string, data: DeepPartial<T> ): Promise<T> {
    const entity = await this.findById( id );
    Object.assign( entity, data );
    return this.repository.save( entity );
  }

  async delete( id: string, userId?: string ): Promise<void> {
    const entity = await this.findById( id );

    // Update soft delete fields
    entity.isDeleted = true;
    entity.deletedBy = userId;

    // Use TypeORM's soft delete
    await this.repository.softRemove( entity );
  }

  async restore( id: string ): Promise<T> {
    const entity = await this.repository.findOne( {
      where: { id } as FindOptionsWhere<T>,
      withDeleted: true
    } );

    if ( !entity ) {
      throw new AppError( 404, 'Entity not found' );
    }

    // Reset soft delete fields
    entity.isDeleted = false;
    entity.deletedBy = undefined;
    entity.deletedAt = null;

    return this.repository.save( entity );
  }

  async findDeleted(): Promise<T[]> {
    return this.repository.find( {
      withDeleted: true,
      where: { isDeleted: true } as FindOptionsWhere<T>
    } );
  }
}
