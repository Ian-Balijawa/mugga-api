import "dotenv/config";
import { DataSource } from 'typeorm';
import env from './env.config';
import { User } from '../entities/user.entity';
import { LoanOfficer } from '../entities/loan-officer.entity';
import { Borrower } from '../entities/borrower.entity';
import { Loan } from '../entities/loan.entity';
import { Guarantor } from '../entities/guarantor.entity';
import { Comment } from '../entities/comment.entity';
import { Fee } from '../entities/fee.entity';
import { Collateral } from '../entities/collateral.entity';
import { BorrowerGroup } from '../entities/borrower-group.entity';
import { ActivityLog } from '../entities/activity-log.entity';
import { Payment } from '../entities/payment.entity';
import { Document } from '../entities/document.entity';
import { Branch } from '../entities/branch.entity';
import { LoanType } from '../entities/loan-type.entity';

export const AppDataSource = new DataSource( {
  type: 'mysql',
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASS,
  database: env.DB_NAME,
  synchronize: env.NODE_ENV === 'development',
  logging: env.NODE_ENV === 'development',
  entities: [User, LoanOfficer, Borrower, Loan, Guarantor, Comment, Fee, Collateral, BorrowerGroup, ActivityLog, Payment, Document, Branch, LoanType],
  migrations: ['src/migrations/*.ts'],
} );


