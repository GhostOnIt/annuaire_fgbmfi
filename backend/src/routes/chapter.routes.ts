import { Router } from 'express';
import * as chapterController from '../controllers/chapter.controller';
import { authenticate } from '../middlewares/auth';
import { requireRole } from '../middlewares/roles';

const router = Router();

router.get('/', chapterController.getChapters);
router.get('/:id', chapterController.getChapter);
router.post('/', authenticate, requireRole('ADMIN'), chapterController.createChapter);
router.put('/:id', authenticate, requireRole('ADMIN'), chapterController.updateChapter);
router.delete('/:id', authenticate, requireRole('ADMIN'), chapterController.deleteChapter);

export default router;
