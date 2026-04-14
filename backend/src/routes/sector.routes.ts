import { Router } from 'express';
import * as sectorController from '../controllers/sector.controller';
import { authenticate } from '../middlewares/auth';
import { requireRole } from '../middlewares/roles';

const router = Router();

router.get('/', sectorController.getSectors);
router.get('/:id', sectorController.getSector);
router.post('/', authenticate, requireRole('ADMIN'), sectorController.createSector);
router.put('/:id', authenticate, requireRole('ADMIN'), sectorController.updateSector);
router.delete('/:id', authenticate, requireRole('ADMIN'), sectorController.deleteSector);

export default router;
