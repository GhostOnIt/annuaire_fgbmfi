import multer from 'multer';
import path from 'path';
import sharp from 'sharp';
import fs from 'fs';
import { Request, Response, NextFunction } from 'express';

const uploadsDir = path.join(__dirname, '..', '..', 'uploads');

const storage = multer.memoryStorage();

const fileFilter = (_req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Format de fichier non supporté. Utilisez JPG, PNG ou WebP.'));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export async function compressImage(req: Request, _res: Response, next: NextFunction) {
  if (!req.file) return next();

  try {
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;
    const outputPath = path.join(uploadsDir, filename);

    await sharp(req.file.buffer)
      .resize(800, 800, { fit: 'cover', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(outputPath);

    req.file.filename = filename;
    req.file.path = outputPath;
    next();
  } catch (err) {
    next(err);
  }
}
