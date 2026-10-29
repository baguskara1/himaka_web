'use client';

import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  Award,
  CheckCircle2,
  QrCode,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import {
  AcademicEvent,
  HimakaCabinetPeriod,
  ScanDecision,
  ScanLogEntry,
  Transaction,
  getCertificateForTransaction,
  isTransactionEligibleForCertificate,
} from '@/lib/ticketing-core';
import { CertificateModal, ScanDecisionBadge } from './ui-primitives';

interface GateScannerViewProps {
  transactions: Transaction[];
  scanLogs: ScanLogEntry[];
  events?: AcademicEvent[];
  activeCabinet?: HimakaCabinetPeriod;
  initialCode?: string;
  onScanCode: (code: string) => {
    result: ScanLogEntry;
    matchedTransaction?: Transaction;
  };
  onNotify?: (msg: string, type?: 'success' | 'warning' | 'danger') => void;
}

export function GateScannerView({
  transactions,
  scanLogs,
  events,
  activeCabinet,
  initialCode,
  onScanCode,
  onNotify,
}: GateScannerViewProps) {
  const [inputCode, setInputCode] = useState(initialCode || 'HMK-2025-A01');
  const [latestScan, setLatestScan] = useState<{
    result: ScanLogEntry;
    matchedTransaction?: Transaction;
  } | null>(null);
  const [selectedCertTx, setSelectedCertTx] = useState<Transaction | null>(
    null,
  );

  useEffect(() => {
    if (initialCode) {
      setInputCode(initialCode);
    }
  }, [initialCode]);

  const handleTriggerScan = (codeToScan: string) => {
    setInputCode(codeToScan);
    const outcome = onScanCode(codeToScan);
    setLatestScan(outcome);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    handleTriggerScan(inputCode);
  };

  // Find candidate tickets for 1-click demonstration
  const unscannedLunasTx =
    transactions.find((t) => t.status === 'LUNAS' && !t.scannedAt) ||
    transactions.find((t) => t.status === 'LUNAS');
  const alreadyScannedTx =
    transactions.find((t) => t.status === 'LUNAS' && Boolean(t.scannedAt)) ||
    transactions.find((t) => t.ticketCode === 'HMK-2025-C03');
  const invalidPendingTx =
    transactions.find((t) => t.status !== 'LUNAS') || transactions[1];

  const activeResult = latestScan?.result || scanLogs[0] || null;
  const activeMatchedTx =
    latestScan?.matchedTransaction ||
    (activeResult
      ? transactions.find(
          (t) =>
            t.ticketCode.toUpperCase() ===
              activeResult.inputCode.toUpperCase() ||
            t.id.toUpperCase() === activeResult.inputCode.toUpperCase(),
        )
      : undefined);

  const activeCert = selectedCertTx
    ? getCertificateForTransaction(selectedCertTx, events, activeCabinet)
    : null;

  const getResultBoxStyle = (decision: ScanDecision) => {
    switch (decision) {
      case 'BOLEH MASUK':
        return {
          container: 'bg-emerald-50/90 border-emerald-300 text-emerald-900',
          badgeBg: 'bg-emerald-600 text-white',
          icon: <CheckCircle2 className="w-8 h-8 text-emerald-700 shrink-0" />,
        };
      case 'SUDAH PERNAH SCAN':
        return {
          container: 'bg-amber-50/90 border-amber-300 text-amber-900',
          badgeBg: 'bg-amber-600 text-white',
          icon: <AlertTriangle className="w-8 h-8 text-amber-700 shrink-0" />,
        };
      case 'TIKET TIDAK VALID':
        return {
          container: 'bg-rose-50/90 border-rose-300 text-rose-900',
          badgeBg: 'bg-rose-600 text-white',
          icon: <XCircle className="w-8 h-8 text-rose-700 shrink-0" />,
        };
    }
  };

  return (
    <section aria-labelledby="heading-scanner" className="space-y-6">
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-level-1 space-y-6">
        <div className="border-b border-slate-200/80 pb-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-mono-code font-semibold uppercase tracking-widest text-[#1d4ed8]">
              LAYAR 7 · VALIDASI PINTU & ANTI-PASSBACK SCANNER
            </span>
            <h1
              id="heading-scanner"
              className="text-2xl font-bold text-slate-900 tracking-tight"
            >
              Terminal Pemeriksaan Kode E-Ticket (Panitia Pintu)
            </h1>
            <p className="text-sm text-slate-600">
              Masukkan kode tiket atau pilih sampel uji untuk memvalidasi status
              pembayaran, aturan anti-passback satu kali masuk, dan penerbitan
              E-Sertifikat otomatis.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono-code text-xs text-slate-900 bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl shrink-0">
            <ShieldCheck
              className="w-4 h-4 text-[#1d4ed8]"
              aria-hidden="true"
            />
            <span>TOTAL RIWAYAT SCAN: {scanLogs.length}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Scanner Input & Quick Simulation Buttons */}
          <div className="lg:col-span-5 space-y-5">
            {/* Simulated Optical Scanner Reticle Card */}
            <div className="p-6 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex flex-col items-center text-center space-y-3">
              <div className="w-20 h-20 rounded-2xl border border-blue-200 bg-white flex items-center justify-center shadow-level-1">
                <QrCode className="w-9 h-9 text-slate-900" aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <span className="font-mono-code text-[11px] font-semibold uppercase tracking-widest text-[#1d4ed8] block">
                  OPTICAL RETICLE SIMULATOR
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Tanpa kamera fisik: Ketik kode serial tiket di bawah atau
                  tekan tombol skenario uji cepat.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-3">
              <div>
                <label
                  htmlFor="scanner-code-input"
                  className="block text-sm font-medium text-slate-900 mb-1.5"
                >
                  Kode Tiket / ID Transaksi
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    id="scanner-code-input"
                    type="text"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    placeholder="Contoh: HMK-2025-A01"
                    className="flex-1 min-w-0 w-full min-h-[44px] px-3.5 py-2 bg-slate-50/70 focus:bg-white border border-slate-200 rounded-xl font-mono-code text-sm font-semibold text-slate-900 uppercase focus-academic transition-colors"
                  />
                  <button
                    type="submit"
                    className="min-h-[44px] px-5 py-2 bg-[#1d4ed8] hover:bg-[#1e40af] text-white text-xs font-semibold rounded-xl transition-colors focus-academic whitespace-nowrap shrink-0 shadow-xs"
                  >
                    Periksa Tiket
                  </button>
                </div>
              </div>
            </form>

            {/* Quick-Test Scenarios for the 3 Mandatory Scan Decisions */}
            <div className="pt-4 border-t border-slate-200/80 space-y-2.5">
              <span className="block text-xs font-semibold text-slate-900">
                Uji Cepat 3 Keputusan Scanner (Klik untuk Simulasi):
              </span>

              <div className="grid grid-cols-1 gap-2.5">
                {unscannedLunasTx && (
                  <button
                    type="button"
                    onClick={() =>
                      handleTriggerScan(unscannedLunasTx.ticketCode)
                    }
                    className="min-h-[44px] px-3.5 py-2.5 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100/70 text-emerald-800 rounded-xl text-xs font-semibold flex items-center justify-between gap-2 transition-colors text-left focus-academic"
                  >
                    <span>
                      1. Uji Valid (Lunas):{' '}
                      <strong className="font-mono-code">
                        {unscannedLunasTx.ticketCode}
                      </strong>{' '}
                      ({unscannedLunasTx.participantName})
                    </span>
                    <span className="font-mono-code shrink-0">
                      → BOLEH MASUK
                    </span>
                  </button>
                )}

                {alreadyScannedTx && (
                  <button
                    type="button"
                    onClick={() =>
                      handleTriggerScan(alreadyScannedTx.ticketCode)
                    }
                    className="min-h-[44px] px-3.5 py-2.5 bg-amber-50 border border-amber-200 hover:bg-amber-100/70 text-amber-800 rounded-xl text-xs font-semibold flex items-center justify-between gap-2 transition-colors text-left focus-academic"
                  >
                    <span>
                      2. Uji Scan Ulang:{' '}
                      <strong className="font-mono-code">
                        {alreadyScannedTx.ticketCode}
                      </strong>{' '}
                      (Sudah Scan)
                    </span>
                    <span className="font-mono-code shrink-0">
                      → SUDAH PERNAH SCAN
                    </span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() =>
                    handleTriggerScan(
                      invalidPendingTx?.ticketCode || 'HMK-2025-B02',
                    )
                  }
                  className="min-h-[44px] px-3.5 py-2.5 bg-rose-50 border border-rose-200 hover:bg-rose-100/70 text-rose-800 rounded-xl text-xs font-semibold flex items-center justify-between gap-2 transition-colors text-left focus-academic"
                >
                  <span>
                    3. Uji Belum Lunas / Asing:{' '}
                    <strong className="font-mono-code">
                      {invalidPendingTx?.ticketCode || 'HMK-2025-B02'}
                    </strong>
                  </span>
                  <span className="font-mono-code shrink-0">
                    → TIKET TIDAK VALID
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Prominent Decision Display Banner */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-sm font-bold text-slate-900">
              Hasil Keputusan Verifikasi Pintu
            </h2>

            {activeResult ? (
              <div
                role="region"
                aria-live="polite"
                aria-label="Keputusan pemindaian tiket"
                className={`p-6 rounded-2xl border ${
                  getResultBoxStyle(activeResult.decision).container
                } space-y-4`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-current/15">
                  <div className="flex items-center gap-3">
                    {getResultBoxStyle(activeResult.decision).icon}
                    <div>
                      <span className="text-xs font-mono-code uppercase opacity-80 block">
                        KEPUTUSAN GATE SCANNER · {activeResult.timestamp}
                      </span>
                      <div className="text-2xl sm:text-3xl font-bold tracking-tight font-mono-code">
                        {activeResult.decision}
                      </div>
                    </div>
                  </div>

                  <ScanDecisionBadge decision={activeResult.decision} />
                </div>

                <p className="text-sm font-medium leading-relaxed">
                  {activeResult.reason}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3.5 rounded-xl bg-white/90 border border-slate-200/80 text-slate-900">
                    <span className="text-slate-500 block">
                      Kode Tiket yang Dipindai
                    </span>
                    <span className="font-mono-code text-base font-semibold">
                      {activeResult.inputCode}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/90 border border-slate-200/80 text-slate-900">
                    <span className="text-slate-500 block">Nama Peserta</span>
                    <span className="text-sm font-semibold">
                      {activeResult.participantName || 'Tidak Terdaftar'}
                    </span>
                  </div>

                  {activeResult.eventTitle && (
                    <div className="sm:col-span-2 p-3.5 rounded-xl bg-white/90 border border-slate-200/80 text-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-slate-500 block">
                          Acara & Kategori Tier
                        </span>
                        <span className="font-semibold">
                          {activeResult.eventTitle} — {activeResult.tierName}
                        </span>
                      </div>
                      {activeResult.firstScannedAt && (
                        <span className="font-mono-code text-xs text-slate-600">
                          Scan Pertama: {activeResult.firstScannedAt}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {activeMatchedTx &&
                  isTransactionEligibleForCertificate(activeMatchedTx) && (
                    <div className="p-4 rounded-xl bg-white border border-emerald-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-emerald-900 block">
                          E-Sertifikat Kehadiran Peserta Telah Terbit Otomatis
                        </span>
                        <span className="text-xs text-slate-600 block">
                          Peserta ({activeMatchedTx.participantName}) kini dapat
                          mengunduh atau mencetak E-Sertifikat resmi.
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedCertTx(activeMatchedTx)}
                        className="min-h-[40px] px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl inline-flex items-center justify-center gap-2 shrink-0 transition-colors focus-academic shadow-xs"
                      >
                        <Award className="w-4 h-4" aria-hidden="true" />
                        <span>Buka & Cetak E-Sertifikat</span>
                      </button>
                    </div>
                  )}
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200/80 text-center text-sm text-slate-600">
                Belum ada pemindaian tiket. Masukkan kode tiket di sebelah kiri.
              </div>
            )}

            {/* Riwayat Scan Pintu (Log Anti-Passback) */}
            <div className="pt-2 space-y-3">
              <h3 className="text-sm font-bold text-slate-900">
                Log Aktivitas Pintu (Anti-Passback History)
              </h3>

              <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden">
                <div className="max-h-[260px] overflow-y-auto divide-y divide-slate-200/80">
                  {scanLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs hover:bg-slate-50/80 transition-colors"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2 font-mono-code">
                          <span className="font-semibold text-slate-900">
                            {log.inputCode}
                          </span>
                          <span aria-hidden="true" className="text-slate-300">
                            ·
                          </span>
                          <span className="text-slate-500">
                            {log.timestamp}
                          </span>
                        </div>
                        <p className="text-slate-600">
                          {log.participantName
                            ? `${log.participantName} — `
                            : ''}
                          {log.reason}
                        </p>
                      </div>
                      <div className="shrink-0">
                        <ScanDecisionBadge decision={log.decision} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CertificateModal
        certificate={activeCert}
        onClose={() => setSelectedCertTx(null)}
        onNotify={onNotify}
      />
    </section>
  );
}
