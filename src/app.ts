/* eslint-disable no-console */
import httpStatus from 'http-status';
// const express = require('express')
import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';

import GlobalHandler from './app/middlesWare/globalErrorHandler';

import routes from './app/routes';
import sendResponse from './shared/sendResponce';
// import { generateFacultyId } from './app/modules/users/user.utils';
import cookieParser from 'cookie-parser';
import config from './config';
import compression from 'compression';
import {
  compressionOptions,
  limiterRate,
} from './config/expressMiddleware.config';

// import { createUser } from './app/modules/users/users.services'

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
app.use(compression(compressionOptions)); ///! used for compressing the response at large response . It will reduce the response time & size
app.use(limiterRate); ///! for stop hacking by  limiting too much request

// Application

// app.use('/api/v1/users', UserRouter)
// app.use("/api/v1/semester",semesterRouter)

//*** */ or ***////
app.use('/api/v1', routes);

app.get('/', async (req: Request, res: Response) => {
  //  const addUser = await createUser({id:"445",role:"admin",password:"asdfasdf"})

  // res.send(addUser)
  // throw new ApiError(400, 'Error from app.ts')
  // Promise.reject(new Error('Unhandle Promise from app.ts'))

  // throw new Error("Error from app.get")
  // next("next error")
  sendResponse(res, {
    success: true,
    message: 'Running the Sarwar server' + ' from  ' + process.pid,
    statusCode: 201,
    data: null,
  });
  // next();
});

app.use(GlobalHandler);

// for unknown apiii hit error handle
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'NOt Found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'API Not Found',
      },
    ],
  });
  next();
});

// for testing userId dynamic based on yaer and code ///
// const academicSemester = {
//   code: '01',
//   year: '2025',
// };

// const testId = async () => {
//   // const testId = await generateFacultyId();

//   console.log(testId, 'testId from app.ts');
// };

// testId();

export default app;
