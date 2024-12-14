import { z } from 'zod';
import { PaymentMethod, PaymentStatus } from '../entities/payment.entity';

export const paymentSchema = z.object( {
    amount: z.number().positive( 'Amount must be positive' ),
    method: z.nativeEnum( PaymentMethod ),
    status: z.nativeEnum( PaymentStatus ).optional(),
    transactionReference: z.string().optional(),
    metadata: z.record( z.any() ).optional(),
    loan: z.object( {
        id: z.string().uuid()
    } )
} );
