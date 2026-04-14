import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getReviewsByMember(memberId: string) {
  return prisma.review.findMany({
    where: { memberId },
    include: { author: { select: { id: true, email: true, member: { select: { firstName: true, lastName: true, photo: true } } } } },
    orderBy: { createdAt: 'desc' },
  });
}

export async function createReview(authorId: string, memberId: string, rating: number, comment?: string) {
  // Check member exists
  const member = await prisma.member.findUnique({ where: { id: memberId } });
  if (!member) throw new Error('Membre introuvable');

  // Prevent self-review
  if (member.userId === authorId) throw new Error('Vous ne pouvez pas vous noter vous-même');

  // Check if already reviewed
  const existing = await prisma.review.findUnique({ where: { authorId_memberId: { authorId, memberId } } });
  if (existing) throw new Error('Vous avez déjà laissé un avis pour ce membre');

  const review = await prisma.review.create({
    data: { rating, comment, authorId, memberId },
  });

  await updateMemberRating(memberId);
  return review;
}

export async function deleteReview(reviewId: string, userId: string, userRole: string) {
  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review) throw new Error('Avis introuvable');

  if (review.authorId !== userId && userRole !== 'ADMIN') {
    throw new Error('Non autorisé');
  }

  await prisma.review.delete({ where: { id: reviewId } });
  await updateMemberRating(review.memberId);
}

async function updateMemberRating(memberId: string) {
  const result = await prisma.review.aggregate({
    where: { memberId },
    _avg: { rating: true },
    _count: { rating: true },
  });

  await prisma.member.update({
    where: { id: memberId },
    data: {
      avgRating: result._avg.rating || 0,
      reviewCount: result._count.rating,
    },
  });
}
