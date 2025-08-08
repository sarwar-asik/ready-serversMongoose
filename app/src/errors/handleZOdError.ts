/* eslint-disable no-console */
import { ZodError, ZodIssue } from 'zod';
import { IGenericResponse } from '../interfaces/ICommon';
import { IGenericErrorMessage } from '../interfaces/Ierror';

const handleZOdError = (error: ZodError): IGenericResponse => {
  const statusCode = 400;

  const errors: IGenericErrorMessage[] = error.issues.map((issue: ZodIssue) => {
    return {
      path: issue?.path[issue.path.length - 1],
      message: issue?.message,
    };
  });

  return {
    statusCode,
    message: 'Validate Error from handleZodError',
    errorMessages: errors,
  };
};

export default handleZOdError;
