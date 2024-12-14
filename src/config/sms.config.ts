export interface SmsConfig {
  readonly accountSid: string;
  readonly authToken: string;
  readonly fromNumber: string;
}

export const smsConfig: SmsConfig = {
  accountSid: process.env.TWILIO_ACCOUNT_SID ?? '',
  authToken: process.env.TWILIO_AUTH_TOKEN ?? '',
  fromNumber: process.env.TWILIO_FROM_NUMBER ?? '',
};
