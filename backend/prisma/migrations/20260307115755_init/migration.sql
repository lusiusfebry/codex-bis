-- CreateTable
CREATE TABLE "public"."divisi" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nama_divisi" TEXT NOT NULL,
    "keterangan" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Aktif',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "divisi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."department" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nama_departmen" TEXT NOT NULL,
    "divisi_id" UUID NOT NULL,
    "manager_nik" TEXT,
    "keterangan" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Aktif',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."posisi_jabatan" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nama_posisi_jabatan" TEXT NOT NULL,
    "department_id" UUID NOT NULL,
    "keterangan" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Aktif',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "posisi_jabatan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."kategori_pangkat" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nama_kategori_pangkat" TEXT NOT NULL,
    "keterangan" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Aktif',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kategori_pangkat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."golongan" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nama_golongan" TEXT NOT NULL,
    "keterangan" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Aktif',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "golongan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sub_golongan" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nama_sub_golongan" TEXT NOT NULL,
    "keterangan" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Aktif',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sub_golongan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."jenis_hubungan_kerja" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nama_jenis_hubungan_kerja" TEXT NOT NULL,
    "keterangan" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Aktif',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jenis_hubungan_kerja_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tag" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nama_tag" TEXT NOT NULL,
    "warna_tag" TEXT NOT NULL,
    "keterangan" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Aktif',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."lokasi_kerja" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nama_lokasi_kerja" TEXT NOT NULL,
    "alamat" TEXT,
    "keterangan" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Aktif',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lokasi_kerja_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."status_karyawan" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nama_status" TEXT NOT NULL,
    "keterangan" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Aktif',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "status_karyawan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nik" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "foto_url" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."karyawan" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nomor_induk_karyawan" TEXT NOT NULL,
    "nama_lengkap" TEXT NOT NULL,
    "foto_karyawan" TEXT,
    "divisi_id" UUID NOT NULL,
    "department_id" UUID NOT NULL,
    "manager_nik" TEXT,
    "atasan_langsung_nik" TEXT,
    "posisi_jabatan_id" UUID NOT NULL,
    "email_perusahaan" TEXT,
    "nomor_handphone" TEXT,
    "status_karyawan_id" UUID NOT NULL,
    "lokasi_kerja_id" UUID NOT NULL,
    "tag_id" UUID,
    "jenis_kelamin" TEXT,
    "tempat_lahir" TEXT,
    "tanggal_lahir" DATE,
    "email_pribadi" TEXT,
    "agama" TEXT,
    "golongan_darah" TEXT,
    "nomor_kartu_keluarga" TEXT,
    "nomor_ktp" TEXT,
    "nomor_npwp" TEXT,
    "nomor_bpjs" TEXT,
    "no_nik_kk" TEXT,
    "status_pajak" TEXT,
    "alamat_domisili" TEXT,
    "kota_domisili" TEXT,
    "provinsi_domisili" TEXT,
    "alamat_ktp" TEXT,
    "kota_ktp" TEXT,
    "provinsi_ktp" TEXT,
    "nomor_handphone_2" TEXT,
    "nomor_telepon_rumah_1" TEXT,
    "nomor_telepon_rumah_2" TEXT,
    "status_pernikahan" TEXT,
    "nama_pasangan" TEXT,
    "tanggal_menikah" DATE,
    "tanggal_cerai" DATE,
    "tanggal_wafat_pasangan" DATE,
    "pekerjaan_pasangan" TEXT,
    "jumlah_anak" INTEGER,
    "nomor_rekening" TEXT,
    "nama_pemegang_rekening" TEXT,
    "nama_bank" TEXT,
    "cabang_bank" TEXT,
    "jenis_hubungan_kerja_id" UUID,
    "tanggal_masuk_group" DATE,
    "tanggal_masuk" DATE,
    "tanggal_permanent" DATE,
    "tanggal_kontrak" DATE,
    "tanggal_akhir_kontrak" DATE,
    "tanggal_berhenti" DATE,
    "tingkat_pendidikan" TEXT,
    "bidang_studi" TEXT,
    "nama_sekolah" TEXT,
    "kota_sekolah" TEXT,
    "status_kelulusan" TEXT,
    "keterangan_pendidikan" TEXT,
    "kategori_pangkat_id" UUID,
    "golongan_id" UUID,
    "sub_golongan_id" UUID,
    "no_dana_pensiun" TEXT,
    "point_of_original" TEXT,
    "point_of_hire" TEXT,
    "ukuran_seragam_kerja" TEXT,
    "ukuran_sepatu_kerja" TEXT,
    "lokasi_sebelumnya_id" UUID,
    "tanggal_mutasi" DATE,
    "siklus_pembayaran_gaji" TEXT,
    "costing" TEXT,
    "assign" TEXT,
    "actual" TEXT,
    "anak_ke" INTEGER,
    "jumlah_saudara_kandung" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "karyawan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."karyawan_anak" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "karyawan_id" UUID NOT NULL,
    "urutan" INTEGER NOT NULL,
    "nama_anak" TEXT,
    "jenis_kelamin_anak" TEXT,
    "tanggal_lahir_anak" DATE,
    "keterangan_anak" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "karyawan_anak_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."karyawan_saudara_kandung" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "karyawan_id" UUID NOT NULL,
    "urutan" INTEGER NOT NULL,
    "nama" TEXT,
    "jenis_kelamin" TEXT,
    "tanggal_lahir" DATE,
    "pendidikan_terakhir" TEXT,
    "pekerjaan" TEXT,
    "keterangan" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "karyawan_saudara_kandung_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."karyawan_orang_tua_kandung" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "karyawan_id" UUID NOT NULL,
    "nama_ayah_kandung" TEXT,
    "tanggal_lahir_ayah_kandung" DATE,
    "pendidikan_terakhir_ayah_kandung" TEXT,
    "pekerjaan_ayah_kandung" TEXT,
    "keterangan_ayah_kandung" TEXT,
    "nama_ibu_kandung" TEXT,
    "tanggal_lahir_ibu_kandung" DATE,
    "pendidikan_terakhir_ibu_kandung" TEXT,
    "pekerjaan_ibu_kandung" TEXT,
    "keterangan_ibu_kandung" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "karyawan_orang_tua_kandung_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."karyawan_orang_tua_mertua" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "karyawan_id" UUID NOT NULL,
    "nama_ayah_mertua" TEXT,
    "tanggal_lahir_ayah_mertua" DATE,
    "pendidikan_terakhir_ayah_mertua" TEXT,
    "pekerjaan_ayah_mertua" TEXT,
    "keterangan_ayah_mertua" TEXT,
    "nama_ibu_mertua" TEXT,
    "tanggal_lahir_ibu_mertua" DATE,
    "pendidikan_terakhir_ibu_mertua" TEXT,
    "pekerjaan_ibu_mertua" TEXT,
    "keterangan_ibu_mertua" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "karyawan_orang_tua_mertua_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."karyawan_kontak_darurat" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "karyawan_id" UUID NOT NULL,
    "urutan" INTEGER NOT NULL,
    "nama" TEXT,
    "nomor_telepon" TEXT,
    "hubungan" TEXT,
    "alamat" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "karyawan_kontak_darurat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."karyawan_keluarga" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "karyawan_id" UUID NOT NULL,
    "tanggal_lahir_pasangan" DATE,
    "pendidikan_terakhir_pasangan" TEXT,
    "keterangan_pasangan" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "karyawan_keluarga_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "divisi_nama_divisi_key" ON "public"."divisi"("nama_divisi");

-- CreateIndex
CREATE UNIQUE INDEX "department_nama_departmen_divisi_id_key" ON "public"."department"("nama_departmen", "divisi_id");

-- CreateIndex
CREATE UNIQUE INDEX "posisi_jabatan_nama_posisi_jabatan_department_id_key" ON "public"."posisi_jabatan"("nama_posisi_jabatan", "department_id");

-- CreateIndex
CREATE UNIQUE INDEX "kategori_pangkat_nama_kategori_pangkat_key" ON "public"."kategori_pangkat"("nama_kategori_pangkat");

-- CreateIndex
CREATE UNIQUE INDEX "golongan_nama_golongan_key" ON "public"."golongan"("nama_golongan");

-- CreateIndex
CREATE UNIQUE INDEX "sub_golongan_nama_sub_golongan_key" ON "public"."sub_golongan"("nama_sub_golongan");

-- CreateIndex
CREATE UNIQUE INDEX "jenis_hubungan_kerja_nama_jenis_hubungan_kerja_key" ON "public"."jenis_hubungan_kerja"("nama_jenis_hubungan_kerja");

-- CreateIndex
CREATE UNIQUE INDEX "tag_nama_tag_key" ON "public"."tag"("nama_tag");

-- CreateIndex
CREATE UNIQUE INDEX "lokasi_kerja_nama_lokasi_kerja_key" ON "public"."lokasi_kerja"("nama_lokasi_kerja");

-- CreateIndex
CREATE UNIQUE INDEX "status_karyawan_nama_status_key" ON "public"."status_karyawan"("nama_status");

-- CreateIndex
CREATE UNIQUE INDEX "users_nik_key" ON "public"."users"("nik");

-- CreateIndex
CREATE UNIQUE INDEX "karyawan_nomor_induk_karyawan_key" ON "public"."karyawan"("nomor_induk_karyawan");

-- CreateIndex
CREATE UNIQUE INDEX "karyawan_anak_karyawan_id_urutan_key" ON "public"."karyawan_anak"("karyawan_id", "urutan");

-- CreateIndex
CREATE UNIQUE INDEX "karyawan_saudara_kandung_karyawan_id_urutan_key" ON "public"."karyawan_saudara_kandung"("karyawan_id", "urutan");

-- CreateIndex
CREATE UNIQUE INDEX "karyawan_orang_tua_kandung_karyawan_id_key" ON "public"."karyawan_orang_tua_kandung"("karyawan_id");

-- CreateIndex
CREATE UNIQUE INDEX "karyawan_orang_tua_mertua_karyawan_id_key" ON "public"."karyawan_orang_tua_mertua"("karyawan_id");

-- CreateIndex
CREATE UNIQUE INDEX "karyawan_kontak_darurat_karyawan_id_urutan_key" ON "public"."karyawan_kontak_darurat"("karyawan_id", "urutan");

-- CreateIndex
CREATE UNIQUE INDEX "karyawan_keluarga_karyawan_id_key" ON "public"."karyawan_keluarga"("karyawan_id");

-- AddForeignKey
ALTER TABLE "public"."department" ADD CONSTRAINT "department_divisi_id_fkey" FOREIGN KEY ("divisi_id") REFERENCES "public"."divisi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."posisi_jabatan" ADD CONSTRAINT "posisi_jabatan_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "public"."department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."karyawan" ADD CONSTRAINT "karyawan_divisi_id_fkey" FOREIGN KEY ("divisi_id") REFERENCES "public"."divisi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."karyawan" ADD CONSTRAINT "karyawan_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "public"."department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."karyawan" ADD CONSTRAINT "karyawan_posisi_jabatan_id_fkey" FOREIGN KEY ("posisi_jabatan_id") REFERENCES "public"."posisi_jabatan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."karyawan" ADD CONSTRAINT "karyawan_status_karyawan_id_fkey" FOREIGN KEY ("status_karyawan_id") REFERENCES "public"."status_karyawan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."karyawan" ADD CONSTRAINT "karyawan_lokasi_kerja_id_fkey" FOREIGN KEY ("lokasi_kerja_id") REFERENCES "public"."lokasi_kerja"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."karyawan" ADD CONSTRAINT "karyawan_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "public"."tag"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."karyawan" ADD CONSTRAINT "karyawan_jenis_hubungan_kerja_id_fkey" FOREIGN KEY ("jenis_hubungan_kerja_id") REFERENCES "public"."jenis_hubungan_kerja"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."karyawan" ADD CONSTRAINT "karyawan_kategori_pangkat_id_fkey" FOREIGN KEY ("kategori_pangkat_id") REFERENCES "public"."kategori_pangkat"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."karyawan" ADD CONSTRAINT "karyawan_golongan_id_fkey" FOREIGN KEY ("golongan_id") REFERENCES "public"."golongan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."karyawan" ADD CONSTRAINT "karyawan_sub_golongan_id_fkey" FOREIGN KEY ("sub_golongan_id") REFERENCES "public"."sub_golongan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."karyawan" ADD CONSTRAINT "karyawan_lokasi_sebelumnya_id_fkey" FOREIGN KEY ("lokasi_sebelumnya_id") REFERENCES "public"."lokasi_kerja"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."karyawan_anak" ADD CONSTRAINT "karyawan_anak_karyawan_id_fkey" FOREIGN KEY ("karyawan_id") REFERENCES "public"."karyawan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."karyawan_saudara_kandung" ADD CONSTRAINT "karyawan_saudara_kandung_karyawan_id_fkey" FOREIGN KEY ("karyawan_id") REFERENCES "public"."karyawan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."karyawan_orang_tua_kandung" ADD CONSTRAINT "karyawan_orang_tua_kandung_karyawan_id_fkey" FOREIGN KEY ("karyawan_id") REFERENCES "public"."karyawan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."karyawan_orang_tua_mertua" ADD CONSTRAINT "karyawan_orang_tua_mertua_karyawan_id_fkey" FOREIGN KEY ("karyawan_id") REFERENCES "public"."karyawan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."karyawan_kontak_darurat" ADD CONSTRAINT "karyawan_kontak_darurat_karyawan_id_fkey" FOREIGN KEY ("karyawan_id") REFERENCES "public"."karyawan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."karyawan_keluarga" ADD CONSTRAINT "karyawan_keluarga_karyawan_id_fkey" FOREIGN KEY ("karyawan_id") REFERENCES "public"."karyawan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
