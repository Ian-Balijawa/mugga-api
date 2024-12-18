import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import { Coach } from '../entities/coach.entity';
import { CoachService } from '../services/coach.service';
import { coachSchema } from '../validators/coach.validator';

export class CoachController extends BaseController<Coach> {
    private coachService: CoachService;

    constructor() {
        const coachService = new CoachService();
        super( coachService );
        this.coachService = coachService;
    }

    async create( req: Request, res: Response ): Promise<void> {
        const data = await coachSchema.parseAsync( req.body );
        const coach = await this.service.create( data );
        res.status( 201 ).json( {
            success: true,
            data: coach
        } );
    }

    async update( req: Request, res: Response ): Promise<void> {
        const data = await coachSchema.partial().parseAsync( req.body );
        const coach = await this.service.update( +req.params.id, data );
        res.json( {
            success: true,
            data: coach
        } );
    }

    async findBySpecialty( req: Request, res: Response ): Promise<void> {
        const coaches = await this.coachService.findBySpecialty( req.params.specialty );
        res.json( {
            success: true,
            data: coaches
        } );
    }
}
