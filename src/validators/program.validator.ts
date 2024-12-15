import { z } from 'zod';

export const programSchema = z.object( {
    name: z.string().min( 1 ).max( 100 ),
    description: z.string().min( 1 ),
    duration: z.string().min( 1 ),
    price: z.number().positive(),
    schedule: z.string().min( 1 ),
    category: z.enum( ['training', 'camp', 'clinic'] ),
    imageUrl: z.string().url().optional()
} );

export type ProgramInput = z.infer<typeof programSchema>;
