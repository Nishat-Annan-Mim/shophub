import { Response } from "express";

interface ApiResponseShape<T> {
  success: boolean;
  message: string;
  data?: T;
  meta?: Record<string, unknown>;
}

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T,
  meta?: Record<string, unknown>
) => {
  const body: ApiResponseShape<T> = {
    success: statusCode >= 200 && statusCode < 400,
    message,
    ...(data !== undefined ? { data } : {}),
    ...(meta ? { meta } : {}),
  };
  return res.status(statusCode).json(body);
};
