import { useCallback } from "react";

import { MASTER_DATA_PATHS } from "@/api/masterData";
import { BaseMasterDataFormModal } from "@/modules/hr/master-data/components/forms/BaseMasterDataFormModal";
import { departmentOption } from "@/modules/hr/master-data/components/forms/formUtils";
import { getMasterDataConfig } from "@/modules/hr/master-data/config";
import { useMasterDataOptions } from "@/modules/hr/master-data/hooks/useMasterDataOptions";
import type { Department, PosisiJabatan } from "@/types/masterData";

type PosisiJabatanFormValues = {
  namaPosisiJabatan: string;
  departmentId: string;
  keterangan: string;
  status: string;
};

type PosisiJabatanFormModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: PosisiJabatan;
};

const config = getMasterDataConfig("posisiJabatan");

export function PosisiJabatanFormModal(props: PosisiJabatanFormModalProps) {
  const mapDepartment = useCallback((item: Department) => departmentOption(item), []);
  const { options } = useMasterDataOptions<Department>(MASTER_DATA_PATHS.department, mapDepartment);

  return (
    <BaseMasterDataFormModal<PosisiJabatan, PosisiJabatanFormValues>
      {...props}
      buildPayload={(values) => ({
        namaPosisiJabatan: values.namaPosisiJabatan,
        departmentId: values.departmentId,
        keterangan: values.keterangan || undefined,
        status: values.status,
      })}
      defaultValues={{ namaPosisiJabatan: "", departmentId: "", keterangan: "", status: "Aktif" }}
      description="Tentukan department induk untuk posisi jabatan ini."
      fields={[
        { name: "namaPosisiJabatan", label: "Nama Posisi Jabatan", required: true, placeholder: "Masukkan nama posisi" },
        { name: "departmentId", label: "Department", type: "select", required: true, options },
        { name: "keterangan", label: "Keterangan", type: "textarea", placeholder: "Tambahkan keterangan opsional" },
        { name: "status", label: "Status", type: "switch" },
      ]}
      mapInitialData={(data) => ({
        namaPosisiJabatan: data?.namaPosisiJabatan ?? "",
        departmentId: data?.departmentId ?? "",
        keterangan: data?.keterangan ?? "",
        status: data?.status ?? "Aktif",
      })}
      resourcePath={config.path}
      successMessages={{
        create: "Posisi jabatan berhasil ditambahkan.",
        update: "Posisi jabatan berhasil diperbarui.",
      }}
      title={config.formTitle}
    />
  );
}
