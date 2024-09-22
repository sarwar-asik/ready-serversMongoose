import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';
const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Welcome to Sarwar Server  API Documentation',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        apikeyAuth: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header',
          description:
            'Custom token authorization: Use "Authorization: yourTokenHere"',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'User ID' },
            email: { type: 'string', description: 'User email' },
            userName: { type: 'string', description: 'User name' },
            contactNumber: {
              type: 'string',
              description: 'User contactNumber',
            },
            img: { type: 'string', description: 'User img' },
            details: { type: 'string', description: 'User details' },
            location: { type: 'string', description: 'User location' },
            points: { type: Number, description: 'User points' },
            role: { type: 'enum', description: 'User Admin Super Admin' },

            blood: { type: 'enum', description: 'AB+ AB- O+ O- A- A+ B+ B-' },
            gender: { type: 'enum', description: 'Male Female' },
          },
        },
        Plan: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              description: 'The title of the plan',
            },
            goalType: {
              type: 'string',
              description: 'The type of goal for the plan',
            },
            points: {
              type: 'number',
              description: 'Points associated with the plan',
            },
          },
        },
        PlanInput: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              description: 'The title of the plan',
            },
            goalType: {
              type: 'string',
              description: 'The type of goal for the plan',
            },
            points: {
              type: 'number',
              description: 'Points associated with the plan',
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // apis: ['../app/**/*.ts', '../app.ts'], // Adjust the path to your route files
  // apis: ['./app/modules/**/*.ts'],
  // apis:["../app/routes/index.ts","../app/modules/**/*.ts","../app.ts",'./swagger.routes.ts'],
  apis: [
    path.join(__dirname, '../app/routes/*.ts'), // Adjust path as necessary
    path.join(__dirname, '../app/modules/**/*.ts'),
    path.join(__dirname, '../app.ts'),
  ],
};

export const openapiSpecification = swaggerJsdoc(options);
