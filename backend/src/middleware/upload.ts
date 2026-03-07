import fs from "fs";
import path from "path";

import multer from "multer";

const uploadPath = path.resolve(process.cwd(), "uploads", "foto-karyawan");
fs.mkdirSync(uploadPath, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const id =
      typeof req.params.id === "string"
        ? req.params.id
        : typeof req.body?.karyawan_id === "string"
          ? req.body.karyawan_id
          : "unknown";
    cb(null, `${id}_${Date.now()}${path.extname(file.originalname)}`);
  },
});

function fileFilter(
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
): void {
  if (!["image/jpeg", "image/png"].includes(file.mimetype)) {
    cb(new Error("Format file tidak didukung. Hanya JPEG dan PNG yang diizinkan."));
    return;
  }

  cb(null, true);
}

export const uploadFotoKaryawan = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});

function excelFileFilter(
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
): void {
  if (
    ![
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ].includes(file.mimetype)
  ) {
    cb(new Error("Format file tidak didukung. Hanya file Excel yang diizinkan."));
    return;
  }

  cb(null, true);
}

export const uploadImportExcel = multer({
  storage: multer.memoryStorage(),
  fileFilter: excelFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});
