import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { sendResponse } from "../utils/apiResponse";
import { AppError } from "../utils/appError";
import * as reviewService from "../services/review/review.service";

export const createReview = catchAsync(async (req: Request, res: Response) => {
  const { productId, rating, comment } = req.body;
  if (!productId || rating === undefined) {
    throw new AppError("productId and rating are required.", 400);
  }
  const review = await reviewService.createReview(req.user!.userId, productId, Number(rating), comment);
  sendResponse(res, 201, "Review created successfully", review);
});

export const getAllReviews = catchAsync(async (req: Request, res: Response) => {
  const { productId } = req.query;
  const reviews = await reviewService.getAllReviews(productId as string | undefined);
  sendResponse(res, 200, "Reviews retrieved successfully", reviews);
});

export const getReviewById = catchAsync(async (req: Request, res: Response) => {
  const review = await reviewService.getReviewById(req.params.id);
  sendResponse(res, 200, "Review retrieved successfully", review);
});

export const updateReview = catchAsync(async (req: Request, res: Response) => {
  const review = await reviewService.updateReview(req.params.id, req.user!.userId, req.body);
  sendResponse(res, 200, "Review updated successfully", review);
});

export const deleteReview = catchAsync(async (req: Request, res: Response) => {
  const isAdmin = req.user!.role === "ADMIN";
  await reviewService.softDeleteReview(req.params.id, req.user!.userId, isAdmin);
  sendResponse(res, 200, "Review deleted successfully");
});
