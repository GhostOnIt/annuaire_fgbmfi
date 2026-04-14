import { Request, Response } from 'express';
import * as chapterService from '../services/chapter.service';
import { chapterSchema } from '../utils/validation';

export async function getChapters(_req: Request, res: Response) {
  try {
    const chapters = await chapterService.getChapters();
    res.json(chapters);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function getChapter(req: Request, res: Response) {
  try {
    const chapter = await chapterService.getChapterById(req.params.id);
    res.json(chapter);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
}

export async function createChapter(req: Request, res: Response) {
  try {
    const data = chapterSchema.parse(req.body);
    const chapter = await chapterService.createChapter(data.name, data.city);
    res.status(201).json(chapter);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function updateChapter(req: Request, res: Response) {
  try {
    const data = chapterSchema.parse(req.body);
    const chapter = await chapterService.updateChapter(req.params.id, data.name, data.city);
    res.json(chapter);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function deleteChapter(req: Request, res: Response) {
  try {
    await chapterService.deleteChapter(req.params.id);
    res.json({ message: 'Chapitre supprimé' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}
