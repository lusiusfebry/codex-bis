import { useCallback, useMemo, useState } from "react";
import {
  Eye,
  MapPin,
  Search,
  Trash2,
  Upload,
  UserPlus,
  UsersRound,
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
    return "bg-emerald-100 text-emerald-700";
  }

  if (normalized.includes("kontrak")) {
    return "bg-sky-100 text-sky-700";
  }

  if (normalized.includes("permanent")) {
    return "bg-violet-100 text-violet-700";
  }

  return "bg-slate-100 text-slate-700";
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
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border bg-card p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Daftar Karyawan
            </h1>
            <Badge variant="secondary">{totalItems} karyawan</Badge>
          </div>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Kelola profil dasar karyawan, filter berdasarkan struktur organisasi, dan buka
            detail profil untuk melanjutkan pengisian data.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            className="gap-2"
            onClick={() => navigate("/hr/karyawan/tambah")}
          >
            <UserPlus className="h-4 w-4" />
            Tambah Karyawan
          </Button>
          <Button
            className="gap-2"
            onClick={() => setImportOpen(true)}
            variant="outline"
          >
            <Upload className="h-4 w-4" />
            Import Excel
          </Button>
        </div>
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="space-y-4 p-6">
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
            <div className="flex justify-end">
              <Button onClick={resetFilters} size="sm" variant="ghost">
                Reset Filter
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Karyawan</TableHead>
                <TableHead>Posisi Jabatan</TableHead>
                <TableHead>Divisi / Dept</TableHead>
                <TableHead>Lokasi</TableHead>
                <TableHead>Tag</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-28 text-right">Aksi</TableHead>
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
                  <TableCell className="py-16" colSpan={7}>
                    <div className="flex flex-col items-center justify-center gap-3 text-center">
                      <div className="rounded-full bg-muted p-5 text-muted-foreground">
                        <UsersRound className="h-10 w-10" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-lg font-semibold text-foreground">
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
                ? data.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-11 w-11 border">
                            <AvatarImage
                              alt={item.namaLengkap}
                              src={getFotoUrl(item.fotoKaryawan)}
                            />
                            <AvatarFallback>{getInitials(item.namaLengkap)}</AvatarFallback>
                          </Avatar>
                          <div className="space-y-0.5">
                            <div className="font-medium text-foreground">{item.namaLengkap}</div>
                            <div className="text-sm text-muted-foreground">
                              {item.nomorIndukKaryawan}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{item.posisiJabatan?.namaPosisiJabatan ?? "-"}</TableCell>
                      <TableCell>
                        {(item.divisi?.namaDivisi ?? "-") + " · " + (item.department?.namaDepartmen ?? "-")}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {item.lokasiKerja?.namaLokasiKerja ?? "-"}
                        </span>
                      </TableCell>
                      <TableCell>
                        {item.tag ? (
                          <Badge
                            style={{
                              backgroundColor: item.tag.warnaTag,
                              color: "#fff",
                            }}
                          >
                            {item.tag.namaTag}
                          </Badge>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusVariant(item.statusKaryawan?.namaStatus)}>
                          {item.statusKaryawan?.namaStatus ?? "-"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button
                            onClick={() => navigate(`/hr/karyawan/${item.id}`)}
                            size="icon"
                            variant="ghost"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => {
                              setSelectedItem(item);
                              setDeleteOpen(true);
                            }}
                            size="icon"
                            variant="ghost"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
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
