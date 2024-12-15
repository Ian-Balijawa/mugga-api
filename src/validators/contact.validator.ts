import { z } from 'zod';

export const contactFormSchema = z.object( {
    name: z.string().min( 1 ).max( 100 ),
    email: z.string().email(),
    subject: z.string().min( 1 ).max( 200 ),
    message: z.string().min( 1 ).max( 1000 )
} );

export type ContactFormInput = z.infer<typeof contactFormSchema>;
