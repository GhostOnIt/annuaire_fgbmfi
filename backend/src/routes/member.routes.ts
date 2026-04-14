import { Router } from 'express';
import * as memberController from '../controllers/member.controller';
import * as reviewController from '../controllers/review.controller';
import { authenticate } from '../middlewares/auth';
import { upload, compressImage } from '../middlewares/upload';

const router = Router();

router.get('/', memberController.getMembers);
router.get('/me', authenticate, memberController.getMyProfile);
router.get('/:id', memberController.getMember);
router.post('/', authenticate, memberController.createMember);
router.put('/:id', authenticate, memberController.updateMember);
router.post('/:id/photo', authenticate, upload.single('photo'), compressImage, memberController.uploadPhoto);

// Reviews nested under members
router.get('/:memberId/reviews', reviewController.getReviews);
router.post('/:memberId/reviews', authenticate, reviewController.createReview);

export default router;
