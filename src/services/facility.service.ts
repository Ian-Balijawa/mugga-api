import { BaseService } from './base.service';
import { Facility } from '../entities/facility.entity';
import { AppDataSource } from '../config/database.config';

export class FacilityService extends BaseService<Facility> {
    constructor() {
        super( AppDataSource.getRepository( Facility ) );
    }

    async findByFeature( feature: string ): Promise<Facility[]> {
        return this.repository
            .createQueryBuilder( 'facility' )
            .where( 'facility.features LIKE :feature', {
                feature: `%${feature}%`
            } )
            .getMany();
    }

    async findByEquipment( equipment: string ): Promise<Facility[]> {
        return this.repository
            .createQueryBuilder( 'facility' )
            .where( 'facility.equipment LIKE :equipment', {
                equipment: `%${equipment}%`
            } )
            .getMany();
    }
}
