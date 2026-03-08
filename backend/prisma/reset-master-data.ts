import { PrismaClient } from "@prisma/client";

import { main as seedAll } from "./seed";

const prisma = new PrismaClient();

async function resetMasterData() {
  await prisma.$transaction(async (tx) => {
    await tx.karyawanKontakDarurat.deleteMany();
    await tx.karyawanAnak.deleteMany();
    await tx.karyawanSaudaraKandung.deleteMany();
    await tx.karyawanOrangTuaMertua.deleteMany();
    await tx.karyawanOrangTuaKandung.deleteMany();
    await tx.karyawanKeluarga.deleteMany();
    await tx.karyawan.deleteMany();

    await tx.posisiJabatan.deleteMany();
    await tx.department.deleteMany();
    await tx.divisi.deleteMany();
    await tx.kategoriPangkat.deleteMany();
    await tx.golongan.deleteMany();
    await tx.subGolongan.deleteMany();
    await tx.jenisHubunganKerja.deleteMany();
    await tx.tag.deleteMany();
    await tx.lokasiKerja.deleteMany();
    await tx.statusKaryawan.deleteMany();
  });
}

async function main() {
  console.log("Menghapus master data dan data HR terkait...");
  await resetMasterData();

  console.log("Menjalankan seed ulang...");
  await seedAll();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Reset master data gagal:", error);
    await prisma.$disconnect();
    process.exit(1);
  });
