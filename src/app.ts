/* eslint-disable no-console */
import httpStatus from 'http-status';
// const express = require('express')
import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import GlobalHandler from './app/middlesWare/globalErrorHandler';
import routes from './app/routes';
// import sendResponse from './shared/sendResponce';
// import { generateFacultyId } from './app/modules/users/user.utils';
import cookieParser from 'cookie-parser';
import config from './config';
import compression from 'compression';
import {
  compressionOptions,
  helmetConfig,
  limiterRate,
} from './config/expressMiddleware.config';
// import { createUser } from './app/modules/users/users.services'
import path from "path";
import swaggerUi from 'swagger-ui-express';
import { swaggerApiSpecification, swaggerUiOptions } from './utils/swagger';
import { LogsRoutes } from './app/modules/logs/logs.routes';
const app: Application = express();
// const port = 3000

app.use(
  cors({
    origin:
      config.env === 'development'
        ? [
          'http://localhost:3000',
          'http://127.0.0.1:3000',
          'http://192.168.0.101:3000',
        ]
        : [config.allowed_origin as string],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(compression(compressionOptions)); ///! used for compressing the response at large response . It will reduce the response time & size
app.use(limiterRate); ///! for stop hacking by  limiting too much request

app.use('/uploadFile', express.static(path.join(__dirname, '../uploadFile')));

app.use(express.static('uploads'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerApiSpecification, swaggerUiOptions));

app.use(helmetConfig);
// Application


//*** */ or ***////
app.use('/api/v1', routes);



app.use("/logs", LogsRoutes);

app.get('/', async (req: Request, res: Response) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const responseData: any = {
    success: true,
    message: 'Running the LifeSync server.',
    statusCode: 201,
    serverUrl: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
  }

  if (config.env === 'development' || req.query?.mode === "dev") {
    responseData.serverUrl = `http://localhost:${config.port}`;
    responseData.logsError = `http://localhost:${config.port}/logs/errors`;
    responseData.logsSuccess = `http://localhost:${config.port}/logs/successes`;
  }
  res.json(responseData);
  // next();
});



// for unknown api hit error handle
app.use((req: Request, res: Response, next: NextFunction) => {
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

app.use(GlobalHandler);


// const TestFunc = async () => {
//   // const testId = await generateFacultyId();
//   console.log('TestFunc from app.ts');
// };

// TestFunc();

export default app;
