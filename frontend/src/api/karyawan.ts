import axiosInstance from "@/api/axiosInstance";
import type {
  Karyawan,
  KaryawanFormPayload,
  KaryawanListItem,
  KaryawanListParams,
  PaginatedKaryawanResponse,
} from "@/types/karyawan";

type KaryawanReferenceMode = "manager" | "atasan";

type ListResponse = {
  success: boolean;
  data: KaryawanListItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

type SingleResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

export async function getKaryawanStatsApi(params?: Record<string, string | number>) {
  const response = await axiosInstance.get<ListResponse>("/hr/karyawan", {
    params: {
      limit: 1,
      ...params,
    },
  });

  return response.data.meta.total;
}

export async function getKaryawanListApi(params: KaryawanListParams = {}): Promise<PaginatedKaryawanResponse> {
  const response = await axiosInstance.get<PaginatedKaryawanResponse>("/hr/karyawan", {
    params,
  });

  return response.data;
}

export async function getKaryawanByIdApi(id: string): Promise<Karyawan> {
  const response = await axiosInstance.get<SingleResponse<Karyawan>>(`/hr/karyawan/${id}`);
  return response.data.data;
}

export async function createKaryawanApi(payload: KaryawanFormPayload): Promise<Karyawan> {
  const response = await axiosInstance.post<SingleResponse<Karyawan>>("/hr/karyawan", payload);
  return response.data.data;
}

export async function updateKaryawanApi(
  id: string,
  payload: Partial<KaryawanFormPayload>,
): Promise<Karyawan> {
  const response = await axiosInstance.put<SingleResponse<Karyawan>>(`/hr/karyawan/${id}`, payload);
  return response.data.data;
}

export async function deleteKaryawanApi(id: string): Promise<void> {
  await axiosInstance.delete(`/hr/karyawan/${id}`);
}

export async function searchKaryawanActiveApi(
  query: string,
  referenceMode: KaryawanReferenceMode,
): Promise<KaryawanListItem[]> {
  const response = await axiosInstance.get<PaginatedKaryawanResponse>("/hr/karyawan", {
    params: {
      search: query,
      referenceMode,
      limit: 10,
    },
  });

  return response.data.data;
}
