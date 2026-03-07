# Mapping Template Import Excel ↔ Profil Karyawan

> **Dokumen ini** menjelaskan mapping lengkap antara kolom pada file template `template-import-fix.xlsx` (sheet `Masterdata`) dengan field Profil Karyawan pada modul HR. Dokumen ini dirancang sebagai referensi universal yang dapat dipahami oleh semua AI assistant tools.

---

## Informasi Template

- **File**: `template-import-fix.xlsx`
- **Sheet data**: `Masterdata`
- **Total kolom**: 162 (termasuk kolom NO)
- **Referensi profil**: `02_modul_hr_v2.md` → Section `### Profil Karyawan`

---

## Aturan Umum

1. **Satu baris = satu karyawan**. Setiap baris pada sheet `Masterdata` merepresentasikan data satu karyawan.
2. **Kolom 1 (`NO`)** adalah nomor urut dan **tidak disimpan** ke profil karyawan.
3. **Kolom bertanda `[MASTER]`** nilainya harus sudah terdaftar di tabel Master Data yang berstatus Aktif. Validasi diperlukan saat import.
4. **Kolom bertanda `[REF_KARYAWAN]`** nilainya mereferensi ke data karyawan lain yang sudah ada dan berstatus aktif.
5. **Field referensi**: Satu kolom Excel dapat mengisi beberapa field profil karyawan secara bersamaan (misalnya kolom `NAMA LENGKAP` mengisi field `nama_lengkap` di bagian Head sekaligus di tab Personal Information → Biodata).
6. **Field repeatable**: Kolom data anak dan saudara kandung menggunakan pola berulang dengan sufiks angka (contoh: `nama_anak_1`, `nama_anak_2`, dst.).
7. **Kolom bertipe Tanggal** harus menggunakan format tanggal yang konsisten.
8. **Semua data** disimpan ke database.

---

## Mapping Lengkap per Kolom Excel

Tabel berikut mencantumkan **setiap kolom** pada sheet `Masterdata` beserta field profil karyawan tujuannya, posisi di profil (Tab → Group), tipe data, dan keterangan khusus.

### Kolom 1–10: Identitas Dasar & Kepangkatan

| Kolom | Header Excel | Field Profil | Tab → Group | Tipe | Ket |
|:---:|---|---|---|---|---|
| 1 | NO | — | — | — | Tidak disimpan |
| 2 | NOMIR INDUK KARYAWAN | `nomor_induk_karyawan` | Head | Teks | Wajib |
| 3 | NAMA LENGKAP | `nama_lengkap` | Head | Teks | Wajib |
| 4 | POSISI JABATAN | `posisi_jabatan` | Head | Pilihan | `[MASTER]` Posisi Jabatan |
| 5 | LOKASI COSTING | `costing` | Informasi HR → Costing | Teks | — |
| 6 | ACTUAL | `actual` | Informasi HR → Costing | Teks | — |
| 7 | ASSIGN | `assign` | Informasi HR → Costing | Teks | — |
| 8 | PANGKAT KATEGORI | `kategori_pangkat` | Informasi HR → Pangkat dan Golongan | Pilihan | `[MASTER]` Kategori Pangkat |
| 9 | GOLONGAN | `golongan_pangkat` | Informasi HR → Pangkat dan Golongan | Pilihan | `[MASTER]` Golongan |
| 10 | SUB GOLONGAN | `sub_golongan_pangkat` | Informasi HR → Pangkat dan Golongan | Pilihan | `[MASTER]` Sub Golongan |

### Kolom 11–19: Biodata & Kontrak

| Kolom | Header Excel | Field Profil | Tab → Group | Tipe | Ket |
|:---:|---|---|---|---|---|
| 11 | TEMPAT LAHIR | `tempat_lahir` | Personal Information → Biodata | Teks | — |
| 12 | TANGGAL LAHIR | `tanggal_lahir` | Personal Information → Biodata | Tanggal | — |
| 13 | TANGGAL JOIN GROUP | `tanggal_masuk_group` | Informasi HR → Kontrak | Tanggal | — |
| 14 | TANGGAL MASUK | `tanggal_masuk` | Informasi HR → Kontrak | Tanggal | — |
| 15 | JENIS HUBUNGAN KERJA | `jenis_hubungan_kerja` | Informasi HR → Kontrak | Pilihan | `[MASTER]` Jenis Hubungan Kerja |
| 16 | TANGGAL AWAL KONTRAK | `tanggal_kontrak` | Informasi HR → Kontrak | Tanggal | — |
| 17 | TANGGAL AKHIR KONTRAK | `tanggal_akhir_kontrak` | Informasi HR → Kontrak | Tanggal | — |
| 18 | TANGGAL TETAP | `tanggal_permanent` | Informasi HR → Kontrak | Tanggal | — |
| 19 | TANGGAL KELUAR | `tanggal_berhenti` | Informasi HR → Kontrak | Tanggal | — |

### Kolom 20–24: Data Pribadi & Alamat

| Kolom | Header Excel | Field Profil | Tab → Group | Tipe | Ket |
|:---:|---|---|---|---|---|
| 20 | JENIS KELAMIN | `jenis_kelamin` | Personal Information → Biodata | Pilihan | Laki-laki / Perempuan |
| 21 | AGAMA | `agama` | Personal Information → Identifikasi | Pilihan | — |
| 22 | ALAMAT DOMISILI | `alamat_domisili` | Personal Information → Alamat Domisili | Teks Area | — |
| 23 | KOTA DOMISILI | `kota_domisili` | Personal Information → Alamat Domisili | Teks | — |
| 24 | PROPINSI DOMISILI | `provinsi_domisili` | Personal Information → Alamat Domisili | Teks | — |

### Kolom 25–31: Kontak & Identifikasi

| Kolom | Header Excel | Field Profil | Tab → Group | Tipe | Ket |
|:---:|---|---|---|---|---|
| 25 | NOMOR TELEPON RUMAH 1 | `nomor_telepon_rumah_1` | Personal Information → Informasi Kontak | Teks | — |
| 26 | NOMOR TELEPON RUMAH 2 | `nomor_telepon_rumah_2` | Personal Information → Informasi Kontak | Teks | — |
| 27 | NOMOR HP 1 | `nomor_handphone` | Head / Personal Information → Informasi Kontak | Teks | Juga mengisi `nomor_handphone_1` |
| 28 | NOMOR HP 2 | `nomor_handphone_2` | Personal Information → Informasi Kontak | Teks | — |
| 29 | GOLONGAN DARAH | `golongan_darah` | Personal Information → Identifikasi | Pilihan | A / B / AB / O |
| 30 | NOMOR KTP | `nomor_ktp` | Personal Information → Identifikasi | Teks | — |
| 31 | ALAMAT KTP | `alamat_ktp` | Personal Information → Alamat KTP | Teks Area | — |

### Kolom 32–38: Dokumen & Keuangan

| Kolom | Header Excel | Field Profil | Tab → Group | Tipe | Ket |
|:---:|---|---|---|---|---|
| 32 | NOMOR NPWP | `nomor_npwp` | Personal Information → Identifikasi | Teks | — |
| 33 | NOMOR BPJS-TK | `nomor_bpjs` | Personal Information → Identifikasi | Teks | — |
| 34 | NOMOR DANA PENSIUN | `no_dana_pensiun` | Informasi HR → Pangkat dan Golongan | Teks | — |
| 35 | NOMOR REKENING | `nomor_rekening` | Personal Information → Rekening Bank | Teks | — |
| 36 | NAMA PEMILIK REKENING | `nama_pemegang_rekening` | Personal Information → Rekening Bank | Teks | — |
| 37 | STATUS PERKAWINAN (PAJAK) | `status_pajak` | Personal Information → Identifikasi | Teks | — |
| 38 | JUMLAH ANAK | `jumlah_anak` | Personal Information → Status Pernikahan dan Anak | Angka | — |

### Kolom 39: Tidak Disimpan

| Kolom | Header Excel | Field Profil | Ket |
|:---:|---|---|---|
| 39 | STATUS PAJAK | — | **Tidak disimpan.** Duplikat dengan kolom 37 |

### Kolom 40–46: Pendidikan

| Kolom | Header Excel | Field Profil | Tab → Group | Tipe | Ket |
|:---:|---|---|---|---|---|
| 40 | PENDIDIKAN TERAKHIR | `tingkat_pendidikan` | Informasi HR → Education | Teks | — |
| 41 | JURUSAN PENDIDIKAN | `bidang_studi` | Informasi HR → Education | Teks | — |
| 42 | NAMA SEKOLAH | `nama_sekolah` | Informasi HR → Education | Teks | — |
| 43 | KOTA SEKOLAH | `kota_sekolah` | Informasi HR → Education | Teks | — |
| 44 | STATUS PENDIDIKAN | `status_kelulusan` | Informasi HR → Education | Pilihan | — |
| 45 | KETERANGAN PENDIDIKAN | `keterangan` | Informasi HR → Education | Teks Area | Field `keterangan` pada group Education |
| 46 | KODE PENDIDIKAN | — | — | — | **Tidak disimpan** |

### Kolom 47–55: Pernikahan & Pasangan

| Kolom | Header Excel | Field Profil | Tab → Group | Tipe | Ket |
|:---:|---|---|---|---|---|
| 47 | STATUS PERNIKAHAN | `status_pernikahan` | Personal Information → Status Pernikahan dan Anak | Pilihan | — |
| 48 | TANGGAL MENIKAH | `tanggal_menikah` | Personal Information → Status Pernikahan dan Anak | Tanggal | — |
| 49 | TANGGAL CERAI | `tanggal_cerai` | Personal Information → Status Pernikahan dan Anak | Tanggal | — |
| 50 | TANGGAL WAFAT PASANGAN | `tanggal_wafat_pasangan` | Personal Information → Status Pernikahan dan Anak | Tanggal | — |
| 51 | NAMA PASANGAN NIKAH | `nama_pasangan` | Personal Information → Status Pernikahan dan Anak / Informasi Keluarga → Pasangan dan Anak | Teks | Mengisi 2 field (referensi) |
| 52 | TANGGAL LAHIR PASANGAN | `tanggal_lahir_pasangan` | Informasi Keluarga → Pasangan dan Anak | Tanggal | — |
| 53 | PENDIDIKAN TERAKHIR PASANGAN | `pendidikan_terakhir_pasangan` | Informasi Keluarga → Pasangan dan Anak | Teks | — |
| 54 | PEKERJAAN PASANGAN | `pekerjaan_pasangan` | Personal Information → Status Pernikahan dan Anak / Informasi Keluarga | Teks | Mengisi 2 field (referensi) |
| 55 | KETERANGAN PASANGAN | `keterangan_pasangan` | Informasi Keluarga → Pasangan dan Anak | Teks Area | — |

### Kolom 56–71: Data Anak 1–4 (Repeatable)

Pola: **4 kolom per anak** × 4 anak = 16 kolom.

| Kolom | Header Excel | Field Profil | Tipe |
|:---:|---|---|---|
| 56 | NAMA ANAK 1 | `nama_anak_1` | Teks |
| 57 | JENIS KELAMIN ANAK 1 | `jenis_kelamin_anak_1` | Pilihan |
| 58 | TANGGAL LAHIR ANAK 1 | `tanggal_lahir_anak_1` | Tanggal |
| 59 | KETERANGAN ANAK 1 | `keterangan_anak_1` | Teks Area |
| 60 | NAMA ANAK 2 | `nama_anak_2` | Teks |
| 61 | JENIS KELAMIN ANAK 2 | `jenis_kelamin_anak_2` | Pilihan |
| 62 | TANGGAL LAHIR ANAK 2 | `tanggal_lahir_anak_2` | Tanggal |
| 63 | KETERANGAN ANAK 2 | `keterangan_anak_2` | Teks Area |
| 64 | NAMA ANAK 3 | `nama_anak_3` | Teks |
| 65 | JENIS KELAMIN ANAK 3 | `jenis_kelamin_anak_3` | Pilihan |
| 66 | TANGGAL LAHIR ANAK 3 | `tanggal_lahir_anak_3` | Tanggal |
| 67 | KETERANGAN ANAK 3 | `keterangan_anak_3` | Teks Area |
| 68 | NAMA ANAK 4 | `nama_anak_4` | Teks |
| 69 | JENIS KELAMIN ANAK 4 | `jenis_kelamin_anak_4` | Pilihan |
| 70 | TANGGAL LAHIR ANAK 4 | `tanggal_lahir_anak_4` | Tanggal |
| 71 | KETERANGAN ANAK 4 | `keterangan_anak_4` | Teks Area |

> Semua field di atas berada di **Informasi Keluarga → Identitas Anak**.

### Kolom 72–81: Orang Tua Kandung

> **Catatan**: Kolom ini ada di template Excel tetapi **belum didefinisikan** pada Profil Karyawan di `02_modul_hr_v2.md`. Disarankan untuk menambahkan group **"Orang Tua Kandung"** di tab Informasi Keluarga.

| Kolom | Header Excel | Field Profil (disarankan) | Tipe |
|:---:|---|---|---|
| 72 | NAMA BAPAK KANDUNG | `nama_ayah_kandung` | Teks |
| 73 | TANGGAL LAHIR BAPAK KANDUNG | `tanggal_lahir_ayah_kandung` | Tanggal |
| 74 | PENDIDIKAN TERAKHIR BAPAK KANDUNG | `pendidikan_terakhir_ayah_kandung` | Teks |
| 75 | PEKERJAAN BAPAK KANDUNG | `pekerjaan_ayah_kandung` | Teks |
| 76 | KETERANGAN BAPAK KANDUNG | `keterangan_ayah_kandung` | Teks Area |
| 77 | NAMA IBU KANDUNG | `nama_ibu_kandung` | Teks |
| 78 | TANGGAL LAHIR IBU KANDUNG | `tanggal_lahir_ibu_kandung` | Tanggal |
| 79 | PENDIDIKAN TERAKHIR IBU KANDUNG | `pendidikan_terakhir_ibu_kandung` | Teks |
| 80 | PEKERJAAN IBU KANDUNG | `pekerjaan_ibu_kandung` | Teks |
| 81 | KETERANGAN IBU KANDUNG | `keterangan_ibu_kandung` | Teks Area |

### Kolom 82–111: Saudara Kandung 1–4 (Repeatable)

Pola: **6 kolom per saudara** × 5 saudara = 30 kolom (saudara ke-5 ada di kolom 153-158).

> **Peringatan**: Di template asli, saudara kandung 3 muncul **duplikat** (kolom 94–99 dan 100–105). Pada mapping, kolom 100–105 diperlakukan sebagai **saudara kandung 4**, dan kolom 106–111 (berlabel "SAUDARA KANDUNG 4" di header) sebenarnya tidak lagi memiliki mapping tersendiri karena sudah ter-cover.

| Kolom | Header Excel | Field Profil | Tipe |
|:---:|---|---|---|
| 82 | NAMA SAUDARA KANDUNG 1 | `nama_saudara_kandung_1` | Teks |
| 83 | JENIS KELAMIN SAUDARA KANDUNG 1 | `jenis_kelamin_saudara_kandung_1` | Pilihan |
| 84 | TANGGAL LAHIR SAUDARA KANDUNG 1 | `tanggal_lahir_saudara_kandung_1` | Tanggal |
| 85 | PENDIDIKAN TERAKHIR SAUDARA KANDUNG 1 | `pendidikan_terakhir_saudara_kandung_1` | Teks |
| 86 | PEKERJAAN SAUDARA KANDUNG 1 | `pekerjaan_saudara_kandung_1` | Teks |
| 87 | KETERANGAN SAUDARA KANDUNG 1 | `keterangan_saudara_kandung_1` | Teks Area |
| 88 | NAMA SAUDARA KANDUNG 2 | `nama_saudara_kandung_2` | Teks |
| 89 | JENIS KELAMIN SAUDARA KANDUNG 2 | `jenis_kelamin_saudara_kandung_2` | Pilihan |
| 90 | TANGGAL LAHIR SAUDARA KANDUNG 2 | `tanggal_lahir_saudara_kandung_2` | Tanggal |
| 91 | PENDIDIKAN TERAKHIR SAUDARA KANDUNG 2 | `pendidikan_terakhir_saudara_kandung_2` | Teks |
| 92 | PEKERJAAN SAUDARA KANDUNG 2 | `pekerjaan_saudara_kandung_2` | Teks |
| 93 | KETERANGAN SAUDARA KANDUNG 2 | `keterangan_saudara_kandung_2` | Teks Area |
| 94 | NAMA SAUDARA KANDUNG 3 | `nama_saudara_kandung_3` | Teks |
| 95 | JENIS KELAMIN SAUDARA KANDUNG 3 | `jenis_kelamin_saudara_kandung_3` | Pilihan |
| 96 | TANGGAL LAHIR SAUDARA KANDUNG 3 | `tanggal_lahir_saudara_kandung_3` | Tanggal |
| 97 | PENDIDIKAN TERAKHIR SAUDARA KANDUNG 3 | `pendidikan_terakhir_saudara_kandung_3` | Teks |
| 98 | PEKERJAAN SAUDARA KANDUNG 3 | `pekerjaan_saudara_kandung_3` | Teks |
| 99 | KETERANGAN SAUDARA KANDUNG 3 | `keterangan_saudara_kandung_3` | Teks Area |
| 100 | NAMA SAUDARA KANDUNG 3 *(duplikat header)* | `nama_saudara_kandung_4` | Teks |
| 101 | JENIS KELAMIN SAUDARA KANDUNG 3 *(duplikat header)* | `jenis_kelamin_saudara_kandung_4` | Pilihan |
| 102 | TANGGAL LAHIR SAUDARA KANDUNG 3 *(duplikat header)* | `tanggal_lahir_saudara_kandung_4` | Tanggal |
| 103 | PENDIDIKAN TERAKHIR SAUDARA KANDUNG 3 *(duplikat header)* | `pendidikan_terakhir_saudara_kandung_4` | Teks |
| 104 | PEKERJAAN SAUDARA KANDUNG 3 *(duplikat header)* | `pekerjaan_saudara_kandung_4` | Teks |
| 105 | KETERANGAN SAUDARA KANDUNG 3 *(duplikat header)* | `keterangan_saudara_kandung_4` | Teks Area |
| 106 | NAMA SAUDARA KANDUNG 4 | — | **Tidak disimpan** (overlap dengan kolom 100) |
| 107 | JENIS KELAMIN SAUDARA KANDUNG 4 | — | **Tidak disimpan** (overlap dengan kolom 101) |
| 108 | TANGGAL LAHIR SAUDARA KANDUNG 4 | — | **Tidak disimpan** (overlap dengan kolom 102) |
| 109 | PENDIDIKAN TERAKHIR SAUDARA KANDUNG 4 | — | **Tidak disimpan** (overlap dengan kolom 103) |
| 110 | PEKERJAAN SAUDARA KANDUNG 4 | — | **Tidak disimpan** (overlap dengan kolom 104) |
| 111 | KETERANGAN SAUDARA KANDUNG 4 | — | **Tidak disimpan** (overlap dengan kolom 105) |

> Semua field saudara kandung berada di **Informasi Keluarga → Identitas Saudara Kandung**.

### Kolom 112–114: Bank & Pembayaran

| Kolom | Header Excel | Field Profil | Tab → Group | Tipe |
|:---:|---|---|---|---|
| 112 | SIKLUS PEMBAYARAN | `siklus_pembayaran_gaji` | Informasi HR → Costing | Teks |
| 113 | NAMA BANK | `nama_bank` | Personal Information → Rekening Bank | Teks |
| 114 | CABANG BANK | `cabang_bank` | Personal Information → Rekening Bank | Teks |

### Kolom 115–124: Orang Tua Mertua

| Kolom | Header Excel | Field Profil | Tab → Group | Tipe |
|:---:|---|---|---|---|
| 115 | NAMA BAPAK MERTUA | `nama_ayah_mertua` | Informasi Keluarga → Orang Tua Mertua | Teks |
| 116 | TANGGAL LAHIR BAPAK MERTUA | `tanggal_lahir_ayah_mertua` | Informasi Keluarga → Orang Tua Mertua | Tanggal |
| 117 | PENDIDIKAN TERAKHIR BAPAK MERTUA | `pendidikan_terakhir_ayah_mertua` | Informasi Keluarga → Orang Tua Mertua | Teks |
| 118 | PEKERJAAN BAPAK MERTUA | `pekerjaan_ayah_mertua` | Informasi Keluarga → Orang Tua Mertua | Teks |
| 119 | KETERANGAN BAPAK MERTUA | `keterangan_ayah_mertua` | Informasi Keluarga → Orang Tua Mertua | Teks Area |
| 120 | NAMA IBU MERTUA | `nama_ibu_mertua` | Informasi Keluarga → Orang Tua Mertua | Teks |
| 121 | TANGGAL LAHIR IBU MERTUA | `tanggal_lahir_ibu_mertua` | Informasi Keluarga → Orang Tua Mertua | Tanggal |
| 122 | PENDIDIKAN TERAKHIR IBU MERTUA | `pendidikan_terakhir_ibu_mertua` | Informasi Keluarga → Orang Tua Mertua | Teks |
| 123 | PEKERJAAN IBU MERTUA | `pekerjaan_ibu_mertua` | Informasi Keluarga → Orang Tua Mertua | Teks |
| 124 | KETERANGAN IBU MERTUA | `keterangan_ibu_mertua` | Informasi Keluarga → Orang Tua Mertua | Teks Area |

### Kolom 125–127: Organisasi

| Kolom | Header Excel | Field Profil | Tab → Group | Tipe | Ket |
|:---:|---|---|---|---|---|
| 125 | ORGANISASI SUB DEPARTMENT | — | — | — | **Tidak disimpan** |
| 126 | DEPARTMENT | `department` | Head / Informasi HR → Kepegawaian | Pilihan | `[MASTER]` Department |
| 127 | DIVISI | `divisi` | Head / Informasi HR → Kepegawaian | Pilihan | `[MASTER]` Divisi |

### Kolom 128–132: Kontak Darurat 1

| Kolom | Header Excel | Field Profil | Tab → Group | Tipe |
|:---:|---|---|---|---|
| 128 | NAMA KONTAK DARURAT 1 | `nama_kontak_darurat_1` | Informasi HR → Kontak Darurat | Teks |
| 129 | HUBUNGAN KONTAK DARURAT 1 | `hubungan_kontak_darurat_1` | Informasi HR → Kontak Darurat | Teks |
| 130 | ALAMAT KONTAK DARURAT 1 | `alamat_kontak_darurat_1` | Informasi HR → Kontak Darurat | Teks Area |
| 131 | NOMOR HP1 KONTAK DARURAT 1 | `nomor_telepon_kontak_darurat_1` | Informasi HR → Kontak Darurat | Teks |
| 132 | NOMOR HP2 KONTAK DARURAT 1 | `nomor_telepon_kontak_darurat_2` | Informasi HR → Kontak Darurat | Teks |

> **Catatan**: Kolom 132 secara header tertulis HP2 dari kontak darurat 1, tetapi di mapping diarahkan ke `nomor_telepon_kontak_darurat_2` (nomor telepon kontak darurat kedua).

### Kolom 133–136: Seragam, Pergerakan

| Kolom | Header Excel | Field Profil | Tab → Group | Tipe | Ket |
|:---:|---|---|---|---|---|
| 133 | UKURAN SEPATU | `ukuran_sepatu_kerja` | Informasi HR → Seragam dan Sepatu Kerja | Teks | — |
| 134 | UKURAN BAJU | `ukuran_seragam_kerja` | Informasi HR → Seragam dan Sepatu Kerja | Teks | — |
| 135 | LOKASI SEBELUMNYA | `lokasi_sebelumnya` | Informasi HR → Pergerakan Karyawan | Pilihan | `[MASTER]` Lokasi Kerja |
| 136 | TANGGAL MUTASI | `tanggal_mutasi` | Informasi HR → Pergerakan Karyawan | Tanggal | — |

### Kolom 137–148: Lainnya

| Kolom | Header Excel | Field Profil | Tab → Group | Tipe | Ket |
|:---:|---|---|---|---|---|
| 137 | UNIT YANG DI BAWAH | — | — | — | **Tidak disimpan** |
| 138 | POINT OF ORIGINAL | `point_of_original` | Informasi HR → POO/POH | Teks | — |
| 139 | POINT OF HIRE | `point_of_hire` | Informasi HR → POO/POH | Teks | — |
| 140 | NOMOR KARTU KELUARGA | `nomor_kartu_keluarga` | Personal Information → Identifikasi | Teks | — |
| 141 | NOMOR NIK KK | `no_nik_kk` | Personal Information → Identifikasi | Teks | — |
| 142 | LOKASI KERJA | `lokasi_kerja` | Head | Pilihan | `[MASTER]` Lokasi Kerja |
| 143 | STATUS KARYAWAN | `status_karyawan` | Head | Pilihan | `[MASTER]` Status Karyawan |
| 144 | TAG | `tag` | Head | Pilihan | `[MASTER]` Tag |
| 145 | MANAGER | `manager` | Head | Pilihan | `[REF_KARYAWAN]` jabatan "head" |
| 146 | ATASAN LANGSUNG | `atasan_langsung` | Head | Pilihan | `[REF_KARYAWAN]` karyawan aktif |
| 147 | EMAIL PERUSAHAAN | `email_perusahaan` | Head | Teks (Email) | — |
| 148 | EMAIL PRIBADI | `email_pribadi` | Personal Information → Biodata | Teks (Email) | — |

### Kolom 149–162: Kolom Tambahan Baru

Kolom-kolom berikut ditambahkan untuk melengkapi field Profil Karyawan yang sebelumnya tidak tersedia di template asli.

| Kolom | Header Excel | Field Profil | Tab → Group | Tipe |
|:---:|---|---|---|---|
| 149 | KOTA KTP | `kota_ktp` | Personal Information → Alamat KTP | Teks |
| 150 | PROVINSI KTP | `provinsi_ktp` | Personal Information → Alamat KTP | Teks |
| 151 | ANAK KE | `anak_ke` | Informasi Keluarga → Saudara Kandung | Angka |
| 152 | JUMLAH SAUDARA KANDUNG | `jumlah_saudara_kandung` | Informasi Keluarga → Saudara Kandung | Angka |
| 153 | NAMA SAUDARA KANDUNG 5 | `nama_saudara_kandung_5` | Informasi Keluarga → Identitas Saudara Kandung | Teks |
| 154 | JENIS KELAMIN SAUDARA KANDUNG 5 | `jenis_kelamin_saudara_kandung_5` | Informasi Keluarga → Identitas Saudara Kandung | Pilihan |
| 155 | TANGGAL LAHIR SAUDARA KANDUNG 5 | `tanggal_lahir_saudara_kandung_5` | Informasi Keluarga → Identitas Saudara Kandung | Tanggal |
| 156 | PENDIDIKAN TERAKHIR SAUDARA KANDUNG 5 | `pendidikan_terakhir_saudara_kandung_5` | Informasi Keluarga → Identitas Saudara Kandung | Teks |
| 157 | PEKERJAAN SAUDARA KANDUNG 5 | `pekerjaan_saudara_kandung_5` | Informasi Keluarga → Identitas Saudara Kandung | Teks |
| 158 | KETERANGAN SAUDARA KANDUNG 5 | `keterangan_saudara_kandung_5` | Informasi Keluarga → Identitas Saudara Kandung | Teks Area |
| 159 | NAMA KONTAK DARURAT 2 | `nama_kontak_darurat_2` | Informasi HR → Kontak Darurat | Teks |
| 160 | HUBUNGAN KONTAK DARURAT 2 | `hubungan_kontak_darurat_2` | Informasi HR → Kontak Darurat | Teks |
| 161 | ALAMAT KONTAK DARURAT 2 | `alamat_kontak_darurat_2` | Informasi HR → Kontak Darurat | Teks Area |
| 162 | NOMOR TELEPON KONTAK DARURAT 2 | `nomor_telepon_kontak_darurat_2` | Informasi HR → Kontak Darurat | Teks |

---

## Mapping Master Data

Kolom-kolom bertanda `[MASTER]` harus divalidasi terhadap tabel Master Data berikut:

| Kolom Excel | Tabel Master | Field Referensi |
|---|---|---|
| POSISI JABATAN | Posisi Jabatan | `nama_posisi_jabatan` |
| PANGKAT KATEGORI | Kategori Pangkat | `nama_kategori_pangkat` |
| GOLONGAN | Golongan | `nama_golongan` |
| SUB GOLONGAN | Sub Golongan | `nama_sub_golongan` |
| JENIS HUBUNGAN KERJA | Jenis Hubungan Kerja | `nama_jenis_hubungan_kerja` |
| DEPARTMENT | Department | `nama_departmen` |
| DIVISI | Divisi | `nama_divisi` |
| TAG | Tag | `nama_tag` |
| LOKASI KERJA | Lokasi Kerja | `nama_lokasi_kerja` |
| STATUS KARYAWAN | Status Karyawan | `nama_status` |
| LOKASI SEBELUMNYA | Lokasi Kerja | `nama_lokasi_kerja` |

---

## Daftar Field Referensi (Satu Kolom → Banyak Field)

Beberapa kolom Excel mengisi lebih dari satu field pada Profil Karyawan karena adanya mekanisme referensi:

| Kolom Excel | Field 1 | Field 2 |
|---|---|---|
| NAMA LENGKAP | `head.nama_lengkap` | `personal_information.biodata.nama_lengkap` |
| NOMOR INDUK KARYAWAN | `head.nomor_induk_karyawan` | `informasi_hr.kepegawaian.nomor_induk_karyawan` |
| POSISI JABATAN | `head.posisi_jabatan` | `informasi_hr.kepegawaian.posisi_jabatan` |
| DIVISI | `head.divisi` | `informasi_hr.kepegawaian.divisi` |
| DEPARTMENT | `head.department` | `informasi_hr.kepegawaian.department` |
| EMAIL PERUSAHAAN | `head.email_perusahaan` | `informasi_hr.kepegawaian.email_perusahaan` |
| MANAGER | `head.manager` | `informasi_hr.kepegawaian.manager` |
| ATASAN LANGSUNG | `head.atasan_langsung` | `informasi_hr.kepegawaian.atasan_langsung` |
| NOMOR HP 1 | `head.nomor_handphone` | `personal_information.informasi_kontak.nomor_handphone_1` |
| NAMA PASANGAN NIKAH | `personal_information.nama_pasangan` | `informasi_keluarga.nama_pasangan` |
| PEKERJAAN PASANGAN | `personal_information.pekerjaan_pasangan` | `informasi_keluarga.pekerjaan_pasangan` |
| JUMLAH ANAK | `personal_information.jumlah_anak` | `informasi_keluarga.jumlah_anak` |

---

## Kolom Tidak Disimpan (Diabaikan saat Import)

| Kolom | Header Excel | Alasan |
|:---:|---|---|
| 1 | NO | Nomor urut |
| 39 | STATUS PAJAK | Duplikat dengan kolom 37 |
| 46 | KODE PENDIDIKAN | Tidak ada field di profil |
| 106–111 | SAUDARA KANDUNG 4 | Overlap dengan kolom 100–105 (duplikat saudara kandung 3 → sudah di-mapping ke saudara 4) |
| 125 | ORGANISASI SUB DEPARTMENT | Tidak ada field di profil |
| 137 | UNIT YANG DI BAWAH | Tidak ada field di profil |
