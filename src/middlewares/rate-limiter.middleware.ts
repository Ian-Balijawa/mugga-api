import rateLimit from 'express-rate-limit';

export interface RateLimiterOptions {
  windowMs?: number;
  max?: number;
  message?: string;
}

/**
 * Creates a rate limiter middleware with configurable options
 * @param options - Configuration options for the rate limiter
 */
export function createRateLimiter(options: RateLimiterOptions = {}) {
  return rateLimit({
    windowMs: options.windowMs || 15 * 60 * 1000, // Default: 15 minutes
    max: options.max || 100, // Default: 100 requests per windowMs
    message: options.message || 'Too many requests, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
  });
}

// Specific rate limiter for SMS endpoints
export const smsRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 requests per minute
  message: 'SMS rate limit exceeded. Please try again later.',
});
