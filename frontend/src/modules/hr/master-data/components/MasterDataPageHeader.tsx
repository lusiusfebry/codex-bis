import { Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type MasterDataPageHeaderProps = {
  title: string;
  description: string;
  total: number;
  onAdd: () => void;
};

export function MasterDataPageHeader({ title, description, total, onAdd }: MasterDataPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border bg-card p-6 shadow-sm md:flex-row md:items-center md:justify-between">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-black text-primary">{title}</h1>
          <Badge variant="secondary">{total} data</Badge>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Button className="gap-2" onClick={onAdd}>
        <Plus className="h-4 w-4" />
        Tambah
      </Button>
    </div>
  );
}
