export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface Divisi {
  id: string;
  namaDivisi: string;
  keterangan?: string | null;
  status: string;
}

export interface Department {
  id: string;
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
  namaKategoriPangkat: string;
  keterangan?: string | null;
  status: string;
}

export interface Golongan {
  id: string;
  namaGolongan: string;
  keterangan?: string | null;
  status: string;
}

export interface SubGolongan {
  id: string;
  namaSubGolongan: string;
  keterangan?: string | null;
  status: string;
}

export interface JenisHubunganKerja {
  id: string;
  namaJenisHubunganKerja: string;
  keterangan?: string | null;
  status: string;
}

export interface Tag {
  id: string;
  namaTag: string;
  warnaTag: string;
  keterangan?: string | null;
  status: string;
}

export interface LokasiKerja {
  id: string;
  namaLokasiKerja: string;
  alamat?: string | null;
  keterangan?: string | null;
  status: string;
}

export interface StatusKaryawan {
  id: string;
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
