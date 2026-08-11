import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { sendResponse } from "../utils/apiResponse";
import { AppError } from "../utils/appError";
import * as userService from "../services/user/user.service";

export const register = catchAsync(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new AppError("name, email and password are required.", 400);
  }
  const result = await userService.registerUser(name, email, password);
  sendResponse(res, 201, "User registered successfully", result);
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new AppError("email and password are required.", 400);
  }
  const result = await userService.loginUser(email, password);
  sendResponse(res, 200, "Login successful", result);
});
