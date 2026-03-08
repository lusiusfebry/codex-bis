import { Navigate, createBrowserRouter } from "react-router-dom";

import { AppLayout, AppLayoutNoSidebar } from "@/components/layout/AppLayout";
import KaryawanListPage from "@/modules/hr/karyawan/pages/KaryawanListPage";
import KaryawanProfilePage from "@/modules/hr/karyawan/pages/KaryawanProfilePage";
import DepartmentPage from "@/modules/hr/master-data/pages/DepartmentPage";
import DivisiPage from "@/modules/hr/master-data/pages/DivisiPage";
import GolonganPage from "@/modules/hr/master-data/pages/GolonganPage";
import JenisHubunganKerjaPage from "@/modules/hr/master-data/pages/JenisHubunganKerjaPage";
import KategoriPangkatPage from "@/modules/hr/master-data/pages/KategoriPangkatPage";
import LokasiKerjaPage from "@/modules/hr/master-data/pages/LokasiKerjaPage";
import MasterDataIndexPage from "@/modules/hr/master-data/pages/MasterDataIndexPage";
import PosisiJabatanPage from "@/modules/hr/master-data/pages/PosisiJabatanPage";
import StatusKaryawanPage from "@/modules/hr/master-data/pages/StatusKaryawanPage";
import SubGolonganPage from "@/modules/hr/master-data/pages/SubGolonganPage";
import TagPage from "@/modules/hr/master-data/pages/TagPage";
import LoginPage from "@/pages/LoginPage";
import WelcomePage from "@/pages/WelcomePage";
import { AuthGuard, GuestGuard } from "@/router/guards";

export const router = createBrowserRouter([
  {
    element: <GuestGuard />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
    ],
  },
  {
    element: <AuthGuard />,
    children: [
      {
        element: <AppLayoutNoSidebar />,
        children: [
          {
            path: "/",
            element: <WelcomePage />,
          },
        ],
      },
      {
        element: <AppLayout />,
        children: [
          {
            path: "/hr",
            element: <Navigate replace to="/hr/karyawan" />,
          },
          {
            path: "/hr/karyawan",
            element: <KaryawanListPage />,
          },
          {
            path: "/hr/karyawan/tambah",
            element: <KaryawanProfilePage />,
          },
          {
            path: "/hr/karyawan/:id",
            element: <KaryawanProfilePage />,
          },
          {
            path: "/hr/master-data",
            element: <MasterDataIndexPage />,
          },
          {
            path: "/hr/master-data/divisi",
            element: <DivisiPage />,
          },
          {
            path: "/hr/master-data/department",
            element: <DepartmentPage />,
          },
          {
            path: "/hr/master-data/posisi-jabatan",
            element: <PosisiJabatanPage />,
          },
          {
            path: "/hr/master-data/kategori-pangkat",
            element: <KategoriPangkatPage />,
          },
          {
            path: "/hr/master-data/golongan",
            element: <GolonganPage />,
          },
          {
            path: "/hr/master-data/sub-golongan",
            element: <SubGolonganPage />,
          },
          {
            path: "/hr/master-data/jenis-hubungan-kerja",
            element: <JenisHubunganKerjaPage />,
          },
          {
            path: "/hr/master-data/tag",
            element: <TagPage />,
          },
          {
            path: "/hr/master-data/lokasi-kerja",
            element: <LokasiKerjaPage />,
          },
          {
            path: "/hr/master-data/status-karyawan",
            element: <StatusKaryawanPage />,
          },
        ],
      },
    ],
  },
]);
