# Analisa Template Excel BMI-kosong.xlsx

## 1. Deskripsi Umum

File **BMI-kosong.xlsx** memiliki 4 sheet:

| No | Nama Sheet | Deskripsi |
|----|-----------|-----------|
| 1 | `Masterdata` | Sheet utama data karyawan (148 kolom, 231 baris) |
| 2 | `header excel` | Daftar header kolom (147 item) |
| 3 | `header excel vs master data` | Mapping header Excel ↔ field master data (10 item) |
| 4 | `header excel vs profil karyawan` | Mapping header Excel ↔ field profil karyawan (147 item) |

---

## 2. Analisa Sheet "header excel vs master data"

Mapping antara kolom Excel dan field Master Data (`02_modul_hr_v2.md` section **1. Master Data**):

### 2.1 Mapping yang Sudah Benar ✅

| Header Excel | Field Master Data | Master Data Referensi |
|---|---|---|
| PANGKAT KATEGORI | nama kategori pangkat | ✅ Kategori Pangkat |
| GOLONGAN | nama golongan | ✅ Golongan |
| SUB GOLONGAN | nama sub golongan | ✅ Sub Golongan |
| JENIS HUBUNGAN KERJA | nama jenis hubungan kerja | ✅ Jenis Hubungan Kerja |
| TAG | nama tag | ✅ Tag |
| LOKASI KERJA | nama lokasi kerja | ✅ Lokasi Kerja |
| DIVISI | nama divisi | ✅ Divisi |
| DEPARTMENT | nama departmen | ✅ Department |
| POSISI JABATAN (MASTER) | nama posisi jabatan | ✅ Posisi Jabatan |

### 2.2 Masalah Ditemukan ⚠️

| No | Masalah | Detail |
|----|---------|--------|
| 1 | **Typo pada header Excel** | `STATUS KARYAWAB` seharusnya `STATUS KARYAWAN` |
| 2 | **Mapping sudah benar** | `STATUS KARYAWAB` → `nama status` merujuk ke Master Data **Status Karyawan** ✅ (tapi typo perlu diperbaiki) |

### 2.3 Kesimpulan Sheet Master Data

- **9 dari 10 mapping** sudah sesuai dengan struktur Master Data di `02_modul_hr_v2.md`
- **1 typo** ditemukan: `STATUS KARYAWAB` → harus `STATUS KARYAWAN`

---

## 3. Analisa Sheet "header excel vs profil karyawan"

Mapping antara kolom Excel dan field Profil Karyawan (`02_modul_hr_v2.md` section **Profil Karyawan**).

### 3.1 Mapping yang Sudah Benar ✅

| No | Header Excel | Field Profil | Bagian/Group |
|----|---|---|---|
| 1 | NOMIR INDUK KARYAWAN | nomor_induk_karyawan | Head |
| 2 | NAMA LENGKAP | nama_lengkap | Head |
| 3 | POSISI JABATAN | posisi_jabatan | Head |
| 4 | LOKASI COSTING | costing | Informasi HR > Costing |
| 5 | ACTUAL | actual | Informasi HR > Costing |
| 6 | ASSIGN | assign | Informasi HR > Costing |
| 7 | PANGKAT KATEGORI | kategori_pangkat | Informasi HR > Pangkat dan Golongan |
| 8 | GOLONGAN | golongan_pangkat | Informasi HR > Pangkat dan Golongan |
| 9 | SUB GOLONGAN | sub_golongan_pangkat | Informasi HR > Pangkat dan Golongan |
| 10 | TEMPAT LAHIR | tempat_lahir | Personal Information > Biodata |
| 11 | TANGGAL LAHIR | tanggal_lahir | Personal Information > Biodata |
| 12 | TANGGAL JOIN GROUP | tanggal_masuk_group | Informasi HR > Kontrak |
| 13 | TANGGAL MASUK | tanggal_masuk | Informasi HR > Kontrak |
| 14 | JENIS HUBUNGAN KERJA | jenis_hubungan_kerja | Informasi HR > Kontrak |
| 15 | TANGGAL AWAL KONTRAK | tanggal_kontrak | Informasi HR > Kontrak |
| 16 | TANGGAL AKHIR KONTRAK | tanggal_akhir_kontrak | Informasi HR > Kontrak |
| 17 | TANGGAL TETAP | tanggal_permanent | Informasi HR > Kontrak |
| 18 | TANGGAL KELUAR | tanggal_berhenti | Informasi HR > Kontrak |
| 19 | JENIS KELAMIN | jenis_kelamin | Personal Information > Biodata |
| 20 | AGAMA | agama | Personal Information > Identifikasi |
| 21 | ALAMAT DOMISILI | alamat_domisili | Personal Information > Alamat Domisili |
| 22 | KOTA DOMISILI | kota_domisili | Personal Information > Alamat Domisili |
| 23 | PROPINSI DOMISILI | provinsi_domisili | Personal Information > Alamat Domisili |
| 24 | NOMOR TELEPON RUMAH 1 | nomor_telepon_rumah_1 | Personal Information > Informasi Kontak |
| 25 | NOMOR TELEPON RUMAJ 2 | nomor_telepon_rumah_2 | Personal Information > Informasi Kontak |
| 26 | NOMOR HP 1 | nomor_handphone | Head / Personal Information > Informasi Kontak |
| 27 | NOMOR JP 2 | nomor_handphone_2 | Personal Information > Informasi Kontak |
| 28 | GOLOGAN DARAH | golongan_darah | Personal Information > Identifikasi |
| 29 | NOMOR KTP | nomor_ktp | Personal Information > Identifikasi |
| 30 | ALAMAT KTP | alamat_ktp | Personal Information > Alamat KTP |
| 31 | NOMOR NPWP | nomor_npwp | Personal Information > Identifikasi |
| 32 | NOMOR BPJS-TK | nomor_bpjs | Personal Information > Identifikasi |
| 33 | NOMOR DANA PENSIUN | no_dana_pensiun | Informasi HR > Pangkat dan Golongan |
| 34 | NOMOR REKENING | nomor_rekening | Personal Information > Rekening Bank |
| 35 | NAMA PEMILIK REKENING | nama_pemegang_rekening | Personal Information > Rekening Bank |
| 36 | STATUS PERKAWINAN (PAJAK) | status_pajak | Personal Information > Identifikasi |
| 37 | JUMLAH ANAK | jumlah_anak | Personal Information > Status Pernikahan dan Anak |
| 38 | PENDIDIKAN TERAKHIR | tingkat_pendidikan | Informasi HR > Education |
| 39 | JURUSAN PENDIDIKAN | bidang_studi | Informasi HR > Education |
| 40 | NAMA SEKOLAH | nama_sekolah | Informasi HR > Education |
| 41 | KOTA SEKOLAH | kota_sekolah | Informasi HR > Education |
| 42 | STATUS PENDIDIKAN | status_kelulusan | Informasi HR > Education |
| 43 | KETERANGAN PENDIDIKAN | keterangan (Group: Education) | Informasi HR > Education |
| 44 | STATUS PERNIKAHAN | status_pernikahan | Personal Information > Status Pernikahan dan Anak |
| 45 | TANGGAL MENIKAH | tanggal_menikah | Personal Information > Status Pernikahan dan Anak |
| 46 | TANGGAL CERAI | tanggal_cerai | Personal Information > Status Pernikahan dan Anak |
| 47 | TANGGAL WAFAT PASANGAN | tanggal_wafat_pasangan | Personal Information > Status Pernikahan dan Anak |
| 48 | NAMA PASANGAN NIKAH | nama_pasangan* | Personal Information > Status Pernikahan dan Anak |
| 49 | TANGGAL LAHIR PASANGAN | tanggal_lahir_pasangan | Informasi Keluarga > Pasangan dan Anak |
| 50 | PENDIDIKAN TERAKHIR PASANGAN | pendidikan_terakhir_pasangan | Informasi Keluarga > Pasangan dan Anak |
| 51 | PEKERJAAN PASANGAN | pekerjaan_pasangan | Personal Information > Status Pernikahan dan Anak |
| 52 | KETERANGAN PASANGAN | keterangan_pasangan | Informasi Keluarga > Pasangan dan Anak |
| 53 | NAMA ANAK 1 | nama_anak_1 | Informasi Keluarga > Identitas Anak |
| 54 | JENIS KELAMIN ANAK 1 | jenis_kelamin_anak_1 | Informasi Keluarga > Identitas Anak |
| 55 | TANGGAL LAHIR ANAK 1 | tanggal_lahir_anak_1 | Informasi Keluarga > Identitas Anak |
| 56 | KETERANGAN ANAK 1 | keterangan_anak_1 | Informasi Keluarga > Identitas Anak |
| 57 | NAMA SAUDARA KANDUNG 1 | nama_saudara_kandung_1 | Informasi Keluarga > Identitas Saudara Kandung |
| 58 | JENIS KELELAMIN SAUDARA KANDUNG 1 | jenis_kelamin_saudara_kandung_1 | Informasi Keluarga > Identitas Saudara Kandung |
| 59 | TANGGAL LAHUR SAUDARA KANDUNG 1 | tanggal_lahir_saudara_kandung_1 | Informasi Keluarga > Identitas Saudara Kandung |
| 60 | PENDIDIKAN TERAKHIR SAUDARA KANDUNG 1 | pendidikan_terakhir_saudara_kandung_1 | Informasi Keluarga > Identitas Saudara Kandung |
| 61 | PEKERJAAN SAUDARA KANDUNG 1 | pekerjaan_saudara_kandung_1 | Informasi Keluarga > Identitas Saudara Kandung |
| 62 | KETERANGAN SAUDARA KANDUNG 1 | keterangan_saudara_kandung_1 | Informasi Keluarga > Identitas Saudara Kandung |
| 63 | NAMA BANK | nama_bank | Personal Information > Rekening Bank |
| 64 | CABANG BANK | cabang_bank | Personal Information > Rekening Bank |
| 65 | NAMA BAPAK MERTUA | nama_ayah_mertua | Informasi Keluarga > Orang Tua Mertua |
| 66 | TANGGAL LAHUR BAPAK MERTUA | tanggal_lahir_ayah_mertua | Informasi Keluarga > Orang Tua Mertua |
| 67 | PENDIDKAN TERAKHIR BAPAK MERTUA | pendidikan_terakhir_ayah_mertua | Informasi Keluarga > Orang Tua Mertua |
| 68 | KETERANGAN BAPAK MERTUA | keterangan_ayah_mertua | Informasi Keluarga > Orang Tua Mertua |
| 69 | NAMA IBU MERTUA | nama_ibu_mertua | Informasi Keluarga > Orang Tua Mertua |
| 70 | TANGGAL LAHIR IBU MERTUA | tanggal_lahir_ibu_mertua | Informasi Keluarga > Orang Tua Mertua |
| 71 | PENDIDIKAN TERAKHIR IBU MERTUA | pendidikan_terakhir_ibu_mertua | Informasi Keluarga > Orang Tua Mertua |
| 72 | KETERANGAN IBU MERTUA | keterangan_ibu_mertua | Informasi Keluarga > Orang Tua Mertua |
| 73 | DEPARTMENT | department | Head / Informasi HR > Kepegawaian |
| 74 | DIVISI | divisi | Head / Informasi HR > Kepegawaian |
| 75 | NAMA KONTAK DARURAT 1 | nama_kontak_darurat_1 | Informasi HR > Kontak Darurat |
| 76 | HUNGAN KONTRAK DARURAT 1 | hubungan_kontak_darurat_1 | Informasi HR > Kontak Darurat |
| 77 | ALAMAT KONTAK DARURAT 1 | alamat_kontak_darurat_1 | Informasi HR > Kontak Darurat |
| 78 | NOMOR HP1 KONTAK DARURAT 1 | nomor_telepon_kontak_darurat_1 | Informasi HR > Kontak Darurat |
| 79 | UKURAN SEPATU | ukuran_sepatu_kerja | Informasi HR > Seragam dan Sepatu Kerja |
| 80 | UKURAN BAJU | ukuran_seragam_kerja | Informasi HR > Seragam dan Sepatu Kerja |
| 81 | LOKASI SEBELUMNYA | lokasi_sebelumnya | Informasi HR > Pergerakan Karyawan |
| 82 | TANGGAL MUTASI | tanggal_mutasi | Informasi HR > Pergerakan Karyawan |
| 83 | POINT OF ORIGINAL | point_of_original | Informasi HR > POO/POH |
| 84 | POINT OF HIRE | point_of_hire | Informasi HR > POO/POH |
| 85 | NOMOR KARTU KELUARGA | nomor_kartu_keluarga | Personal Information > Identifikasi |
| 86 | NOMOR NIK KK | no_nik_kk | Personal Information > Identifikasi |
| 87 | LOKASI KERJA | lokasi_kerja | Head |
| 88 | STATUS KARYAWAN | status_karyawan | Head |
| 89 | TAG | tag | Head |
| 90 | MANAGER | manager | Head |
| 91 | ATASAN LANGSUNG | atasan_langsung | Head |
| 92 | EMAIL PERUSAHAAN | email_perusahaan | Head |
| 93 | EMAIL PRIBADI | email_pribadi | Personal Information > Biodata |

### 3.2 Kolom Excel TANPA Mapping ke Profil Karyawan ❌

Kolom berikut ada di sheet `header excel vs profil karyawan` tetapi **tidak memiliki mapping** (kolom C kosong/None):

| No | Header Excel | Catatan |
|----|---|---|
| 38 | STATUS PAJAK | Duplikat dengan no.36 `STATUS PERKAWINAN (PAJAK)` yang sudah mapping ke `status_pajak` |
| 45 | KODE PENDIDIKAN | **Tidak ada** field ini di profil karyawan |
| 59–70 | NAMA/JENIS KELAMIN/TGL LAHIR/KETERANGAN ANAK 2, 3, 4 | Seharusnya di-mapping ke `nama_anak_2`, `jenis_kelamin_anak_2`, dst. (sesuai pola repeatable di profil karyawan) |
| 71–80 | DATA BAPAK/IBU KANDUNG | **Tidak ada** field orang tua kandung di profil karyawan (`02_modul_hr_v2.md`). Hanya ada orang tua **mertua**. |
| 87–104 | SAUDARA KANDUNG 2, 3 (duplikat), 4 | Seharusnya di-mapping ke `nama_saudara_kandung_2`, dst. (sesuai pola repeatable maks. 5 di profil karyawan) |
| 99–104 | SAUDARA KANDUNG 3 (DUPLIKAT) | **Duplikasi data** — saudara kandung 3 muncul 2x (No. 93-98 dan No. 99-104) |
| 111 | SIKLUS PEMBAYARAN | Seharusnya mapping ke `siklus_pembayaran_gaji` di Informasi HR > Costing |
| 117 | PEKERJAAN BAPAK MERTUA | **Tidak ada** field `pekerjaan_ayah_mertua` di profil karyawan |
| 122 | PEKERJAAN IBU MERTUA | **Tidak ada** field `pekerjaan_ibu_mertua` di profil karyawan |
| 124 | ORGANISSASI SUB DEPARTMENT | **Tidak ada** field ini di profil karyawan |
| 131 | NOMOR HP2 KONTAK DARURAT 1 | Di-mapping ke `nomor_telepon_kontak_darurat_2` — **inkonsisten**, field ini sebenarnya kontak darurat **2** bukan HP2 dari kontak darurat 1 |
| 136 | UNIT YANG DI BAWAH | **Tidak ada** field ini di profil karyawan |

### 3.3 Field Profil Karyawan yang TIDAK ADA di Template Excel ❌

Field berikut ada di `02_modul_hr_v2.md` tetapi **tidak ada** kolom di template Excel:

| No | Field Profil Karyawan | Bagian/Group |
|----|---|---|
| 1 | foto_karyawan | Head |
| 2 | kota_ktp | Personal Information > Alamat KTP |
| 3 | provinsi_ktp | Personal Information > Alamat KTP |
| 4 | anak_ke | Informasi Keluarga > Saudara Kandung |
| 5 | jumlah_saudara_kandung | Informasi Keluarga > Saudara Kandung |
| 6 | nama_saudara_kandung_5 (beserta detail) | Informasi Keluarga > Identitas Saudara Kandung |
| 7 | nama_kontak_darurat_2 | Informasi HR > Kontak Darurat |
| 8 | hubungan_kontak_darurat_2 | Informasi HR > Kontak Darurat |
| 9 | alamat_kontak_darurat_2 | Informasi HR > Kontak Darurat |
| 10 | tanggal_masuk (Kontrak) | Informasi HR > Kontrak |

> **Catatan:** `foto_karyawan` memang wajar tidak ada di template Excel karena berupa file gambar.

---

## 4. Analisa Typo pada Header Excel

Ditemukan beberapa **typo** pada header kolom di sheet `Masterdata` dan sheet mapping:

| No | Header Excel (Salah) | Seharusnya |
|----|---|---|
| 1 | `NOMIR INDUK KARYAWAN` | NOMOR INDUK KARYAWAN |
| 2 | `NOMOR TELEPON RUMAJ 2` | NOMOR TELEPON RUMAH 2 |
| 3 | `NOMOR JP 2` | NOMOR HP 2 |
| 4 | `GOLOGAN DARAH` | GOLONGAN DARAH |
| 5 | `JENIS KELELAMIN SAUDARA KANDUNG` (1-4) | JENIS KELAMIN SAUDARA KANDUNG |
| 6 | `TANGGAL LAHUR BAPAK KANDUNG` | TANGGAL LAHIR BAPAK KANDUNG |
| 7 | `TANGGAL LAHUR SAUDARA KANDUNG` (1-4) | TANGGAL LAHIR SAUDARA KANDUNG |
| 8 | `TANGGAL LAHUR BAPAK MERTUA` | TANGGAL LAHIR BAPAK MERTUA |
| 9 | `PENDIDKAN TERAKHIR BAPAK MERTUA` | PENDIDIKAN TERAKHIR BAPAK MERTUA |
| 10 | `ORGANISSASI SUB DEPARTMENT` | ORGANISASI SUB DEPARTMENT |
| 11 | `HUNGAN KONTRAK DARURAT 1` | HUBUNGAN KONTAK DARURAT 1 |
| 12 | `STATUS KARYAWAB` (sheet master data) | STATUS KARYAWAN |

---

## 5. Analisa Masalah Duplikasi

### 5.1 Saudara Kandung 3 Duplikat

No. 93–98 dan No. 99–104 keduanya berisi header **SAUDARA KANDUNG 3** yang identik. Salah satunya seharusnya menjadi **SAUDARA KANDUNG 4** (bukan 3).

Urutan yang benar seharusnya:
- No. 81–86: Saudara Kandung 1 ✅
- No. 87–92: Saudara Kandung 2 ✅
- No. 93–98: Saudara Kandung 3 ✅
- No. 99–104: Saudara Kandung **4** ❌ (tertulis 3)
- No. 105–110: Saudara Kandung **5** ❌ (tertulis 4)

> Catatan: Di profil karyawan, saudara kandung bisa sampai maks. 5, tetapi template Excel hanya menyediakan sampai 4 (ditambah duplikasi).

### 5.2 STATUS PAJAK Duplikat

- No. 36: `STATUS PERKAWINAN (PAJAK)` → mapping ke `status_pajak` ✅
- No. 38: `STATUS PAJAK` → **tidak ada mapping** (None)

Kedua kolom ini tampaknya merujuk ke hal yang serupa. Perlu klarifikasi apakah keduanya dibutuhkan atau salah satu bisa dihapus.

---

## 6. Inkonsistensi Mapping Kontak Darurat

Di profil karyawan terdapat **2 kontak darurat** (kontak_darurat_1 dan kontak_darurat_2), masing-masing memiliki 4 field:
- nama, nomor telepon, hubungan, alamat

Namun di template Excel:
- Hanya ada kolom untuk **kontak darurat 1** (nama, hubungan, alamat, nomor HP1)
- `NOMOR HP2 KONTAK DARURAT 1` di-mapping ke `nomor_telepon_kontak_darurat_2` — ini **salah secara semantik** karena field profil ini adalah nomor telepon **kontak darurat 2** (bukan HP kedua dari kontak darurat 1)
- **Tidak ada** kolom untuk nama, hubungan, dan alamat kontak darurat 2

---

## 7. Kolom Excel yang Tidak Ada di Profil Karyawan

Beberapa kolom Excel merujuk ke data yang **tidak didefinisikan** di `02_modul_hr_v2.md`:

| No | Kolom Excel | Catatan |
|----|---|---|
| 1 | KODE PENDIDIKAN | Tidak ada field ini di profil karyawan |
| 2 | DATA BAPAK KANDUNG (5 kolom) | Profil karyawan hanya memiliki data **mertua**, bukan orang tua kandung |
| 3 | DATA IBU KANDUNG (5 kolom) | Profil karyawan hanya memiliki data **mertua**, bukan orang tua kandung |
| 4 | ORGANISSASI SUB DEPARTMENT | Tidak ada field ini di profil karyawan |
| 5 | UNIT YANG DI BAWAH | Tidak ada field ini di profil karyawan |
| 6 | PEKERJAAN BAPAK MERTUA | Tidak ada field `pekerjaan_ayah_mertua` di profil karyawan |
| 7 | PEKERJAAN IBU MERTUA | Tidak ada field `pekerjaan_ibu_mertua` di profil karyawan |

---

## 8. Ringkasan Temuan

| Kategori | Jumlah | Severity |
|----------|--------|----------|
| Typo pada header Excel | 12 | 🟡 Medium |
| Kolom tanpa mapping ke profil karyawan | 12+ | 🔴 High |
| Field profil yang tidak ada di Excel | 10 | 🟡 Medium |
| Duplikasi kolom (saudara kandung 3) | 1 set (6 kolom) | 🔴 High |
| Inkonsistensi kontak darurat | 1 | 🟠 Medium-High |
| Kolom Excel tanpa field di profil karyawan | 7 | 🟡 Medium |
| Mapping SIKLUS PEMBAYARAN hilang | 1 | 🟡 Medium |

---

## 9. Rekomendasi Perbaikan

1. **Perbaiki semua typo** pada header Excel (12 typo teridentifikasi)
2. **Tambahkan mapping** untuk kolom anak 2, 3, 4 ke field profil karyawan yang sudah ada (repeatable)
3. **Perbaiki duplikasi** saudara kandung 3 → seharusnya saudara kandung 4, dan pertimbangkan menambah saudara kandung 5
4. **Tambahkan mapping** `SIKLUS PEMBAYARAN` → `siklus_pembayaran_gaji`
5. **Perbaiki mapping kontak darurat** — tentukan apakah `NOMOR HP2 KONTAK DARURAT 1` memang untuk kontak darurat 2, atau tambahkan kolom lengkap untuk kontak darurat 2
6. **Pertimbangkan** apakah perlu menambahkan field orang tua kandung di profil karyawan, atau menghapus kolom tersebut dari template
7. **Pertimbangkan** apakah perlu menambahkan field `pekerjaan_ayah_mertua` dan `pekerjaan_ibu_mertua` di profil karyawan
8. **Tambahkan kolom** untuk `kota_ktp`, `provinsi_ktp`, `anak_ke`, `jumlah_saudara_kandung` di template Excel jika data tersebut diperlukan saat import
9. **Klarifikasi** duplikasi `STATUS PERKAWINAN (PAJAK)` vs `STATUS PAJAK`
