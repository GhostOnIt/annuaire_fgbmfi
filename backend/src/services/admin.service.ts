import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getAllMembers(filter?: 'all' | 'validated' | 'pending') {
  const where: any = {};
  if (filter === 'validated') where.isValidated = true;
  if (filter === 'pending') where.isValidated = false;

  return prisma.member.findMany({
    where,
    include: { chapter: true, sector: true, user: { select: { email: true } } },
    orderBy: { createdAt: 'desc' },
  });
}

export async function validateMember(id: string) {
  return prisma.member.update({
    where: { id },
    data: { isValidated: true },
    include: { chapter: true, sector: true, user: { select: { email: true } } },
  });
}

export async function invalidateMember(id: string) {
  return prisma.member.update({
    where: { id },
    data: { isValidated: false },
    include: { chapter: true, sector: true, user: { select: { email: true } } },
  });
}

export async function deleteMember(id: string) {
  await prisma.service.deleteMany({ where: { memberId: id } });
  await prisma.review.deleteMany({ where: { memberId: id } });
  return prisma.member.delete({ where: { id } });
}

export async function adminCreateMember(data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  contactEmail?: string;
  phone?: string;
  whatsapp?: string;
  location?: string;
  description?: string;
  chapterRole?: string;
  chapterId: string;
  sectorId: string;
}) {
  const bcrypt = await import('bcrypt');
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      role: 'MEMBER',
    },
  });

  return prisma.member.create({
    data: {
      userId: user.id,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.contactEmail || data.email,
      phone: data.phone || null,
      whatsapp: data.whatsapp || null,
      location: data.location || null,
      description: data.description || null,
      chapterRole: data.chapterRole || null,
      isValidated: true,
      chapter: { connect: { id: data.chapterId } },
      sector: { connect: { id: data.sectorId } },
    },
    include: { chapter: true, sector: true, user: { select: { email: true } } },
  });
}

export async function getAllReviews() {
  return prisma.review.findMany({
    include: {
      author: { select: { email: true } },
      member: { select: { firstName: true, lastName: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getStats() {
  const [totalMembers, validatedMembers, pendingMembers, totalReviews, totalChapters, totalSectors] = await Promise.all([
    prisma.member.count(),
    prisma.member.count({ where: { isValidated: true } }),
    prisma.member.count({ where: { isValidated: false } }),
    prisma.review.count(),
    prisma.chapter.count(),
    prisma.sector.count(),
  ]);

  return { totalMembers, validatedMembers, pendingMembers, totalReviews, totalChapters, totalSectors };
}

export async function getRankings(type: 'sector' | 'chapter', id?: string) {
  const where: any = { isValidated: true };
  if (type === 'sector' && id) where.sectorId = id;
  if (type === 'chapter' && id) where.chapterId = id;

  return prisma.member.findMany({
    where,
    include: { chapter: true, sector: true },
    orderBy: [{ avgRating: 'desc' }, { reviewCount: 'desc' }],
    take: 10,
  });
}
