import { useCallback, useEffect, useMemo, useState } from "react";

import { fetchMasterData } from "@/api/masterData";
import type { MasterDataStatusFilter } from "@/types/masterData";

type UseMasterDataOptions = {
  resource: string;
  initialLimit?: number;
  initialStatus?: MasterDataStatusFilter;
};

export function useMasterData<T>({ resource, initialLimit = 10, initialStatus = "Semua" }: UseMasterDataOptions) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<MasterDataStatusFilter>(initialStatus);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);

    return () => window.clearTimeout(timeout);
  }, [search]);

  const queryParams = useMemo(
    () => ({
      page,
      limit: initialLimit,
      search: debouncedSearch || undefined,
      status: statusFilter === "Semua" ? undefined : statusFilter,
    }),
    [page, initialLimit, debouncedSearch, statusFilter],
  );

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchMasterData<T>(resource, queryParams);
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
      setError(err instanceof Error ? err.message : "Gagal memuat data.");
    } finally {
      setLoading(false);
    }
  }, [page, queryParams, resource]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
  };

  const handleSearch = (query: string) => {
    setSearch(query);
  };

  const handleStatusFilter = (status: MasterDataStatusFilter) => {
    setStatusFilter(status);
    setPage(1);
  };

  return {
    data,
    loading,
    error,
    page,
    search,
    statusFilter,
    totalPages,
    totalItems,
    refetch,
    handlePageChange,
    handleSearch,
    handleStatusFilter,
  };
}
