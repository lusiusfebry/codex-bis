import bcrypt from "bcryptjs";
import { Router } from "express";

import { prisma } from "../../config/database";
import { authenticate } from "../../middleware/auth";
import { signJwt } from "../../utils/jwt";

const router = Router();

router.post("/login", async (req, res, next) => {
  try {
    const { nik, password } = req.body as { nik?: string; password?: string };

    if (!nik || !password) {
      res.status(400).json({
        success: false,
        message: "NIK dan password wajib diisi.",
      });
      return;
    }

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
});

router.get("/me", authenticate, async (req, res, next) => {
  try {
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
});

export default router;
