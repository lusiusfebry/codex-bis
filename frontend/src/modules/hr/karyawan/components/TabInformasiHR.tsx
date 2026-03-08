import { useEffect, useMemo, useState, type KeyboardEvent } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import {
  Controller,
  useFieldArray,
  useWatch,
  type Control,
  type FieldErrors,
  type UseFormRegister,
  type UseFormWatch,
} from "react-hook-form";

import { fetchMasterData, MASTER_DATA_PATHS } from "@/api/masterData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

  return <p className="text-sm text-destructive">{message}</p>;
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
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
    <div className="relative space-y-2">
      <button
        className="flex w-full items-center justify-between rounded-xl border bg-background px-3 py-2 text-left text-sm text-foreground"
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
        <div className="absolute z-20 w-full rounded-xl border bg-background p-2 shadow-lg">
          <div className="relative mb-2">
            <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              autoFocus
              className="pl-9"
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
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm ${
                      isHighlighted ? "bg-accent/10 text-foreground" : "text-muted-foreground"
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
                    {isSelected ? <Check className="h-4 w-4 text-primary" /> : null}
                  </button>
                );
              })
            ) : (
              <div className="px-3 py-2 text-sm text-muted-foreground">Data tidak ditemukan.</div>
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

  return (
    <div className="space-y-6">
      <Section title="Kepegawaian">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>NIK</Label>
            <Input readOnly value={watch("nomorIndukKaryawan") || ""} />
          </div>
          <div className="space-y-2">
            <Label>Posisi Jabatan</Label>
            <Input readOnly value={selectedPosisi} />
          </div>
          <div className="space-y-2">
            <Label>Divisi</Label>
            <Input readOnly value={selectedDivisi} />
          </div>
          <div className="space-y-2">
            <Label>Department</Label>
            <Input readOnly value={selectedDepartment} />
          </div>
          <div className="space-y-2">
            <Label>Email Perusahaan</Label>
            <Input readOnly value={watch("emailPerusahaan") || ""} />
          </div>
          <div className="space-y-2">
            <Label>Manager</Label>
            <Input readOnly value={watch("managerNik") || ""} />
          </div>
          <div className="space-y-2">
            <Label>Atasan Langsung</Label>
            <Input readOnly value={watch("atasanLangsungNik") || ""} />
          </div>
        </div>
      </Section>

      <Section title="Kontrak">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div className="space-y-2">
            <Label>Jenis Hubungan Kerja</Label>
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

          <div className="space-y-2">
            <Label htmlFor="tanggalMasukGroup">Tanggal Masuk Group</Label>
            <Input id="tanggalMasukGroup" type="date" {...register("tanggalMasukGroup")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tanggalMasuk">Tanggal Masuk</Label>
            <Input id="tanggalMasuk" type="date" {...register("tanggalMasuk")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tanggalPermanent">Tanggal Permanent</Label>
            <Input id="tanggalPermanent" type="date" {...register("tanggalPermanent")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tanggalKontrak">Tanggal Kontrak</Label>
            <Input id="tanggalKontrak" type="date" {...register("tanggalKontrak")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tanggalAkhirKontrak">Tanggal Akhir Kontrak</Label>
            <Input
              id="tanggalAkhirKontrak"
              type="date"
              {...register("tanggalAkhirKontrak")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tanggalBerhenti">Tanggal Berhenti</Label>
            <Input id="tanggalBerhenti" type="date" {...register("tanggalBerhenti")} />
          </div>
        </div>
      </Section>

      <Section title="Education">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="tingkatPendidikan">Tingkat Pendidikan</Label>
            <Input id="tingkatPendidikan" {...register("tingkatPendidikan")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bidangStudi">Bidang Studi</Label>
            <Input id="bidangStudi" {...register("bidangStudi")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="namaSekolah">Nama Sekolah</Label>
            <Input id="namaSekolah" {...register("namaSekolah")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="kotaSekolah">Kota Sekolah</Label>
            <Input id="kotaSekolah" {...register("kotaSekolah")} />
          </div>
          <div className="space-y-2">
            <Label>Status Kelulusan</Label>
            <Controller
              control={control}
              name="statusKelulusan"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status kelulusan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Lulus">Lulus</SelectItem>
                    <SelectItem value="Tidak Lulus">Tidak Lulus</SelectItem>
                    <SelectItem value="Sedang Studi">Sedang Studi</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="space-y-2 md:col-span-2 xl:col-span-3">
            <Label htmlFor="keteranganPendidikan">Keterangan</Label>
            <Textarea id="keteranganPendidikan" {...register("keteranganPendidikan")} />
          </div>
        </div>
      </Section>

      <Section title="Pangkat dan Golongan">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="space-y-2">
            <Label>Kategori Pangkat</Label>
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
          <div className="space-y-2">
            <Label>Golongan</Label>
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
          <div className="space-y-2">
            <Label>Sub Golongan</Label>
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
          <div className="space-y-2">
            <Label htmlFor="noDanaPensiun">No Dana Pensiun</Label>
            <Input id="noDanaPensiun" {...register("noDanaPensiun")} />
          </div>
        </div>
      </Section>

      <Section title="Kontak Darurat">
        <div className="grid gap-4 md:grid-cols-2">
          {fields.map((field, index) => (
            <Card key={field.id} className="border border-border/60 shadow-none">
              <CardHeader>
                <CardTitle className="text-base">Kontak {index + 1}</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <input
                  type="hidden"
                  {...register(`kontakDarurat.${index}.urutan`, { valueAsNumber: true })}
                />
                <div className="space-y-2">
                  <Label htmlFor={`kontakDarurat-${index}-nama`}>Nama</Label>
                  <Input id={`kontakDarurat-${index}-nama`} {...register(`kontakDarurat.${index}.nama`)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`kontakDarurat-${index}-nomorTelepon`}>No. Telepon</Label>
                  <Input
                    id={`kontakDarurat-${index}-nomorTelepon`}
                    {...register(`kontakDarurat.${index}.nomorTelepon`)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`kontakDarurat-${index}-hubungan`}>Hubungan</Label>
                  <Input
                    id={`kontakDarurat-${index}-hubungan`}
                    {...register(`kontakDarurat.${index}.hubungan`)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`kontakDarurat-${index}-alamat`}>Alamat</Label>
                  <Textarea
                    id={`kontakDarurat-${index}-alamat`}
                    {...register(`kontakDarurat.${index}.alamat`)}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="POO/POH">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="pointOfOriginal">Point of Original</Label>
            <Input id="pointOfOriginal" {...register("pointOfOriginal")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pointOfHire">Point of Hire</Label>
            <Input id="pointOfHire" {...register("pointOfHire")} />
          </div>
        </div>
      </Section>

      <Section title="Seragam dan Sepatu Kerja">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="ukuranSeragamKerja">Ukuran Seragam Kerja</Label>
            <Input id="ukuranSeragamKerja" {...register("ukuranSeragamKerja")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ukuranSepatuKerja">Ukuran Sepatu Kerja</Label>
            <Input id="ukuranSepatuKerja" {...register("ukuranSepatuKerja")} />
          </div>
        </div>
      </Section>

      <Section title="Pergerakan Karyawan">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Lokasi Sebelumnya</Label>
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
          <div className="space-y-2">
            <Label htmlFor="tanggalMutasi">Tanggal Mutasi</Label>
            <Input id="tanggalMutasi" type="date" {...register("tanggalMutasi")} />
          </div>
        </div>
      </Section>

      <Section title="Costing">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="siklusPembayaranGaji">Siklus Pembayaran Gaji</Label>
            <Input id="siklusPembayaranGaji" {...register("siklusPembayaranGaji")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="costing">Costing</Label>
            <Input id="costing" {...register("costing")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="assign">Assign</Label>
            <Input id="assign" {...register("assign")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="actual">Actual</Label>
            <Input id="actual" {...register("actual")} />
          </div>
        </div>
      </Section>

      <FieldError message={errors.jenisHubunganKerjaId?.message} />
    </div>
  );
}
