import { Request, Response } from 'express';
import * as adminService from '../services/admin.service';
import * as reviewService from '../services/review.service';

export async function getAllMembers(req: Request, res: Response) {
  try {
    const filter = (req.query.filter as 'all' | 'validated' | 'pending') || 'all';
    const members = await adminService.getAllMembers(filter);
    res.json(members);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function validateMember(req: Request, res: Response) {
  try {
    const member = await adminService.validateMember(req.params.id);
    res.json(member);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function invalidateMember(req: Request, res: Response) {
  try {
    const member = await adminService.invalidateMember(req.params.id);
    res.json(member);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function deleteMember(req: Request, res: Response) {
  try {
    await adminService.deleteMember(req.params.id);
    res.json({ message: 'Membre supprimé' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function createMember(req: Request, res: Response) {
  try {
    const member = await adminService.adminCreateMember(req.body);
    res.status(201).json(member);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function getAllReviews(_req: Request, res: Response) {
  try {
    const reviews = await adminService.getAllReviews();
    res.json(reviews);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function deleteReview(req: Request, res: Response) {
  try {
    await reviewService.deleteReview(req.params.id, req.user!.userId, req.user!.role);
    res.json({ message: 'Avis supprimé' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function getStats(_req: Request, res: Response) {
  try {
    const stats = await adminService.getStats();
    res.json(stats);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function getRankings(req: Request, res: Response) {
  try {
    const type = (req.query.type as 'sector' | 'chapter') || 'sector';
    const id = req.query.id as string;
    const rankings = await adminService.getRankings(type, id);
    res.json(rankings);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
