import { Express } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sports Academy API',
      version: '1.0.0',
      description: 'API documentation for Sports Academy management system',
      contact: {
        name: 'API Support',
        email: 'support@sportsacademy.com'
      }
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:8000',
        description: 'Development server'
      },
      {
        url: process.env.API_URL_PROD || 'https://arena.ianbalijawa.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string' },
                  message: { type: 'string' }
                }
              }
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.ts'] // Path to the API routes
};

export function setupSwagger( app: Express ): void {
  const specs = swaggerJsdoc( options );
  app.use( '/api-docs', swaggerUi.serve, swaggerUi.setup( specs ) );
}
