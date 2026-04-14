import { Request, Response } from 'express';
import * as reviewService from '../services/review.service';
import { reviewSchema } from '../utils/validation';

export async function getReviews(req: Request, res: Response) {
  try {
    const reviews = await reviewService.getReviewsByMember(req.params.memberId);
    res.json(reviews);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function createReview(req: Request, res: Response) {
  try {
    const data = reviewSchema.parse(req.body);
    const review = await reviewService.createReview(req.user!.userId, req.params.memberId, data.rating, data.comment);
    res.status(201).json(review);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function deleteReview(req: Request, res: Response) {
  try {
    await reviewService.deleteReview(req.params.id, req.user!.userId, req.user!.role);
    res.json({ message: 'Avis supprimé' });
  } catch (err: any) {
    const status = err.message === 'Non autorisé' ? 403 : 400;
    res.status(status).json({ error: err.message });
  }
}
