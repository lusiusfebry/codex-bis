import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

import { handleValidationErrors } from "../../../utils/validationHelper";

type MasterDataDelegate = {
  findMany: (args?: any) => Promise<unknown[]>;
  count: (args?: any) => Promise<number>;
  create: (args: any) => Promise<unknown>;
  findUnique: (args: any) => Promise<unknown | null>;
  update: (args: any) => Promise<unknown>;
  delete: (args: any) => Promise<unknown>;
};

type MasterDataConfig = {
  orderField: string;
  nameField: string;
  searchFields: string[];
  include?: Record<string, unknown>;
};

function buildWhereClause(req: Request, searchFields: string[]): Record<string, unknown> {
  const { search, status } = req.query;
  const where: Record<string, unknown> = {};

  if (typeof status === "string" && status.length > 0) {
    where.status = status;
  }

  if (typeof search === "string" && search.trim().length > 0) {
    where.OR = searchFields.map((field) => ({
      [field]: {
        contains: search.trim(),
        mode: "insensitive",
      },
    }));
  }

  return where;
}

function parsePagination(req: Request): { page: number; limit: number; skip: number } {
  const pageValue = Number(req.query.page ?? 1);
  const limitValue = Number(req.query.limit ?? 10);
  const page = Number.isFinite(pageValue) && pageValue > 0 ? Math.floor(pageValue) : 1;
  const limit = Number.isFinite(limitValue) && limitValue > 0 ? Math.min(Math.floor(limitValue), 100) : 10;

  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
}

export function buildMasterDataController(model: MasterDataDelegate, config: MasterDataConfig) {
  return {
    list: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        if (handleValidationErrors(req, res)) {
          return;
        }

        const where = buildWhereClause(req, config.searchFields);
        const { page, limit, skip } = parsePagination(req);

        const [data, total] = await Promise.all([
          model.findMany({
            where,
            include: config.include,
            orderBy: { [config.orderField]: "asc" },
            skip,
            take: limit,
          }),
          model.count({ where }),
        ]);

        res.json({
          success: true,
          data,
          meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit) || 1,
          },
        });
      } catch (error) {
        next(error);
      }
    },
    create: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        if (handleValidationErrors(req, res)) {
          return;
        }

        const data = await model.create({
          data: req.body,
        });

        res.status(201).json({
          success: true,
          data,
        });
      } catch (error) {
        next(error);
      }
    },
    detail: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        if (handleValidationErrors(req, res)) {
          return;
        }

        const data = await model.findUnique({
          where: { id: req.params.id },
          include: config.include,
        });

        if (!data) {
          res.status(404).json({
            success: false,
            message: `${config.nameField} tidak ditemukan.`,
          });
          return;
        }

        res.json({
          success: true,
          data,
        });
      } catch (error) {
        next(error);
      }
    },
    update: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        if (handleValidationErrors(req, res)) {
          return;
        }

        const data = await model.update({
          where: { id: req.params.id },
          data: req.body,
        });

        res.json({
          success: true,
          data,
        });
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
          res.status(404).json({
            success: false,
            message: `${config.nameField} tidak ditemukan.`,
          });
          return;
        }

        next(error);
      }
    },
    destroy: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        if (handleValidationErrors(req, res)) {
          return;
        }

        await model.delete({
          where: { id: req.params.id },
        });

        res.json({
          success: true,
          message: "Data berhasil dihapus.",
        });
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003") {
          res.status(409).json({
            success: false,
            message: "Data tidak dapat dihapus karena masih digunakan",
          });
          return;
        }

        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
          res.status(404).json({
            success: false,
            message: `${config.nameField} tidak ditemukan.`,
          });
          return;
        }

        next(error);
      }
    },
  };
}
