import { useCallback } from "react";

import { getMasterDataConfig } from "@/modules/hr/master-data/config";
import { BaseMasterDataFormModal } from "@/modules/hr/master-data/components/forms/BaseMasterDataFormModal";
import { divisiOption } from "@/modules/hr/master-data/components/forms/formUtils";
import { useMasterDataOptions } from "@/modules/hr/master-data/hooks/useMasterDataOptions";
import type { Department, Divisi } from "@/types/masterData";
import { MASTER_DATA_PATHS } from "@/api/masterData";

type DepartmentFormValues = {
  code: string;
  namaDepartmen: string;
  divisiId: string;
  keterangan: string;
  status: string;
};

type DepartmentFormModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: Department;
};

const config = getMasterDataConfig("department");

export function DepartmentFormModal(props: DepartmentFormModalProps) {
  const mapDivisi = useCallback((item: Divisi) => divisiOption(item), []);
  const { options } = useMasterDataOptions<Divisi>(MASTER_DATA_PATHS.divisi, mapDivisi);

  return (
    <BaseMasterDataFormModal<Department, DepartmentFormValues>
      {...props}
      buildPayload={(values) => ({
        namaDepartmen: values.namaDepartmen,
        divisiId: values.divisiId,
        keterangan: values.keterangan || undefined,
        status: values.status,
      })}
      defaultValues={{ code: "", namaDepartmen: "", divisiId: "", keterangan: "", status: "Aktif" }}
      description="Pilih divisi induk untuk department ini."
      fields={[
        { name: "code", label: "Code", placeholder: "Otomatis saat disimpan", readOnly: true },
        { name: "namaDepartmen", label: "Nama Department", required: true, placeholder: "Masukkan nama department" },
        { name: "divisiId", label: "Divisi", type: "select", required: true, options },
        { name: "keterangan", label: "Keterangan", type: "textarea", placeholder: "Tambahkan keterangan opsional" },
        { name: "status", label: "Status", type: "switch" },
      ]}
      mapInitialData={(data) => ({
        code: data?.code ?? "",
        namaDepartmen: data?.namaDepartmen ?? "",
        divisiId: data?.divisiId ?? "",
        keterangan: data?.keterangan ?? "",
        status: data?.status ?? "Aktif",
      })}
      resourcePath={config.path}
      successMessages={{
        create: "Department berhasil ditambahkan.",
        update: "Department berhasil diperbarui.",
      }}
      title={config.formTitle}
    />
  );
}
