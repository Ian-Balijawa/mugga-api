import nodemailer from 'nodemailer';
import { ContactFormData } from '../types/common.types';
import { Registration } from '../entities/registration.entity';
import env from '../config/env.config';
import { Logger } from '../utils/logger';

export class MailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport( {
            host: env.SMTP_HOST,
            port: env.SMTP_PORT,
            secure: env.SMTP_PORT === 465,
            auth: {
                user: env.SMTP_USER,
                pass: env.SMTP_PASS
            }
        } );
    }

    async sendContactFormEmail( data: ContactFormData ): Promise<void> {
        await this.transporter.sendMail( {
            from: env.SMTP_USER,
            to: env.MAIL_TO,
            subject: `Contact Form: ${data.subject}`,
            html: this.generateContactEmailTemplate( data )
        } );
    }

    async sendRegistrationConfirmation( registration: Registration ): Promise<void> {
        Logger.info( `Registration Confirmation Email Template: ${registration}` );

        await this.transporter.sendMail( {
            from: env.SMTP_USER,
            to: registration.email,
            subject: 'Registration Confirmation',
            html: this.generateRegistrationEmailTemplate( registration )
        } );
    }

    private generateContactEmailTemplate( data: ContactFormData ): string {
        return `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Subject:</strong> ${data.subject}</p>
            <p><strong>Message:</strong></p>
            <p>${data.message}</p>
        `;
    }

    private generateRegistrationEmailTemplate( registration: Registration ): string {

        Logger.info( `Registration Confirmation Email Template: ${registration}` );

        return `
            <h2>Registration Confirmation</h2>
            <p>Dear ${registration.firstName},</p>
            <p>Thank you for registering for ${registration.program.name}.</p>
            <p><strong>Start Date:</strong> ${registration.startDate.toLocaleDateString()}</p>
            <p><strong>Program Details:</strong></p>
            <ul>
                <li>Duration: ${registration.program.duration}</li>
                <li>Schedule: ${registration.program.schedule}</li>
                <li>Price: $${registration.program.price}</li>
            </ul>
            <p>If you have any questions, please don't hesitate to contact us.</p>
        `;
    }
}
