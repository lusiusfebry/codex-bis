import { useEffect, useMemo, useState, type KeyboardEvent } from "react";
import {
  Baby,
  Check,
  ChevronDown,
  Heart,
  Search,
  Trash2,
  UserRound,
  Users,
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

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { KaryawanFormPayload } from "@/types/karyawan";

type TabInformasiKeluargaProps = {
  control: Control<KaryawanFormPayload>;
  register: UseFormRegister<KaryawanFormPayload>;
  watch: UseFormWatch<KaryawanFormPayload>;
  errors: FieldErrors<KaryawanFormPayload>;
};

const EMPTY_ANAK: KaryawanFormPayload["anak"] = [];
const EMPTY_SAUDARA_KANDUNG: KaryawanFormPayload["saudaraKandung"] = [];

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

function SearchableStringSelect({
  value,
  onChange,
  options,
  placeholder,
  searchPlaceholder,
}: {
  value?: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
  searchPlaceholder: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return options;
    }

    return options.filter((item) => item.toLowerCase().includes(normalizedQuery));
  }, [options, query]);

  const selectedValue = value || "";
  const effectiveHighlightedIndex = Math.min(highlightedIndex, Math.max(filteredOptions.length - 1, 0));

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
      setHighlightedIndex((current) => Math.min(current + 1, Math.max(filteredOptions.length - 1, 0)));
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedIndex((current) => Math.max(current - 1, 0));
    }

    if (event.key === "Enter" && filteredOptions[effectiveHighlightedIndex]) {
      event.preventDefault();
      onChange(filteredOptions[effectiveHighlightedIndex]);
      closeDropdown();
    }

    if (event.key === "Escape") {
      closeDropdown();
    }
  };

  return (
    <div className="relative">
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
        <span className={selectedValue ? "text-foreground" : "text-muted-foreground"}>
          {selectedValue || placeholder}
        </span>
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </button>

      {open ? (
        <div className="absolute z-20 mt-1.5 w-full rounded-lg border bg-background p-1.5 shadow-lg">
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
              filteredOptions.map((item, index) => (
                <button
                  key={item}
                  className={`flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-sm transition-colors ${index === effectiveHighlightedIndex ? "bg-accent/10 text-foreground" : "text-muted-foreground hover:bg-muted/30"
                    }`}
                  onClick={() => {
                    onChange(item);
                    closeDropdown();
                  }}
                  onMouseDown={(event) => event.preventDefault()}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  type="button"
                >
                  <span>{item}</span>
                  {item === selectedValue ? <Check className="h-3.5 w-3.5 text-primary" /> : null}
                </button>
              ))
            ) : (
              <div className="px-2.5 py-2 text-sm text-muted-foreground">Data tidak ditemukan.</div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function TabInformasiKeluarga({
  control,
  register,
  watch,
}: TabInformasiKeluargaProps) {
  const {
    fields: anakFields,
    append: appendAnak,
    remove: removeAnak,
    replace: replaceAnak,
  } = useFieldArray({
    control,
    name: "anak",
  });
  const {
    fields: saudaraFields,
    replace: replaceSaudara,
  } = useFieldArray({
    control,
    name: "saudaraKandung",
  });

  const watchedJumlahAnak = useWatch({
    control,
    name: "jumlahAnak",
  });
  const watchedAnak =
    useWatch({
      control,
      name: "anak",
    }) ?? EMPTY_ANAK;
  const watchedSaudaraKandung =
    useWatch({
      control,
      name: "saudaraKandung",
    }) ?? EMPTY_SAUDARA_KANDUNG;
  const jumlahAnak = Number(watchedJumlahAnak ?? 0);
  const targetJumlahAnak = Math.max(0, Number.isNaN(jumlahAnak) ? 0 : jumlahAnak);

  useEffect(() => {
    if (anakFields.length < targetJumlahAnak) {
      for (let index = anakFields.length; index < targetJumlahAnak; index += 1) {
        appendAnak({ urutan: index + 1 });
      }
      return;
    }

    if (anakFields.length > targetJumlahAnak) {
      removeAnak(
        Array.from(
          { length: anakFields.length - targetJumlahAnak },
          (_, index) => anakFields.length - 1 - index,
        ),
      );
    }
  }, [anakFields.length, appendAnak, removeAnak, targetJumlahAnak]);

  useEffect(() => {
    const normalizedAnak = watchedAnak.map((item, index) => ({
      ...item,
      urutan: index + 1,
    }));
    const needsReplace = normalizedAnak.some(
      (item, index) => watchedAnak[index]?.urutan !== item.urutan,
    );

    if (needsReplace) {
      replaceAnak(normalizedAnak);
    }
  }, [replaceAnak, watchedAnak]);

  useEffect(() => {
    const normalizedSaudaraKandung = watchedSaudaraKandung.map((item, index) => ({
      ...item,
      urutan: index + 1,
    }));
    const needsReplace = normalizedSaudaraKandung.some(
      (item, index) => watchedSaudaraKandung[index]?.urutan !== item.urutan,
    );

    if (needsReplace) {
      replaceSaudara(normalizedSaudaraKandung);
    }
  }, [replaceSaudara, watchedSaudaraKandung]);

  const handleAppendSaudara = () => {
    if (saudaraFields.length >= 5) {
      return;
    }

    replaceSaudara([
      ...watchedSaudaraKandung.map((item, index) => ({
        ...item,
        urutan: index + 1,
      })),
      { urutan: watchedSaudaraKandung.length + 1 },
    ]);
  };

  const handleRemoveSaudara = (index: number) => {
    replaceSaudara(
      watchedSaudaraKandung
        .filter((_, itemIndex) => itemIndex !== index)
        .map((item, itemIndex) => ({
          ...item,
          urutan: itemIndex + 1,
        })),
    );
  };

  return (
    <div className="space-y-5">
      <Section title="Pasangan dan Anak" icon={<Heart className="h-3.5 w-3.5" />} accentColor="border-l-rose-500/60">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Nama Pasangan</Label>
            <Input readOnly className="bg-muted/30" value={watch("namaPasangan") || ""} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground" htmlFor="keluarga-tanggalLahirPasangan">Tanggal Lahir Pasangan</Label>
            <Input
              id="keluarga-tanggalLahirPasangan"
              type="date"
              {...register("keluarga.tanggalLahirPasangan")}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground" htmlFor="keluarga-pendidikanTerakhirPasangan">Pendidikan Terakhir Pasangan</Label>
            <Input
              id="keluarga-pendidikanTerakhirPasangan"
              {...register("keluarga.pendidikanTerakhirPasangan")}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Pekerjaan Pasangan</Label>
            <Input readOnly className="bg-muted/30" value={watch("pekerjaanPasangan") || ""} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Jumlah Anak</Label>
            <Input readOnly className="bg-muted/30" value={watch("jumlahAnak") ?? ""} />
          </div>
          <div className="space-y-1.5 md:col-span-2 lg:col-span-3">
            <Label className="text-xs font-medium text-muted-foreground" htmlFor="keluarga-keteranganPasangan">Keterangan Pasangan</Label>
            <Textarea
              id="keluarga-keteranganPasangan"
              rows={2}
              {...register("keluarga.keteranganPasangan")}
            />
          </div>
        </div>
      </Section>

      <Section title="Identitas Anak" icon={<Baby className="h-3.5 w-3.5" />} accentColor="border-l-amber-500/60">
        <div className="space-y-4">
          {anakFields.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 rounded-lg bg-muted/30 py-8 text-center">
              <Baby className="h-8 w-8 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                Jumlah anak belum diisi atau bernilai 0.
              </p>
            </div>
          ) : null}
          {anakFields.map((field, index) => (
            <Card key={field.id} className="border border-border/60 shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-50 text-xs font-semibold text-amber-600">
                    {index + 1}
                  </span>
                  Anak ke-{index + 1}
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-2">
                <input
                  type="hidden"
                  {...register(`anak.${index}.urutan`, { valueAsNumber: true })}
                />
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground" htmlFor={`anak-${index}-namaAnak`}>Nama Anak</Label>
                  <Input id={`anak-${index}-namaAnak`} {...register(`anak.${index}.namaAnak`)} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">Jenis Kelamin</Label>
                  <Controller
                    control={control}
                    name={`anak.${index}.jenisKelaminAnak`}
                    render={({ field: controllerField }) => (
                      <SearchableStringSelect
                        onChange={controllerField.onChange}
                        options={["Laki-laki", "Perempuan"]}
                        placeholder="Pilih jenis kelamin"
                        searchPlaceholder="Cari jenis kelamin..."
                        value={controllerField.value || ""}
                      />
                    )}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground" htmlFor={`anak-${index}-tanggalLahirAnak`}>Tanggal Lahir</Label>
                  <Input
                    id={`anak-${index}-tanggalLahirAnak`}
                    type="date"
                    {...register(`anak.${index}.tanggalLahirAnak`)}
                  />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <Label className="text-xs font-medium text-muted-foreground" htmlFor={`anak-${index}-keteranganAnak`}>Keterangan Anak</Label>
                  <Textarea
                    id={`anak-${index}-keteranganAnak`}
                    rows={2}
                    {...register(`anak.${index}.keteranganAnak`)}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Saudara Kandung" icon={<UserRound className="h-3.5 w-3.5" />} accentColor="border-l-emerald-500/60">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground" htmlFor="anakKe">Anak Ke</Label>
            <Input id="anakKe" type="number" {...register("anakKe", { valueAsNumber: true })} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground" htmlFor="jumlahSaudaraKandung">Jumlah Saudara Kandung</Label>
            <Input
              id="jumlahSaudaraKandung"
              type="number"
              {...register("jumlahSaudaraKandung", { valueAsNumber: true })}
            />
          </div>
        </div>
      </Section>

      <Section title="Identitas Saudara Kandung" icon={<Users className="h-3.5 w-3.5" />} accentColor="border-l-sky-500/60">
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button
              className="gap-2 rounded-lg"
              disabled={saudaraFields.length >= 5}
              onClick={handleAppendSaudara}
              size="sm"
              type="button"
              variant="outline"
            >
              <Users className="h-3.5 w-3.5" />
              Tambah Saudara Kandung
            </Button>
          </div>

          {saudaraFields.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 rounded-lg bg-muted/30 py-8 text-center">
              <Users className="h-8 w-8 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">Belum ada data saudara kandung.</p>
            </div>
          ) : null}

          {saudaraFields.map((field, index) => (
            <Card key={field.id} className="border border-border/60 shadow-none">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-50 text-xs font-semibold text-sky-600">
                    {index + 1}
                  </span>
                  Saudara Kandung ke-{index + 1}
                </CardTitle>
                <Button
                  className="h-7 w-7 rounded-lg"
                  onClick={() => handleRemoveSaudara(index)}
                  size="icon"
                  type="button"
                  variant="ghost"
                >
                  <Trash2 className="h-3.5 w-3.5 text-destructive/70" />
                </Button>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                <input
                  type="hidden"
                  {...register(`saudaraKandung.${index}.urutan`, { valueAsNumber: true })}
                />
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground" htmlFor={`saudara-${index}-nama`}>Nama Saudara Kandung</Label>
                  <Input id={`saudara-${index}-nama`} {...register(`saudaraKandung.${index}.nama`)} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">Jenis Kelamin</Label>
                  <Controller
                    control={control}
                    name={`saudaraKandung.${index}.jenisKelamin`}
                    render={({ field: controllerField }) => (
                      <SearchableStringSelect
                        onChange={controllerField.onChange}
                        options={["Laki-laki", "Perempuan"]}
                        placeholder="Pilih jenis kelamin"
                        searchPlaceholder="Cari jenis kelamin..."
                        value={controllerField.value || ""}
                      />
                    )}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground" htmlFor={`saudara-${index}-tanggalLahir`}>Tanggal Lahir</Label>
                  <Input
                    id={`saudara-${index}-tanggalLahir`}
                    type="date"
                    {...register(`saudaraKandung.${index}.tanggalLahir`)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground" htmlFor={`saudara-${index}-pendidikanTerakhir`}>
                    Pendidikan Terakhir
                  </Label>
                  <Input
                    id={`saudara-${index}-pendidikanTerakhir`}
                    {...register(`saudaraKandung.${index}.pendidikanTerakhir`)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground" htmlFor={`saudara-${index}-pekerjaan`}>Pekerjaan</Label>
                  <Input
                    id={`saudara-${index}-pekerjaan`}
                    {...register(`saudaraKandung.${index}.pekerjaan`)}
                  />
                </div>
                <div className="space-y-1.5 lg:col-span-3">
                  <Label className="text-xs font-medium text-muted-foreground" htmlFor={`saudara-${index}-keterangan`}>Keterangan</Label>
                  <Textarea
                    id={`saudara-${index}-keterangan`}
                    rows={2}
                    {...register(`saudaraKandung.${index}.keterangan`)}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Orang Tua Mertua" icon={<Heart className="h-3.5 w-3.5" />} accentColor="border-l-violet-500/60">
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border border-border/60 shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-50 text-xs font-semibold text-violet-600">
                  ♂
                </span>
                Ayah Mertua
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground" htmlFor="namaAyahMertua">Nama Ayah Mertua</Label>
                <Input id="namaAyahMertua" {...register("orangTuaMertua.namaAyahMertua")} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground" htmlFor="tanggalLahirAyahMertua">Tanggal Lahir</Label>
                <Input
                  id="tanggalLahirAyahMertua"
                  type="date"
                  {...register("orangTuaMertua.tanggalLahirAyahMertua")}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground" htmlFor="pendidikanTerakhirAyahMertua">Pendidikan Terakhir</Label>
                <Input
                  id="pendidikanTerakhirAyahMertua"
                  {...register("orangTuaMertua.pendidikanTerakhirAyahMertua")}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground" htmlFor="keteranganAyahMertua">Keterangan</Label>
                <Textarea
                  id="keteranganAyahMertua"
                  rows={2}
                  {...register("orangTuaMertua.keteranganAyahMertua")}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/60 shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-50 text-xs font-semibold text-violet-600">
                  ♀
                </span>
                Ibu Mertua
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground" htmlFor="namaIbuMertua">Nama Ibu Mertua</Label>
                <Input id="namaIbuMertua" {...register("orangTuaMertua.namaIbuMertua")} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground" htmlFor="tanggalLahirIbuMertua">Tanggal Lahir</Label>
                <Input
                  id="tanggalLahirIbuMertua"
                  type="date"
                  {...register("orangTuaMertua.tanggalLahirIbuMertua")}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground" htmlFor="pendidikanTerakhirIbuMertua">Pendidikan Terakhir</Label>
                <Input
                  id="pendidikanTerakhirIbuMertua"
                  {...register("orangTuaMertua.pendidikanTerakhirIbuMertua")}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground" htmlFor="keteranganIbuMertua">Keterangan</Label>
                <Textarea
                  id="keteranganIbuMertua"
                  rows={2}
                  {...register("orangTuaMertua.keteranganIbuMertua")}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>
    </div>
  );
}
