import mongoose from 'mongoose';
import { IGenericErrorMessage } from '../common/interfaces/Ierror';

const handleCastError = (error: mongoose.Error.CastError) => {
  const errors: IGenericErrorMessage[] = [
    {
      path: error.path,
      message: error.message,
    },
  ];
  const statusCode = 400;
  return {
    statusCode,
    message: 'CastError Occurred for this route',
    errorMessages: errors,
  };
};

export default handleCastError;
