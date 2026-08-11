import prisma from "../../lib/prisma";
import { AppError } from "../../utils/appError";

export const createReview = async (
  userId: string,
  productId: string,
  rating: number,
  comment?: string
) => {
  const product = await prisma.product.findFirst({ where: { id: productId, isDeleted: false } });
  if (!product) throw new AppError("Product not found.", 404);

  if (rating < 1 || rating > 5) {
    throw new AppError("Rating must be between 1 and 5.", 400);
  }

  return prisma.review.create({
    data: { userId, productId, rating, comment },
    include: { user: { select: { id: true, name: true } } },
  });
};

export const getAllReviews = async (productId?: string) => {
  return prisma.review.findMany({
    where: { isDeleted: false, ...(productId ? { productId } : {}) },
    include: {
      user: { select: { id: true, name: true } },
      product: { select: { id: true, title: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getReviewById = async (id: string) => {
  const review = await prisma.review.findFirst({
    where: { id, isDeleted: false },
    include: { user: { select: { id: true, name: true } } },
  });
  if (!review) throw new AppError("Review not found.", 404);
  return review;
};

export const updateReview = async (
  id: string,
  userId: string,
  data: { rating?: number; comment?: string }
) => {
  const review = await prisma.review.findFirst({ where: { id, isDeleted: false } });
  if (!review) throw new AppError("Review not found.", 404);
  if (review.userId !== userId) {
    throw new AppError("You can only edit your own review.", 403);
  }
  if (data.rating !== undefined && (data.rating < 1 || data.rating > 5)) {
    throw new AppError("Rating must be between 1 and 5.", 400);
  }

  return prisma.review.update({ where: { id }, data });
};

export const softDeleteReview = async (id: string, userId: string, isAdmin: boolean) => {
  const review = await prisma.review.findFirst({ where: { id, isDeleted: false } });
  if (!review) throw new AppError("Review not found.", 404);
  if (review.userId !== userId && !isAdmin) {
    throw new AppError("You can only delete your own review.", 403);
  }

  return prisma.review.update({ where: { id }, data: { isDeleted: true } });
};
