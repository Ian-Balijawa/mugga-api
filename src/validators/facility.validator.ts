import { z } from 'zod';

export const facilitySchema = z.object( {
    name: z.string().min( 1 ).max( 100 ),
    description: z.string().min( 1 ),
    features: z.array( z.string() ).min( 1 ),
    imageUrl: z.string().url(),
    equipment: z.array( z.string() ).min( 1 )
} );

export type FacilityInput = z.infer<typeof facilitySchema>;
