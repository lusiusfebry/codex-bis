import type * as React from "react";
import { Controller, type Control, type FieldErrors, type UseFormRegister, type UseFormWatch } from "react-hook-form";

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

export function TabPersonalInfo({
  control,
  register,
  watch,
  errors,
}: TabPersonalInfoProps) {
  return (
    <div className="space-y-6">
      <Section title="Biodata Karyawan">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="personal-nama">Nama Lengkap</Label>
            <Input
              id="personal-nama"
              readOnly
              value={watch("namaLengkap") || ""}
            />
          </div>

          <div className="space-y-2">
            <Label>Jenis Kelamin</Label>
            <Controller
              control={control}
              name="jenisKelamin"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis kelamin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                    <SelectItem value="Perempuan">Perempuan</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tempatLahir">Tempat Lahir</Label>
            <Input id="tempatLahir" {...register("tempatLahir")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tanggalLahir">Tanggal Lahir</Label>
            <Input id="tanggalLahir" type="date" {...register("tanggalLahir")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="emailPribadi">Email Pribadi</Label>
            <Input id="emailPribadi" type="email" {...register("emailPribadi")} />
            <FieldError message={errors.emailPribadi?.message} />
          </div>
        </div>
      </Section>

      <Section title="Identifikasi">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div className="space-y-2">
            <Label>Agama</Label>
            <Controller
              control={control}
              name="agama"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih agama" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Islam">Islam</SelectItem>
                    <SelectItem value="Kristen">Kristen</SelectItem>
                    <SelectItem value="Katolik">Katolik</SelectItem>
                    <SelectItem value="Hindu">Hindu</SelectItem>
                    <SelectItem value="Buddha">Buddha</SelectItem>
                    <SelectItem value="Konghucu">Konghucu</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label>Golongan Darah</Label>
            <Controller
              control={control}
              name="golonganDarah"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih golongan darah" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">A</SelectItem>
                    <SelectItem value="B">B</SelectItem>
                    <SelectItem value="AB">AB</SelectItem>
                    <SelectItem value="O">O</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nomorKartuKeluarga">Nomor Kartu Keluarga</Label>
            <Input id="nomorKartuKeluarga" {...register("nomorKartuKeluarga")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nomorKtp">Nomor KTP</Label>
            <Input id="nomorKtp" {...register("nomorKtp")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nomorNpwp">Nomor NPWP</Label>
            <Input id="nomorNpwp" {...register("nomorNpwp")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nomorBpjs">Nomor BPJS</Label>
            <Input id="nomorBpjs" {...register("nomorBpjs")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="noNikKk">No NIK KK</Label>
            <Input id="noNikKk" {...register("noNikKk")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="statusPajak">Status Pajak</Label>
            <Input id="statusPajak" {...register("statusPajak")} />
          </div>
        </div>
      </Section>

      <Section title="Alamat Domisili">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="alamatDomisili">Alamat Domisili</Label>
            <Textarea id="alamatDomisili" {...register("alamatDomisili")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="kotaDomisili">Kota Domisili</Label>
            <Input id="kotaDomisili" {...register("kotaDomisili")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="provinsiDomisili">Provinsi Domisili</Label>
            <Input id="provinsiDomisili" {...register("provinsiDomisili")} />
          </div>
        </div>
      </Section>

      <Section title="Alamat KTP">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="alamatKtp">Alamat KTP</Label>
            <Textarea id="alamatKtp" {...register("alamatKtp")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="kotaKtp">Kota KTP</Label>
            <Input id="kotaKtp" {...register("kotaKtp")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="provinsiKtp">Provinsi KTP</Label>
            <Input id="provinsiKtp" {...register("provinsiKtp")} />
          </div>
        </div>
      </Section>

      <Section title="Informasi Kontak">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="nomorHandphone-head">Nomor Handphone 1</Label>
            <Input
              id="nomorHandphone-head"
              readOnly
              value={watch("nomorHandphone") || ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nomorHandphone2">Nomor Handphone 2</Label>
            <Input id="nomorHandphone2" {...register("nomorHandphone2")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nomorTeleponRumah1">Nomor Telepon Rumah 1</Label>
            <Input id="nomorTeleponRumah1" {...register("nomorTeleponRumah1")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nomorTeleponRumah2">Nomor Telepon Rumah 2</Label>
            <Input id="nomorTeleponRumah2" {...register("nomorTeleponRumah2")} />
          </div>
        </div>
      </Section>

      <Section title="Status Pernikahan dan Anak">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div className="space-y-2">
            <Label>Status Pernikahan</Label>
            <Controller
              control={control}
              name="statusPernikahan"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status pernikahan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Belum Menikah">Belum Menikah</SelectItem>
                    <SelectItem value="Menikah">Menikah</SelectItem>
                    <SelectItem value="Cerai Hidup">Cerai Hidup</SelectItem>
                    <SelectItem value="Cerai Mati">Cerai Mati</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="namaPasangan">Nama Pasangan</Label>
            <Input id="namaPasangan" {...register("namaPasangan")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tanggalMenikah">Tanggal Menikah</Label>
            <Input id="tanggalMenikah" type="date" {...register("tanggalMenikah")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tanggalCerai">Tanggal Cerai</Label>
            <Input id="tanggalCerai" type="date" {...register("tanggalCerai")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tanggalWafatPasangan">Tanggal Wafat Pasangan</Label>
            <Input
              id="tanggalWafatPasangan"
              type="date"
              {...register("tanggalWafatPasangan")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pekerjaanPasangan">Pekerjaan Pasangan</Label>
            <Input id="pekerjaanPasangan" {...register("pekerjaanPasangan")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="jumlahAnak">Jumlah Anak</Label>
            <Input id="jumlahAnak" min={0} type="number" {...register("jumlahAnak", { valueAsNumber: true })} />
            <FieldError message={errors.jumlahAnak?.message} />
          </div>
        </div>
      </Section>

      <Section title="Rekening Bank">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="nomorRekening">Nomor Rekening</Label>
            <Input id="nomorRekening" {...register("nomorRekening")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="namaPemegangRekening">Nama Pemegang Rekening</Label>
            <Input id="namaPemegangRekening" {...register("namaPemegangRekening")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="namaBank">Nama Bank</Label>
            <Input id="namaBank" {...register("namaBank")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cabangBank">Cabang Bank</Label>
            <Input id="cabangBank" {...register("cabangBank")} />
          </div>
        </div>
      </Section>
    </div>
  );
}
