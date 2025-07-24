import { ErrorRequestHandler, Request, Response, NextFunction } from 'express';
import config from '../../config/index';
import { IGenericErrorMessage } from '../../interfaces/Ierror';
import handleValidationError from '../../errors/handleValidationError';
import ApiError from '../../errors/ApiError';
import { ZodError } from 'zod';
import handleZOdError from '../../errors/handleZOdError';
import handleCastError from '../../errors/handleCastError';

export interface IErrorHandler {
  handle(error: any, req: Request, res: Response, next: NextFunction): void;
}

export class GlobalErrorHandler implements IErrorHandler {
  public handle(
    error: any,
    req: Request,
    res: Response,
    next: NextFunction,
  ): void {
    if (config.env === 'development') {
      // eslint-disable-next-line no-console
      console.log('globalErrorHandler', error);
    } else {
      // eslint-disable-next-line no-console
      console.log('Error from globalError', error);
    }

    let statusCode = 500;
    let message = 'Something went wrong';
    let errorMessages: IGenericErrorMessage[] = [];

    if (error?.name === 'ValidatorError') {
      const simplified = handleValidationError(error);
      statusCode = simplified.statusCode;
      message = simplified.message;
    } else if (error instanceof ZodError) {
      const simplified = handleZOdError(error);
      statusCode = simplified.statusCode;
      message = simplified.message;
      errorMessages = simplified.errorMessages;
    } else if (error?.name === 'CastError') {
      const simplified = handleCastError(error);
      statusCode = simplified.statusCode;
      message = simplified.message;
      errorMessages = simplified.errorMessages;
    } else if (error instanceof ApiError) {
      statusCode = error.statusCode;
      message = error.message;
      errorMessages = error.message ? [{ path: '', message }] : [];
    } else if (error instanceof Error) {
      message = error.message;
      errorMessages = error.message
        ? [{ path: '', message: error.message }]
        : [];
    }

    res.status(statusCode).json({
      success: false,
      message,
      errorMessage: errorMessages,
      stack: config.env !== 'production' ? error?.stack : undefined,
    });
  }
}

// Singleton instance for middleware use
export const globalErrorHandler: ErrorRequestHandler = (
  error,
  req,
  res,
  next,
) => {
  new GlobalErrorHandler().handle(error, req, res, next);
};
