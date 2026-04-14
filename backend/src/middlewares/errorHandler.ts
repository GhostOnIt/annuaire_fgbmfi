import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  logger.error({ err }, err.message);
  res.status(500).json({ error: err.message || 'Internal server error' });
}
