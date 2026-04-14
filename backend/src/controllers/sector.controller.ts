import { Request, Response } from 'express';
import * as sectorService from '../services/sector.service';
import { sectorSchema } from '../utils/validation';

export async function getSectors(_req: Request, res: Response) {
  try {
    const sectors = await sectorService.getSectors();
    res.json(sectors);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function getSector(req: Request, res: Response) {
  try {
    const sector = await sectorService.getSectorById(req.params.id);
    res.json(sector);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
}

export async function createSector(req: Request, res: Response) {
  try {
    const data = sectorSchema.parse(req.body);
    const sector = await sectorService.createSector(data.name);
    res.status(201).json(sector);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function updateSector(req: Request, res: Response) {
  try {
    const data = sectorSchema.parse(req.body);
    const sector = await sectorService.updateSector(req.params.id, data.name);
    res.json(sector);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function deleteSector(req: Request, res: Response) {
  try {
    await sectorService.deleteSector(req.params.id);
    res.json({ message: 'Secteur supprimé' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}
