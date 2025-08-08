import mongoose from 'mongoose';
import { IGenericErrorMessage } from '../interfaces/Ierror';
import { IGenericResponse } from '../interfaces/ICommon';

const handleValidationError = (
  err: mongoose.Error.ValidationError,
): IGenericResponse => {
  const errors: IGenericErrorMessage[] = Object.values(err.errors).map(
    (element: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        path: element?.path,
        message: element?.message,
      };
    },
  );

  const statusCode = 400;
  return {
    statusCode,
    message: 'Validation Error',
    errorMessages: errors,
  };
};

export default handleValidationError;
