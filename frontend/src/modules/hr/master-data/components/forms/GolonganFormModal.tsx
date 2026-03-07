import { BaseMasterDataFormModal } from "@/modules/hr/master-data/components/forms/BaseMasterDataFormModal";
import { getMasterDataConfig } from "@/modules/hr/master-data/config";
import type { Golongan } from "@/types/masterData";

type GolonganFormValues = {
  namaGolongan: string;
  keterangan: string;
  status: string;
};

type GolonganFormModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: Golongan;
};

const config = getMasterDataConfig("golongan");

export function GolonganFormModal(props: GolonganFormModalProps) {
  return (
    <BaseMasterDataFormModal<Golongan, GolonganFormValues>
      {...props}
      buildPayload={(values) => ({
        namaGolongan: values.namaGolongan,
        keterangan: values.keterangan || undefined,
        status: values.status,
      })}
      defaultValues={{ namaGolongan: "", keterangan: "", status: "Aktif" }}
      description="Kelola golongan utama untuk struktur pangkat."
      fields={[
        { name: "namaGolongan", label: "Nama Golongan", required: true, placeholder: "Masukkan nama golongan" },
        { name: "keterangan", label: "Keterangan", type: "textarea", placeholder: "Tambahkan keterangan opsional" },
        { name: "status", label: "Status", type: "switch" },
      ]}
      mapInitialData={(data) => ({
        namaGolongan: data?.namaGolongan ?? "",
        keterangan: data?.keterangan ?? "",
        status: data?.status ?? "Aktif",
      })}
      resourcePath={config.path}
      successMessages={{
        create: "Golongan berhasil ditambahkan.",
        update: "Golongan berhasil diperbarui.",
      }}
      title={config.formTitle}
    />
  );
}
