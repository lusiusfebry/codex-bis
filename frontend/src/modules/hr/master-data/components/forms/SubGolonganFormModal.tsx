import { BaseMasterDataFormModal } from "@/modules/hr/master-data/components/forms/BaseMasterDataFormModal";
import { getMasterDataConfig } from "@/modules/hr/master-data/config";
import type { SubGolongan } from "@/types/masterData";

type SubGolonganFormValues = {
  code: string;
  namaSubGolongan: string;
  keterangan: string;
  status: string;
};

type SubGolonganFormModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: SubGolongan;
};

const config = getMasterDataConfig("subGolongan");

export function SubGolonganFormModal(props: SubGolonganFormModalProps) {
  return (
    <BaseMasterDataFormModal<SubGolongan, SubGolonganFormValues>
      {...props}
      buildPayload={(values) => ({
        namaSubGolongan: values.namaSubGolongan,
        keterangan: values.keterangan || undefined,
        status: values.status,
      })}
      defaultValues={{ code: "", namaSubGolongan: "", keterangan: "", status: "Aktif" }}
      description="Kelola sub golongan turunan sesuai kebutuhan struktur perusahaan."
      fields={[
        { name: "code", label: "Code", placeholder: "Otomatis saat disimpan", readOnly: true },
        { name: "namaSubGolongan", label: "Nama Sub Golongan", required: true, placeholder: "Masukkan nama sub golongan" },
        { name: "keterangan", label: "Keterangan", type: "textarea", placeholder: "Tambahkan keterangan opsional" },
        { name: "status", label: "Status", type: "switch" },
      ]}
      mapInitialData={(data) => ({
        code: data?.code ?? "",
        namaSubGolongan: data?.namaSubGolongan ?? "",
        keterangan: data?.keterangan ?? "",
        status: data?.status ?? "Aktif",
      })}
      resourcePath={config.path}
      successMessages={{
        create: "Sub golongan berhasil ditambahkan.",
        update: "Sub golongan berhasil diperbarui.",
      }}
      title={config.formTitle}
    />
  );
}
