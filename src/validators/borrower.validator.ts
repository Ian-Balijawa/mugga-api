import { z } from 'zod';
import { Title, WorkingStatus } from '../entities/borrower.entity';
import { guarantorSchema } from './guarantor.validator';

export const borrowerSchema = z.object( {
    country: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    middleName: z.string().optional(),
    title: z.nativeEnum( Title ),
    dateOfBirth: z.string().or( z.date() ),
    ninNo: z.string(),
    phone: z.string(),
    email: z.string().email(),
    address: z.string(),
    occupation: z.string(),
    workingStatus: z.nativeEnum( WorkingStatus ),
    creditScore: z.number().min( 0 ).max( 100 ).optional(),
    borrowerPhoto: z.string().url().optional(),
    description: z.string().optional(),
    borrowerFiles: z.array( z.string() ).optional(),
    guarantors: z.array( guarantorSchema )
} );
