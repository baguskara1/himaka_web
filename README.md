# HIMAKA UMBY PORTAL — Portal Organisasi & E-Ticketing Proker (Periode 2026)

Portal web resmi **Himpunan Mahasiswa Informatika (HIMAKA)** Fakultas Teknologi Informasi, **Universitas Mercu Buana Yogyakarta (UMBY)**. Aplikasi ini menggabungkan pusat informasi organisasi, direktori kepengurusan lintas periode, publikasi program kerja (proker) & berita Divisi Medinfo, sistem registrasi e-ticketing dengan kode unik 3 digit, rekonsiliasi pembayaran Bendahara, *Gate Scanner* anti-passback, hingga pengunduhan **E-Certificate PDF** otomatis bagi peserta yang berstatus **HADIR**.

---

## 1. Ringkasan Fitur yang Telah Dikerjakan

### A. Arsitektur 3 Portal Terpadu
1. **Portal 1 — Portal Guest (Pengunjung Publik)**
   - Menampilkan profil institusional HIMAKA UMBY, visi-misi, 6 divisi kerja, daftar program kerja 1 periode, direktori pengurus lintas angkatan, galeri dokumentasi visual, serta berita & liputan kegiatan.
   - Dilengkapi *Auth Gate Modal* otomatis ketika pengunjung publik hendak mendaftar acara e-ticketing.
2. **Portal 2 — Portal User (Workspace Mahasiswa Terautentikasi)**
   - Dashboard peserta terautentikasi untuk memantau status tiket (`LUNAS`, `PENDING`, `DITOLAK`, `EXPIRED`) dan kehadiran (`HADIR` / `BELUM HADIR`).
   - Alur pendaftaran acara individu maupun delegasi tim, kalkulasi tagihan dengan **3 digit kode unik** otomatis, dan unggah bukti pembayaran.
   - Halaman **Tiketku & E-Ticket QR** dengan kartu tiket perforasi digital, kode QR deterministik, filter status **`Hadir`**, serta tombol **`E-Certificate`** untuk mengunduh sertifikat PDF.
3. **Portal 3 — Portal Admin (Konsol Pengurus, Bendahara, Panitia Gate & Medinfo)**
   - **Overview Admin**: Ringkasan metrik transaksi, kuota acara, riwayat scan pintu, dan pintasan cepat pengelolaan.
   - **Dashboard Bendahara & CSV**: Verifikasi bukti transfer (`Setujui / Lunas` atau `Tolak` dengan pengembalian kuota otomatis) serta ekspor laporan transaksi ke format `.csv`.
   - **Scanner Gate (Anti-Passback)**: Validasi kode tiket satu kali masuk (`BOLEH MASUK`, `SUDAH PERNAH SCAN`, `TIKET TIDAK VALID`) yang otomatis menandai tiket peserta menjadi **`HADIR`**.
   - **CMS Medinfo (6 Tab Manajemen)**:
     1. *Siklus Proker*: Publikasi poster *Pre-Proker* & dokumentasi *After-Proker*, dilengkapi fitur **Edit** dan **Hapus** proker.
     2. *Berita & Media*: Publikasi berita mandiri, pemilihan berita utama (*lead story*), serta fitur **Edit** dan **Hapus** berita/media dokumentasi.
     3. *Pengurus 2026*: Tambah, edit, hapus anggota pengurus HIMAKA 2026, serta **unggah foto profil** (via `FileReader` Data URL).
     4. *Acara & Kuota*: Buat acara e-ticketing baru (lengkap dengan tier tiket, harga, kuota kursi, poin SKP, dan sinkronisasi ke Proker 2026) serta edit kuota/harga acara yang sedang tayang.
     5. *Pengumuman & Bank*: Kelola rekening bank Bendahara, kontak helpdesk, dan papan pengumuman.
     6. *Design System*: Dokumentasi komponen UI dan palet warna institusional.

---

### B. Pembaruan Data & Identitas HIMAKA UMBY Periode 2026
- **Logo Resmi HIMAKA UMBY**: Menggunakan lambang resmi lingkaran emas-biru tua (`/images/logo-himaka-umby.svg`) pada navigasi utama, hero beranda, profil organisasi, E-Certificate, dan footer.
- **Direktori Pengurus HIMAKA 2026 (`Kabinet Aksara Cipta`)**:
  - Diperbarui sesuai daftar resmi 15 pengurus periode 2026:
    1. **Aziz Zaghul Ikhsanudin** (`241110051`) — Ketua (BPH)
    2. **Wulandari** (`241110080`) — Wakil Ketua (BPH)
    3. **M.Ikrar Fatahillah** (`251110015`) — Bendahara (BPH)
    4. **Anita Yulinar Simanjutak** (`251110020`) — Sekretaris 1 (BPH)
    5. **Aaswin Suayb** (`251110021`) — Sekretaris 2 (BPH)
    6. **Muhammad Yasir Alfatah** (`241110085`) — Anggota PKM
    7. **Desi Kristiani Sumaredi** (`251110066`) — Anggota PKM
    8. **Muhammad Duta Arkazora Dalimunthe** (`241110079`) — Anggota Humas
    9. **Riski Naufal Pradana** (`241110088`) — Anggota Humas
    10. **Amanda Cahyani** (`251110067`) — Anggota Humas
    11. **Siti Saskia Widyanti** (`251110050`) — Anggota Humas
    12. **Rio Ardiyansyah** (`241110075`) — Anggota Medinfo
    13. **Ellan Septrysa** (`251110035`) — Anggota Medinfo
    14. **Mohammad Al Farel Deu** (`251110017`) — Anggota Medinfo
    15. **Adil Saputra** (`241110038`) — Anggota Medinfo
  - Tabel direktori publik disederhanakan menjadi 5 kolom bersih (`No`, `NIM & Angkatan`, `Nama Lengkap Anggota` + avatar/foto profil, `Jabatan`, `Divisi`) tanpa kolom Peminatan atau Tanggung Jawab Proker.
- **Sinkronisasi Jadwal Periode 2026**: Seluruh jadwal acara tiket, program kerja, pengumuman, dan artikel berita telah diselaraskan ke tahun **2026**.

---

### C. Fitur `E-Certificate` & Generator PDF Otomatis di Menu `Tiketku`
- Tombol **`E-Certificate`** di dalam halaman **Tiketku** hanya tampil apabila tiket berstatus **`HADIR`** (`attendanceStatus === 'HADIR'` / telah dipindai di Gate Scanner).
- Dilengkapi generator dokumen PDF-1.4 murni (`generateCertificatePdfString` & `triggerCertificatePdfDownload` di `lib/ticketing-core.ts`) yang langsung mengunduh file **`E-Certificate-CERT-HMK-2026-....pdf`** (format A4 Landscape) berisi nomor seri sertifikat, nama & NIM peserta, nama kegiatan, poin SKP, waktu check-in, serta pengesahan Ketua Umum HIMAKA 2026 (**Aziz Zaghul Ikhsanudin · NIM 241110051**).

---

## 2. Struktur Direktori Proyek

```text
├── app/
│   ├── globals.css                  # Konfigurasi Tailwind CSS v4 & utilitas tipografi/shadow akademik
│   ├── layout.tsx                   # Root layout Next.js 15 + konfigurasi font Plus Jakarta Sans, Inter, JetBrains Mono
│   └── page.tsx                     # Orkestrasi state utama (himaka_proto_v2), navigasi 3 portal, & breadcrumb
├── components/
│   ├── catalog-and-checkout.tsx     # Katalog acara, detail tier, form registrasi individu/tim, & upload bukti bayar
│   ├── gate-scanner-view.tsx        # Terminal pemeriksaan QR anti-passback & pratinjau E-Certificate di pintu
│   ├── home-news-and-auth.tsx       # Beranda organisasi, profil HIMAKA, tabel proker & pengurus 2026, berita, & modal login
│   ├── medinfo-and-specs.tsx        # CMS Medinfo (Siklus Proker, Berita, Pengurus 2026, Acara & Kuota, Bank, Design System)
│   ├── my-tickets-view.tsx          # Halaman Tiketku, filter status Hadir/Lunas, & unduh PDF E-Certificate
│   ├── portal-dashboards.tsx        # Dashboard Peserta (Portal 2) & Overview Admin (Portal 3)
│   ├── treasurer-dashboard.tsx      # Dashboard rekonsiliasi Bendahara & ekspor CSV
│   └── ui-primitives.tsx            # Badge semantik, QR SVG deterministik, PerforatedTicketCard, & CertificateModal
├── lib/
│   ├── ticketing-core.ts            # Pure business logic, tipe data, seed 2026, CRUD CMS, & generator PDF E-Certificate
│   └── ticketing-core.test.ts       # 17 unit test komprehensif menggunakan node:test
└── public/
    └── images/
        ├── logo-himaka-umby.svg     # Lambang resmi HIMAKA UMBY
        └── dokumentasi/             # Aset ilustrasi & dokumentasi kegiatan HIMAKA
```

---

## 3. Cara Menjalankan di Lokal (OpenCode) & Push ke GitHub

### Menjalankan di Komputer Lokal (`/home/rio-ardiyansyah/Documents/HIMAKA WEB`)
```bash
cd "/home/rio-ardiyansyah/Documents/HIMAKA WEB"

# 1. Install dependencies
npm install

# 2. Jalankan unit test (17 test)
npx tsx --test lib/ticketing-core.test.ts

# 3. Jalankan server development (http://localhost:3000)
npm run dev
```

### Inisialisasi Git & Push ke GitHub dari Terminal Lokal
Jika Anda mengunduh proyek ini melalui ZIP (bukan tombol *Save to GitHub* di AI Studio), jalankan perintah berikut di terminal lokal Anda untuk mengunggahnya ke repositori GitHub Anda:

```bash
cd "/home/rio-ardiyansyah/Documents/HIMAKA WEB"

git init
git branch -M main
git add .
git commit -m "feat: portal organisasi & e-ticketing HIMAKA UMBY periode 2026"

# Hubungkan ke repositori GitHub Anda (ganti dengan URL repo GitHub Anda)
git remote add origin https://github.com/USERNAME_ANDA/himaka-umby-portal.git
git push -u origin main
```
