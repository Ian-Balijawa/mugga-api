import { z } from 'zod';

export const forgotPasswordSchema = z.object({
    email: z.string().email()
});

export const verifySecurityCodeSchema = z.object({
    email: z.string().email(),
    code: z.string().length(6)
});

export const verifyEmailSchema = z.object({
    email: z.string().email(),
    otp: z.string().length(6)
});

export const toggleActivationSchema = z.object({
    loanOfficerId: z.string(),
    isActive: z.boolean()
});
