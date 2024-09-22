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
import path from "path"
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
        : [''],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(helmetConfig);
app.use(compression(compressionOptions)); ///! used for compressing the response at large response . It will reduce the response time & size
app.use(limiterRate); ///! for stop hacking by  limiting too much request

// Application

// app.use('/api/v1/users', UserRouter)
// app.use("/api/v1/semester",semesterRouter)

//*** */ or ***////
app.use('/api/v1', routes);

app.use(express.static('uploads'));
app.use('/uploadFile', express.static(path.join(__dirname, '../uploadFile')));
app.get('/', async (req: Request, res: Response) => {
   res.json({
     success: true,
     message: 'Running the LifeSync server',
     statusCode: 201,
     data: null,
     serverUrl: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
   });
  // next();
});



// for unknown apiii hit error handle
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
// for testing userId dynamic based on yaer and code ///
// const academicSemester = {
//   code: '01',
//   year: '2025',
// };

const TestFunc = async () => {
  // const testId = await generateFacultyId();
  console.log('TestFunc from app.ts');
};

TestFunc();

export default app;
