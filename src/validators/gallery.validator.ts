import { z } from 'zod';

export const galleryItemSchema = z.object( {
    title: z.string().min( 1 ).max( 200 ),
    category: z.enum( ['events', 'facilities', 'training', 'competitions'] ),
    imageUrl: z.string().url().optional(),
    videoUrl: z.string().url().optional(),
    type: z.enum( ['image', 'video', 'both'] ),
    date: z.string().transform( str => new Date( str ) )
} ).refine( ( data ) => {
    // Ensure at least one URL is provided
    if ( !data.imageUrl && !data.videoUrl ) {
        return false;
    }
    // Validate URLs based on type
    if ( data.type === 'image' && !data.imageUrl ) {
        return false;
    }
    if ( data.type === 'video' && !data.videoUrl ) {
        return false;
    }
    if ( data.type === 'both' && ( !data.imageUrl || !data.videoUrl ) ) {
        return false;
    }
    return true;
}, {
    message: "Either imageUrl or videoUrl must be provided based on the selected type"
} );

export type GalleryItemInput = z.infer<typeof galleryItemSchema>;
