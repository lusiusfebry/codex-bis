# Codex BIS

Sistem informasi internal untuk **Bebang Sistem Informasi (BSI)** milik **PT Prima Sarana Gemilang**, dengan fokus awal pada modul **Human Resources**. Repository ini berisi backend API berbasis Express + Prisma dan frontend web berbasis React + Vite.

Saat ini cakupan implementasi yang sudah ada meliputi:
- autentikasi pengguna berbasis JWT
- dashboard dan layout aplikasi frontend
- CRUD master data HR
- API karyawan, import Excel, upload foto, dan QR code karyawan

## Daftar Isi

- [Ringkasan](#ringkasan)
- [Tech Stack](#tech-stack)
- [Struktur Repository](#struktur-repository)
- [Fitur yang Tersedia](#fitur-yang-tersedia)
- [Prasyarat](#prasyarat)
- [Menjalankan Project Secara Lokal](#menjalankan-project-secara-lokal)
- [Konfigurasi Environment](#konfigurasi-environment)
- [Arsitektur](#arsitektur)
- [API yang Tersedia](#api-yang-tersedia)
- [Frontend Routes](#frontend-routes)
- [Database](#database)
- [Scripts](#scripts)
- [Workflow Pengembangan](#workflow-pengembangan)
- [Troubleshooting](#troubleshooting)
- [Panduan Update README](#panduan-update-readme)

## Ringkasan

Repository ini dipisahkan menjadi dua aplikasi:

- `backend/` untuk REST API, autentikasi, validasi, upload file, dan akses database PostgreSQL
- `frontend/` untuk aplikasi admin web internal yang mengonsumsi API backend

Backend berjalan default di `http://localhost:5000`, sedangkan frontend berjalan default di `http://localhost:3000`.

## Tech Stack

### Backend

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express 5
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Auth**: JSON Web Token
- **File Upload**: Multer
- **Excel Import**: `xlsx`
- **QR Code**: `qrcode`

### Frontend

- **Framework**: React 19
- **Build Tool**: Vite
- **Language**: TypeScript
- **Routing**: React Router v6
- **State Management**: Zustand
- **Form**: React Hook Form
- **HTTP Client**: Axios
- **UI**: Tailwind CSS + shadcn/ui + Radix UI
- **Toast**: Sonner

## Struktur Repository

```text
codex-bis/
├── backend/                  # Express API + Prisma + PostgreSQL
│   ├── prisma/               # schema, migration, seed
│   ├── src/
│   │   ├── config/           # koneksi database
│   │   ├── middleware/       # auth, upload, error handler
│   │   ├── modules/
│   │   │   ├── auth/         # login, me, logout
│   │   │   └── hr/
│   │   │       ├── master-data/
│   │   │       └── karyawan/
│   │   ├── app.ts            # registrasi middleware dan routes
│   │   └── server.ts         # bootstrap server
│   └── uploads/              # file upload lokal
├── frontend/                 # aplikasi React
│   ├── src/
│   │   ├── api/              # axios instance + API layer
│   │   ├── components/       # layout dan UI components
│   │   ├── hooks/            # hooks reusable
│   │   ├── modules/hr/       # modul master data HR
│   │   ├── pages/            # login, welcome, placeholder
│   │   ├── router/           # route definitions + guards
│   │   ├── stores/           # zustand auth store
│   │   └── types/            # typescript types
│   └── public/
├── planning/                 # catatan dan artefak planning internal
└── AGENTS.md                 # aturan operasional agent untuk repo ini
```

## Fitur yang Tersedia

### Backend

- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`
- CRUD master data HR:
  - `divisi`
  - `department`
  - `posisi-jabatan`
  - `kategori-pangkat`
  - `golongan`
  - `sub-golongan`
  - `jenis-hubungan-kerja`
  - `tag`
  - `lokasi-kerja`
  - `status-karyawan`
- CRUD karyawan
- import data karyawan via Excel
- upload foto karyawan
- generate QR code karyawan

### Frontend

- login page
- protected app layout
- welcome dashboard
- modul master data HR lengkap untuk 10 resource
- navigasi sidebar HR

### Catatan Status Implementasi

- UI untuk **Master Data HR** sudah tersedia.
- Route `/hr` saat ini diarahkan ke `/hr/master-data`.
- Menu **Karyawan** di sidebar masih menuju placeholder `/hr`, jadi modul UI karyawan belum tersedia penuh di frontend walaupun API backend-nya sudah ada.

## Prasyarat

Pastikan environment lokal memiliki:

- Node.js 20+ disarankan
- npm
- PostgreSQL

Opsional tapi sangat membantu:

- Prisma CLI via dependency lokal project
- alat database client seperti DBeaver, TablePlus, atau pgAdmin

## Menjalankan Project Secara Lokal

## 1. Clone Repository

```bash
git clone <repository-url>
cd codex-bis
```

## 2. Setup Backend

Masuk ke folder backend:

```bash
cd backend
```

Install dependency:

```bash
npm install
```

Buat file environment. Project saat ini memakai `.env` langsung di `backend/`.

Contoh minimum:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/codex-bis"
JWT_SECRET="ganti-dengan-secret-anda"
JWT_EXPIRES_IN="7d"
PORT="5000"
UPLOAD_DIR="./uploads"
NODE_ENV="development"
```

Generate Prisma client:

```bash
npm run db:generate
```

Jalankan migration:

```bash
npm run db:migrate
```

Jalankan seed data jika dibutuhkan:

```bash
npm run db:seed
```

Start backend development server:

```bash
npm run dev
```

Backend akan aktif di:

```text
http://localhost:5000
```

## 3. Setup Frontend

Buka terminal baru, lalu masuk ke folder frontend:

```bash
cd frontend
```

Install dependency:

```bash
npm install
```

Salin atau buat file `.env` berdasarkan `.env.example`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Jalankan frontend:

```bash
npm run dev
```

Frontend akan aktif di:

```text
http://localhost:3000
```

## 4. Build Produksi

### Backend

```bash
cd backend
npm run build
npm start
```

### Frontend

```bash
cd frontend
npm run build
npm run preview
```

## Konfigurasi Environment

### Backend

| Variable | Wajib | Deskripsi |
| --- | --- | --- |
| `DATABASE_URL` | Ya | Connection string PostgreSQL |
| `JWT_SECRET` | Ya | Secret untuk sign JWT |
| `JWT_EXPIRES_IN` | Ya | Masa berlaku token, mis. `7d` |
| `PORT` | Tidak | Port backend, default `5000` |
| `UPLOAD_DIR` | Tidak | Folder penyimpanan upload |
| `NODE_ENV` | Tidak | Mode environment |

### Frontend

| Variable | Wajib | Deskripsi |
| --- | --- | --- |
| `VITE_API_BASE_URL` | Ya | Base URL API backend |

## Arsitektur

## Backend

Request flow backend saat ini:

```text
HTTP Request
→ Express app (src/app.ts)
→ Middleware (CORS, JSON parser, auth, upload, validation)
→ Route module
→ Controller
→ Prisma client
→ PostgreSQL
→ JSON Response
```

Komponen penting:

- `src/app.ts`
  - setup CORS untuk `http://localhost:3000`
  - registrasi static file `/uploads`
  - mount route auth, master data, dan karyawan
- `src/server.ts`
  - load `.env`
  - koneksi database
  - start HTTP server
- `src/config/database.ts`
  - inisialisasi dan lifecycle Prisma
- `src/middleware/auth.ts`
  - validasi JWT untuk route terproteksi
- `src/middleware/upload.ts`
  - konfigurasi upload file
- `src/middleware/errorHandler.ts`
  - handler error global

## Frontend

Flow frontend saat ini:

```text
React Router
→ AuthGuard / GuestGuard
→ AppLayout
→ Page / Module
→ API layer (Axios)
→ Backend API
```

Komponen penting:

- `src/api/axiosInstance.ts`
  - inject token JWT dari storage
  - handle `401` secara kontekstual
- `src/stores/authStore.ts`
  - state auth dengan Zustand
- `src/router/index.tsx`
  - definisi route aplikasi
- `src/components/layout/*`
  - sidebar, header, notifikasi, breadcrumb
- `src/modules/hr/master-data/*`
  - modul master data HR berbasis halaman generik + form modal per resource

## API yang Tersedia

## Auth

| Method | Endpoint | Keterangan |
| --- | --- | --- |
| `POST` | `/api/auth/login` | Login user |
| `GET` | `/api/auth/me` | Ambil profil user terautentikasi |
| `POST` | `/api/auth/logout` | Logout user |

Response login saat ini mengembalikan:

```json
{
  "token": "jwt-token",
  "user": {
    "id": "uuid",
    "nik": "02-03827",
    "nama": "Nama User",
    "role": "admin",
    "fotoUrl": null
  }
}
```

## Master Data HR

Semua endpoint master data berada di bawah:

```text
/api/hr/master-data/{resource}
```

Pola endpoint:

| Method | Endpoint | Keterangan |
| --- | --- | --- |
| `GET` | `/{resource}` | List dengan pagination, search, status |
| `POST` | `/{resource}` | Buat data baru |
| `GET` | `/{resource}/:id` | Detail |
| `PUT` | `/{resource}/:id` | Update |
| `DELETE` | `/{resource}/:id` | Hapus |

Resource yang tersedia:

- `divisi`
- `department`
- `posisi-jabatan`
- `kategori-pangkat`
- `golongan`
- `sub-golongan`
- `jenis-hubungan-kerja`
- `tag`
- `lokasi-kerja`
- `status-karyawan`

Contoh query list:

```text
GET /api/hr/master-data/divisi?page=1&limit=10&search=operasional&status=Aktif
```

## Karyawan

| Method | Endpoint | Keterangan |
| --- | --- | --- |
| `POST` | `/api/hr/karyawan/import` | Import Excel |
| `GET` | `/api/hr/karyawan` | List karyawan |
| `POST` | `/api/hr/karyawan` | Buat karyawan |
| `GET` | `/api/hr/karyawan/:id` | Detail karyawan |
| `PUT` | `/api/hr/karyawan/:id` | Update karyawan |
| `DELETE` | `/api/hr/karyawan/:id` | Hapus karyawan |
| `POST` | `/api/hr/karyawan/:id/foto` | Upload foto |
| `GET` | `/api/hr/karyawan/:id/qrcode` | Generate QR code |

## Frontend Routes

| Route | Keterangan |
| --- | --- |
| `/login` | Halaman login |
| `/` | Welcome dashboard |
| `/hr` | Redirect ke `/hr/master-data` |
| `/hr/master-data` | Index master data |
| `/hr/master-data/divisi` | CRUD Divisi |
| `/hr/master-data/department` | CRUD Department |
| `/hr/master-data/posisi-jabatan` | CRUD Posisi Jabatan |
| `/hr/master-data/kategori-pangkat` | CRUD Kategori Pangkat |
| `/hr/master-data/golongan` | CRUD Golongan |
| `/hr/master-data/sub-golongan` | CRUD Sub Golongan |
| `/hr/master-data/jenis-hubungan-kerja` | CRUD Jenis Hubungan Kerja |
| `/hr/master-data/tag` | CRUD Tag |
| `/hr/master-data/lokasi-kerja` | CRUD Lokasi Kerja |
| `/hr/master-data/status-karyawan` | CRUD Status Karyawan |

## Database

Database menggunakan **PostgreSQL** dengan Prisma schema di:

```text
backend/prisma/schema.prisma
```

Entitas utama yang sudah ada:

- `User`
- `Divisi`
- `Department`
- `PosisiJabatan`
- `KategoriPangkat`
- `Golongan`
- `SubGolongan`
- `JenisHubunganKerja`
- `Tag`
- `LokasiKerja`
- `StatusKaryawan`
- `Karyawan`
- tabel relasi keluarga dan data turunan karyawan

Migration awal saat ini berada di:

```text
backend/prisma/migrations/20260307115755_init/
```

## Scripts

## Backend

| Command | Keterangan |
| --- | --- |
| `npm run dev` | Menjalankan backend dengan `ts-node-dev` |
| `npm run build` | Build TypeScript ke `dist/` |
| `npm start` | Menjalankan hasil build backend |
| `npm run db:migrate` | Menjalankan Prisma migration |
| `npm run db:seed` | Menjalankan seed database |
| `npm run db:generate` | Generate Prisma client |

## Frontend

| Command | Keterangan |
| --- | --- |
| `npm run dev` | Menjalankan Vite dev server |
| `npm run build` | Typecheck + build produksi |
| `npm run lint` | Menjalankan ESLint |
| `npm run preview` | Preview hasil build |

## Workflow Pengembangan

Urutan kerja yang direkomendasikan:

1. jalankan PostgreSQL
2. jalankan backend
3. jalankan frontend
4. akses `http://localhost:3000`
5. login menggunakan user yang tersedia di database hasil seed

Untuk perubahan schema database:

```bash
cd backend
npx prisma migrate dev --name nama_perubahan
npm run db:generate
```

Untuk validasi sebelum merge:

```bash
cd backend
npm run build

cd ../frontend
npm run lint
npx tsc --noemit
npm run build
```

## Troubleshooting

## Backend gagal konek database

Gejala umum:

- server gagal start
- Prisma melempar error koneksi

Periksa:

```bash
psql -h localhost -U postgres -d codex-bis
```

Lalu pastikan `DATABASE_URL` benar.

## Frontend tidak bisa akses API

Periksa:

- backend berjalan di `http://localhost:5000`
- `frontend/.env` berisi `VITE_API_BASE_URL=http://localhost:5000/api`
- CORS backend masih mengizinkan `http://localhost:3000`

## Token login tidak bekerja

Periksa:

- response login backend mengembalikan `token`
- browser menyimpan `bsi_token`
- request frontend mengirim header `Authorization: Bearer <token>`

## Build frontend warning chunk size

Saat ini build frontend dapat mengeluarkan warning ukuran bundle Vite. Ini belum memblokir build, tetapi bisa menjadi kandidat optimasi berikutnya bila modul bertambah besar.

## Panduan Update README

README ini sebaiknya diperbarui setiap ada perubahan berikut:

- penambahan module frontend atau backend baru
- perubahan endpoint API
- perubahan struktur database yang memengaruhi setup atau alur kerja
- perubahan environment variable
- perubahan port, auth flow, atau dependency utama

Checklist update README:

1. perbarui bagian **Fitur yang Tersedia**
2. perbarui **API yang Tersedia** jika route berubah
3. perbarui **Frontend Routes** jika halaman baru ditambahkan
4. perbarui **Konfigurasi Environment** jika ada env baru
5. perbarui **Scripts** jika command project berubah

Jika Anda mau dokumentasi ini dijaga rutin, pola paling praktis adalah:

- setiap selesai fitur besar, sekalian update `README.md`
- setiap perubahan API, cek bagian endpoint di README sebelum merge
- setiap perubahan setup lokal, cek bagian Getting Started dan Environment

## Catatan Internal

Repository ini juga memiliki `AGENTS.md` yang berisi aturan operasional agent untuk project ini. File itu bukan panduan end-user, tetapi penting bila repo dikerjakan bersama coding agent.
