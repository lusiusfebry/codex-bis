import { Database, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { MasterDataColumn } from "@/modules/hr/master-data/config";

type MasterDataTableProps<T extends { id: string }> = {
  columns: MasterDataColumn<T>[];
  data: T[];
  loading: boolean;
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
};

export function MasterDataTable<T extends { id: string }>({
  columns,
  data,
  loading,
  onEdit,
  onDelete,
}: MasterDataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            {columns.map((column) => (
              <TableHead className={`text-xs font-semibold uppercase tracking-wider ${column.className ?? ""}`} key={column.key}>
                {column.header}
              </TableHead>
            ))}
            <TableHead className="w-[100px] text-right text-xs font-semibold uppercase tracking-wider">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading
            ? Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={`skeleton-${index}`}>
                {columns.map((column) => (
                  <TableCell key={`${column.key}-${index}`}>
                    <Skeleton className="h-5 w-full max-w-[180px]" />
                  </TableCell>
                ))}
                <TableCell>
                  <div className="flex justify-end gap-1.5">
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <Skeleton className="h-8 w-8 rounded-lg" />
                  </div>
                </TableCell>
              </TableRow>
            ))
            : null}
          {!loading && data.length === 0 ? (
            <TableRow>
              <TableCell className="py-12 text-center" colSpan={columns.length + 1}>
                <div className="flex flex-col items-center gap-2">
                  <Database className="h-8 w-8 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">Belum ada data untuk ditampilkan.</p>
                </div>
              </TableCell>
            </TableRow>
          ) : null}
          {!loading
            ? data.map((item, index) => (
              <TableRow
                key={item.id}
                className={`transition-colors ${index % 2 === 1 ? "bg-muted/10" : ""}`}
              >
                {columns.map((column) => (
                  <TableCell className={`text-sm ${column.className ?? ""}`} key={`${item.id}-${column.key}`}>
                    {column.render(item)}
                  </TableCell>
                ))}
                <TableCell>
                  <div className="flex justify-end gap-1.5">
                    <Button className="h-8 w-8" onClick={() => onEdit(item)} size="icon" type="button" variant="ghost">
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => onDelete(item)} size="icon" type="button" variant="ghost">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
            : null}
        </TableBody>
      </Table>
    </div>
  );
}
