import { GolonganFormModal } from "@/modules/hr/master-data/components/forms/GolonganFormModal";
import { MasterDataCrudPage } from "@/modules/hr/master-data/components/MasterDataCrudPage";
import { pageColumns } from "@/modules/hr/master-data/pages/pageColumns";
import type { Golongan } from "@/types/masterData";

export default function GolonganPage() {
  return <MasterDataCrudPage<Golongan> columns={pageColumns.golongan} formModal={<GolonganFormModal open={false} onClose={() => undefined} onSuccess={() => undefined} />} getItemName={(item) => item.namaGolongan} resourceKey="golongan" />;
}
