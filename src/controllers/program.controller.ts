import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import { Program } from '../entities/program.entity';
import { ProgramService } from '../services/program.service';
import { FileStorageService, FileCategory } from '../services/file-storage.service';
import { programSchema } from '../validators/program.validator';

export class ProgramController extends BaseController<Program> {
    private programService: ProgramService;

    constructor() {
        const programService = new ProgramService();
        const fileStorage = new FileStorageService();
        super( programService, fileStorage );
        this.programService = programService;
    }

    async create( req: Request, res: Response ): Promise<void> {
        const data = await programSchema.parseAsync( req.body );

        if ( req.file ) {
            const imageUrl = await this.fileStorage!.saveFile( req.file, 'programs' as FileCategory );
            data.imageUrl = imageUrl;
        }

        const program = await this.service.create( data );
        res.status( 201 ).json( {
            success: true,
            data: program
        } );
    }

    async update( req: Request, res: Response ): Promise<void> {
        const data = await programSchema.partial().parseAsync( req.body );
        const existingProgram = await this.service.findById( req.params.id );

        if ( req.file ) {
            if ( existingProgram.imageUrl ) {
                await this.fileStorage!.deleteFile( existingProgram.imageUrl );
            }
            const imageUrl = await this.fileStorage!.saveFile( req.file, 'programs' as FileCategory );
            data.imageUrl = imageUrl;
        }

        const program = await this.service.update( req.params.id, data );
        res.json( {
            success: true,
            data: program
        } );
    }

    async findByCategory( req: Request, res: Response ): Promise<void> {
        const programs = await this.programService.findByCategory( req.params.category as Program['category'] );
        res.json( {
            success: true,
            data: programs
        } );
    }
}
