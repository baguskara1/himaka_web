'use client';

import { useState } from 'react';
import { ArrowRight, Search, Upload } from 'lucide-react';
import {
  AcademicEvent,
  HimakaCabinetPeriod,
  Transaction,
  TransactionStatus,
  formatRupiah,
  getCertificateForTransaction,
  isTicketMarkedHadir,
  triggerCertificatePdfDownload,
} from '@/lib/ticketing-core';
import {
  CertificateModal,
  PerforatedTicketCard,
  TransactionStatusBadge,
} from './ui-primitives';

interface MyTicketsViewProps {
  transactions: Transaction[];
  events?: AcademicEvent[];
  activeCabinet?: HimakaCabinetPeriod;
  highlightedTxId?: string | null;
  onOpenPaymentUpload: (tx: Transaction) => void;
  onGoToCatalog: () => void;
  onSimulateScanInGate: (ticketCode: string) => void;
  onMarkTicketHadir?: (txId: string) => void;
  onNotify: (msg: string, type?: 'success' | 'warning' | 'danger') => void;
}

export function MyTicketsView({
  transactions,
  events,
  activeCabinet,
  highlightedTxId,
  onOpenPaymentUpload,
  onGoToCatalog,
  onSimulateScanInGate,
  onMarkTicketHadir,
  onNotify,
}: MyTicketsViewProps) {
  const [statusFilter, setStatusFilter] = useState<
    'ALL' | 'HADIR' | TransactionStatus
  >('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [selectedCertTx, setSelectedCertTx] = useState<Transaction | null>(
    null,
  );

  const filtered = transactions.filter((tx) => {
    const matchesStatus =
      statusFilter === 'ALL'
        ? true
        : statusFilter === 'HADIR'
          ? isTicketMarkedHadir(tx)
          : tx.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      tx.ticketCode.toLowerCase().includes(q) ||
      tx.id.toLowerCase().includes(q) ||
      tx.participantName.toLowerCase().includes(q) ||
      tx.nim.toLowerCase().includes(q) ||
      tx.eventTitle.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const handleCopyCode = (code: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code).catch(() => {});
    }
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
    onNotify(`Kode tiket ${code} berhasil disalin.`, 'success');
  };

  const handleDownloadCertificate = (ticketTx: Transaction) => {
    const cert = getCertificateForTransaction(ticketTx, events, activeCabinet);
    if (!cert) return;
    const filename = triggerCertificatePdfDownload(cert);
    setSelectedCertTx(ticketTx);
    onNotify(
      `E-Certificate PDF (${filename}) berhasil diunduh untuk ${ticketTx.participantName}.`,
      'success',
    );
  };

  const counts = {
    ALL: transactions.length,
    HADIR: transactions.filter((t) => isTicketMarkedHadir(t)).length,
    LUNAS: transactions.filter((t) => t.status === 'LUNAS').length,
    PENDING: transactions.filter((t) => t.status === 'PENDING').length,
    DITOLAK: transactions.filter((t) => t.status === 'DITOLAK').length,
    EXPIRED: transactions.filter((t) => t.status === 'EXPIRED').length,
  };

  const activeCertificate = selectedCertTx
    ? getCertificateForTransaction(selectedCertTx, events, activeCabinet)
    : null;

  return (
    <section aria-labelledby="heading-tiketku" className="space-y-6">
      {/* Header & Filter Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-level-1 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
          <div className="space-y-1">
            <span className="text-[11px] font-mono-code font-semibold uppercase tracking-widest text-[#1d4ed8]">
              LAYAR 5 · STATUS TRANSAKSI & E-TICKET QR
            </span>
            <h1
              id="heading-tiketku"
              className="text-2xl font-bold text-slate-900 tracking-tight"
            >
              Tiketku & Riwayat Pendaftaran Peserta
            </h1>
            <p className="text-sm text-slate-600">
              Pantau status verifikasi pembayaran Bendahara dan buka E-Ticket QR
              untuk pemindaian di pintu acara.
            </p>
          </div>

          <button
            type="button"
            onClick={onGoToCatalog}
            className="min-h-[42px] px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl inline-flex items-center justify-center gap-2 transition-colors focus-academic self-start lg:self-auto whitespace-nowrap shadow-xs"
          >
            <span>Daftar Acara Lain</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-5">
            <label
              htmlFor="search-my-tickets"
              className="block text-sm font-medium text-slate-900 mb-1.5"
            >
              Cari Kode Tiket, ID Transaksi, NIM, atau Nama
            </label>
            <div className="relative">
              <Search
                className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="search-my-tickets"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Contoh: HMK-2025-A01 atau 220710142"
                className="w-full min-h-[44px] pl-10 pr-4 py-2 bg-slate-50/70 focus:bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus-academic transition-colors"
              />
            </div>
          </div>

          <div className="md:col-span-7">
            <span className="block text-sm font-medium text-slate-900 mb-1.5">
              Filter Status Transaksi
            </span>
            <div
              className="flex flex-wrap gap-1.5"
              role="tablist"
              aria-label="Filter status tiket"
            >
              {(
                [
                  { id: 'ALL', label: `Semua (${counts.ALL})` },
                  { id: 'HADIR', label: `Hadir (${counts.HADIR})` },
                  { id: 'LUNAS', label: `Lunas (${counts.LUNAS})` },
                  { id: 'PENDING', label: `Pending (${counts.PENDING})` },
                  { id: 'DITOLAK', label: `Ditolak (${counts.DITOLAK})` },
                  { id: 'EXPIRED', label: `Expired (${counts.EXPIRED})` },
                ] as {
                  id: 'ALL' | 'HADIR' | TransactionStatus;
                  label: string;
                }[]
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={statusFilter === tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`min-h-[42px] px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all whitespace-nowrap focus-academic ${
                    statusFilter === tab.id
                      ? 'bg-[#1d4ed8] text-white border-[#1d4ed8] shadow-xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Ticket & Transaction Cards List */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-8 text-center shadow-level-1 space-y-3">
          <p className="text-base font-semibold text-slate-900">
            Tidak Ada Transaksi atau Tiket Ditemukan
          </p>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Belum ada data transaksi dengan filter yang dipilih. Anda dapat
            mereset pencarian atau mendaftar kegiatan baru pada Katalog Acara.
          </p>
          <div className="flex justify-center gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => {
                setStatusFilter('ALL');
                setSearchQuery('');
              }}
              className="min-h-[42px] px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 text-xs font-semibold rounded-xl transition-colors"
            >
              Tampilkan Semua Status
            </button>
            <button
              type="button"
              onClick={onGoToCatalog}
              className="min-h-[42px] px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors"
            >
              Buka Katalog Acara
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {filtered.map((tx) => {
            const isHighlighted = highlightedTxId === tx.id;

            // Render Perforated Digital E-Ticket Card for LUNAS transactions
            if (tx.status === 'LUNAS') {
              return (
                <div
                  key={tx.id}
                  className={
                    isHighlighted ? 'ring-2 ring-[#1d4ed8] rounded-2xl' : ''
                  }
                >
                  <PerforatedTicketCard
                    transaction={tx}
                    onCopyCode={handleCopyCode}
                    copiedCode={copiedCode}
                    onSimulateScan={onSimulateScanInGate}
                    onMarkHadir={onMarkTicketHadir}
                    onDownloadCertificate={handleDownloadCertificate}
                    onOpenCertificate={(ticketTx) =>
                      setSelectedCertTx(ticketTx)
                    }
                  />
                </div>
              );
            }

            // Render Non-Lunas Transaction Status Card (PENDING, DITOLAK, EXPIRED)
            return (
              <article
                key={tx.id}
                className={`bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-level-1 space-y-4 ${
                  isHighlighted ? 'ring-2 ring-[#1d4ed8]' : ''
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3.5 border-b border-slate-200/80">
                  <div className="flex items-center gap-2 text-xs font-mono-code text-slate-500">
                    <span className="font-semibold text-slate-900">
                      {tx.id}
                    </span>
                    <span aria-hidden="true" className="text-slate-300">
                      ·
                    </span>
                    <span>KODE: {tx.ticketCode}</span>
                    <span aria-hidden="true" className="text-slate-300">
                      ·
                    </span>
                    <span>DIBUAT: {tx.createdAt}</span>
                  </div>
                  <TransactionStatusBadge status={tx.status} />
                </div>

                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <h2 className="text-lg font-bold text-slate-900">
                      {tx.eventTitle}
                    </h2>
                    <p className="text-xs font-semibold text-[#1d4ed8]">
                      Tier: {tx.tierName} (
                      {tx.mode === 'tim'
                        ? `Delegasi Tim: ${tx.teamName}`
                        : 'Peserta Individu'}
                      )
                    </p>
                    <p className="text-xs text-slate-600">
                      Peserta:{' '}
                      <strong className="text-slate-900">
                        {tx.participantName}
                      </strong>{' '}
                      (NIM: <span className="font-mono-code">{tx.nim}</span> ·{' '}
                      {tx.faculty})
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-3 text-left lg:text-right shrink-0">
                    <span className="block text-xs text-slate-500">
                      Total Tagihan (+Kode Unik #{tx.uniqueCode})
                    </span>
                    <span className="font-mono-code text-lg font-semibold text-slate-900">
                      {formatRupiah(tx.totalAmount)}
                    </span>
                  </div>
                </div>

                {/* Status-Specific Contextual Callout Box */}
                {tx.status === 'PENDING' && (
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <span className="font-semibold block">
                        Menunggu Verifikasi Bendahara HIMAKA
                      </span>
                      <p className="text-amber-800/90 leading-relaxed">
                        {tx.proofFileName
                          ? `Bukti transfer (${tx.proofFileName}) telah diterima pada ${tx.proofUploadedAt}. E-Ticket QR akan otomatis terbuka segera setelah disetujui Bendahara.`
                          : 'Anda belum mengunggah bukti pembayaran. Segera unggah struk transfer sebelum batas waktu berakhir.'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onOpenPaymentUpload(tx)}
                      className="min-h-[42px] px-4 py-2 bg-white border border-amber-300 text-amber-900 hover:bg-amber-100/50 text-xs font-semibold rounded-xl inline-flex items-center justify-center gap-2 shrink-0 transition-colors"
                    >
                      <Upload className="w-4 h-4" aria-hidden="true" />
                      <span>
                        {tx.proofFileName
                          ? 'Perbarui Bukti Transfer'
                          : 'Unggah Bukti Transfer'}
                      </span>
                    </button>
                  </div>
                )}

                {tx.status === 'DITOLAK' && (
                  <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <span className="font-semibold block">
                        Alasan Penolakan Bendahara ({tx.verifiedAt || '-'}):
                      </span>
                      <p className="text-rose-800/90 leading-relaxed">
                        {tx.rejectionReason ||
                          'Bukti pembayaran tidak terbaca atau nominal tidak sesuai kode unik.'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onOpenPaymentUpload(tx)}
                      className="min-h-[42px] px-4 py-2 bg-white border border-rose-300 text-rose-800 hover:bg-rose-100/50 text-xs font-semibold rounded-xl inline-flex items-center justify-center gap-2 shrink-0 transition-colors"
                    >
                      <Upload className="w-4 h-4" aria-hidden="true" />
                      <span>Unggah Ulang Bukti Valid</span>
                    </button>
                  </div>
                )}

                {tx.status === 'EXPIRED' && (
                  <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <span className="font-semibold text-slate-900 block">
                        Batas Waktu Pembayaran Berakhir ({tx.expiresAt})
                      </span>
                      <p className="leading-relaxed">
                        Transaksi ini telah kedaluwarsa secara otomatis dan
                        kuota kursi dikembalikan ke katalog. Silakan buat
                        pendaftaran baru bila kuota masih tersedia.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={onGoToCatalog}
                      className="min-h-[42px] px-4 py-2 bg-white border border-slate-300 text-slate-900 hover:bg-slate-50 text-xs font-semibold rounded-xl shrink-0 transition-colors"
                    >
                      Daftar Ulang di Katalog
                    </button>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      <CertificateModal
        certificate={activeCertificate}
        onClose={() => setSelectedCertTx(null)}
        onNotify={onNotify}
      />
    </section>
  );
}
