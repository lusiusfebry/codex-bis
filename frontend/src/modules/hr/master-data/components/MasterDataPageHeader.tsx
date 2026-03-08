import { Database, Plus } from "lucide-react";

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
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1B2A47] via-[#243B69] to-[#31518F] p-5 text-white shadow-panel">
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-amber-400/10 blur-3xl" />
      <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 backdrop-blur">
            <Database className="h-4 w-4 text-accent" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-extrabold">{title}</h1>
              <Badge className="border-0 bg-white/15 text-[10px] text-white">{total} data</Badge>
            </div>
            <p className="mt-0.5 text-xs text-white/60">{description}</p>
          </div>
        </div>
        <Button
          className="gap-2 rounded-lg bg-accent text-xs font-semibold text-accent-foreground shadow-sm shadow-accent/20 hover:bg-accent/90"
          onClick={onAdd}
          size="sm"
        >
          <Plus className="h-3.5 w-3.5" />
          Tambah
        </Button>
      </div>
    </div>
  );
}
