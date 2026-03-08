import { BaseMasterDataFormModal } from "@/modules/hr/master-data/components/forms/BaseMasterDataFormModal";
import { getMasterDataConfig } from "@/modules/hr/master-data/config";
import type { StatusKaryawan } from "@/types/masterData";

type StatusKaryawanFormValues = {
  code: string;
  namaStatus: string;
  keterangan: string;
  status: string;
};

type StatusKaryawanFormModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: StatusKaryawan;
};

const config = getMasterDataConfig("statusKaryawan");

export function StatusKaryawanFormModal(props: StatusKaryawanFormModalProps) {
  return (
    <BaseMasterDataFormModal<StatusKaryawan, StatusKaryawanFormValues>
      {...props}
      buildPayload={(values) => ({
        namaStatus: values.namaStatus,
        keterangan: values.keterangan || undefined,
        status: values.status,
      })}
      defaultValues={{ code: "", namaStatus: "", keterangan: "", status: "Aktif" }}
      description="Kelola status kepegawaian yang akan dipakai saat filtering dan validasi data."
      fields={[
        { name: "code", label: "Code", placeholder: "Otomatis saat disimpan", readOnly: true },
        { name: "namaStatus", label: "Nama Status", required: true, placeholder: "Masukkan nama status" },
        { name: "keterangan", label: "Keterangan", type: "textarea", placeholder: "Tambahkan keterangan opsional" },
        { name: "status", label: "Status", type: "switch" },
      ]}
      mapInitialData={(data) => ({
        code: data?.code ?? "",
        namaStatus: data?.namaStatus ?? "",
        keterangan: data?.keterangan ?? "",
        status: data?.status ?? "Aktif",
      })}
      resourcePath={config.path}
      successMessages={{
        create: "Status karyawan berhasil ditambahkan.",
        update: "Status karyawan berhasil diperbarui.",
      }}
      title={config.formTitle}
    />
  );
}
