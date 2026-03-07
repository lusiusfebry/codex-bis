import { NextFunction, Request, Response } from "express";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  const error = new Error(`Route tidak ditemukan: ${req.method} ${req.originalUrl}`);
  next(error);
}

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (error instanceof PrismaClientKnownRequestError) {
    const prismaError = error;

    if (prismaError.code === "P2002") {
      res.status(409).json({
        success: false,
        message: "Data duplikat. Nilai yang harus unik sudah digunakan.",
        errors: prismaError.meta,
      });
      return;
    }

    if (prismaError.code === "P2025") {
      res.status(404).json({
        success: false,
        message: "Data yang diminta tidak ditemukan.",
        errors: prismaError.meta,
      });
      return;
    }
  }

  if (error instanceof Error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
    return;
  }

  res.status(500).json({
    success: false,
    message: "Terjadi kesalahan internal server.",
  });
}
