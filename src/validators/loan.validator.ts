import { z } from 'zod';
import { LoanType, DisbursementMethod, InterestMethod, DurationUnit, RepaymentCycle } from '../entities/loan.entity';

export const loanSchema = z.object({
    type: z.nativeEnum(LoanType),
    branchId: z.string().uuid(),
    loanOfficerId: z.string().uuid(),
    borrowerId: z.string().uuid(),
    principalAmount: z.number().positive(),
    disbursementMethod: z.nativeEnum(DisbursementMethod),
    releaseDate: z.string().datetime(),
    maturityDate: z.string().datetime(),
    interestMethod: z.nativeEnum(InterestMethod),
    loanInterest: z.object({
        value: z.number().positive(),
        unit: z.nativeEnum(DurationUnit)
    }),
    loanDuration: z.object({
        value: z.number().positive(),
        unit: z.nativeEnum(DurationUnit)
    }),
    repaymentCycle: z.nativeEnum(RepaymentCycle),
    numberOfRepayments: z.number().positive()
});
