import { Router } from 'express';
import * as adminController from '../controllers/admin.controller';
import { authenticate } from '../middlewares/auth';
import { requireRole } from '../middlewares/roles';

const router = Router();

router.use(authenticate, requireRole('ADMIN'));

router.get('/members', adminController.getAllMembers);
router.post('/members', adminController.createMember);
router.put('/members/:id/validate', adminController.validateMember);
router.put('/members/:id/invalidate', adminController.invalidateMember);
router.delete('/members/:id', adminController.deleteMember);
router.get('/reviews', adminController.getAllReviews);
router.delete('/reviews/:id', adminController.deleteReview);
router.get('/stats', adminController.getStats);
router.get('/rankings', adminController.getRankings);

export default router;
