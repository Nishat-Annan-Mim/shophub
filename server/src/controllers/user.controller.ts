import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { sendResponse } from "../utils/apiResponse";
import * as userService from "../services/user/user.service";

export const getAllUsers = catchAsync(async (_req: Request, res: Response) => {
  const users = await userService.getAllUsers();
  sendResponse(res, 200, "Users retrieved successfully", users);
});

export const getUserById = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.getUserById(req.params.id);
  sendResponse(res, 200, "User retrieved successfully", user);
});

export const getMe = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.getUserById(req.user!.userId);
  sendResponse(res, 200, "Profile retrieved successfully", user);
});

export const updateUser = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.updateUser(req.params.id, req.body);
  sendResponse(res, 200, "User updated successfully", user);
});

export const deleteUser = catchAsync(async (req: Request, res: Response) => {
  await userService.softDeleteUser(req.params.id);
  sendResponse(res, 200, "User deleted successfully");
});
