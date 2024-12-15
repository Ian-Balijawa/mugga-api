import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import { Coach } from '../entities/coach.entity';
import { CoachService } from '../services/coach.service';
import { FileStorageService, FileCategory } from '../services/file-storage.service';
import { coachSchema } from '../validators/coach.validator';

export class CoachController extends BaseController<Coach> {
    private coachService: CoachService;

    constructor() {
        const coachService = new CoachService();
        const fileStorage = new FileStorageService();
        super( coachService, fileStorage );
        this.coachService = coachService;
    }

    async create( req: Request, res: Response ): Promise<void> {
        const data = await coachSchema.parseAsync( req.body );

        if ( req.file ) {
            const imageUrl = await this.fileStorage!.saveFile( req.file, 'coaches' as FileCategory );
            data.imageUrl = imageUrl;
        }

        const coach = await this.service.create( data );
        res.status( 201 ).json( {
            success: true,
            data: coach
        } );
    }

    async update( req: Request, res: Response ): Promise<void> {
        const data = await coachSchema.partial().parseAsync( req.body );
        const existingCoach = await this.service.findById( req.params.id );

        if ( req.file ) {
            if ( existingCoach.imageUrl ) {
                await this.fileStorage!.deleteFile( existingCoach.imageUrl );
            }
            const imageUrl = await this.fileStorage!.saveFile( req.file, 'coaches' as FileCategory );
            data.imageUrl = imageUrl;
        }

        const coach = await this.service.update( req.params.id, data );
        res.json( {
            success: true,
            data: coach
        } );
    }

    async delete( req: Request, res: Response ): Promise<void> {
        const coach = await this.service.findById( req.params.id );
        if ( coach.imageUrl ) {
            await this.fileStorage!.deleteFile( coach.imageUrl );
        }
        await this.service.delete( req.params.id );
        res.status( 204 ).send();
    }

    async findBySpecialty( req: Request, res: Response ): Promise<void> {
        const coaches = await this.coachService.findBySpecialty( req.params.specialty );
        res.json( {
            success: true,
            data: coaches
        } );
    }
}
