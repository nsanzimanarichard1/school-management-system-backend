import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'School Management System - Client API',
      version: '1.0.0',
      description: 'API for Parent/Student portal - Fee management, grades, attendance',
      contact: {
        name: 'Elevanda Ventures',
        email: 'careers@elevandaventures.com'
      }
    },
    servers: [
      {
        url: 'https://school-management-system-backend-1-g6hv.onrender.com',
        description: 'Production server'
      },
      {
        url: 'http://localhost:4000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./dist/routes/*.js', './src/routes/*.ts']
};

export const swaggerSpec = swaggerJsdoc(options);

