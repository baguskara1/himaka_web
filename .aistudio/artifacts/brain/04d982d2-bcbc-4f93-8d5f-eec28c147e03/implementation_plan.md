# Pembaruan Operasional & Manajemen Kepengurusan Portal HIMAKA UMBY 2026

Pembaruan ini melengkapi Portal Informasi & E-Ticketing HIMAKA Universitas Mercu Buana Yogyakarta (UMBY) Periode 2026 dengan manajemen data pengurus penuh (beserta foto profil), pembuatan agenda e-ticketing baru, penyuntingan berita/proker/kuota tiket yang sedang tayang, pencetakan e-sertifikat otomatis pasca-validasi kehadiran di gerbang, serta penyelarasan seluruh kalender kegiatan ke tahun berjalan 2026.

## User Review & Critical Decisions

> [!IMPORTANT]
> Berikut adalah rincian keputusan fitur yang telah dikonfirmasi dari hasil diskusi sebelumnya dan siap diimplementasikan:

- **Keputusan Terkonfirmasi 1 — Manajemen Pengurus HIMAKA 2026 & Foto Profil**: Portal Admin akan dilengkapi modul kelola anggota kabinet untuk menambah, mengubah, dan menghapus data pengurus HIMAKA 2026 (Nama, NIM, Angkatan, Jabatan, dan Divisi), disertai fitur unggah foto profil dari perangkat lokal (atau tautan gambar) yang langsung tampil pada tabel direktori pengurus.
- **Keputusan Terkonfirmasi 2 — Pembuatan Acara E-Ticketing Baru & Edit Konten Tayang**: Admin/Medinfo dapat membuka acara e-ticketing baru lengkap dengan pengaturan tier tiket, harga, poin SKP, dan kuota kursi. Selain itu, berita, program kerja, maupun acara/kuota tiket yang sudah tayang dapat diedit kembali kapan saja tanpa harus menghapus dan membuat ulang.
- **Keputusan Terkonfirmasi 3 — E-Sertifikat Otomatis Setelah Scan Hadir**: Peserta dengan tiket berstatus `LUNAS` yang telah melewati pemindaian QR/kode tiket di *Gate Scanner* (`Sudah Check-in`) secara otomatis mendapatkan akses cetak/unduh **E-Sertifikat Resmi HIMAKA UMBY 2026** lengkap dengan nomor seri sertifikat, nama & NIM peserta, nama acara, bobot poin SKP, tanggal kegiatan, dan pengesahan Ketua HIMAKA 2026.
- **Keputusan Terkonfirmasi 4 — Sinkronisasi Kalender Proker, Berita & Tiket ke Periode 2026**: Seluruh jadwal program kerja, agenda tiket kegiatan, kode seri transaksi (`HMK-2026-XXX`, `TRX-2026-XXXX`), serta arsip berita liputan disesuaikan sepenuhnya ke tahun kepengurusan berjalan **2026** dengan tetap mempertahankan penyimpanan lokal (`localStorage`) yang instan dan tahan muat ulang.

---

## 1. Overview & Core Concept

- **What It Does**: Menghadirkan sistem manajemen organisasi satu pintu bagi pengurus HIMAKA UMBY 2026—mulai dari pengelolaan direktori fungsionaris berfoto, publikasi & revisi program kerja/berita, pembukaan pendaftaran tiket acara baru, hingga penerbitan e-sertifikat kehadiran peserta secara otomatis setelah verifikasi di lokasi acara.
- **Target Audience / Persona**:
  - **Pengurus BPH & Divisi Medinfo HIMAKA 2026**: Mengelola susunan anggota kabinet, mempublikasikan atau merevisi proker dan berita kegiatan, serta membuka kuota pendaftaran e-ticketing acara baru.
  - **Panitia Gate & Bendahara Acara**: Memverifikasi pembayaran peserta dan melakukan scan tiket di pintu masuk yang sekaligus mengaktifkan hak klaim e-sertifikat peserta.
  - **Mahasiswa Informatika UMBY & Peserta Umum**: Melihat profil resmi pengurus 2026, mendaftar tiket kegiatan, dan mengunduh/mencetak e-sertifikat resmi segera setelah hadir di lokasi.
- **Key Value**: Menghilangkan pekerjaan manual panitia setelah acara usai (seperti rekap absensi manual dan pembuatan sertifikat satu per satu) sekaligus memberikan kendali penuh kepada admin untuk memperbarui data kepengurusan, proker, berita, dan kuota tiket secara *real-time*.

---

## 2. User Experience & Visual Design

- **Key User Flows**:
  1. **Alur Kelola Pengurus & Foto Profil (Portal Admin)**: Admin membuka tab *Pengurus HIMAKA 2026* di CMS -> memilih tombol *Tambah Anggota* atau *Edit* pada baris pengurus -> mengisi NIM, Nama, Angkatan, Jabatan, Divisi, serta mengunggah foto profil -> menyimpan perubahan dan melihat pembaruan langsung di tabel halaman utama *Beranda & Profil*.
  2. **Alur Buka Acara Tiket Baru & Edit Konten Tayang**: Admin memilih formulir *Buat Acara E-Ticketing Baru* (mengisi judul acara, tanggal 2026, lokasi kampus UMBY, poin SKP, serta daftar tier tiket & kuota) atau menekan tombol *Edit* pada kartu Proker, Berita, maupun Acara Tiket yang sudah tayang untuk memperbarui jadwal, deskripsi, atau menambah kuota kursi.
  3. **Alur Klaim & Cetak E-Sertifikat Peserta**: Panitia melakukan scan tiket peserta di *Gate Scanner* hingga berstatus `BOLEH MASUK (Check-in Tercatat)` -> Peserta membuka menu *Tiket Saya* -> menekan tombol **Lihat & Cetak E-Sertifikat** pada tiket yang sudah tervalidasi hadir -> menampilkan pratinjau sertifikat akademik resmi berlogo HIMAKA UMBY yang siap dicetak/disimpan sebagai PDF melalui dialog cetak lembar bersih.
- **Visual Identity & Theme**:
  - *Aesthetic Direction*: **Modern Minimalist Academic** — memadukan ketegasan institusi akademik dengan tata letak bersih, garis pemisah *hairline* `1px solid #c6c6cd`, serta lambang resmi **HIMAKA UMBY** berwarna biru-emas.
  - *Color Palette & Mood*:
    - Latar Kanvas Utama: `#f8f9ff` (*Cool Slate Tint*) dengan permukaan kartu `#ffffff` (*Crisp White*) dan header tabel `#eff4ff`.
    - Tipografi & Kontras: `#0b1c30` (*Deep Academic Slate/Navy*) untuk judul utama, `#45464d` untuk teks isi, dan `#767683` untuk keterangan waktu/meta.
    - Aksen Interaktif & Status Semantik: `#0a2cfd` (*Vibrant Electric Blue*) untuk aksi utama; `#ECFDF5` / `#10B981` / `#047857` untuk status `LUNAS` & `TERVERIFIKASI HADIR`; `#FFFBEB` / `#F59E0B` / `#B45309` untuk status `MENUNGGU VERIFIKASI`; serta `#FEF2F2` / `#EF4444` / `#B91C1C` untuk peringatan atau aksi hapus.
  - *Typography & Hierarchy*:
    - **Plus Jakarta Sans**: Judul halaman, nama acara, tajuk sertifikat, dan header seksi.
    - **Inter**: Formulir input, narasi berita, dan deskripsi program kerja.
    - **JetBrains Mono (`tabular-nums`)**: Nomor Induk Mahasiswa (NIM), nomor seri tiket & e-sertifikat (`CERT-HMK-2026-XXXX`), kuota kursi, dan nominal rupiah (`Rp`).
  - *Component Styling & Layout*: Mengikuti disiplin *anti-slop* dengan maksimal 4 titik data per kartu, pemisahan baris tabel dengan garis 1px, avatar foto pengurus melingkar `36px × 36px` dengan *fallback* inisial rapi, serta modal pratinjau E-Sertifikat bergaya piagam akademik formal.
- **Interactive Feedback & Motion**: Transisi halus saat membuka formulir edit inline dan modal pratinjau e-sertifikat, pratinjau instan (*live preview*) saat admin memilih file foto profil pengurus dari komputer/ponsel, serta indikator konfirmasi jelas sebelum penghapusan item.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1 — Penerbitan E-Sertifikat Terkunci pada Status Scan Kehadiran Gerbang (`scanCount > 0`)**:
  - *Chosen Approach*: Tombol klaim dan cetak E-Sertifikat hanya aktif apabila tiket berstatus `LUNAS` **dan** telah dipindai minimal satu kali di *Gate Scanner* (`scannedAt` tercatat).
  - *Why*: Menjaga integritas akademik dan poin SKP mahasiswa Informatika UMBY agar sertifikat hanya diterbitkan bagi peserta yang benar-benar hadir di lokasi kegiatan, bukan sekadar membeli tiket.
  - *Alternatives Considered*: Mengizinkan unduh sertifikat segera setelah tiket lunas tanpa scan kehadiran—ditolak karena rawan penyalahgunaan klaim SKP tanpa kehadiran fisik.
- **Decision 2 — Penyimpanan Foto Profil Pengurus Berbasis Data URL Terkompresi & Pratinjau Instan**:
  - *Chosen Approach*: Mengonversi unggahan foto profil pengurus menjadi Data URL ringan yang disimpan bersama *state* portal di `localStorage`, dilengkapi opsi input URL gambar dan *fallback* inisial otomatis.
  - *Why*: Memungkinkan admin mengunggah foto asli pengurus langsung dari perangkat tanpa memerlukan konfigurasi server penyimpanan eksternal, serta tetap bertahan saat halaman dimuat ulang.
  - *Alternatives Considered*: Hanya menyediakan input tautan URL eksternal—kurang praktis bagi admin yang menyimpan foto pengurus di galeri ponsel atau laptop.
- **Decision 3 — Mode Edit Langsung (*In-Place / Modal Edit*) untuk Proker, Berita, Acara, dan Pengurus**:
  - *Chosen Approach*: Menyediakan mode sunting langsung di CMS Medinfo & Portal Admin yang mengisi ulang formulir dengan data saat ini dan memperbarui entitas terkait secara *atomic*.
  - *Why*: Memudahkan koreksi salah ketik nama, perubahan jadwal proker 2026, maupun penambahan kuota tiket tanpa memutus relasi antara transaksi peserta dan ID acara.

---

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

### Architecture & Component Diagram

```text
┌───────────────────────────────────────────────────────────────────────────────────┐
│                   Central State & Persistence Engine (Periode 2026)               │
│  • State: cabinetPeriods (2026), prokers, newsArticles, events, transactions      │
│  • Actions: Member CRUD + Photo, Event Create/Edit, Proker/News Edit, Cert Issue  │
└──────────────────┬─────────────────────────────┬──────────────────────────────────┘
                   │                             │
      ┌────────────▼────────────┐   ┌────────────▼────────────┐
      │   Public & Member Views │   │  Admin & Panitia Views  │
      └────────────┬────────────┘   └────────────┬────────────┘
                   │                             │
  ┌────────────────┼────────────────┐            ├──────────────────────────────┐
  ▼                ▼                ▼            ▼                              ▼
┌────────────────┐ ┌──────────────┐ ┌──────────┐ ┌────────────────────────────┐ ┌────────────────────┐
│ Beranda &      │ │ Katalog      │ │ Tiket    │ │ CMS Medinfo & Admin        │ │ Gate Scanner &     │
│ Tabel Pengurus │ │ E-Ticketing  │ │ Saya &   │ │ • Kelola Pengurus + Foto   │ │ Dashboard Keuangan │
│ HIMAKA 2026    │ │ & Checkout   │ │ Piagam   │ │ • Buat/Edit Acara & Kuota  │ │ • Validasi QR/Kode │
│ (Foto + Filter)│ │ (Jadwal 2026)│ │ E-Sertif │ │ • Buat/Edit/Hapus Proker   │ │ • Aktivasi Hak     │
│                │ │              │ │ Otomatis │ │   & Berita Dokumentasi     │ │   E-Sertifikat     │
└────────────────┘ └──────────────┘ └──────────┘ └────────────────────────────┘ └────────────────────┘
```

### Data Model & State

1. **Entitas Pengurus (`HimakaPeriodMember`)**:
   - Menyimpan `id`, `periodYear` (`2025/2026`), `nim`, `name`, `cohortYear`, `roleTitle`, `division`, dan atribut baru `avatarUrl?: string` untuk foto profil pengurus.
2. **Entitas Acara & Tier Tiket (`EventItem` & `TicketTier`)**:
   - Menyimpan jadwal kegiatan periode 2026, lokasi, kuota total, bobot `skpPoints`, serta daftar tier tiket (`Reguler`, `Early Bird`, `Workshop Kit`, dll.) yang kini dapat ditambah baru atau diperbarui kuota/harganya oleh Admin.
3. **Entitas Transaksi & E-Sertifikat (`Transaction`)**:
   - Ketika transaksi berstatus `LUNAS` dipindai pada *Gate Scanner*, atribut `scannedAt` dan `scanCount` diperbarui. Sistem menurunkan metadata E-Sertifikat resmi (`certificateNumber: CERT-HMK-2026-<kode>`, nama peserta, NIM, judul acara, tanggal pelaksanaan, poin SKP, dan tanda tangan Ketua HIMAKA 2026 Aziz Zaghul Ikhsanudin).
4. **Sinkronisasi Data Seed & Normalisasi 2026**:
   - Seluruh tanggal kegiatan, jadwal proker lintas divisi, kode tiket (`HMK-2026-...`), dan artikel berita diatur ke kalender **2026** (Maret – Desember 2026), lengkap dengan migrasi otomatis untuk memperbarui *state* lama di `localStorage`.

### Interactive Component & State Mapping

- **Manajemen Anggota HIMAKA 2026 (Admin)**:
  - *Tambah / Edit Anggota*: Memvalidasi NIM, Nama Lengkap, Angkatan, Jabatan, dan Divisi (`BPH`, `PKM`, `Humas`, `Medinfo`, `Kaderisasi`, `Ristek`, `Kewirausahaan`), memproses unggahan foto profil (`FileReader` / URL), serta memperbarui daftar `cabinetPeriods[0].members`.
  - *Hapus Anggota*: Menghapus baris anggota tertentu dari periode aktif dengan proteksi minimal 1 pengurus tersisa.
- **Manajemen Acara, Proker & Berita (CMS Medinfo)**:
  - *Buat & Edit Acara Tiket*: Menambahkan acara baru ke katalog e-ticketing atau mengubah detail acara & kuota tier yang sudah tayang, sekaligus menjaga konsistensi kuota `sold` dan `quota`.
  - *Edit Proker & Berita*: Memuat data proker atau berita yang dipilih ke dalam formulir sunting, menyimpan perubahan judul, tanggal 2026, status pelaksanaan, ringkasan, isi liputan, serta galeri media.
- **Pratinjau & Cetak E-Sertifikat Peserta (`Tiket Saya` & `Gate Scanner`)**:
  - Memeriksa syarat `tx.status === 'LUNAS' && tx.scanCount > 0`.
  - Membuka modal piagam **E-Sertifikat Resmi HIMAKA UMBY 2026** dengan tata letak horisontal proporsional, lencana logo HIMAKA UMBY, kode verifikasi QR/Monospace, dan tombol **Cetak / Simpan PDF** (`window.print()`).
