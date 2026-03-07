import fs from "fs/promises";
import path from "path";

import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import QRCode from "qrcode";
import * as XLSX from "xlsx";

import { prisma } from "../../../config/database";
import { handleValidationErrors } from "../../../utils/validationHelper";

const listInclude = {
  divisi: true,
  department: true,
  posisiJabatan: true,
  statusKaryawan: true,
  lokasiKerja: true,
  tag: true,
} as const;

const detailInclude = {
  divisi: true,
  department: true,
  posisiJabatan: true,
  statusKaryawan: true,
  lokasiKerja: true,
  tag: true,
  jenisHubunganKerja: true,
  kategoriPangkat: true,
  golongan: true,
  subGolongan: true,
  lokasiSebelumnya: true,
  anak: { orderBy: { urutan: "asc" } },
  saudaraKandung: { orderBy: { urutan: "asc" } },
  kontakDarurat: { orderBy: { urutan: "asc" } },
  orangTuaKandung: true,
  orangTuaMertua: true,
  keluarga: true,
} as const;

const karyawanDateFields = new Set([
  "tanggalLahir",
  "tanggalMenikah",
  "tanggalCerai",
  "tanggalWafatPasangan",
  "tanggalMasukGroup",
  "tanggalMasuk",
  "tanggalPermanent",
  "tanggalKontrak",
  "tanggalAkhirKontrak",
  "tanggalBerhenti",
  "tanggalMutasi",
]);

const karyawanIntegerFields = new Set(["jumlahAnak", "anakKe", "jumlahSaudaraKandung"]);
const optionalImportScalarRefFields = [
  "tagId",
  "kategoriPangkatId",
  "golonganId",
  "subGolonganId",
  "jenisHubunganKerjaId",
  "lokasiSebelumnyaId",
  "managerNik",
  "atasanLangsungNik",
] as const;

type GenericRecord = Record<string, unknown>;
type ChildRecord = { urutan: number; [key: string]: unknown };

type ParsedImportRow = {
  scalarData: Record<string, unknown>;
  anak: ChildRecord[];
  saudaraKandung: ChildRecord[];
  kontakDarurat: ChildRecord[];
  orangTuaKandung?: Record<string, unknown>;
  orangTuaMertua?: Record<string, unknown>;
  keluarga?: Record<string, unknown>;
  refs: {
    managerNik?: string | null;
    atasanLangsungNik?: string | null;
  };
  errors: string[];
  nik?: string;
  nama?: string;
};

type MasterLookupMaps = {
  divisi: Map<string, string>;
  department: Map<string, string>;
  posisiJabatan: Map<string, string>;
  kategoriPangkat: Map<string, string>;
  golongan: Map<string, string>;
  subGolongan: Map<string, string>;
  jenisHubunganKerja: Map<string, string>;
  tag: Map<string, string>;
  lokasiKerja: Map<string, string>;
  statusKaryawan: Map<string, string>;
};

function parsePositiveInt(value: unknown, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
}

function normalizeLookupKey(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

function normalizeStringValue(value: unknown): string | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return null;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  return String(value).trim();
}

function normalizeDateValue(value: unknown): Date | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (value === null || value === "") {
    return null;
  }

  if (value instanceof Date) {
    return value;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();

    if (!trimmed) {
      return null;
    }

    const parsed = new Date(trimmed);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  if (typeof value === "number") {
    const parsedCode = XLSX.SSF.parse_date_code(value);

    if (!parsedCode) {
      return null;
    }

    return new Date(parsedCode.y, parsedCode.m - 1, parsedCode.d);
  }

  return null;
}

function normalizeIntegerValue(value: unknown): number | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (value === null || value === "") {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.floor(parsed) : null;
}

function hasMeaningfulData(value: unknown): boolean {
  if (!value || typeof value !== "object") {
    return false;
  }

  return Object.values(value as Record<string, unknown>).some(
    (item) => item !== undefined && item !== null && item !== "",
  );
}

function normalizeRecordData(
  input: Record<string, unknown>,
  options?: {
    dateFields?: Set<string>;
    integerFields?: Set<string>;
  },
): Record<string, unknown> {
  return Object.entries(input).reduce<Record<string, unknown>>((normalized, [key, rawValue]) => {
    if (rawValue === undefined) {
      return normalized;
    }

    if (options?.dateFields?.has(key)) {
      normalized[key] = normalizeDateValue(rawValue);
      return normalized;
    }

    if (options?.integerFields?.has(key)) {
      normalized[key] = normalizeIntegerValue(rawValue);
      return normalized;
    }

    if (typeof rawValue === "string") {
      normalized[key] = normalizeStringValue(rawValue);
      return normalized;
    }

    normalized[key] = rawValue;
    return normalized;
  }, {});
}

function normalizeChildRows(rows: unknown, dateFields?: Set<string>): ChildRecord[] {
  if (!Array.isArray(rows)) {
    return [];
  }

  return rows
    .filter((item): item is Record<string, unknown> => !!item && typeof item === "object")
    .map((item) => normalizeRecordData(item, { dateFields }) as ChildRecord)
    .filter((item) => typeof item.urutan === "number" && !Number.isNaN(item.urutan));
}

function buildCreatePayload(body: GenericRecord) {
  const {
    anak,
    saudaraKandung,
    kontakDarurat,
    orangTuaKandung,
    orangTuaMertua,
    keluarga,
    ...scalarFields
  } = body;

  const normalizedScalarData = normalizeRecordData(scalarFields, {
    dateFields: karyawanDateFields,
    integerFields: karyawanIntegerFields,
  });
  const normalizedAnak = normalizeChildRows(anak, new Set(["tanggalLahirAnak"]));
  const normalizedSaudaraKandung = normalizeChildRows(saudaraKandung, new Set(["tanggalLahir"]));
  const normalizedKontakDarurat = normalizeChildRows(kontakDarurat);
  const normalizedOrangTuaKandung = hasMeaningfulData(orangTuaKandung)
    ? normalizeRecordData(orangTuaKandung as Record<string, unknown>, {
        dateFields: new Set(["tanggalLahirAyahKandung", "tanggalLahirIbuKandung"]),
      })
    : undefined;
  const normalizedOrangTuaMertua = hasMeaningfulData(orangTuaMertua)
    ? normalizeRecordData(orangTuaMertua as Record<string, unknown>, {
        dateFields: new Set(["tanggalLahirAyahMertua", "tanggalLahirIbuMertua"]),
      })
    : undefined;
  const normalizedKeluarga = hasMeaningfulData(keluarga)
    ? normalizeRecordData(keluarga as Record<string, unknown>, {
        dateFields: new Set(["tanggalLahirPasangan"]),
      })
    : undefined;

  return {
    normalizedScalarData,
    normalizedAnak,
    normalizedSaudaraKandung,
    normalizedKontakDarurat,
    normalizedOrangTuaKandung,
    normalizedOrangTuaMertua,
    normalizedKeluarga,
  };
}

async function loadKaryawanDetail(id: string) {
  return prisma.karyawan.findUnique({
    where: { id },
    include: detailInclude,
  });
}

function buildWhereClause(req: Request): Record<string, unknown> {
  const { search, divisiId, departmentId, statusKaryawanId, lokasiKerjaId } = req.query;
  const where: Record<string, unknown> = {};

  if (typeof divisiId === "string" && divisiId) {
    where.divisiId = divisiId;
  }

  if (typeof departmentId === "string" && departmentId) {
    where.departmentId = departmentId;
  }

  if (typeof statusKaryawanId === "string" && statusKaryawanId) {
    where.statusKaryawanId = statusKaryawanId;
  }

  if (typeof lokasiKerjaId === "string" && lokasiKerjaId) {
    where.lokasiKerjaId = lokasiKerjaId;
  }

  if (typeof search === "string" && search.trim()) {
    where.OR = [
      { namaLengkap: { contains: search.trim(), mode: "insensitive" } },
      { nomorIndukKaryawan: { contains: search.trim(), mode: "insensitive" } },
    ];
  }

  return where;
}

function getCellValue(row: unknown[], columnNumber: number): unknown {
  return row[columnNumber - 1];
}

function buildMasterMap<T extends Record<string, unknown>>(rows: T[], field: keyof T): Map<string, string> {
  return new Map(
    rows
      .map((item) => [normalizeLookupKey(item[field]), String(item.id)] as [string, string])
      .filter(([key]) => key.length > 0),
  );
}

function getRequestId(req: Request): string {
  return String(req.params.id);
}

async function preloadMasterMaps(): Promise<MasterLookupMaps> {
  const [
    divisi,
    department,
    posisiJabatan,
    kategoriPangkat,
    golongan,
    subGolongan,
    jenisHubunganKerja,
    tag,
    lokasiKerja,
    statusKaryawan,
  ] = await Promise.all([
    prisma.divisi.findMany({ where: { status: "Aktif" }, select: { id: true, namaDivisi: true } }),
    prisma.department.findMany({ where: { status: "Aktif" }, select: { id: true, namaDepartmen: true } }),
    prisma.posisiJabatan.findMany({
      where: { status: "Aktif" },
      select: { id: true, namaPosisiJabatan: true },
    }),
    prisma.kategoriPangkat.findMany({
      where: { status: "Aktif" },
      select: { id: true, namaKategoriPangkat: true },
    }),
    prisma.golongan.findMany({ where: { status: "Aktif" }, select: { id: true, namaGolongan: true } }),
    prisma.subGolongan.findMany({
      where: { status: "Aktif" },
      select: { id: true, namaSubGolongan: true },
    }),
    prisma.jenisHubunganKerja.findMany({
      where: { status: "Aktif" },
      select: { id: true, namaJenisHubunganKerja: true },
    }),
    prisma.tag.findMany({ where: { status: "Aktif" }, select: { id: true, namaTag: true } }),
    prisma.lokasiKerja.findMany({
      where: { status: "Aktif" },
      select: { id: true, namaLokasiKerja: true },
    }),
    prisma.statusKaryawan.findMany({
      where: { status: "Aktif" },
      select: { id: true, namaStatus: true },
    }),
  ]);

  return {
    divisi: buildMasterMap(divisi, "namaDivisi"),
    department: buildMasterMap(department, "namaDepartmen"),
    posisiJabatan: buildMasterMap(posisiJabatan, "namaPosisiJabatan"),
    kategoriPangkat: buildMasterMap(kategoriPangkat, "namaKategoriPangkat"),
    golongan: buildMasterMap(golongan, "namaGolongan"),
    subGolongan: buildMasterMap(subGolongan, "namaSubGolongan"),
    jenisHubunganKerja: buildMasterMap(jenisHubunganKerja, "namaJenisHubunganKerja"),
    tag: buildMasterMap(tag, "namaTag"),
    lokasiKerja: buildMasterMap(lokasiKerja, "namaLokasiKerja"),
    statusKaryawan: buildMasterMap(statusKaryawan, "namaStatus"),
  };
}

function mapMasterValue(
  maps: MasterLookupMaps,
  type: keyof MasterLookupMaps,
  label: string,
  value: unknown,
  errors: string[],
  required = false,
): string | null | undefined {
  const normalizedValue = normalizeStringValue(value);

  if (!normalizedValue) {
    if (required) {
      errors.push(`Master Data tidak ditemukan: ${label} = ''`);
      return null;
    }

    return null;
  }

  const found = maps[type].get(normalizeLookupKey(normalizedValue));

  if (!found) {
    errors.push(`Master Data tidak ditemukan: ${label} = '${normalizedValue}'`);
    return null;
  }

  return found;
}

function parseExcelRow(row: unknown[], rowNumber: number, masterMaps: MasterLookupMaps): ParsedImportRow {
  const errors: string[] = [];
  const scalarData: Record<string, unknown> = {};

  scalarData.nomorIndukKaryawan = normalizeStringValue(getCellValue(row, 2));
  scalarData.namaLengkap = normalizeStringValue(getCellValue(row, 3));

  if (!scalarData.nomorIndukKaryawan) {
    errors.push("Nomor induk karyawan wajib diisi.");
  }

  if (!scalarData.namaLengkap) {
    errors.push("Nama lengkap wajib diisi.");
  }

  scalarData.posisiJabatanId = mapMasterValue(masterMaps, "posisiJabatan", "POSISI JABATAN", getCellValue(row, 4), errors, true);
  scalarData.costing = normalizeStringValue(getCellValue(row, 5));
  scalarData.actual = normalizeStringValue(getCellValue(row, 6));
  scalarData.assign = normalizeStringValue(getCellValue(row, 7));
  scalarData.kategoriPangkatId = mapMasterValue(
    masterMaps,
    "kategoriPangkat",
    "PANGKAT KATEGORI",
    getCellValue(row, 8),
    errors,
  ) ?? null;
  scalarData.golonganId = mapMasterValue(masterMaps, "golongan", "GOLONGAN", getCellValue(row, 9), errors) ?? null;
  scalarData.subGolonganId =
    mapMasterValue(masterMaps, "subGolongan", "SUB GOLONGAN", getCellValue(row, 10), errors) ?? null;
  scalarData.tempatLahir = normalizeStringValue(getCellValue(row, 11));
  scalarData.tanggalLahir = normalizeDateValue(getCellValue(row, 12));
  scalarData.tanggalMasukGroup = normalizeDateValue(getCellValue(row, 13));
  scalarData.tanggalMasuk = normalizeDateValue(getCellValue(row, 14));
  scalarData.jenisHubunganKerjaId = mapMasterValue(
    masterMaps,
    "jenisHubunganKerja",
    "JENIS HUBUNGAN KERJA",
    getCellValue(row, 15),
    errors,
  ) ?? null;
  scalarData.tanggalKontrak = normalizeDateValue(getCellValue(row, 16));
  scalarData.tanggalAkhirKontrak = normalizeDateValue(getCellValue(row, 17));
  scalarData.tanggalPermanent = normalizeDateValue(getCellValue(row, 18));
  scalarData.tanggalBerhenti = normalizeDateValue(getCellValue(row, 19));
  scalarData.jenisKelamin = normalizeStringValue(getCellValue(row, 20));
  scalarData.agama = normalizeStringValue(getCellValue(row, 21));
  scalarData.alamatDomisili = normalizeStringValue(getCellValue(row, 22));
  scalarData.kotaDomisili = normalizeStringValue(getCellValue(row, 23));
  scalarData.provinsiDomisili = normalizeStringValue(getCellValue(row, 24));
  scalarData.nomorTeleponRumah1 = normalizeStringValue(getCellValue(row, 25));
  scalarData.nomorTeleponRumah2 = normalizeStringValue(getCellValue(row, 26));
  scalarData.nomorHandphone = normalizeStringValue(getCellValue(row, 27));
  scalarData.nomorHandphone2 = normalizeStringValue(getCellValue(row, 28));
  scalarData.golonganDarah = normalizeStringValue(getCellValue(row, 29));
  scalarData.nomorKtp = normalizeStringValue(getCellValue(row, 30));
  scalarData.alamatKtp = normalizeStringValue(getCellValue(row, 31));
  scalarData.nomorNpwp = normalizeStringValue(getCellValue(row, 32));
  scalarData.nomorBpjs = normalizeStringValue(getCellValue(row, 33));
  scalarData.noDanaPensiun = normalizeStringValue(getCellValue(row, 34));
  scalarData.nomorRekening = normalizeStringValue(getCellValue(row, 35));
  scalarData.namaPemegangRekening = normalizeStringValue(getCellValue(row, 36));
  scalarData.statusPajak = normalizeStringValue(getCellValue(row, 37));
  scalarData.jumlahAnak = normalizeIntegerValue(getCellValue(row, 38));
  scalarData.tingkatPendidikan = normalizeStringValue(getCellValue(row, 40));
  scalarData.bidangStudi = normalizeStringValue(getCellValue(row, 41));
  scalarData.namaSekolah = normalizeStringValue(getCellValue(row, 42));
  scalarData.kotaSekolah = normalizeStringValue(getCellValue(row, 43));
  scalarData.statusKelulusan = normalizeStringValue(getCellValue(row, 44));
  scalarData.keteranganPendidikan = normalizeStringValue(getCellValue(row, 45));
  scalarData.statusPernikahan = normalizeStringValue(getCellValue(row, 47));
  scalarData.tanggalMenikah = normalizeDateValue(getCellValue(row, 48));
  scalarData.tanggalCerai = normalizeDateValue(getCellValue(row, 49));
  scalarData.tanggalWafatPasangan = normalizeDateValue(getCellValue(row, 50));
  scalarData.namaPasangan = normalizeStringValue(getCellValue(row, 51));
  scalarData.pekerjaanPasangan = normalizeStringValue(getCellValue(row, 54));
  scalarData.siklusPembayaranGaji = normalizeStringValue(getCellValue(row, 112));
  scalarData.namaBank = normalizeStringValue(getCellValue(row, 113));
  scalarData.cabangBank = normalizeStringValue(getCellValue(row, 114));
  scalarData.departmentId = mapMasterValue(masterMaps, "department", "DEPARTMENT", getCellValue(row, 126), errors, true);
  scalarData.divisiId = mapMasterValue(masterMaps, "divisi", "DIVISI", getCellValue(row, 127), errors, true);
  scalarData.ukuranSepatuKerja = normalizeStringValue(getCellValue(row, 133));
  scalarData.ukuranSeragamKerja = normalizeStringValue(getCellValue(row, 134));
  scalarData.lokasiSebelumnyaId = mapMasterValue(
    masterMaps,
    "lokasiKerja",
    "LOKASI SEBELUMNYA",
    getCellValue(row, 135),
    errors,
  ) ?? null;
  scalarData.tanggalMutasi = normalizeDateValue(getCellValue(row, 136));
  scalarData.pointOfOriginal = normalizeStringValue(getCellValue(row, 138));
  scalarData.pointOfHire = normalizeStringValue(getCellValue(row, 139));
  scalarData.nomorKartuKeluarga = normalizeStringValue(getCellValue(row, 140));
  scalarData.noNikKk = normalizeStringValue(getCellValue(row, 141));
  scalarData.lokasiKerjaId = mapMasterValue(masterMaps, "lokasiKerja", "LOKASI KERJA", getCellValue(row, 142), errors, true);
  scalarData.statusKaryawanId = mapMasterValue(
    masterMaps,
    "statusKaryawan",
    "STATUS KARYAWAN",
    getCellValue(row, 143),
    errors,
    true,
  );
  scalarData.tagId = mapMasterValue(masterMaps, "tag", "TAG", getCellValue(row, 144), errors) ?? null;
  scalarData.managerNik = normalizeStringValue(getCellValue(row, 145)) ?? null;
  scalarData.atasanLangsungNik = normalizeStringValue(getCellValue(row, 146)) ?? null;
  scalarData.emailPerusahaan = normalizeStringValue(getCellValue(row, 147));
  scalarData.emailPribadi = normalizeStringValue(getCellValue(row, 148));
  scalarData.kotaKtp = normalizeStringValue(getCellValue(row, 149));
  scalarData.provinsiKtp = normalizeStringValue(getCellValue(row, 150));
  scalarData.anakKe = normalizeIntegerValue(getCellValue(row, 151));
  scalarData.jumlahSaudaraKandung = normalizeIntegerValue(getCellValue(row, 152));

  void rowNumber;

  const keluarga = normalizeRecordData(
    {
      tanggalLahirPasangan: normalizeDateValue(getCellValue(row, 52)),
      pendidikanTerakhirPasangan: normalizeStringValue(getCellValue(row, 53)),
      keteranganPasangan: normalizeStringValue(getCellValue(row, 55)),
    },
    { dateFields: new Set(["tanggalLahirPasangan"]) },
  );

  const orangTuaKandung = normalizeRecordData(
    {
      namaAyahKandung: normalizeStringValue(getCellValue(row, 72)),
      tanggalLahirAyahKandung: normalizeDateValue(getCellValue(row, 73)),
      pendidikanTerakhirAyahKandung: normalizeStringValue(getCellValue(row, 74)),
      pekerjaanAyahKandung: normalizeStringValue(getCellValue(row, 75)),
      keteranganAyahKandung: normalizeStringValue(getCellValue(row, 76)),
      namaIbuKandung: normalizeStringValue(getCellValue(row, 77)),
      tanggalLahirIbuKandung: normalizeDateValue(getCellValue(row, 78)),
      pendidikanTerakhirIbuKandung: normalizeStringValue(getCellValue(row, 79)),
      pekerjaanIbuKandung: normalizeStringValue(getCellValue(row, 80)),
      keteranganIbuKandung: normalizeStringValue(getCellValue(row, 81)),
    },
    {
      dateFields: new Set(["tanggalLahirAyahKandung", "tanggalLahirIbuKandung"]),
    },
  );

  const orangTuaMertua = normalizeRecordData(
    {
      namaAyahMertua: normalizeStringValue(getCellValue(row, 115)),
      tanggalLahirAyahMertua: normalizeDateValue(getCellValue(row, 116)),
      pendidikanTerakhirAyahMertua: normalizeStringValue(getCellValue(row, 117)),
      pekerjaanAyahMertua: normalizeStringValue(getCellValue(row, 118)),
      keteranganAyahMertua: normalizeStringValue(getCellValue(row, 119)),
      namaIbuMertua: normalizeStringValue(getCellValue(row, 120)),
      tanggalLahirIbuMertua: normalizeDateValue(getCellValue(row, 121)),
      pendidikanTerakhirIbuMertua: normalizeStringValue(getCellValue(row, 122)),
      pekerjaanIbuMertua: normalizeStringValue(getCellValue(row, 123)),
      keteranganIbuMertua: normalizeStringValue(getCellValue(row, 124)),
    },
    {
      dateFields: new Set(["tanggalLahirAyahMertua", "tanggalLahirIbuMertua"]),
    },
  );

  const anak: ChildRecord[] = [];
  for (let index = 0; index < 4; index += 1) {
    const base = 56 + index * 4;
    const record = normalizeRecordData(
      {
        urutan: index + 1,
        namaAnak: normalizeStringValue(getCellValue(row, base)),
        jenisKelaminAnak: normalizeStringValue(getCellValue(row, base + 1)),
        tanggalLahirAnak: normalizeDateValue(getCellValue(row, base + 2)),
        keteranganAnak: normalizeStringValue(getCellValue(row, base + 3)),
      },
      { dateFields: new Set(["tanggalLahirAnak"]) },
    ) as ChildRecord;

    if (hasMeaningfulData({ ...record, urutan: undefined })) {
      anak.push(record);
    }
  }

  const saudaraKandung: ChildRecord[] = [];
  const saudaraColumns = [82, 88, 94, 100, 153];

  for (let index = 0; index < saudaraColumns.length; index += 1) {
    const base = saudaraColumns[index];
    const record = normalizeRecordData(
      {
        urutan: index + 1,
        nama: normalizeStringValue(getCellValue(row, base)),
        jenisKelamin: normalizeStringValue(getCellValue(row, base + 1)),
        tanggalLahir: normalizeDateValue(getCellValue(row, base + 2)),
        pendidikanTerakhir: normalizeStringValue(getCellValue(row, base + 3)),
        pekerjaan: normalizeStringValue(getCellValue(row, base + 4)),
        keterangan: normalizeStringValue(getCellValue(row, base + 5)),
      },
      { dateFields: new Set(["tanggalLahir"]) },
    ) as ChildRecord;

    if (hasMeaningfulData({ ...record, urutan: undefined })) {
      saudaraKandung.push(record);
    }
  }

  const kontakDarurat: ChildRecord[] = [];
  const kontak1 = normalizeRecordData(
    {
      urutan: 1,
      nama: normalizeStringValue(getCellValue(row, 128)),
      hubungan: normalizeStringValue(getCellValue(row, 129)),
      alamat: normalizeStringValue(getCellValue(row, 130)),
      nomorTelepon: normalizeStringValue(getCellValue(row, 131)),
    },
  ) as ChildRecord;

  if (hasMeaningfulData({ ...kontak1, urutan: undefined })) {
    kontakDarurat.push(kontak1);
  }

  const kontak2 = normalizeRecordData(
    {
      urutan: 2,
      nama: normalizeStringValue(getCellValue(row, 159)),
      hubungan: normalizeStringValue(getCellValue(row, 160)),
      alamat: normalizeStringValue(getCellValue(row, 161)),
      nomorTelepon: normalizeStringValue(getCellValue(row, 162)) ?? normalizeStringValue(getCellValue(row, 132)),
    },
  ) as ChildRecord;

  if (hasMeaningfulData({ ...kontak2, urutan: undefined })) {
    kontakDarurat.push(kontak2);
  }

  return {
    scalarData,
    anak,
    saudaraKandung,
    kontakDarurat,
    orangTuaKandung: hasMeaningfulData(orangTuaKandung) ? orangTuaKandung : undefined,
    orangTuaMertua: hasMeaningfulData(orangTuaMertua) ? orangTuaMertua : undefined,
    keluarga: hasMeaningfulData(keluarga) ? keluarga : undefined,
    refs: {
      managerNik: scalarData.managerNik as string | null | undefined,
      atasanLangsungNik: scalarData.atasanLangsungNik as string | null | undefined,
    },
    errors,
    nik: scalarData.nomorIndukKaryawan as string | undefined,
    nama: scalarData.namaLengkap as string | undefined,
  };
}

async function replaceKaryawanRelations(
  tx: Prisma.TransactionClient,
  karyawanId: string,
  payload: {
    anak: ChildRecord[];
    saudaraKandung: ChildRecord[];
    kontakDarurat: ChildRecord[];
    orangTuaKandung?: Record<string, unknown>;
    orangTuaMertua?: Record<string, unknown>;
    keluarga?: Record<string, unknown>;
  },
): Promise<void> {
  await tx.karyawanAnak.deleteMany({ where: { karyawanId } });
  if (payload.anak.length > 0) {
    await tx.karyawanAnak.createMany({
      data: payload.anak.map((item) => ({ ...item, karyawanId })) as Prisma.KaryawanAnakCreateManyInput[],
    });
  }

  await tx.karyawanSaudaraKandung.deleteMany({ where: { karyawanId } });
  if (payload.saudaraKandung.length > 0) {
    await tx.karyawanSaudaraKandung.createMany({
      data: payload.saudaraKandung.map((item) => ({ ...item, karyawanId })) as Prisma.KaryawanSaudaraKandungCreateManyInput[],
    });
  }

  await tx.karyawanKontakDarurat.deleteMany({ where: { karyawanId } });
  if (payload.kontakDarurat.length > 0) {
    await tx.karyawanKontakDarurat.createMany({
      data: payload.kontakDarurat.map((item) => ({ ...item, karyawanId })) as Prisma.KaryawanKontakDaruratCreateManyInput[],
    });
  }

  if (payload.orangTuaKandung) {
    await tx.karyawanOrangTuaKandung.upsert({
      where: { karyawanId },
      update: payload.orangTuaKandung,
      create: { karyawanId, ...payload.orangTuaKandung },
    });
  }

  if (payload.orangTuaMertua) {
    await tx.karyawanOrangTuaMertua.upsert({
      where: { karyawanId },
      update: payload.orangTuaMertua,
      create: { karyawanId, ...payload.orangTuaMertua },
    });
  }

  if (payload.keluarga) {
    await tx.karyawanKeluarga.upsert({
      where: { karyawanId },
      update: payload.keluarga,
      create: { karyawanId, ...payload.keluarga },
    });
  }
}

export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (handleValidationErrors(req, res)) {
      return;
    }

    const where = buildWhereClause(req);
    const page = parsePositiveInt(req.query.page, 1);
    const limit = parsePositiveInt(req.query.limit, 10);
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.karyawan.findMany({
        where,
        include: listInclude,
        orderBy: { namaLengkap: "asc" },
        skip,
        take: limit,
      }),
      prisma.karyawan.count({ where }),
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
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (handleValidationErrors(req, res)) {
      return;
    }

    const {
      normalizedScalarData,
      normalizedAnak,
      normalizedSaudaraKandung,
      normalizedKontakDarurat,
      normalizedOrangTuaKandung,
      normalizedOrangTuaMertua,
      normalizedKeluarga,
    } = buildCreatePayload(req.body as GenericRecord);

    const data = await prisma.karyawan.create({
      data: {
        ...(normalizedScalarData as Record<string, unknown>),
        anak: normalizedAnak.length ? { create: normalizedAnak } : undefined,
        saudaraKandung: normalizedSaudaraKandung.length ? { create: normalizedSaudaraKandung } : undefined,
        kontakDarurat: normalizedKontakDarurat.length ? { create: normalizedKontakDarurat } : undefined,
        orangTuaKandung: normalizedOrangTuaKandung ? { create: normalizedOrangTuaKandung } : undefined,
        orangTuaMertua: normalizedOrangTuaMertua ? { create: normalizedOrangTuaMertua } : undefined,
        keluarga: normalizedKeluarga ? { create: normalizedKeluarga } : undefined,
      } as any,
      include: detailInclude,
    });

    res.status(201).json({
      success: true,
      data,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      res.status(409).json({
        success: false,
        message: "Nomor induk karyawan sudah terdaftar.",
      });
      return;
    }

    next(error);
  }
}

export async function detail(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (handleValidationErrors(req, res)) {
      return;
    }

    const id = getRequestId(req);
    const data = await loadKaryawanDetail(id);

    if (!data) {
      res.status(404).json({
        success: false,
        message: "Karyawan tidak ditemukan.",
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
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (handleValidationErrors(req, res)) {
      return;
    }

    const id = getRequestId(req);
    const existing = await prisma.karyawan.findUnique({ where: { id } });

    if (!existing) {
      res.status(404).json({
        success: false,
        message: "Karyawan tidak ditemukan.",
      });
      return;
    }

    const {
      normalizedScalarData,
      normalizedAnak,
      normalizedSaudaraKandung,
      normalizedKontakDarurat,
      normalizedOrangTuaKandung,
      normalizedOrangTuaMertua,
      normalizedKeluarga,
    } = buildCreatePayload(req.body as GenericRecord);

    await prisma.$transaction(async (tx) => {
      await tx.karyawan.update({
        where: { id },
        data: normalizedScalarData,
      });

      if (Array.isArray((req.body as GenericRecord).anak)) {
        await tx.karyawanAnak.deleteMany({ where: { karyawanId: id } });
        if (normalizedAnak.length > 0) {
          await tx.karyawanAnak.createMany({
            data: normalizedAnak.map((item) => ({
              ...item,
              karyawanId: id,
            })) as Prisma.KaryawanAnakCreateManyInput[],
          });
        }
      }

      if (Array.isArray((req.body as GenericRecord).saudaraKandung)) {
        await tx.karyawanSaudaraKandung.deleteMany({ where: { karyawanId: id } });
        if (normalizedSaudaraKandung.length > 0) {
          await tx.karyawanSaudaraKandung.createMany({
            data: normalizedSaudaraKandung.map((item) => ({
              ...item,
              karyawanId: id,
            })) as Prisma.KaryawanSaudaraKandungCreateManyInput[],
          });
        }
      }

      if (Array.isArray((req.body as GenericRecord).kontakDarurat)) {
        await tx.karyawanKontakDarurat.deleteMany({ where: { karyawanId: id } });
        if (normalizedKontakDarurat.length > 0) {
          await tx.karyawanKontakDarurat.createMany({
            data: normalizedKontakDarurat.map((item) => ({
              ...item,
              karyawanId: id,
            })) as Prisma.KaryawanKontakDaruratCreateManyInput[],
          });
        }
      }

      if (normalizedOrangTuaKandung) {
        await tx.karyawanOrangTuaKandung.upsert({
          where: { karyawanId: id },
          update: normalizedOrangTuaKandung,
          create: { karyawanId: id, ...normalizedOrangTuaKandung },
        });
      }

      if (normalizedOrangTuaMertua) {
        await tx.karyawanOrangTuaMertua.upsert({
          where: { karyawanId: id },
          update: normalizedOrangTuaMertua,
          create: { karyawanId: id, ...normalizedOrangTuaMertua },
        });
      }

      if (normalizedKeluarga) {
        await tx.karyawanKeluarga.upsert({
          where: { karyawanId: id },
          update: normalizedKeluarga,
          create: { karyawanId: id, ...normalizedKeluarga },
        });
      }
    });

    const data = await loadKaryawanDetail(id);

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      res.status(409).json({
        success: false,
        message: "Nomor induk karyawan sudah terdaftar.",
      });
      return;
    }

    next(error);
  }
}

export async function destroy(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (handleValidationErrors(req, res)) {
      return;
    }

    const id = getRequestId(req);
    const existing = await prisma.karyawan.findUnique({ where: { id } });

    if (!existing) {
      res.status(404).json({
        success: false,
        message: "Karyawan tidak ditemukan.",
      });
      return;
    }

    await prisma.karyawan.delete({ where: { id } });

    res.json({
      success: true,
      message: "Karyawan berhasil dihapus.",
    });
  } catch (error) {
    next(error);
  }
}

export async function uploadFoto(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (handleValidationErrors(req, res)) {
      return;
    }

    if (!req.file) {
      res.status(400).json({
        success: false,
        message: "File foto wajib diunggah.",
      });
      return;
    }

    const id = getRequestId(req);
    const karyawan = await prisma.karyawan.findUnique({ where: { id } });

    if (!karyawan) {
      res.status(404).json({
        success: false,
        message: "Karyawan tidak ditemukan.",
      });
      return;
    }

    if (karyawan.fotoKaryawan) {
      const oldFilePath = path.resolve(process.cwd(), "uploads", karyawan.fotoKaryawan);
      await fs.unlink(oldFilePath).catch(() => undefined);
    }

    const fotoPath = `foto-karyawan/${req.file.filename}`;

    await prisma.karyawan.update({
      where: { id },
      data: { fotoKaryawan: fotoPath },
    });

    res.json({
      success: true,
      data: {
        fotoKaryawan: fotoPath,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function generateQrCode(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (handleValidationErrors(req, res)) {
      return;
    }

    const id = getRequestId(req);
    const karyawan = await prisma.karyawan.findUnique({
      where: { id },
      select: { nomorIndukKaryawan: true },
    });

    if (!karyawan) {
      res.status(404).json({
        success: false,
        message: "Karyawan tidak ditemukan.",
      });
      return;
    }

    await QRCode.toDataURL(karyawan.nomorIndukKaryawan);
    const buffer = await QRCode.toBuffer(karyawan.nomorIndukKaryawan);
    const shouldDownload = String(req.query.download ?? "").toLowerCase() === "true";

    res.setHeader("Content-Type", "image/png");
    if (shouldDownload) {
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="qr-${karyawan.nomorIndukKaryawan}.png"`,
      );
    }
    res.send(buffer);
  } catch (error) {
    next(error);
  }
}

export async function importExcel(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: "File Excel wajib diunggah.",
      });
      return;
    }

    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const worksheet = workbook.Sheets.Masterdata;

    if (!worksheet) {
      res.status(400).json({
        success: false,
        message: 'Sheet "Masterdata" tidak ditemukan.',
      });
      return;
    }

    const rows = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      raw: true,
      defval: null,
    }) as unknown[][];
    const [headerRow, ...dataRows] = rows;

    void headerRow;

    const masterMaps = await preloadMasterMaps();
    const detail: Array<{
      baris: number;
      nik: string;
      nama: string;
      status: "sukses" | "gagal";
      keterangan: string;
    }> = [];

    const meaningfulRows = dataRows.filter((row) => row.some((value) => value !== null && value !== ""));

    for (let index = 0; index < meaningfulRows.length; index += 1) {
      const row = meaningfulRows[index];
      const baris = index + 2;
      const parsed = parseExcelRow(row, baris, masterMaps);
      const nik = parsed.nik ?? "-";
      const nama = parsed.nama ?? "-";

      try {
        for (const field of optionalImportScalarRefFields) {
          if (!(field in parsed.scalarData) || parsed.scalarData[field] === undefined) {
            parsed.scalarData[field] = null;
          }
        }

        let finalManagerNik: string | null = null;
        if (parsed.refs.managerNik) {
          const manager = await prisma.karyawan.findFirst({
            where: {
              nomorIndukKaryawan: parsed.refs.managerNik,
              statusKaryawan: { status: "Aktif" },
              posisiJabatan: {
                namaPosisiJabatan: {
                  contains: "head",
                  mode: "insensitive",
                },
              },
            },
            select: { nomorIndukKaryawan: true },
          });

          if (!manager) {
            parsed.errors.push(
              `Referensi karyawan tidak valid: MANAGER = '${parsed.refs.managerNik}'. Karyawan harus aktif dan memiliki posisi jabatan Head.`,
            );
          } else {
            finalManagerNik = manager.nomorIndukKaryawan;
          }
        }
        parsed.scalarData.managerNik = finalManagerNik;

        let finalAtasanLangsungNik: string | null = null;
        if (parsed.refs.atasanLangsungNik) {
          const atasan = await prisma.karyawan.findFirst({
            where: {
              nomorIndukKaryawan: parsed.refs.atasanLangsungNik,
              statusKaryawan: { status: "Aktif" },
            },
            select: { nomorIndukKaryawan: true },
          });

          if (!atasan) {
            parsed.errors.push(
              `Referensi karyawan tidak ditemukan: ATASAN LANGSUNG = '${parsed.refs.atasanLangsungNik}'`,
            );
          } else {
            finalAtasanLangsungNik = atasan.nomorIndukKaryawan;
          }
        }
        parsed.scalarData.atasanLangsungNik = finalAtasanLangsungNik;

        if (parsed.errors.length > 0) {
          detail.push({
            baris,
            nik,
            nama,
            status: "gagal",
            keterangan: parsed.errors.join("; "),
          });
          continue;
        }

        await prisma.$transaction(async (tx) => {
          const scalarData = normalizeRecordData(parsed.scalarData, {
            dateFields: karyawanDateFields,
            integerFields: karyawanIntegerFields,
          });

          const saved = await tx.karyawan.upsert({
            where: { nomorIndukKaryawan: String(parsed.scalarData.nomorIndukKaryawan) },
            update: scalarData,
            create: scalarData as Prisma.KaryawanCreateInput,
            select: { id: true },
          });

          await replaceKaryawanRelations(tx, saved.id, {
            anak: parsed.anak,
            saudaraKandung: parsed.saudaraKandung,
            kontakDarurat: parsed.kontakDarurat,
            orangTuaKandung: parsed.orangTuaKandung,
            orangTuaMertua: parsed.orangTuaMertua,
            keluarga: parsed.keluarga,
          });
        });

        detail.push({
          baris,
          nik,
          nama,
          status: "sukses",
          keterangan: "Import berhasil.",
        });
      } catch (error) {
        detail.push({
          baris,
          nik,
          nama,
          status: "gagal",
          keterangan: error instanceof Error ? error.message : "Terjadi kesalahan saat import.",
        });
      }
    }

    const sukses = detail.filter((item) => item.status === "sukses").length;
    const gagal = detail.length - sukses;

    res.json({
      success: true,
      laporan: {
        totalBaris: meaningfulRows.length,
        sukses,
        gagal,
        detail,
      },
    });
  } catch (error) {
    next(error);
  }
}
