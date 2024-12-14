import { z } from 'zod';
import { MeetingFrequency } from '../entities/borrower-group.entity';

export const borrowerGroupSchema = z.object( {
    name: z.string().min( 2, 'Group name must be at least 2 characters' ),
    groupLeader: z.string().optional(),
    collectorName: z.string().optional(),
    meetingSchedule: z.nativeEnum( MeetingFrequency ).optional(),
    description: z.string().optional(),
    loanOfficerId: z.string().optional(),
    borrowers: z.array( z.string() ).optional(),
} );
