import { Pencil, Trash2 } from "lucide-react";

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
    <div className="rounded-2xl border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead className={column.className} key={column.key}>
                {column.header}
              </TableHead>
            ))}
            <TableHead className="w-[120px] text-right">Aksi</TableHead>
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
                    <div className="flex justify-end gap-2">
                      <Skeleton className="h-9 w-9 rounded-lg" />
                      <Skeleton className="h-9 w-9 rounded-lg" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            : null}
          {!loading && data.length === 0 ? (
            <TableRow>
              <TableCell className="py-10 text-center text-muted-foreground" colSpan={columns.length + 1}>
                Belum ada data untuk ditampilkan.
              </TableCell>
            </TableRow>
          ) : null}
          {!loading
            ? data.map((item) => (
                <TableRow key={item.id}>
                  {columns.map((column) => (
                    <TableCell className={column.className} key={`${item.id}-${column.key}`}>
                      {column.render(item)}
                    </TableCell>
                  ))}
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button onClick={() => onEdit(item)} size="icon" type="button" variant="outline">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button onClick={() => onDelete(item)} size="icon" type="button" variant="destructive">
                        <Trash2 className="h-4 w-4" />
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
