import React from "react";
import { useMemo, useState } from "react";

import { deleteMasterData } from "@/api/masterData";
import { Badge } from "@/components/ui/badge";
import { toastError, toastSuccess } from "@/lib/toast";
import { getMasterDataConfig, type MasterDataColumn } from "@/modules/hr/master-data/config";
import { DeleteConfirmDialog } from "@/modules/hr/master-data/components/DeleteConfirmDialog";
import { MasterDataFilters } from "@/modules/hr/master-data/components/MasterDataFilters";
import { MasterDataPageHeader } from "@/modules/hr/master-data/components/MasterDataPageHeader";
import { MasterDataPagination } from "@/modules/hr/master-data/components/MasterDataPagination";
import { MasterDataTable } from "@/modules/hr/master-data/components/MasterDataTable";
import { useMasterData } from "@/modules/hr/master-data/hooks/useMasterData";
import type { MasterDataResourceKey } from "@/types/masterData";

type MasterDataCrudPageProps<T extends { id: string; status: string }> = {
  resourceKey: MasterDataResourceKey;
  columns: MasterDataColumn<T>[];
  formModal: React.ReactNode;
  getItemName: (item: T) => string;
};

export function StatusBadge({ status }: { status: string }) {
  return <Badge variant={status === "Aktif" ? "default" : "secondary"}>{status}</Badge>;
}

export function MasterDataCrudPage<T extends { id: string; status: string }>({
  resourceKey,
  columns,
  formModal,
  getItemName,
}: MasterDataCrudPageProps<T>) {
  const config = getMasterDataConfig(resourceKey);
  const { data, loading, page, search, statusFilter, totalPages, totalItems, nextCode, refetch, handlePageChange, handleSearch, handleStatusFilter } =
    useMasterData<T>({
      resource: config.path,
    });
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<T | undefined>(undefined);

  const modal = useMemo(
    () =>
      formModal
        ? (formModal as React.ReactElement<{
            open: boolean;
            onClose: () => void;
            onSuccess: () => void;
            initialData?: T;
            nextCode?: string;
          }>)
        : null,
    [formModal],
  );

  const handleAdd = () => {
    setSelectedItem(undefined);
    setFormOpen(true);
  };

  const handleEdit = (item: T) => {
    setSelectedItem(item);
    setFormOpen(true);
  };

  const handleDelete = (item: T) => {
    setSelectedItem(item);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedItem) {
      return;
    }

    setDeleteLoading(true);

    try {
      await deleteMasterData(config.path, selectedItem.id);
      toastSuccess(`${config.formTitle} berhasil dihapus.`);
      setDeleteOpen(false);
      setSelectedItem(undefined);
      await refetch();
    } catch (error) {
      toastError(error instanceof Error ? error.message : `Gagal menghapus ${config.formTitle}.`);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <MasterDataPageHeader description={config.description} onAdd={handleAdd} title={config.title} total={totalItems} />
      <MasterDataFilters onSearch={handleSearch} onStatusFilter={handleStatusFilter} search={search} statusFilter={statusFilter} />
      <MasterDataTable columns={columns} data={data} loading={loading} onDelete={handleDelete} onEdit={handleEdit} />
      <MasterDataPagination onPageChange={handlePageChange} page={page} totalPages={totalPages} />

      {modal
        ? React.cloneElement(modal, {
            open: formOpen,
            onClose: () => setFormOpen(false),
            onSuccess: refetch,
            initialData: selectedItem,
            nextCode,
          })
        : null}

      <DeleteConfirmDialog
        itemName={selectedItem ? getItemName(selectedItem) : "-"}
        loading={deleteLoading}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        open={deleteOpen}
      />
    </div>
  );
}
