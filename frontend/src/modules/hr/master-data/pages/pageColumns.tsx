import { Badge } from "@/components/ui/badge";
import type { MasterDataColumnMap } from "@/modules/hr/master-data/config";
import { StatusBadge } from "@/modules/hr/master-data/components/MasterDataCrudPage";

export const pageColumns: MasterDataColumnMap = {
  divisi: [
    { key: "code", header: "Code", render: (item) => item.code },
    { key: "namaDivisi", header: "Nama Divisi", render: (item) => item.namaDivisi },
    { key: "keterangan", header: "Keterangan", render: (item) => item.keterangan || "-" },
    { key: "status", header: "Status", render: (item) => <StatusBadge status={item.status} /> },
  ],
  department: [
    { key: "code", header: "Code", render: (item) => item.code },
    { key: "namaDepartmen", header: "Nama Department", render: (item) => item.namaDepartmen },
    { key: "divisi", header: "Divisi", render: (item) => item.divisi?.namaDivisi || "-" },
    { key: "keterangan", header: "Keterangan", render: (item) => item.keterangan || "-" },
    { key: "status", header: "Status", render: (item) => <StatusBadge status={item.status} /> },
  ],
  posisiJabatan: [
    { key: "code", header: "Code", render: (item) => item.code },
    { key: "namaPosisiJabatan", header: "Nama Posisi", render: (item) => item.namaPosisiJabatan },
    { key: "department", header: "Department", render: (item) => item.department?.namaDepartmen || "-" },
    { key: "keterangan", header: "Keterangan", render: (item) => item.keterangan || "-" },
    { key: "status", header: "Status", render: (item) => <StatusBadge status={item.status} /> },
  ],
  kategoriPangkat: [
    { key: "code", header: "Code", render: (item) => item.code },
    { key: "namaKategoriPangkat", header: "Nama Kategori", render: (item) => item.namaKategoriPangkat },
    { key: "keterangan", header: "Keterangan", render: (item) => item.keterangan || "-" },
    { key: "status", header: "Status", render: (item) => <StatusBadge status={item.status} /> },
  ],
  golongan: [
    { key: "code", header: "Code", render: (item) => item.code },
    { key: "namaGolongan", header: "Nama Golongan", render: (item) => item.namaGolongan },
    { key: "keterangan", header: "Keterangan", render: (item) => item.keterangan || "-" },
    { key: "status", header: "Status", render: (item) => <StatusBadge status={item.status} /> },
  ],
  subGolongan: [
    { key: "code", header: "Code", render: (item) => item.code },
    { key: "namaSubGolongan", header: "Nama Sub Golongan", render: (item) => item.namaSubGolongan },
    { key: "keterangan", header: "Keterangan", render: (item) => item.keterangan || "-" },
    { key: "status", header: "Status", render: (item) => <StatusBadge status={item.status} /> },
  ],
  jenisHubunganKerja: [
    { key: "code", header: "Code", render: (item) => item.code },
    { key: "namaJenisHubunganKerja", header: "Nama Jenis HK", render: (item) => item.namaJenisHubunganKerja },
    { key: "keterangan", header: "Keterangan", render: (item) => item.keterangan || "-" },
    { key: "status", header: "Status", render: (item) => <StatusBadge status={item.status} /> },
  ],
  tag: [
    { key: "code", header: "Code", render: (item) => item.code },
    {
      key: "namaTag",
      header: "Tag",
      render: (item) => (
        <Badge style={{ backgroundColor: item.warnaTag, color: "#fff" }}>
          {item.namaTag}
        </Badge>
      ),
    },
    { key: "keterangan", header: "Keterangan", render: (item) => item.keterangan || "-" },
    { key: "status", header: "Status", render: (item) => <StatusBadge status={item.status} /> },
  ],
  lokasiKerja: [
    { key: "code", header: "Code", render: (item) => item.code },
    { key: "namaLokasiKerja", header: "Nama Lokasi", render: (item) => item.namaLokasiKerja },
    { key: "alamat", header: "Alamat", render: (item) => item.alamat || "-" },
    { key: "keterangan", header: "Keterangan", render: (item) => item.keterangan || "-" },
    { key: "status", header: "Status", render: (item) => <StatusBadge status={item.status} /> },
  ],
  statusKaryawan: [
    { key: "code", header: "Code", render: (item) => item.code },
    { key: "namaStatus", header: "Nama Status", render: (item) => item.namaStatus },
    { key: "keterangan", header: "Keterangan", render: (item) => item.keterangan || "-" },
    { key: "status", header: "Status", render: (item) => <StatusBadge status={item.status} /> },
  ],
};
