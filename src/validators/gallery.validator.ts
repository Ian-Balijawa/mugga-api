import { z } from 'zod';

export const galleryItemSchema = z.object( {
    title: z.string().min( 1 ).max( 200 ),
    category: z.enum( ['events', 'facilities', 'training', 'competitions'] ),
    imageUrl: z.string().url(),
    date: z.string().transform( str => new Date( str ) )
} );

export type GalleryItemInput = z.infer<typeof galleryItemSchema>;
