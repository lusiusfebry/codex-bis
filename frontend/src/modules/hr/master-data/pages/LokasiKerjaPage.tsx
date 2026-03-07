import { LokasiKerjaFormModal } from "@/modules/hr/master-data/components/forms/LokasiKerjaFormModal";
import { MasterDataCrudPage } from "@/modules/hr/master-data/components/MasterDataCrudPage";
import { pageColumns } from "@/modules/hr/master-data/pages/pageColumns";
import type { LokasiKerja } from "@/types/masterData";

export default function LokasiKerjaPage() {
  return <MasterDataCrudPage<LokasiKerja> columns={pageColumns.lokasiKerja} formModal={<LokasiKerjaFormModal open={false} onClose={() => undefined} onSuccess={() => undefined} />} getItemName={(item) => item.namaLokasiKerja} resourceKey="lokasiKerja" />;
}
