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
  orderField: "namaDivisi",
  nameField: "namaDivisi",
  searchFields: ["namaDivisi", "keterangan"],
});

const departmentController = buildMasterDataController(prisma.department, {
  orderField: "namaDepartmen",
  nameField: "namaDepartmen",
  searchFields: ["namaDepartmen", "keterangan"],
  include: { divisi: { select: { namaDivisi: true } } },
});

const posisiJabatanController = buildMasterDataController(prisma.posisiJabatan, {
  orderField: "namaPosisiJabatan",
  nameField: "namaPosisiJabatan",
  searchFields: ["namaPosisiJabatan", "keterangan"],
  include: { department: { select: { namaDepartmen: true, divisiId: true } } },
});

const kategoriPangkatController = buildMasterDataController(prisma.kategoriPangkat, {
  orderField: "namaKategoriPangkat",
  nameField: "namaKategoriPangkat",
  searchFields: ["namaKategoriPangkat", "keterangan"],
});

const golonganController = buildMasterDataController(prisma.golongan, {
  orderField: "namaGolongan",
  nameField: "namaGolongan",
  searchFields: ["namaGolongan", "keterangan"],
});

const subGolonganController = buildMasterDataController(prisma.subGolongan, {
  orderField: "namaSubGolongan",
  nameField: "namaSubGolongan",
  searchFields: ["namaSubGolongan", "keterangan"],
});

const jenisHubunganKerjaController = buildMasterDataController(prisma.jenisHubunganKerja, {
  orderField: "namaJenisHubunganKerja",
  nameField: "namaJenisHubunganKerja",
  searchFields: ["namaJenisHubunganKerja", "keterangan"],
});

const tagController = buildMasterDataController(prisma.tag, {
  orderField: "namaTag",
  nameField: "namaTag",
  searchFields: ["namaTag", "warnaTag", "keterangan"],
});

const lokasiKerjaController = buildMasterDataController(prisma.lokasiKerja, {
  orderField: "namaLokasiKerja",
  nameField: "namaLokasiKerja",
  searchFields: ["namaLokasiKerja", "alamat", "keterangan"],
});

const statusKaryawanController = buildMasterDataController(prisma.statusKaryawan, {
  orderField: "namaStatus",
  nameField: "namaStatus",
  searchFields: ["namaStatus", "keterangan"],
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
