import { z } from "zod"

export const userSchema = z.object( {
    firstName: z.string()
        .min( 2, 'First name must be at least 2 characters' )
        .max( 50, 'First name must not exceed 50 characters' ),
    lastName: z.string()
        .min( 2, 'Last name must be at least 2 characters' )
        .max( 50, 'Last name must not exceed 50 characters' ),
    email: z.string()
        .email( 'Invalid email format' )
        .max( 255, 'Email must not exceed 255 characters' ),
    password: z.string()
        .min( 8, 'Password must be at least 8 characters' )
        .max( 100, 'Password must not exceed 100 characters' )
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
            'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
        ),
    phone: z.string()
        .regex( /^\+?[1-9]\d{1,14}$/, 'Invalid phone number format' ),
    roles: z.array( z.string() )
        .default( ['user'] ),
    emailVerified: z.boolean()
        .default( false ),
    phoneVerified: z.boolean()
        .default( false )
} )
