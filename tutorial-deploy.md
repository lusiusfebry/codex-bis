# Tutorial Deploy Codex BIS di Windows Server Menggunakan Nginx

Dokumen ini menjelaskan cara deploy aplikasi **Codex BIS** ke server berbasis Windows dengan arsitektur:

- **Backend**: Node.js + Express + Prisma + PostgreSQL
- **Frontend**: React + Vite, dibuild menjadi file static
- **Reverse Proxy / Static Server**: **Nginx for Windows**

Dokumen ini juga mencakup:

- credential login awal aplikasi
- konfigurasi environment
- build dan publish backend/frontend
- menjalankan backend sebagai service
- konfigurasi Nginx untuk frontend, API, dan file upload

## Daftar Isi

- [Ringkasan Arsitektur](#ringkasan-arsitektur)
- [Prasyarat](#prasyarat)
- [Credential Login Aplikasi](#credential-login-aplikasi)
- [Struktur Folder Server](#struktur-folder-server)
- [Step 1: Install Software di Windows Server](#step-1-install-software-di-windows-server)
- [Step 2: Copy Source Code ke Server](#step-2-copy-source-code-ke-server)
- [Step 3: Setup Database PostgreSQL](#step-3-setup-database-postgresql)
- [Step 4: Konfigurasi Backend Produksi](#step-4-konfigurasi-backend-produksi)
- [Step 5: Konfigurasi Frontend Produksi](#step-5-konfigurasi-frontend-produksi)
- [Step 6: Menjalankan Backend Sebagai Service](#step-6-menjalankan-backend-sebagai-service)
- [Step 7: Install dan Konfigurasi Nginx di Windows](#step-7-install-dan-konfigurasi-nginx-di-windows)
- [Step 8: Menjalankan Nginx](#step-8-menjalankan-nginx)
- [Step 9: Verifikasi Deploy](#step-9-verifikasi-deploy)
- [Step 10: Update Aplikasi di Server](#step-10-update-aplikasi-di-server)
- [Troubleshooting](#troubleshooting)

## Ringkasan Arsitektur

Target akhir deployment:

```text
https://hr.domain-anda.com           -> frontend static dari frontend/dist
https://hr.domain-anda.com/api       -> proxy ke backend Node.js
https://hr.domain-anda.com/uploads   -> proxy ke backend Node.js
```

Struktur alurnya:

```text
Browser
-> Nginx Windows
   -> serve frontend/dist
   -> proxy /api ke backend:5000
   -> proxy /uploads ke backend:5000
-> Backend Express
-> PostgreSQL
```

## Prasyarat

Pastikan server Windows Anda sudah menyiapkan:

- Windows Server 2019/2022 atau Windows 10/11
- hak akses Administrator
- Node.js 20+
- npm
- Git
- PostgreSQL
- Nginx for Windows

Disarankan juga:

- PM2 atau NSSM untuk menjalankan backend sebagai service
- domain/subdomain yang sudah diarahkan ke IP server

## Credential Login Aplikasi

Jika Anda menjalankan seed database bawaan project dengan:

```powershell
cd backend
npm run db:seed
```

maka user login default aplikasi adalah:

```text
NIK      : 01-00001
Password : Admin@123
Role     : admin
Nama     : Administrator Sistem
```

Sumber data ini berasal dari:

```text
backend/prisma/seed.ts
```

Catatan penting:

- credential ini **hanya tersedia jika seed sudah dijalankan**
- setelah deploy berhasil, **sangat disarankan ganti password admin default**

## Struktur Folder Server

Contoh struktur yang direkomendasikan:

```text
C:\apps\codex-bis\
├── backend\
├── frontend\
├── nginx\
└── logs\
```

Contoh penempatan:

- source project: `C:\apps\codex-bis`
- backend final: `C:\apps\codex-bis\backend`
- hasil build frontend: `C:\apps\codex-bis\frontend\dist`
- nginx: `C:\apps\codex-bis\nginx`

## Step 1: Install Software di Windows Server

## 1. Install Node.js

Install Node.js versi LTS 20 atau lebih baru.

Verifikasi:

```powershell
node -v
npm -v
```

## 2. Install Git

Verifikasi:

```powershell
git --version
```

## 3. Install PostgreSQL

Setelah install, verifikasi:

```powershell
psql --version
```

## 4. Install PM2

PM2 dipakai untuk menjaga backend tetap hidup.

```powershell
npm install -g pm2
```

Verifikasi:

```powershell
pm2 -v
```

## 5. Download Nginx for Windows

Unduh Nginx Windows lalu extract ke:

```text
C:\apps\codex-bis\nginx
```

Contoh struktur:

```text
C:\apps\codex-bis\nginx\
├── conf\
├── html\
├── logs\
└── nginx.exe
```

## Step 2: Copy Source Code ke Server

Clone repository:

```powershell
git clone <repository-url> C:\apps\codex-bis
```

Atau copy project manual ke lokasi itu.

Setelah itu pastikan folder berikut ada:

```text
C:\apps\codex-bis\backend
C:\apps\codex-bis\frontend
```

## Step 3: Setup Database PostgreSQL

## 1. Buat database production

Contoh:

```sql
CREATE DATABASE codex_bis_prod;
```

## 2. Siapkan user database jika perlu

Contoh:

```sql
CREATE USER codexbis_user WITH PASSWORD 'PasswordKuatAnda';
GRANT ALL PRIVILEGES ON DATABASE codex_bis_prod TO codexbis_user;
```

## 3. Jalankan migration dan seed

Masuk ke backend:

```powershell
cd C:\apps\codex-bis\backend
npm install
```

Buat file `.env` lebih dulu, lalu jalankan:

```powershell
npm run db:generate
npm run db:migrate
npm run db:seed
```

## Step 4: Konfigurasi Backend Produksi

Buat file:

```text
C:\apps\codex-bis\backend\.env
```

Contoh isi:

```env
DATABASE_URL="postgresql://codexbis_user:PasswordKuatAnda@localhost:5432/codex_bis_prod"
JWT_SECRET="ganti-dengan-secret-yang-sangat-kuat"
JWT_EXPIRES_IN="7d"
PORT="5000"
UPLOAD_DIR="./uploads"
NODE_ENV="production"
```

## Penting: CORS backend

Saat ini backend masih hardcoded:

```ts
origin: "http://localhost:3000"
```

di file:

```text
backend/src/app.ts
```

Sebelum deploy ke domain production, ubah menjadi origin production Anda. Contoh:

```ts
origin: [
  "http://localhost:3000",
  "https://hr.domain-anda.com",
]
```

Atau lebih baik jadikan berbasis env.

Setelah ubah CORS, build backend:

```powershell
cd C:\apps\codex-bis\backend
npm run build
```

Test backend manual:

```powershell
npm start
```

Jika berhasil, backend aktif di:

```text
http://localhost:5000
```

## Folder upload

Pastikan folder upload ada:

```text
C:\apps\codex-bis\backend\uploads
```

Jika belum ada:

```powershell
New-Item -ItemType Directory -Force -Path C:\apps\codex-bis\backend\uploads
```

## Step 5: Konfigurasi Frontend Produksi

Buat file:

```text
C:\apps\codex-bis\frontend\.env
```

Contoh isi:

```env
VITE_API_BASE_URL=https://hr.domain-anda.com/api
```

Lalu build frontend:

```powershell
cd C:\apps\codex-bis\frontend
npm install
npm run build
```

Hasil build ada di:

```text
C:\apps\codex-bis\frontend\dist
```

## Step 6: Menjalankan Backend Sebagai Service

## Opsi yang direkomendasikan: PM2

Jalankan:

```powershell
cd C:\apps\codex-bis\backend
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

## Opsi alternatif: NSSM

Jika Anda ingin backend menjadi Windows Service native:

```powershell
nssm install CodexBISBackend
```

Isi:

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

## Step 7: Install dan Konfigurasi Nginx di Windows

## 1. Letakkan Nginx

Contoh:

```text
C:\apps\codex-bis\nginx
```

## 2. Backup file konfigurasi default

```powershell
Copy-Item C:\apps\codex-bis\nginx\conf\nginx.conf C:\apps\codex-bis\nginx\conf\nginx.conf.bak -Force
```

## 3. Ganti `nginx.conf`

Isi contoh berikut bisa dipakai sebagai baseline:

```nginx
worker_processes  1;

events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;

    sendfile        on;
    keepalive_timeout  65;

    server {
        listen       80;
        server_name  localhost hr.domain-anda.com;

        root   C:/apps/codex-bis/frontend/dist;
        index  index.html;

        client_max_body_size 20M;

        location /api/ {
            proxy_pass         http://127.0.0.1:5000/api/;
            proxy_http_version 1.1;
            proxy_set_header   Host $host;
            proxy_set_header   X-Real-IP $remote_addr;
            proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header   X-Forwarded-Proto $scheme;
        }

        location /uploads/ {
            proxy_pass         http://127.0.0.1:5000/uploads/;
            proxy_http_version 1.1;
            proxy_set_header   Host $host;
            proxy_set_header   X-Real-IP $remote_addr;
            proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header   X-Forwarded-Proto $scheme;
        }

        location / {
            try_files $uri $uri/ /index.html;
        }
    }
}
```

Simpan file itu di:

```text
C:\apps\codex-bis\nginx\conf\nginx.conf
```

## Penjelasan konfigurasi Nginx

- `root` menunjuk ke hasil build frontend
- `/api/` diproxy ke backend Express
- `/uploads/` diproxy ke backend supaya foto dan file upload bisa diakses
- `try_files` memastikan React Router tetap bekerja untuk route SPA

## Jika memakai HTTPS

Untuk production sesungguhnya, tambahkan SSL certificate di Nginx. Struktur dasarnya:

```nginx
listen 443 ssl;
ssl_certificate      C:/apps/codex-bis/nginx/ssl/fullchain.pem;
ssl_certificate_key  C:/apps/codex-bis/nginx/ssl/privkey.pem;
```

Jika Anda belum punya sertifikat, sementara bisa mulai dengan HTTP untuk testing internal.

## Step 8: Menjalankan Nginx

Masuk ke folder Nginx:

```powershell
cd C:\apps\codex-bis\nginx
```

Test konfigurasi:

```powershell
.\nginx.exe -t
```

Jika valid, jalankan:

```powershell
.\nginx.exe
```

Untuk reload konfigurasi:

```powershell
.\nginx.exe -s reload
```

Untuk stop:

```powershell
.\nginx.exe -s stop
```

Catatan:

- jika port 80 sudah dipakai service lain, Nginx tidak akan bisa start
- cek log di folder:

```text
C:\apps\codex-bis\nginx\logs
```

## Step 9: Verifikasi Deploy

## 1. Cek backend lokal

```powershell
curl http://127.0.0.1:5000/api/auth/me
```

Response tanpa token bisa `401`, itu normal. Yang penting endpoint hidup.

## 2. Cek frontend melalui Nginx

Buka:

```text
http://localhost
```

atau:

```text
http://hr.domain-anda.com
```

## 3. Login aplikasi

Jika seed sudah dijalankan, gunakan:

```text
NIK      : 01-00001
Password : Admin@123
```

## 4. Verifikasi fitur dasar

Setelah login, cek minimal:

- dashboard bisa dibuka
- master data bisa diakses
- list karyawan muncul
- upload foto berfungsi
- QR code bisa dimuat
- import Excel bisa membuka template

## Step 10: Update Aplikasi di Server

## Update backend

```powershell
cd C:\apps\codex-bis\backend
git pull
npm install
npm run build
npm run db:generate
npm run db:migrate
pm2 restart codex-bis-backend
```

## Update frontend

```powershell
cd C:\apps\codex-bis\frontend
git pull
npm install
npm run build
```

## Reload Nginx jika perlu

```powershell
cd C:\apps\codex-bis\nginx
.\nginx.exe -s reload
```

## Troubleshooting

## 1. Nginx jalan tapi frontend 404

Periksa:

- folder `frontend/dist` benar-benar ada
- `root` di `nginx.conf` mengarah ke folder yang benar
- path Windows di config Nginx memakai `/`, bukan `\`

## 2. Frontend tampil tapi API gagal

Periksa:

- backend aktif di port `5000`
- blok `location /api/` benar
- `VITE_API_BASE_URL` mengarah ke URL production yang benar
- backend CORS sudah mengizinkan origin Nginx production

## 3. Login gagal

Periksa:

- seed sudah dijalankan
- user default benar-benar ada
- endpoint login memakai field:

```json
{
  "nik": "01-00001",
  "password": "Admin@123"
}
```

- format NIK harus `99-99999`

## 4. Upload foto tidak muncul

Periksa:

- folder `backend/uploads` ada
- Nginx punya proxy `/uploads/`
- backend bisa membaca static `/uploads`

## 5. QR code atau template import gagal

Periksa:

- backend hidup
- route `/api/hr/karyawan/:id/qrcode` bisa diakses
- route `/api/hr/karyawan/template` bisa diakses
- file template ada di:

```text
C:\apps\codex-bis\backend\uploads\template-import.xlsx
```

## 6. Port bentrok

Periksa port berikut:

- `80` atau `443` untuk Nginx
- `5000` untuk backend
- `5432` untuk PostgreSQL

## Checklist Singkat Deploy

1. install Node.js, Git, PostgreSQL, PM2, dan Nginx
2. clone repo ke `C:\apps\codex-bis`
3. buat database production
4. buat `backend/.env`
5. buat `frontend/.env`
6. sesuaikan CORS di `backend/src/app.ts`
7. jalankan `npm install` backend dan frontend
8. jalankan `npm run db:generate`
9. jalankan `npm run db:migrate`
10. jalankan `npm run db:seed`
11. build backend dan frontend
12. jalankan backend dengan PM2
13. konfigurasi `nginx.conf`
14. start Nginx
15. login dengan user awal:

```text
01-00001 / Admin@123
```

## Catatan Keamanan

Sebelum aplikasi benar-benar dipakai user:

- ganti password admin default
- gunakan HTTPS
- pindahkan `JWT_SECRET` ke nilai yang kuat dan rahasia
- batasi akses database
- backup folder `backend/uploads`
- backup database PostgreSQL secara rutin

Jika Anda mau, langkah berikutnya yang paling berguna adalah saya buatkan juga:

- file `nginx.conf` yang siap pakai berdasarkan domain Anda
- file `ecosystem.config.js` untuk PM2
- SOP ganti password admin pertama setelah deploy
