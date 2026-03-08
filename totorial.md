# Tutorial Install, Menjalankan, dan Deploy Codex BIS di Windows Server

Dokumen ini menjelaskan cara:

1. install dependency aplikasi
2. menjalankan aplikasi di lokal
3. build untuk produksi
4. deploy aplikasi ke server berbasis Windows

Tutorial ini disusun berdasarkan struktur project saat ini:

- `backend/` = Express + TypeScript + Prisma + PostgreSQL
- `frontend/` = React + Vite + TypeScript

## Daftar Isi

- [Ringkasan Arsitektur](#ringkasan-arsitektur)
- [Prasyarat](#prasyarat)
- [Install dan Jalankan di Lokal](#install-dan-jalankan-di-lokal)
- [Build Produksi](#build-produksi)
- [Deploy ke Windows Server](#deploy-ke-windows-server)
- [Konfigurasi Reverse Proxy dan Domain](#konfigurasi-reverse-proxy-dan-domain)
- [Menjalankan sebagai Service di Windows](#menjalankan-sebagai-service-di-windows)
- [Update Aplikasi di Server](#update-aplikasi-di-server)
- [Troubleshooting](#troubleshooting)

## Ringkasan Arsitektur

Aplikasi ini terdiri dari 2 bagian:

- `backend` berjalan sebagai REST API, default di port `5000`
- `frontend` dibuild menjadi file static dan bisa disajikan lewat web server, default saat development di port `3000`

Alur akses:

```text
Browser
-> Frontend React
-> Request ke Backend API /api/*
-> Backend Express
-> PostgreSQL
```

Backend juga melayani file upload melalui path:

```text
/uploads
```

## Prasyarat

Sebelum mulai, siapkan:

- Windows 10/11 atau Windows Server
- Node.js 20 atau lebih baru
- npm
- PostgreSQL
- Git

Untuk deployment Windows Server, disarankan juga:

- IIS untuk serve frontend static dan reverse proxy
- PM2 atau NSSM untuk menjaga backend tetap hidup

## Install dan Jalankan di Lokal

## 1. Clone repository

```powershell
git clone <repository-url>
cd codex-bis
```

## 2. Setup backend

Masuk ke folder backend:

```powershell
cd backend
```

Install dependency:

```powershell
npm install
```

Buat file `.env` di folder `backend/`.

Contoh isi minimal:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/codex-bis"
JWT_SECRET="ganti-dengan-secret-yang-kuat"
JWT_EXPIRES_IN="7d"
PORT="5000"
UPLOAD_DIR="./uploads"
NODE_ENV="development"
```

Generate Prisma client:

```powershell
npm run db:generate
```

Jalankan migration:

```powershell
npm run db:migrate
```

Jika butuh seed data:

```powershell
npm run db:seed
```

Jalankan backend:

```powershell
npm run dev
```

Jika berhasil, backend akan aktif di:

```text
http://localhost:5000
```

## 3. Setup frontend

Buka terminal baru, lalu masuk ke folder frontend:

```powershell
cd frontend
```

Install dependency:

```powershell
npm install
```

Buat file `.env` di folder `frontend/`.

Contoh isi:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Jalankan frontend:

```powershell
npm run dev
```

Frontend akan aktif di:

```text
http://localhost:3000
```

## 4. Login dan uji aplikasi

Urutan yang benar:

1. pastikan PostgreSQL aktif
2. jalankan backend
3. jalankan frontend
4. buka `http://localhost:3000`
5. login dengan user yang tersedia di database

## Build Produksi

## Build backend

```powershell
cd backend
npm install
npm run build
```

Hasil build backend akan masuk ke:

```text
backend/dist/
```

Untuk menjalankan hasil build:

```powershell
npm start
```

## Build frontend

```powershell
cd frontend
npm install
npm run build
```

Hasil build frontend akan masuk ke:

```text
frontend/dist/
```

Catatan:

- `vite preview` hanya cocok untuk pengecekan hasil build, bukan untuk produksi
- untuk produksi, frontend sebaiknya diserve oleh IIS atau web server static lain

## Deploy ke Windows Server

Bagian ini memakai pendekatan yang paling praktis untuk Windows:

- backend dijalankan sebagai proses Node.js produksi
- frontend dibuild jadi static files
- IIS dipakai untuk serve frontend
- IIS atau ARR dipakai untuk proxy request API ke backend

## 1. Siapkan struktur folder di server

Contoh struktur:

```text
C:\apps\codex-bis\
├── backend\
├── frontend\
└── logs\
```

Salin project ke server:

```powershell
git clone <repository-url> C:\apps\codex-bis
```

Atau copy manual source code ke folder tersebut.

## 2. Install software di server

Install:

- Node.js LTS
- PostgreSQL
- Git
- IIS

Jika ingin backend hidup otomatis setelah reboot, install salah satu:

- PM2
- NSSM

Jika memakai PM2:

```powershell
npm install -g pm2
```

## 3. Setup database produksi

Buat database PostgreSQL baru, misalnya:

```text
codex_bis_prod
```

Contoh `DATABASE_URL`:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/codex_bis_prod"
```

Lalu jalankan migration dari folder backend:

```powershell
cd C:\apps\codex-bis\backend
npm install
npm run db:generate
npm run db:migrate
```

Jika ingin mengisi data awal:

```powershell
npm run db:seed
```

## 4. Konfigurasi backend produksi

Buat file `.env` di:

```text
C:\apps\codex-bis\backend\.env
```

Contoh isi:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/codex_bis_prod"
JWT_SECRET="isi-dengan-secret-production-yang-kuat"
JWT_EXPIRES_IN="7d"
PORT="5000"
UPLOAD_DIR="./uploads"
NODE_ENV="production"
```

Lalu build backend:

```powershell
cd C:\apps\codex-bis\backend
npm install
npm run build
```

Jalankan backend secara manual untuk test awal:

```powershell
npm start
```

Test akses:

```text
http://localhost:5000/api/auth/me
```

Catatan penting:

Di kode saat ini, CORS backend masih hardcoded ke:

```text
http://localhost:3000
```

File terkait:

```text
backend/src/app.ts
```

Sebelum production, Anda perlu menyesuaikan origin frontend production, misalnya:

```ts
origin: ["http://localhost:3000", "https://hr.perusahaananda.com"]
```

Lalu build ulang backend:

```powershell
cd C:\apps\codex-bis\backend
npm run build
```

## 5. Konfigurasi frontend produksi

Buat file `.env` di:

```text
C:\apps\codex-bis\frontend\.env
```

Contoh jika domain frontend dan backend berada dalam 1 host:

```env
VITE_API_BASE_URL=https://hr.perusahaananda.com/api
```

Atau jika backend dipisah:

```env
VITE_API_BASE_URL=https://api.perusahaananda.com/api
```

Lalu build frontend:

```powershell
cd C:\apps\codex-bis\frontend
npm install
npm run build
```

Hasil akhir ada di:

```text
C:\apps\codex-bis\frontend\dist
```

## Konfigurasi Reverse Proxy dan Domain

## Opsi yang direkomendasikan di Windows Server

Gunakan:

- IIS untuk serve `frontend/dist`
- backend tetap berjalan di `http://localhost:5000`
- request `/api` dan `/uploads` diproxy ke backend

## Contoh skema final

```text
https://hr.perusahaananda.com        -> frontend static
https://hr.perusahaananda.com/api    -> proxy ke http://localhost:5000/api
https://hr.perusahaananda.com/uploads -> proxy ke http://localhost:5000/uploads
```

## Langkah umum di IIS

1. install IIS
2. install URL Rewrite
3. install Application Request Routing (ARR)
4. buat website baru yang menunjuk ke:

```text
C:\apps\codex-bis\frontend\dist
```

5. tambahkan rewrite rule:

- `/api/*` ke `http://localhost:5000/api/*`
- `/uploads/*` ke `http://localhost:5000/uploads/*`
- semua route frontend selain file static diarahkan ke `index.html`

## Rewrite logic yang dibutuhkan

Frontend React memakai client-side routing, jadi route seperti:

```text
/hr/karyawan
/hr/karyawan/tambah
/hr/master-data/divisi
```

harus diarahkan ke `index.html`, bukan dianggap file fisik.

Secara konsep, rule IIS perlu:

1. jika request cocok file/folder fisik, serve langsung
2. jika request diawali `/api`, proxy ke backend
3. jika request diawali `/uploads`, proxy ke backend
4. sisanya rewrite ke `index.html`

## Menjalankan sebagai Service di Windows

## Opsi A: PM2

PM2 paling cepat untuk dipasang dan mudah direstart.

Masuk ke backend:

```powershell
cd C:\apps\codex-bis\backend
```

Jalankan:

```powershell
pm2 start dist/server.js --name codex-bis-backend
pm2 save
```

Cek status:

```powershell
pm2 list
```

Lihat log:

```powershell
pm2 logs codex-bis-backend
```

Restart:

```powershell
pm2 restart codex-bis-backend
```

Stop:

```powershell
pm2 stop codex-bis-backend
```

## Opsi B: NSSM

Jika ingin backend menjadi Windows Service native, gunakan NSSM.

Langkah umum:

1. install NSSM
2. buka Command Prompt as Administrator
3. daftarkan service:

```powershell
nssm install CodexBISBackend
```

Isi parameter:

- Application path:

```text
C:\Program Files\nodejs\node.exe
```

- Startup directory:

```text
C:\apps\codex-bis\backend
```

- Arguments:

```text
dist\server.js
```

Sebelum itu backend harus sudah dibuild:

```powershell
cd C:\apps\codex-bis\backend
npm run build
```

Setelah service dibuat:

```powershell
nssm start CodexBISBackend
```

## Update Aplikasi di Server

Jika ada update code:

## Backend

```powershell
cd C:\apps\codex-bis\backend
git pull
npm install
npm run build
npm run db:generate
npm run db:migrate
pm2 restart codex-bis-backend
```

Jika memakai NSSM:

```powershell
net stop CodexBISBackend
cd C:\apps\codex-bis\backend
git pull
npm install
npm run build
npm run db:generate
npm run db:migrate
net start CodexBISBackend
```

## Frontend

```powershell
cd C:\apps\codex-bis\frontend
git pull
npm install
npm run build
```

Setelah build frontend selesai, pastikan IIS menunjuk ke folder:

```text
C:\apps\codex-bis\frontend\dist
```

Jika website IIS sudah langsung membaca folder itu, biasanya tidak perlu langkah tambahan selain recycle app pool atau refresh cache.

## Troubleshooting

## 1. Backend tidak bisa start

Periksa:

```powershell
cd C:\apps\codex-bis\backend
npm start
```

Jika gagal, cek:

- file `.env`
- `DATABASE_URL`
- apakah migration sudah dijalankan
- apakah port `5000` sudah dipakai aplikasi lain

## 2. Frontend blank page setelah deploy

Periksa:

- `frontend/.env` memakai URL API production yang benar
- frontend sudah dibuild ulang setelah perubahan `.env`
- IIS rewrite ke `index.html` sudah benar

## 3. Login gagal karena CORS

Kemungkinan besar origin frontend production belum diizinkan backend.

Periksa file:

```text
backend/src/app.ts
```

Lalu sesuaikan CORS, kemudian:

```powershell
cd C:\apps\codex-bis\backend
npm run build
pm2 restart codex-bis-backend
```

## 4. Upload foto atau QR code tidak muncul

Periksa:

- folder `backend/uploads` ada
- route `/uploads` ikut diproxy oleh IIS
- permission folder upload tidak diblokir

## 5. Import Excel gagal

Periksa:

- file benar-benar `.xlsx`
- ukuran file tidak melebihi limit
- template yang dipakai adalah:

```text
backend/uploads/template-import.xlsx
```

## Checklist Singkat Deploy Windows

1. install Node.js, PostgreSQL, Git, IIS
2. clone repo ke server
3. setup `.env` backend
4. setup `.env` frontend
5. jalankan `npm install` backend dan frontend
6. jalankan `npm run db:generate`
7. jalankan `npm run db:migrate`
8. build backend dan frontend
9. jalankan backend dengan PM2 atau NSSM
10. configure IIS untuk:
   - serve `frontend/dist`
   - proxy `/api`
   - proxy `/uploads`
   - rewrite route React ke `index.html`
11. sesuaikan CORS backend untuk domain production

## File Penting yang Perlu Anda Ketahui

- `backend/.env`
- `frontend/.env`
- `backend/src/app.ts`
- `backend/src/server.ts`
- `backend/prisma/schema.prisma`
- `backend/uploads/`
- `frontend/dist/`

Jika Anda mau, langkah berikutnya saya bisa buatkan juga:

- versi `web.config` IIS yang siap pakai untuk frontend + proxy `/api` dan `/uploads`
- file checklist deploy yang lebih singkat untuk operator server
- SOP backup dan restore PostgreSQL untuk aplikasi ini
