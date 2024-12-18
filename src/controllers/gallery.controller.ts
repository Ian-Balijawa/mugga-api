import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import { GalleryItem } from '../entities/gallery-item.entity';
import { GalleryService } from '../services/gallery.service';
import { galleryItemSchema } from '../validators/gallery.validator';

export class GalleryController extends BaseController<GalleryItem> {
    private galleryService: GalleryService;

    constructor() {
        const galleryService = new GalleryService();
        super( galleryService );
        this.galleryService = galleryService;
    }

    async create( req: Request, res: Response ): Promise<void> {
        const data = await galleryItemSchema.parseAsync( req.body );
        const item = await this.service.create( data );
        res.status( 201 ).json( {
            success: true,
            data: item
        } );
    }

    async update( req: Request, res: Response ): Promise<void> {
        const data = await galleryItemSchema.partial().parseAsync( req.body );
        const item = await this.service.update( +req.params.id, data );
        res.json( {
            success: true,
            data: item
        } );
    }

    async findByCategory( req: Request, res: Response ): Promise<void> {
        const items = await this.galleryService.findByCategory(
            req.params.category as GalleryItem['category']
        );
        res.json( {
            success: true,
            data: items
        } );
    }
}
