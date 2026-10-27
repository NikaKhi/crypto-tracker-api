import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Unauthorized: Missing or invalid token format', 401));
  }

  const token = authHeader.split(' ')[1];

  if (token !== process.env.API_KEY) {
    return next(new AppError('Unauthorized: Invalid API Key', 401));
  }

  next();
};