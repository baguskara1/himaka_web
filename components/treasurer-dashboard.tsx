'use client';

import { useState } from 'react';
import {
  Search,
  Download,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Eye,
  Check,
} from 'lucide-react';
import {
  Transaction,
  TransactionStatus,
  formatRupiah,
  generateTransactionsCsv,
} from '@/lib/ticketing-core';
import { TransactionStatusBadge, AcademicModal } from './ui-primitives';

interface TreasurerDashboardProps {
  transactions: Transaction[];
  onApprove: (txId: string) => void;
  onReject: (txId: string, reason: string) => void;
  onResetDemoData: () => void;
  onNotify: (msg: string, type?: 'success' | 'warning' | 'danger') => void;
}

export function TreasurerDashboard({
  transactions,
  onApprove,
  onReject,
  onResetDemoData,
  onNotify,
}: TreasurerDashboardProps) {
  const [statusFilter, setStatusFilter] = useState<'ALL' | TransactionStatus>(
    'ALL',
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [rejectionNote, setRejectionNote] = useState(
    'Nominal transfer belum menyertakan 3 digit kode unik atau foto struk buram.',
  );

  const [exportedCsvPreview, setExportedCsvPreview] = useState<{
    filename: string;
    rowCount: number;
    content: string;
  } | null>(null);

  const filteredTransactions = transactions.filter((tx) => {
    const matchesStatus = statusFilter === 'ALL' || tx.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      tx.id.toLowerCase().includes(q) ||
      tx.ticketCode.toLowerCase().includes(q) ||
      tx.participantName.toLowerCase().includes(q) ||
      tx.nim.toLowerCase().includes(q) ||
      tx.eventTitle.toLowerCase().includes(q) ||
      String(tx.totalAmount).includes(q);
    return matchesStatus && matchesSearch;
  });

  // Real metrics derived strictly from state
  const totalTxCount = transactions.length;
  const pendingCount = transactions.filter(
    (t) => t.status === 'PENDING',
  ).length;
  const lunasCount = transactions.filter((t) => t.status === 'LUNAS').length;
  const ditolakCount = transactions.filter(
    (t) => t.status === 'DITOLAK',
  ).length;
  const expiredCount = transactions.filter(
    (t) => t.status === 'EXPIRED',
  ).length;
  const verifiedRevenue = transactions
    .filter((t) => t.status === 'LUNAS')
    .reduce((sum, t) => sum + t.totalAmount, 0);
  const pendingRevenue = transactions
    .filter((t) => t.status === 'PENDING')
    .reduce((sum, t) => sum + t.totalAmount, 0);

  const handleExportCsv = () => {
    const listToExport = filteredTransactions;
    const csvContent = generateTransactionsCsv(listToExport);
    const suffix =
      statusFilter === 'ALL' ? 'semua' : statusFilter.toLowerCase();
    const filename = `transaksi_bendahara_himaka_${suffix}.csv`;

    const blob = new Blob([`\uFEFF${csvContent}`], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setExportedCsvPreview({
      filename,
      rowCount: listToExport.length,
      content: csvContent,
    });

    onNotify(
      `Berhasil mengunduh ${filename} (${listToExport.length} transaksi).`,
      'success',
    );
  };

  const handleOpenDetail = (tx: Transaction) => {
    setSelectedTx(tx);
    if (tx.rejectionReason) {
      setRejectionNote(tx.rejectionReason);
    } else {
      setRejectionNote(
        'Nominal transfer belum menyertakan 3 digit kode unik atau foto struk buram.',
      );
    }
  };

  const activeModalTx = selectedTx
    ? transactions.find((t) => t.id === selectedTx.id) || selectedTx
    : null;

  return (
    <section aria-labelledby="heading-bendahara" className="space-y-6">
      {/* Top Header & Operational Actions */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-level-1 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
          <div className="space-y-1">
            <span className="text-[11px] font-mono-code font-semibold uppercase tracking-widest text-[#1d4ed8]">
              LAYAR 6 · DASHBOARD BENDAHARA & VERIFIKASI PEMBAYARAN
            </span>
            <h1
              id="heading-bendahara"
              className="text-2xl font-bold text-slate-900 tracking-tight"
            >
              Rekonsiliasi & Verifikasi Transaksi Peserta
            </h1>
            <p className="text-sm text-slate-600">
              Periksa kecocokan 3 digit kode unik mutasi rekening, tinjau struk
              pembayaran, dan setujui atau tolak transaksi.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleExportCsv}
              disabled={filteredTransactions.length === 0}
              className="min-h-[42px] px-4 py-2 bg-[#1d4ed8] hover:bg-[#1e40af] disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-200 border border-[#1d4ed8] text-white text-xs font-semibold rounded-xl inline-flex items-center gap-2 transition-colors focus-academic whitespace-nowrap shadow-xs"
            >
              <Download className="w-4 h-4" aria-hidden="true" />
              <span>Download CSV ({filteredTransactions.length})</span>
            </button>

            <button
              type="button"
              onClick={onResetDemoData}
              className="min-h-[42px] px-4 py-2 bg-rose-50 border border-rose-200 hover:bg-rose-100/70 text-rose-700 text-xs font-semibold rounded-xl inline-flex items-center gap-2 transition-colors focus-academic whitespace-nowrap"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
              <span>Reset Data Demo</span>
            </button>
          </div>
        </div>

        {/* Summary Metric Strip (Derived strictly from real state) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 sm:p-5 rounded-xl bg-slate-50/80 border border-slate-200/80">
            <span className="text-xs text-slate-500 block">
              Dana Masuk Terverifikasi (Lunas)
            </span>
            <span className="mt-1.5 font-mono-code text-xl font-semibold text-emerald-700 block">
              {formatRupiah(verifiedRevenue)}
            </span>
            <span className="mt-1 text-xs text-slate-600 block font-mono-code">
              {lunasCount} transaksi lunas
            </span>
          </div>

          <div className="p-4 sm:p-5 rounded-xl bg-slate-50/80 border border-slate-200/80">
            <span className="text-xs text-slate-500 block">
              Menunggu Verifikasi (Pending)
            </span>
            <span className="mt-1.5 font-mono-code text-xl font-semibold text-amber-700 block">
              {pendingCount} Transaksi
            </span>
            <span className="mt-1 text-xs text-slate-600 block font-mono-code">
              Potensi: {formatRupiah(pendingRevenue)}
            </span>
          </div>

          <div className="p-4 sm:p-5 rounded-xl bg-slate-50/80 border border-slate-200/80">
            <span className="text-xs text-slate-500 block">
              Ditolak / Perlu Perbaikan Bukti
            </span>
            <span className="mt-1.5 font-mono-code text-xl font-semibold text-rose-700 block">
              {ditolakCount} Transaksi
            </span>
            <span className="mt-1 text-xs text-slate-600 block font-mono-code">
              Kuota otomatis dipulihkan
            </span>
          </div>

          <div className="p-4 sm:p-5 rounded-xl bg-slate-50/80 border border-slate-200/80">
            <span className="text-xs text-slate-500 block">
              Total Rekapitulasi Sistem
            </span>
            <span className="mt-1.5 font-mono-code text-xl font-semibold text-slate-900 block">
              {totalTxCount} Pendaftaran
            </span>
            <span className="mt-1 text-xs text-slate-600 block font-mono-code">
              Expired: {expiredCount}
            </span>
          </div>
        </div>

        {/* Search & Status Filters */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end pt-2">
          <div className="md:col-span-5">
            <label
              htmlFor="treasurer-search"
              className="block text-sm font-medium text-slate-900 mb-1.5"
            >
              Cari ID Transaksi, Kode Tiket, Nama, NIM, atau Nominal Unik
            </label>
            <div className="relative">
              <Search
                className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="treasurer-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ketik 150102, Bagas, atau TRX-2025-0102..."
                className="w-full min-h-[44px] pl-10 pr-4 py-2 bg-slate-50/70 focus:bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus-academic transition-colors"
              />
            </div>
          </div>

          <div className="md:col-span-7">
            <span className="block text-sm font-medium text-slate-900 mb-1.5">
              Filter Status Verifikasi
            </span>
            <div className="flex flex-wrap gap-1.5" role="tablist">
              {(
                [
                  { id: 'ALL', label: `Semua (${totalTxCount})` },
                  { id: 'PENDING', label: `Pending (${pendingCount})` },
                  { id: 'LUNAS', label: `Lunas (${lunasCount})` },
                  { id: 'DITOLAK', label: `Ditolak (${ditolakCount})` },
                  { id: 'EXPIRED', label: `Expired (${expiredCount})` },
                ] as { id: 'ALL' | TransactionStatus; label: string }[]
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

      {/* Exported CSV Output Preview Panel */}
      {exportedCsvPreview && (
        <div
          role="region"
          aria-label="Pratinjau file CSV yang diunduh"
          className="bg-white border border-emerald-300 rounded-2xl p-5 sm:p-6 shadow-level-1 space-y-3"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200/80">
            <div className="flex items-center gap-2 text-xs">
              <CheckCircle2
                className="w-4 h-4 text-emerald-700 shrink-0"
                aria-hidden="true"
              />
              <span className="font-semibold text-slate-900">
                File CSV Berhasil Diekspor:
              </span>
              <code className="font-mono-code font-semibold text-emerald-700">
                {exportedCsvPreview.filename}
              </code>
              <span className="text-slate-500 font-mono-code">
                ({exportedCsvPreview.rowCount} baris transaksi)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (typeof navigator !== 'undefined' && navigator.clipboard) {
                    navigator.clipboard
                      .writeText(exportedCsvPreview.content)
                      .catch(() => {});
                  }
                  onNotify('Isi CSV berhasil disalin ke clipboard.', 'success');
                }}
                className="min-h-[36px] px-3 py-1 bg-slate-100 border border-slate-200 hover:bg-slate-200/70 text-slate-900 text-xs font-semibold rounded-xl transition-colors focus-academic"
              >
                Salin Teks CSV
              </button>
              <button
                type="button"
                onClick={() => setExportedCsvPreview(null)}
                className="min-h-[36px] px-3 py-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold rounded-xl transition-colors focus-academic"
              >
                Tutup Pratinjau
              </button>
            </div>
          </div>
          <pre className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 font-mono-code text-[11px] text-slate-900 overflow-x-auto max-h-44 leading-relaxed">
            {exportedCsvPreview.content}
          </pre>
        </div>
      )}

      {/* Empty State */}
      {filteredTransactions.length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-8 text-center shadow-level-1 space-y-3">
          <p className="text-base font-semibold text-slate-900">
            Tidak Ada Data Transaksi pada Filter Ini
          </p>
          <p className="text-sm text-slate-600">
            Ubah kata kunci pencarian atau tampilkan seluruh status transaksi
            untuk melanjutkan pemeriksaan.
          </p>
          <button
            type="button"
            onClick={() => {
              setStatusFilter('ALL');
              setSearchQuery('');
            }}
            className="min-h-[42px] px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            Reset Filter Tabel
          </button>
        </div>
      ) : (
        <>
          {/* DESKTOP VIEW (>768px): Tabular Data Structure */}
          <div className="hidden md:block bg-white border border-slate-200/80 rounded-2xl shadow-level-1 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/90 border-b border-slate-200/80 text-xs font-semibold text-slate-900">
                    <th className="py-3.5 px-4 whitespace-nowrap">
                      ID & Kode Tiket
                    </th>
                    <th className="py-3.5 px-4">Peserta / Tim</th>
                    <th className="py-3.5 px-4">Acara, Tier & Struk</th>
                    <th className="py-3.5 px-4 text-right whitespace-nowrap">
                      Total (+Unik)
                    </th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right whitespace-nowrap">
                      Aksi Verifikasi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/80 text-xs">
                  {filteredTransactions.map((tx) => (
                    <tr
                      key={tx.id}
                      className="hover:bg-slate-50/70 transition-colors align-top"
                    >
                      <td className="py-3.5 px-4 font-mono-code whitespace-nowrap">
                        <span className="font-semibold text-slate-900 block">
                          {tx.id}
                        </span>
                        <span className="text-[#1d4ed8] font-semibold block mt-0.5">
                          {tx.ticketCode}
                        </span>
                        <span className="text-[11px] text-slate-500 block mt-0.5">
                          {tx.createdAt}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-900 block text-sm">
                          {tx.participantName}
                        </span>
                        <span className="font-mono-code text-slate-600 block">
                          NIM: {tx.nim} · {tx.faculty}
                        </span>
                        {tx.mode === 'tim' && (
                          <span className="text-[#1d4ed8] font-medium block mt-0.5">
                            Tim: {tx.teamName} ({tx.teamMembers?.length || 0}{' '}
                            org)
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 max-w-[260px]">
                        <span className="font-semibold text-slate-900 block truncate">
                          {tx.eventTitle}
                        </span>
                        <span className="text-slate-600 block truncate mt-0.5">
                          {tx.tierName}
                        </span>
                        {tx.proofFileName ? (
                          <span className="font-mono-code text-[11px] text-emerald-700 block truncate mt-0.5">
                            Struk: {tx.proofFileName} ({tx.proofSenderBank})
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic block mt-0.5">
                            Belum unggah struk
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono-code whitespace-nowrap">
                        <span className="text-sm font-semibold text-slate-900 block">
                          {formatRupiah(tx.totalAmount)}
                        </span>
                        <span className="text-[11px] text-slate-500 block">
                          Kode unik: #{tx.uniqueCode}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <TransactionStatusBadge status={tx.status} compact />
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenDetail(tx)}
                            className="min-h-[36px] px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 font-semibold rounded-lg inline-flex items-center gap-1 transition-colors focus-academic"
                          >
                            <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Detail</span>
                          </button>

                          {tx.status !== 'LUNAS' && (
                            <button
                              type="button"
                              onClick={() => onApprove(tx.id)}
                              aria-label={`Setujui transaksi ${tx.id}`}
                              className="min-h-[36px] px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg inline-flex items-center gap-1 transition-colors focus-academic shadow-xs"
                            >
                              <Check
                                className="w-3.5 h-3.5"
                                aria-hidden="true"
                              />
                              <span>Approve</span>
                            </button>
                          )}

                          {tx.status !== 'DITOLAK' && (
                            <button
                              type="button"
                              onClick={() => handleOpenDetail(tx)}
                              aria-label={`Tolak transaksi ${tx.id}`}
                              className="min-h-[36px] px-2.5 py-1 bg-rose-50 border border-rose-200 hover:bg-rose-100/70 text-rose-700 font-semibold rounded-lg inline-flex items-center gap-1 transition-colors focus-academic"
                            >
                              <XCircle
                                className="w-3.5 h-3.5"
                                aria-hidden="true"
                              />
                              <span>Reject</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* MOBILE VIEW (<=768px): Discrete Stacked Summary Cards */}
          <div className="md:hidden space-y-3">
            {filteredTransactions.map((tx) => (
              <article
                key={tx.id}
                className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-level-1 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono-code text-xs font-semibold text-slate-500 block">
                      {tx.id} · {tx.ticketCode}
                    </span>
                    <h2 className="text-base font-bold text-slate-900">
                      {tx.participantName}
                    </h2>
                    <span className="font-mono-code text-xs text-slate-600">
                      NIM: {tx.nim}
                    </span>
                  </div>
                  <TransactionStatusBadge status={tx.status} />
                </div>

                <div className="text-xs text-slate-600 space-y-1 pt-2 border-t border-slate-200/70">
                  <p className="font-semibold text-slate-900">
                    {tx.eventTitle}
                  </p>
                  <p>Tier: {tx.tierName}</p>
                  <p className="font-mono-code">
                    Struk: {tx.proofFileName || 'Belum diunggah'}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-500 block">
                      Nominal (+Kode #{tx.uniqueCode})
                    </span>
                    <span className="font-mono-code text-base font-semibold text-slate-900">
                      {formatRupiah(tx.totalAmount)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleOpenDetail(tx)}
                    className="min-h-[42px] px-3 py-2 bg-white border border-slate-200 text-slate-900 text-xs font-semibold rounded-xl inline-flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-4 h-4" aria-hidden="true" />
                    <span>Periksa Detail</span>
                  </button>

                  {tx.status !== 'LUNAS' ? (
                    <button
                      type="button"
                      onClick={() => onApprove(tx.id)}
                      className="min-h-[42px] px-3 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl inline-flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-4 h-4" aria-hidden="true" />
                      <span>Approve Lunas</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleOpenDetail(tx)}
                      className="min-h-[42px] px-3 py-2 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl inline-flex items-center justify-center gap-1.5"
                    >
                      <XCircle className="w-4 h-4" aria-hidden="true" />
                      <span>Ubah / Reject</span>
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </>
      )}

      {/* Detail & Approve/Reject Modal */}
      <AcademicModal
        isOpen={Boolean(activeModalTx)}
        onClose={() => setSelectedTx(null)}
        title={`Detail Verifikasi Transaksi ${activeModalTx?.id || ''}`}
        subtitle={`Kode Tiket: ${activeModalTx?.ticketCode || ''} · Dibuat: ${
          activeModalTx?.createdAt || ''
        }`}
      >
        {activeModalTx && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3.5 border-b border-slate-200/80">
              <div>
                <span className="text-xs text-slate-500 block">
                  Status Saat Ini
                </span>
                <div className="mt-1">
                  <TransactionStatusBadge status={activeModalTx.status} />
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-500 block">
                  Nominal Harus Diterima
                </span>
                <span className="font-mono-code text-xl font-semibold text-[#1d4ed8]">
                  {formatRupiah(activeModalTx.totalAmount)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <span className="font-semibold text-slate-900 block">
                  Identitas Peserta
                </span>
                <p>
                  Nama: <strong>{activeModalTx.participantName}</strong>
                </p>
                <p className="font-mono-code">NIM: {activeModalTx.nim}</p>
                <p>Prodi: {activeModalTx.faculty}</p>
                <p className="font-mono-code">WA: {activeModalTx.whatsapp}</p>
                <p>{activeModalTx.email}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <span className="font-semibold text-slate-900 block">
                  Rincian Acara & Kode Unik
                </span>
                <p className="font-medium text-slate-900">
                  {activeModalTx.eventTitle}
                </p>
                <p>Tier: {activeModalTx.tierName}</p>
                <p className="font-mono-code">
                  Harga Dasar: {formatRupiah(activeModalTx.basePrice)}
                </p>
                <p className="font-mono-code text-[#1d4ed8] font-semibold">
                  Kode Unik: +Rp {activeModalTx.uniqueCode}
                </p>
              </div>
            </div>

            {/* Simulated Payment Receipt Preview Card */}
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200/80 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">
                  Lampiran Bukti Pembayaran (Struk Simulasi)
                </span>
                <span className="font-mono-code text-slate-500">
                  {activeModalTx.proofUploadedAt || 'Belum diunggah'}
                </span>
              </div>

              {activeModalTx.proofFileName ? (
                <div className="p-3.5 bg-white border border-slate-200/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className="font-mono-code font-semibold text-slate-900 block">
                      {activeModalTx.proofFileName}
                    </span>
                    <span className="text-slate-600 block">
                      Pengirim:{' '}
                      {activeModalTx.proofSenderName ||
                        activeModalTx.participantName}{' '}
                      ({activeModalTx.proofSenderBank || 'Transfer Bank'})
                    </span>
                  </div>
                  <span className="font-mono-code font-semibold text-emerald-700">
                    Mutasi: {formatRupiah(activeModalTx.totalAmount)}
                  </span>
                </div>
              ) : (
                <p className="text-amber-800">
                  Peserta belum mengunggah file struk pembayaran untuk transaksi
                  ini.
                </p>
              )}
            </div>

            {/* Rejection Reason Input */}
            <div>
              <label
                htmlFor="modal-reject-reason"
                className="block text-sm font-medium text-slate-900 mb-1.5"
              >
                Catatan / Alasan Penolakan (Diisi bila memilih Reject)
              </label>
              <input
                id="modal-reject-reason"
                type="text"
                value={rejectionNote}
                onChange={(e) => setRejectionNote(e.target.value)}
                className="w-full min-h-[44px] px-3.5 py-2 bg-slate-50/70 focus:bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus-academic transition-colors"
              />
            </div>

            {/* Approve / Reject Footer Actions */}
            <div className="pt-3.5 border-t border-slate-200/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => {
                  onReject(activeModalTx.id, rejectionNote);
                  setSelectedTx(null);
                }}
                className="min-h-[42px] px-4 py-2 bg-rose-50 border border-rose-200 hover:bg-rose-100/70 text-rose-700 text-xs font-semibold rounded-xl inline-flex items-center justify-center gap-2 transition-colors focus-academic"
              >
                <XCircle className="w-4 h-4" aria-hidden="true" />
                <span>Tolak Transaksi (Reject)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onApprove(activeModalTx.id);
                  setSelectedTx(null);
                }}
                className="min-h-[42px] px-5 py-2 bg-[#1d4ed8] hover:bg-[#1e40af] text-white text-xs font-semibold rounded-xl inline-flex items-center justify-center gap-2 transition-colors focus-academic shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                <span>Setujui & Terbitkan E-Ticket (Approve)</span>
              </button>
            </div>
          </div>
        )}
      </AcademicModal>
    </section>
  );
}
