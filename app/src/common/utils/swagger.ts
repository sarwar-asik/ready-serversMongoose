import swaggerJsdoc, { Options, Tag } from 'swagger-jsdoc';
import path from 'path';

import { swaggerDefinition, swaggerTags } from './swagger.utils';
import config from '../../config';

interface SwaggerConfig {
  serverName: string;
  version?: string;
  description?: string;
  contact?: {
    name: string;
    email: string;
    url: string;
  };
  license?: {
    name: string;
    url: string;
  };
  servers: { url: string }[];
  swaggerDefinition: Record<string, unknown>;
  swaggerTags: Tag[];
}

class SwaggerService {
  private options: Options;
  private uiOptions: Record<string, unknown>;
  private specification: object;

  constructor({
    serverName,
    version = '1.0.0',
    description = '',
    contact = {
      name: 'Sarwar Hossain [Star Connect]',
      email: 'sarwarasik@gmail.com',
      url: 'https://www.linkedin.com/in/sarwar-asik/',
    },
    license = {
      name: 'Company',
      url: 'https://dev.starconnect.com',
    },
    servers = [
      { url: 'http://localhost:5001' },
      { url: 'http://54.157.71.177:5001' },
    ],
    swaggerDefinition,
    swaggerTags,
  }: SwaggerConfig) {
    this.options = {
      definition: {
        openapi: '3.0.0',
        info: {
          title: `${serverName} Backend`,
          version,
          description: description || `Api Design of ${serverName}`,
          contact,
          license,
        },
        servers,
        components: {
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT',
            },
          },
          schemas: swaggerDefinition,
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        tags: swaggerTags,
      },
      apis: [path.join(__dirname, '../app/modules/**/*.ts')],
    };

    // UI Options
    this.uiOptions = {
      explorer: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
      customSiteTitle: `${serverName} API Docs`,
      customCss: `
        .swagger-ui .topbar { 
          background-color: #2c3e50 !important; 
          border-bottom: 2px solid #2980b9;
        }
        .swagger-ui .topbar a span { 
          color: #ecf0f1 !important;
          font-weight: bold;
        }
        .swagger-ui .topbar .topbar-wrapper::before {
          content: '${serverName} Api Design';
          color: #fff;
          font-size: 18px;
          margin:auto;
          padding:24px;
          text-align: center;
          font-weight: bold;
          text-transform: uppercase;
        }
      `,
      docExpansion: 'none',
      defaultModelsExpandDepth: 2,
      swaggerOptions: {
        persistAuthorization: true,
      },
    };

    this.specification = swaggerJsdoc(this.options);
  }

  getSpecification(): object {
    return this.specification;
  }

  getOptions(): Options {
    return this.options;
  }

  getUiOptions(): Record<string, unknown> {
    return this.uiOptions;
  }
}

const swaggerService = new SwaggerService({
  serverName: config.server_name ?? 'The Server',
  version: '1.0.0',
  servers: [
    { url: 'http://localhost:5001' },
    { url: 'http://54.157.71.177:5001' },
  ],
  swaggerDefinition,
  swaggerTags,
});

export const swaggerApiSpecification = swaggerService.getSpecification();
export const swaggerUiOptions = swaggerService.getUiOptions();
