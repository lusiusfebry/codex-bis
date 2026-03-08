import { BaseMasterDataFormModal } from "@/modules/hr/master-data/components/forms/BaseMasterDataFormModal";
import { getMasterDataConfig } from "@/modules/hr/master-data/config";
import type { Divisi } from "@/types/masterData";

type DivisiFormValues = {
  code: string;
  namaDivisi: string;
  keterangan: string;
  status: string;
};

type DivisiFormModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: Divisi;
};

const config = getMasterDataConfig("divisi");

export function DivisiFormModal(props: DivisiFormModalProps) {
  return (
    <BaseMasterDataFormModal<Divisi, DivisiFormValues>
      {...props}
      buildPayload={(values) => ({
        namaDivisi: values.namaDivisi,
        keterangan: values.keterangan || undefined,
        status: values.status,
      })}
      defaultValues={{ code: "", namaDivisi: "", keterangan: "", status: "Aktif" }}
      description="Isi informasi divisi yang akan digunakan pada sistem HR."
      fields={[
        { name: "code", label: "Code", placeholder: "Otomatis saat disimpan", readOnly: true },
        { name: "namaDivisi", label: "Nama Divisi", required: true, placeholder: "Masukkan nama divisi" },
        { name: "keterangan", label: "Keterangan", type: "textarea", placeholder: "Tambahkan keterangan opsional" },
        { name: "status", label: "Status", type: "switch" },
      ]}
      mapInitialData={(data) => ({
        code: data?.code ?? "",
        namaDivisi: data?.namaDivisi ?? "",
        keterangan: data?.keterangan ?? "",
        status: data?.status ?? "Aktif",
      })}
      resourcePath={config.path}
      successMessages={{
        create: "Divisi berhasil ditambahkan.",
        update: "Divisi berhasil diperbarui.",
      }}
      title={config.formTitle}
    />
  );
}
