import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getChapterRoles() {
  return prisma.chapterRole.findMany({ orderBy: { name: 'asc' } });
}

export async function createChapterRole(name: string) {
  return prisma.chapterRole.create({ data: { name } });
}

export async function updateChapterRole(id: string, name: string) {
  return prisma.chapterRole.update({ where: { id }, data: { name } });
}

export async function deleteChapterRole(id: string) {
  const count = await prisma.member.count({ where: { chapterRole: (await prisma.chapterRole.findUnique({ where: { id } }))?.name } });
  if (count > 0) throw new Error('Impossible de supprimer un poste attribué à des membres');
  return prisma.chapterRole.delete({ where: { id } });
}
