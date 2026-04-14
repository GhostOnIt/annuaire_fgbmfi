import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getSectors() {
  return prisma.sector.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { members: true } } },
  });
}

export async function getSectorById(id: string) {
  const sector = await prisma.sector.findUnique({ where: { id }, include: { _count: { select: { members: true } } } });
  if (!sector) throw new Error('Secteur introuvable');
  return sector;
}

export async function createSector(name: string) {
  return prisma.sector.create({ data: { name } });
}

export async function updateSector(id: string, name: string) {
  return prisma.sector.update({ where: { id }, data: { name } });
}

export async function deleteSector(id: string) {
  const count = await prisma.member.count({ where: { sectorId: id } });
  if (count > 0) throw new Error('Impossible de supprimer un secteur ayant des membres');
  return prisma.sector.delete({ where: { id } });
}
