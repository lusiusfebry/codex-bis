import { PosisiJabatanFormModal } from "@/modules/hr/master-data/components/forms/PosisiJabatanFormModal";
import { MasterDataCrudPage } from "@/modules/hr/master-data/components/MasterDataCrudPage";
import { pageColumns } from "@/modules/hr/master-data/pages/pageColumns";
import type { PosisiJabatan } from "@/types/masterData";

export default function PosisiJabatanPage() {
  return <MasterDataCrudPage<PosisiJabatan> columns={pageColumns.posisiJabatan} formModal={<PosisiJabatanFormModal open={false} onClose={() => undefined} onSuccess={() => undefined} />} getItemName={(item) => item.namaPosisiJabatan} resourceKey="posisiJabatan" />;
}
