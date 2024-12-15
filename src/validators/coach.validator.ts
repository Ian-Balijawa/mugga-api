import { z } from 'zod';

export const coachSchema = z.object( {
    name: z.string().min( 1 ).max( 100 ),
    role: z.string().min( 1 ).max( 100 ),
    bio: z.string().min( 1 ),
    specialties: z.array( z.string() ).min( 1 ),
    imageUrl: z.string().url().optional()
} );

export type CoachInput = z.infer<typeof coachSchema>;
