import { mailTransporter } from '../config/mail.config';
import { Logger } from '../utils/logger';
import env from '../config/env.config';

export interface EmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}

export class MailService {
  private readonly defaultFrom: string;

  constructor() {
    this.defaultFrom = `${env.APP_NAME} <${env.SMTP_USER}>`;
  }

  /**
   * Sends an email using the configured mail transporter
   * @param options Email options including recipient, subject, and content
   */
  public async sendMail(options: EmailOptions): Promise<void> {
    try {
      const mailOptions = {
        from: this.defaultFrom,
        ...options
      };

      await mailTransporter.sendMail(mailOptions);
      Logger.info('Email sent successfully', { to: options.to, subject: options.subject });
    } catch (error) {
      Logger.error('Failed to send email', error);
      throw new Error('Failed to send email');
    }
  }

  /**
   * Sends a welcome email to a new user
   * @param email User's email address
   * @param name User's name
   */
  public async sendWelcomeEmail(email: string, name: string): Promise<void> {
    const options: EmailOptions = {
      to: email,
      subject: `Welcome to ${env.APP_NAME}!`,
      html: `
        <h1>Welcome ${name}!</h1>
        <p>Thank you for joining ${env.APP_NAME}. We're excited to have you on board!</p>
        <p>If you have any questions, feel free to reply to this email.</p>
        <br>
        <p>Best regards,</p>
        <p>The ${env.APP_NAME} Team</p>
      `
    };

    await this.sendMail(options);
  }

  /**
   * Sends a password reset email
   * @param email User's email address
   * @param resetToken Password reset token
   */
  public async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
    const resetLink = `${env.APP_URL}/reset-password?token=${resetToken}`;

    const options: EmailOptions = {
      to: email,
      subject: 'Password Reset Request',
      html: `
        <h1>Password Reset Request</h1>
        <p>You requested to reset your password. Click the link below to reset it:</p>
        <p><a href="${resetLink}">Reset Password</a></p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>This link will expire in 1 hour.</p>
        <br>
        <p>Best regards,</p>
        <p>The ${env.APP_NAME} Team</p>
      `
    };

    await this.sendMail(options);
  }

  /**
   * Sends a notification email
   * @param email Recipient's email address
   * @param subject Email subject
   * @param message Email message
   */
  public async sendNotification(email: string, subject: string, message: string): Promise<void> {
    const options: EmailOptions = {
      to: email,
      subject,
      html: `
        <h1>${subject}</h1>
        <p>${message}</p>
        <br>
        <p>Best regards,</p>
        <p>The ${env.APP_NAME} Team</p>
      `
    };

    await this.sendMail(options);
  }

  /**
   * Sends an email with attachments
   * @param email Recipient's email address
   * @param subject Email subject
   * @param message Email message
   * @param attachments Array of attachments
   */
  public async sendEmailWithAttachments(
    email: string,
    subject: string,
    message: string,
    attachments: EmailOptions['attachments']
  ): Promise<void> {
    const options: EmailOptions = {
      to: email,
      subject,
      html: `
        <h1>${subject}</h1>
        <p>${message}</p>
        <br>
        <p>Best regards,</p>
        <p>The ${env.APP_NAME} Team</p>
      `,
      attachments
    };

    await this.sendMail(options);
  }
}
