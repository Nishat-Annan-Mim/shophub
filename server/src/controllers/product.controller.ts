import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { sendResponse } from "../utils/apiResponse";
import { AppError } from "../utils/appError";
import * as productService from "../services/product/product.service";

export const createProduct = catchAsync(async (req: Request, res: Response) => {
  const { title, description, price, stock, imageUrl, categoryId, status } = req.body;
  if (!title || price === undefined || !categoryId) {
    throw new AppError("title, price and categoryId are required.", 400);
  }
  const product = await productService.createProduct({
    title,
    description,
    price: Number(price),
    stock: stock !== undefined ? Number(stock) : undefined,
    imageUrl,
    categoryId,
    status,
  });
  sendResponse(res, 201, "Product created successfully", product);
});

export const getAllProducts = catchAsync(async (req: Request, res: Response) => {
  const { categoryId, status, search, page, limit } = req.query;
  const result = await productService.getAllProducts({
    categoryId: categoryId as string | undefined,
    status: status as any,
    search: search as string | undefined,
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
  });
  sendResponse(res, 200, "Products retrieved successfully", result.items, result.meta);
});

export const getProductById = catchAsync(async (req: Request, res: Response) => {
  const product = await productService.getProductById(req.params.id);
  sendResponse(res, 200, "Product retrieved successfully", product);
});

export const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const product = await productService.updateProduct(req.params.id, req.body);
  sendResponse(res, 200, "Product updated successfully", product);
});

export const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  await productService.softDeleteProduct(req.params.id);
  sendResponse(res, 200, "Product deleted successfully");
});
