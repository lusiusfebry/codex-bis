import { BaseMasterDataFormModal } from "@/modules/hr/master-data/components/forms/BaseMasterDataFormModal";
import { getMasterDataConfig } from "@/modules/hr/master-data/config";
import type { JenisHubunganKerja } from "@/types/masterData";

type JenisHubunganKerjaFormValues = {
  namaJenisHubunganKerja: string;
  keterangan: string;
  status: string;
};

type JenisHubunganKerjaFormModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: JenisHubunganKerja;
};

const config = getMasterDataConfig("jenisHubunganKerja");

export function JenisHubunganKerjaFormModal(props: JenisHubunganKerjaFormModalProps) {
  return (
    <BaseMasterDataFormModal<JenisHubunganKerja, JenisHubunganKerjaFormValues>
      {...props}
      buildPayload={(values) => ({
        namaJenisHubunganKerja: values.namaJenisHubunganKerja,
        keterangan: values.keterangan || undefined,
        status: values.status,
      })}
      defaultValues={{ namaJenisHubunganKerja: "", keterangan: "", status: "Aktif" }}
      description="Kelola jenis hubungan kerja yang tersedia bagi karyawan."
      fields={[
        { name: "namaJenisHubunganKerja", label: "Nama Jenis Hubungan Kerja", required: true, placeholder: "Masukkan jenis hubungan kerja" },
        { name: "keterangan", label: "Keterangan", type: "textarea", placeholder: "Tambahkan keterangan opsional" },
        { name: "status", label: "Status", type: "switch" },
      ]}
      mapInitialData={(data) => ({
        namaJenisHubunganKerja: data?.namaJenisHubunganKerja ?? "",
        keterangan: data?.keterangan ?? "",
        status: data?.status ?? "Aktif",
      })}
      resourcePath={config.path}
      successMessages={{
        create: "Jenis hubungan kerja berhasil ditambahkan.",
        update: "Jenis hubungan kerja berhasil diperbarui.",
      }}
      title={config.formTitle}
    />
  );
}
