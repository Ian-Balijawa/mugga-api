import { z } from 'zod';

export const postSchema = z.object( {
    title: z.string().min( 1 ).max( 200 ),
    content: z.string().min( 1 ),
    imageUrl: z.string().url().or( z.literal( '' ) ).optional(),
    videoUrl: z.string().url().or( z.literal( '' ) ).optional(),
    category: z.enum( ['news', 'events', 'updates', 'announcements'] ),
} );

export type PostInput = z.infer<typeof postSchema>;
