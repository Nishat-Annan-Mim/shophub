import prisma from "../../lib/prisma";
import { hashPassword, comparePassword } from "../../utils/hash";
import { signToken } from "../../utils/jwt";
import { AppError } from "../../utils/appError";

const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
  updatedAt: true,
};

export const registerUser = async (name: string, email: string, password: string) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new AppError("An account with this email already exists.", 409);
  }

  const hashed = await hashPassword(password);

  const user = await prisma.user.create({
    data: { name, email, password: hashed },
    select: publicUserSelect,
  });

  const token = signToken({ userId: user.id, role: user.role });
  return { user, token };
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findFirst({ where: { email, isDeleted: false } });
  if (!user) {
    throw new AppError("Invalid email or password.", 401);
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new AppError("Invalid email or password.", 401);
  }

  const token = signToken({ userId: user.id, role: user.role });
  const { password: _pw, ...safeUser } = user;
  return { user: safeUser, token };
};

export const getAllUsers = async () => {
  return prisma.user.findMany({
    where: { isDeleted: false },
    select: publicUserSelect,
    orderBy: { createdAt: "desc" },
  });
};

export const getUserById = async (id: string) => {
  const user = await prisma.user.findFirst({
    where: { id, isDeleted: false },
    select: publicUserSelect,
  });
  if (!user) throw new AppError("User not found.", 404);
  return user;
};

export const updateUser = async (id: string, data: { name?: string; email?: string }) => {
  await getUserById(id);
  return prisma.user.update({
    where: { id },
    data,
    select: publicUserSelect,
  });
};

export const softDeleteUser = async (id: string) => {
  await getUserById(id);
  return prisma.user.update({
    where: { id },
    data: { isDeleted: true },
    select: publicUserSelect,
  });
};
