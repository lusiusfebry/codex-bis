import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const activeStatus = "Aktif";

type MasterSeedResult = Awaited<ReturnType<typeof seedMasterData>>;

async function seedMasterData() {
  const divisiEntries = [
    "Operasi Tambang",
    "Geologi & Eksplorasi",
    "Teknik & Infrastruktur",
    "HSSE",
    "Human Resources",
    "Finance & Accounting",
    "Procurement & Logistik",
    "Plant & Equipment",
    "IT & Sistem Informasi",
  ];

  const divisis = await Promise.all(
    divisiEntries.map((namaDivisi) =>
      prisma.divisi.upsert({
        where: { namaDivisi },
        update: { status: activeStatus },
        create: { namaDivisi, status: activeStatus },
      }),
    ),
  );

  const divisiByName = Object.fromEntries(divisis.map((item) => [item.namaDivisi, item]));

  const departmentEntries = [
    ["Mining Operation", "Operasi Tambang"],
    ["Drill & Blast", "Operasi Tambang"],
    ["Geoteknik", "Geologi & Eksplorasi"],
    ["Mine Planning", "Geologi & Eksplorasi"],
    ["Sipil", "Teknik & Infrastruktur"],
    ["Mekanikal", "Plant & Equipment"],
    ["Elektrikal", "Teknik & Infrastruktur"],
    ["Safety", "HSSE"],
    ["HR Admin", "Human Resources"],
    ["Payroll", "Human Resources"],
    ["General Affairs", "Human Resources"],
    ["Finance", "Finance & Accounting"],
    ["Procurement", "Procurement & Logistik"],
    ["IT Support", "IT & Sistem Informasi"],
  ] as const;

  const departments = await Promise.all(
    departmentEntries.map(([namaDepartmen, divisiNama]) =>
      prisma.department.upsert({
        where: {
          namaDepartmen_divisiId: {
            namaDepartmen,
            divisiId: divisiByName[divisiNama].id,
          },
        },
        update: { status: activeStatus },
        create: {
          namaDepartmen,
          divisiId: divisiByName[divisiNama].id,
          status: activeStatus,
        },
      }),
    ),
  );

  const departmentsByName = Object.fromEntries(departments.map((item) => [item.namaDepartmen, item]));

  const posisiEntries = [
    ["Mine Superintendent", "Mining Operation"],
    ["Mine Supervisor", "Mining Operation"],
    ["Mine Foreman", "Mining Operation"],
    ["Geologist", "Geoteknik"],
    ["Mine Engineer", "Mine Planning"],
    ["Safety Officer", "Safety"],
    ["HR Manager", "HR Admin"],
    ["HR Staff", "HR Admin"],
    ["Finance Manager", "Finance"],
    ["Payroll Officer", "Payroll"],
    ["IT Support Specialist", "IT Support"],
  ] as const;

  const posisi = await Promise.all(
    posisiEntries.map(([namaPosisiJabatan, departmentNama]) =>
      prisma.posisiJabatan.upsert({
        where: {
          namaPosisiJabatan_departmentId: {
            namaPosisiJabatan,
            departmentId: departmentsByName[departmentNama].id,
          },
        },
        update: { status: activeStatus },
        create: {
          namaPosisiJabatan,
          departmentId: departmentsByName[departmentNama].id,
          status: activeStatus,
        },
      }),
    ),
  );

  const kategoriPangkat = await Promise.all(
    ["Staff", "Supervisor", "Superintendent", "Manager", "General Manager", "Direktur"].map(
      (namaKategoriPangkat) =>
        prisma.kategoriPangkat.upsert({
          where: { namaKategoriPangkat },
          update: { status: activeStatus },
          create: { namaKategoriPangkat, status: activeStatus },
        }),
    ),
  );

  const golongan = await Promise.all(
    ["I", "II", "III", "IV", "V"].map((namaGolongan) =>
      prisma.golongan.upsert({
        where: { namaGolongan },
        update: { status: activeStatus },
        create: { namaGolongan, status: activeStatus },
      }),
    ),
  );

  const subGolongan = await Promise.all(
    ["A", "B", "C", "D"].map((namaSubGolongan) =>
      prisma.subGolongan.upsert({
        where: { namaSubGolongan },
        update: { status: activeStatus },
        create: { namaSubGolongan, status: activeStatus },
      }),
    ),
  );

  const jenisHubunganKerja = await Promise.all(
    ["PKWT", "PKWTT", "Kontrak Harian Lepas", "Outsourcing"].map((namaJenisHubunganKerja) =>
      prisma.jenisHubunganKerja.upsert({
        where: { namaJenisHubunganKerja },
        update: { status: activeStatus },
        create: { namaJenisHubunganKerja, status: activeStatus },
      }),
    ),
  );

  const tags = await Promise.all(
    [
      ["Karyawan Tetap", "#22c55e"],
      ["PKWT", "#f59e0b"],
      ["Probation", "#3b82f6"],
      ["Key Person", "#8b5cf6"],
      ["Warning", "#ef4444"],
    ].map(([namaTag, warnaTag]) =>
      prisma.tag.upsert({
        where: { namaTag },
        update: { warnaTag, status: activeStatus },
        create: { namaTag, warnaTag, status: activeStatus },
      }),
    ),
  );

  const lokasiKerja = await Promise.all(
    [
      "Site Taliabu",
      "Head Office Jakarta",
      "Pit North",
      "Pit South",
      "ROM Pad",
      "Workshop",
      "Pelabuhan",
    ].map((namaLokasiKerja) =>
      prisma.lokasiKerja.upsert({
        where: { namaLokasiKerja },
        update: { status: activeStatus },
        create: { namaLokasiKerja, status: activeStatus },
      }),
    ),
  );

  const statusKaryawan = await Promise.all(
    ["Aktif", "Cuti Panjang", "Suspend", "Resign", "Pensiun", "PHK"].map((namaStatus) =>
      prisma.statusKaryawan.upsert({
        where: { namaStatus },
        update: { status: activeStatus },
        create: { namaStatus, status: activeStatus },
      }),
    ),
  );

  return {
    divisiByName,
    departmentsByName,
    posisiByName: Object.fromEntries(posisi.map((item) => [item.namaPosisiJabatan, item])),
    kategoriPangkatByName: Object.fromEntries(
      kategoriPangkat.map((item) => [item.namaKategoriPangkat, item]),
    ),
    golonganByName: Object.fromEntries(golongan.map((item) => [item.namaGolongan, item])),
    subGolonganByName: Object.fromEntries(subGolongan.map((item) => [item.namaSubGolongan, item])),
    jenisHubunganKerjaByName: Object.fromEntries(
      jenisHubunganKerja.map((item) => [item.namaJenisHubunganKerja, item]),
    ),
    tagByName: Object.fromEntries(tags.map((item) => [item.namaTag, item])),
    lokasiByName: Object.fromEntries(lokasiKerja.map((item) => [item.namaLokasiKerja, item])),
    statusKaryawanByName: Object.fromEntries(statusKaryawan.map((item) => [item.namaStatus, item])),
  };
}

async function seedUsers() {
  const password = await bcrypt.hash("Admin@123", 10);

  await prisma.user.upsert({
    where: { nik: "01-00001" },
    update: {
      nama: "Administrator Sistem",
      password,
      role: "admin",
      isActive: true,
    },
    create: {
      nik: "01-00001",
      nama: "Administrator Sistem",
      password,
      role: "admin",
      isActive: true,
    },
  });
}

async function seedKaryawan(master: MasterSeedResult) {
  const active = master.statusKaryawanByName["Aktif"];

  const mineSuperintendent = await prisma.karyawan.upsert({
    where: { nomorIndukKaryawan: "01-00002" },
    update: {
      namaLengkap: "Rizal Pratama",
      nomorHandphone: "081234567802",
    },
    create: {
      nomorIndukKaryawan: "01-00002",
      namaLengkap: "Rizal Pratama",
      divisiId: master.divisiByName["Operasi Tambang"].id,
      departmentId: master.departmentsByName["Mining Operation"].id,
      posisiJabatanId: master.posisiByName["Mine Superintendent"].id,
      emailPerusahaan: "rizal.pratama@psg.co.id",
      nomorHandphone: "081234567802",
      statusKaryawanId: active.id,
      lokasiKerjaId: master.lokasiByName["Site Taliabu"].id,
      tagId: master.tagByName["Key Person"].id,
      jenisKelamin: "Laki-laki",
      tempatLahir: "Ternate",
      tanggalLahir: new Date("1986-04-12"),
      emailPribadi: "rizal.pratama@gmail.com",
      agama: "Islam",
      golonganDarah: "O",
      nomorKartuKeluarga: "8201011204860001",
      nomorKtp: "8201011204860001",
      nomorNpwp: "12.345.678.9-012.000",
      nomorBpjs: "0001234567890",
      noNikKk: "8201011204860001",
      statusPajak: "K/2",
      alamatDomisili: "Kompleks Site Camp Blok A1",
      kotaDomisili: "Taliabu Barat",
      provinsiDomisili: "Maluku Utara",
      alamatKtp: "Jl. Ahmad Yani No. 10",
      kotaKtp: "Ternate",
      provinsiKtp: "Maluku Utara",
      nomorHandphone2: "081234567899",
      nomorTeleponRumah1: "0921312345",
      statusPernikahan: "Menikah",
      namaPasangan: "Siti Rahma",
      tanggalMenikah: new Date("2012-06-17"),
      pekerjaanPasangan: "Guru",
      jumlahAnak: 2,
      nomorRekening: "1234567890",
      namaPemegangRekening: "Rizal Pratama",
      namaBank: "Bank Mandiri",
      cabangBank: "Ternate",
      jenisHubunganKerjaId: master.jenisHubunganKerjaByName["PKWTT"].id,
      tanggalMasukGroup: new Date("2015-01-05"),
      tanggalMasuk: new Date("2015-01-05"),
      tanggalPermanent: new Date("2016-01-05"),
      tingkatPendidikan: "S1",
      bidangStudi: "Teknik Pertambangan",
      namaSekolah: "Universitas Hasanuddin",
      kotaSekolah: "Makassar",
      statusKelulusan: "Lulus",
      kategoriPangkatId: master.kategoriPangkatByName["Superintendent"].id,
      golonganId: master.golonganByName["IV"].id,
      subGolonganId: master.subGolonganByName["B"].id,
      noDanaPensiun: "DP-010002",
      pointOfOriginal: "Ternate",
      pointOfHire: "Site Taliabu",
      ukuranSeragamKerja: "XL",
      ukuranSepatuKerja: "43",
      siklusPembayaranGaji: "Bulanan",
      costing: "OPS-MINING",
      assign: "Pit North",
      actual: "Pit North",
      anakKe: 1,
      jumlahSaudaraKandung: 3,
    },
  });

  await prisma.karyawanOrangTuaKandung.upsert({
    where: { karyawanId: mineSuperintendent.id },
    update: {
      namaAyahKandung: "Haris Pratama",
      pekerjaanAyahKandung: "Pensiunan PNS",
      namaIbuKandung: "Nur Aisyah",
      pekerjaanIbuKandung: "Ibu Rumah Tangga",
    },
    create: {
      karyawanId: mineSuperintendent.id,
      namaAyahKandung: "Haris Pratama",
      tanggalLahirAyahKandung: new Date("1958-08-20"),
      pendidikanTerakhirAyahKandung: "SMA",
      pekerjaanAyahKandung: "Pensiunan PNS",
      keteranganAyahKandung: "Domisili Ternate",
      namaIbuKandung: "Nur Aisyah",
      tanggalLahirIbuKandung: new Date("1962-01-11"),
      pendidikanTerakhirIbuKandung: "SMA",
      pekerjaanIbuKandung: "Ibu Rumah Tangga",
      keteranganIbuKandung: "Domisili Ternate",
    },
  });

  await prisma.karyawanKontakDarurat.createMany({
    data: [
      {
        karyawanId: mineSuperintendent.id,
        urutan: 1,
        nama: "Siti Rahma",
        nomorTelepon: "081234560001",
        hubungan: "Istri",
        alamat: "Kompleks Site Camp Blok A1",
      },
      {
        karyawanId: mineSuperintendent.id,
        urutan: 2,
        nama: "Haris Pratama",
        nomorTelepon: "081234560002",
        hubungan: "Ayah",
        alamat: "Jl. Ahmad Yani No. 10, Ternate",
      },
    ],
    skipDuplicates: true,
  });

  const hrManager = await prisma.karyawan.upsert({
    where: { nomorIndukKaryawan: "02-00001" },
    update: {
      namaLengkap: "Dewi Lestari",
      nomorHandphone: "081234567803",
    },
    create: {
      nomorIndukKaryawan: "02-00001",
      namaLengkap: "Dewi Lestari",
      divisiId: master.divisiByName["Human Resources"].id,
      departmentId: master.departmentsByName["HR Admin"].id,
      posisiJabatanId: master.posisiByName["HR Manager"].id,
      emailPerusahaan: "dewi.lestari@psg.co.id",
      nomorHandphone: "081234567803",
      statusKaryawanId: active.id,
      lokasiKerjaId: master.lokasiByName["Head Office Jakarta"].id,
      tagId: master.tagByName["Karyawan Tetap"].id,
      jenisKelamin: "Perempuan",
      tempatLahir: "Jakarta",
      tanggalLahir: new Date("1989-09-23"),
      emailPribadi: "dewi.lestari@gmail.com",
      agama: "Kristen",
      golonganDarah: "A",
      nomorKartuKeluarga: "3174012309890002",
      nomorKtp: "3174012309890002",
      nomorNpwp: "98.765.432.1-111.000",
      nomorBpjs: "0009876543210",
      noNikKk: "3174012309890002",
      statusPajak: "K/1",
      alamatDomisili: "Jl. Cempaka Putih Tengah No. 21",
      kotaDomisili: "Jakarta Pusat",
      provinsiDomisili: "DKI Jakarta",
      alamatKtp: "Jl. Cempaka Putih Tengah No. 21",
      kotaKtp: "Jakarta Pusat",
      provinsiKtp: "DKI Jakarta",
      statusPernikahan: "Menikah",
      namaPasangan: "Andi Saputra",
      tanggalMenikah: new Date("2016-11-05"),
      pekerjaanPasangan: "Konsultan",
      jumlahAnak: 1,
      nomorRekening: "9876543210",
      namaPemegangRekening: "Dewi Lestari",
      namaBank: "BCA",
      cabangBank: "Cempaka Putih",
      jenisHubunganKerjaId: master.jenisHubunganKerjaByName["PKWTT"].id,
      tanggalMasukGroup: new Date("2018-03-12"),
      tanggalMasuk: new Date("2018-03-12"),
      tanggalPermanent: new Date("2019-03-12"),
      tingkatPendidikan: "S2",
      bidangStudi: "Manajemen SDM",
      namaSekolah: "Universitas Indonesia",
      kotaSekolah: "Depok",
      statusKelulusan: "Lulus",
      kategoriPangkatId: master.kategoriPangkatByName["Manager"].id,
      golonganId: master.golonganByName["V"].id,
      subGolonganId: master.subGolonganByName["A"].id,
      noDanaPensiun: "DP-020001",
      pointOfOriginal: "Jakarta",
      pointOfHire: "Head Office Jakarta",
      ukuranSeragamKerja: "M",
      ukuranSepatuKerja: "38",
      siklusPembayaranGaji: "Bulanan",
      costing: "HR-CORP",
      assign: "Head Office",
      actual: "Head Office",
      anakKe: 2,
      jumlahSaudaraKandung: 4,
    },
  });

  await prisma.karyawanKeluarga.upsert({
    where: { karyawanId: hrManager.id },
    update: {
      pendidikanTerakhirPasangan: "S1",
      keteranganPasangan: "Domisili Jakarta",
    },
    create: {
      karyawanId: hrManager.id,
      tanggalLahirPasangan: new Date("1987-02-14"),
      pendidikanTerakhirPasangan: "S1",
      keteranganPasangan: "Domisili Jakarta",
    },
  });

  await prisma.karyawanAnak.createMany({
    data: [
      {
        karyawanId: hrManager.id,
        urutan: 1,
        namaAnak: "Rania Saputra",
        jenisKelaminAnak: "Perempuan",
        tanggalLahirAnak: new Date("2018-05-03"),
        keteranganAnak: "Sekolah TK",
      },
    ],
    skipDuplicates: true,
  });

  const safetyOfficer = await prisma.karyawan.upsert({
    where: { nomorIndukKaryawan: "03-00001" },
    update: {
      namaLengkap: "Fajar Hidayat",
      nomorHandphone: "081234567804",
    },
    create: {
      nomorIndukKaryawan: "03-00001",
      namaLengkap: "Fajar Hidayat",
      divisiId: master.divisiByName["HSSE"].id,
      departmentId: master.departmentsByName["Safety"].id,
      posisiJabatanId: master.posisiByName["Safety Officer"].id,
      emailPerusahaan: "fajar.hidayat@psg.co.id",
      nomorHandphone: "081234567804",
      statusKaryawanId: active.id,
      lokasiKerjaId: master.lokasiByName["Site Taliabu"].id,
      tagId: master.tagByName["PKWT"].id,
      jenisKelamin: "Laki-laki",
      tempatLahir: "Ambon",
      tanggalLahir: new Date("1993-01-08"),
      emailPribadi: "fajar.hidayat@gmail.com",
      agama: "Islam",
      golonganDarah: "B",
      nomorKartuKeluarga: "8171010801930003",
      nomorKtp: "8171010801930003",
      nomorNpwp: "77.123.456.3-555.000",
      statusPajak: "TK/0",
      alamatDomisili: "Mess HSSE Site Taliabu",
      kotaDomisili: "Taliabu Barat",
      provinsiDomisili: "Maluku Utara",
      alamatKtp: "Jl. Sultan Babullah No. 7",
      kotaKtp: "Ambon",
      provinsiKtp: "Maluku",
      statusPernikahan: "Belum Menikah",
      jenisHubunganKerjaId: master.jenisHubunganKerjaByName["PKWT"].id,
      tanggalMasukGroup: new Date("2022-07-01"),
      tanggalMasuk: new Date("2022-07-01"),
      tanggalKontrak: new Date("2024-07-01"),
      tanggalAkhirKontrak: new Date("2026-06-30"),
      tingkatPendidikan: "S1",
      bidangStudi: "Kesehatan dan Keselamatan Kerja",
      namaSekolah: "Universitas Pattimura",
      kotaSekolah: "Ambon",
      statusKelulusan: "Lulus",
      kategoriPangkatId: master.kategoriPangkatByName["Staff"].id,
      golonganId: master.golonganByName["III"].id,
      subGolonganId: master.subGolonganByName["C"].id,
      pointOfOriginal: "Ambon",
      pointOfHire: "Site Taliabu",
      ukuranSeragamKerja: "L",
      ukuranSepatuKerja: "42",
      lokasiSebelumnyaId: master.lokasiByName["Head Office Jakarta"].id,
      tanggalMutasi: new Date("2023-01-15"),
      siklusPembayaranGaji: "Bulanan",
      costing: "HSSE-SITE",
      assign: "Pit South",
      actual: "Pit South",
      anakKe: 3,
      jumlahSaudaraKandung: 5,
    },
  });

  await prisma.karyawanSaudaraKandung.createMany({
    data: [
      {
        karyawanId: safetyOfficer.id,
        urutan: 1,
        nama: "Nur Hidayat",
        jenisKelamin: "Laki-laki",
        tanggalLahir: new Date("1988-02-11"),
        pendidikanTerakhir: "S1",
        pekerjaan: "Guru",
        keterangan: "Domisili Ambon",
      },
      {
        karyawanId: safetyOfficer.id,
        urutan: 2,
        nama: "Rina Hidayat",
        jenisKelamin: "Perempuan",
        tanggalLahir: new Date("1990-07-21"),
        pendidikanTerakhir: "D3",
        pekerjaan: "Perawat",
        keterangan: "Domisili Ambon",
      },
    ],
    skipDuplicates: true,
  });
}

async function main() {
  const master = await seedMasterData();
  await seedUsers();
  await seedKaryawan(master);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Seed gagal dijalankan:", error);
    await prisma.$disconnect();
    process.exit(1);
  });
