import { z } from 'zod';

export const loginSchema = z.object( {
    email: z.string().email(),
    password: z.string().min( 6 )
} );

export type LoginInput = z.infer<typeof loginSchema>;

export const signupSchema = z.object( {
    email: z.string().email(),
    password: z.string()
        .min( 8, 'Password must be at least 8 characters' )
        .regex( /[A-Z]/, 'Password must contain at least one uppercase letter' )
        .regex( /[a-z]/, 'Password must contain at least one lowercase letter' )
        .regex( /[0-9]/, 'Password must contain at least one number' )
        .regex( /[^A-Za-z0-9]/, 'Password must contain at least one special character' ),
    confirmPassword: z.string()
} ).refine( ( data ) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
} );

export type SignupInput = z.infer<typeof signupSchema>;
