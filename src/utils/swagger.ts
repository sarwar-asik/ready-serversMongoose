import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';
import schemaConverter from './schemaConverter';
import { UserSchema } from '../app/modules/USER/user.model';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'App Backend',
      version: '1.0.0',
      description:"API Documentation ",
      contact:{
        name:"Sarwar Hossain",
        email:"sarwarasik@gmail.com",
        url:"https://www.linkedin.com/in/sarwar-asik/"
      },
      license: {
        name: 'Spark Tech',
        url: 'https://sparktech.agency/',
      },
    },
       // !component part
       components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
        schemas: {
          UserSchema:schemaConverter(UserSchema), 
        },
        response:{
          description: 'Access token is missing or invalid',
          content: {
            'application/json': {
              example: { message: 'Unauthorized' },
            },
          },
        }
      },
       // !security part
      security: [
        {
          bearerAuth: [],
        },
      ],
  },
  apis: [
    path.join(__dirname, '../app/routes/*.ts'), 
    path.join(__dirname, '../app/modules/**/*.ts'),
    path.join(__dirname, '../app.ts'),
  ],
};

export const openapiSpecification = swaggerJsdoc(options);
