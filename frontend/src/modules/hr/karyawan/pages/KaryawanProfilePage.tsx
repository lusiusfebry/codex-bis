import { useEffect, useState } from "react";
import { ArrowLeft, Building2, Heart, Save, User } from "lucide-react";
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
    tagId: null,
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
    tagId: karyawan.tag?.id ?? karyawan.tags?.[0]?.id ?? null,
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
      key === "tagId" ||
      key === "anak" ||
      key === "saudaraKandung" ||
      key === "kontakDarurat" ||
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
    tagId: values.tagId || null,
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
      <div className="mx-auto max-w-[1240px] space-y-5">
        <Skeleton className="h-16 w-full rounded-2xl" />
        <Skeleton className="h-[320px] w-full rounded-2xl" />
        <Skeleton className="h-[520px] w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <form className="mx-auto max-w-[1240px] space-y-5 pb-8" onSubmit={handleSubmit}>
      {/* ── Minimal Breadcrumb Header ── */}
      <div className="flex items-center gap-4 px-1">
        <Button
          className="h-9 w-9 shrink-0 rounded-xl"
          onClick={() => navigate("/hr/karyawan")}
          size="icon"
          type="button"
          variant="outline"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            HR / Karyawan
          </div>
          <h1 className="truncate text-xl font-extrabold tracking-tight text-foreground md:text-2xl">
            {pageTitle}
          </h1>
        </div>
      </div>

      {/* ── Head Card ── */}
      <KaryawanHeadCard
        control={form.control}
        errors={form.formState.errors}
        fotoKaryawan={fotoKaryawan}
        karyawanId={id}
        register={form.register}
        setValue={form.setValue}
        watch={form.watch}
      />

      {/* ── Tabs ── */}
      <Tabs className="space-y-5" defaultValue="personal">
        <TabsList className="grid h-auto w-full grid-cols-1 gap-1.5 rounded-xl border bg-muted/30 p-1.5 shadow-sm md:grid-cols-3">
          <TabsTrigger
            className="flex items-center gap-2 rounded-lg py-2.5 text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm"
            value="personal"
          >
            <User className="h-4 w-4" />
            Personal Information
          </TabsTrigger>
          <TabsTrigger
            className="flex items-center gap-2 rounded-lg py-2.5 text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm"
            value="hr"
          >
            <Building2 className="h-4 w-4" />
            Informasi HR
          </TabsTrigger>
          <TabsTrigger
            className="flex items-center gap-2 rounded-lg py-2.5 text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm"
            value="keluarga"
          >
            <Heart className="h-4 w-4" />
            Informasi Keluarga
          </TabsTrigger>
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

      {/* ── Bottom Action Bar ── */}
      <div className="sticky bottom-4 z-10 flex flex-wrap justify-end gap-3 rounded-xl border bg-background/95 p-4 shadow-lg backdrop-blur-md">
        <Button
          className="rounded-lg"
          onClick={() => navigate("/hr/karyawan")}
          type="button"
          variant="outline"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Batal
        </Button>
        <Button
          className="rounded-lg bg-primary shadow-md shadow-primary/20"
          disabled={submitting}
          type="submit"
        >
          <Save className="mr-2 h-4 w-4" />
          {submitting ? "Menyimpan..." : "Simpan"}
        </Button>
      </div>
    </form>
  );
}
