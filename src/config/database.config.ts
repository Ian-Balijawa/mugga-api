import "dotenv/config";
import { DataSource } from 'typeorm';
import env from './env.config';
import { BaseEntity } from '../entities/base.entity';
import { Post } from '../entities/post.entity';
import { Coach } from '../entities/coach.entity';
import { GalleryItem } from '../entities/gallery-item.entity';
import { Facility } from '../entities/facility.entity';
import { Program } from '../entities/program.entity';
import { Registration } from '../entities/registration.entity';
import { User } from '../entities/user.entity';
import { ActivityLog } from '../entities/activity-log.entity';
import { NewsLetterSubscription } from '../entities/news-letter-subscriptions';
import { Alumni } from '../entities/alumni.entity';

export const AppDataSource = new DataSource( {
  type: 'mysql',
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASS,
  database: env.DB_NAME,
  // synchronize: env.NODE_ENV === 'development',
  synchronize: true,
  logging: false,
  entities: [
    BaseEntity,
    Post,
    Coach,
    GalleryItem,
    Facility,
    Program,
    Registration,
    User,
    ActivityLog,
    NewsLetterSubscription,
    Alumni
  ],
  migrations: ['src/migrations/*.ts'],
} );
