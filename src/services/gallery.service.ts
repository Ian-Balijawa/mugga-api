import { BaseService } from './base.service';
import { GalleryItem } from '../entities/gallery-item.entity';
import { AppDataSource } from '../config/database.config';

export class GalleryService extends BaseService<GalleryItem> {
    constructor() {
        super( AppDataSource.getRepository( GalleryItem ) );
    }

    async findByCategory( category: GalleryItem['category'] ): Promise<GalleryItem[]> {
        return this.repository.find( {
            where: { category },
            order: { date: 'DESC' }
        } );
    }

    async findLatest( limit: number = 6 ): Promise<GalleryItem[]> {
        return this.repository.find( {
            order: { date: 'DESC' },
            take: limit
        } );
    }
}
