import { z } from 'zod';

export interface EnvConfig {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;

  // Database
  DB_HOST: string;
  DB_PORT: number;
  DB_USER: string;
  DB_PASS: string;
  DB_NAME: string;

  // JWT
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;

  // Redis
  REDIS_URL: string;

  // Mail
  SMTP_HOST: string;
  SMTP_PORT: number;
  SMTP_USER: string;
  SMTP_PASS: string;

  MAIL_TO: string;

  APP_NAME: string;
  APP_URL: string;
}

const envSchema = z.object( {
  NODE_ENV: z.enum( ['development', 'production', 'test'] ),
  PORT: z.string().transform( Number ),

  // Database
  DB_HOST: z.string(),
  DB_PORT: z.string().transform( Number ),
  DB_USER: z.string(),
  DB_PASS: z.string(),
  DB_NAME: z.string(),

  // JWT
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string(),

  // Redis
  REDIS_URL: z.string(),

  // Mail
  SMTP_HOST: z.string(),
  SMTP_PORT: z.string().transform( Number ),
  SMTP_USER: z.string(),
  SMTP_PASS: z.string(),

  MAIL_TO: z.string(),

  APP_NAME: z.string(),
  APP_URL: z.string(),
} );

const env = envSchema.parse( process.env );
export default env;
