import express from 'express';
import cors from 'cors';
import path from 'path';
import { env } from './config/env';
import { logger } from './config/logger';
import { errorHandler } from './middlewares/errorHandler';
import { authLimiter, apiLimiter } from './middlewares/rateLimiter';
import authRoutes from './routes/auth.routes';
import memberRoutes from './routes/member.routes';
import reviewRoutes from './routes/review.routes';
import chapterRoutes from './routes/chapter.routes';
import sectorRoutes from './routes/sector.routes';
import adminRoutes from './routes/admin.routes';
import chapterRoleRoutes from './routes/chapterRole.routes';

const app = express();

app.use(cors({
  origin: env.CORS_ORIGIN === '*' ? true : env.CORS_ORIGIN.split(','),
  credentials: true,
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Rate limiting
app.use('/api/auth', authLimiter);
app.use('/api', apiLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/chapters', chapterRoutes);
app.use('/api/sectors', sectorRoutes);
app.use('/api/chapter-roles', chapterRoleRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use(errorHandler);

app.listen(env.PORT, () => {
  logger.info(`Server running on port ${env.PORT}`);
});

export default app;
