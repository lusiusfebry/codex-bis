# Mapping Data Sheet Excel dengan Field Profil Karyawan dan Master Data

## Deskripsi Umum

File template Excel `template-import-fix.xlsx` digunakan untuk mengimport data karyawan secara massal ke dalam sistem HR. Template ini terdiri dari 4 sheet:

1. **Sheet `Masterdata`**: Template utama berisi 162 kolom header untuk data karyawan.
2. **Sheet `header excel`**: Daftar semua header pada sheet Masterdata.
3. **Sheet `header excel vs master data`**: Mapping header Excel ↔ field Master Data.
4. **Sheet `header excel vs profil karyawan`**: Mapping header Excel ↔ field Profil Karyawan.

---

## Aturan Import

1. Setiap baris pada sheet `Masterdata` mewakili **1 karyawan**.
2. Kolom yang mereferensi **Master Data** (ditandai `[MASTER]`) harus diisi dengan nilai yang sudah ada di master data yang berstatus **Aktif**.
3. Kolom yang mereferensi **data karyawan lain** (ditandai `[REF_KARYAWAN]`) harus diisi dengan NIK atau nama karyawan yang sudah terdaftar dan berstatus aktif.
4. Kolom bertipe **Tanggal** harus menggunakan format tanggal yang konsisten.
5. Satu kolom Excel bisa mengisi **beberapa field** di profil karyawan (misalnya `NAMA LENGKAP` mengisi `head.nama_lengkap` dan `personal_information.biodata.nama_lengkap`).

---

## Mapping 1: Header Excel → Master Data

Kolom-kolom berikut harus diisi dengan nilai yang sudah terdaftar di Master Data (section `## 1. Master Data` pada modul HR).

| No | Header Excel | Field Master Data | Tabel Master |
|----|---|---|---|
| 1 | PANGKAT KATEGORI | nama_kategori_pangkat | Kategori Pangkat |
| 2 | GOLONGAN | nama_golongan | Golongan |
| 3 | SUB GOLONGAN | nama_sub_golongan | Sub Golongan |
| 4 | JENIS HUBUNGAN KERJA | nama_jenis_hubungan_kerja | Jenis Hubungan Kerja |
| 5 | TAG | nama_tag | Tag |
| 6 | LOKASI KERJA | nama_lokasi_kerja | Lokasi Kerja |
| 7 | STATUS KARYAWAN | nama_status | Status Karyawan |
| 8 | DIVISI | nama_divisi | Divisi |
| 9 | DEPARTMENT | nama_departmen | Department |
| 10 | POSISI JABATAN | nama_posisi_jabatan | Posisi Jabatan |

---

## Mapping 2: Header Excel → Profil Karyawan

Berikut adalah mapping lengkap dari setiap kolom Excel ke field pada Profil Karyawan, dikelompokkan berdasarkan bagian/group.

### Bagian Head

| No | Header Excel | Field Profil | Tipe Data | Keterangan |
|----|---|---|---|---|
| 1 | NOMOR INDUK KARYAWAN | nomor_induk_karyawan | Teks | Wajib diisi |
| 2 | NAMA LENGKAP | nama_lengkap | Teks | Wajib diisi |
| 3 | POSISI JABATAN | posisi_jabatan | Pilihan | `[MASTER]` dari Posisi Jabatan |
| 4 | DIVISI | divisi | Pilihan | `[MASTER]` dari Divisi |
| 5 | DEPARTMENT | department | Pilihan | `[MASTER]` dari Department |
| 6 | MANAGER | manager | Pilihan | `[REF_KARYAWAN]` karyawan aktif dengan jabatan "head" |
| 7 | ATASAN LANGSUNG | atasan_langsung | Pilihan | `[REF_KARYAWAN]` karyawan aktif |
| 8 | EMAIL PERUSAHAAN | email_perusahaan | Teks (Email) | Tidak wajib |
| 9 | NOMOR HP 1 | nomor_handphone | Teks | — |
| 10 | STATUS KARYAWAN | status_karyawan | Pilihan | `[MASTER]` dari Status Karyawan |
| 11 | LOKASI KERJA | lokasi_kerja | Pilihan | `[MASTER]` dari Lokasi Kerja |
| 12 | TAG | tag | Pilihan | `[MASTER]` dari Tag |

---

### Tab: Personal Information

#### Group: Biodata Karyawan

| No | Header Excel | Field Profil | Tipe Data | Keterangan |
|----|---|---|---|---|
| 1 | NAMA LENGKAP | nama_lengkap | Teks | Referensi dari `head.nama_lengkap` |
| 2 | JENIS KELAMIN | jenis_kelamin | Pilihan | Laki-laki / Perempuan |
| 3 | TEMPAT LAHIR | tempat_lahir | Teks | — |
| 4 | TANGGAL LAHIR | tanggal_lahir | Tanggal | — |
| 5 | EMAIL PRIBADI | email_pribadi | Teks (Email) | — |

#### Group: Identifikasi

| No | Header Excel | Field Profil | Tipe Data | Keterangan |
|----|---|---|---|---|
| 1 | AGAMA | agama | Pilihan | — |
| 2 | GOLONGAN DARAH | golongan_darah | Pilihan | A / B / AB / O |
| 3 | NOMOR KARTU KELUARGA | nomor_kartu_keluarga | Teks | — |
| 4 | NOMOR KTP | nomor_ktp | Teks | — |
| 5 | NOMOR NPWP | nomor_npwp | Teks | — |
| 6 | NOMOR BPJS-TK | nomor_bpjs | Teks | — |
| 7 | NOMOR NIK KK | no_nik_kk | Teks | — |
| 8 | STATUS PERKAWINAN (PAJAK) | status_pajak | Teks | — |

#### Group: Alamat Domisili

| No | Header Excel | Field Profil | Tipe Data |
|----|---|---|---|
| 1 | ALAMAT DOMISILI | alamat_domisili | Teks Area |
| 2 | KOTA DOMISILI | kota_domisili | Teks |
| 3 | PROPINSI DOMISILI | provinsi_domisili | Teks |

#### Group: Alamat KTP

| No | Header Excel | Field Profil | Tipe Data |
|----|---|---|---|
| 1 | ALAMAT KTP | alamat_ktp | Teks Area |
| 2 | KOTA KTP | kota_ktp | Teks |
| 3 | PROVINSI KTP | provinsi_ktp | Teks |

#### Group: Informasi Kontak

| No | Header Excel | Field Profil | Tipe Data | Keterangan |
|----|---|---|---|---|
| 1 | NOMOR HP 1 | nomor_handphone_1 | Teks | Referensi dari `head.nomor_handphone` |
| 2 | NOMOR HP 2 | nomor_handphone_2 | Teks | — |
| 3 | NOMOR TELEPON RUMAH 1 | nomor_telepon_rumah_1 | Teks | — |
| 4 | NOMOR TELEPON RUMAH 2 | nomor_telepon_rumah_2 | Teks | — |

#### Group: Status Pernikahan dan Anak

| No | Header Excel | Field Profil | Tipe Data |
|----|---|---|---|
| 1 | STATUS PERNIKAHAN | status_pernikahan | Pilihan |
| 2 | NAMA PASANGAN NIKAH | nama_pasangan | Teks |
| 3 | TANGGAL MENIKAH | tanggal_menikah | Tanggal |
| 4 | TANGGAL CERAI | tanggal_cerai | Tanggal |
| 5 | TANGGAL WAFAT PASANGAN | tanggal_wafat_pasangan | Tanggal |
| 6 | PEKERJAAN PASANGAN | pekerjaan_pasangan | Teks |
| 7 | JUMLAH ANAK | jumlah_anak | Angka |

#### Group: Rekening Bank

| No | Header Excel | Field Profil | Tipe Data |
|----|---|---|---|
| 1 | NOMOR REKENING | nomor_rekening | Teks |
| 2 | NAMA PEMILIK REKENING | nama_pemegang_rekening | Teks |
| 3 | NAMA BANK | nama_bank | Teks |
| 4 | CABANG BANK | cabang_bank | Teks |

---

### Tab: Informasi HR

#### Group: Kepegawaian

Semua field di group ini adalah **referensi dari Bagian Head**. Satu kolom Excel mengisi field di Head dan Kepegawaian secara bersamaan.

| No | Header Excel | Field Profil | Keterangan |
|----|---|---|---|
| 1 | NOMOR INDUK KARYAWAN | nomor_induk_karyawan | Ref → `head.nomor_induk_karyawan` |
| 2 | POSISI JABATAN | posisi_jabatan | Ref → `head.posisi_jabatan` |
| 3 | DIVISI | divisi | Ref → `head.divisi` |
| 4 | DEPARTMENT | department | Ref → `head.department` |
| 5 | EMAIL PERUSAHAAN | email_perusahaan | Ref → `head.email_perusahaan` |
| 6 | MANAGER | manager | Ref → `head.manager` |
| 7 | ATASAN LANGSUNG | atasan_langsung | Ref → `head.atasan_langsung` |

#### Group: Kontrak

| No | Header Excel | Field Profil | Tipe Data | Keterangan |
|----|---|---|---|---|
| 1 | JENIS HUBUNGAN KERJA | jenis_hubungan_kerja | Pilihan | `[MASTER]` dari Jenis Hubungan Kerja |
| 2 | TANGGAL JOIN GROUP | tanggal_masuk_group | Tanggal | — |
| 3 | TANGGAL MASUK | tanggal_masuk | Tanggal | — |
| 4 | TANGGAL TETAP | tanggal_permanent | Tanggal | — |
| 5 | TANGGAL AWAL KONTRAK | tanggal_kontrak | Tanggal | — |
| 6 | TANGGAL AKHIR KONTRAK | tanggal_akhir_kontrak | Tanggal | — |
| 7 | TANGGAL KELUAR | tanggal_berhenti | Tanggal | — |

#### Group: Education

| No | Header Excel | Field Profil | Tipe Data |
|----|---|---|---|
| 1 | PENDIDIKAN TERAKHIR | tingkat_pendidikan | Teks |
| 2 | JURUSAN PENDIDIKAN | bidang_studi | Teks |
| 3 | NAMA SEKOLAH | nama_sekolah | Teks |
| 4 | KOTA SEKOLAH | kota_sekolah | Teks |
| 5 | STATUS PENDIDIKAN | status_kelulusan | Pilihan |
| 6 | KETERANGAN PENDIDIKAN | keterangan | Teks Area |

#### Group: Pangkat dan Golongan

| No | Header Excel | Field Profil | Tipe Data | Keterangan |
|----|---|---|---|---|
| 1 | PANGKAT KATEGORI | kategori_pangkat | Pilihan | `[MASTER]` dari Kategori Pangkat |
| 2 | GOLONGAN | golongan_pangkat | Pilihan | `[MASTER]` dari Golongan |
| 3 | SUB GOLONGAN | sub_golongan_pangkat | Pilihan | `[MASTER]` dari Sub Golongan |
| 4 | NOMOR DANA PENSIUN | no_dana_pensiun | Teks | — |

#### Group: Kontak Darurat

| No | Header Excel | Field Profil | Tipe Data |
|----|---|---|---|
| 1 | NAMA KONTAK DARURAT 1 | nama_kontak_darurat_1 | Teks |
| 2 | NOMOR HP1 KONTAK DARURAT 1 | nomor_telepon_kontak_darurat_1 | Teks |
| 3 | HUBUNGAN KONTAK DARURAT 1 | hubungan_kontak_darurat_1 | Teks |
| 4 | ALAMAT KONTAK DARURAT 1 | alamat_kontak_darurat_1 | Teks Area |
| 5 | NAMA KONTAK DARURAT 2 | nama_kontak_darurat_2 | Teks |
| 6 | NOMOR TELEPON KONTAK DARURAT 2 | nomor_telepon_kontak_darurat_2 | Teks |
| 7 | HUBUNGAN KONTAK DARURAT 2 | hubungan_kontak_darurat_2 | Teks |
| 8 | ALAMAT KONTAK DARURAT 2 | alamat_kontak_darurat_2 | Teks Area |

#### Group: POO/POH

| No | Header Excel | Field Profil | Tipe Data |
|----|---|---|---|
| 1 | POINT OF ORIGINAL | point_of_original | Teks |
| 2 | POINT OF HIRE | point_of_hire | Teks |

#### Group: Seragam dan Sepatu Kerja

| No | Header Excel | Field Profil | Tipe Data |
|----|---|---|---|
| 1 | UKURAN BAJU | ukuran_seragam_kerja | Teks |
| 2 | UKURAN SEPATU | ukuran_sepatu_kerja | Teks |

#### Group: Pergerakan Karyawan

| No | Header Excel | Field Profil | Tipe Data | Keterangan |
|----|---|---|---|---|
| 1 | LOKASI SEBELUMNYA | lokasi_sebelumnya | Pilihan | `[MASTER]` dari Lokasi Kerja |
| 2 | TANGGAL MUTASI | tanggal_mutasi | Tanggal | — |

#### Group: Costing

| No | Header Excel | Field Profil | Tipe Data |
|----|---|---|---|
| 1 | SIKLUS PEMBAYARAN | siklus_pembayaran_gaji | Teks |
| 2 | LOKASI COSTING | costing | Teks |
| 3 | ASSIGN | assign | Teks |
| 4 | ACTUAL | actual | Teks |

---

### Tab: Informasi Keluarga

#### Group: Pasangan dan Anak

| No | Header Excel | Field Profil | Tipe Data | Keterangan |
|----|---|---|---|---|
| 1 | NAMA PASANGAN NIKAH | nama_pasangan | Teks | Ref → `personal_information.nama_pasangan` |
| 2 | TANGGAL LAHIR PASANGAN | tanggal_lahir_pasangan | Tanggal | — |
| 3 | PENDIDIKAN TERAKHIR PASANGAN | pendidikan_terakhir_pasangan | Teks | — |
| 4 | PEKERJAAN PASANGAN | pekerjaan_pasangan | Teks | Ref → `personal_information.pekerjaan_pasangan` |
| 5 | JUMLAH ANAK | jumlah_anak | Angka | Ref → `personal_information.jumlah_anak` |
| 6 | KETERANGAN PASANGAN | keterangan_pasangan | Teks Area | — |

#### Group: Identitas Anak (Repeatable, berdasarkan jumlah_anak)

Pola kolom berulang: `{FIELD} ANAK {N}` dimana `N` = 1 sampai 4.

| No | Header Excel | Field Profil | Tipe Data |
|----|---|---|---|
| 1 | NAMA ANAK 1 | nama_anak_1 | Teks |
| 2 | JENIS KELAMIN ANAK 1 | jenis_kelamin_anak_1 | Pilihan |
| 3 | TANGGAL LAHIR ANAK 1 | tanggal_lahir_anak_1 | Tanggal |
| 4 | KETERANGAN ANAK 1 | keterangan_anak_1 | Teks Area |
| 5 | NAMA ANAK 2 | nama_anak_2 | Teks |
| 6 | JENIS KELAMIN ANAK 2 | jenis_kelamin_anak_2 | Pilihan |
| 7 | TANGGAL LAHIR ANAK 2 | tanggal_lahir_anak_2 | Tanggal |
| 8 | KETERANGAN ANAK 2 | keterangan_anak_2 | Teks Area |
| 9 | NAMA ANAK 3 | nama_anak_3 | Teks |
| 10 | JENIS KELAMIN ANAK 3 | jenis_kelamin_anak_3 | Pilihan |
| 11 | TANGGAL LAHIR ANAK 3 | tanggal_lahir_anak_3 | Tanggal |
| 12 | KETERANGAN ANAK 3 | keterangan_anak_3 | Teks Area |
| 13 | NAMA ANAK 4 | nama_anak_4 | Teks |
| 14 | JENIS KELAMIN ANAK 4 | jenis_kelamin_anak_4 | Pilihan |
| 15 | TANGGAL LAHIR ANAK 4 | tanggal_lahir_anak_4 | Tanggal |
| 16 | KETERANGAN ANAK 4 | keterangan_anak_4 | Teks Area |

#### Group: Saudara Kandung

| No | Header Excel | Field Profil | Tipe Data |
|----|---|---|---|
| 1 | ANAK KE | anak_ke | Angka |
| 2 | JUMLAH SAUDARA KANDUNG | jumlah_saudara_kandung | Angka |

#### Group: Identitas Saudara Kandung (Repeatable, maks. 5)

Pola kolom berulang: `{FIELD} SAUDARA KANDUNG {N}` dimana `N` = 1 sampai 5.

Setiap saudara kandung memiliki 6 field:

| Field per Saudara | Field Profil Pattern | Tipe Data |
|---|---|---|
| NAMA SAUDARA KANDUNG {N} | nama_saudara_kandung_{N} | Teks |
| JENIS KELAMIN SAUDARA KANDUNG {N} | jenis_kelamin_saudara_kandung_{N} | Pilihan |
| TANGGAL LAHIR SAUDARA KANDUNG {N} | tanggal_lahir_saudara_kandung_{N} | Tanggal |
| PENDIDIKAN TERAKHIR SAUDARA KANDUNG {N} | pendidikan_terakhir_saudara_kandung_{N} | Teks |
| PEKERJAAN SAUDARA KANDUNG {N} | pekerjaan_saudara_kandung_{N} | Teks |
| KETERANGAN SAUDARA KANDUNG {N} | keterangan_saudara_kandung_{N} | Teks Area |

> **Catatan**: Di template asli (`BMI-kosong.xlsx`), saudara kandung 3 muncul duplikat. Pada mapping, duplikat tersebut diperlakukan sebagai saudara kandung 4. Saudara kandung 5 ditambahkan sebagai kolom baru.

#### Group: Orang Tua Kandung

Kolom-kolom orang tua kandung berikut ada di template Excel tetapi **belum ada** definisi field di Profil Karyawan. Data ini tetap diimport dan disimpan.

| No | Header Excel | Field Profil (disarankan) | Tipe Data |
|----|---|---|---|
| 1 | NAMA BAPAK KANDUNG | nama_ayah_kandung | Teks |
| 2 | TANGGAL LAHIR BAPAK KANDUNG | tanggal_lahir_ayah_kandung | Tanggal |
| 3 | PENDIDIKAN TERAKHIR BAPAK KANDUNG | pendidikan_terakhir_ayah_kandung | Teks |
| 4 | PEKERJAAN BAPAK KANDUNG | pekerjaan_ayah_kandung | Teks |
| 5 | KETERANGAN BAPAK KANDUNG | keterangan_ayah_kandung | Teks Area |
| 6 | NAMA IBU KANDUNG | nama_ibu_kandung | Teks |
| 7 | TANGGAL LAHIR IBU KANDUNG | tanggal_lahir_ibu_kandung | Tanggal |
| 8 | PENDIDIKAN TERAKHIR IBU KANDUNG | pendidikan_terakhir_ibu_kandung | Teks |
| 9 | PEKERJAAN IBU KANDUNG | pekerjaan_ibu_kandung | Teks |
| 10 | KETERANGAN IBU KANDUNG | keterangan_ibu_kandung | Teks Area |

#### Group: Orang Tua Mertua

| No | Header Excel | Field Profil | Tipe Data |
|----|---|---|---|
| 1 | NAMA BAPAK MERTUA | nama_ayah_mertua | Teks |
| 2 | TANGGAL LAHIR BAPAK MERTUA | tanggal_lahir_ayah_mertua | Tanggal |
| 3 | PENDIDIKAN TERAKHIR BAPAK MERTUA | pendidikan_terakhir_ayah_mertua | Teks |
| 4 | KETERANGAN BAPAK MERTUA | keterangan_ayah_mertua | Teks Area |
| 5 | NAMA IBU MERTUA | nama_ibu_mertua | Teks |
| 6 | TANGGAL LAHIR IBU MERTUA | tanggal_lahir_ibu_mertua | Tanggal |
| 7 | PENDIDIKAN TERAKHIR IBU MERTUA | pendidikan_terakhir_ibu_mertua | Teks |
| 8 | KETERANGAN IBU MERTUA | keterangan_ibu_mertua | Teks Area |

---

## Kolom Excel Tanpa Mapping (Tidak Disimpan ke Profil)

Kolom-kolom berikut ada di template Excel tetapi **tidak memiliki field target** di Profil Karyawan dan tidak perlu disimpan:

| No | Header Excel | Alasan |
|----|---|---|
| 1 | NO | Nomor urut, bukan data karyawan |
| 2 | STATUS PAJAK (No. 38) | Duplikat dengan STATUS PERKAWINAN (PAJAK) |
| 3 | KODE PENDIDIKAN | Tidak ada field ini di profil |
| 4 | ORGANISASI SUB DEPARTMENT | Tidak ada field ini di profil |
| 5 | UNIT YANG DI BAWAH | Tidak ada field ini di profil |

---

## Catatan Penting

1. **Field referensi**: Beberapa field di profil karyawan adalah **referensi** dari field lain. Satu kolom Excel bisa mengisi beberapa field sekaligus. Contoh: kolom `NAMA LENGKAP` mengisi `head.nama_lengkap` sekaligus `personal_information.biodata.nama_lengkap`.

2. **Field Master Data**: Kolom bertanda `[MASTER]` harus divalidasi terhadap data Master Data yang berstatus Aktif. Jika nilai di Excel tidak ditemukan di Master Data, proses import harus menolak baris tersebut atau membuat entri master data baru.

3. **Field repeatable**: Kolom anak (1-4) dan saudara kandung (1-5) menggunakan pola berulang. Jumlah pengulangan ditentukan oleh `jumlah_anak` dan `jumlah_saudara_kandung`.

4. **Semua data profil karyawan disimpan di database**.

5. **Field `foto_karyawan`** tidak ada di template Excel karena berupa file gambar yang harus diunggah secara terpisah.
