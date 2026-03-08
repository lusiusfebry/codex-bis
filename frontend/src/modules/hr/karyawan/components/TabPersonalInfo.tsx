import { useMemo, useState, type KeyboardEvent } from "react";
import { Controller, type Control, type FieldErrors, type UseFormRegister, type UseFormWatch } from "react-hook-form";
import {
  Check,
  ChevronDown,
  CreditCard,
  Fingerprint,
  Heart,
  Home,
  MapPin,
  Phone,
  Search,
  User,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { KaryawanFormPayload } from "@/types/karyawan";

type TabPersonalInfoProps = {
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

export function TabPersonalInfo({
  control,
  register,
  watch,
  errors,
}: TabPersonalInfoProps) {
  return (
    <div className="space-y-5">
      <Section title="Biodata Karyawan" icon={<User className="h-3.5 w-3.5" />} accentColor="border-l-blue-500/60">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground" htmlFor="personal-nama">Nama Lengkap</Label>
            <Input
              id="personal-nama"
              readOnly
              className="bg-muted/30"
              value={watch("namaLengkap") || ""}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Jenis Kelamin</Label>
            <Controller
              control={control}
              name="jenisKelamin"
              render={({ field }) => (
                <SearchableStringSelect
                  onChange={field.onChange}
                  options={["Laki-laki", "Perempuan"]}
                  placeholder="Pilih jenis kelamin"
                  searchPlaceholder="Cari jenis kelamin..."
                  value={field.value || ""}
                />
              )}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground" htmlFor="tempatLahir">Tempat Lahir</Label>
            <Input id="tempatLahir" {...register("tempatLahir")} />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground" htmlFor="tanggalLahir">Tanggal Lahir</Label>
            <Input id="tanggalLahir" type="date" {...register("tanggalLahir")} />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground" htmlFor="emailPribadi">Email Pribadi</Label>
            <Input id="emailPribadi" type="email" {...register("emailPribadi")} />
            <FieldError message={errors.emailPribadi?.message} />
          </div>
        </div>
      </Section>

      <Section title="Identifikasi" icon={<Fingerprint className="h-3.5 w-3.5" />} accentColor="border-l-amber-500/60">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Agama</Label>
            <Controller
              control={control}
              name="agama"
              render={({ field }) => (
                <SearchableStringSelect
                  onChange={field.onChange}
                  options={["Islam", "Kristen", "Katolik", "Hindu", "Buddha", "Konghucu"]}
                  placeholder="Pilih agama"
                  searchPlaceholder="Cari agama..."
                  value={field.value || ""}
                />
              )}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Golongan Darah</Label>
            <Controller
              control={control}
              name="golonganDarah"
              render={({ field }) => (
                <SearchableStringSelect
                  onChange={field.onChange}
                  options={["A", "B", "AB", "O"]}
                  placeholder="Pilih golongan darah"
                  searchPlaceholder="Cari golongan darah..."
                  value={field.value || ""}
                />
              )}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground" htmlFor="nomorKartuKeluarga">Nomor Kartu Keluarga</Label>
            <Input id="nomorKartuKeluarga" {...register("nomorKartuKeluarga")} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground" htmlFor="nomorKtp">Nomor KTP</Label>
            <Input id="nomorKtp" {...register("nomorKtp")} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground" htmlFor="nomorNpwp">Nomor NPWP</Label>
            <Input id="nomorNpwp" {...register("nomorNpwp")} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground" htmlFor="nomorBpjs">Nomor BPJS</Label>
            <Input id="nomorBpjs" {...register("nomorBpjs")} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground" htmlFor="noNikKk">Nomor NIK KK</Label>
            <Input id="noNikKk" {...register("noNikKk")} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground" htmlFor="statusPajak">Status Pajak</Label>
            <Input id="statusPajak" {...register("statusPajak")} />
          </div>
        </div>
      </Section>

      <Section title="Alamat Domisili" icon={<Home className="h-3.5 w-3.5" />} accentColor="border-l-emerald-500/60">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5 md:col-span-2">
            <Label className="text-xs font-medium text-muted-foreground" htmlFor="alamatDomisili">Alamat Domisili</Label>
            <Textarea id="alamatDomisili" rows={2} {...register("alamatDomisili")} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground" htmlFor="kotaDomisili">Kota Domisili</Label>
            <Input id="kotaDomisili" {...register("kotaDomisili")} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground" htmlFor="provinsiDomisili">Provinsi Domisili</Label>
            <Input id="provinsiDomisili" {...register("provinsiDomisili")} />
          </div>
        </div>
      </Section>

      <Section title="Alamat KTP" icon={<MapPin className="h-3.5 w-3.5" />} accentColor="border-l-violet-500/60">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5 md:col-span-2">
            <Label className="text-xs font-medium text-muted-foreground" htmlFor="alamatKtp">Alamat KTP</Label>
            <Textarea id="alamatKtp" rows={2} {...register("alamatKtp")} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground" htmlFor="kotaKtp">Kota KTP</Label>
            <Input id="kotaKtp" {...register("kotaKtp")} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground" htmlFor="provinsiKtp">Provinsi KTP</Label>
            <Input id="provinsiKtp" {...register("provinsiKtp")} />
          </div>
        </div>
      </Section>

      <Section title="Informasi Kontak" icon={<Phone className="h-3.5 w-3.5" />} accentColor="border-l-sky-500/60">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground" htmlFor="nomorHandphone-head">Nomor Handphone 1</Label>
            <Input
              id="nomorHandphone-head"
              readOnly
              className="bg-muted/30"
              value={watch("nomorHandphone") || ""}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground" htmlFor="nomorHandphone2">Nomor Handphone 2</Label>
            <Input id="nomorHandphone2" {...register("nomorHandphone2")} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground" htmlFor="nomorTeleponRumah1">Nomor Telepon Rumah 1</Label>
            <Input id="nomorTeleponRumah1" {...register("nomorTeleponRumah1")} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground" htmlFor="nomorTeleponRumah2">Nomor Telepon Rumah 2</Label>
            <Input id="nomorTeleponRumah2" {...register("nomorTeleponRumah2")} />
          </div>
        </div>
      </Section>

      <Section title="Status Pernikahan dan Anak" icon={<Heart className="h-3.5 w-3.5" />} accentColor="border-l-rose-500/60">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Status Pernikahan</Label>
            <Controller
              control={control}
              name="statusPernikahan"
              render={({ field }) => (
                <SearchableStringSelect
                  onChange={field.onChange}
                  options={["Belum Menikah", "Menikah", "Cerai Hidup", "Cerai Mati"]}
                  placeholder="Pilih status pernikahan"
                  searchPlaceholder="Cari status pernikahan..."
                  value={field.value || ""}
                />
              )}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground" htmlFor="namaPasangan">Nama Pasangan</Label>
            <Input id="namaPasangan" {...register("namaPasangan")} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground" htmlFor="tanggalMenikah">Tanggal Menikah</Label>
            <Input id="tanggalMenikah" type="date" {...register("tanggalMenikah")} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground" htmlFor="tanggalCerai">Tanggal Cerai</Label>
            <Input id="tanggalCerai" type="date" {...register("tanggalCerai")} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground" htmlFor="tanggalWafatPasangan">Tanggal Wafat Pasangan</Label>
            <Input
              id="tanggalWafatPasangan"
              type="date"
              {...register("tanggalWafatPasangan")}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground" htmlFor="pekerjaanPasangan">Pekerjaan Pasangan</Label>
            <Input id="pekerjaanPasangan" {...register("pekerjaanPasangan")} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground" htmlFor="jumlahAnak">Jumlah Anak</Label>
            <Input id="jumlahAnak" min={0} type="number" {...register("jumlahAnak", { valueAsNumber: true })} />
            <FieldError message={errors.jumlahAnak?.message} />
          </div>
        </div>
      </Section>

      <Section title="Rekening Bank" icon={<CreditCard className="h-3.5 w-3.5" />} accentColor="border-l-cyan-500/60">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground" htmlFor="nomorRekening">Nomor Rekening</Label>
            <Input id="nomorRekening" {...register("nomorRekening")} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground" htmlFor="namaPemegangRekening">Nama Pemegang Rekening</Label>
            <Input id="namaPemegangRekening" {...register("namaPemegangRekening")} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground" htmlFor="namaBank">Nama Bank</Label>
            <Input id="namaBank" {...register("namaBank")} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground" htmlFor="cabangBank">Cabang Bank</Label>
            <Input id="cabangBank" {...register("cabangBank")} />
          </div>
        </div>
      </Section>
    </div>
  );
}
