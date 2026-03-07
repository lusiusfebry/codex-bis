import { TagFormModal } from "@/modules/hr/master-data/components/forms/TagFormModal";
import { MasterDataCrudPage } from "@/modules/hr/master-data/components/MasterDataCrudPage";
import { pageColumns } from "@/modules/hr/master-data/pages/pageColumns";
import type { Tag } from "@/types/masterData";

export default function TagPage() {
  return <MasterDataCrudPage<Tag> columns={pageColumns.tag} formModal={<TagFormModal open={false} onClose={() => undefined} onSuccess={() => undefined} />} getItemName={(item) => item.namaTag} resourceKey="tag" />;
}
