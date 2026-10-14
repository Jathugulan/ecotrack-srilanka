import { Response } from 'express';

export function sendSuccess<T>(
  res: Response,
  message: string,
  data: T,
  statusCode = 200,
  meta: any = null
): Response {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    meta,
  });
}

export function sendError(
  res: Response,
  message: string,
  statusCode = 400,
  code = 'ERROR',
  details: any = []
): Response {
  return res.status(statusCode).json({
    success: false,
    message,
    error: {
      code,
      details,
    },
    meta: null,
  });
}
