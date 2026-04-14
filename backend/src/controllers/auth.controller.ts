import { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import { registerSchema, loginSchema } from '../utils/validation';

export async function register(req: Request, res: Response) {
  try {
    const data = registerSchema.parse(req.body);
    const result = await authService.register(data.email, data.password);
    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const data = loginSchema.parse(req.body);
    const result = await authService.login(data.email, data.password);
    res.json(result);
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
}

export async function refresh(req: Request, res: Response) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(400).json({ error: 'Refresh token requis' });
      return;
    }
    const result = await authService.refreshToken(refreshToken);
    res.json(result);
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
}
