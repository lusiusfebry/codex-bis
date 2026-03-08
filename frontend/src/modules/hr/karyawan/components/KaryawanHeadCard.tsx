import { useEffect, useMemo, useRef, useState } from "react";
import {
  Camera,
  Check,
  Loader2,
  Mail,
  Phone,
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

import { searchKaryawanActiveApi } from "@/api/karyawan";
import { fetchMasterData, MASTER_DATA_PATHS } from "@/api/masterData";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import { toastWarning } from "@/lib/toast";
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
};

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
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="space-y-2 rounded-xl border p-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9"
            onChange={(event) => setQuery(event.target.value)}
            placeholder={`Cari ${label.toLowerCase()}...`}
            value={query}
          />
        </div>
        <Select
          onValueChange={(selected) => onChange(selected === emptyValue ? null : selected)}
          value={value || emptyValue}
        >
          <SelectTrigger>
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
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Memuat hasil pencarian...
          </div>
        ) : null}
      </div>
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
}: KaryawanHeadCardProps) {
  const [divisiOptions, setDivisiOptions] = useState<Divisi[]>([]);
  const [departmentOptions, setDepartmentOptions] = useState<Department[]>([]);
  const [posisiOptions, setPosisiOptions] = useState<PosisiJabatan[]>([]);
  const [statusOptions, setStatusOptions] = useState<StatusKaryawan[]>([]);
  const [lokasiOptions, setLokasiOptions] = useState<LokasiKerja[]>([]);
  const [tagOptions, setTagOptions] = useState<Tag[]>([]);
  const previousDivisiId = useRef<string | undefined>(undefined);
  const previousDepartmentId = useRef<string | undefined>(undefined);

  const divisiId = watch("divisiId");
  const departmentId = watch("departmentId");
  const statusKaryawanId = watch("statusKaryawanId");
  const tagIds = watch("tagIds") ?? [];
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
  const selectedTags = tagOptions.filter((item) => tagIds.includes(item.id));

  return (
    <Card className="sticky top-4 border-0 shadow-sm">
      <CardContent className="grid gap-6 p-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <div className="space-y-4 rounded-3xl bg-muted/40 p-5">
          <div className="flex flex-col items-center gap-4 text-center">
            <Avatar className="h-40 w-40 border-4 border-background shadow-lg">
              <AvatarImage
                alt={namaLengkap || "Karyawan"}
                src={getFotoUrl(fotoKaryawan)}
              />
              <AvatarFallback className="text-3xl font-semibold">
                {getInitials(namaLengkap || "BSI")}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="text-lg font-semibold text-foreground">
                {namaLengkap || "Nama karyawan"}
              </div>
              <div className="text-sm text-muted-foreground">
                {nomorIndukKaryawan || "Nomor induk karyawan"}
              </div>
            </div>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent/10">
              <Camera className="h-4 w-4" />
              Ganti Foto
              <input
                accept="image/png,image/jpeg"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];

                  if (!file) {
                    return;
                  }

                  const isValidType = ["image/jpeg", "image/png"].includes(file.type);
                  const isValidSize = file.size <= 2 * 1024 * 1024;

                  if (!isValidType || !isValidSize) {
                    toastWarning("Gunakan file JPG/PNG dengan ukuran maksimal 2MB.");
                    return;
                  }

                  toastWarning("Upload foto dikerjakan di fase berikutnya.");
                }}
                type="file"
              />
            </label>
          </div>

          <div className="rounded-2xl border border-dashed bg-background p-6 text-center">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <QrCode className="h-8 w-8" />
            </div>
            <div className="text-sm font-medium text-foreground">QR Code</div>
            <div className="text-xs text-muted-foreground">Placeholder fase berikutnya</div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="namaLengkap">Nama Lengkap</Label>
              <Input
                id="namaLengkap"
                {...register("namaLengkap", { required: "Nama lengkap wajib diisi." })}
              />
              {errors.namaLengkap ? (
                <p className="text-sm text-destructive">{errors.namaLengkap.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="nomorIndukKaryawan">Nomor Induk Karyawan</Label>
              <Input
                id="nomorIndukKaryawan"
                placeholder="Contoh: 02-03827"
                {...register("nomorIndukKaryawan", {
                  required: "Nomor induk karyawan wajib diisi.",
                })}
              />
              {errors.nomorIndukKaryawan ? (
                <p className="text-sm text-destructive">
                  {errors.nomorIndukKaryawan.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label>Divisi</Label>
              <Controller
                control={control}
                name="divisiId"
                rules={{ required: "Divisi wajib dipilih." }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value || undefined}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih divisi" />
                    </SelectTrigger>
                    <SelectContent>
                      {divisiOptions.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.namaDivisi}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.divisiId ? (
                <p className="text-sm text-destructive">{errors.divisiId.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label>Department</Label>
              <Controller
                control={control}
                name="departmentId"
                rules={{ required: "Department wajib dipilih." }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value || undefined}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih department" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredDepartments.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.namaDepartmen}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.departmentId ? (
                <p className="text-sm text-destructive">{errors.departmentId.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label>Posisi Jabatan</Label>
              <Controller
                control={control}
                name="posisiJabatanId"
                rules={{ required: "Posisi jabatan wajib dipilih." }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value || undefined}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih posisi jabatan" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredPosisi.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.namaPosisiJabatan}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.posisiJabatanId ? (
                <p className="text-sm text-destructive">
                  {errors.posisiJabatanId.message}
                </p>
              ) : null}
            </div>

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

            <div className="space-y-2">
              <Label htmlFor="emailPerusahaan">Email Perusahaan</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="emailPerusahaan"
                  className="pl-9"
                  type="email"
                  {...register("emailPerusahaan")}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nomorHandphone">Nomor Handphone</Label>
              <div className="relative">
                <Phone className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="nomorHandphone"
                  className="pl-9"
                  {...register("nomorHandphone")}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Status Karyawan</Label>
              <Controller
                control={control}
                name="statusKaryawanId"
                rules={{ required: "Status karyawan wajib dipilih." }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value || undefined}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status karyawan" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.namaStatus}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {selectedStatus ? (
                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                  <ShieldCheck className="mr-1 h-3.5 w-3.5" />
                  {selectedStatus.namaStatus}
                </Badge>
              ) : null}
              {errors.statusKaryawanId ? (
                <p className="text-sm text-destructive">
                  {errors.statusKaryawanId.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label>Lokasi Kerja</Label>
              <Controller
                control={control}
                name="lokasiKerjaId"
                rules={{ required: "Lokasi kerja wajib dipilih." }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value || undefined}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih lokasi kerja" />
                    </SelectTrigger>
                    <SelectContent>
                      {lokasiOptions.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.namaLokasiKerja}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.lokasiKerjaId ? (
                <p className="text-sm text-destructive">{errors.lokasiKerjaId.message}</p>
              ) : null}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Tag</Label>
              <Controller
                control={control}
                name="tagIds"
                render={({ field }) => {
                  const currentValue = field.value ?? [];

                  return (
                    <div className="space-y-3 rounded-xl border p-3">
                      <div className="flex flex-wrap gap-2">
                        {selectedTags.length > 0 ? (
                          selectedTags.map((item) => (
                            <Badge
                              key={item.id}
                              style={{
                                backgroundColor: item.warnaTag,
                                color: "#fff",
                              }}
                            >
                              {item.namaTag}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            Belum ada tag dipilih.
                          </p>
                        )}
                      </div>

                      <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                        {tagOptions.map((item) => {
                          const isSelected = currentValue.includes(item.id);

                          return (
                            <button
                              key={item.id}
                              className={`flex items-center justify-between rounded-xl border px-3 py-2 text-left text-sm transition ${
                                isSelected
                                  ? "border-primary bg-primary/5 text-foreground"
                                  : "border-border bg-background text-muted-foreground hover:bg-accent/10"
                              }`}
                              onClick={() => {
                                const nextValue = isSelected
                                  ? currentValue.filter((tagId) => tagId !== item.id)
                                  : [...currentValue, item.id];

                                field.onChange(nextValue);
                              }}
                              type="button"
                            >
                              <span className="flex items-center gap-2">
                                <span
                                  className="h-3 w-3 rounded-full"
                                  style={{ backgroundColor: item.warnaTag }}
                                />
                                <span>{item.namaTag}</span>
                              </span>
                              {isSelected ? <Check className="h-4 w-4 text-primary" /> : null}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
