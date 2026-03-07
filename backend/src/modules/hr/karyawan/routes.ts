import { Router } from "express";

import { prisma } from "../../../config/database";
import { authenticate } from "../../../middleware/auth";
import { uploadFotoKaryawan } from "../../../middleware/upload";

const router = Router();

router.get("/", authenticate, async (_req, res, next) => {
  try {
    const data = await prisma.karyawan.findMany({
      include: {
        divisi: true,
        department: true,
        posisiJabatan: true,
        statusKaryawan: true,
        lokasiKerja: true,
        tag: true,
        anak: true,
        saudaraKandung: true,
        kontakDarurat: true,
        orangTuaKandung: true,
        orangTuaMertua: true,
        keluarga: true,
      },
      orderBy: { namaLengkap: "asc" },
    });

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

router.post("/upload-foto", authenticate, uploadFotoKaryawan.single("foto"), (req, res) => {
  res.json({
    success: true,
    message: "Foto berhasil diunggah.",
    data: req.file
      ? {
          filename: req.file.filename,
          path: `foto-karyawan/${req.file.filename}`,
          mimetype: req.file.mimetype,
          size: req.file.size,
        }
      : null,
  });
});

export default router;
