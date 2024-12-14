import { z } from 'zod';
import { FeeType, FeeCalculationType } from '../entities/fee.entity';

export const feeSchema = z.object( {
    type: z.nativeEnum( FeeType ),
    name: z.string(),
    calculationType: z.nativeEnum( FeeCalculationType ),
    value: z.number().positive(),
    amount: z.number().positive(),
    description: z.string().optional(),
    loanId: z.string()
} ).transform( data => ( {
    ...data,
    loan: { id: data.loanId }
} ) );
