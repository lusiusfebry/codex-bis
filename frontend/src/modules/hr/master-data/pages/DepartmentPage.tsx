import { DepartmentFormModal } from "@/modules/hr/master-data/components/forms/DepartmentFormModal";
import { MasterDataCrudPage } from "@/modules/hr/master-data/components/MasterDataCrudPage";
import { pageColumns } from "@/modules/hr/master-data/pages/pageColumns";
import type { Department } from "@/types/masterData";

export default function DepartmentPage() {
  return <MasterDataCrudPage<Department> columns={pageColumns.department} formModal={<DepartmentFormModal open={false} onClose={() => undefined} onSuccess={() => undefined} />} getItemName={(item) => item.namaDepartmen} resourceKey="department" />;
}
