import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

export type GalleryCategory = 'events' | 'stays' | 'activity' | 'competitions' | 'videos';
export type GalleryType = 'image' | 'video' | 'both';

@Entity( 'gallery_items' )
export class GalleryItem extends BaseEntity {
    @Column()
    title: string;

    @Column( {
        type: 'enum',
        enum: ['events', 'stays', 'activity', 'competitions', 'videos']
    } )
    category: GalleryCategory;

    @Column( { nullable: true } )
    imageUrl: string;

    @Column( { nullable: true } )
    videoUrl: string;

    @Column( {
        type: 'enum',
        enum: ['image', 'video', 'both']
    } )
    type: GalleryType;

    @Column( 'date' )
    date: Date;
}
