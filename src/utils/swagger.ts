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

// ! swagger UI customization sections
export const swaggerUiOptions = {
  customSiteTitle: 'Life Sync API Docs',
  customfavIcon:'/uploadFile/images/default/life-synce-fav.png',
  customCss: `
      .swagger-ui .topbar { 
          //  display: none !important;
      background-color: #2c3e50 !important; 
      border-bottom: 2px solid #2980b9;
    }
    .swagger-ui .topbar a span { 
      color: #ecf0f1 !important;
      font-weight: bold;
    }
    .swagger-ui .topbar .topbar-wrapper { 
      // display: none !important; 
    }
    .swagger-ui .topbar .topbar-wrapper::before {
      content: 'Life Sync API Docs';
      color: #fff;
      font-size: 18px;
      margin:auto;
      padding:24px;
      text-align: center;
      font-weight: bold;
      text-transform: uppercase;
    }
  `,
  swaggerOptions: {
    docExpansion: 'none', // Collapses the routes by default
  },
};
export const swaggerApiSpecification = swaggerJsdoc(options);


