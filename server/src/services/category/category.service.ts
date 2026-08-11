import prisma from "../../lib/prisma";
import { AppError } from "../../utils/appError";

export const createCategory = async (name: string, description?: string) => {
  const existing = await prisma.category.findUnique({ where: { name } });
  if (existing) throw new AppError("A category with this name already exists.", 409);

  return prisma.category.create({ data: { name, description } });
};

export const getAllCategories = async () => {
  return prisma.category.findMany({
    where: { isDeleted: false },
    orderBy: { createdAt: "desc" },
  });
};

export const getCategoryById = async (id: string) => {
  const category = await prisma.category.findFirst({ where: { id, isDeleted: false } });
  if (!category) throw new AppError("Category not found.", 404);
  return category;
};

export const updateCategory = async (
  id: string,
  data: { name?: string; description?: string }
) => {
  await getCategoryById(id);
  return prisma.category.update({ where: { id }, data });
};

export const softDeleteCategory = async (id: string) => {
  await getCategoryById(id);
  return prisma.category.update({ where: { id }, data: { isDeleted: true } });
};
