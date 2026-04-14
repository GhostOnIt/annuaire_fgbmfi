import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

interface MemberFilters {
  search?: string;
  chapterId?: string;
  sectorId?: string;
  minRating?: number;
  location?: string;
  page?: number;
  limit?: number;
}

export async function getMembers(filters: MemberFilters) {
  const { search, chapterId, sectorId, minRating, location, page = 1, limit = 12 } = filters;

  const where: Prisma.MemberWhereInput = {
    isValidated: true,
  };

  if (search) {
    where.OR = [
      { firstName: { contains: search, mode: 'insensitive' } },
      { lastName: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (chapterId) where.chapterId = chapterId;
  if (sectorId) where.sectorId = sectorId;
  if (minRating) where.avgRating = { gte: minRating };
  if (location) where.location = { contains: location, mode: 'insensitive' };

  const [members, total] = await Promise.all([
    prisma.member.findMany({
      where,
      include: { chapter: true, sector: true, services: true },
      orderBy: { avgRating: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.member.count({ where }),
  ]);

  return { members, total, page, totalPages: Math.ceil(total / limit) };
}

export async function getMemberById(id: string) {
  const member = await prisma.member.findUnique({
    where: { id },
    include: { chapter: true, sector: true, services: true, user: { select: { email: true } } },
  });
  if (!member) throw new Error('Membre introuvable');
  return member;
}

export async function getMemberByUserId(userId: string) {
  return prisma.member.findUnique({
    where: { userId },
    include: { chapter: true, sector: true, services: true },
  });
}

export async function createMember(userId: string, data: Prisma.MemberCreateInput & { services?: { name: string; description?: string }[] }) {
  const existing = await prisma.member.findUnique({ where: { userId } });
  if (existing) throw new Error('Vous avez déjà un profil membre');

  const { services, ...memberData } = data;
  const member = await prisma.member.create({
    data: {
      ...memberData,
      user: { connect: { id: userId } },
      services: services ? { create: services } : undefined,
    },
    include: { chapter: true, sector: true, services: true },
  });
  return member;
}

export async function updateMember(id: string, userId: string, data: any) {
  const member = await prisma.member.findUnique({ where: { id } });
  if (!member) throw new Error('Membre introuvable');
  if (member.userId !== userId) throw new Error('Non autorisé');

  const { services, ...rest } = data;

  // Si des services sont fournis, on les remplace tous
  if (services) {
    await prisma.service.deleteMany({ where: { memberId: id } });
  }

  return prisma.member.update({
    where: { id },
    data: {
      ...rest,
      ...(services ? { services: { create: services } } : {}),
    },
    include: { chapter: true, sector: true, services: true },
  });
}

export async function updateMemberPhoto(id: string, userId: string, photoPath: string) {
  const member = await prisma.member.findUnique({ where: { id } });
  if (!member) throw new Error('Membre introuvable');
  if (member.userId !== userId) throw new Error('Non autorisé');

  return prisma.member.update({
    where: { id },
    data: { photo: photoPath },
  });
}
