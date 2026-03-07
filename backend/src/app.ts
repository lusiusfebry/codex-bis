import path from "path";

import cors from "cors";
import express from "express";

import authRoutes from "./modules/auth/routes";
import masterDataRoutes from "./modules/hr/master-data/routes";
import karyawanRoutes from "./modules/hr/karyawan/routes";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/hr/master-data", masterDataRoutes);
app.use("/api/hr/karyawan", karyawanRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
