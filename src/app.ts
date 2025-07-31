import httpStatus from 'http-status';
import express, {
  Application,
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from 'express';
import cors from 'cors';

import routes from './app/routes';
import cookieParser from 'cookie-parser';
import config from './config';
import compression from 'compression';
import {
  compressionOptions,
  helmetConfig,
  limiterRate,
} from './app/middlesWare/expressMiddlewares';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import client from 'prom-client';
import { swaggerApiSpecification, swaggerUiOptions } from './utils/swagger';
import { LogsRoutes } from './app/modules/logs/logs.routes';
import serverMonitor from './utils/serverMonitor';
import { globalErrorHandler } from './app/middlesWare/globalErrorHandler';

class AppManager {
  public app: Application;
  private responseTimes: any[] = [];
  private allowedOrigins: string[];

  constructor() {
    this.app = express();
    const collectDefaultMetrics = client.collectDefaultMetrics;
    collectDefaultMetrics();
    this.allowedOrigins = (config?.allowed_origin || '').split(',');
    this.setupMiddlewares();
    this.setupRoutes();
    this.setupErrorHandlers();
  }

  private setupMiddlewares() {
    this.app.use(this.dynamicCorsMiddleware.bind(this));
    this.app.use(express.json());
    this.app.use(cookieParser());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(compression(compressionOptions) as unknown as RequestHandler);
    this.app.use(limiterRate);
    this.app.use(
      '/uploadFile',
      express.static(path.join(__dirname, '../uploadFile')),
    );
    this.app.use(express.static('uploads'));
    this.app.use(
      '/api-docs',
      swaggerUi.serve as unknown as RequestHandler,
      swaggerUi.setup(
        swaggerApiSpecification,
        swaggerUiOptions,
      ) as unknown as RequestHandler,
    );
    this.app.use(helmetConfig);
  }

  private dynamicCorsMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const origin = req.headers.origin as string;
    if (origin && !this.allowedOrigins.includes(origin)) {
      this.allowedOrigins.push(origin);
    }
    cors({
      origin: (origin, callback) => {
        if (!origin || this.allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error(`Not allowed by CORS: ${origin}`));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      optionsSuccessStatus: 200,
    })(req, res, next);
  }

  private responseTimeLogger = (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const startTime = performance.now();
    res.on('finish', () => {
      const endTime = performance.now();
      const elapsedTime = endTime - startTime;
      const label =
        elapsedTime >= 1000 ? 'High' : elapsedTime >= 500 ? 'Medium' : 'Low';
      this.responseTimes.push({
        route: req.path,
        time: elapsedTime.toFixed(2),
        label,
      });
    });
    next();
  };

  private setupRoutes() {
    // Prometheus metrics endpoint - very important for monitoring
    this.app.get('/metrics', async (req, res) => {
      try {
        res.set('Content-Type', 'text/plain; version=0.0.4; charset=utf-8');
        res.end(await client.register.metrics());
      } catch (error) {
        res.status(500).end('Error generating metrics');
      }
    });

    this.app.use('/api/v1', this.responseTimeLogger, routes);
    this.app.get('/api-docs-json', (req, res) => {
      res.json(swaggerApiSpecification);
    });
    this.app.use('/logs', LogsRoutes);

    this.app.get('/', async (req: Request, res: Response) => {
      const responseData: any = {
        success: true,
        message: `Running the ${config.server_name}.`,
        statusCode: 201,
        serverUrl: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
      };
      if (config.env === 'development' || req.query?.mode === 'dev') {
        responseData.serverUrl = `http://localhost:${config.port}`;
        responseData.logsError = `http://localhost:${config.port}/logs/errors`;
        responseData.logsSuccess = `http://localhost:${config.port}/logs/successes`;
      }
      res.send(
        await serverMonitor.getServerMonitorPage(req, this.responseTimes),
      );
    });
  }

  private setupErrorHandlers() {
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      res.status(httpStatus.NOT_FOUND).json({
        success: false,
        message: 'Not Found the path',
        errorMessages: [
          {
            path: req.originalUrl,
            message: 'API Not Found',
          },
        ],
      });
      next();
    });
    this.app.use(globalErrorHandler);
  }
}

const appManager = new AppManager();
export default appManager.app;
