import { z } from 'zod';
import { Title, WorkingStatus } from '../entities/borrower.entity';

export const guarantorSchema = z.object( {
    firstName: z.string(),
    lastName: z.string(),
    middleName: z.string(),
    title: z.nativeEnum( Title ),
    ninNo: z.string(),
    occupation: z.string(),
    workingStatus: z.nativeEnum( WorkingStatus ),
    phone: z.string(),
    email: z.string().email(),
    address: z.string()
} );
