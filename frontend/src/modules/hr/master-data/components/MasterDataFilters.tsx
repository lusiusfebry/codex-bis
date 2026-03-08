import { Filter, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { MasterDataStatusFilter } from "@/types/masterData";

type MasterDataFiltersProps = {
  search: string;
  onSearch: (query: string) => void;
  statusFilter: MasterDataStatusFilter;
  onStatusFilter: (status: MasterDataStatusFilter) => void;
};

export function MasterDataFilters({ search, onSearch, statusFilter, onStatusFilter }: MasterDataFiltersProps) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <Filter className="h-3.5 w-3.5" />
        Filter Pencarian
      </div>
      <div className="grid gap-3 md:grid-cols-[1fr_200px]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" onChange={(event) => onSearch(event.target.value)} placeholder="Cari data master..." value={search} />
        </div>
        <Select onValueChange={(value) => onStatusFilter(value as MasterDataStatusFilter)} value={statusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Semua">Semua</SelectItem>
            <SelectItem value="Aktif">Aktif</SelectItem>
            <SelectItem value="Tidak Aktif">Tidak Aktif</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
