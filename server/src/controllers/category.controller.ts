import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { sendResponse } from "../utils/apiResponse";
import { AppError } from "../utils/appError";
import * as categoryService from "../services/category/category.service";

export const createCategory = catchAsync(async (req: Request, res: Response) => {
  const { name, description } = req.body;
  if (!name) throw new AppError("name is required.", 400);
  const category = await categoryService.createCategory(name, description);
  sendResponse(res, 201, "Category created successfully", category);
});

export const getAllCategories = catchAsync(async (_req: Request, res: Response) => {
  const categories = await categoryService.getAllCategories();
  sendResponse(res, 200, "Categories retrieved successfully", categories);
});

export const getCategoryById = catchAsync(async (req: Request, res: Response) => {
  const category = await categoryService.getCategoryById(req.params.id);
  sendResponse(res, 200, "Category retrieved successfully", category);
});

export const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const category = await categoryService.updateCategory(req.params.id, req.body);
  sendResponse(res, 200, "Category updated successfully", category);
});

export const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  await categoryService.softDeleteCategory(req.params.id);
  sendResponse(res, 200, "Category deleted successfully");
});
