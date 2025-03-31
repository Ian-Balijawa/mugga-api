import { z } from 'zod';

export const galleryItemSchema = z.object( {
    title: z.string().min( 1 ).max( 200 ),
    category: z.enum( ['events', 'stays', 'activity', 'competitions', 'videos'] ),
    imageUrl: z.union( [z.string().url(), z.literal( "" )] ).optional(),
    videoUrl: z.union( [z.string().url(), z.literal( "" )] ).optional(),
    type: z.enum( ['image', 'video', 'both'] ),
    date: z.string().transform( str => new Date( str ) )
} ).refine( ( data ) => {
    // Ensure at least one non-empty URL is provided
    if ( !data.imageUrl?.trim() && !data.videoUrl?.trim() ) {
        return false;
    }
    // Validate URLs based on type
    if ( data.type === 'image' && !data.imageUrl?.trim() ) {
        return false;
    }
    if ( data.type === 'video' && !data.videoUrl?.trim() ) {
        return false;
    }
    if ( data.type === 'both' && ( !data.imageUrl?.trim() || !data.videoUrl?.trim() ) ) {
        return false;
    }
    return true;
}, {
    message: "Either imageUrl or videoUrl must be provided based on the selected type"
} );

export type GalleryItemInput = z.infer<typeof galleryItemSchema>;
