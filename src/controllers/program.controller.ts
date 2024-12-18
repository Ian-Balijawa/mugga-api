import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import { Program } from '../entities/program.entity';
import { ProgramService } from '../services/program.service';
import { programSchema } from '../validators/program.validator';

export class ProgramController extends BaseController<Program> {
    private programService: ProgramService;

    constructor() {
        const programService = new ProgramService();
        super( programService );
        this.programService = programService;
    }

    async create( req: Request, res: Response ): Promise<void> {
        const data = await programSchema.parseAsync( req.body );
        const program = await this.service.create( data );
        res.status( 201 ).json( {
            success: true,
            data: program
        } );
    }

    async update( req: Request, res: Response ): Promise<void> {
        const data = await programSchema.partial().parseAsync( req.body );
        const program = await this.service.update( +req.params.id, data );
        res.json( {
            success: true,
            data: program
        } );
    }

    async findByCategory( req: Request, res: Response ): Promise<void> {
        const programs = await this.programService.findByCategory(
            req.params.category as Program['category']
        );
        res.json( {
            success: true,
            data: programs
        } );
    }
}
