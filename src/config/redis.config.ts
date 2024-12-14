import Redis from 'ioredis';
import env from './env.config';
import { Logger } from '../utils/logger';

const redis = new Redis( env.REDIS_URL, {
  maxRetriesPerRequest: 3,
  retryStrategy: ( times: number ) => {
    const delay = Math.min( times * 50, 2000 );
    return delay;
  }
} );

redis.on( 'error', ( error ) => {
  Logger.error( 'Redis connection error:', error );
} );

redis.on( 'connect', () => {
  Logger.info( 'Redis connected successfully' );
} );

export default redis;
