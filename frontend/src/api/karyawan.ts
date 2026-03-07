import axiosInstance from "@/api/axiosInstance";

type ListResponse = {
  success: boolean;
  data: unknown[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
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
