import { useEffect } from "react";
import { Trash2 } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
    <div className="space-y-6">
      <Section title="Pasangan dan Anak">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div className="space-y-2">
            <Label>Nama Pasangan</Label>
            <Input readOnly value={watch("namaPasangan") || ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="keluarga-tanggalLahirPasangan">Tanggal Lahir Pasangan</Label>
            <Input
              id="keluarga-tanggalLahirPasangan"
              type="date"
              {...register("keluarga.tanggalLahirPasangan")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="keluarga-pendidikanTerakhirPasangan">Pendidikan Terakhir</Label>
            <Input
              id="keluarga-pendidikanTerakhirPasangan"
              {...register("keluarga.pendidikanTerakhirPasangan")}
            />
          </div>
          <div className="space-y-2">
            <Label>Pekerjaan Pasangan</Label>
            <Input readOnly value={watch("pekerjaanPasangan") || ""} />
          </div>
          <div className="space-y-2">
            <Label>Jumlah Anak</Label>
            <Input readOnly value={watch("jumlahAnak") ?? ""} />
          </div>
          <div className="space-y-2 md:col-span-2 xl:col-span-3">
            <Label htmlFor="keluarga-keteranganPasangan">Keterangan Pasangan</Label>
            <Textarea
              id="keluarga-keteranganPasangan"
              {...register("keluarga.keteranganPasangan")}
            />
          </div>
        </div>
      </Section>

      <Section title="Identitas Anak">
        <div className="space-y-4">
          {anakFields.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Jumlah anak belum diisi atau bernilai 0.
            </p>
          ) : null}
          {anakFields.map((field, index) => (
            <Card key={field.id} className="border border-border/60 shadow-none">
              <CardHeader>
                <CardTitle className="text-base">Anak ke-{index + 1}</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <input
                  type="hidden"
                  {...register(`anak.${index}.urutan`, { valueAsNumber: true })}
                />
                <div className="space-y-2">
                  <Label htmlFor={`anak-${index}-namaAnak`}>Nama Anak</Label>
                  <Input id={`anak-${index}-namaAnak`} {...register(`anak.${index}.namaAnak`)} />
                </div>
                <div className="space-y-2">
                  <Label>Jenis Kelamin</Label>
                  <Controller
                    control={control}
                    name={`anak.${index}.jenisKelaminAnak`}
                    render={({ field: controllerField }) => (
                      <Select
                        onValueChange={controllerField.onChange}
                        value={controllerField.value || ""}
                      >
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
                  <Label htmlFor={`anak-${index}-tanggalLahirAnak`}>Tanggal Lahir</Label>
                  <Input
                    id={`anak-${index}-tanggalLahirAnak`}
                    type="date"
                    {...register(`anak.${index}.tanggalLahirAnak`)}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor={`anak-${index}-keteranganAnak`}>Keterangan Anak</Label>
                  <Textarea
                    id={`anak-${index}-keteranganAnak`}
                    {...register(`anak.${index}.keteranganAnak`)}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Saudara Kandung">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="anakKe">Anak Ke</Label>
            <Input id="anakKe" type="number" {...register("anakKe", { valueAsNumber: true })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="jumlahSaudaraKandung">Jumlah Saudara Kandung</Label>
            <Input
              id="jumlahSaudaraKandung"
              type="number"
              {...register("jumlahSaudaraKandung", { valueAsNumber: true })}
            />
          </div>
        </div>
      </Section>

      <Section title="Identitas Saudara Kandung">
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button
              disabled={saudaraFields.length >= 5}
              onClick={handleAppendSaudara}
              type="button"
            >
              Tambah Saudara Kandung
            </Button>
          </div>

          {saudaraFields.length === 0 ? (
            <p className="text-sm text-muted-foreground">Belum ada data saudara kandung.</p>
          ) : null}

          {saudaraFields.map((field, index) => (
            <Card key={field.id} className="border border-border/60 shadow-none">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-base">Saudara Kandung ke-{index + 1}</CardTitle>
                <Button
                  onClick={() => handleRemoveSaudara(index)}
                  size="icon"
                  type="button"
                  variant="ghost"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <input
                  type="hidden"
                  {...register(`saudaraKandung.${index}.urutan`, { valueAsNumber: true })}
                />
                <div className="space-y-2">
                  <Label htmlFor={`saudara-${index}-nama`}>Nama Saudara Kandung</Label>
                  <Input id={`saudara-${index}-nama`} {...register(`saudaraKandung.${index}.nama`)} />
                </div>
                <div className="space-y-2">
                  <Label>Jenis Kelamin</Label>
                  <Controller
                    control={control}
                    name={`saudaraKandung.${index}.jenisKelamin`}
                    render={({ field: controllerField }) => (
                      <Select
                        onValueChange={controllerField.onChange}
                        value={controllerField.value || ""}
                      >
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
                  <Label htmlFor={`saudara-${index}-tanggalLahir`}>Tanggal Lahir</Label>
                  <Input
                    id={`saudara-${index}-tanggalLahir`}
                    type="date"
                    {...register(`saudaraKandung.${index}.tanggalLahir`)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`saudara-${index}-pendidikanTerakhir`}>
                    Pendidikan Terakhir
                  </Label>
                  <Input
                    id={`saudara-${index}-pendidikanTerakhir`}
                    {...register(`saudaraKandung.${index}.pendidikanTerakhir`)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`saudara-${index}-pekerjaan`}>Pekerjaan</Label>
                  <Input
                    id={`saudara-${index}-pekerjaan`}
                    {...register(`saudaraKandung.${index}.pekerjaan`)}
                  />
                </div>
                <div className="space-y-2 xl:col-span-3">
                  <Label htmlFor={`saudara-${index}-keterangan`}>Keterangan</Label>
                  <Textarea
                    id={`saudara-${index}-keterangan`}
                    {...register(`saudaraKandung.${index}.keterangan`)}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Orang Tua Mertua">
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border border-border/60 shadow-none">
            <CardHeader>
              <CardTitle className="text-base">Ayah Mertua</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="namaAyahMertua">Nama</Label>
                <Input id="namaAyahMertua" {...register("orangTuaMertua.namaAyahMertua")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tanggalLahirAyahMertua">Tanggal Lahir</Label>
                <Input
                  id="tanggalLahirAyahMertua"
                  type="date"
                  {...register("orangTuaMertua.tanggalLahirAyahMertua")}
                />
              </div>
                <div className="space-y-2">
                  <Label htmlFor="pendidikanTerakhirAyahMertua">Pendidikan Terakhir</Label>
                  <Input
                    id="pendidikanTerakhirAyahMertua"
                    {...register("orangTuaMertua.pendidikanTerakhirAyahMertua")}
                  />
                </div>
              <div className="space-y-2">
                <Label htmlFor="keteranganAyahMertua">Keterangan</Label>
                <Textarea
                  id="keteranganAyahMertua"
                  {...register("orangTuaMertua.keteranganAyahMertua")}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/60 shadow-none">
            <CardHeader>
              <CardTitle className="text-base">Ibu Mertua</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="namaIbuMertua">Nama</Label>
                <Input id="namaIbuMertua" {...register("orangTuaMertua.namaIbuMertua")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tanggalLahirIbuMertua">Tanggal Lahir</Label>
                <Input
                  id="tanggalLahirIbuMertua"
                  type="date"
                  {...register("orangTuaMertua.tanggalLahirIbuMertua")}
                />
              </div>
                <div className="space-y-2">
                  <Label htmlFor="pendidikanTerakhirIbuMertua">Pendidikan Terakhir</Label>
                  <Input
                    id="pendidikanTerakhirIbuMertua"
                    {...register("orangTuaMertua.pendidikanTerakhirIbuMertua")}
                  />
                </div>
              <div className="space-y-2">
                <Label htmlFor="keteranganIbuMertua">Keterangan</Label>
                <Textarea
                  id="keteranganIbuMertua"
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
