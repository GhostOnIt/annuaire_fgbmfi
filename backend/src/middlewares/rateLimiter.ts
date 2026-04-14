import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { error: 'Trop de tentatives. Réessayez dans 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100,
  message: { error: 'Trop de requêtes. Réessayez dans une minute.' },
  standardHeaders: true,
  legacyHeaders: false,
});
