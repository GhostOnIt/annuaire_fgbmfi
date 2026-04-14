import { Request, Response } from 'express';
import * as chapterRoleService from '../services/chapterRole.service';

export async function getChapterRoles(_req: Request, res: Response) {
  try {
    const roles = await chapterRoleService.getChapterRoles();
    res.json(roles);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function createChapterRole(req: Request, res: Response) {
  try {
    const { name } = req.body;
    if (!name) { res.status(400).json({ error: 'Nom requis' }); return; }
    const role = await chapterRoleService.createChapterRole(name);
    res.status(201).json(role);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function updateChapterRole(req: Request, res: Response) {
  try {
    const { name } = req.body;
    if (!name) { res.status(400).json({ error: 'Nom requis' }); return; }
    const role = await chapterRoleService.updateChapterRole(req.params.id, name);
    res.json(role);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function deleteChapterRole(req: Request, res: Response) {
  try {
    await chapterRoleService.deleteChapterRole(req.params.id);
    res.json({ message: 'Poste supprimé' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}
