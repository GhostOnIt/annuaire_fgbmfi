import { Request, Response, NextFunction } from 'express';

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ error: 'Non authentifié' });
      return;
    }
    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: 'Accès interdit' });
      return;
    }
    next();
  };
}
