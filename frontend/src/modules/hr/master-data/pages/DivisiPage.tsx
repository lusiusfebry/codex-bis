import { DivisiFormModal } from "@/modules/hr/master-data/components/forms/DivisiFormModal";
import { MasterDataCrudPage } from "@/modules/hr/master-data/components/MasterDataCrudPage";
import { pageColumns } from "@/modules/hr/master-data/pages/pageColumns";
import type { Divisi } from "@/types/masterData";

export default function DivisiPage() {
  return <MasterDataCrudPage<Divisi> columns={pageColumns.divisi} formModal={<DivisiFormModal open={false} onClose={() => undefined} onSuccess={() => undefined} />} getItemName={(item) => item.namaDivisi} resourceKey="divisi" />;
}
