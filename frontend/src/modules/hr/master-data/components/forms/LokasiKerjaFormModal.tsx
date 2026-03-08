import { BaseMasterDataFormModal } from "@/modules/hr/master-data/components/forms/BaseMasterDataFormModal";
import { getMasterDataConfig } from "@/modules/hr/master-data/config";
import type { LokasiKerja } from "@/types/masterData";

type LokasiKerjaFormValues = {
  code: string;
  namaLokasiKerja: string;
  alamat: string;
  keterangan: string;
  status: string;
};

type LokasiKerjaFormModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: LokasiKerja;
};

const config = getMasterDataConfig("lokasiKerja");

export function LokasiKerjaFormModal(props: LokasiKerjaFormModalProps) {
  return (
    <BaseMasterDataFormModal<LokasiKerja, LokasiKerjaFormValues>
      {...props}
      buildPayload={(values) => ({
        namaLokasiKerja: values.namaLokasiKerja,
        alamat: values.alamat || undefined,
        keterangan: values.keterangan || undefined,
        status: values.status,
      })}
      defaultValues={{ code: "", namaLokasiKerja: "", alamat: "", keterangan: "", status: "Aktif" }}
      description="Kelola lokasi kerja, site, maupun kantor yang digunakan pada sistem HR."
      fields={[
        { name: "code", label: "Code", placeholder: "Otomatis saat disimpan", readOnly: true },
        { name: "namaLokasiKerja", label: "Nama Lokasi Kerja", required: true, placeholder: "Masukkan nama lokasi kerja" },
        { name: "alamat", label: "Alamat", type: "textarea", placeholder: "Masukkan alamat lokasi" },
        { name: "keterangan", label: "Keterangan", type: "textarea", placeholder: "Tambahkan keterangan opsional" },
        { name: "status", label: "Status", type: "switch" },
      ]}
      mapInitialData={(data) => ({
        code: data?.code ?? "",
        namaLokasiKerja: data?.namaLokasiKerja ?? "",
        alamat: data?.alamat ?? "",
        keterangan: data?.keterangan ?? "",
        status: data?.status ?? "Aktif",
      })}
      resourcePath={config.path}
      successMessages={{
        create: "Lokasi kerja berhasil ditambahkan.",
        update: "Lokasi kerja berhasil diperbarui.",
      }}
      title={config.formTitle}
    />
  );
}
