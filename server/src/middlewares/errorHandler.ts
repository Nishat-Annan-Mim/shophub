import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError";

export const globalErrorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Prisma known error codes (e.g. unique constraint violation)
  if (typeof err === "object" && err !== null && "code" in err) {
    const prismaErr = err as { code: string; meta?: { target?: string[] } };
    if (prismaErr.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: `Duplicate value for field: ${prismaErr.meta?.target?.join(", ") ?? "unique field"}`,
      });
    }
    if (prismaErr.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Requested resource was not found.",
      });
    }
  }

  console.error("UNHANDLED ERROR:", err);
  return res.status(500).json({
    success: false,
    message: "Something went wrong on the server.",
  });
};

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};
