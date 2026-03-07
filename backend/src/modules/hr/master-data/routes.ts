import { Router } from "express";

import { prisma } from "../../../config/database";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const [
      divisi,
      department,
      posisiJabatan,
      kategoriPangkat,
      golongan,
      subGolongan,
      jenisHubunganKerja,
      tag,
      lokasiKerja,
      statusKaryawan,
    ] = await Promise.all([
      prisma.divisi.findMany({ orderBy: { namaDivisi: "asc" } }),
      prisma.department.findMany({ orderBy: { namaDepartmen: "asc" } }),
      prisma.posisiJabatan.findMany({ orderBy: { namaPosisiJabatan: "asc" } }),
      prisma.kategoriPangkat.findMany({ orderBy: { namaKategoriPangkat: "asc" } }),
      prisma.golongan.findMany({ orderBy: { namaGolongan: "asc" } }),
      prisma.subGolongan.findMany({ orderBy: { namaSubGolongan: "asc" } }),
      prisma.jenisHubunganKerja.findMany({ orderBy: { namaJenisHubunganKerja: "asc" } }),
      prisma.tag.findMany({ orderBy: { namaTag: "asc" } }),
      prisma.lokasiKerja.findMany({ orderBy: { namaLokasiKerja: "asc" } }),
      prisma.statusKaryawan.findMany({ orderBy: { namaStatus: "asc" } }),
    ]);

    res.json({
      success: true,
      data: {
        divisi,
        department,
        posisiJabatan,
        kategoriPangkat,
        golongan,
        subGolongan,
        jenisHubunganKerja,
        tag,
        lokasiKerja,
        statusKaryawan,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
