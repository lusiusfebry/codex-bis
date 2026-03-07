import { BaseMasterDataFormModal } from "@/modules/hr/master-data/components/forms/BaseMasterDataFormModal";
import { getMasterDataConfig } from "@/modules/hr/master-data/config";
import type { KategoriPangkat } from "@/types/masterData";

type KategoriPangkatFormValues = {
  namaKategoriPangkat: string;
  keterangan: string;
  status: string;
};

type KategoriPangkatFormModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: KategoriPangkat;
};

const config = getMasterDataConfig("kategoriPangkat");

export function KategoriPangkatFormModal(props: KategoriPangkatFormModalProps) {
  return (
    <BaseMasterDataFormModal<KategoriPangkat, KategoriPangkatFormValues>
      {...props}
      buildPayload={(values) => ({
        namaKategoriPangkat: values.namaKategoriPangkat,
        keterangan: values.keterangan || undefined,
        status: values.status,
      })}
      defaultValues={{ namaKategoriPangkat: "", keterangan: "", status: "Aktif" }}
      description="Kelola kategori pangkat yang dipakai di data kepegawaian."
      fields={[
        { name: "namaKategoriPangkat", label: "Nama Kategori Pangkat", required: true, placeholder: "Masukkan nama kategori pangkat" },
        { name: "keterangan", label: "Keterangan", type: "textarea", placeholder: "Tambahkan keterangan opsional" },
        { name: "status", label: "Status", type: "switch" },
      ]}
      mapInitialData={(data) => ({
        namaKategoriPangkat: data?.namaKategoriPangkat ?? "",
        keterangan: data?.keterangan ?? "",
        status: data?.status ?? "Aktif",
      })}
      resourcePath={config.path}
      successMessages={{
        create: "Kategori pangkat berhasil ditambahkan.",
        update: "Kategori pangkat berhasil diperbarui.",
      }}
      title={config.formTitle}
    />
  );
}
