import cron from 'node-cron';
import { AppDataSource } from '../config/database.config';
import { Loan, LoanStatus } from '../entities/loan.entity';
import { NotificationService } from './notification.service';
import { Logger } from '../utils/logger';
import { Between, LessThan, IsNull } from 'typeorm';
import { addDays, startOfDay, endOfDay } from 'date-fns';

export class CronService {
    private notificationService: NotificationService;

    constructor() {
        this.notificationService = new NotificationService();
        this.initializeCronJobs();
    }

    private initializeCronJobs() {
        // Check for upcoming loan maturities daily at 9 AM
        cron.schedule( '0 9 * * *', () => {
            this.checkUpcomingMaturities();
        } );

        // Check for late payments daily at 10 AM
        cron.schedule( '0 10 * * *', () => {
            this.checkLatePayments();
        } );

        // Check for loans nearing completion at 11 AM
        cron.schedule( '0 11 * * *', () => {
            this.checkLoansNearingCompletion();
        } );

        // Send daily loan status reports at 8 AM
        cron.schedule( '0 8 * * *', () => {
            this.sendDailyLoanStatusReports();
        } );

        // Check for inactive loans at 7 AM
        cron.schedule( '0 7 * * *', () => {
            this.checkInactiveLoans();
        } );
    }

    private async checkUpcomingMaturities() {
        try {
            const loanRepository = AppDataSource.getRepository( Loan );

            // Get loans maturing in the next 7 days
            const upcomingMaturities = await loanRepository.find( {
                where: {
                    maturityDate: Between(
                        startOfDay( new Date() ),
                        endOfDay( addDays( new Date(), 7 ) )
                    ),
                    status: LoanStatus.DISBURSED,
                    deletedAt: IsNull()
                },
                relations: ['borrower', 'borrower.user']
            } );

            Logger.info( `Found ${upcomingMaturities.length} loans nearing maturity` );

            for ( const loan of upcomingMaturities ) {
                await this.notificationService.notifyLoanMaturity( loan );
            }
        } catch ( error ) {
            Logger.error( 'Error checking upcoming maturities:', error );
        }
    }

    private async checkLatePayments() {
        try {
            const loanRepository = AppDataSource.getRepository( Loan );

            // Get loans with overdue payments
            const overdueLoans = await loanRepository.find( {
                where: {
                    nextPaymentDate: LessThan( startOfDay( new Date() ) ),
                    status: LoanStatus.DISBURSED,
                    deletedAt: IsNull()
                },
                relations: ['borrower', 'borrower.user', 'guarantors', 'guarantors.user']
            } );

            Logger.info( `Found ${overdueLoans.length} loans with late payments` );

            for ( const loan of overdueLoans ) {
                await this.notificationService.notifyLatePayment( loan );
            }
        } catch ( error ) {
            Logger.error( 'Error checking late payments:', error );
        }
    }

    private async checkLoansNearingCompletion() {
        try {
            const loanRepository = AppDataSource.getRepository( Loan );

            // Get loans that are 95% or more paid
            const nearingCompletionLoans = await loanRepository
                .createQueryBuilder( 'loan' )
                .where( 'loan.status = :status', { status: LoanStatus.DISBURSED } )
                .andWhere( 'loan.deletedAt IS NULL' )
                .andWhere( '(loan.totalPaid / loan.totalAmount) >= 0.95' )
                .leftJoinAndSelect( 'loan.borrower', 'borrower' )
                .leftJoinAndSelect( 'borrower.user', 'user' )
                .getMany();

            Logger.info( `Found ${nearingCompletionLoans.length} loans nearing completion` );

            for ( const loan of nearingCompletionLoans ) {
                const remainingAmount = loan.totalAmount - loan.totalPaid;
                const emailContent = `
                    <h2>Loan Nearly Complete</h2>
                    <p>Your loan (${loan.loanNumber}) is almost fully repaid!</p>
                    <p>Remaining Amount: ${remainingAmount}</p>
                    <p>Keep up the good work!</p>
                `;
                const smsContent = `Your loan ${loan.loanNumber} is almost complete! Remaining amount: ${remainingAmount}`;

                await this.notificationService.notifyUser(
                    loan.borrower,
                    'Loan Nearly Complete',
                    emailContent,
                    smsContent
                );
            }
        } catch ( error ) {
            Logger.error( 'Error checking loans nearing completion:', error );
        }
    }

    private async sendDailyLoanStatusReports() {
        try {
            const loanRepository = AppDataSource.getRepository( Loan );

            // Get all active loans
            const activeLoans = await loanRepository.find( {
                where: {
                    status: LoanStatus.DISBURSED,
                    deletedAt: IsNull()
                },
                relations: ['borrower', 'borrower.user']
            } );

            // Group loans by branch
            const loansByBranch = activeLoans.reduce( ( acc: { [key: string]: Loan[] }, loan ) => {
                const branchId = loan.branch?.id || 'unassigned';
                if ( !acc[branchId] ) {
                    acc[branchId] = [];
                }
                acc[branchId].push( loan );
                return acc;
            }, {} );

            // Send report for each branch
            for ( const [branchId, loans] of Object.entries( loansByBranch ) ) {
                const totalLoans = loans.length;
                const totalAmount = loans.reduce( ( sum, loan ) => sum + loan.totalAmount, 0 );
                const totalPaid = loans.reduce( ( sum, loan ) => sum + loan.totalPaid, 0 );
                const overdueLoans = loans.filter( loan =>
                    loan.nextPaymentDate && loan.nextPaymentDate < new Date()
                ).length;

                const emailContent = `
                    <h2>Daily Loan Status Report</h2>
                    <p>Branch ID: ${branchId}</p>
                    <p>Total Active Loans: ${totalLoans}</p>
                    <p>Total Loan Amount: ${totalAmount}</p>
                    <p>Total Amount Paid: ${totalPaid}</p>
                    <p>Overdue Loans: ${overdueLoans}</p>
                `;

                // Send to branch manager
                await this.notificationService.notifyBranchManager( branchId, emailContent );
            }
        } catch ( error ) {
            Logger.error( 'Error sending daily loan status reports:', error );
        }
    }

    private async checkInactiveLoans() {
        try {
            const loanRepository = AppDataSource.getRepository( Loan );
            const thirtyDaysAgo = addDays( new Date(), -30 );

            // Find loans with no payment activity in the last 30 days
            const inactiveLoans = await loanRepository
                .createQueryBuilder( 'loan' )
                .leftJoinAndSelect( 'loan.payments', 'payment' )
                .where( 'loan.status = :status', { status: LoanStatus.DISBURSED } )
                .andWhere( 'loan.deletedAt IS NULL' )
                .andWhere( qb => {
                    const subQuery = qb.subQuery()
                        .select( 'p.loanId' )
                        .from( 'payments', 'p' )
                        .where( 'p.createdAt > :date', { date: thirtyDaysAgo } )
                        .getQuery();
                    return 'loan.id NOT IN ' + subQuery;
                } )
                .leftJoinAndSelect( 'loan.borrower', 'borrower' )
                .leftJoinAndSelect( 'borrower', 'user' )
                .getMany();

            Logger.info( `Found ${inactiveLoans.length} inactive loans` );

            for ( const loan of inactiveLoans ) {
                const emailContent = `
                    <h2>Inactive Loan Notice</h2>
                    <p>Your loan (${loan.loanNumber}) has shown no payment activity for the past 30 days.</p>
                    <p>Outstanding Amount: ${loan.totalAmount - loan.totalPaid}</p>
                    <p>Please contact us if you are experiencing difficulties with payments.</p>
                `;
                const smsContent = `No payment activity detected for loan ${loan.loanNumber} in the past 30 days. Please contact us.`;

                await this.notificationService.notifyUser(
                    loan.borrower,
                    'Inactive Loan Notice',
                    emailContent,
                    smsContent
                );
            }
        } catch ( error ) {
            Logger.error( 'Error checking inactive loans:', error );
        }
    }
}
