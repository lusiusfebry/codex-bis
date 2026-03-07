import { Request, Response } from "express";
import { validationResult } from "express-validator";

export function handleValidationErrors(req: Request, res: Response): boolean {
  const result = validationResult(req);

  if (result.isEmpty()) {
    return false;
  }

  res.status(400).json({
    success: false,
    message: "Validasi gagal.",
    errors: result.array().map((error) => ({
      field: "path" in error ? error.path : "unknown",
      message: error.msg,
    })),
  });

  return true;
}
