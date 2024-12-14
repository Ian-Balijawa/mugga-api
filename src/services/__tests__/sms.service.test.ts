import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { SmsService } from '../sms.service';
import { Twilio } from 'twilio';

jest.mock('twilio');

describe('SmsService', () => {
  let smsService: SmsService;

  beforeEach(() => {
    smsService = new SmsService();
  });

  describe('sendSms', () => {
    it('should successfully send an SMS', async () => {
      // Arrange
      const mockMessageId = 'mock-message-id';
      const inputParams = {
        to: '+1234567890',
        message: 'Test message',
      };
      // @ts-ignore
      const mockCreate = jest.fn().mockResolvedValue({ sid: mockMessageId });
      (Twilio as jest.Mock).mockImplementation(() => ({
        messages: { create: mockCreate },
      }));

      // Act
      const actualResult = await smsService.sendSms(inputParams);

      // Assert
      expect(actualResult.success).toBe(true);
      expect(actualResult.messageId).toBe(mockMessageId);
    });

    it('should handle errors when sending SMS fails', async () => {
      // Arrange
      const inputParams = {
        to: '+1234567890',
        message: 'Test message',
      };
      const mockError = new Error('Failed to send');
      // @ts-ignore
      const mockCreate = jest.fn().mockRejectedValue(mockError);
      (Twilio as jest.Mock).mockImplementation(() => ({
        messages: { create: mockCreate },
      }));

      // Act
      const actualResult = await smsService.sendSms(inputParams);

      // Assert
      expect(actualResult.success).toBe(false);
      expect(actualResult.error).toBe('Failed to send');
    });
  });

  describe('isValidPhoneNumber', () => {
    it('should validate correct phone numbers', () => {
      // Arrange
      const inputValidNumber = '+1234567890';
      const inputInvalidNumber = '1234567890';

      // Act & Assert
      expect(smsService.isValidPhoneNumber(inputValidNumber)).toBe(true);
      expect(smsService.isValidPhoneNumber(inputInvalidNumber)).toBe(false);
    });
  });
});
