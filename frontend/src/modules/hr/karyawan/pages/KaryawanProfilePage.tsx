import { useEffect, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import {
  createKaryawanApi,
  getKaryawanByIdApi,
  updateKaryawanApi,
} from "@/api/karyawan";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toastError, toastSuccess } from "@/lib/toast";
import { KaryawanHeadCard } from "@/modules/hr/karyawan/components/KaryawanHeadCard";
import { TabInformasiHR } from "@/modules/hr/karyawan/components/TabInformasiHR";
import { TabInformasiKeluarga } from "@/modules/hr/karyawan/components/TabInformasiKeluarga";
import { TabPersonalInfo } from "@/modules/hr/karyawan/components/TabPersonalInfo";
import type { Karyawan, KaryawanFormPayload } from "@/types/karyawan";

function toDateInputValue(value?: string | null) {
  if (!value) {
    return "";
  }

  return value.slice(0, 10);
}

function normalizeOptionalString(value?: string | null) {
  return value ?? "";
}

function createDefaultKontakDarurat() {
  return [{ urutan: 1 }, { urutan: 2 }];
}

function getDefaultValues(): KaryawanFormPayload {
  return {
    nomorIndukKaryawan: "",
    namaLengkap: "",
    fotoKaryawan: "",
    divisiId: "",
    departmentId: "",
    managerNik: "",
    atasanLangsungNik: "",
    posisiJabatanId: "",
    emailPerusahaan: "",
    nomorHandphone: "",
    statusKaryawanId: "",
    lokasiKerjaId: "",
    tagIds: [],
    jenisKelamin: "",
    tempatLahir: "",
    tanggalLahir: "",
    emailPribadi: "",
    agama: "",
    golonganDarah: "",
    nomorKartuKeluarga: "",
    nomorKtp: "",
    nomorNpwp: "",
    nomorBpjs: "",
    noNikKk: "",
    statusPajak: "",
    alamatDomisili: "",
    kotaDomisili: "",
    provinsiDomisili: "",
    alamatKtp: "",
    kotaKtp: "",
    provinsiKtp: "",
    nomorHandphone2: "",
    nomorTeleponRumah1: "",
    nomorTeleponRumah2: "",
    statusPernikahan: "",
    namaPasangan: "",
    tanggalMenikah: "",
    tanggalCerai: "",
    tanggalWafatPasangan: "",
    pekerjaanPasangan: "",
    jumlahAnak: null,
    nomorRekening: "",
    namaPemegangRekening: "",
    namaBank: "",
    cabangBank: "",
    jenisHubunganKerjaId: "",
    tanggalMasukGroup: "",
    tanggalMasuk: "",
    tanggalPermanent: "",
    tanggalKontrak: "",
    tanggalAkhirKontrak: "",
    tanggalBerhenti: "",
    tingkatPendidikan: "",
    bidangStudi: "",
    namaSekolah: "",
    kotaSekolah: "",
    statusKelulusan: "",
    keteranganPendidikan: "",
    kategoriPangkatId: "",
    golonganId: "",
    subGolonganId: "",
    noDanaPensiun: "",
    pointOfOriginal: "",
    pointOfHire: "",
    ukuranSeragamKerja: "",
    ukuranSepatuKerja: "",
    lokasiSebelumnyaId: "",
    tanggalMutasi: "",
    siklusPembayaranGaji: "",
    costing: "",
    assign: "",
    actual: "",
    anakKe: null,
    jumlahSaudaraKandung: null,
    anak: [],
    saudaraKandung: [],
    kontakDarurat: createDefaultKontakDarurat(),
    orangTuaKandung: {},
    orangTuaMertua: {},
    keluarga: {},
  };
}

function mapKaryawanToFormValues(karyawan: Karyawan): KaryawanFormPayload {
  const kontakDarurat = createDefaultKontakDarurat().map((item) => {
    const existingItem = karyawan.kontakDarurat?.find(
      (kontak) => kontak.urutan === item.urutan,
    );

    return existingItem
      ? {
          ...existingItem,
          urutan: item.urutan,
        }
      : item;
  });

  return {
    nomorIndukKaryawan: karyawan.nomorIndukKaryawan,
    namaLengkap: karyawan.namaLengkap,
    fotoKaryawan: normalizeOptionalString(karyawan.fotoKaryawan),
    divisiId: karyawan.divisiId,
    departmentId: karyawan.departmentId,
    managerNik: normalizeOptionalString(karyawan.managerNik),
    atasanLangsungNik: normalizeOptionalString(karyawan.atasanLangsungNik),
    posisiJabatanId: karyawan.posisiJabatanId,
    emailPerusahaan: normalizeOptionalString(karyawan.emailPerusahaan),
    nomorHandphone: normalizeOptionalString(karyawan.nomorHandphone),
    statusKaryawanId: karyawan.statusKaryawanId,
    lokasiKerjaId: karyawan.lokasiKerjaId,
    tagIds: karyawan.tags?.map((item) => item.id) ?? (karyawan.tag ? [karyawan.tag.id] : []),
    jenisKelamin: normalizeOptionalString(karyawan.jenisKelamin),
    tempatLahir: normalizeOptionalString(karyawan.tempatLahir),
    tanggalLahir: toDateInputValue(karyawan.tanggalLahir),
    emailPribadi: normalizeOptionalString(karyawan.emailPribadi),
    agama: normalizeOptionalString(karyawan.agama),
    golonganDarah: normalizeOptionalString(karyawan.golonganDarah),
    nomorKartuKeluarga: normalizeOptionalString(karyawan.nomorKartuKeluarga),
    nomorKtp: normalizeOptionalString(karyawan.nomorKtp),
    nomorNpwp: normalizeOptionalString(karyawan.nomorNpwp),
    nomorBpjs: normalizeOptionalString(karyawan.nomorBpjs),
    noNikKk: normalizeOptionalString(karyawan.noNikKk),
    statusPajak: normalizeOptionalString(karyawan.statusPajak),
    alamatDomisili: normalizeOptionalString(karyawan.alamatDomisili),
    kotaDomisili: normalizeOptionalString(karyawan.kotaDomisili),
    provinsiDomisili: normalizeOptionalString(karyawan.provinsiDomisili),
    alamatKtp: normalizeOptionalString(karyawan.alamatKtp),
    kotaKtp: normalizeOptionalString(karyawan.kotaKtp),
    provinsiKtp: normalizeOptionalString(karyawan.provinsiKtp),
    nomorHandphone2: normalizeOptionalString(karyawan.nomorHandphone2),
    nomorTeleponRumah1: normalizeOptionalString(karyawan.nomorTeleponRumah1),
    nomorTeleponRumah2: normalizeOptionalString(karyawan.nomorTeleponRumah2),
    statusPernikahan: normalizeOptionalString(karyawan.statusPernikahan),
    namaPasangan: normalizeOptionalString(karyawan.namaPasangan),
    tanggalMenikah: toDateInputValue(karyawan.tanggalMenikah),
    tanggalCerai: toDateInputValue(karyawan.tanggalCerai),
    tanggalWafatPasangan: toDateInputValue(karyawan.tanggalWafatPasangan),
    pekerjaanPasangan: normalizeOptionalString(karyawan.pekerjaanPasangan),
    jumlahAnak: karyawan.jumlahAnak ?? null,
    nomorRekening: normalizeOptionalString(karyawan.nomorRekening),
    namaPemegangRekening: normalizeOptionalString(karyawan.namaPemegangRekening),
    namaBank: normalizeOptionalString(karyawan.namaBank),
    cabangBank: normalizeOptionalString(karyawan.cabangBank),
    jenisHubunganKerjaId: normalizeOptionalString(karyawan.jenisHubunganKerjaId),
    tanggalMasukGroup: toDateInputValue(karyawan.tanggalMasukGroup),
    tanggalMasuk: toDateInputValue(karyawan.tanggalMasuk),
    tanggalPermanent: toDateInputValue(karyawan.tanggalPermanent),
    tanggalKontrak: toDateInputValue(karyawan.tanggalKontrak),
    tanggalAkhirKontrak: toDateInputValue(karyawan.tanggalAkhirKontrak),
    tanggalBerhenti: toDateInputValue(karyawan.tanggalBerhenti),
    tingkatPendidikan: normalizeOptionalString(karyawan.tingkatPendidikan),
    bidangStudi: normalizeOptionalString(karyawan.bidangStudi),
    namaSekolah: normalizeOptionalString(karyawan.namaSekolah),
    kotaSekolah: normalizeOptionalString(karyawan.kotaSekolah),
    statusKelulusan: normalizeOptionalString(karyawan.statusKelulusan),
    keteranganPendidikan: normalizeOptionalString(karyawan.keteranganPendidikan),
    kategoriPangkatId: normalizeOptionalString(karyawan.kategoriPangkatId),
    golonganId: normalizeOptionalString(karyawan.golonganId),
    subGolonganId: normalizeOptionalString(karyawan.subGolonganId),
    noDanaPensiun: normalizeOptionalString(karyawan.noDanaPensiun),
    pointOfOriginal: normalizeOptionalString(karyawan.pointOfOriginal),
    pointOfHire: normalizeOptionalString(karyawan.pointOfHire),
    ukuranSeragamKerja: normalizeOptionalString(karyawan.ukuranSeragamKerja),
    ukuranSepatuKerja: normalizeOptionalString(karyawan.ukuranSepatuKerja),
    lokasiSebelumnyaId: normalizeOptionalString(karyawan.lokasiSebelumnyaId),
    tanggalMutasi: toDateInputValue(karyawan.tanggalMutasi),
    siklusPembayaranGaji: normalizeOptionalString(karyawan.siklusPembayaranGaji),
    costing: normalizeOptionalString(karyawan.costing),
    assign: normalizeOptionalString(karyawan.assign),
    actual: normalizeOptionalString(karyawan.actual),
    anakKe: karyawan.anakKe ?? null,
    jumlahSaudaraKandung: karyawan.jumlahSaudaraKandung ?? null,
    anak:
      karyawan.anak?.map((item) => ({
        ...item,
        tanggalLahirAnak: toDateInputValue(item.tanggalLahirAnak),
      })) ?? [],
    saudaraKandung:
      karyawan.saudaraKandung?.map((item) => ({
        ...item,
        tanggalLahir: toDateInputValue(item.tanggalLahir),
      })) ?? [],
    kontakDarurat,
    orangTuaKandung: {
      ...(karyawan.orangTuaKandung ?? {}),
      tanggalLahirAyahKandung: toDateInputValue(
        karyawan.orangTuaKandung?.tanggalLahirAyahKandung,
      ),
      tanggalLahirIbuKandung: toDateInputValue(
        karyawan.orangTuaKandung?.tanggalLahirIbuKandung,
      ),
    },
    orangTuaMertua: {
      ...(karyawan.orangTuaMertua ?? {}),
      tanggalLahirAyahMertua: toDateInputValue(
        karyawan.orangTuaMertua?.tanggalLahirAyahMertua,
      ),
      tanggalLahirIbuMertua: toDateInputValue(
        karyawan.orangTuaMertua?.tanggalLahirIbuMertua,
      ),
    },
    keluarga: {
      ...(karyawan.keluarga ?? {}),
      tanggalLahirPasangan: toDateInputValue(karyawan.keluarga?.tanggalLahirPasangan),
    },
  };
}

function normalizePayload(values: KaryawanFormPayload): KaryawanFormPayload {
  const normalizedEntries = Object.entries(values).map(([key, value]) => {
    if (
      key === "tagIds" ||
      key === "anak" ||
      key === "saudaraKandung" ||
      key === "kontakDarurat" ||
      key === "orangTuaKandung" ||
      key === "orangTuaMertua" ||
      key === "keluarga"
    ) {
      return [key, value];
    }

    if (typeof value === "string") {
      return [key, value.trim() === "" ? null : value.trim()];
    }

    if (Number.isNaN(value)) {
      return [key, null];
    }

    return [key, value];
  });

  const payload = Object.fromEntries(normalizedEntries) as unknown as KaryawanFormPayload;

  return {
    ...payload,
    nomorIndukKaryawan: values.nomorIndukKaryawan.trim(),
    namaLengkap: values.namaLengkap.trim(),
    divisiId: values.divisiId,
    departmentId: values.departmentId,
    posisiJabatanId: values.posisiJabatanId,
    statusKaryawanId: values.statusKaryawanId,
    lokasiKerjaId: values.lokasiKerjaId,
    tagIds: Array.from(new Set(values.tagIds.filter(Boolean))),
  };
}

export default function KaryawanProfilePage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [fotoKaryawan, setFotoKaryawan] = useState<string | null>(null);

  const form = useForm<KaryawanFormPayload>({
    defaultValues: getDefaultValues(),
  });
  const watchedName = form.watch("namaLengkap");

  const pageTitle = isEditMode ? watchedName || "Profil Karyawan" : "Tambah Karyawan";

  useEffect(() => {
    if (!id) {
      return;
    }

    const loadKaryawan = async () => {
      setLoading(true);

      try {
        const data = await getKaryawanByIdApi(id);
        form.reset(mapKaryawanToFormValues(data));
        setFotoKaryawan(data.fotoKaryawan ?? null);
      } catch (error) {
        toastError(error instanceof Error ? error.message : "Gagal memuat data karyawan.");
      } finally {
        setLoading(false);
      }
    };

    void loadKaryawan();
  }, [form, id]);

  const handleSubmit = form.handleSubmit(async (values) => {
    setSubmitting(true);

    try {
      const payload = normalizePayload(values);

      if (id) {
        await updateKaryawanApi(id, payload);
        toastSuccess("Karyawan berhasil diperbarui.");
        navigate("/hr/karyawan");
      } else {
        const createdKaryawan = await createKaryawanApi(payload);
        toastSuccess("Karyawan berhasil ditambahkan.");
        navigate(`/hr/karyawan/${createdKaryawan.id}`);
      }
    } catch (error) {
      toastError(error instanceof Error ? error.message : "Gagal menyimpan data karyawan.");
    } finally {
      setSubmitting(false);
    }
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-6 w-72" />
        <Skeleton className="h-[320px] w-full rounded-3xl" />
        <Skeleton className="h-[520px] w-full rounded-3xl" />
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">
          Dashboard / HR / Karyawan / {pageTitle}
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          {pageTitle}
        </h1>
      </div>

      <KaryawanHeadCard
        control={form.control}
        errors={form.formState.errors}
        fotoKaryawan={fotoKaryawan}
        karyawanId={id}
        register={form.register}
        setValue={form.setValue}
        watch={form.watch}
      />

      <Tabs defaultValue="personal">
        <TabsList>
          <TabsTrigger value="personal">Personal Information</TabsTrigger>
          <TabsTrigger value="hr">Informasi HR</TabsTrigger>
          <TabsTrigger value="keluarga">Informasi Keluarga</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <TabPersonalInfo
            control={form.control}
            errors={form.formState.errors}
            register={form.register}
            watch={form.watch}
          />
        </TabsContent>

        <TabsContent value="hr">
          <TabInformasiHR
            control={form.control}
            errors={form.formState.errors}
            register={form.register}
            watch={form.watch}
          />
        </TabsContent>

        <TabsContent value="keluarga">
          <TabInformasiKeluarga
            control={form.control}
            errors={form.formState.errors}
            register={form.register}
            watch={form.watch}
          />
        </TabsContent>
      </Tabs>

      <div className="sticky bottom-4 z-10 flex flex-wrap justify-end gap-3 rounded-2xl border bg-background/95 p-4 shadow-lg backdrop-blur">
        <Button onClick={() => navigate("/hr/karyawan")} type="button" variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Batal
        </Button>
        <Button disabled={submitting} type="submit">
          <Save className="mr-2 h-4 w-4" />
          {submitting ? "Menyimpan..." : "Simpan"}
        </Button>
      </div>
    </form>
  );
}
