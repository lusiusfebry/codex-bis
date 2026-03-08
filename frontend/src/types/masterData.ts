export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    nextCode?: string;
  };
}

export interface Divisi {
  id: string;
  code: string;
  namaDivisi: string;
  keterangan?: string | null;
  status: string;
}

export interface Department {
  id: string;
  code: string;
  namaDepartmen: string;
  divisiId: string;
  keterangan?: string | null;
  status: string;
  divisi?: {
    namaDivisi: string;
  };
}

export interface PosisiJabatan {
  id: string;
  code: string;
  namaPosisiJabatan: string;
  departmentId: string;
  keterangan?: string | null;
  status: string;
  department?: {
    namaDepartmen: string;
    divisiId: string;
  };
}

export interface KategoriPangkat {
  id: string;
  code: string;
  namaKategoriPangkat: string;
  keterangan?: string | null;
  status: string;
}

export interface Golongan {
  id: string;
  code: string;
  namaGolongan: string;
  keterangan?: string | null;
  status: string;
}

export interface SubGolongan {
  id: string;
  code: string;
  namaSubGolongan: string;
  keterangan?: string | null;
  status: string;
}

export interface JenisHubunganKerja {
  id: string;
  code: string;
  namaJenisHubunganKerja: string;
  keterangan?: string | null;
  status: string;
}

export interface Tag {
  id: string;
  code: string;
  namaTag: string;
  warnaTag: string;
  keterangan?: string | null;
  status: string;
}

export interface LokasiKerja {
  id: string;
  code: string;
  namaLokasiKerja: string;
  alamat?: string | null;
  keterangan?: string | null;
  status: string;
}

export interface StatusKaryawan {
  id: string;
  code: string;
  namaStatus: string;
  keterangan?: string | null;
  status: string;
}

export type MasterDataEntityMap = {
  divisi: Divisi;
  department: Department;
  posisiJabatan: PosisiJabatan;
  kategoriPangkat: KategoriPangkat;
  golongan: Golongan;
  subGolongan: SubGolongan;
  jenisHubunganKerja: JenisHubunganKerja;
  tag: Tag;
  lokasiKerja: LokasiKerja;
  statusKaryawan: StatusKaryawan;
};

export type MasterDataResourceKey = keyof MasterDataEntityMap;

export type MasterDataStatusFilter = "Semua" | "Aktif" | "Tidak Aktif";
