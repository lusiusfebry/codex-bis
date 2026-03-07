import { body, param, query, ValidationChain } from "express-validator";

type ValidatorOptions = {
  requiredFields?: ValidationChain[];
  optionalFields?: ValidationChain[];
};

function normalizeStatusInput(value: string): string {
  return value.trim().toLowerCase().replace(/[\s_-]+/g, " ");
}

export function buildMasterDataValidators(
  namaField: string,
  options?: ValidatorOptions,
): ValidationChain[] {
  return [
    body(namaField)
      .trim()
      .notEmpty()
      .withMessage(`${namaField} wajib diisi.`)
      .bail()
      .isLength({ max: 100 })
      .withMessage(`${namaField} maksimal 100 karakter.`),
    body("keterangan")
      .optional({ values: "falsy" })
      .trim()
      .isLength({ max: 255 })
      .withMessage("Keterangan maksimal 255 karakter."),
    body("status")
      .optional({ values: "falsy" })
      .isIn(["Aktif", "Tidak Aktif"])
      .withMessage('Status harus "Aktif" atau "Tidak Aktif".'),
    ...(options?.requiredFields ?? []),
    ...(options?.optionalFields ?? []),
  ];
}

export const masterDataIdValidator = [
  param("id").isUUID().withMessage("ID harus berupa UUID yang valid."),
];

export const masterDataListValidator = [
  query("search").optional().trim(),
  query("status")
    .optional()
    .custom((value) => ["aktif", "tidak aktif"].includes(normalizeStatusInput(value)))
    .withMessage('Status harus "Aktif" atau "Tidak Aktif".'),
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page harus berupa angka minimal 1."),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit harus berupa angka antara 1 sampai 100."),
];

export const departmentExtraValidators = [
  body("divisiId").notEmpty().withMessage("divisiId wajib diisi.").bail().isUUID().withMessage("divisiId harus berupa UUID yang valid."),
];

export const posisiJabatanExtraValidators = [
  body("departmentId")
    .notEmpty()
    .withMessage("departmentId wajib diisi.")
    .bail()
    .isUUID()
    .withMessage("departmentId harus berupa UUID yang valid."),
];

export const tagExtraValidators = [
  body("warnaTag")
    .trim()
    .notEmpty()
    .withMessage("warnaTag wajib diisi.")
    .bail()
    .matches(/^#[0-9A-Fa-f]{6}$/)
    .withMessage("warnaTag harus berupa kode hex warna yang valid."),
];
