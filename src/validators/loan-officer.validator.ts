import { z } from 'zod';

export const loanOfficerSchema = z.object( {
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    phone: z.string(),
    password: z.string().min( 8 ),
    employeeId: z.string(),
    isAdmin: z.boolean().optional().default( false ),
    isActive: z.boolean().optional().default( false )
} );
