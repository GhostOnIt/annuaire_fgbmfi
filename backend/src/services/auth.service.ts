import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

const prisma = new PrismaClient();

export async function register(email: string, password: string) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error('Un compte avec cet email existe déjà');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, password: hashedPassword },
  });

  return generateTokens(user.id, user.role);
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('Email ou mot de passe incorrect');
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw new Error('Email ou mot de passe incorrect');
  }

  return {
    ...generateTokens(user.id, user.role),
    user: { id: user.id, email: user.email, role: user.role },
  };
}

export async function refreshToken(token: string) {
  try {
    const payload = jwt.verify(token, env.JWT_REFRESH_SECRET) as { userId: string; role: string };
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user) throw new Error('Utilisateur introuvable');
    return generateTokens(user.id, user.role);
  } catch {
    throw new Error('Refresh token invalide');
  }
}

function generateTokens(userId: string, role: string) {
  const accessToken = jwt.sign({ userId, role }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRATION });
  const refreshToken = jwt.sign({ userId, role }, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRATION });
  return { accessToken, refreshToken };
}
