import { SubGolonganFormModal } from "@/modules/hr/master-data/components/forms/SubGolonganFormModal";
import { MasterDataCrudPage } from "@/modules/hr/master-data/components/MasterDataCrudPage";
import { pageColumns } from "@/modules/hr/master-data/pages/pageColumns";
import type { SubGolongan } from "@/types/masterData";

export default function SubGolonganPage() {
  return <MasterDataCrudPage<SubGolongan> columns={pageColumns.subGolongan} formModal={<SubGolonganFormModal open={false} onClose={() => undefined} onSuccess={() => undefined} />} getItemName={(item) => item.namaSubGolongan} resourceKey="subGolongan" />;
}
