import { NextFunction, Request, Response } from "express";

import { verifyJwt } from "../utils/jwt";

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      message: "Token autentikasi tidak ditemukan.",
    });
    return;
  }

  const token = authorization.replace("Bearer ", "").trim();

  try {
    req.user = verifyJwt(token);
    next();
  } catch (_error) {
    res.status(401).json({
      success: false,
      message: "Token tidak valid atau sudah kedaluwarsa.",
    });
  }
}
