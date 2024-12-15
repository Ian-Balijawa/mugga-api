import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import { Facility } from '../entities/facility.entity';
import { FacilityService } from '../services/facility.service';
import { FileStorageService, FileCategory } from '../services/file-storage.service';
import { facilitySchema } from '../validators/facility.validator';

export class FacilityController extends BaseController<Facility> {
    constructor() {
        const facilityService = new FacilityService();
        const fileStorage = new FileStorageService();
        super( facilityService, fileStorage );
    }

    async create( req: Request, res: Response ): Promise<void> {
        const data = await facilitySchema.parseAsync( req.body );

        if ( req.file ) {
            const imageUrl = await this.fileStorage!.saveFile( req.file, 'facilities' as FileCategory );
            data.imageUrl = imageUrl;
        }

        const facility = await this.service.create( data );
        res.status( 201 ).json( {
            success: true,
            data: facility
        } );
    }

    async update( req: Request, res: Response ): Promise<void> {
        const data = await facilitySchema.partial().parseAsync( req.body );
        const existingFacility = await this.service.findById( req.params.id );

        if ( req.file ) {
            if ( existingFacility.imageUrl ) {
                await this.fileStorage!.deleteFile( existingFacility.imageUrl );
            }
            const imageUrl = await this.fileStorage!.saveFile( req.file, 'facilities' as FileCategory );
            data.imageUrl = imageUrl;
        }

        const facility = await this.service.update( req.params.id, data );
        res.json( {
            success: true,
            data: facility
        } );
    }
}
