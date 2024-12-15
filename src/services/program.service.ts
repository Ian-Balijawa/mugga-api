import { BaseService } from './base.service';
import { Program } from '../entities/program.entity';
import { AppDataSource } from '../config/database.config';

export class ProgramService extends BaseService<Program> {
    constructor() {
        super( AppDataSource.getRepository( Program ) );
    }

    async findByCategory( category: Program['category'] ): Promise<Program[]> {
        return this.repository.find( {
            where: { category },
            order: { createdAt: 'DESC' }
        } );
    }

    async findActive(): Promise<Program[]> {
        return this.repository.find( {
            where: { isActive: true },
            order: { createdAt: 'DESC' }
        } );
    }

    async findByPriceRange( min: number, max: number ): Promise<Program[]> {
        return this.repository
            .createQueryBuilder( 'program' )
            .where( 'program.price BETWEEN :min AND :max', { min, max } )
            .orderBy( 'program.price', 'ASC' )
            .getMany();
    }
}
