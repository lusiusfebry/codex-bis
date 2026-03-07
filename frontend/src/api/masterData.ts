import axiosInstance from "@/api/axiosInstance";
import type { PaginatedResponse } from "@/types/masterData";

export const MASTER_DATA_PATHS = {
  divisi: "/hr/master-data/divisi",
  department: "/hr/master-data/department",
  posisiJabatan: "/hr/master-data/posisi-jabatan",
  kategoriPangkat: "/hr/master-data/kategori-pangkat",
  golongan: "/hr/master-data/golongan",
  subGolongan: "/hr/master-data/sub-golongan",
  jenisHubunganKerja: "/hr/master-data/jenis-hubungan-kerja",
  tag: "/hr/master-data/tag",
  lokasiKerja: "/hr/master-data/lokasi-kerja",
  statusKaryawan: "/hr/master-data/status-karyawan",
} as const;

export type MasterDataListParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
};

type SingleResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

export async function fetchMasterData<T>(
  resource: string,
  params?: MasterDataListParams,
): Promise<PaginatedResponse<T>> {
  const response = await axiosInstance.get<PaginatedResponse<T>>(resource, { params });
  return response.data;
}

export async function createMasterData<T, P extends Record<string, unknown>>(
  resource: string,
  payload: P,
): Promise<T> {
  const response = await axiosInstance.post<SingleResponse<T>>(resource, payload);
  return response.data.data;
}

export async function updateMasterData<T, P extends Record<string, unknown>>(
  resource: string,
  id: string,
  payload: P,
): Promise<T> {
  const response = await axiosInstance.put<SingleResponse<T>>(`${resource}/${id}`, payload);
  return response.data.data;
}

export async function deleteMasterData(resource: string, id: string): Promise<void> {
  await axiosInstance.delete(`${resource}/${id}`);
}
