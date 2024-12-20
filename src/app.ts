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
import { Logger } from './utils/logger';
import { setupSwagger } from './config/swagger.config';
import { adminRoutes } from './routes/admin.routes';
import { postRoutes } from './routes/post.routes';
import { contactRoutes } from './routes/contact.routes';
import { coachRoutes } from './routes/coach.routes';
import { galleryRoutes } from './routes/gallery.routes';
import { facilityRoutes } from './routes/facility.routes';
import { programRoutes } from './routes/program.routes';
import { registrationRoutes } from './routes/registration.routes';
import { statsRoutes } from './routes/stats.routes';
import { logActivity } from './middlewares/activity-logger.middleware';

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

setupSwagger( app );

// Middleware
app.use( helmet() );
app.use( compression() );
app.use( cors( {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Total-Count'],
} ) );
app.use( morgan( 'common' ) );
app.use( express.json() );
app.use( express.urlencoded( { extended: true } ) );
app.use( express.static( 'public' ) );

app.use( rateLimit( {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
} ) );

const API_VERSION = 'v1';

// Routes
app.use( `/api/${API_VERSION}/admin`, logActivity( 'admin' ), adminRoutes );
app.use( `/api/${API_VERSION}/posts`, logActivity( 'post' ), postRoutes );
app.use( `/api/${API_VERSION}/contact`, logActivity( 'contact' ), contactRoutes );

app.use( `/api/${API_VERSION}/coaches`, logActivity( 'coach' ), coachRoutes );
app.use( `/api/${API_VERSION}/gallery`, logActivity( 'gallery' ), galleryRoutes );
app.use( `/api/${API_VERSION}/facilities`, logActivity( 'facility' ), facilityRoutes );
app.use( `/api/${API_VERSION}/programs`, logActivity( 'program' ), programRoutes );
app.use( `/api/${API_VERSION}/registrations`, logActivity( 'registration' ), registrationRoutes );
app.use( `/api/${API_VERSION}/stats`, logActivity( 'stats' ), statsRoutes );

// add a health check route
app.get( `/api/${API_VERSION}/health`, ( _req, res ) => {
  res.status( 200 ).send( 'Server is up and running' );
} );

// hello world
app.get( `/`, ( _req, res ) => {
  res.status( 200 ).send( 'Hello World' );
} );

// Error Handler
app.use( errorHandler );

const startServer = async () => {
  try {
    await AppDataSource.initialize();
    Logger.info( 'Database connection established' );

    const port = env.PORT || 5000;
    app.listen( port, () => {
      Logger.info( `Server running on port ${port}` );
    } );
  } catch ( error ) {
    Logger.error( 'Error starting server:', error );
    process.exit( 1 );
  }
};

startServer();
