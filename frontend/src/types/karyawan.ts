export type KaryawanReference = {
  id: string;
  namaLengkap?: string;
  nomorIndukKaryawan?: string;
};

export type KaryawanAnak = {
  id?: string;
  urutan: number;
  namaAnak?: string | null;
  jenisKelaminAnak?: string | null;
  tanggalLahirAnak?: string | null;
  keteranganAnak?: string | null;
};

export type KaryawanSaudaraKandung = {
  id?: string;
  urutan: number;
  nama?: string | null;
  jenisKelamin?: string | null;
  tanggalLahir?: string | null;
  pendidikanTerakhir?: string | null;
  pekerjaan?: string | null;
  keterangan?: string | null;
};

export type KaryawanKontakDarurat = {
  id?: string;
  urutan: number;
  nama?: string | null;
  nomorTelepon?: string | null;
  hubungan?: string | null;
  alamat?: string | null;
};

export type KaryawanOrangTuaKandung = {
  id?: string;
  karyawanId?: string;
  namaAyahKandung?: string | null;
  tanggalLahirAyahKandung?: string | null;
  pendidikanTerakhirAyahKandung?: string | null;
  pekerjaanAyahKandung?: string | null;
  keteranganAyahKandung?: string | null;
  namaIbuKandung?: string | null;
  tanggalLahirIbuKandung?: string | null;
  pendidikanTerakhirIbuKandung?: string | null;
  pekerjaanIbuKandung?: string | null;
  keteranganIbuKandung?: string | null;
};

export type KaryawanOrangTuaMertua = {
  id?: string;
  karyawanId?: string;
  namaAyahMertua?: string | null;
  tanggalLahirAyahMertua?: string | null;
  pendidikanTerakhirAyahMertua?: string | null;
  pekerjaanAyahMertua?: string | null;
  keteranganAyahMertua?: string | null;
  namaIbuMertua?: string | null;
  tanggalLahirIbuMertua?: string | null;
  pendidikanTerakhirIbuMertua?: string | null;
  pekerjaanIbuMertua?: string | null;
  keteranganIbuMertua?: string | null;
};

export type KaryawanKeluarga = {
  id?: string;
  karyawanId?: string;
  tanggalLahirPasangan?: string | null;
  pendidikanTerakhirPasangan?: string | null;
  keteranganPasangan?: string | null;
};

export interface Karyawan {
  id: string;
  nomorIndukKaryawan: string;
  namaLengkap: string;
  fotoKaryawan?: string | null;
  divisiId: string;
  departmentId: string;
  managerNik?: string | null;
  atasanLangsungNik?: string | null;
  posisiJabatanId: string;
  emailPerusahaan?: string | null;
  nomorHandphone?: string | null;
  statusKaryawanId: string;
  lokasiKerjaId: string;
  tagIds?: string[];
  tagId?: string | null;
  jenisKelamin?: string | null;
  tempatLahir?: string | null;
  tanggalLahir?: string | null;
  emailPribadi?: string | null;
  agama?: string | null;
  golonganDarah?: string | null;
  nomorKartuKeluarga?: string | null;
  nomorKtp?: string | null;
  nomorNpwp?: string | null;
  nomorBpjs?: string | null;
  noNikKk?: string | null;
  statusPajak?: string | null;
  alamatDomisili?: string | null;
  kotaDomisili?: string | null;
  provinsiDomisili?: string | null;
  alamatKtp?: string | null;
  kotaKtp?: string | null;
  provinsiKtp?: string | null;
  nomorHandphone2?: string | null;
  nomorTeleponRumah1?: string | null;
  nomorTeleponRumah2?: string | null;
  statusPernikahan?: string | null;
  namaPasangan?: string | null;
  tanggalMenikah?: string | null;
  tanggalCerai?: string | null;
  tanggalWafatPasangan?: string | null;
  pekerjaanPasangan?: string | null;
  jumlahAnak?: number | null;
  nomorRekening?: string | null;
  namaPemegangRekening?: string | null;
  namaBank?: string | null;
  cabangBank?: string | null;
  jenisHubunganKerjaId?: string | null;
  tanggalMasukGroup?: string | null;
  tanggalMasuk?: string | null;
  tanggalPermanent?: string | null;
  tanggalKontrak?: string | null;
  tanggalAkhirKontrak?: string | null;
  tanggalBerhenti?: string | null;
  tingkatPendidikan?: string | null;
  bidangStudi?: string | null;
  namaSekolah?: string | null;
  kotaSekolah?: string | null;
  statusKelulusan?: string | null;
  keteranganPendidikan?: string | null;
  kategoriPangkatId?: string | null;
  golonganId?: string | null;
  subGolonganId?: string | null;
  noDanaPensiun?: string | null;
  pointOfOriginal?: string | null;
  pointOfHire?: string | null;
  ukuranSeragamKerja?: string | null;
  ukuranSepatuKerja?: string | null;
  lokasiSebelumnyaId?: string | null;
  tanggalMutasi?: string | null;
  siklusPembayaranGaji?: string | null;
  costing?: string | null;
  assign?: string | null;
  actual?: string | null;
  anakKe?: number | null;
  jumlahSaudaraKandung?: number | null;
  createdAt?: string;
  updatedAt?: string;
  divisi?: {
    id: string;
    namaDivisi: string;
  };
  department?: {
    id: string;
    namaDepartmen: string;
    divisiId?: string;
  };
  posisiJabatan?: {
    id: string;
    namaPosisiJabatan: string;
  };
  statusKaryawan?: {
    id: string;
    namaStatus: string;
    status?: string;
  };
  lokasiKerja?: {
    id: string;
    namaLokasiKerja: string;
  };
  tag?:
    | {
        id: string;
        namaTag: string;
        warnaTag: string;
      }
    | null;
  tags?: Array<{
    id: string;
    namaTag: string;
    warnaTag: string;
  }>;
  jenisHubunganKerja?: {
    id: string;
    namaJenisHubunganKerja: string;
  } | null;
  kategoriPangkat?: {
    id: string;
    namaKategoriPangkat: string;
  } | null;
  golongan?: {
    id: string;
    namaGolongan: string;
  } | null;
  subGolongan?: {
    id: string;
    namaSubGolongan: string;
  } | null;
  lokasiSebelumnya?: {
    id: string;
    namaLokasiKerja: string;
  } | null;
  manager?: KaryawanReference | null;
  atasanLangsung?: KaryawanReference | null;
  anak?: KaryawanAnak[];
  saudaraKandung?: KaryawanSaudaraKandung[];
  kontakDarurat?: KaryawanKontakDarurat[];
  orangTuaKandung?: KaryawanOrangTuaKandung | null;
  orangTuaMertua?: KaryawanOrangTuaMertua | null;
  keluarga?: KaryawanKeluarga | null;
}

export interface KaryawanListItem {
  id: string;
  nomorIndukKaryawan: string;
  namaLengkap: string;
  fotoKaryawan?: string | null;
  divisi?: {
    namaDivisi: string;
  };
  department?: {
    namaDepartmen: string;
  };
  posisiJabatan?: {
    namaPosisiJabatan: string;
  };
  statusKaryawan?: {
    namaStatus: string;
    status?: string;
  };
  lokasiKerja?: {
    namaLokasiKerja: string;
  };
  tag?: {
    namaTag: string;
    warnaTag: string;
  } | null;
}

export interface KaryawanFormPayload {
  nomorIndukKaryawan: string;
  namaLengkap: string;
  fotoKaryawan?: string | null;
  divisiId: string;
  departmentId: string;
  managerNik?: string | null;
  atasanLangsungNik?: string | null;
  posisiJabatanId: string;
  emailPerusahaan?: string | null;
  nomorHandphone?: string | null;
  statusKaryawanId: string;
  lokasiKerjaId: string;
  tagIds: string[];
  jenisKelamin?: string | null;
  tempatLahir?: string | null;
  tanggalLahir?: string | null;
  emailPribadi?: string | null;
  agama?: string | null;
  golonganDarah?: string | null;
  nomorKartuKeluarga?: string | null;
  nomorKtp?: string | null;
  nomorNpwp?: string | null;
  nomorBpjs?: string | null;
  noNikKk?: string | null;
  statusPajak?: string | null;
  alamatDomisili?: string | null;
  kotaDomisili?: string | null;
  provinsiDomisili?: string | null;
  alamatKtp?: string | null;
  kotaKtp?: string | null;
  provinsiKtp?: string | null;
  nomorHandphone2?: string | null;
  nomorTeleponRumah1?: string | null;
  nomorTeleponRumah2?: string | null;
  statusPernikahan?: string | null;
  namaPasangan?: string | null;
  tanggalMenikah?: string | null;
  tanggalCerai?: string | null;
  tanggalWafatPasangan?: string | null;
  pekerjaanPasangan?: string | null;
  jumlahAnak?: number | null;
  nomorRekening?: string | null;
  namaPemegangRekening?: string | null;
  namaBank?: string | null;
  cabangBank?: string | null;
  jenisHubunganKerjaId?: string | null;
  tanggalMasukGroup?: string | null;
  tanggalMasuk?: string | null;
  tanggalPermanent?: string | null;
  tanggalKontrak?: string | null;
  tanggalAkhirKontrak?: string | null;
  tanggalBerhenti?: string | null;
  tingkatPendidikan?: string | null;
  bidangStudi?: string | null;
  namaSekolah?: string | null;
  kotaSekolah?: string | null;
  statusKelulusan?: string | null;
  keteranganPendidikan?: string | null;
  kategoriPangkatId?: string | null;
  golonganId?: string | null;
  subGolonganId?: string | null;
  noDanaPensiun?: string | null;
  pointOfOriginal?: string | null;
  pointOfHire?: string | null;
  ukuranSeragamKerja?: string | null;
  ukuranSepatuKerja?: string | null;
  lokasiSebelumnyaId?: string | null;
  tanggalMutasi?: string | null;
  siklusPembayaranGaji?: string | null;
  costing?: string | null;
  assign?: string | null;
  actual?: string | null;
  anakKe?: number | null;
  jumlahSaudaraKandung?: number | null;
  anak: KaryawanAnak[];
  saudaraKandung: KaryawanSaudaraKandung[];
  kontakDarurat: KaryawanKontakDarurat[];
  orangTuaKandung: KaryawanOrangTuaKandung;
  orangTuaMertua: KaryawanOrangTuaMertua;
  keluarga: KaryawanKeluarga;
}

export interface KaryawanListParams {
  page?: number;
  limit?: number;
  search?: string;
  divisiId?: string;
  departmentId?: string;
  statusKaryawanId?: string;
  lokasiKerjaId?: string;
}

export interface PaginatedKaryawanResponse {
  success: boolean;
  data: KaryawanListItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export type ImportResultRow = {
  baris: number;
  nik?: string;
  nama?: string;
  status: "sukses" | "gagal";
  keterangan?: string;
};
