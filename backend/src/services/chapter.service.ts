import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getChapters() {
  return prisma.chapter.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { members: true } } },
  });
}

export async function getChapterById(id: string) {
  const chapter = await prisma.chapter.findUnique({ where: { id }, include: { _count: { select: { members: true } } } });
  if (!chapter) throw new Error('Chapitre introuvable');
  return chapter;
}

export async function createChapter(name: string, city: string) {
  return prisma.chapter.create({ data: { name, city } });
}

export async function updateChapter(id: string, name: string, city: string) {
  return prisma.chapter.update({ where: { id }, data: { name, city } });
}

export async function deleteChapter(id: string) {
  const count = await prisma.member.count({ where: { chapterId: id } });
  if (count > 0) throw new Error('Impossible de supprimer un chapitre ayant des membres');
  return prisma.chapter.delete({ where: { id } });
}
