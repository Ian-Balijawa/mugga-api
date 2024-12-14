import { Twilio } from 'twilio';
import { smsConfig } from '../config/sms.config';

interface SendSmsParams {
  readonly to: string;
  readonly message: string;
}

interface SendSmsResult {
  readonly success: boolean;
  readonly messageId?: string;
  readonly error?: string;
}

/**
 * Service for sending SMS messages using Twilio
 */
export class SmsService {
  private readonly client: Twilio;

  constructor() {
    this.client = new Twilio( smsConfig.accountSid, smsConfig.authToken );
  }

  /**
   * Sends an SMS message to the specified phone number
   * @param params The SMS parameters including recipient and message
   * @returns Result of the SMS sending operation
   */
  public async sendSms( params: SendSmsParams ): Promise<SendSmsResult> {
    try {
      const message = await this.client.messages.create( {
        body: params.message,
        from: smsConfig.fromNumber,
        to: params.to,
      } );
      return {
        success: true,
        messageId: message.sid,
      };
    } catch ( err ) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Validates if a phone number is in valid Ugandan format
   * @param phone The phone number to validate (e.g., +256712345678)
   * @returns True if the phone number is a valid Ugandan number
   */
  public isValidPhoneNumber( phone: string ): boolean {
    const ugandaPhoneRegex = /^\+256[7][0-9]{8}$/;
    return ugandaPhoneRegex.test( phone );
  }
}
