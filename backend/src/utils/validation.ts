import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

export const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
});

export const memberSchema = z.object({
  firstName: z.string().min(1, 'Prénom requis'),
  lastName: z.string().min(1, 'Nom requis'),
  email: z.string().email('Email invalide'),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  location: z.string().optional(),
  description: z.string().optional(),
  chapterRole: z.string().optional(),
  chapterId: z.string().uuid('Chapitre invalide'),
  sectorId: z.string().uuid('Secteur invalide'),
});

export const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
});

export const chapterSchema = z.object({
  name: z.string().min(1, 'Nom requis'),
  city: z.string().min(1, 'Ville requise'),
});

export const sectorSchema = z.object({
  name: z.string().min(1, 'Nom requis'),
});

export const serviceSchema = z.object({
  name: z.string().min(1, 'Nom requis'),
  description: z.string().optional(),
});
