import { z } from 'zod';

export const postSchema = z.object( {
    title: z.string().min( 1 ).max( 200 ),
    content: z.string().min( 1 ),
    category: z.enum( ['news', 'events', 'updates'] ),
    imageUrl: z.string().url().optional(),
    videoUrl: z.string().url().optional()
} );

export type PostInput = z.infer<typeof postSchema>;
