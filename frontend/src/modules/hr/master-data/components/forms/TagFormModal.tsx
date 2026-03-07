import { BaseMasterDataFormModal } from "@/modules/hr/master-data/components/forms/BaseMasterDataFormModal";
import { getMasterDataConfig } from "@/modules/hr/master-data/config";
import type { Tag } from "@/types/masterData";

type TagFormValues = {
  namaTag: string;
  warnaTag: string;
  keterangan: string;
  status: string;
};

type TagFormModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: Tag;
};

const config = getMasterDataConfig("tag");

export function TagFormModal(props: TagFormModalProps) {
  return (
    <BaseMasterDataFormModal<Tag, TagFormValues>
      {...props}
      buildPayload={(values) => ({
        namaTag: values.namaTag,
        warnaTag: values.warnaTag,
        keterangan: values.keterangan || undefined,
        status: values.status,
      })}
      defaultValues={{ namaTag: "", warnaTag: "#1B2A47", keterangan: "", status: "Aktif" }}
      description="Tetapkan nama tag beserta warna visual yang akan dipakai pada tampilan data."
      fields={[
        { name: "namaTag", label: "Nama Tag", required: true, placeholder: "Masukkan nama tag" },
        { name: "warnaTag", label: "Warna Tag", type: "color", required: true },
        { name: "keterangan", label: "Keterangan", type: "textarea", placeholder: "Tambahkan keterangan opsional" },
        { name: "status", label: "Status", type: "switch" },
      ]}
      mapInitialData={(data) => ({
        namaTag: data?.namaTag ?? "",
        warnaTag: data?.warnaTag ?? "#1B2A47",
        keterangan: data?.keterangan ?? "",
        status: data?.status ?? "Aktif",
      })}
      resourcePath={config.path}
      successMessages={{
        create: "Tag berhasil ditambahkan.",
        update: "Tag berhasil diperbarui.",
      }}
      title={config.formTitle}
    />
  );
}
