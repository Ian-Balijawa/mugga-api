import { BaseService } from './base.service';
import { AppDataSource } from '../config/database.config';
import { Coach } from '../entities/coach.entity';

export class CoachService extends BaseService<Coach> {
    constructor() {
        super( AppDataSource.getRepository( Coach ) );
    }

    async findBySpecialty( specialty: string ): Promise<Coach[]> {
        return this.repository
            .createQueryBuilder( 'coach' )
            .where( 'coach.specialties LIKE :specialty', {
                specialty: `%${specialty}%`
            } )
            .getMany();
    }
}
