import { useEffect, useMemo, useRef, useState } from "react";
import {
  Camera,
  Download,
  Loader2,
  Mail,
  Phone,
  Printer,
  QrCode,
  Search,
  ShieldCheck,
} from "lucide-react";
import {
  Controller,
  type Control,
  type FieldErrors,
  type UseFormRegister,
  type UseFormSetValue,
  type UseFormWatch,
} from "react-hook-form";

import {
  getQrCodeApi,
  searchKaryawanActiveApi,
  uploadFotoKaryawanApi,
} from "@/api/karyawan";
import { fetchMasterData, MASTER_DATA_PATHS } from "@/api/masterData";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toastError, toastInfo, toastSuccess, toastWarning } from "@/lib/toast";
import type {
  Department,
  Divisi,
  LokasiKerja,
  PosisiJabatan,
  StatusKaryawan,
  Tag,
} from "@/types/masterData";
import type { KaryawanFormPayload, KaryawanListItem } from "@/types/karyawan";

type KaryawanHeadCardProps = {
  control: Control<KaryawanFormPayload>;
  register: UseFormRegister<KaryawanFormPayload>;
  watch: UseFormWatch<KaryawanFormPayload>;
  setValue: UseFormSetValue<KaryawanFormPayload>;
  errors: FieldErrors<KaryawanFormPayload>;
  fotoKaryawan?: string | null;
  karyawanId?: string;
};

function getFotoUrl(path?: string | null) {
  if (!path) {
    return undefined;
  }

  if (path.startsWith("blob:") || path.startsWith("data:")) {
    return path;
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const baseUrl = (import.meta.env.VITE_API_BASE_URL as string).replace(/\/api\/?$/, "");
  return `${baseUrl}/uploads/${path}`;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((item) => item[0]?.toUpperCase() ?? "")
    .join("");
}

function mergeKaryawanOptions(
  current: KaryawanListItem[],
  incoming: KaryawanListItem[],
): KaryawanListItem[] {
  const map = new Map<string, KaryawanListItem>();

  for (const item of current) {
    map.set(item.nomorIndukKaryawan, item);
  }

  for (const item of incoming) {
    map.set(item.nomorIndukKaryawan, item);
  }

  return Array.from(map.values());
}

function KaryawanSearchSelect({
  label,
  referenceMode,
  value,
  onChange,
}: {
  label: string;
  referenceMode: "manager" | "atasan";
  value?: string | null;
  onChange: (value: string | null) => void;
}) {
  const emptyValue = "__none__";
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<KaryawanListItem[]>([]);

  useEffect(() => {
    const timeout = window.setTimeout(async () => {
      if (!query.trim()) {
        return;
      }

      setLoading(true);
      try {
        const result = await searchKaryawanActiveApi(query.trim(), referenceMode);
        setOptions((current) => mergeKaryawanOptions(current, result));
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [query, referenceMode]);

  useEffect(() => {
    if (!value) {
      return;
    }

    setOptions((current) => {
      if (current.some((item) => item.nomorIndukKaryawan === value)) {
        return current;
      }

      return [
        ...current,
        {
          id: value,
          nomorIndukKaryawan: value,
          namaLengkap: value,
        },
      ];
    });

    let active = true;

    const preloadSelectedOption = async () => {
      setLoading(true);

      try {
        const result = await searchKaryawanActiveApi(value, referenceMode);

        if (!active || result.length === 0) {
          return;
        }

        setOptions((current) => mergeKaryawanOptions(current, result));
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void preloadSelectedOption();

    return () => {
      active = false;
    };
  }, [referenceMode, value]);

  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      <div className="space-y-2 rounded-lg border bg-muted/20 p-2.5">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            className="h-8 pl-8 text-sm"
            onChange={(event) => setQuery(event.target.value)}
            placeholder={`Cari ${label.toLowerCase()}...`}
            value={query}
          />
        </div>
        <Select
          onValueChange={(selected) => onChange(selected === emptyValue ? null : selected)}
          value={value || emptyValue}
        >
          <SelectTrigger className="h-8 text-sm">
            <SelectValue placeholder={`Pilih ${label.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={emptyValue}>Tidak dipilih</SelectItem>
            {options.map((item) => (
              <SelectItem key={item.id} value={item.nomorIndukKaryawan}>
                {item.namaLengkap} · {item.nomorIndukKaryawan}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {loading ? (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Loader2 className="h-3 w-3 animate-spin" />
            Memuat hasil pencarian...
          </div>
        ) : null}
      </div>
    </div>
  );
}

type MasterOption = {
  id: string;
};

function SearchableMasterSelect<TOption extends MasterOption>({
  label,
  options,
  value,
  onChange,
  getLabel,
  placeholder,
  emptyLabel = "Tidak dipilih",
}: {
  label: string;
  options: TOption[];
  value?: string | null;
  onChange: (value: string | null) => void;
  getLabel: (option: TOption) => string;
  placeholder: string;
  emptyLabel?: string;
}) {
  const emptyValue = "__none__";
  const [query, setQuery] = useState("");

  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return options;
    }

    return options.filter((option) => getLabel(option).toLowerCase().includes(normalizedQuery));
  }, [getLabel, options, query]);

  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      <div className="space-y-2 rounded-lg border bg-muted/20 p-2.5">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            className="h-8 pl-8 text-sm"
            onChange={(event) => setQuery(event.target.value)}
            placeholder={`Cari ${label.toLowerCase()}...`}
            value={query}
          />
        </div>
        <Select
          onValueChange={(selected) => onChange(selected === emptyValue ? null : selected)}
          value={value || emptyValue}
        >
          <SelectTrigger className="h-8 text-sm">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={emptyValue}>{emptyLabel}</SelectItem>
            {filteredOptions.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                {getLabel(option)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function FieldGroupHeader({ title }: { title: string }) {
  return (
    <div className="col-span-full flex items-center gap-3 pb-1 pt-2 first:pt-0">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

export function KaryawanHeadCard({
  control,
  register,
  watch,
  setValue,
  errors,
  fotoKaryawan,
  karyawanId,
}: KaryawanHeadCardProps) {
  const [divisiOptions, setDivisiOptions] = useState<Divisi[]>([]);
  const [departmentOptions, setDepartmentOptions] = useState<Department[]>([]);
  const [posisiOptions, setPosisiOptions] = useState<PosisiJabatan[]>([]);
  const [statusOptions, setStatusOptions] = useState<StatusKaryawan[]>([]);
  const [lokasiOptions, setLokasiOptions] = useState<LokasiKerja[]>([]);
  const [tagOptions, setTagOptions] = useState<Tag[]>([]);
  const [uploading, setUploading] = useState(false);
  const [localFotoUrl, setLocalFotoUrl] = useState<string | null>(getFotoUrl(fotoKaryawan) ?? null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [qrLoading, setQrLoading] = useState(false);
  const previousDivisiId = useRef<string | undefined>(undefined);
  const previousDepartmentId = useRef<string | undefined>(undefined);
  const localPreviewRef = useRef<string | null>(null);

  const divisiId = watch("divisiId");
  const departmentId = watch("departmentId");
  const statusKaryawanId = watch("statusKaryawanId");
  const tagId = watch("tagId");
  const namaLengkap = watch("namaLengkap");
  const nomorIndukKaryawan = watch("nomorIndukKaryawan");

  useEffect(() => {
    const loadOptions = async () => {
      const [divisi, department, posisi, status, lokasi, tag] = await Promise.all([
        fetchMasterData<Divisi>(MASTER_DATA_PATHS.divisi, { status: "Aktif" }),
        fetchMasterData<Department>(MASTER_DATA_PATHS.department, { status: "Aktif" }),
        fetchMasterData<PosisiJabatan>(MASTER_DATA_PATHS.posisiJabatan, { status: "Aktif" }),
        fetchMasterData<StatusKaryawan>(MASTER_DATA_PATHS.statusKaryawan, { status: "Aktif" }),
        fetchMasterData<LokasiKerja>(MASTER_DATA_PATHS.lokasiKerja, { status: "Aktif" }),
        fetchMasterData<Tag>(MASTER_DATA_PATHS.tag, { status: "Aktif" }),
      ]);

      setDivisiOptions(divisi.data);
      setDepartmentOptions(department.data);
      setPosisiOptions(posisi.data);
      setStatusOptions(status.data);
      setLokasiOptions(lokasi.data);
      setTagOptions(tag.data);
    };

    void loadOptions();
  }, []);

  useEffect(() => {
    setLocalFotoUrl(getFotoUrl(fotoKaryawan) ?? null);
  }, [fotoKaryawan]);

  useEffect(() => {
    return () => {
      if (localPreviewRef.current) {
        URL.revokeObjectURL(localPreviewRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!karyawanId) {
      setQrDataUrl(null);
      setQrLoading(false);
      return;
    }

    let active = true;

    const loadQrCode = async () => {
      setQrLoading(true);

      try {
        const dataUrl = await getQrCodeApi(karyawanId);
        if (active) {
          setQrDataUrl(dataUrl);
        }
      } finally {
        if (active) {
          setQrLoading(false);
        }
      }
    };

    void loadQrCode();

    return () => {
      active = false;
    };
  }, [karyawanId]);

  useEffect(() => {
    if (previousDivisiId.current !== undefined && previousDivisiId.current !== divisiId) {
      setValue("departmentId", "");
      setValue("posisiJabatanId", "");
    }

    previousDivisiId.current = divisiId;
  }, [divisiId, setValue]);

  useEffect(() => {
    if (
      previousDepartmentId.current !== undefined &&
      previousDepartmentId.current !== departmentId
    ) {
      setValue("posisiJabatanId", "");
    }

    previousDepartmentId.current = departmentId;
  }, [departmentId, setValue]);

  const filteredDepartments = useMemo(() => {
    if (!divisiId) {
      return departmentOptions;
    }

    return departmentOptions.filter((item) => item.divisiId === divisiId);
  }, [departmentOptions, divisiId]);

  const filteredPosisi = useMemo(() => {
    if (!departmentId) {
      return posisiOptions;
    }

    return posisiOptions.filter((item) => item.departmentId === departmentId);
  }, [departmentId, posisiOptions]);

  const selectedStatus = statusOptions.find((item) => item.id === statusKaryawanId);
  const selectedTag = tagOptions.find((item) => item.id === tagId);

  const handleFotoChange = async (file?: File) => {
    if (!file) {
      return;
    }

    const isValidType = ["image/jpeg", "image/png"].includes(file.type);
    const isValidSize = file.size <= 2 * 1024 * 1024;

    if (!isValidType || !isValidSize) {
      toastWarning("Gunakan file JPG/PNG dengan ukuran maksimal 2MB.");
      return;
    }

    if (localPreviewRef.current) {
      URL.revokeObjectURL(localPreviewRef.current);
    }

    const previewUrl = URL.createObjectURL(file);
    localPreviewRef.current = previewUrl;
    setLocalFotoUrl(previewUrl);

    if (!karyawanId) {
      toastInfo("Foto bisa diupload setelah data karyawan disimpan.");
      return;
    }

    setUploading(true);

    try {
      const uploadedFoto = await uploadFotoKaryawanApi(karyawanId, file);
      if (localPreviewRef.current) {
        URL.revokeObjectURL(localPreviewRef.current);
        localPreviewRef.current = null;
      }
      setValue("fotoKaryawan", uploadedFoto.path, {
        shouldDirty: true,
        shouldTouch: true,
      });
      setLocalFotoUrl(uploadedFoto.url);
      toastSuccess("Foto berhasil diupload");
    } catch (error) {
      toastError(error instanceof Error ? error.message : "Gagal upload foto karyawan.");
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) {
      return;
    }

    const anchor = document.createElement("a");
    anchor.href = qrDataUrl;
    anchor.download = `QRCode-${nomorIndukKaryawan || "karyawan"}.png`;
    anchor.click();
  };

  const handlePrintQr = () => {
    if (!qrDataUrl) {
      return;
    }

    const printWindow = window.open("", "_blank", "width=480,height=640");

    if (!printWindow) {
      toastInfo("Popup print diblokir browser.");
      return;
    }

    const { document } = printWindow;
    document.open();
    document.title = "Print QR Code";

    const style = document.createElement("style");
    style.textContent = `
      @media print {
        body { margin: 0; }
      }
      body {
        margin: 0;
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #fff;
        font-family: Arial, sans-serif;
      }
      .wrapper {
        text-align: center;
      }
      .wrapper img {
        width: 320px;
        height: 320px;
        object-fit: contain;
      }
      .wrapper p {
        margin-top: 16px;
        font-size: 18px;
        font-weight: 600;
      }
    `;
    document.head.appendChild(style);

    const wrapper = document.createElement("div");
    wrapper.className = "wrapper";

    const image = document.createElement("img");
    image.src = qrDataUrl;
    image.alt = "QR Code";

    const label = document.createElement("p");
    label.textContent = nomorIndukKaryawan || namaLengkap || "QR Code Karyawan";

    wrapper.appendChild(image);
    wrapper.appendChild(label);
    document.body.appendChild(wrapper);
    document.close();

    printWindow.onload = () => {
      printWindow.print();
      printWindow.onafterprint = () => {
        printWindow.close();
      };
    };
  };

  return (
    <div className="space-y-5">
      {/* ── Horizontal Profile Banner ── */}
      <Card className="overflow-hidden border shadow-sm">
        <CardContent className="flex flex-col gap-6 p-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5">
            <div className="relative shrink-0">
              <Avatar className="h-20 w-20 ring-2 ring-border">
                <AvatarImage
                  alt={namaLengkap || "Karyawan"}
                  src={localFotoUrl ?? undefined}
                />
                <AvatarFallback className="bg-slate-100 text-xl font-semibold text-slate-600">
                  {getInitials(namaLengkap || "BSI")}
                </AvatarFallback>
              </Avatar>
              {uploading ? (
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-background/70">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                </div>
              ) : null}
            </div>
            <div className="space-y-2">
              <div>
                <div className="text-xl font-bold text-foreground">
                  {namaLengkap || "Nama karyawan"}
                </div>
                <div className="text-sm font-medium text-muted-foreground">
                  {nomorIndukKaryawan || "Nomor induk karyawan"}
                </div>
              </div>
              <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground transition-colors hover:bg-secondary/80">
                <Camera className="h-3.5 w-3.5" />
                Ganti Foto
                <input
                  accept="image/png,image/jpeg"
                  className="hidden"
                  onChange={(event) => {
                    void handleFotoChange(event.target.files?.[0]);
                    event.target.value = "";
                  }}
                  type="file"
                />
              </label>
            </div>
          </div>

          {/* ── QR Code Section (Horizontal right side) ── */}
          <div className="flex shrink-0 items-center justify-center rounded-xl bg-muted/30 p-4 md:min-w-[200px] md:justify-end md:bg-transparent md:p-0">
            {!karyawanId ? (
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <QrCode className="h-5 w-5" />
                </div>
                <p className="max-w-[120px]">Tersedia setelah disimpan</p>
              </div>
            ) : qrLoading ? (
              <div className="flex items-center gap-3">
                <Skeleton className="h-16 w-16 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-12" />
                </div>
              </div>
            ) : qrDataUrl ? (
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-white p-1.5 shadow-sm ring-1 ring-border">
                  <img
                    alt="QR Code Karyawan"
                    className="h-14 w-14 object-contain"
                    src={qrDataUrl}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Button
                    className="h-7 justify-start gap-1.5 rounded-md px-2.5 text-[11px]"
                    onClick={handleDownloadQr}
                    size="sm"
                    type="button"
                    variant="outline"
                  >
                    <Download className="h-3 w-3" />
                    Unduh PNG
                  </Button>
                  <Button
                    className="h-7 justify-start gap-1.5 rounded-md px-2.5 text-[11px]"
                    onClick={handlePrintQr}
                    size="sm"
                    type="button"
                    variant="outline"
                  >
                    <Printer className="h-3 w-3" />
                    Cetak QR
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <QrCode className="h-5 w-5" />
                </div>
                <p className="max-w-[120px]">Belum tersedia</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── Form Fields Card ── */}
      <Card className="overflow-hidden border shadow-sm">
        <CardContent className="p-5">
          <div className="grid gap-x-5 gap-y-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Info Utama */}
            <FieldGroupHeader title="Info Utama" />

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground" htmlFor="namaLengkap">Nama Lengkap</Label>
              <Input
                id="namaLengkap"
                {...register("namaLengkap", { required: "Nama lengkap wajib diisi." })}
              />
              {errors.namaLengkap ? (
                <p className="text-xs text-destructive">{errors.namaLengkap.message}</p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground" htmlFor="nomorIndukKaryawan">Nomor Induk Karyawan</Label>
              <Input
                id="nomorIndukKaryawan"
                placeholder="Contoh: 02-03827"
                {...register("nomorIndukKaryawan", {
                  required: "Nomor induk karyawan wajib diisi.",
                })}
              />
              {errors.nomorIndukKaryawan ? (
                <p className="text-xs text-destructive">
                  {errors.nomorIndukKaryawan.message}
                </p>
              ) : null}
            </div>

            {/* Organisasi */}
            <FieldGroupHeader title="Organisasi" />

            <div className="space-y-1.5">
              <Controller
                control={control}
                name="divisiId"
                rules={{ required: "Divisi wajib dipilih." }}
                render={({ field }) => (
                  <SearchableMasterSelect
                    getLabel={(item: Divisi) => item.namaDivisi}
                    label="Divisi"
                    onChange={(selected) => field.onChange(selected ?? "")}
                    options={divisiOptions}
                    placeholder="Pilih divisi"
                    value={field.value}
                  />
                )}
              />
              {errors.divisiId ? (
                <p className="text-xs text-destructive">{errors.divisiId.message}</p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Controller
                control={control}
                name="departmentId"
                rules={{ required: "Department wajib dipilih." }}
                render={({ field }) => (
                  <SearchableMasterSelect
                    getLabel={(item: Department) => item.namaDepartmen}
                    label="Department"
                    onChange={(selected) => field.onChange(selected ?? "")}
                    options={filteredDepartments}
                    placeholder="Pilih department"
                    value={field.value}
                  />
                )}
              />
              {errors.departmentId ? (
                <p className="text-xs text-destructive">{errors.departmentId.message}</p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Controller
                control={control}
                name="posisiJabatanId"
                rules={{ required: "Posisi jabatan wajib dipilih." }}
                render={({ field }) => (
                  <SearchableMasterSelect
                    getLabel={(item: PosisiJabatan) => item.namaPosisiJabatan}
                    label="Posisi Jabatan"
                    onChange={(selected) => field.onChange(selected ?? "")}
                    options={filteredPosisi}
                    placeholder="Pilih posisi jabatan"
                    value={field.value}
                  />
                )}
              />
              {errors.posisiJabatanId ? (
                <p className="text-xs text-destructive">
                  {errors.posisiJabatanId.message}
                </p>
              ) : null}
            </div>

            {/* Supervisi */}
            <FieldGroupHeader title="Supervisi" />

            <div className="space-y-1.5">
              <Controller
                control={control}
                name="managerNik"
                render={({ field }) => (
                  <KaryawanSearchSelect
                    label="Manager"
                    referenceMode="manager"
                    onChange={field.onChange}
                    value={field.value}
                  />
                )}
              />
            </div>

            <div className="space-y-1.5">
              <Controller
                control={control}
                name="atasanLangsungNik"
                render={({ field }) => (
                  <KaryawanSearchSelect
                    label="Atasan Langsung"
                    referenceMode="atasan"
                    onChange={field.onChange}
                    value={field.value}
                  />
                )}
              />
            </div>

            {/* Kontak & Status */}
            <FieldGroupHeader title="Kontak & Status" />

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground" htmlFor="emailPerusahaan">Email Perusahaan</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  id="emailPerusahaan"
                  className="h-9 pl-8 text-sm"
                  type="email"
                  {...register("emailPerusahaan")}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground" htmlFor="nomorHandphone">Nomor Handphone</Label>
              <div className="relative">
                <Phone className="pointer-events-none absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  id="nomorHandphone"
                  className="h-9 pl-8 text-sm"
                  {...register("nomorHandphone")}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Controller
                control={control}
                name="statusKaryawanId"
                rules={{ required: "Status karyawan wajib dipilih." }}
                render={({ field }) => (
                  <SearchableMasterSelect
                    getLabel={(item: StatusKaryawan) => item.namaStatus}
                    label="Status Karyawan"
                    onChange={(selected) => field.onChange(selected ?? "")}
                    options={statusOptions}
                    placeholder="Pilih status karyawan"
                    value={field.value}
                  />
                )}
              />
              {selectedStatus ? (
                <Badge className="bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20 hover:bg-emerald-50">
                  <ShieldCheck className="mr-1 h-3 w-3" />
                  {selectedStatus.namaStatus}
                </Badge>
              ) : null}
              {errors.statusKaryawanId ? (
                <p className="text-xs text-destructive">
                  {errors.statusKaryawanId.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Controller
                control={control}
                name="lokasiKerjaId"
                rules={{ required: "Lokasi kerja wajib dipilih." }}
                render={({ field }) => (
                  <SearchableMasterSelect
                    getLabel={(item: LokasiKerja) => item.namaLokasiKerja}
                    label="Lokasi Kerja"
                    onChange={(selected) => field.onChange(selected ?? "")}
                    options={lokasiOptions}
                    placeholder="Pilih lokasi kerja"
                    value={field.value}
                  />
                )}
              />
              {errors.lokasiKerjaId ? (
                <p className="text-xs text-destructive">{errors.lokasiKerjaId.message}</p>
              ) : null}
            </div>

            <div className="space-y-1.5 md:col-span-2 lg:col-span-3">
              <Controller
                control={control}
                name="tagId"
                render={({ field }) => (
                  <SearchableMasterSelect
                    emptyLabel="Tidak ada tag"
                    getLabel={(item: Tag) => item.namaTag}
                    label="Tag"
                    onChange={field.onChange}
                    options={tagOptions}
                    placeholder="Pilih tag"
                    value={field.value}
                  />
                )}
              />
              {selectedTag ? (
                <Badge
                  className="hover:opacity-100"
                  style={{
                    backgroundColor: selectedTag.warnaTag,
                    color: "#fff",
                  }}
                >
                  {selectedTag.namaTag}
                </Badge>
              ) : null}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
