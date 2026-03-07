import { Router } from "express";

import { authenticate } from "../../../middleware/auth";
import { uploadFotoKaryawan, uploadImportExcel } from "../../../middleware/upload";
import {
  create,
  destroy,
  detail,
  generateQrCode,
  importExcel,
  list,
  update,
  uploadFoto,
} from "./controller";
import {
  createKaryawanValidator,
  karyawanIdValidator,
  karyawanListValidator,
  updateKaryawanValidator,
} from "./validator";

const router = Router();

router.use(authenticate);

router.post("/import", uploadImportExcel.single("file"), importExcel);
router.get("/", karyawanListValidator, list);
router.post("/", createKaryawanValidator, create);
router.get("/:id", karyawanIdValidator, detail);
router.put("/:id", [...karyawanIdValidator, ...updateKaryawanValidator], update);
router.delete("/:id", karyawanIdValidator, destroy);
router.post("/:id/foto", karyawanIdValidator, uploadFotoKaryawan.single("foto"), uploadFoto);
router.get("/:id/qrcode", karyawanIdValidator, generateQrCode);

export default router;
