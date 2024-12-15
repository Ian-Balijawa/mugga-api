import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

export type GalleryCategory = 'events' | 'facilities' | 'training' | 'competitions';

@Entity('gallery_items')
export class GalleryItem extends BaseEntity {
    @Column()
    title: string;

    @Column({
        type: 'enum',
        enum: ['events', 'facilities', 'training', 'competitions']
    })
    category: GalleryCategory;

    @Column()
    imageUrl: string;

    @Column('date')
    date: Date;
}
