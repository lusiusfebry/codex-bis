import { Router } from "express";

import { authenticate } from "../../middleware/auth";
import { login, logout, me } from "./controller";
import { loginValidator } from "./validator";

const router = Router();

router.post("/login", loginValidator, login);
router.get("/me", authenticate, me);
router.post("/logout", authenticate, logout);

export default router;
