// src/services/notification.service.ts
import { Loan, LoanStatus } from '../entities/loan.entity';
import { Fee } from '../entities/fee.entity';
import { Guarantor } from '../entities/guarantor.entity';
import { Payment } from '../entities/payment.entity';
import { Logger } from '../utils/logger';
import env from '../config/env.config';
import nodemailer from 'nodemailer';
import twilio from 'twilio';

import { Branch } from '../entities/branch.entity';
import { AppDataSource } from '../config/database.config';

export class NotificationService {
    private emailTransporter: nodemailer.Transporter;
    private twilioClient: twilio.Twilio;

    constructor() {
        // Initialize email transporter
        this.emailTransporter = nodemailer.createTransport( {
            host: env.SMTP_HOST,
            port: env.SMTP_PORT,
            secure: true,
            auth: {
                user: env.SMTP_USER,
                pass: env.SMTP_PASS
            }
        } );

        // Initialize Twilio client
        this.twilioClient = twilio( env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN );
    }

    private async sendEmail( to: string, subject: string, html: string ): Promise<void> {
        try {
            await this.emailTransporter.sendMail( {
                from: env.SMTP_USER,
                to,
                subject,
                html
            } );
            Logger.info( `Email sent to ${to}` );
        } catch ( error ) {
            Logger.error( 'Error sending email:', error );
        }
    }

    private async sendSMS( to: string, message: string ): Promise<void> {
        try {
            await this.twilioClient.messages.create( {
                body: message,
                to,
                from: env.TWILIO_PHONE_NUMBER
            } );
            Logger.info( `SMS sent to ${to}` );
        } catch ( error ) {
            Logger.error( 'Error sending SMS:', error );
        }
    }

    public async notifyUser( user: { email: string, phone: string }, subject: string, emailContent: string, smsContent: string ): Promise<void> {
        if ( user.email ) {
            await this.sendEmail( user.email, subject, emailContent );
        }
        if ( user.phone ) {
            await this.sendSMS( user.phone, smsContent );
        }
    }

    async notifyLoanApplication( loan: Loan ): Promise<void> {
        const subject = `Loan Application Received - ${loan.loanNumber}`;
        const emailContent = `
            <h2>Loan Application Received</h2>
            <p>Your loan application (${loan.loanNumber}) has been received and is being processed.</p>
            <p>Amount: ${loan.principalAmount}</p>
            <p>Type: ${loan.type}</p>
            <p>Status: ${loan.status}</p>
        `;
        const smsContent = `Your loan application ${loan.loanNumber} for ${loan.principalAmount} has been received and is being processed.`;

        await this.notifyUser( loan.borrower, subject, emailContent, smsContent );
    }

    async notifyFeeApplication( loan: Loan, fee: Fee ): Promise<void> {
        const subject = `New Fee Applied - ${loan.loanNumber}`;
        const emailContent = `
            <h2>New Fee Applied</h2>
            <p>A new fee has been applied to your loan (${loan.loanNumber}):</p>
            <p>Fee Type: ${fee.type}</p>
            <p>Amount: ${fee.amount}</p>
        `;
        const smsContent = `A ${fee.type} fee of ${fee.amount} has been applied to your loan ${loan.loanNumber}.`;

        await this.notifyUser( loan.borrower, subject, emailContent, smsContent );
    }

    async notifyLoanMaturity( loan: Loan ): Promise<void> {
        const subject = `Loan Maturity Notice - ${loan.loanNumber}`;
        const emailContent = `
            <h2>Loan Maturity Notice</h2>
            <p>Your loan (${loan.loanNumber}) is reaching its maturity date on ${loan.maturityDate}.</p>
            <p>Outstanding Amount: ${loan.totalAmount - loan.totalPaid}</p>
        `;
        const smsContent = `Your loan ${loan.loanNumber} is maturing on ${loan.maturityDate}. Outstanding amount: ${loan.totalAmount - loan.totalPaid}`;

        await this.notifyUser( loan.borrower, subject, emailContent, smsContent );
    }

    async notifyPaymentReceived( loan: Loan, payment: Payment ): Promise<void> {
        const subject = `Payment Received - ${loan.loanNumber}`;
        const emailContent = `
            <h2>Payment Received</h2>
            <p>We have received your payment for loan ${loan.loanNumber}:</p>
            <p>Amount: ${payment.amount}</p>
            <p>Date: ${payment.createdAt}</p>
            <p>Remaining Balance: ${loan.totalAmount - loan.totalPaid}</p>
        `;
        const smsContent = `Payment of ${payment.amount} received for loan ${loan.loanNumber}. Remaining balance: ${loan.totalAmount - loan.totalPaid}`;

        await this.notifyUser( loan.borrower, subject, emailContent, smsContent );
    }

    async notifyLoanCompletion( loan: Loan ): Promise<void> {
        const subject = `Loan Completed - ${loan.loanNumber}`;
        const emailContent = `
            <h2>Congratulations!</h2>
            <p>Your loan (${loan.loanNumber}) has been fully repaid and marked as completed.</p>
            <p>Thank you for your business!</p>
        `;
        const smsContent = `Congratulations! Your loan ${loan.loanNumber} has been fully repaid and completed.`;

        await this.notifyUser( loan.borrower, subject, emailContent, smsContent );
    }

    async notifyLatePayment( loan: Loan ): Promise<void> {
        const subject = `Late Payment Notice - ${loan.loanNumber}`;
        const emailContent = `
            <h2>Late Payment Notice</h2>
            <p>Your payment for loan ${loan.loanNumber} is overdue.</p>
            <p>Outstanding Amount: ${loan.totalAmount - loan.totalPaid}</p>
            <p>Please make your payment as soon as possible to avoid additional fees.</p>
        `;
        const smsContent = `Your payment for loan ${loan.loanNumber} is overdue. Outstanding amount: ${loan.totalAmount - loan.totalPaid}`;

        await this.notifyUser( loan.borrower, subject, emailContent, smsContent );

        // Also notify guarantors if any
        if ( loan.borrower.guarantors ) {
            for ( const guarantor of loan.borrower.guarantors ) {
                await this.notifyGuarantorLatePayment( loan, guarantor );
            }
        }
    }

    async notifyGuarantorAssignment( loan: Loan, guarantor: Guarantor ): Promise<void> {
        const subject = `Guarantor Assignment Notice`;
        const emailContent = `
            <h2>Guarantor Assignment Notice</h2>
            <p>You have been assigned as a guarantor for loan ${loan.loanNumber}.</p>
            <p>Borrower: ${loan.borrower.firstName} ${loan.borrower.lastName}</p>
            <p>Loan Amount: ${loan.principalAmount}</p>
        `;
        const smsContent = `You have been assigned as a guarantor for loan ${loan.loanNumber} (${loan.borrower.firstName} ${loan.borrower.lastName})`;

        await this.notifyUser( guarantor, subject, emailContent, smsContent );
    }

    private async notifyGuarantorLatePayment( loan: Loan, guarantor: Guarantor ): Promise<void> {
        const subject = `Late Payment Notice (Guarantor) - ${loan.loanNumber}`;
        const emailContent = `
            <h2>Late Payment Notice (Guarantor)</h2>
            <p>The loan you guaranteed (${loan.loanNumber}) has an overdue payment.</p>
            <p>Borrower: ${loan.borrower.firstName} ${loan.borrower.lastName}</p>
            <p>Outstanding Amount: ${loan.totalAmount - loan.totalPaid}</p>
        `;
        const smsContent = `Loan ${loan.loanNumber} that you guaranteed has an overdue payment. Outstanding amount: ${loan.totalAmount - loan.totalPaid}`;

        await this.notifyUser( guarantor, subject, emailContent, smsContent );
    }

    async notifyLoanStatusChange( loan: Loan ): Promise<void> {
        const subject = `Loan Status Update - ${loan.loanNumber}`;
        const emailContent = `
            <h2>Loan Status Update</h2>
            <p>Your loan (${loan.loanNumber}) status has been updated to: ${loan.status}</p>
            ${loan.status === LoanStatus.APPROVED ?
                `<p>Congratulations! Your loan has been approved.</p>` :
                loan.status === LoanStatus.REJECTED ?
                    `<p>Unfortunately, your loan application has been rejected.</p>` : ''}
        `;
        const smsContent = `Your loan ${loan.loanNumber} status has been updated to: ${loan.status}`;

        await this.notifyUser( loan.borrower, subject, emailContent, smsContent );
    }

    async notifyBranchManager( branchId: string, emailContent: string ): Promise<void> {
        try {
            const branch = await AppDataSource.getRepository( Branch ).findOne( {
                where: { id: branchId },
                relations: ['manager']
            } );

            if ( branch?.manager?.email ) {
                await this.sendEmail(
                    branch.manager.email,
                    'Daily Loan Status Report',
                    emailContent
                );
            }
        } catch ( error ) {
            Logger.error( 'Error sending branch manager notification:', error );
        }
    }
}
