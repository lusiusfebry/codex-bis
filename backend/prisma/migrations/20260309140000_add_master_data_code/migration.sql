ALTER TABLE "public"."divisi" ADD COLUMN "code" TEXT;
ALTER TABLE "public"."department" ADD COLUMN "code" TEXT;
ALTER TABLE "public"."posisi_jabatan" ADD COLUMN "code" TEXT;
ALTER TABLE "public"."kategori_pangkat" ADD COLUMN "code" TEXT;
ALTER TABLE "public"."golongan" ADD COLUMN "code" TEXT;
ALTER TABLE "public"."sub_golongan" ADD COLUMN "code" TEXT;
ALTER TABLE "public"."jenis_hubungan_kerja" ADD COLUMN "code" TEXT;
ALTER TABLE "public"."tag" ADD COLUMN "code" TEXT;
ALTER TABLE "public"."lokasi_kerja" ADD COLUMN "code" TEXT;
ALTER TABLE "public"."status_karyawan" ADD COLUMN "code" TEXT;

WITH numbered AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY "nama_divisi" ASC) AS seq
  FROM "public"."divisi"
)
UPDATE "public"."divisi" AS target
SET "code" = 'div-' || LPAD(numbered.seq::text, 4, '0')
FROM numbered
WHERE target.id = numbered.id;

WITH numbered AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY "nama_departmen" ASC, "divisi_id" ASC) AS seq
  FROM "public"."department"
)
UPDATE "public"."department" AS target
SET "code" = 'dep-' || LPAD(numbered.seq::text, 4, '0')
FROM numbered
WHERE target.id = numbered.id;

WITH numbered AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY "nama_posisi_jabatan" ASC, "department_id" ASC) AS seq
  FROM "public"."posisi_jabatan"
)
UPDATE "public"."posisi_jabatan" AS target
SET "code" = 'pos-' || LPAD(numbered.seq::text, 4, '0')
FROM numbered
WHERE target.id = numbered.id;

WITH numbered AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY "nama_kategori_pangkat" ASC) AS seq
  FROM "public"."kategori_pangkat"
)
UPDATE "public"."kategori_pangkat" AS target
SET "code" = 'kat-' || LPAD(numbered.seq::text, 4, '0')
FROM numbered
WHERE target.id = numbered.id;

WITH numbered AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY "nama_golongan" ASC) AS seq
  FROM "public"."golongan"
)
UPDATE "public"."golongan" AS target
SET "code" = 'gol-' || LPAD(numbered.seq::text, 4, '0')
FROM numbered
WHERE target.id = numbered.id;

WITH numbered AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY "nama_sub_golongan" ASC) AS seq
  FROM "public"."sub_golongan"
)
UPDATE "public"."sub_golongan" AS target
SET "code" = 'sub-' || LPAD(numbered.seq::text, 4, '0')
FROM numbered
WHERE target.id = numbered.id;

WITH numbered AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY "nama_jenis_hubungan_kerja" ASC) AS seq
  FROM "public"."jenis_hubungan_kerja"
)
UPDATE "public"."jenis_hubungan_kerja" AS target
SET "code" = 'jhk-' || LPAD(numbered.seq::text, 4, '0')
FROM numbered
WHERE target.id = numbered.id;

WITH numbered AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY "nama_tag" ASC) AS seq
  FROM "public"."tag"
)
UPDATE "public"."tag" AS target
SET "code" = 'tag-' || LPAD(numbered.seq::text, 4, '0')
FROM numbered
WHERE target.id = numbered.id;

WITH numbered AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY "nama_lokasi_kerja" ASC) AS seq
  FROM "public"."lokasi_kerja"
)
UPDATE "public"."lokasi_kerja" AS target
SET "code" = 'lok-' || LPAD(numbered.seq::text, 4, '0')
FROM numbered
WHERE target.id = numbered.id;

WITH numbered AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY "nama_status" ASC) AS seq
  FROM "public"."status_karyawan"
)
UPDATE "public"."status_karyawan" AS target
SET "code" = 'stk-' || LPAD(numbered.seq::text, 4, '0')
FROM numbered
WHERE target.id = numbered.id;

ALTER TABLE "public"."divisi" ALTER COLUMN "code" SET NOT NULL;
ALTER TABLE "public"."department" ALTER COLUMN "code" SET NOT NULL;
ALTER TABLE "public"."posisi_jabatan" ALTER COLUMN "code" SET NOT NULL;
ALTER TABLE "public"."kategori_pangkat" ALTER COLUMN "code" SET NOT NULL;
ALTER TABLE "public"."golongan" ALTER COLUMN "code" SET NOT NULL;
ALTER TABLE "public"."sub_golongan" ALTER COLUMN "code" SET NOT NULL;
ALTER TABLE "public"."jenis_hubungan_kerja" ALTER COLUMN "code" SET NOT NULL;
ALTER TABLE "public"."tag" ALTER COLUMN "code" SET NOT NULL;
ALTER TABLE "public"."lokasi_kerja" ALTER COLUMN "code" SET NOT NULL;
ALTER TABLE "public"."status_karyawan" ALTER COLUMN "code" SET NOT NULL;

CREATE UNIQUE INDEX "divisi_code_key" ON "public"."divisi"("code");
CREATE UNIQUE INDEX "department_code_key" ON "public"."department"("code");
CREATE UNIQUE INDEX "posisi_jabatan_code_key" ON "public"."posisi_jabatan"("code");
CREATE UNIQUE INDEX "kategori_pangkat_code_key" ON "public"."kategori_pangkat"("code");
CREATE UNIQUE INDEX "golongan_code_key" ON "public"."golongan"("code");
CREATE UNIQUE INDEX "sub_golongan_code_key" ON "public"."sub_golongan"("code");
CREATE UNIQUE INDEX "jenis_hubungan_kerja_code_key" ON "public"."jenis_hubungan_kerja"("code");
CREATE UNIQUE INDEX "tag_code_key" ON "public"."tag"("code");
CREATE UNIQUE INDEX "lokasi_kerja_code_key" ON "public"."lokasi_kerja"("code");
CREATE UNIQUE INDEX "status_karyawan_code_key" ON "public"."status_karyawan"("code");
