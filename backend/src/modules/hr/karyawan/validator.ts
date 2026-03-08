import { body, param, query } from "express-validator";

const optionalUuidFields = ["divisiId", "departmentId", "statusKaryawanId", "lokasiKerjaId"];
const optionalDateFields = [
  "tanggalLahir",
  "tanggalMasukGroup",
  "tanggalMasuk",
  "tanggalKontrak",
  "tanggalAkhirKontrak",
  "tanggalPermanent",
  "tanggalBerhenti",
  "tanggalMenikah",
  "tanggalCerai",
  "tanggalWafatPasangan",
  "tanggalLahirPasangan",
  "tanggalMutasi",
];
const requiredHeadFields = [
  "divisiId",
  "departmentId",
  "posisiJabatanId",
  "statusKaryawanId",
  "lokasiKerjaId",
];

const nestedArrayValidators = [
  body("anak").optional().isArray().withMessage("anak harus berupa array."),
  body("anak.*.urutan")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Urutan anak harus berupa angka minimal 1."),
  body("anak.*.namaAnak").optional().isString().withMessage("Nama anak harus berupa teks."),
  body("saudaraKandung").optional().isArray().withMessage("saudaraKandung harus berupa array."),
  body("saudaraKandung.*.urutan")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("Urutan saudara kandung harus berupa angka 1 sampai 5."),
  body("kontakDarurat").optional().isArray().withMessage("kontakDarurat harus berupa array."),
  body("kontakDarurat.*.urutan")
    .optional()
    .isInt({ min: 1, max: 2 })
    .withMessage("Urutan kontak darurat harus berupa angka 1 sampai 2."),
];

const optionalFieldValidators = [
  body("emailPerusahaan").optional({ values: "falsy" }).isEmail().withMessage("Email perusahaan harus valid."),
  body("emailPribadi").optional({ values: "falsy" }).isEmail().withMessage("Email pribadi harus valid."),
  body("jumlahAnak")
    .optional({ values: "falsy" })
    .isInt({ min: 0 })
    .withMessage("Jumlah anak harus berupa angka minimal 0."),
];

export const karyawanIdValidator = [
  param("id").isUUID().withMessage("ID harus berupa UUID yang valid."),
];

export const karyawanListValidator = [
  query("search").optional().trim(),
  query("referenceMode")
    .optional()
    .isIn(["manager", "atasan"])
    .withMessage("referenceMode harus bernilai manager atau atasan."),
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page harus berupa angka minimal 1."),
  query("limit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Limit harus berupa angka minimal 1."),
  ...optionalUuidFields.map((field) =>
    query(field).optional({ values: "falsy" }).isUUID().withMessage(`${field} harus berupa UUID yang valid.`),
  ),
];

export const createKaryawanValidator = [
  body("nomorIndukKaryawan")
    .trim()
    .notEmpty()
    .withMessage("Nomor induk karyawan wajib diisi.")
    .bail()
    .isLength({ max: 50 })
    .withMessage("Nomor induk karyawan maksimal 50 karakter."),
  body("namaLengkap")
    .trim()
    .notEmpty()
    .withMessage("Nama lengkap wajib diisi.")
    .bail()
    .isLength({ max: 200 })
    .withMessage("Nama lengkap maksimal 200 karakter."),
  ...requiredHeadFields.map((field) =>
    body(field)
      .notEmpty()
      .withMessage(`${field} wajib diisi.`)
      .bail()
      .isUUID()
      .withMessage(`${field} harus berupa UUID yang valid.`),
  ),
  ...optionalDateFields.map((field) =>
    body(field)
      .optional({ values: "falsy" })
      .isISO8601()
      .withMessage(`${field} harus berformat YYYY-MM-DD.`),
  ),
  ...optionalFieldValidators,
  ...nestedArrayValidators,
];

export const updateKaryawanValidator = [
  body("nomorIndukKaryawan")
    .trim()
    .notEmpty()
    .withMessage("Nomor induk karyawan wajib diisi.")
    .bail()
    .isLength({ max: 50 })
    .withMessage("Nomor induk karyawan maksimal 50 karakter."),
  body("namaLengkap")
    .trim()
    .notEmpty()
    .withMessage("Nama lengkap wajib diisi.")
    .bail()
    .isLength({ max: 200 })
    .withMessage("Nama lengkap maksimal 200 karakter."),
  ...requiredHeadFields.map((field) =>
    body(field)
      .notEmpty()
      .withMessage(`${field} wajib diisi.`)
      .bail()
      .isUUID()
      .withMessage(`${field} harus berupa UUID yang valid.`),
  ),
  ...optionalDateFields.map((field) =>
    body(field)
      .optional({ values: "falsy" })
      .isISO8601()
      .withMessage(`${field} harus berformat YYYY-MM-DD.`),
  ),
  ...optionalFieldValidators,
  ...nestedArrayValidators,
];
