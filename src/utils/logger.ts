import logger from '../config/logger.config';

export const Logger = {
  info: (message: string, meta?: Record<string, unknown>) => {
    logger.info(message, meta);
  },

  error: (message: string, error?: Error | unknown) => {
    logger.error(message, {
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack
      } : error
    });
  },

  warn: (message: string, meta?: Record<string, unknown>) => {
    logger.warn(message, meta);
  },

  debug: (message: string, meta?: Record<string, unknown>) => {
    logger.debug(message, meta);
  },

  http: (message: string, meta?: Record<string, unknown>) => {
    logger.http(message, meta);
  }
};
