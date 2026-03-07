import { body } from "express-validator";

export const loginValidator = [
  body("nik")
    .trim()
    .notEmpty()
    .withMessage("NIK wajib diisi.")
    .bail()
    .matches(/^\d{2}-\d{5}$/)
    .withMessage("Format NIK harus 99-99999."),
  body("password")
    .notEmpty()
    .withMessage("Password wajib diisi.")
    .bail()
    .isLength({ min: 6 })
    .withMessage("Password minimal 6 karakter."),
];
