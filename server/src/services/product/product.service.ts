import prisma from "../../lib/prisma";
import { AppError } from "../../utils/appError";
import { ProductStatus } from "@prisma/client";

interface CreateProductInput {
  title: string;
  description?: string;
  price: number;
  stock?: number;
  imageUrl?: string;
  categoryId: string;
  status?: ProductStatus;
}

interface ProductFilters {
  categoryId?: string;
  status?: ProductStatus;
  search?: string;
  page?: number;
  limit?: number;
}

export const createProduct = async (input: CreateProductInput) => {
  const category = await prisma.category.findFirst({
    where: { id: input.categoryId, isDeleted: false },
  });
  if (!category) throw new AppError("Category not found.", 404);

  return prisma.product.create({
    data: {
      title: input.title,
      description: input.description,
      price: input.price,
      stock: input.stock ?? 0,
      imageUrl: input.imageUrl,
      categoryId: input.categoryId,
      status: input.status ?? "ACTIVE",
    },
  });
};

export const getAllProducts = async (filters: ProductFilters) => {
  const page = filters.page && filters.page > 0 ? filters.page : 1;
  const limit = filters.limit && filters.limit > 0 ? filters.limit : 10;

  const where = {
    isDeleted: false,
    ...(filters.categoryId ? { categoryId: filters.categoryId } : {}),
    ...(filters.status ? { status: filters.status } : {}),
    ...(filters.search
      ? { title: { contains: filters.search, mode: "insensitive" as const } }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    items,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

export const getProductById = async (id: string) => {
  const product = await prisma.product.findFirst({
    where: { id, isDeleted: false },
    include: {
      category: true,
      reviews: {
        where: { isDeleted: false },
        include: { user: { select: { id: true, name: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });
  if (!product) throw new AppError("Product not found.", 404);
  return product;
};

export const updateProduct = async (id: string, data: Partial<CreateProductInput>) => {
  const existing = await prisma.product.findFirst({ where: { id, isDeleted: false } });
  if (!existing) throw new AppError("Product not found.", 404);

  if (data.categoryId) {
    const category = await prisma.category.findFirst({
      where: { id: data.categoryId, isDeleted: false },
    });
    if (!category) throw new AppError("Category not found.", 404);
  }

  return prisma.product.update({ where: { id }, data });
};

export const softDeleteProduct = async (id: string) => {
  const existing = await prisma.product.findFirst({ where: { id, isDeleted: false } });
  if (!existing) throw new AppError("Product not found.", 404);

  return prisma.product.update({ where: { id }, data: { isDeleted: true } });
};
