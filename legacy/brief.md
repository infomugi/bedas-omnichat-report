Berikut **Project Brief** untuk pengembangan menu aplikasi bernama **Main Menu** dengan struktur yang Anda sebutkan.

---

# PROJECT BRIEF

## Aplikasi Main Menu – Platform Komunikasi Multi-Channel

### 1. Latar Belakang

Diperlukan aplikasi pusat kendali (dashboard) yang mengintegrasikan berbagai saluran komunikasi (WhatsApp API, SMS Blast, SMS LBA) serta fitur pendukung seperti laporan, tagihan, dan pengaturan sistem. Aplikasi ini akan digunakan oleh admin/operator untuk mengelola kampanye pesan massal, memantau performa, dan mengatur konfigurasi sistem.

### 2. Tujuan Proyek

- Menyediakan **satu gerbang utama** untuk mengakses seluruh fitur komunikasi dan administrasi.
- Memudahkan pengguna dalam mengirim pesan massal (blast) melalui WhatsApp dan SMS.
- Menyediakan analitik & laporan terkirim secara real-time.
- Memisahkan area sistem dan pengaturan dari area operasional harian.

### 3. Struktur Menu (Information Architecture)

#### **Main Menu**

| No  | Nama Menu          | Deskripsi Singkat                                                                          |
| --- | ------------------ | ------------------------------------------------------------------------------------------ |
| 1   | Dashboard          | Ringkasan statistik utama (total pesan terkirim, kredit tersisa, grafik pengiriman)        |
| 2   | WhatsApp API       | Konfigurasi koneksi API WhatsApp, cek status device/session, dan kirim pesan langsung      |
| 3   | WhatsApp Blast     | Buat & kelola kampanye broadcast WhatsApp (upload daftar nomor, jadwalkan, template pesan) |
| 4   | SMS Blast          | Kirim SMS massal (ke banyak nomor), dukungan personalisasi, dan jadwal pengiriman          |
| 5   | SMS LBA            | SMS berbasis lokasi (Location Based Advertising) – kirim SMS ke area geografis tertentu    |
| 6   | Analytics & Report | Statistik pengiriman, grafik keberhasilan/gagal, perbandingan channel, ekspor data         |
| 7   | Laporan Terkirim   | Log detail setiap pesan yang sudah dikirim (timestamp, status, tujuan, biaya)              |
| 8   | Tagihan & Usage    | Sisa kredit, riwayat top-up, invoice, pemakaian per periode (bulanan)                      |
| 9   | System             | Log sistem, backup data, monitoring API endpoint, cron job, aktivitas pengguna             |
| 10  | Pengaturan         | Ubah profil, manajemen pengguna (role/password), konfigurasi umum aplikasi, notifikasi     |

### 4. Target Pengguna

- **Admin Utama** – akses penuh ke semua menu (termasuk System & Pengaturan)
- **Operator** – akses menu Dashboard, WhatsApp Blast, SMS Blast, SMS LBA, Analytics, Laporan Terkirim
- **Keuangan** – akses ke Tagihan & Usage dan Laporan Terkirim

### 5. Fitur Utama per Menu (High-Level)

#### Dashboard

- Kartu total pesan hari ini, sukses, gagal, sisa kredit
- Grafik tren 7 hari terakhir (WhatsApp vs SMS)
- 5 log pengiriman terbaru

#### WhatsApp API

- Tampilkan QR code untuk koneksi (jika menggunakan WhatsApp Web JS)
- Tombol disconnect/reset session
- Form kirim pesan single

#### WhatsApp Blast & SMS Blast

- Upload file CSV (nomor, nama field)
- Pilih template pesan (variabel dinamis)
- Jadwal (sekarang / tentukan waktu)
- Estimasi biaya & sisa kredit

#### SMS LBA

- Input radius & titik koordinat (atau pilih wilayah)
- Ambil nomor dari database pelanggan berdasarkan lokasi
- Kirim SMS ke daftar nomor tersebut

#### Analytics & Report + Laporan Terkirim

- Filter tanggal, channel, status
- Ekspor ke Excel/PDF
- Tampilkan ringkasan biaya total

#### Tagihan & Usage

- Tampilkan sisa kredit (WhatsApp & SMS terpisah)
- Riwayat transaksi / top-up
- Tombol unduh invoice

#### System

- Log error API
- Status koneksi ke provider SMS & WhatsApp
- Cron job terakhir running
- Audit trail login user

#### Pengaturan

- Ganti password
- Tambah/ubah user & role
- Konfigurasi API key provider SMS
- Set notifikasi email untuk laporan harian

### 6. Teknologi yang Direkomendasikan

- **Frontend**: React.js / Vue.js (dengan sidebar menu tetap)
- **Backend**: Node.js (Express) atau Laravel
- **Database**: PostgreSQL / MySQL
- **Queue untuk Blast**: Bull (Redis) / RabbitMQ
- **WhatsApp API**: Baileys (Node) atau official WhatsApp Cloud API
- **SMS Provider**: Twilio, Infobip, atau gateway lokal (sesuai kebutuhan)

### 7. Alur Pengguna (User Flow)

1. Login → masuk ke **Dashboard**
2. Pilih **WhatsApp Blast** / **SMS Blast** → upload data → konfirmasi → kirim
3. Cek status di **Analytics & Report**
4. Lihat rincian tiap pesan di **Laporan Terkirim**
5. Top-up kredit di **Tagihan & Usage**
6. Admin melakukan konfigurasi API & user di **System / Pengaturan**

### 8. Non-Fungsi Requirement

- **Keamanan**: role-based access control (RBAC), logging setiap aksi kirim pesan
- **Kinerja**: antrian untuk blast >10.000 pesan agar tidak memblokir server
- **Skalabilitas**: pisahkan service WhatsApp & SMS jika perlu

### 9. Estimasi Tahapan Pengerjaan (MVP – 6 minggu)

| Minggu | Kegiatan                                          |
| ------ | ------------------------------------------------- |
| 1      | Setup proyek, desain database, autentikasi & RBAC |
| 2      | Dashboard + Laporan Terkirim                      |
| 3      | WhatsApp API (single) + WhatsApp Blast            |
| 4      | SMS Blast + SMS LBA                               |
| 5      | Analytics & Report + Tagihan & Usage              |
| 6      | System + Pengaturan + testing & deployment        |

### 10. Deliverables

- Source code aplikasi (frontend & backend)
- Dokumentasi API internal
- Panduan pengguna (user manual)
- Script deploy (Docker atau manual)

---

**Disusun oleh:** Tim Produk**Tanggal:** [Isi tanggal hari ini]**Status:** Menunggu persetujuan stakeholder

> Apakah Anda ingin saya **kembangkan lebih detail** untuk salah satu menu (misal: rancangan database, endpoint API, atau UI wireframe)?
