import { Request, Response } from 'express';
import * as memberService from '../services/member.service';
import { memberSchema } from '../utils/validation';

export async function getMembers(req: Request, res: Response) {
  try {
    const filters = {
      search: req.query.search as string,
      chapterId: req.query.chapterId as string,
      sectorId: req.query.sectorId as string,
      minRating: req.query.minRating ? parseFloat(req.query.minRating as string) : undefined,
      location: req.query.location as string,
      page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 12,
    };
    const result = await memberService.getMembers(filters);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function getMember(req: Request, res: Response) {
  try {
    const member = await memberService.getMemberById(req.params.id);
    res.json(member);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
}

export async function getMyProfile(req: Request, res: Response) {
  try {
    const member = await memberService.getMemberByUserId(req.user!.userId);
    res.json(member);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
}

export async function createMember(req: Request, res: Response) {
  try {
    const data = memberSchema.parse(req.body);
    const services = req.body.services;
    const { chapterId, sectorId, ...rest } = data;
    const member = await memberService.createMember(req.user!.userId, {
      ...rest,
      chapter: { connect: { id: chapterId } },
      sector: { connect: { id: sectorId } },
      services,
    } as any);
    res.status(201).json(member);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function updateMember(req: Request, res: Response) {
  try {
    const { chapterId, sectorId, ...rest } = req.body;
    const updateData: any = { ...rest };
    if (chapterId) updateData.chapter = { connect: { id: chapterId } };
    if (sectorId) updateData.sector = { connect: { id: sectorId } };
    const member = await memberService.updateMember(req.params.id, req.user!.userId, updateData);
    res.json(member);
  } catch (err: any) {
    const status = err.message === 'Non autorisé' ? 403 : 400;
    res.status(status).json({ error: err.message });
  }
}

export async function uploadPhoto(req: Request, res: Response) {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'Aucun fichier envoyé' });
      return;
    }
    const photoPath = `/uploads/${req.file.filename}`;
    const member = await memberService.updateMemberPhoto(req.params.id, req.user!.userId, photoPath);
    res.json(member);
  } catch (err: any) {
    const status = err.message === 'Non autorisé' ? 403 : 400;
    res.status(status).json({ error: err.message });
  }
}
