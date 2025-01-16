import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import { Alumni } from '../entities/alumni.entity';
import { AlumniService } from '../services/alumni.service';
import { alumniSchema } from '../validators/alumni.validator';

export class AlumniController extends BaseController<Alumni> {
    protected service: AlumniService;

    constructor() {
        const service = new AlumniService();
        super( service );
        this.service = service;
    }

    async create( req: Request, res: Response ): Promise<void> {
        const data = await alumniSchema.parseAsync( req.body );
        const alumni = await this.service.create( data );
        res.status( 201 ).json( {
            success: true,
            data: alumni
        } );
    }

    async update( req: Request, res: Response ): Promise<void> {
        const data = await alumniSchema.partial().parseAsync( req.body );
        const alumni = await this.service.update( +req.params.id, data );
        res.json( {
            success: true,
            data: alumni
        } );
    }
}
