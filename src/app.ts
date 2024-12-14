import 'express-async-errors';
import "dotenv/config";
import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { AppDataSource } from './config/database.config';
import { errorHandler } from './middlewares/error-handler.middleware';
import env from './config/env.config';
import { createRequestValidator } from './middlewares/request-validator.middleware';
import { smsRateLimiter } from './middlewares/rate-limiter.middleware';
import { z } from 'zod';
import { userRoutes } from './routes/user.routes';
import { borrowerRoutes } from './routes/borrower.routes';
import { loanOfficerRoutes } from './routes/loan-officer.routes';
import { Logger } from './utils/logger';
import { normalizeResponse } from './middlewares/response-normalizer.middleware';
import { authRoutes } from './routes/auth.routes';
import { specs, swaggerUi } from './config/swagger.config';
import { commentRoutes } from './routes/comment.routes';
import { feeRoutes } from './routes/fee.routes';
import { loanRoutes } from './routes/loan.routes';
import { borrowerGroupRoutes } from './routes/borrower-group.routes';
import { collateralRoutes } from './routes/collateral.routes';
import { paymentRoutes } from './routes/payment.routes';
import { activityLogRoutes } from './routes/activity-log.routes';
import { branchRoutes } from './routes/branch.routes';
import { CronService } from './services/cron.service';

// Global error handlers
process.on( 'uncaughtException', ( error: Error ) => {
  Logger.error( 'Uncaught Exception:', error );
  process.exit( 1 );
} );

process.on( 'unhandledRejection', ( reason: any, promise: Promise<any> ) => {
  Logger.error( 'Unhandled Rejection:', { reason, promise } );
  process.exit( 1 );
} );

const app = express();

// Middleware
app.use( helmet() );
app.use( compression() );
app.use( cors() );
app.use( morgan( 'common' ) );
app.use( express.json() );
app.use( express.urlencoded( { extended: true } ) );
app.use( normalizeResponse );

// Initialize cron service
new CronService();

// Rate limiting
app.use( rateLimit( {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
} ) );

// SMS validation schema
const smsSchema = z.object( {
  body: z.object( {
    to: z.string().regex( /^\+[1-9]\d{1,14}$/ ),
    message: z.string().min( 1 ).max( 160 )
  } )
} );

// Example SMS route with both middlewares
app.post(
  '/api/sms',
  smsRateLimiter,
  createRequestValidator( { body: smsSchema.shape.body } ),
  // Your route handler here
);

// Swagger documentation
app.use( '/api-docs', swaggerUi.serve, swaggerUi.setup( specs ) );

// Routes
app.use( '/api/v1/users', userRoutes );
app.use( '/api/v1/borrowers', borrowerRoutes );
app.use( '/api/v1/loan-officers', loanOfficerRoutes );
app.use( '/api/v1/auth', authRoutes );
app.use( '/api/v1/comments', commentRoutes );
app.use( '/api/v1/fees', feeRoutes );
app.use( '/api/v1/loans', loanRoutes );
app.use( '/api/v1/collaterals', collateralRoutes );
app.use( '/api/v1/borrower-groups', borrowerGroupRoutes );
app.use( '/api/v1/payments', paymentRoutes );
app.use( '/api/v1/activity-logs', activityLogRoutes );
app.use( '/api/v1/branches', branchRoutes );

// Error handling
app.use( errorHandler );

// Database connection and server startup
const startServer = async () => {
  try {
    await AppDataSource.initialize();
    Logger.info( 'Database connected successfully' );

    const port = env.PORT || 5000;
    app.listen( port, () => {
      Logger.info( `Server is running on port ${port}` );
    } );

  } catch ( error ) {
    Logger.error( 'Error starting server:', error );
    process.exit( 1 );
  }
};

startServer();
