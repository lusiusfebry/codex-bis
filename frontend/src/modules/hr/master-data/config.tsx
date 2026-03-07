import { Building2, BriefcaseBusiness, FolderKanban, GitBranch, Landmark, MapPin, ShieldCheck, Tags, Users, Waypoints } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { MasterDataEntityMap, MasterDataResourceKey } from "@/types/masterData";
import { MASTER_DATA_PATHS } from "@/api/masterData";

export type MasterDataColumn<T> = {
  key: string;
  header: string;
  className?: string;
  render: (item: T) => React.ReactNode;
};

export type MasterDataResourceConfig<K extends MasterDataResourceKey = MasterDataResourceKey> = {
  key: K;
  title: string;
  description: string;
  path: string;
  route: string;
  icon: LucideIcon;
  badgeLabel: string;
  formTitle: string;
};

export const masterDataResourceConfig: {
  [K in MasterDataResourceKey]: MasterDataResourceConfig<K>;
} = {
  divisi: {
    key: "divisi",
    title: "Divisi",
    description: "Kelola struktur divisi utama perusahaan.",
    path: MASTER_DATA_PATHS.divisi,
    route: "/hr/master-data/divisi",
    icon: Building2,
    badgeLabel: "Divisi",
    formTitle: "Divisi",
  },
  department: {
    key: "department",
    title: "Department",
    description: "Kelola department di bawah masing-masing divisi.",
    path: MASTER_DATA_PATHS.department,
    route: "/hr/master-data/department",
    icon: FolderKanban,
    badgeLabel: "Department",
    formTitle: "Department",
  },
  posisiJabatan: {
    key: "posisiJabatan",
    title: "Posisi Jabatan",
    description: "Kelola posisi jabatan berdasarkan department.",
    path: MASTER_DATA_PATHS.posisiJabatan,
    route: "/hr/master-data/posisi-jabatan",
    icon: BriefcaseBusiness,
    badgeLabel: "Posisi",
    formTitle: "Posisi Jabatan",
  },
  kategoriPangkat: {
    key: "kategoriPangkat",
    title: "Kategori Pangkat",
    description: "Kelola kategori pangkat karyawan.",
    path: MASTER_DATA_PATHS.kategoriPangkat,
    route: "/hr/master-data/kategori-pangkat",
    icon: Landmark,
    badgeLabel: "Kategori",
    formTitle: "Kategori Pangkat",
  },
  golongan: {
    key: "golongan",
    title: "Golongan",
    description: "Kelola golongan utama yang digunakan pada data karyawan.",
    path: MASTER_DATA_PATHS.golongan,
    route: "/hr/master-data/golongan",
    icon: GitBranch,
    badgeLabel: "Golongan",
    formTitle: "Golongan",
  },
  subGolongan: {
    key: "subGolongan",
    title: "Sub Golongan",
    description: "Kelola sub golongan turunan untuk struktur pangkat.",
    path: MASTER_DATA_PATHS.subGolongan,
    route: "/hr/master-data/sub-golongan",
    icon: Waypoints,
    badgeLabel: "Sub Golongan",
    formTitle: "Sub Golongan",
  },
  jenisHubunganKerja: {
    key: "jenisHubunganKerja",
    title: "Jenis Hubungan Kerja",
    description: "Kelola tipe hubungan kerja karyawan.",
    path: MASTER_DATA_PATHS.jenisHubunganKerja,
    route: "/hr/master-data/jenis-hubungan-kerja",
    icon: Users,
    badgeLabel: "Jenis HK",
    formTitle: "Jenis Hubungan Kerja",
  },
  tag: {
    key: "tag",
    title: "Tag",
    description: "Kelola penandaan visual untuk kebutuhan klasifikasi data.",
    path: MASTER_DATA_PATHS.tag,
    route: "/hr/master-data/tag",
    icon: Tags,
    badgeLabel: "Tag",
    formTitle: "Tag",
  },
  lokasiKerja: {
    key: "lokasiKerja",
    title: "Lokasi Kerja",
    description: "Kelola site, kantor, dan titik kerja operasional.",
    path: MASTER_DATA_PATHS.lokasiKerja,
    route: "/hr/master-data/lokasi-kerja",
    icon: MapPin,
    badgeLabel: "Lokasi",
    formTitle: "Lokasi Kerja",
  },
  statusKaryawan: {
    key: "statusKaryawan",
    title: "Status Karyawan",
    description: "Kelola status keaktifan dan status administratif karyawan.",
    path: MASTER_DATA_PATHS.statusKaryawan,
    route: "/hr/master-data/status-karyawan",
    icon: ShieldCheck,
    badgeLabel: "Status",
    formTitle: "Status Karyawan",
  },
};

export function getMasterDataConfig<K extends MasterDataResourceKey>(key: K): MasterDataResourceConfig<K> {
  return masterDataResourceConfig[key];
}

export type MasterDataColumnMap = {
  [K in MasterDataResourceKey]: MasterDataColumn<MasterDataEntityMap[K]>[];
};
