import { useEffect, useMemo, useRef, useState } from "react";
import { FileSpreadsheet, Loader2, Upload, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

import axiosInstance from "@/api/axiosInstance";
import { importKaryawanExcelApi } from "@/api/karyawan";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toastError, toastSuccess, toastWarning } from "@/lib/toast";
import type { ImportResultRow } from "@/types/karyawan";

type PreviewRow = {
  baris: number;
  nik?: string;
  namaLengkap?: string;
  divisi?: string;
  department?: string;
  posisiJabatan?: string;
};

type ImportExcelModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

type ImportStep = "upload" | "preview" | "result";

function validateFile(file: File) {
  const isXlsx = file.name.toLowerCase().endsWith(".xlsx");
  const isValidSize = file.size <= 10 * 1024 * 1024;

  if (!isXlsx) {
    toastWarning("Gunakan file Excel dengan ekstensi .xlsx.");
    return false;
  }

  if (!isValidSize) {
    toastWarning("Ukuran file maksimal 10MB.");
    return false;
  }

  return true;
}

function getResultVariant(status: "sukses" | "gagal") {
  return status === "sukses"
    ? "bg-emerald-100 text-emerald-700"
    : "bg-rose-100 text-rose-700";
}

export default function ImportExcelModal({
  open,
  onClose,
  onSuccess,
}: ImportExcelModalProps) {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [step, setStep] = useState<ImportStep>("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewRows, setPreviewRows] = useState<PreviewRow[]>([]);
  const [resultRows, setResultRows] = useState<ImportResultRow[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    if (!open) {
      setStep("upload");
      setSelectedFile(null);
      setPreviewRows([]);
      setResultRows([]);
      setDragActive(false);
      setPreviewLoading(false);
      setImporting(false);
    }
  }, [open]);

  const successCount = useMemo(
    () => resultRows.filter((item) => item.status === "sukses").length,
    [resultRows],
  );
  const failedCount = useMemo(
    () => resultRows.filter((item) => item.status === "gagal").length,
    [resultRows],
  );

  const handleFileSelection = async (file?: File) => {
    if (!file || !validateFile(file)) {
      return;
    }

    setSelectedFile(file);
    setPreviewLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axiosInstance.post<{
        success: boolean;
        data: PreviewRow[];
      }>("/hr/karyawan/import/preview", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setPreviewRows(response.data.data);
      setStep("preview");
    } catch (error) {
      toastError(error instanceof Error ? error.message : "Gagal membaca preview file.");
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) {
      return;
    }

    setImporting(true);

    try {
      const result = await importKaryawanExcelApi(selectedFile);
      setResultRows(result);
      setStep("result");
      onSuccess();

      const totalFailed = result.filter((item) => item.status === "gagal").length;
      const totalSuccess = result.filter((item) => item.status === "sukses").length;

      if (totalFailed > 0) {
        toastWarning(`${totalFailed} baris gagal diimport, periksa laporan.`);
      } else {
        toastSuccess(`Import berhasil: ${totalSuccess} karyawan ditambahkan.`);
      }
    } catch (error) {
      toastError(error instanceof Error ? error.message : "Gagal memproses import karyawan.");
    } finally {
      setImporting(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = await axiosInstance.get("/hr/karyawan/template", {
        responseType: "blob",
      });

      const blobUrl = URL.createObjectURL(response.data);
      const anchor = document.createElement("a");
      anchor.href = blobUrl;
      anchor.download = "template-import-karyawan.xlsx";
      anchor.click();
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      toastError(error instanceof Error ? error.message : "Gagal mengunduh template import.");
    }
  };

  return (
    <Dialog onOpenChange={(nextOpen) => (!nextOpen ? onClose() : null)} open={open}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>Import Excel Karyawan</DialogTitle>
          <DialogDescription>
            Upload file Excel, cek preview data, lalu proses import dan tinjau hasilnya.
          </DialogDescription>
        </DialogHeader>

        {step === "upload" ? (
          <div className="space-y-4">
            <div
              className={`rounded-2xl border-2 border-dashed p-8 text-center transition ${
                dragActive ? "border-primary bg-primary/5" : "border-border"
              }`}
              onDragLeave={() => setDragActive(false)}
              onDragOver={(event) => {
                event.preventDefault();
                setDragActive(true);
              }}
              onDrop={(event) => {
                event.preventDefault();
                setDragActive(false);
                void handleFileSelection(event.dataTransfer.files?.[0]);
              }}
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                {previewLoading ? (
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                ) : (
                  <FileSpreadsheet className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              <div className="space-y-2">
                <p className="font-medium text-foreground">
                  Drag & drop file `.xlsx` di sini
                </p>
                <p className="text-sm text-muted-foreground">
                  Maksimal 10MB. Sistem akan menampilkan preview 10 baris pertama sebelum import.
                </p>
              </div>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button onClick={() => inputRef.current?.click()} type="button">
                  <Upload className="mr-2 h-4 w-4" />
                  Pilih File
                </Button>
                <Button onClick={handleDownloadTemplate} type="button" variant="outline">
                  Download Template
                </Button>
              </div>
              <Input
                accept=".xlsx"
                className="hidden"
                onChange={(event) => {
                  void handleFileSelection(event.target.files?.[0]);
                  event.target.value = "";
                }}
                ref={inputRef}
                type="file"
              />
            </div>
          </div>
        ) : null}

        {step === "preview" ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-2xl border bg-muted/30 px-4 py-3">
              <div>
                <div className="font-medium text-foreground">{selectedFile?.name}</div>
                <div className="text-sm text-muted-foreground">
                  Preview 10 baris pertama sebelum proses import.
                </div>
              </div>
              <Button
                onClick={() => {
                  setStep("upload");
                  setSelectedFile(null);
                  setPreviewRows([]);
                }}
                size="sm"
                type="button"
                variant="ghost"
              >
                <X className="mr-2 h-4 w-4" />
                Ganti File
              </Button>
            </div>

            <div className="max-h-[420px] overflow-auto rounded-2xl border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Baris</TableHead>
                    <TableHead>NIK</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>Divisi</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Posisi Jabatan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previewRows.map((row) => (
                    <TableRow key={row.baris}>
                      <TableCell>{row.baris}</TableCell>
                      <TableCell>{row.nik ?? "-"}</TableCell>
                      <TableCell>{row.namaLengkap ?? "-"}</TableCell>
                      <TableCell>{row.divisi ?? "-"}</TableCell>
                      <TableCell>{row.department ?? "-"}</TableCell>
                      <TableCell>{row.posisiJabatan ?? "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        ) : null}

        {step === "result" ? (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                Sukses: {successCount}
              </Badge>
              <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100">
                Gagal: {failedCount}
              </Badge>
            </div>

            <div className="max-h-[420px] overflow-auto rounded-2xl border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No. Baris</TableHead>
                    <TableHead>NIK</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Keterangan Error</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resultRows.map((row) => (
                    <TableRow
                      key={`${row.baris}-${row.nik ?? row.nama ?? "row"}`}
                      className={row.status === "sukses" ? "bg-emerald-50/80" : "bg-rose-50/80"}
                    >
                      <TableCell>{row.baris}</TableCell>
                      <TableCell>{row.nik ?? "-"}</TableCell>
                      <TableCell>{row.nama ?? "-"}</TableCell>
                      <TableCell>
                        <Badge className={getResultVariant(row.status)}>{row.status}</Badge>
                      </TableCell>
                      <TableCell>{row.keterangan ?? "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        ) : null}

        <DialogFooter>
          {step === "upload" ? (
            <Button onClick={onClose} type="button" variant="outline">
              Tutup
            </Button>
          ) : null}

          {step === "preview" ? (
            <>
              <Button onClick={onClose} type="button" variant="outline">
                Batal
              </Button>
              <Button disabled={importing} onClick={() => void handleImport()} type="button">
                {importing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  "Proses Import"
                )}
              </Button>
            </>
          ) : null}

          {step === "result" ? (
            <>
              <Button onClick={onClose} type="button" variant="outline">
                Tutup
              </Button>
              <Button
                onClick={() => {
                  onClose();
                  navigate("/hr/karyawan");
                }}
                type="button"
              >
                Lihat Karyawan
              </Button>
            </>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
