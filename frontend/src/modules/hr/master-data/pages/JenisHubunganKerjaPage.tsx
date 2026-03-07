import { JenisHubunganKerjaFormModal } from "@/modules/hr/master-data/components/forms/JenisHubunganKerjaFormModal";
import { MasterDataCrudPage } from "@/modules/hr/master-data/components/MasterDataCrudPage";
import { pageColumns } from "@/modules/hr/master-data/pages/pageColumns";
import type { JenisHubunganKerja } from "@/types/masterData";

export default function JenisHubunganKerjaPage() {
  return <MasterDataCrudPage<JenisHubunganKerja> columns={pageColumns.jenisHubunganKerja} formModal={<JenisHubunganKerjaFormModal open={false} onClose={() => undefined} onSuccess={() => undefined} />} getItemName={(item) => item.namaJenisHubunganKerja} resourceKey="jenisHubunganKerja" />;
}
