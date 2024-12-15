import { z } from 'zod';

export const registrationSchema = z.object( {
    firstName: z.string().min( 1 ).max( 50 ),
    lastName: z.string().min( 1 ).max( 50 ),
    email: z.string().email(),
    phone: z.string().min( 10 ).max( 15 ),
    dateOfBirth: z.string().transform( str => new Date( str ) ),
    programId: z.string().uuid(),
    startDate: z.string().transform( str => new Date( str ) ),
    emergencyName: z.string().min( 1 ).max( 100 ),
    emergencyPhone: z.string().min( 10 ).max( 15 ),
    emergencyRelation: z.string().min( 1 ).max( 50 ),
    medicalConditions: z.string().optional(),
    allergies: z.string().optional(),
    medications: z.string().optional()
} );

export type RegistrationInput = z.infer<typeof registrationSchema>;
