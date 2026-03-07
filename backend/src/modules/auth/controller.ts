import bcrypt from "bcryptjs";
import { NextFunction, Request, Response } from "express";

import { prisma } from "../../config/database";
import { signJwt } from "../../utils/jwt";
import { handleValidationErrors } from "../../utils/validationHelper";

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (handleValidationErrors(req, res)) {
      return;
    }

    const { nik, password } = req.body as { nik: string; password: string };
    const user = await prisma.user.findUnique({ where: { nik } });

    if (!user || !user.isActive) {
      res.status(401).json({
        success: false,
        message: "Kredensial tidak valid.",
      });
      return;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      res.status(401).json({
        success: false,
        message: "Kredensial tidak valid.",
      });
      return;
    }

    const token = signJwt({
      userId: user.id,
      nik: user.nik,
      role: user.role,
    });

    res.json({
      success: true,
      message: "Login berhasil.",
      data: {
        token,
        user: {
          id: user.id,
          nik: user.nik,
          nama: user.nama,
          role: user.role,
          fotoUrl: user.fotoUrl,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function me(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (handleValidationErrors(req, res)) {
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user?.userId },
      select: {
        id: true,
        nik: true,
        nama: true,
        role: true,
        fotoUrl: true,
        isActive: true,
      },
    });

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (handleValidationErrors(req, res)) {
      return;
    }

    res.json({
      success: true,
      message: "Logout berhasil.",
    });
  } catch (error) {
    next(error);
  }
}
