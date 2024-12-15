import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import { GalleryItem } from '../entities/gallery-item.entity';
import { FileStorageService, FileCategory } from '../services/file-storage.service';
import { galleryItemSchema } from '../validators/gallery.validator';
import { GalleryService } from '../services/gallery.service';

export class GalleryController extends BaseController<GalleryItem> {
    private galleryService: GalleryService;

    constructor() {
        const galleryService = new GalleryService();
        const fileStorage = new FileStorageService();
        super( galleryService, fileStorage );
        this.galleryService = galleryService;
    }

    async create( req: Request, res: Response ): Promise<void> {
        const data = await galleryItemSchema.parseAsync( req.body );

        if ( req.file ) {
            const imageUrl = await this.fileStorage!.saveFile( req.file, 'gallery' as FileCategory );
            data.imageUrl = imageUrl;
        }

        const item = await this.service.create( data );
        res.status( 201 ).json( {
            success: true,
            data: item
        } );
    }

    async update( req: Request, res: Response ): Promise<void> {
        const data = await galleryItemSchema.partial().parseAsync( req.body );
        const existingItem = await this.service.findById( req.params.id );

        if ( req.file ) {
            if ( existingItem.imageUrl ) {
                await this.fileStorage!.deleteFile( existingItem.imageUrl );
            }
            const imageUrl = await this.fileStorage!.saveFile( req.file, 'gallery' as FileCategory );
            data.imageUrl = imageUrl;
        }

        const item = await this.service.update( req.params.id, data );
        res.json( {
            success: true,
            data: item
        } );
    }

    async findByCategory( req: Request, res: Response ): Promise<void> {
        const items = await this.galleryService.findByCategory( req.params.category as GalleryItem['category'] );
        res.json( {
            success: true,
            data: items
        } );
    }
}
