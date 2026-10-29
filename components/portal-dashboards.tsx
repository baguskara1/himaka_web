'use client';

import { useState } from 'react';
import {
  QrCode,
  ArrowRight,
  FileSpreadsheet,
  Settings,
  LogOut,
  Upload,
  Camera,
  Maximize2,
  Trash2,
} from 'lucide-react';
import {
  AcademicEvent,
  HimakaUser,
  Transaction,
  ScanLogEntry,
  MedinfoConfig,
  HimakaCabinetPeriod,
  HimakaDocumentationItem,
  formatRupiah,
  isEventSoldOut,
  getUserTransactions,
  getDocumentationForEvent,
  getHimakaDocumentationGallery,
} from '@/lib/ticketing-core';
import { AcademicModal, StatusBadge } from './ui-primitives';

interface LoggedInUserPortalDashboardProps {
  user: HimakaUser;
  transactions: Transaction[];
  events: AcademicEvent[];
  medinfo: MedinfoConfig;
  documentationGallery?: HimakaDocumentationItem[];
  onSelectEventForRegistration: (event: AcademicEvent) => void;
  onOpenMyTickets: (txId?: string) => void;
  onOpenPaymentUpload: (tx: Transaction) => void;
  onOpenOrgInfo: () => void;
  onLogout: () => void;
}

export function LoggedInUserPortalDashboard({
  user,
  transactions,
  events,
  medinfo,
  documentationGallery,
  onSelectEventForRegistration,
  onOpenMyTickets,
  onOpenPaymentUpload,
  onOpenOrgInfo,
  onLogout,
}: LoggedInUserPortalDashboardProps) {
  const [previewDoc, setPreviewDoc] = useState<HimakaDocumentationItem | null>(
    null,
  );
  const userTxs = getUserTransactions(transactions, user);
  const lunasTxs = userTxs.filter((t) => t.status === 'LUNAS');
  const pendingTxs = userTxs.filter((t) => t.status === 'PENDING');
  const documentationItems = getHimakaDocumentationGallery(
    documentationGallery,
  ).slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Banner Identitas Portal 2: Portal User (Mahasiswa yang Sudah Login) */}
      <section
        aria-labelledby="heading-user-portal"
        className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-level-1 space-y-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-200/80">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono-code text-slate-500">
              <span className="text-emerald-700 font-semibold">
                WORKSPACE PESERTA TERAUTENTIKASI
              </span>
              <span aria-hidden="true">·</span>
              <span>NIM {user.nim}</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-800 font-medium">{user.faculty}</span>
            </div>
            <h1
              id="heading-user-portal"
              className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight"
            >
              Selamat Datang, {user.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
              Pantau status verifikasi tiket oleh Bendahara, unduh E-Ticket QR,
              atau daftar pada proker yang sedang dibuka.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => onOpenMyTickets()}
              className="min-h-[42px] px-4 py-2 bg-[#1d4ed8] hover:bg-[#1e40af] text-white text-xs font-semibold rounded-xl inline-flex items-center gap-2 transition-colors focus-academic shadow-xs"
            >
              <QrCode className="w-4 h-4" aria-hidden="true" />
              <span>Buka E-Ticket & Tiketku ({userTxs.length})</span>
            </button>

            <button
              type="button"
              onClick={onLogout}
              className="min-h-[42px] px-4 py-2 bg-white border border-slate-200 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-700 text-slate-700 text-xs font-semibold rounded-xl inline-flex items-center gap-2 transition-colors focus-academic"
            >
              <LogOut className="w-4 h-4" aria-hidden="true" />
              <span>Keluar ke Portal Guest</span>
            </button>
          </div>
        </div>

        {/* Statistik Ringkas Akun Peserta */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 sm:p-5 rounded-xl bg-slate-50/80 border border-slate-200/80">
            <span className="text-[11px] font-mono-code uppercase tracking-wider text-slate-500 block">
              STATUS AKUN MAHASISWA
            </span>
            <span className="text-base font-bold text-emerald-700 font-mono-code mt-1.5 block">
              AKTIF · SIAP DAFTAR
            </span>
            <span className="text-xs text-slate-600 mt-1 block truncate">
              Email: {user.email}
            </span>
          </div>

          <div className="p-4 sm:p-5 rounded-xl bg-slate-50/80 border border-slate-200/80">
            <span className="text-[11px] font-mono-code uppercase tracking-wider text-slate-500 block">
              TIKET AKTIF (LUNAS)
            </span>
            <span className="text-xl font-bold text-slate-900 font-mono-code mt-1.5 block">
              {lunasTxs.length} E-Ticket QR
            </span>
            <span className="text-xs text-slate-600 mt-1 block">
              Siap dipindai di gerbang acara
            </span>
          </div>

          <div className="p-4 sm:p-5 rounded-xl bg-slate-50/80 border border-slate-200/80">
            <span className="text-[11px] font-mono-code uppercase tracking-wider text-slate-500 block">
              MENUNGGU VERIFIKASI
            </span>
            <span className="text-xl font-bold text-amber-700 font-mono-code mt-1.5 block">
              {pendingTxs.length} Transaksi
            </span>
            <span className="text-xs text-slate-600 mt-1 block">
              Rekonsiliasi kode unik 3 digit
            </span>
          </div>

          <div className="p-4 sm:p-5 rounded-xl bg-slate-50/80 border border-slate-200/80">
            <span className="text-[11px] font-mono-code uppercase tracking-wider text-slate-500 block">
              TOTAL PENDAFTARAN SAYA
            </span>
            <span className="text-xl font-bold text-slate-900 font-mono-code mt-1.5 block">
              {userTxs.length} Kegiatan
            </span>
            <span className="text-xs text-slate-600 mt-1 block">
              Tersimpan pada himaka_proto_v2
            </span>
          </div>
        </div>
      </section>

      {/* Grid Utama Portal User: Tiket Saya (7 cols) + Proker Buka Pendaftaran Disertai Dokumentasi (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 space-y-6">
          {/* Daftar Tiket & Pendaftaran Milik User yang Login */}
          <section
            aria-labelledby="heading-user-tickets"
            className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-level-1 space-y-5"
          >
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
              <div>
                <span className="text-[11px] font-mono-code font-semibold uppercase tracking-widest text-[#1d4ed8] block">
                  RIWAYAT PENDAFTARAN & E-TICKET SAYA
                </span>
                <h2
                  id="heading-user-tickets"
                  className="text-lg font-bold text-slate-900 mt-0.5"
                >
                  Tiket Proker Milik {user.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => onOpenMyTickets()}
                className="text-xs font-semibold text-[#1d4ed8] hover:underline"
              >
                Lihat Semua Tiket →
              </button>
            </div>

            {userTxs.length > 0 ? (
              <div className="divide-y divide-slate-200/80">
                {userTxs.map((tx) => (
                  <div
                    key={tx.id}
                    className="py-4 first:pt-0 last:pb-0 space-y-2.5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2 font-mono-code text-xs">
                        <span className="font-bold text-slate-900">
                          {tx.ticketCode}
                        </span>
                        <span aria-hidden="true" className="text-slate-300">
                          ·
                        </span>
                        <span className="text-slate-500">{tx.id}</span>
                      </div>
                      <StatusBadge
                        variant={
                          tx.status === 'LUNAS'
                            ? 'success'
                            : tx.status === 'PENDING'
                              ? 'warning'
                              : tx.status === 'DITOLAK'
                                ? 'danger'
                                : 'neutral'
                        }
                        label={tx.status}
                      />
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        {tx.eventTitle}
                      </h3>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Tier:{' '}
                        <strong className="text-slate-900">
                          {tx.tierName}
                        </strong>{' '}
                        · Total Transfer:{' '}
                        <strong className="font-mono-code text-slate-900">
                          {formatRupiah(tx.totalAmount)}
                        </strong>
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <span className="text-xs font-mono-code text-slate-500">
                        {tx.status === 'LUNAS'
                          ? tx.scannedAt
                            ? `Sudah Check-in (${tx.scannedAt})`
                            : 'E-Ticket QR Aktif & Siap Scan'
                          : tx.proofFileName
                            ? `Bukti: ${tx.proofFileName}`
                            : 'Belum unggah bukti transfer'}
                      </span>

                      <div className="flex items-center gap-2">
                        {tx.status === 'PENDING' && (
                          <button
                            type="button"
                            onClick={() => onOpenPaymentUpload(tx)}
                            className="min-h-[36px] px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 transition-colors"
                          >
                            <Upload
                              className="w-3.5 h-3.5 text-[#1d4ed8]"
                              aria-hidden="true"
                            />
                            <span>Unggah Bukti</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => onOpenMyTickets(tx.id)}
                          className="min-h-[36px] px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 transition-colors"
                        >
                          <QrCode className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Buka E-Ticket QR</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center space-y-1.5">
                <p className="text-sm font-bold text-slate-900">
                  Belum ada pendaftaran tiket pada akun NIM {user.nim}
                </p>
                <p className="text-xs text-slate-600">
                  Pilih salah satu proker HIMAKA di sebelah kanan untuk
                  mendaftar.
                </p>
              </div>
            )}
          </section>

          {/* Informasi & Dokumentasi Kegiatan Terbaru HIMAKA di Dashboard User */}
          <section
            aria-labelledby="heading-user-docs"
            className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-level-1 space-y-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-4">
              <div>
                <span className="text-[11px] font-mono-code font-semibold uppercase tracking-widest text-[#1d4ed8] block">
                  SOROTAN INFORMASI & DOKUMENTASI KEGIATAN HIMAKA
                </span>
                <h2
                  id="heading-user-docs"
                  className="text-lg font-bold text-slate-900 mt-0.5"
                >
                  Dokumentasi Aktivitas & Proker Terkini
                </h2>
              </div>
              <button
                type="button"
                onClick={onOpenOrgInfo}
                className="text-xs font-semibold text-[#1d4ed8] hover:underline"
              >
                Buka Seluruh Berita & Galeri →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {documentationItems.map((doc) => (
                <figure
                  key={doc.id}
                  className="rounded-xl bg-white border border-slate-200/80 hover:border-slate-300 overflow-hidden flex flex-col justify-between transition-all"
                >
                  <div>
                    <div className="aspect-video w-full bg-slate-100 border-b border-slate-200/80 overflow-hidden group">
                      <img
                        src={doc.imageUrl}
                        alt={doc.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                      />
                    </div>
                    <figcaption className="p-4 space-y-1">
                      <span className="text-[11px] font-mono-code text-slate-500 block">
                        <strong className="text-[#1d4ed8]">
                          {doc.archiveCode}
                        </strong>{' '}
                        · {doc.category} · {doc.date}
                      </span>
                      <h3 className="text-xs font-bold text-slate-900 leading-snug">
                        {doc.title}
                      </h3>
                      <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-2">
                        {doc.caption}
                      </p>
                    </figcaption>
                  </div>

                  <div className="px-4 pb-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono-code text-slate-500 truncate">
                      {doc.location}
                    </span>
                    <button
                      type="button"
                      onClick={() => setPreviewDoc(doc)}
                      className="min-h-[32px] px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 text-[11px] font-semibold rounded-lg inline-flex items-center gap-1 shrink-0 transition-colors"
                    >
                      <Camera
                        className="w-3 h-3 text-[#1d4ed8]"
                        aria-hidden="true"
                      />
                      <span>Lihat Foto</span>
                    </button>
                  </div>
                </figure>
              ))}
            </div>
          </section>
        </div>

        {/* Pintasan Pendaftaran Proker untuk User yang Sudah Login (Flattened with hairline dividers) */}
        <aside className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-level-1 space-y-4">
            <div className="border-b border-slate-200/80 pb-3.5">
              <span className="text-xs font-mono-code font-semibold text-emerald-700 block">
                PENDAFTARAN TERBUKA
              </span>
              <h2 className="text-base font-bold text-slate-900 mt-0.5">
                Daftar Proker &amp; Acara HIMAKA
              </h2>
            </div>

            <div className="divide-y divide-slate-200/80">
              {events.map((ev) => {
                const soldOut = isEventSoldOut(ev) || !ev.isOpen;
                const minPrice = Math.min(...ev.tiers.map((t) => t.price));
                const evDoc = getDocumentationForEvent(ev);
                return (
                  <div
                    key={ev.id}
                    className="py-4 first:pt-0 last:pb-0 space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono-code text-xs text-slate-500">
                        <strong className="text-slate-900">{ev.code}</strong> ·{' '}
                        {ev.date} · {ev.skpPoints}
                      </span>
                      {soldOut ? (
                        <StatusBadge variant="neutral" label="KUOTA HABIS" />
                      ) : (
                        <StatusBadge variant="success" label="TERSEDIA" />
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      {ev.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {evDoc.imageCaption}
                    </p>

                    <div className="flex items-center justify-between gap-2 pt-1">
                      <span className="text-xs font-mono-code font-semibold text-slate-900">
                        Mulai {formatRupiah(minPrice)}
                      </span>
                      <button
                        type="button"
                        onClick={() => onSelectEventForRegistration(ev)}
                        className="min-h-[36px] px-3.5 py-1.5 bg-[#1d4ed8] hover:bg-[#1e40af] text-white text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 transition-colors focus-academic"
                      >
                        <span>Pilih Tier &amp; Daftar</span>
                        <ArrowRight
                          className="w-3.5 h-3.5"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Info Organisasi & Rekening Resmi */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-level-1 space-y-3.5">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200/80 pb-2.5">
              Rekening Resmi Kepanitiaan HIMAKA
            </h3>
            <div className="text-xs space-y-1.5 text-slate-600">
              <p>
                <strong className="text-slate-900">Bank:</strong>{' '}
                {medinfo.bankName}
              </p>
              <p className="font-mono-code font-semibold text-slate-900">
                No. Rek: {medinfo.bankAccountNumber}
              </p>
              <p>
                <strong className="text-slate-900">Atas Nama:</strong>{' '}
                {medinfo.bankAccountHolder}
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenOrgInfo}
              className="w-full min-h-[40px] px-3 py-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-900 text-xs font-semibold rounded-xl transition-colors"
            >
              Lihat Profil HIMAKA, Proker 1 Periode & Anggota
            </button>
          </div>
        </aside>
      </div>

      {/* Modal Pratinjau Dokumentasi di Dashboard User */}
      <AcademicModal
        isOpen={Boolean(previewDoc)}
        onClose={() => setPreviewDoc(null)}
        title={previewDoc?.title || 'Detail Dokumentasi Kegiatan'}
        subtitle={
          previewDoc
            ? `${previewDoc.archiveCode} · ${previewDoc.category} · ${previewDoc.date}`
            : ''
        }
      >
        {previewDoc && (
          <div className="space-y-4 text-xs text-slate-600">
            <figure className="rounded-xl overflow-hidden border border-slate-200 bg-slate-900">
              <img
                src={previewDoc.imageUrl}
                alt={previewDoc.title}
                referrerPolicy="no-referrer"
                className="w-full h-auto object-contain"
              />
            </figure>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <p className="font-mono-code text-slate-900">
                <strong>Lokasi:</strong> {previewDoc.location} ·{' '}
                <strong>Fotografer:</strong> {previewDoc.photographer}
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                {previewDoc.caption}
              </p>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="min-h-[40px] px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors"
              >
                Tutup Dokumentasi
              </button>
            </div>
          </div>
        )}
      </AcademicModal>
    </div>
  );
}

interface AdminPortalDashboardProps {
  adminUser: HimakaUser;
  transactions: Transaction[];
  scanLogs: ScanLogEntry[];
  events: AcademicEvent[];
  cabinetPeriods: HimakaCabinetPeriod[];
  documentationGallery?: HimakaDocumentationItem[];
  onOpenTab: (tab: 'bendahara' | 'scanner' | 'medinfo') => void;
  onDeleteDocumentationMedia?: (docId: string, title?: string) => void;
  onLogout: () => void;
}

export function AdminPortalDashboard({
  adminUser,
  transactions,
  scanLogs,
  events,
  cabinetPeriods,
  documentationGallery,
  onOpenTab,
  onDeleteDocumentationMedia,
  onLogout,
}: AdminPortalDashboardProps) {
  const [previewDoc, setPreviewDoc] = useState<HimakaDocumentationItem | null>(
    null,
  );
  const lunasTxs = transactions.filter((t) => t.status === 'LUNAS');
  const pendingTxs = transactions.filter((t) => t.status === 'PENDING');
  const totalRevenue = lunasTxs.reduce((acc, t) => acc + t.totalAmount, 0);
  const validScans = scanLogs.filter(
    (s) => s.decision === 'BOLEH MASUK',
  ).length;
  const activeCabinet = cabinetPeriods[0];
  const adminDocs = getHimakaDocumentationGallery(documentationGallery).slice(
    0,
    4,
  );

  return (
    <div className="space-y-6">
      {/* Header Portal 3: Portal Admin (Pengurus HIMAKA UMBY) */}
      <section
        aria-labelledby="heading-admin-portal"
        className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-level-1 space-y-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-200/80">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono-code text-slate-500">
              <span className="text-[#1d4ed8] font-semibold">
                KONSOL PENGURUS &amp; PANITIA HIMAKA
              </span>
              <span aria-hidden="true">·</span>
              <span>Petugas: {adminUser.name}</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-900 font-semibold">
                {activeCabinet?.cabinetName} ({activeCabinet?.periodYear})
              </span>
            </div>
            <h1
              id="heading-admin-portal"
              className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight"
            >
              Pusat Kendali Admin &amp; Kepanitiaan HIMAKA UMBY
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
              Kelola verifikasi pembayaran tiket (Bendahara), pemindaian gerbang
              anti-passback (Panitia Gate), serta publikasi berita dan media
              dokumentasi (Medinfo).
            </p>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="min-h-[42px] px-4 py-2 bg-white border border-slate-200 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-700 text-slate-700 text-xs font-semibold rounded-xl inline-flex items-center gap-2 transition-colors focus-academic shrink-0"
          >
            <LogOut className="w-4 h-4" aria-hidden="true" />
            <span>Keluar dari Portal Admin</span>
          </button>
        </div>

        {/* 4 Indikator Operasional Admin */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 sm:p-5 rounded-xl bg-slate-50/80 border border-slate-200/80">
            <span className="text-[11px] font-mono-code uppercase tracking-wider text-slate-500 block">
              DANA TERVERIFIKASI (LUNAS)
            </span>
            <span className="text-xl font-bold text-emerald-700 font-mono-code mt-1.5 block">
              {formatRupiah(totalRevenue)}
            </span>
            <span className="text-xs text-slate-600 mt-1 block">
              Dari {lunasTxs.length} transaksi disetujui
            </span>
          </div>

          <div className="p-4 sm:p-5 rounded-xl bg-slate-50/80 border border-slate-200/80">
            <span className="text-[11px] font-mono-code uppercase tracking-wider text-slate-500 block">
              ANTREAN VERIFIKASI BENDAHARA
            </span>
            <span className="text-xl font-bold text-amber-700 font-mono-code mt-1.5 block">
              {pendingTxs.length} PENDING
            </span>
            <span className="text-xs text-slate-600 mt-1 block">
              Menunggu cek mutasi 3 digit unik
            </span>
          </div>

          <div className="p-4 sm:p-5 rounded-xl bg-slate-50/80 border border-slate-200/80">
            <span className="text-[11px] font-mono-code uppercase tracking-wider text-slate-500 block">
              GATE CHECK-IN AUDITORIUM
            </span>
            <span className="text-xl font-bold text-slate-900 font-mono-code mt-1.5 block">
              {validScans} Peserta Masuk
            </span>
            <span className="text-xs text-slate-600 mt-1 block">
              Total {scanLogs.length} aktivitas pemindaian
            </span>
          </div>

          <div className="p-4 sm:p-5 rounded-xl bg-slate-50/80 border border-slate-200/80">
            <span className="text-[11px] font-mono-code uppercase tracking-wider text-slate-500 block">
              PROKER & ACARA AKTIF
            </span>
            <span className="text-xl font-bold text-[#1d4ed8] font-mono-code mt-1.5 block">
              {events.filter((e) => e.isOpen).length} / {events.length} Acara
              Buka
            </span>
            <span className="text-xs text-slate-600 mt-1 block">
              {activeCabinet?.prokers.length || 8} Proker Periode{' '}
              {activeCabinet?.periodYear}
            </span>
          </div>
        </div>
      </section>

      {/* 3 Modul Utama Portal Admin */}
      <section
        aria-label="Modul Kerja Portal Admin"
        className="grid grid-cols-1 md:grid-cols-3 gap-5"
      >
        <div className="bg-white border border-slate-200/80 hover:border-slate-300 rounded-2xl p-6 shadow-level-1 flex flex-col justify-between gap-5 transition-all">
          <div className="space-y-2">
            <span className="text-[11px] font-mono-code font-semibold uppercase tracking-widest text-[#1d4ed8] block">
              MODUL ADMIN 01 · KEUANGAN
            </span>
            <h2 className="text-base font-bold text-slate-900">
              Dashboard Bendahara & Ekspor CSV
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Periksa rincian bukti transfer peserta, cocokkan nominal kode unik
              3 digit, setujui (`LUNAS`) atau tolak (`DITOLAK`) transaksi, serta
              unduh laporan CSV.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onOpenTab('bendahara')}
            className="w-full min-h-[42px] px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl inline-flex items-center justify-center gap-2 transition-colors focus-academic shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4" aria-hidden="true" />
            <span>Buka Dashboard Bendahara</span>
          </button>
        </div>

        <div className="bg-white border border-slate-200/80 hover:border-slate-300 rounded-2xl p-6 shadow-level-1 flex flex-col justify-between gap-5 transition-all">
          <div className="space-y-2">
            <span className="text-[11px] font-mono-code font-semibold uppercase tracking-widest text-[#1d4ed8] block">
              MODUL ADMIN 02 · REGISTRASI PINTU
            </span>
            <h2 className="text-base font-bold text-slate-900">
              Gate Scanner & Anti-Passback QR
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Validasi kode tiket peserta di meja registrasi auditorium dengan
              deteksi otomatis status <strong>BOLEH MASUK</strong>,{' '}
              <strong>SUDAH PERNAH SCAN</strong>, atau{' '}
              <strong>TIKET TIDAK VALID</strong>.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onOpenTab('scanner')}
            className="w-full min-h-[42px] px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl inline-flex items-center justify-center gap-2 transition-colors focus-academic shadow-xs"
          >
            <QrCode className="w-4 h-4" aria-hidden="true" />
            <span>Buka Scanner Pintu Masuk</span>
          </button>
        </div>

        <div className="bg-white border border-slate-200/80 hover:border-slate-300 rounded-2xl p-6 shadow-level-1 flex flex-col justify-between gap-5 transition-all">
          <div className="space-y-2">
            <span className="text-[11px] font-mono-code font-semibold uppercase tracking-widest text-[#1d4ed8] block">
              MODUL ADMIN 03 · PUBLIKASI & CMS
            </span>
            <h2 className="text-base font-bold text-slate-900">
              CMS Medinfo & Pengaturan Proker
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Kelola informasi rekening bank/QRIS kepanitiaan, pengumuman papan
              informasi Medinfo, serta buka atau tutup status pendaftaran acara
              proker.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onOpenTab('medinfo')}
            className="w-full min-h-[42px] px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl inline-flex items-center justify-center gap-2 transition-colors focus-academic shadow-xs"
          >
            <Settings className="w-4 h-4" aria-hidden="true" />
            <span>Buka CMS Medinfo</span>
          </button>
        </div>
      </section>

      {/* Arsip Dokumentasi Informasi & Publikasi Proker pada Dashboard Admin */}
      <section
        aria-labelledby="heading-admin-docs"
        className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-level-1 space-y-5"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-4">
          <div>
            <span className="text-[11px] font-mono-code font-semibold uppercase tracking-widest text-[#1d4ed8] block">
              MONITORING PUBLIKASI & DOKUMENTASI VISUAL MEDINFO
            </span>
            <h2
              id="heading-admin-docs"
              className="text-lg font-bold text-slate-900 mt-0.5"
            >
              Dokumentasi Informasi Kegiatan & Proker Aktif
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onOpenTab('medinfo')}
            className="min-h-[38px] px-3.5 py-1.5 bg-blue-50 border border-blue-200 hover:bg-blue-100/70 text-[#1d4ed8] text-xs font-semibold rounded-xl transition-colors"
          >
            Kelola Konten Medinfo →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {adminDocs.map((doc) => (
            <figure
              key={doc.id}
              className="rounded-xl bg-white border border-slate-200/80 hover:border-slate-300 overflow-hidden flex flex-col justify-between transition-all"
            >
              <div>
                <div className="aspect-video w-full bg-slate-100 border-b border-slate-200/80 overflow-hidden group">
                  <img
                    src={doc.imageUrl}
                    alt={doc.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                  />
                </div>
                <figcaption className="p-4 space-y-1">
                  <span className="text-[11px] font-mono-code text-slate-500 block">
                    <strong className="text-[#1d4ed8]">
                      {doc.archiveCode}
                    </strong>{' '}
                    · {doc.date}
                  </span>
                  <h3 className="text-xs font-bold text-slate-900 leading-snug">
                    {doc.title}
                  </h3>
                  <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-2">
                    {doc.caption}
                  </p>
                </figcaption>
              </div>
              <div className="px-4 pb-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono-code text-slate-500 truncate">
                  PIC: {doc.photographer}
                </span>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setPreviewDoc(doc)}
                    className="min-h-[32px] px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 text-[11px] font-semibold rounded-lg inline-flex items-center gap-1 transition-colors"
                  >
                    <Maximize2
                      className="w-3 h-3 text-[#1d4ed8]"
                      aria-hidden="true"
                    />
                    <span>Detail</span>
                  </button>
                  {onDeleteDocumentationMedia && (
                    <button
                      type="button"
                      onClick={() =>
                        onDeleteDocumentationMedia(doc.id, doc.title)
                      }
                      aria-label={`Hapus media ${doc.title}`}
                      className="min-h-[32px] px-2.5 py-1 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 text-[11px] font-semibold rounded-lg inline-flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" aria-hidden="true" />
                      <span>Hapus</span>
                    </button>
                  )}
                </div>
              </div>
            </figure>
          ))}
        </div>
      </section>

      {/* Modal Pratinjau Dokumentasi di Dashboard Admin */}
      <AcademicModal
        isOpen={Boolean(previewDoc)}
        onClose={() => setPreviewDoc(null)}
        title={previewDoc?.title || 'Detail Dokumentasi Medinfo'}
        subtitle={
          previewDoc
            ? `${previewDoc.archiveCode} · ${previewDoc.division} · ${previewDoc.date}`
            : ''
        }
      >
        {previewDoc && (
          <div className="space-y-4 text-xs text-slate-600">
            <figure className="rounded-xl overflow-hidden border border-slate-200 bg-slate-900">
              <img
                src={previewDoc.imageUrl}
                alt={previewDoc.title}
                referrerPolicy="no-referrer"
                className="w-full h-auto object-contain"
              />
            </figure>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <p className="font-mono-code text-slate-900">
                <strong>Lokasi:</strong> {previewDoc.location} ·{' '}
                <strong>Dokumentator:</strong> {previewDoc.photographer}
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                {previewDoc.caption}
              </p>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="min-h-[40px] px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors"
              >
                Tutup Pratinjau
              </button>
            </div>
          </div>
        )}
      </AcademicModal>
    </div>
  );
}
