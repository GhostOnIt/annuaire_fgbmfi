import { Router } from 'express';
import * as chapterRoleController from '../controllers/chapterRole.controller';
import { authenticate } from '../middlewares/auth';
import { requireRole } from '../middlewares/roles';

const router = Router();

router.get('/', chapterRoleController.getChapterRoles);
router.post('/', authenticate, requireRole('ADMIN'), chapterRoleController.createChapterRole);
router.put('/:id', authenticate, requireRole('ADMIN'), chapterRoleController.updateChapterRole);
router.delete('/:id', authenticate, requireRole('ADMIN'), chapterRoleController.deleteChapterRole);

export default router;
