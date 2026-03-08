import { useCallback, useEffect, useMemo, useState } from "react";

import { getKaryawanListApi } from "@/api/karyawan";
import type { KaryawanListItem } from "@/types/karyawan";

type KaryawanFilterKey = "divisiId" | "departmentId" | "statusKaryawanId" | "lokasiKerjaId";

export function useKaryawanList(initialLimit = 10) {
  const [data, setData] = useState<KaryawanListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [divisiId, setDivisiId] = useState<string | undefined>(undefined);
  const [departmentId, setDepartmentId] = useState<string | undefined>(undefined);
  const [statusKaryawanId, setStatusKaryawanId] = useState<string | undefined>(undefined);
  const [lokasiKerjaId, setLokasiKerjaId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);

    return () => window.clearTimeout(timeout);
  }, [search]);

  const params = useMemo(
    () => ({
      page,
      limit: initialLimit,
      search: debouncedSearch || undefined,
      divisiId,
      departmentId,
      statusKaryawanId,
      lokasiKerjaId,
    }),
    [page, initialLimit, debouncedSearch, divisiId, departmentId, statusKaryawanId, lokasiKerjaId],
  );

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getKaryawanListApi(params);
      const responseTotalItems = response.meta.total || 0;
      const responseTotalPages = response.meta.totalPages || 1;

      if (responseTotalItems > 0 && page > responseTotalPages) {
        setTotalPages(responseTotalPages);
        setTotalItems(responseTotalItems);
        setPage(responseTotalPages);
        return;
      }

      setData(response.data);
      setTotalPages(responseTotalPages);
      setTotalItems(responseTotalItems);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat data karyawan.");
    } finally {
      setLoading(false);
    }
  }, [page, params]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
  };

  const handleSearch = (query: string) => {
    setSearch(query);
  };

  const handleFilterChange = (key: KaryawanFilterKey, value?: string) => {
    const nextValue = value || undefined;
    setPage(1);

    if (key === "divisiId") {
      setDivisiId(nextValue);
      return;
    }

    if (key === "departmentId") {
      setDepartmentId(nextValue);
      return;
    }

    if (key === "statusKaryawanId") {
      setStatusKaryawanId(nextValue);
      return;
    }

    setLokasiKerjaId(nextValue);
  };

  const resetFilters = () => {
    setDivisiId(undefined);
    setDepartmentId(undefined);
    setStatusKaryawanId(undefined);
    setLokasiKerjaId(undefined);
    setSearch("");
    setDebouncedSearch("");
    setPage(1);
  };

  return {
    data,
    loading,
    error,
    page,
    search,
    totalPages,
    totalItems,
    divisiId,
    departmentId,
    statusKaryawanId,
    lokasiKerjaId,
    refetch,
    handlePageChange,
    handleSearch,
    handleFilterChange,
    resetFilters,
  };
}
