import { useEffect, useMemo, useState, type KeyboardEvent } from "react";
import {
  Award,
  Briefcase,
  Building2,
  Check,
  ChevronDown,
  Clock,
  DollarSign,
  GraduationCap,
  MapPinned,
  Phone,
  Search,
  Shirt,
} from "lucide-react";
import {
  Controller,
  useFieldArray,
  useWatch,
  type Control,
  type FieldErrors,
  type UseFormRegister,
  type UseFormWatch,
} from "react-hook-form";

import { searchKaryawanActiveApi } from "@/api/karyawan";
import { fetchMasterData, MASTER_DATA_PATHS } from "@/api/masterData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type {
  Department,
  Divisi,
  Golongan,
  JenisHubunganKerja,
  KategoriPangkat,
  LokasiKerja,
  PosisiJabatan,
  SubGolongan,
} from "@/types/masterData";
import type { KaryawanFormPayload } from "@/types/karyawan";

type TabInformasiHRProps = {
  control: Control<KaryawanFormPayload>;
  register: UseFormRegister<KaryawanFormPayload>;
  watch: UseFormWatch<KaryawanFormPayload>;
  errors: FieldErrors<KaryawanFormPayload>;
};

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="text-xs text-destructive">{message}</p>;
}

function Section({
  title,
  icon,
  accentColor = "border-l-primary/60",
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  accentColor?: string;
  children: React.ReactNode;
}) {
  return (
    <Card className={`border-l-[3px] shadow-sm transition-shadow hover:shadow-md ${accentColor}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2.5 text-base">
          {icon ? (
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              {icon}
            </span>
          ) : null}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

type SearchableOption = {
  id: string;
  label: string;
};

const EMPTY_KONTAK_DARURAT: KaryawanFormPayload["kontakDarurat"] = [];

function SearchableMasterSelect({
  options,
  placeholder,
  searchPlaceholder,
  value,
  onChange,
}: {
  options: SearchableOption[];
  placeholder: string;
  searchPlaceholder: string;
  value?: string | null;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const selectedOption = options.find((item) => item.id === value);
  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return options;
    }

    return options.filter((item) => item.label.toLowerCase().includes(normalizedQuery));
  }, [options, query]);
  const effectiveHighlightedIndex = Math.min(
    highlightedIndex,
    Math.max(filteredOptions.length - 1, 0),
  );

  const closeDropdown = () => {
    setOpen(false);
    setQuery("");
    setHighlightedIndex(0);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!open && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
      setOpen(true);
      event.preventDefault();
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightedIndex((current) =>
        Math.min(current + 1, Math.max(filteredOptions.length - 1, 0)),
      );
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedIndex((current) => Math.max(current - 1, 0));
    }

    if (event.key === "Enter" && filteredOptions[effectiveHighlightedIndex]) {
      event.preventDefault();
      onChange(filteredOptions[effectiveHighlightedIndex].id);
      closeDropdown();
    }

    if (event.key === "Escape") {
      closeDropdown();
    }
  };

  return (
    <div className="relative space-y-1.5">
      <button
        className="flex w-full items-center justify-between rounded-lg border bg-background px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-muted/30"
        onClick={() => {
          if (open) {
            closeDropdown();
            return;
          }

          setOpen(true);
        }}
        type="button"
      >
        <span className={selectedOption ? "text-foreground" : "text-muted-foreground"}>
          {selectedOption?.label ?? placeholder}
        </span>
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </button>

      {open ? (
        <div className="absolute z-20 w-full rounded-lg border bg-background p-1.5 shadow-lg">
          <div className="relative mb-1.5">
            <Search className="pointer-events-none absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              autoFocus
              className="h-8 pl-8 text-sm"
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={searchPlaceholder}
              value={query}
            />
          </div>
          <div className="max-h-56 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((item, index) => {
                const isSelected = item.id === value;
                const isHighlighted = index === effectiveHighlightedIndex;

                return (
                  <button
                    key={item.id}
                    className={`flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-sm transition-colors ${isHighlighted ? "bg-accent/10 text-foreground" : "text-muted-foreground hover:bg-muted/30"
                      }`}
                    onMouseDown={(event) => event.preventDefault()}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    onClick={() => {
                      onChange(item.id);
                      closeDropdown();
                    }}
                    type="button"
                  >
                    <span>{item.label}</span>
                    {isSelected ? <Check className="h-3.5 w-3.5 text-primary" /> : null}
                  </button>
                );
              })
            ) : (
              <div className="px-2.5 py-2 text-sm text-muted-foreground">Data tidak ditemukan.</div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

type MasterOptionsState = {
  jenisHubunganKerja: JenisHubunganKerja[];
  kategoriPangkat: KategoriPangkat[];
  golongan: Golongan[];
  subGolongan: SubGolongan[];
  lokasiKerja: LokasiKerja[];
  divisi: Divisi[];
  department: Department[];
  posisiJabatan: PosisiJabatan[];
};

export function TabInformasiHR({
  control,
  register,
  watch,
  errors,
}: TabInformasiHRProps) {
  const [managerLabel, setManagerLabel] = useState("");
  const [atasanLangsungLabel, setAtasanLangsungLabel] = useState("");
  const [options, setOptions] = useState<MasterOptionsState>({
    jenisHubunganKerja: [],
    kategoriPangkat: [],
    golongan: [],
    subGolongan: [],
    lokasiKerja: [],
    divisi: [],
    department: [],
    posisiJabatan: [],
  });
  const { fields, replace } = useFieldArray({
    control,
    name: "kontakDarurat",
  });

  const watchedKontakDarurat =
    useWatch({
      control,
      name: "kontakDarurat",
    }) ?? EMPTY_KONTAK_DARURAT;
  const divisiId = useWatch({ control, name: "divisiId" });
  const departmentId = useWatch({ control, name: "departmentId" });
  const posisiJabatanId = useWatch({ control, name: "posisiJabatanId" });
  const managerNik = useWatch({ control, name: "managerNik" });
  const atasanLangsungNik = useWatch({ control, name: "atasanLangsungNik" });

  useEffect(() => {
    const loadOptions = async () => {
      const [
        jenisHubunganKerja,
        kategoriPangkat,
        golongan,
        subGolongan,
        lokasiKerja,
        divisi,
        department,
        posisiJabatan,
      ] = await Promise.all([
        fetchMasterData<JenisHubunganKerja>(MASTER_DATA_PATHS.jenisHubunganKerja, {
          status: "Aktif",
        }),
        fetchMasterData<KategoriPangkat>(MASTER_DATA_PATHS.kategoriPangkat, {
          status: "Aktif",
        }),
        fetchMasterData<Golongan>(MASTER_DATA_PATHS.golongan, { status: "Aktif" }),
        fetchMasterData<SubGolongan>(MASTER_DATA_PATHS.subGolongan, {
          status: "Aktif",
        }),
        fetchMasterData<LokasiKerja>(MASTER_DATA_PATHS.lokasiKerja, { status: "Aktif" }),
        fetchMasterData<Divisi>(MASTER_DATA_PATHS.divisi, { status: "Aktif" }),
        fetchMasterData<Department>(MASTER_DATA_PATHS.department, { status: "Aktif" }),
        fetchMasterData<PosisiJabatan>(MASTER_DATA_PATHS.posisiJabatan, {
          status: "Aktif",
        }),
      ]);

      setOptions({
        jenisHubunganKerja: jenisHubunganKerja.data,
        kategoriPangkat: kategoriPangkat.data,
        golongan: golongan.data,
        subGolongan: subGolongan.data,
        lokasiKerja: lokasiKerja.data,
        divisi: divisi.data,
        department: department.data,
        posisiJabatan: posisiJabatan.data,
      });
    };

    void loadOptions();
  }, []);

  useEffect(() => {
    const normalizedKontakDarurat = [0, 1].map((index) => ({
      ...(watchedKontakDarurat[index] ?? {}),
      urutan: index + 1,
    }));

    const needsReplace =
      watchedKontakDarurat.length !== 2 ||
      watchedKontakDarurat.some((item, index) => item?.urutan !== index + 1);

    if (needsReplace) {
      replace(normalizedKontakDarurat);
    }
  }, [replace, watchedKontakDarurat]);

  useEffect(() => {
    let active = true;

    const loadReferenceLabels = async () => {
      const [managerResult, atasanResult] = await Promise.all([
        managerNik ? searchKaryawanActiveApi(managerNik, "manager") : Promise.resolve([]),
        atasanLangsungNik ? searchKaryawanActiveApi(atasanLangsungNik, "atasan") : Promise.resolve([]),
      ]);

      if (!active) {
        return;
      }

      const manager = managerResult.find((item) => item.nomorIndukKaryawan === managerNik);
      const atasan = atasanResult.find(
        (item) => item.nomorIndukKaryawan === atasanLangsungNik,
      );

      setManagerLabel(
        manager ? `${manager.namaLengkap} · ${manager.nomorIndukKaryawan}` : managerNik || "",
      );
      setAtasanLangsungLabel(
        atasan ? `${atasan.namaLengkap} · ${atasan.nomorIndukKaryawan}` : atasanLangsungNik || "",
      );
    };

    void loadReferenceLabels();

    return () => {
      active = false;
    };
  }, [atasanLangsungNik, managerNik]);

  const selectedDivisi = useMemo(
    () => options.divisi.find((item) => item.id === divisiId)?.namaDivisi ?? "",
    [divisiId, options.divisi],
  );
  const selectedDepartment = useMemo(
    () => options.department.find((item) => item.id === departmentId)?.namaDepartmen ?? "",
    [departmentId, options.department],
  );
  const selectedPosisi = useMemo(
    () =>
      options.posisiJabatan.find((item) => item.id === posisiJabatanId)?.namaPosisiJabatan ??
      "",
    [options.posisiJabatan, posisiJabatanId],
  );
  const jenisHubunganKerjaOptions = useMemo<SearchableOption[]>(
    () =>
      options.jenisHubunganKerja.map((item) => ({
        id: item.id,
        label: item.namaJenisHubunganKerja,
      })),
    [options.jenisHubunganKerja],
  );
  const kategoriPangkatOptions = useMemo<SearchableOption[]>(
    () =>
      options.kategoriPangkat.map((item) => ({
        id: item.id,
        label: item.namaKategoriPangkat,
      })),
    [options.kategoriPangkat],
  );
  const golonganOptions = useMemo<SearchableOption[]>(
    () =>
      options.golongan.map((item) => ({
        id: item.id,
        label: item.namaGolongan,
      })),
    [options.golongan],
  );
  const subGolonganOptions = useMemo<SearchableOption[]>(
    () =>
      options.subGolongan.map((item) => ({
        id: item.id,
        label: item.namaSubGolongan,
      })),
    [options.subGolongan],
  );
  const lokasiSebelumnyaOptions = useMemo<SearchableOption[]>(
    () =>
      options.lokasiKerja.map((item) => ({
        id: item.id,
        label: item.namaLokasiKerja,
      })),
    [options.lokasiKerja],
  );
  const statusKelulusanOptions = useMemo<SearchableOption[]>(
    () => [
      { id: "Lulus", label: "Lulus" },
      { id: "Tidak Lulus", label: "Tidak Lulus" },
      { id: "Sedang Studi", label: "Sedang Studi" },
    ],
    [],
  );

  return (
    <div className="space-y-5">
      <Section title="Kepegawaian" icon={<Building2 className="h-3.5 w-3.5" />} accentColor="border-l-blue-500/60">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Nomor Induk Karyawan</Label>
            <Input readOnly className="bg-muted/30" value={watch("nomorIndukKaryawan") || ""} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Posisi Jabatan</Label>
            <Input readOnly className="bg-muted/30" value={selectedPosisi} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Divisi</Label>
            <Input readOnly className="bg-muted/30" value={selectedDivisi} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Department</Label>
            <Input readOnly className="bg-muted/30" value={selectedDepartment} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Email Perusahaan</Label>
            <Input readOnly className="bg-muted/30" value={watch("emailPerusahaan") || ""} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Manager</Label>
            <Input readOnly className="bg-muted/30" value={managerLabel} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Atasan Langsung</Label>
            <Input readOnly className="bg-muted/30" value={atasanLangsungLabel} />
          </div>
        </div>
      </Section>

      <Section title="Kontrak" icon={<Clock className="h-3.5 w-3.5" />} accentColor="border-l-amber-500/60">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Jenis Hubungan Kerja</Label>
            <Controller
              control={control}
              name="jenisHubunganKerjaId"
              render={({ field }) => (
                <SearchableMasterSelect
                  onChange={field.onChange}
                  options={jenisHubunganKerjaOptions}
                  placeholder="Pilih jenis hubungan kerja"
                  searchPlaceholder="Cari jenis hubungan kerja..."
                  value={field.value}
                />
              )}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground" htmlFor="tanggalMasukGroup">Tanggal Masuk Group</Label>
            <Input id="tanggalMasukGroup" type="date" {...register("tanggalMasukGroup")} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground" htmlFor="tanggalMasuk">Tanggal Masuk</Label>
            <Input id="tanggalMasuk" type="date" {...register("tanggalMasuk")} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground" htmlFor="tanggalPermanent">Tanggal Permanent</Label>
            <Input id="tanggalPermanent" type="date" {...register("tanggalPermanent")} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground" htmlFor="tanggalKontrak">Tanggal Kontrak</Label>
            <Input id="tanggalKontrak" type="date" {...register("tanggalKontrak")} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground" htmlFor="tanggalAkhirKontrak">Tanggal Akhir Kontrak</Label>
            <Input
              id="tanggalAkhirKontrak"
              type="date"
              {...register("tanggalAkhirKontrak")}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground" htmlFor="tanggalBerhenti">Tanggal Berhenti</Label>
            <Input id="tanggalBerhenti" type="date" {...register("tanggalBerhenti")} />
          </div>
        </div>
      </Section>

      <Section title="Education" icon={<GraduationCap className="h-3.5 w-3.5" />} accentColor="border-l-emerald-500/60">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground" htmlFor="tingkatPendidikan">Tingkat Pendidikan</Label>
            <Input id="tingkatPendidikan" {...register("tingkatPendidikan")} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground" htmlFor="bidangStudi">Bidang Studi</Label>
            <Input id="bidangStudi" {...register("bidangStudi")} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground" htmlFor="namaSekolah">Nama Sekolah</Label>
            <Input id="namaSekolah" {...register("namaSekolah")} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground" htmlFor="kotaSekolah">Kota Sekolah</Label>
            <Input id="kotaSekolah" {...register("kotaSekolah")} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Status Kelulusan</Label>
            <Controller
              control={control}
              name="statusKelulusan"
              render={({ field }) => (
                <SearchableMasterSelect
                  onChange={field.onChange}
                  options={statusKelulusanOptions}
                  placeholder="Pilih status kelulusan"
                  searchPlaceholder="Cari status kelulusan..."
                  value={field.value}
                />
              )}
            />
          </div>
          <div className="space-y-1.5 md:col-span-2 lg:col-span-3">
            <Label className="text-xs font-medium text-muted-foreground" htmlFor="keteranganPendidikan">Keterangan</Label>
            <Textarea id="keteranganPendidikan" rows={2} {...register("keteranganPendidikan")} />
          </div>
        </div>
      </Section>

      <Section title="Pangkat dan Golongan" icon={<Award className="h-3.5 w-3.5" />} accentColor="border-l-violet-500/60">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Kategori Pangkat</Label>
            <Controller
              control={control}
              name="kategoriPangkatId"
              render={({ field }) => (
                <SearchableMasterSelect
                  onChange={field.onChange}
                  options={kategoriPangkatOptions}
                  placeholder="Pilih kategori pangkat"
                  searchPlaceholder="Cari kategori pangkat..."
                  value={field.value}
                />
              )}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Golongan Pangkat</Label>
            <Controller
              control={control}
              name="golonganId"
              render={({ field }) => (
                <SearchableMasterSelect
                  onChange={field.onChange}
                  options={golonganOptions}
                  placeholder="Pilih golongan"
                  searchPlaceholder="Cari golongan..."
                  value={field.value}
                />
              )}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Sub Golongan Pangkat</Label>
            <Controller
              control={control}
              name="subGolonganId"
              render={({ field }) => (
                <SearchableMasterSelect
                  onChange={field.onChange}
                  options={subGolonganOptions}
                  placeholder="Pilih sub golongan"
                  searchPlaceholder="Cari sub golongan..."
                  value={field.value}
                />
              )}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground" htmlFor="noDanaPensiun">No Dana Pensiun</Label>
            <Input id="noDanaPensiun" {...register("noDanaPensiun")} />
          </div>
        </div>
      </Section>

      <Section title="Kontak Darurat" icon={<Phone className="h-3.5 w-3.5" />} accentColor="border-l-rose-500/60">
        <div className="grid gap-4 md:grid-cols-2">
          {fields.map((field, index) => (
            <Card key={field.id} className="border border-border/60 shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-50 text-xs font-semibold text-rose-600">
                    {index + 1}
                  </span>
                  Kontak Darurat {index + 1}
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                <input
                  type="hidden"
                  {...register(`kontakDarurat.${index}.urutan`, { valueAsNumber: true })}
                />
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground" htmlFor={`kontakDarurat-${index}-nama`}>
                    Nama
                  </Label>
                  <Input id={`kontakDarurat-${index}-nama`} {...register(`kontakDarurat.${index}.nama`)} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground" htmlFor={`kontakDarurat-${index}-nomorTelepon`}>
                    Nomor Telepon
                  </Label>
                  <Input
                    id={`kontakDarurat-${index}-nomorTelepon`}
                    {...register(`kontakDarurat.${index}.nomorTelepon`)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground" htmlFor={`kontakDarurat-${index}-hubungan`}>
                    Hubungan
                  </Label>
                  <Input
                    id={`kontakDarurat-${index}-hubungan`}
                    {...register(`kontakDarurat.${index}.hubungan`)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground" htmlFor={`kontakDarurat-${index}-alamat`}>
                    Alamat
                  </Label>
                  <Textarea
                    id={`kontakDarurat-${index}-alamat`}
                    rows={2}
                    {...register(`kontakDarurat.${index}.alamat`)}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="POO/POH" icon={<Briefcase className="h-3.5 w-3.5" />} accentColor="border-l-sky-500/60">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground" htmlFor="pointOfOriginal">Point of Original</Label>
            <Input id="pointOfOriginal" {...register("pointOfOriginal")} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground" htmlFor="pointOfHire">Point of Hire</Label>
            <Input id="pointOfHire" {...register("pointOfHire")} />
          </div>
        </div>
      </Section>

      <Section title="Seragam dan Sepatu Kerja" icon={<Shirt className="h-3.5 w-3.5" />} accentColor="border-l-indigo-500/60">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground" htmlFor="ukuranSeragamKerja">Ukuran Seragam Kerja</Label>
            <Input id="ukuranSeragamKerja" {...register("ukuranSeragamKerja")} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground" htmlFor="ukuranSepatuKerja">Ukuran Sepatu Kerja</Label>
            <Input id="ukuranSepatuKerja" {...register("ukuranSepatuKerja")} />
          </div>
        </div>
      </Section>

      <Section title="Pergerakan Karyawan" icon={<MapPinned className="h-3.5 w-3.5" />} accentColor="border-l-teal-500/60">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Lokasi Sebelumnya</Label>
            <Controller
              control={control}
              name="lokasiSebelumnyaId"
              render={({ field }) => (
                <SearchableMasterSelect
                  onChange={field.onChange}
                  options={lokasiSebelumnyaOptions}
                  placeholder="Pilih lokasi sebelumnya"
                  searchPlaceholder="Cari lokasi sebelumnya..."
                  value={field.value}
                />
              )}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground" htmlFor="tanggalMutasi">Tanggal Mutasi</Label>
            <Input id="tanggalMutasi" type="date" {...register("tanggalMutasi")} />
          </div>
        </div>
      </Section>

      <Section title="Costing" icon={<DollarSign className="h-3.5 w-3.5" />} accentColor="border-l-orange-500/60">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground" htmlFor="siklusPembayaranGaji">Siklus Pembayaran Gaji</Label>
            <Input id="siklusPembayaranGaji" {...register("siklusPembayaranGaji")} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground" htmlFor="costing">Costing</Label>
            <Input id="costing" {...register("costing")} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground" htmlFor="assign">Assign</Label>
            <Input id="assign" {...register("assign")} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground" htmlFor="actual">Actual</Label>
            <Input id="actual" {...register("actual")} />
          </div>
        </div>
      </Section>

      <FieldError message={errors.jenisHubunganKerjaId?.message} />
    </div>
  );
}
