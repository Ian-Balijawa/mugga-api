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

  async findById( id: number ): Promise<T> {
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

  async update( id: number, data: DeepPartial<T> ): Promise<T> {
    const entity = await this.findById( id );
    Object.assign( entity, data );
    return this.repository.save( entity );
  }

  async delete( id: number | string, userId?: number | string ): Promise<void> {
    const numericId = typeof id === 'string' ? parseInt( id ) : id;
    const numericUserId = userId ? ( typeof userId === 'string' ? parseInt( userId ) : userId ) : undefined;

    const entity = await this.findById( numericId );
    entity.isDeleted = true;
    entity.deletedBy = numericUserId;
    await this.repository.softRemove( entity );
  }

  async restore( id: number ): Promise<T> {
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
