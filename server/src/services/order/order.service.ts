import prisma from "../../lib/prisma";
import { AppError } from "../../utils/appError";
import { OrderStatus } from "@prisma/client";

interface OrderItemInput {
  productId: string;
  quantity: number;
}

export const createOrder = async (userId: string, items: OrderItemInput[], address?: string) => {
  if (!items || items.length === 0) {
    throw new AppError("Order must contain at least one item.", 400);
  }

  return prisma.$transaction(async (tx) => {
    let totalAmount = 0;
    const orderItemsData: { productId: string; quantity: number; price: number }[] = [];

    for (const item of items) {
      const product = await tx.product.findFirst({
        where: { id: item.productId, isDeleted: false },
      });
      if (!product) throw new AppError(`Product not found: ${item.productId}`, 404);
      if (product.stock < item.quantity) {
        throw new AppError(`Insufficient stock for product: ${product.title}`, 400);
      }

      totalAmount += product.price * item.quantity;
      orderItemsData.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      });

      await tx.product.update({
        where: { id: product.id },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return tx.order.create({
      data: {
        userId,
        address,
        totalAmount,
        items: { create: orderItemsData },
      },
      include: { items: { include: { product: true } } },
    });
  });
};

export const getAllOrders = async (userId?: string) => {
  return prisma.order.findMany({
    where: { isDeleted: false, ...(userId ? { userId } : {}) },
    include: { items: { include: { product: true } }, user: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });
};

export const getOrderById = async (id: string) => {
  const order = await prisma.order.findFirst({
    where: { id, isDeleted: false },
    include: { items: { include: { product: true } }, user: { select: { id: true, name: true } } },
  });
  if (!order) throw new AppError("Order not found.", 404);
  return order;
};

export const updateOrderStatus = async (id: string, status: OrderStatus) => {
  const order = await prisma.order.findFirst({ where: { id, isDeleted: false } });
  if (!order) throw new AppError("Order not found.", 404);

  return prisma.order.update({ where: { id }, data: { status } });
};

export const softDeleteOrder = async (id: string) => {
  const order = await prisma.order.findFirst({ where: { id, isDeleted: false } });
  if (!order) throw new AppError("Order not found.", 404);

  return prisma.order.update({ where: { id }, data: { isDeleted: true } });
};
