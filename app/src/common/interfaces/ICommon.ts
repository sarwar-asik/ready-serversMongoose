import { IGenericErrorMessage } from './Ierror';

export type IGenericResponse = {
  statusCode: number;
  message: string;
  errorMessages: IGenericErrorMessage[];
};

export type IGenericDataResponse<T> = {
  meta: {
    page: number | null;
    limit: number | null;
    total: number | null;
  };
  data: T;
};
