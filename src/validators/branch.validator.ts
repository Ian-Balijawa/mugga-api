import { z } from 'zod';

const baseSchema = {
    name: z.string(),
    code: z.string(),
    address: z.string(),
    phone: z.string(),
    email: z.string().email(),
    minimumLoanAmount: z.number(),
    maximumLoanAmount: z.number(),
    minimumInterestRate: z.number(),
    maximumInterestRate: z.number(),
    manager: z.object( { id: z.string() } ).optional(),
    allowedLoanTypes: z.array( z.object( { id: z.string() } ) )
};

export const createBranchSchema = z.object( baseSchema )
    .refine( data => data.minimumLoanAmount <= data.maximumLoanAmount, {
        message: 'Minimum loan amount must be less than or equal to maximum loan amount'
    } )
    .refine( data => data.minimumInterestRate <= data.maximumInterestRate, {
        message: 'Minimum interest rate must be less than or equal to maximum interest rate'
    } );

export const updateBranchSchema = z.object( baseSchema ).partial();
