import { KategoriPangkatFormModal } from "@/modules/hr/master-data/components/forms/KategoriPangkatFormModal";
import { MasterDataCrudPage } from "@/modules/hr/master-data/components/MasterDataCrudPage";
import { pageColumns } from "@/modules/hr/master-data/pages/pageColumns";
import type { KategoriPangkat } from "@/types/masterData";

export default function KategoriPangkatPage() {
  return <MasterDataCrudPage<KategoriPangkat> columns={pageColumns.kategoriPangkat} formModal={<KategoriPangkatFormModal open={false} onClose={() => undefined} onSuccess={() => undefined} />} getItemName={(item) => item.namaKategoriPangkat} resourceKey="kategoriPangkat" />;
}
