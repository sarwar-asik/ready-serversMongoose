import { Response } from 'express';

export type IApiResponse<T> = {
  statusCode: number;
  success: boolean;
  message: string | null;
  meta?: {
    page: number;
    limit: number;
    total: number;
  } | null;
  data: T | null;
};

const sendResponse = <T>(res: Response, data: IApiResponse<T>): void => {
  const ResponseData: IApiResponse<T> = {
    statusCode: data.statusCode,
    success: data.success,
    message: data.message || null,
    meta: data?.meta || null,
    data: data?.data || null,
  };

  res.status(data.statusCode).json(ResponseData);
};

export default sendResponse;
