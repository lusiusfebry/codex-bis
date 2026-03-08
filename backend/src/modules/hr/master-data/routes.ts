import { Router } from "express";

import { prisma } from "../../../config/database";
import { authenticate } from "../../../middleware/auth";
import { buildMasterDataController } from "./controller";
import {
  buildMasterDataValidators,
  departmentExtraValidators,
  masterDataIdValidator,
  masterDataListValidator,
  posisiJabatanExtraValidators,
  tagExtraValidators,
} from "./validator";

const router = Router();

router.use(authenticate);

const divisiController = buildMasterDataController(prisma.divisi, {
  codePrefix: "DIV",
  orderField: "code",
  nameField: "namaDivisi",
  searchFields: ["code", "namaDivisi", "keterangan"],
});

const departmentController = buildMasterDataController(prisma.department, {
  codePrefix: "DEP",
  orderField: "code",
  nameField: "namaDepartmen",
  searchFields: ["code", "namaDepartmen", "keterangan"],
  include: { divisi: { select: { namaDivisi: true } } },
});

const posisiJabatanController = buildMasterDataController(prisma.posisiJabatan, {
  codePrefix: "POS",
  orderField: "code",
  nameField: "namaPosisiJabatan",
  searchFields: ["code", "namaPosisiJabatan", "keterangan"],
  include: { department: { select: { namaDepartmen: true, divisiId: true } } },
});

const kategoriPangkatController = buildMasterDataController(prisma.kategoriPangkat, {
  codePrefix: "KAT",
  orderField: "code",
  nameField: "namaKategoriPangkat",
  searchFields: ["code", "namaKategoriPangkat", "keterangan"],
});

const golonganController = buildMasterDataController(prisma.golongan, {
  codePrefix: "GOL",
  orderField: "code",
  nameField: "namaGolongan",
  searchFields: ["code", "namaGolongan", "keterangan"],
});

const subGolonganController = buildMasterDataController(prisma.subGolongan, {
  codePrefix: "SUB",
  orderField: "code",
  nameField: "namaSubGolongan",
  searchFields: ["code", "namaSubGolongan", "keterangan"],
});

const jenisHubunganKerjaController = buildMasterDataController(prisma.jenisHubunganKerja, {
  codePrefix: "JHK",
  orderField: "code",
  nameField: "namaJenisHubunganKerja",
  searchFields: ["code", "namaJenisHubunganKerja", "keterangan"],
});

const tagController = buildMasterDataController(prisma.tag, {
  codePrefix: "TAG",
  orderField: "code",
  nameField: "namaTag",
  searchFields: ["code", "namaTag", "warnaTag", "keterangan"],
});

const lokasiKerjaController = buildMasterDataController(prisma.lokasiKerja, {
  codePrefix: "LOK",
  orderField: "code",
  nameField: "namaLokasiKerja",
  searchFields: ["code", "namaLokasiKerja", "alamat", "keterangan"],
});

const statusKaryawanController = buildMasterDataController(prisma.statusKaryawan, {
  codePrefix: "STK",
  orderField: "code",
  nameField: "namaStatus",
  searchFields: ["code", "namaStatus", "keterangan"],
});

router
  .route("/divisi")
  .get(masterDataListValidator, divisiController.list)
  .post(buildMasterDataValidators("namaDivisi"), divisiController.create);
router
  .route("/divisi/:id")
  .get(masterDataIdValidator, divisiController.detail)
  .put([...masterDataIdValidator, ...buildMasterDataValidators("namaDivisi")], divisiController.update)
  .delete(masterDataIdValidator, divisiController.destroy);

router
  .route("/department")
  .get(masterDataListValidator, departmentController.list)
  .post(buildMasterDataValidators("namaDepartmen", { requiredFields: departmentExtraValidators }), departmentController.create);
router
  .route("/department/:id")
  .get(masterDataIdValidator, departmentController.detail)
  .put(
    [...masterDataIdValidator, ...buildMasterDataValidators("namaDepartmen", { requiredFields: departmentExtraValidators })],
    departmentController.update,
  )
  .delete(masterDataIdValidator, departmentController.destroy);

router
  .route("/posisi-jabatan")
  .get(masterDataListValidator, posisiJabatanController.list)
  .post(
    buildMasterDataValidators("namaPosisiJabatan", { requiredFields: posisiJabatanExtraValidators }),
    posisiJabatanController.create,
  );
router
  .route("/posisi-jabatan/:id")
  .get(masterDataIdValidator, posisiJabatanController.detail)
  .put(
    [
      ...masterDataIdValidator,
      ...buildMasterDataValidators("namaPosisiJabatan", { requiredFields: posisiJabatanExtraValidators }),
    ],
    posisiJabatanController.update,
  )
  .delete(masterDataIdValidator, posisiJabatanController.destroy);

router
  .route("/kategori-pangkat")
  .get(masterDataListValidator, kategoriPangkatController.list)
  .post(buildMasterDataValidators("namaKategoriPangkat"), kategoriPangkatController.create);
router
  .route("/kategori-pangkat/:id")
  .get(masterDataIdValidator, kategoriPangkatController.detail)
  .put(
    [...masterDataIdValidator, ...buildMasterDataValidators("namaKategoriPangkat")],
    kategoriPangkatController.update,
  )
  .delete(masterDataIdValidator, kategoriPangkatController.destroy);

router
  .route("/golongan")
  .get(masterDataListValidator, golonganController.list)
  .post(buildMasterDataValidators("namaGolongan"), golonganController.create);
router
  .route("/golongan/:id")
  .get(masterDataIdValidator, golonganController.detail)
  .put([...masterDataIdValidator, ...buildMasterDataValidators("namaGolongan")], golonganController.update)
  .delete(masterDataIdValidator, golonganController.destroy);

router
  .route("/sub-golongan")
  .get(masterDataListValidator, subGolonganController.list)
  .post(buildMasterDataValidators("namaSubGolongan"), subGolonganController.create);
router
  .route("/sub-golongan/:id")
  .get(masterDataIdValidator, subGolonganController.detail)
  .put([...masterDataIdValidator, ...buildMasterDataValidators("namaSubGolongan")], subGolonganController.update)
  .delete(masterDataIdValidator, subGolonganController.destroy);

router
  .route("/jenis-hubungan-kerja")
  .get(masterDataListValidator, jenisHubunganKerjaController.list)
  .post(buildMasterDataValidators("namaJenisHubunganKerja"), jenisHubunganKerjaController.create);
router
  .route("/jenis-hubungan-kerja/:id")
  .get(masterDataIdValidator, jenisHubunganKerjaController.detail)
  .put(
    [...masterDataIdValidator, ...buildMasterDataValidators("namaJenisHubunganKerja")],
    jenisHubunganKerjaController.update,
  )
  .delete(masterDataIdValidator, jenisHubunganKerjaController.destroy);

router
  .route("/tag")
  .get(masterDataListValidator, tagController.list)
  .post(buildMasterDataValidators("namaTag", { requiredFields: tagExtraValidators }), tagController.create);
router
  .route("/tag/:id")
  .get(masterDataIdValidator, tagController.detail)
  .put(
    [...masterDataIdValidator, ...buildMasterDataValidators("namaTag", { requiredFields: tagExtraValidators })],
    tagController.update,
  )
  .delete(masterDataIdValidator, tagController.destroy);

router
  .route("/lokasi-kerja")
  .get(masterDataListValidator, lokasiKerjaController.list)
  .post(buildMasterDataValidators("namaLokasiKerja"), lokasiKerjaController.create);
router
  .route("/lokasi-kerja/:id")
  .get(masterDataIdValidator, lokasiKerjaController.detail)
  .put(
    [...masterDataIdValidator, ...buildMasterDataValidators("namaLokasiKerja")],
    lokasiKerjaController.update,
  )
  .delete(masterDataIdValidator, lokasiKerjaController.destroy);

router
  .route("/status-karyawan")
  .get(masterDataListValidator, statusKaryawanController.list)
  .post(buildMasterDataValidators("namaStatus"), statusKaryawanController.create);
router
  .route("/status-karyawan/:id")
  .get(masterDataIdValidator, statusKaryawanController.detail)
  .put([...masterDataIdValidator, ...buildMasterDataValidators("namaStatus")], statusKaryawanController.update)
  .delete(masterDataIdValidator, statusKaryawanController.destroy);

export default router;
