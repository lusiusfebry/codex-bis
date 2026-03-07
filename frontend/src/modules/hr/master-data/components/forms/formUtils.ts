import type {
  Department,
  Divisi,
  Golongan,
  JenisHubunganKerja,
  KategoriPangkat,
  LokasiKerja,
  PosisiJabatan,
  StatusKaryawan,
  SubGolongan,
  Tag,
} from "@/types/masterData";

export type CommonFormValues = {
  status: string;
  keterangan: string;
};

export const defaultCommonValues: CommonFormValues = {
  status: "Aktif",
  keterangan: "",
};

export function toCommonValues<T extends { keterangan?: string | null; status: string }>(data?: T): CommonFormValues {
  return {
    status: data?.status ?? "Aktif",
    keterangan: data?.keterangan ?? "",
  };
}

export const divisiOption = (item: Divisi) => ({
  label: item.namaDivisi,
  value: item.id,
});

export const departmentOption = (item: Department) => ({
  label: item.namaDepartmen,
  value: item.id,
});

export const posisiOption = (item: PosisiJabatan) => ({
  label: item.namaPosisiJabatan,
  value: item.id,
});

export const kategoriOption = (item: KategoriPangkat) => ({
  label: item.namaKategoriPangkat,
  value: item.id,
});

export const golonganOption = (item: Golongan) => ({
  label: item.namaGolongan,
  value: item.id,
});

export const subGolonganOption = (item: SubGolongan) => ({
  label: item.namaSubGolongan,
  value: item.id,
});

export const jenisHubunganKerjaOption = (item: JenisHubunganKerja) => ({
  label: item.namaJenisHubunganKerja,
  value: item.id,
});

export const tagOption = (item: Tag) => ({
  label: item.namaTag,
  value: item.id,
});

export const lokasiKerjaOption = (item: LokasiKerja) => ({
  label: item.namaLokasiKerja,
  value: item.id,
});

export const statusKaryawanOption = (item: StatusKaryawan) => ({
  label: item.namaStatus,
  value: item.id,
});
