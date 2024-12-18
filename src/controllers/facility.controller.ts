import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import { Facility } from '../entities/facility.entity';
import { FacilityService } from '../services/facility.service';
import { facilitySchema } from '../validators/facility.validator';

export class FacilityController extends BaseController<Facility> {
    private facilityService: FacilityService;

    constructor() {
        const facilityService = new FacilityService();
        super( facilityService );
        this.facilityService = facilityService;
    }

    async create( req: Request, res: Response ): Promise<void> {
        const data = await facilitySchema.parseAsync( req.body );
        const facility = await this.service.create( data );
        res.status( 201 ).json( {
            success: true,
            data: facility
        } );
    }

    async update( req: Request, res: Response ): Promise<void> {
        const data = await facilitySchema.partial().parseAsync( req.body );
        const facility = await this.service.update( +req.params.id, data );
        res.json( {
            success: true,
            data: facility
        } );
    }

    async findByFeature( req: Request, res: Response ): Promise<void> {
        const facilities = await this.facilityService.findByFeature( req.params.feature );
        res.json( {
            success: true,
            data: facilities
        } );
    }

    async findByEquipment( req: Request, res: Response ): Promise<void> {
        const facilities = await this.facilityService.findByEquipment( req.params.equipment );
        res.json( {
            success: true,
            data: facilities
        } );
    }
}
