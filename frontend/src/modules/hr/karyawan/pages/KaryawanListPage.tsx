import { useCallback, useMemo, useState } from "react";
import {
  Eye,
  Filter,
  MapPin,
  Search,
  Trash2,
  Upload,
  UserPlus,
  UsersRound,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { deleteKaryawanApi } from "@/api/karyawan";
import { MASTER_DATA_PATHS } from "@/api/masterData";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toastError, toastSuccess } from "@/lib/toast";
import { DeleteConfirmDialog } from "@/modules/hr/master-data/components/DeleteConfirmDialog";
import { MasterDataPagination } from "@/modules/hr/master-data/components/MasterDataPagination";
import { useMasterDataOptions } from "@/modules/hr/master-data/hooks/useMasterDataOptions";
import ImportExcelModal from "@/modules/hr/karyawan/components/ImportExcelModal";
import { useKaryawanList } from "@/modules/hr/karyawan/hooks/useKaryawanList";
import type { Department, Divisi, LokasiKerja, StatusKaryawan } from "@/types/masterData";
import type { KaryawanListItem } from "@/types/karyawan";

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((item) => item[0]?.toUpperCase() ?? "")
    .join("");
}

function getFotoUrl(path?: string | null) {
  if (!path) {
    return undefined;
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const baseUrl = (import.meta.env.VITE_API_BASE_URL as string).replace(/\/api\/?$/, "");
  return `${baseUrl}/uploads/${path}`;
}

function getStatusVariant(status?: string) {
  const normalized = (status ?? "").toLowerCase();

  if (normalized.includes("aktif")) {
    return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20";
  }

  if (normalized.includes("kontrak")) {
    return "bg-sky-50 text-sky-700 ring-1 ring-sky-600/20";
  }

  if (normalized.includes("permanent")) {
    return "bg-violet-50 text-violet-700 ring-1 ring-violet-600/20";
  }

  return "bg-slate-50 text-slate-600 ring-1 ring-slate-500/20";
}

export default function KaryawanListPage() {
  const navigate = useNavigate();
  const {
    data,
    loading,
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
  } = useKaryawanList();
  const [selectedItem, setSelectedItem] = useState<KaryawanListItem | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [importOpen, setImportOpen] = useState(false);

  const mapDivisiOption = useCallback(
    (item: Divisi) => ({ label: item.namaDivisi, value: item.id }),
    [],
  );
  const mapDepartmentOption = useCallback(
    (item: Department) => ({ label: item.namaDepartmen, value: item.id }),
    [],
  );
  const mapStatusOption = useCallback(
    (item: StatusKaryawan) => ({ label: item.namaStatus, value: item.id }),
    [],
  );
  const mapLokasiOption = useCallback(
    (item: LokasiKerja) => ({ label: item.namaLokasiKerja, value: item.id }),
    [],
  );

  const { options: divisiOptions } = useMasterDataOptions<Divisi>(
    MASTER_DATA_PATHS.divisi,
    mapDivisiOption,
  );
  const { options: departmentOptions } = useMasterDataOptions<Department>(
    MASTER_DATA_PATHS.department,
    mapDepartmentOption,
  );
  const { options: statusOptions } = useMasterDataOptions<StatusKaryawan>(
    MASTER_DATA_PATHS.statusKaryawan,
    mapStatusOption,
  );
  const { options: lokasiOptions } = useMasterDataOptions<LokasiKerja>(
    MASTER_DATA_PATHS.lokasiKerja,
    mapLokasiOption,
  );

  const hasActiveFilters = Boolean(
    search || divisiId || departmentId || statusKaryawanId || lokasiKerjaId,
  );

  const filteredDepartmentOptions = useMemo(() => {
    if (!divisiId) {
      return departmentOptions;
    }

    return departmentOptions;
  }, [departmentOptions, divisiId]);

  const handleDelete = async () => {
    if (!selectedItem) {
      return;
    }

    setDeleteLoading(true);

    try {
      await deleteKaryawanApi(selectedItem.id);
      toastSuccess("Karyawan berhasil dihapus.");
      setDeleteOpen(false);
      setSelectedItem(null);
      await refetch();
    } catch (error) {
      toastError(error instanceof Error ? error.message : "Gagal menghapus karyawan.");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1240px] space-y-5 pb-8">
      {/* ── Hero Header ── */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6 text-slate-50 shadow-lg lg:p-7">
        <div className="pointer-events-none absolute -left-24 -top-12 h-64 w-64 rounded-full bg-cyan-500/15 blur-[80px]" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-52 w-52 rounded-full bg-indigo-500/15 blur-[80px]" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-32 w-96 -translate-x-1/2 bg-gradient-to-b from-white/[0.03] to-transparent" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400">
                <UsersRound className="h-5 w-5" />
              </div>
              <h1 className="text-2xl font-semibold tracking-tight lg:text-3xl">
                Daftar Karyawan
              </h1>
              <Badge className="border border-white/20 bg-white/10 px-2.5 text-xs text-slate-200 backdrop-blur-sm hover:bg-white/15">
                {totalItems} karyawan
              </Badge>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-slate-400">
              Kelola profil karyawan, lakukan filtering lintas struktur organisasi, dan buka detail untuk melengkapi data HR.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              className="gap-2 rounded-xl bg-cyan-500 font-medium text-slate-950 shadow-lg shadow-cyan-500/20 transition-all hover:bg-cyan-400 hover:shadow-cyan-500/30"
              onClick={() => navigate("/hr/karyawan/tambah")}
            >
              <UserPlus className="h-4 w-4" />
              Tambah Karyawan
            </Button>
            <Button
              className="gap-2 rounded-xl border-slate-600 bg-slate-800/80 text-slate-200 backdrop-blur-sm hover:bg-slate-700"
              onClick={() => setImportOpen(true)}
              variant="outline"
            >
              <Upload className="h-4 w-4" />
              Import Excel
            </Button>
          </div>
        </div>
      </div>

      {/* ── Filter Card ── */}
      <Card className="border shadow-sm">
        <CardContent className="space-y-3 p-5">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Filter className="h-4 w-4" />
            <span>Filter Pencarian</span>
          </div>

          <div className="grid gap-3 xl:grid-cols-[1.3fr_repeat(4,minmax(0,1fr))]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9"
                onChange={(event) => handleSearch(event.target.value)}
                placeholder="Cari nama atau NIK..."
                value={search}
              />
            </div>

            <Select
              onValueChange={(value) =>
                handleFilterChange("divisiId", value === "all" ? undefined : value)
              }
              value={divisiId ?? "all"}
            >
              <SelectTrigger>
                <SelectValue placeholder="Semua Divisi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Divisi</SelectItem>
                {divisiOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              onValueChange={(value) =>
                handleFilterChange("departmentId", value === "all" ? undefined : value)
              }
              value={departmentId ?? "all"}
            >
              <SelectTrigger>
                <SelectValue placeholder="Semua Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Department</SelectItem>
                {filteredDepartmentOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              onValueChange={(value) =>
                handleFilterChange(
                  "statusKaryawanId",
                  value === "all" ? undefined : value,
                )
              }
              value={statusKaryawanId ?? "all"}
            >
              <SelectTrigger>
                <SelectValue placeholder="Semua Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              onValueChange={(value) =>
                handleFilterChange("lokasiKerjaId", value === "all" ? undefined : value)
              }
              value={lokasiKerjaId ?? "all"}
            >
              <SelectTrigger>
                <SelectValue placeholder="Semua Lokasi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Lokasi</SelectItem>
                {lokasiOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {hasActiveFilters ? (
            <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <Filter className="h-3.5 w-3.5" />
                Filter aktif diterapkan pada daftar karyawan.
              </p>
              <Button className="h-7 gap-1.5 px-2.5 text-xs" onClick={resetFilters} size="sm" variant="ghost">
                <X className="h-3.5 w-3.5" />
                Reset Filter
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* ── Data Table ── */}
      <Card className="overflow-hidden border shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b bg-muted/30 hover:bg-muted/30">
                <TableHead className="font-semibold">Karyawan</TableHead>
                <TableHead className="font-semibold">Posisi Jabatan</TableHead>
                <TableHead className="font-semibold">Divisi / Dept</TableHead>
                <TableHead className="font-semibold">Lokasi</TableHead>
                <TableHead className="font-semibold">Tag</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="w-24 text-right font-semibold">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading
                ? Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={`loading-${index}`}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-11 w-11 rounded-full" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-36" />
                            <Skeleton className="h-3 w-24" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                      <TableCell><Skeleton className="ml-auto h-9 w-20" /></TableCell>
                    </TableRow>
                  ))
                : null}

              {!loading && data.length === 0 ? (
                <TableRow>
                  <TableCell className="py-20" colSpan={7}>
                    <div className="flex flex-col items-center justify-center gap-4 text-center">
                      <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-500/10 to-indigo-500/10 blur-xl" />
                        <div className="relative rounded-2xl bg-muted/80 p-5 text-muted-foreground">
                          <UsersRound className="h-10 w-10" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-base font-semibold text-foreground">
                          Belum ada data karyawan
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Coba ubah filter pencarian atau tambahkan data karyawan baru.
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : null}

              {!loading
                ? data.map((item, index) => (
                    <TableRow
                      className={`transition-colors duration-150 hover:bg-muted/40 ${
                        index % 2 === 1 ? "bg-muted/10" : ""
                      }`}
                      key={item.id}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 ring-2 ring-background">
                            <AvatarImage
                              alt={item.namaLengkap}
                              src={getFotoUrl(item.fotoKaryawan)}
                            />
                            <AvatarFallback className="bg-slate-100 text-xs font-semibold text-slate-600">
                              {getInitials(item.namaLengkap)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 space-y-0.5">
                            <div className="truncate text-sm font-medium text-foreground">
                              {item.namaLengkap}
                            </div>
                            <div className="truncate text-xs text-muted-foreground">
                              {item.nomorIndukKaryawan}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {item.posisiJabatan?.namaPosisiJabatan ?? "-"}
                      </TableCell>
                      <TableCell className="text-sm">
                        <div className="space-y-0.5">
                          <div className="font-medium">{item.divisi?.namaDivisi ?? "-"}</div>
                          <div className="text-xs text-muted-foreground">
                            {item.department?.namaDepartmen ?? "-"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate">{item.lokasiKerja?.namaLokasiKerja ?? "-"}</span>
                        </span>
                      </TableCell>
                      <TableCell>
                        {item.tag ? (
                          <Badge
                            className="text-xs shadow-sm"
                            style={{
                              backgroundColor: item.tag.warnaTag,
                              color: "#fff",
                            }}
                          >
                            {item.tag.namaTag}
                          </Badge>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={`text-xs ${getStatusVariant(item.statusKaryawan?.namaStatus)}`}>
                          {item.statusKaryawan?.namaStatus ?? "-"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1.5">
                          <Button
                            className="h-8 w-8 rounded-lg"
                            onClick={() => navigate(`/hr/karyawan/${item.id}`)}
                            size="icon"
                            variant="ghost"
                          >
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          </Button>
                          <Button
                            className="h-8 w-8 rounded-lg"
                            onClick={() => {
                              setSelectedItem(item);
                              setDeleteOpen(true);
                            }}
                            size="icon"
                            variant="ghost"
                          >
                            <Trash2 className="h-4 w-4 text-destructive/70" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <MasterDataPagination
        onPageChange={handlePageChange}
        page={page}
        totalPages={totalPages}
      />

      <DeleteConfirmDialog
        itemName={selectedItem?.namaLengkap ?? "-"}
        loading={deleteLoading}
        onClose={() => {
          setDeleteOpen(false);
          setSelectedItem(null);
        }}
        onConfirm={handleDelete}
        open={deleteOpen}
      />

      <ImportExcelModal
        onClose={() => setImportOpen(false)}
        onSuccess={() => {
          void refetch();
        }}
        open={importOpen}
      />
    </div>
  );
}
