import { z } from 'zod';

export const alumniSchema = z.object( {
    name: z.string().min( 1 ),
    graduationYear: z.number().int().min( 1900 ).max( new Date().getFullYear() ),
    currentTeam: z.string().optional(),
    achievements: z.array( z.string() ),
    image: z.string().url(),
    position: z.string().min( 1 ),
    category: z.enum( ['professional', 'college', 'youth'] )
} );
