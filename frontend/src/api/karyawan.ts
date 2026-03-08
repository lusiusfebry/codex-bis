import axiosInstance from "@/api/axiosInstance";
import type {
  ImportResultRow,
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

type UploadFotoResponse = {
  success: boolean;
  data: {
    fotoKaryawan: string;
  };
};

type UploadFotoKaryawanResult = {
  path: string;
  url: string;
};

type QrCodeResponse = {
  success: boolean;
  data: string;
};

type ImportExcelResponse = {
  success: boolean;
  laporan?: {
    detail?: ImportResultRow[];
  };
};

function getUploadsUrl(path?: string | null) {
  if (!path) {
    return "";
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const baseUrl = (import.meta.env.VITE_API_BASE_URL as string).replace(/\/api\/?$/, "");
  return `${baseUrl}/uploads/${path}`;
}

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

export async function uploadFotoKaryawanApi(
  id: string,
  file: File,
): Promise<UploadFotoKaryawanResult> {
  const formData = new FormData();
  formData.append("foto", file);

  const response = await axiosInstance.post<UploadFotoResponse>(
    `/hr/karyawan/${id}/foto`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return {
    path: response.data.data.fotoKaryawan,
    url: getUploadsUrl(response.data.data.fotoKaryawan),
  };
}

export async function getQrCodeApi(id: string): Promise<string> {
  const response = await axiosInstance.get<QrCodeResponse>(`/hr/karyawan/${id}/qrcode`, {
    params: {
      format: "base64",
    },
  });

  return response.data.data;
}

export async function importKaryawanExcelApi(file: File): Promise<ImportResultRow[]> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axiosInstance.post<ImportExcelResponse>("/hr/karyawan/import", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.laporan?.detail ?? [];
}
