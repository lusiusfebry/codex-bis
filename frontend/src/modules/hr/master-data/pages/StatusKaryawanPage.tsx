import { StatusKaryawanFormModal } from "@/modules/hr/master-data/components/forms/StatusKaryawanFormModal";
import { MasterDataCrudPage } from "@/modules/hr/master-data/components/MasterDataCrudPage";
import { pageColumns } from "@/modules/hr/master-data/pages/pageColumns";
import type { StatusKaryawan } from "@/types/masterData";

export default function StatusKaryawanPage() {
  return <MasterDataCrudPage<StatusKaryawan> columns={pageColumns.statusKaryawan} formModal={<StatusKaryawanFormModal open={false} onClose={() => undefined} onSuccess={() => undefined} />} getItemName={(item) => item.namaStatus} resourceKey="statusKaryawan" />;
}
