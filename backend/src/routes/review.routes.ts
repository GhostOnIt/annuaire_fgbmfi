import { Router } from 'express';
import * as reviewController from '../controllers/review.controller';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.delete('/:id', authenticate, reviewController.deleteReview);

export default router;
