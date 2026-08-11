import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { sendResponse } from "../utils/apiResponse";
import { AppError } from "../utils/appError";
import * as orderService from "../services/order/order.service";

export const createOrder = catchAsync(async (req: Request, res: Response) => {
  const { items, address } = req.body;
  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new AppError("items array is required.", 400);
  }
  const order = await orderService.createOrder(req.user!.userId, items, address);
  sendResponse(res, 201, "Order placed successfully", order);
});

export const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const isAdmin = req.user!.role === "ADMIN";
  const orders = await orderService.getAllOrders(isAdmin ? undefined : req.user!.userId);
  sendResponse(res, 200, "Orders retrieved successfully", orders);
});

export const getOrderById = catchAsync(async (req: Request, res: Response) => {
  const order = await orderService.getOrderById(req.params.id);
  sendResponse(res, 200, "Order retrieved successfully", order);
});

export const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const { status } = req.body;
  if (!status) throw new AppError("status is required.", 400);
  const order = await orderService.updateOrderStatus(req.params.id, status);
  sendResponse(res, 200, "Order status updated successfully", order);
});

export const deleteOrder = catchAsync(async (req: Request, res: Response) => {
  await orderService.softDeleteOrder(req.params.id);
  sendResponse(res, 200, "Order deleted successfully");
});
