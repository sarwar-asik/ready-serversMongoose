import { ZodError, ZodIssue } from 'zod';
import { IGenericResponse } from '../common/interfaces/ICommon';
import { IGenericErrorMessage } from '../common/interfaces/Ierror';

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
