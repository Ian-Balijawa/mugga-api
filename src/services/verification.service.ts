import { Redis } from 'ioredis';
import { MailService } from './mail.service';
import { SmsService } from './sms.service';
import crypto from 'crypto';

export class VerificationService {
  private readonly redis: Redis;
  private readonly mailService: MailService;
  private readonly smsService: SmsService;

  // Prefixes for Redis keys
  private readonly EMAIL_VERIFY_PREFIX = 'email_verify:';
  private readonly PHONE_VERIFY_PREFIX = 'phone_verify:';
  private readonly SECURITY_CODE_PREFIX = 'security_code:';

  constructor(redis: Redis) {
    this.redis = redis;
    this.mailService = new MailService();
    this.smsService = new SmsService();
  }

  private generateOTP(): string {
    return crypto.randomInt(100000, 999999).toString();
  }

  private generateSecurityCode(): string {
    return crypto.randomBytes(3).toString('hex').toUpperCase();
  }

  async sendEmailVerificationOTP(email: string): Promise<void> {
    const otp = this.generateOTP();
    const key = `${this.EMAIL_VERIFY_PREFIX}${email}`;

    // Store OTP with 1 minute expiry
    await this.redis.setex(key, 60, otp);

    await this.mailService.sendMail({
      to: email,
      subject: 'Email Verification Code',
      html: `
        <h1>Email Verification</h1>
        <p>Your verification code is: <strong>${otp}</strong></p>
        <p>This code will expire in 1 minute.</p>
      `
    });
  }

  async sendPhoneVerificationOTP(phone: string): Promise<void> {
    const otp = this.generateOTP();
    const key = `${this.PHONE_VERIFY_PREFIX}${phone}`;

    // Store OTP with 5 minutes expiry
    await this.redis.setex(key, 300, otp);

    await this.smsService.sendSms({
      to: phone,
      message: `Your phone verification code is: ${otp}. Valid for 5 minutes.`
    });
  }

  async generateSecurityCodeForReset(email: string): Promise<string> {
    const code = this.generateSecurityCode();
    const key = `${this.SECURITY_CODE_PREFIX}${email}`;

    // Store security code with 15 minutes expiry
    await this.redis.setex(key, 900, code);

    return code;
  }

  async verifyEmailOTP(email: string, otp: string): Promise<boolean> {
    const key = `${this.EMAIL_VERIFY_PREFIX}${email}`;
    const storedOTP = await this.redis.get(key);

    if (!storedOTP || storedOTP !== otp) {
      return false;
    }

    await this.redis.del(key);
    return true;
  }

  async verifyPhoneOTP(phone: string, otp: string): Promise<boolean> {
    const key = `${this.PHONE_VERIFY_PREFIX}${phone}`;
    const storedOTP = await this.redis.get(key);

    if (!storedOTP || storedOTP !== otp) {
      return false;
    }

    await this.redis.del(key);
    return true;
  }

  async verifySecurityCode(email: string, code: string): Promise<boolean> {
    const key = `${this.SECURITY_CODE_PREFIX}${email}`;
    const storedCode = await this.redis.get(key);

    if (!storedCode || storedCode !== code) {
      return false;
    }

    await this.redis.del(key);
    return true;
  }
}
