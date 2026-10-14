import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { sendError } from '../utils/response.js';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('[Error Handler]', err);

  if (err instanceof ZodError) {
    const details = err.errors.map((e) => ({
      field: e.path.join('.'),
      issue: e.message,
    }));
    return sendError(res, 'Validation failed on request payload', 422, 'VALIDATION_ERROR', details);
  }

  if (err.name === 'ValidationError') {
    return sendError(res, err.message, 400, 'MONGOOSE_VALIDATION_ERROR');
  }

  if (err.code === 11000) {
    return sendError(res, 'Duplicate key error: Resource with this identifier already exists', 409, 'DUPLICATE_KEY_ERROR');
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error occurred';
  return sendError(res, message, statusCode, err.code || 'INTERNAL_SERVER_ERROR');
}
