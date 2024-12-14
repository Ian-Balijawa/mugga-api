import { z } from 'zod';
import { CollateralType } from '../entities/collateral.entity';

export const collateralSchema = z.object( {
    type: z.nativeEnum( CollateralType ),
    description: z.string(),
    value: z.number().positive(),
    location: z.string().optional(),
    documents: z.array( z.string() ).optional(),
    loan: z.object( {
        id: z.string()
    } )
} );
