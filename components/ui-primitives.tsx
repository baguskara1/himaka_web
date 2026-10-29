'use client';

import React, { useEffect } from 'react';
import {
  Award,
  Check,
  Copy,
  Download,
  Printer,
  QrCode,
  ShieldCheck,
  X,
} from 'lucide-react';
import {
  HimakaCertificateMetadata,
  ScanDecision,
  Transaction,
  TransactionStatus,
  formatRupiah,
  isTicketMarkedHadir,
  triggerCertificatePdfDownload,
} from '@/lib/ticketing-core';

export type SemanticBadgeVariant =
  | 'success'
  | 'warning'
  | 'danger'
  | 'neutral'
  | 'crimson';

interface StatusBadgeProps {
  variant: SemanticBadgeVariant;
  label: string;
  mono?: boolean;
  className?: string;
}

export function StatusBadge({
  variant,
  label,
  mono = true,
  className = '',
}: StatusBadgeProps) {
  const styles: Record<
    SemanticBadgeVariant,
    { bg: string; border: string; text: string }
  > = {
    success: {
      bg: 'bg-emerald-50/90',
      border: 'border-emerald-200',
      text: 'text-emerald-800',
    },
    warning: {
      bg: 'bg-amber-50/90',
      border: 'border-amber-200',
      text: 'text-amber-800',
    },
    danger: {
      bg: 'bg-rose-50/90',
      border: 'border-rose-200',
      text: 'text-rose-800',
    },
    neutral: {
      bg: 'bg-slate-100',
      border: 'border-slate-200',
      text: 'text-slate-600',
    },
    crimson: {
      bg: 'bg-red-50/90',
      border: 'border-red-200',
      text: 'text-red-800',
    },
  };

  const current = styles[variant];

  return (
    <span
      className={`inline-flex items-center h-6 px-2.5 rounded-md border text-[11px] font-semibold tracking-wide whitespace-nowrap shrink-0 ${
        mono ? 'font-mono-code' : ''
      } ${current.bg} ${current.border} ${current.text} ${className}`}
    >
      <span>{label}</span>
    </span>
  );
}

export function TransactionStatusBadge({
  status,
  compact = false,
}: {
  status: TransactionStatus;
  compact?: boolean;
}) {
  switch (status) {
    case 'LUNAS':
      return (
        <StatusBadge
          variant="success"
          label={compact ? 'LUNAS' : 'LUNAS · TERVERIFIKASI'}
        />
      );
    case 'PENDING':
      return (
        <StatusBadge
          variant="warning"
          label={compact ? 'PENDING' : 'PENDING · MENUNGGU VERIFIKASI'}
        />
      );
    case 'DITOLAK':
      return (
        <StatusBadge
          variant="danger"
          label={compact ? 'DITOLAK' : 'DITOLAK · BUKTI TIDAK SESUAI'}
        />
      );
    case 'EXPIRED':
      return (
        <StatusBadge
          variant="neutral"
          label={compact ? 'EXPIRED' : 'EXPIRED · BATAS WAKTU HABIS'}
        />
      );
  }
}

export function ScanDecisionBadge({ decision }: { decision: ScanDecision }) {
  switch (decision) {
    case 'BOLEH MASUK':
      return <StatusBadge variant="success" label="BOLEH MASUK" />;
    case 'SUDAH PERNAH SCAN':
      return <StatusBadge variant="warning" label="SUDAH PERNAH SCAN" />;
    case 'TIKET TIDAK VALID':
      return <StatusBadge variant="danger" label="TIKET TIDAK VALID" />;
  }
}

export function DeterministicQrSvg({
  value,
  size = 148,
}: {
  value: string;
  size?: number;
}) {
  const gridSize = 15;
  const cells: boolean[][] = Array.from({ length: gridSize }, () =>
    Array(gridSize).fill(false),
  );

  // Hash string deterministically
  let hash = 2166136261;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  const isFinderArea = (r: number, c: number) => {
    const topLeft = r < 4 && c < 4;
    const topRight = r < 4 && c >= gridSize - 4;
    const bottomLeft = r >= gridSize - 4 && c < 4;
    return topLeft || topRight || bottomLeft;
  };

  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if (isFinderArea(r, c)) continue;
      const seed = Math.imul(hash ^ (r * 31 + c * 17), 2654435761);
      cells[r][c] = Math.abs(seed) % 10 < 5;
    }
  }

  const drawFinder = (startR: number, startC: number) => {
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        cells[startR + r][startC + c] = true;
      }
    }
    cells[startR + 1][startC + 1] = true;
  };

  drawFinder(0, 0);
  drawFinder(0, gridSize - 3);
  drawFinder(gridSize - 3, 0);

  return (
    <div
      className="inline-flex flex-col items-center p-3.5 bg-white border border-slate-200 rounded-xl shadow-level-1"
      role="img"
      aria-label={`Kode QR E-Ticket untuk ${value}`}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${gridSize} ${gridSize}`}
        className="shape-rendering-crispEdges"
      >
        <rect width={gridSize} height={gridSize} fill="#ffffff" />
        {/* Finder squares */}
        <rect
          x="0"
          y="0"
          width="3.5"
          height="3.5"
          fill="none"
          stroke="#0f172a"
          strokeWidth="0.6"
        />
        <rect x="1" y="1" width="1.5" height="1.5" fill="#0f172a" />
        <rect
          x={gridSize - 3.5}
          y="0"
          width="3.5"
          height="3.5"
          fill="none"
          stroke="#0f172a"
          strokeWidth="0.6"
        />
        <rect
          x={gridSize - 2.5}
          y="1"
          width="1.5"
          height="1.5"
          fill="#0f172a"
        />
        <rect
          x="0"
          y={gridSize - 3.5}
          width="3.5"
          height="3.5"
          fill="none"
          stroke="#0f172a"
          strokeWidth="0.6"
        />
        <rect
          x="1"
          y={gridSize - 2.5}
          width="1.5"
          height="1.5"
          fill="#0f172a"
        />

        {cells.map((row, rIdx) =>
          row.map((active, cIdx) =>
            active && !isFinderArea(rIdx, cIdx) ? (
              <rect
                key={`${rIdx}-${cIdx}`}
                x={cIdx + 0.1}
                y={rIdx + 0.1}
                width={0.8}
                height={0.8}
                fill="#0f172a"
              />
            ) : null,
          ),
        )}
      </svg>
      <span className="mt-2 font-mono-code text-xs font-semibold text-slate-900 tracking-wider">
        {value}
      </span>
    </div>
  );
}

export function PerforatedTicketCard({
  transaction,
  onCopyCode,
  copiedCode,
  onSimulateScan,
  onMarkHadir,
  onDownloadCertificate,
  onOpenCertificate,
}: {
  transaction: Transaction;
  onCopyCode: (code: string) => void;
  copiedCode: string | null;
  onSimulateScan?: (code: string) => void;
  onMarkHadir?: (txId: string) => void;
  onDownloadCertificate?: (tx: Transaction) => void;
  onOpenCertificate?: (tx: Transaction) => void;
}) {
  const isCopied = copiedCode === transaction.ticketCode;
  const isHadir = isTicketMarkedHadir(transaction);
  const handleCertificateAction = onDownloadCertificate || onOpenCertificate;

  return (
    <article
      className="bg-white border border-slate-200/90 rounded-2xl shadow-level-1 overflow-hidden"
      aria-label={`E-Ticket ${transaction.ticketCode}`}
      data-testid={`ticket-card-${transaction.id}`}
      data-attendance={isHadir ? 'HADIR' : 'BELUM_HADIR'}
    >
      {/* Top Header Strip */}
      <div className="bg-slate-50/90 px-5 py-3.5 sm:px-7 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <QrCode className="w-4 h-4 text-[#1d4ed8]" aria-hidden="true" />
          <span className="font-mono-code text-xs font-semibold text-slate-900 tracking-wide">
            E-TICKET RESMI HIMAKA UMBY
          </span>
        </div>
        <div className="flex items-center flex-wrap gap-2">
          <TransactionStatusBadge status={transaction.status} />
          {isHadir ? (
            <StatusBadge variant="success" label="HADIR" />
          ) : (
            <StatusBadge
              variant="neutral"
              label="BELUM HADIR · SIAP CHECK-IN"
            />
          )}
        </div>
      </div>

      {/* Upper Body: Event & Participant Metadata */}
      <div className="p-5 sm:p-7">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono-code">
              <span>ID TRANSAKSI: {transaction.id}</span>
              <span aria-hidden="true">·</span>
              <span>DIVERIFIKASI: {transaction.verifiedAt || '-'}</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              {transaction.eventTitle}
            </h3>
            <p className="text-sm font-semibold text-[#1d4ed8]">
              Tier: {transaction.tierName} (
              {transaction.mode === 'tim' ? 'Delegasi Tim' : 'Individu'})
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-3 text-left lg:text-right shrink-0">
            <span className="block text-xs text-slate-500">
              Nominal Terverifikasi
            </span>
            <span className="font-mono-code text-lg font-bold text-slate-900">
              {formatRupiah(transaction.totalAmount)}
            </span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-5 pt-5 border-t border-slate-100 text-sm">
          <div>
            <span className="block text-xs text-slate-500 mb-0.5">
              Nama Pemegang Tiket
            </span>
            <span className="font-semibold text-slate-900">
              {transaction.participantName}
            </span>
            <span className="block font-mono-code text-xs text-slate-600 mt-0.5">
              NIM: {transaction.nim}
            </span>
          </div>
          <div>
            <span className="block text-xs text-slate-500 mb-0.5">
              Program Studi / Kontak
            </span>
            <span className="font-medium text-slate-900">
              {transaction.faculty}
            </span>
            <span className="block font-mono-code text-xs text-slate-600 mt-0.5">
              {transaction.whatsapp}
            </span>
          </div>
          <div>
            <span className="block text-xs text-slate-500 mb-0.5">
              Status Kehadiran & Sertifikat
            </span>
            {isHadir ? (
              <span className="font-mono-code text-xs font-semibold text-emerald-700">
                HADIR ({transaction.scannedAt || 'Terverifikasi'}) ·
                E-Certificate PDF Siap Diunduh
              </span>
            ) : (
              <span className="font-mono-code text-xs font-semibold text-amber-700">
                Belum Hadir · Scan di Gate Acara untuk Klaim E-Certificate
              </span>
            )}
          </div>
        </div>

        {transaction.mode === 'tim' && transaction.teamMembers && (
          <div className="mt-5 p-4 bg-slate-50/80 border border-slate-200/80 rounded-xl">
            <span className="block text-xs font-semibold text-slate-900">
              Tim: {transaction.teamName} ({transaction.teamMembers.length}{' '}
              Anggota)
            </span>
            <ul className="mt-1.5 space-y-1 text-xs text-slate-600 font-mono-code">
              {transaction.teamMembers.map((member, idx) => (
                <li key={idx}>
                  {idx + 1}. {member}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Perforated Divider with Dual Inward Circular Notches */}
      <div
        className="relative flex items-center justify-between my-1"
        aria-hidden="true"
      >
        <div className="w-5 h-5 rounded-full bg-[#f8fafc] border border-slate-200 -ml-2.5 shrink-0" />
        <div className="w-full border-t border-dashed border-slate-300" />
        <div className="w-5 h-5 rounded-full bg-[#f8fafc] border border-slate-200 -mr-2.5 shrink-0" />
      </div>

      {/* Lower Stub: QR Matrix + Verification Code & Actions */}
      <div className="p-5 sm:p-7 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto">
          <DeterministicQrSvg value={transaction.ticketCode} size={124} />
          <div className="space-y-1.5 text-center sm:text-left">
            <span className="block text-xs uppercase tracking-wider text-slate-500 font-mono-code">
              KODE VALIDASI PINTU (QR METADATA)
            </span>
            <div className="font-mono-code text-xl font-bold text-slate-900 tracking-tight">
              {transaction.ticketCode}
            </div>
            <p className="text-xs text-slate-600 max-w-md leading-relaxed">
              Tunjukkan QR ini beserta KTM aktif kepada Panitia Pintu. Setelah
              kehadiran dipindai di Gate, E-Sertifikat peserta otomatis dapat
              diunduh & dicetak.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 w-full sm:w-auto shrink-0">
          {isHadir && handleCertificateAction && (
            <button
              type="button"
              data-testid={`ecertificate-btn-${transaction.id}`}
              onClick={() => handleCertificateAction(transaction)}
              className="min-h-[42px] px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl inline-flex items-center justify-center gap-2 transition-colors focus-academic whitespace-nowrap shadow-level-1"
            >
              <Download className="w-4 h-4" aria-hidden="true" />
              <span>E-Certificate</span>
            </button>
          )}

          {!isHadir && onMarkHadir && (
            <button
              type="button"
              data-testid={`mark-hadir-btn-${transaction.id}`}
              onClick={() => onMarkHadir(transaction.id)}
              className="min-h-[42px] px-4 py-2 bg-[#1d4ed8] hover:bg-[#1e40af] text-white text-xs font-semibold rounded-xl inline-flex items-center justify-center gap-2 transition-colors focus-academic whitespace-nowrap shadow-level-1"
            >
              <ShieldCheck className="w-4 h-4" aria-hidden="true" />
              <span>Tandai HADIR</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onCopyCode(transaction.ticketCode)}
            className="min-h-[42px] px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 text-xs font-semibold rounded-xl inline-flex items-center justify-center gap-2 transition-colors focus-academic whitespace-nowrap shadow-level-1"
          >
            {isCopied ? (
              <>
                <Check
                  className="w-4 h-4 text-emerald-600"
                  aria-hidden="true"
                />
                <span>Kode Disalin</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-700" aria-hidden="true" />
                <span>Salin Kode Tiket</span>
              </>
            )}
          </button>

          {onSimulateScan && (
            <button
              type="button"
              onClick={() => onSimulateScan(transaction.ticketCode)}
              className="min-h-[42px] px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl inline-flex items-center justify-center gap-2 transition-colors focus-academic whitespace-nowrap shadow-level-1"
            >
              <QrCode className="w-4 h-4" aria-hidden="true" />
              <span>Uji di Scanner Pintu</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export function AcademicModal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="academic-modal-title"
    >
      <div className="bg-white border border-slate-200 rounded-2xl shadow-level-3 w-full max-w-2xl overflow-hidden my-8">
        <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-200/80 flex items-start justify-between gap-4">
          <div>
            <h2
              id="academic-modal-title"
              className="text-lg font-bold text-slate-900"
            >
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs text-slate-500 mt-0.5 font-mono-code">
                {subtitle}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup dialog"
            className="min-w-[40px] min-h-[40px] -mr-1 -mt-0.5 inline-flex items-center justify-center rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-colors focus-academic"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 max-h-[80vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

export function CertificateModal({
  certificate,
  onClose,
  onNotify,
}: {
  certificate: HimakaCertificateMetadata | null;
  onClose: () => void;
  onNotify?: (msg: string, type?: 'success' | 'warning' | 'danger') => void;
}) {
  useEffect(() => {
    if (!certificate) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [certificate, onClose]);

  if (!certificate) return null;

  const handleDownloadPdfCertificate = () => {
    const filename = triggerCertificatePdfDownload(certificate);
    if (onNotify) {
      onNotify(
        `File PDF E-Certificate (${filename}) berhasil diunduh untuk ${certificate.participantName}.`,
        'success',
      );
    }
  };

  const handlePrintCertificate = () => {
    if (onNotify) {
      onNotify(
        `Menyiapkan cetak E-Certificate ${certificate.certificateNumber} untuk ${certificate.participantName}.`,
        'success',
      );
    }
    if (typeof window !== 'undefined' && typeof window.print === 'function') {
      window.print();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="certificate-modal-title"
    >
      <div className="bg-white border border-slate-200 rounded-2xl shadow-level-3 w-full max-w-4xl overflow-hidden my-6">
        {/* Top Modal Controls */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Award className="w-5 h-5 text-[#1d4ed8]" aria-hidden="true" />
            <div>
              <h2
                id="certificate-modal-title"
                className="text-base font-bold text-slate-900"
              >
                E-Certificate Resmi Peserta HIMAKA UMBY {certificate.issuedYear}
              </h2>
              <p className="text-xs font-mono-code text-slate-500">
                NO. SERI: {certificate.certificateNumber} · STATUS: HADIR (
                {certificate.scannedAt})
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              data-testid="modal-download-pdf-ecertificate-btn"
              onClick={handleDownloadPdfCertificate}
              className="min-h-[40px] px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl inline-flex items-center gap-2 transition-colors focus-academic shadow-xs"
            >
              <Download className="w-4 h-4" aria-hidden="true" />
              <span>Download PDF E-Certificate</span>
            </button>
            <button
              type="button"
              onClick={handlePrintCertificate}
              className="min-h-[40px] px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 text-xs font-semibold rounded-xl inline-flex items-center gap-2 transition-colors focus-academic shadow-xs"
            >
              <Printer className="w-4 h-4" aria-hidden="true" />
              <span>Cetak</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup pratinjau e-sertifikat"
              className="min-w-[40px] min-h-[40px] inline-flex items-center justify-center rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-colors focus-academic"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Canvas */}
        <div className="p-5 sm:p-8 bg-slate-100/70 max-h-[82vh] overflow-y-auto">
          <div className="bg-white border-2 border-[#0b1c30] rounded-2xl p-6 sm:p-10 shadow-level-2 relative overflow-hidden">
            {/* Inner Academic Gold/Blue Frame */}
            <div className="border border-slate-300 rounded-xl p-6 sm:p-9 space-y-7">
              {/* Institutional Header */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-200 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <img
                    src="/images/logo-himaka-umby.svg"
                    alt="Logo HIMAKA UMBY"
                    className="w-16 h-16 object-contain shrink-0"
                  />
                  <div>
                    <span className="text-[11px] font-mono-code font-bold uppercase tracking-widest text-[#1d4ed8] block">
                      HIMPUNAN MAHASISWA INFORMATIKA (HIMAKA)
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">
                      FAKULTAS TEKNOLOGI INFORMASI · UNIVERSITAS MERCU BUANA
                      YOGYAKARTA
                    </h3>
                    <p className="text-xs text-slate-500">
                      Kampus 3 UMBY, Jl. Ringroad Utara, Condongcatur, Sleman,
                      DI Yogyakarta
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-center sm:text-right shrink-0">
                  <span className="block text-[10px] font-mono-code uppercase text-slate-500">
                    NOMOR REGISTRASI SERTIFIKAT
                  </span>
                  <span className="font-mono-code text-xs font-bold text-slate-900">
                    {certificate.certificateNumber}
                  </span>
                </div>
              </div>

              {/* Certificate Title & Recipient */}
              <div className="text-center space-y-3 py-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-50 border border-blue-200 text-[#1d4ed8] font-mono-code text-xs font-bold uppercase tracking-widest">
                  <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                  SERTIFIKAT PENGHARGAAN & KEHADIRAN AKADEMIK
                </span>
                <p className="text-xs uppercase tracking-widest text-slate-500">
                  Diberikan dengan bangga kepada:
                </p>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {certificate.participantName}
                </div>
                <p className="font-mono-code text-xs sm:text-sm font-semibold text-slate-600">
                  NIM: {certificate.nim} · {certificate.faculty}
                </p>
              </div>

              {/* Event Participation Citation */}
              <div className="bg-slate-50/90 border border-slate-200/90 rounded-xl p-5 text-center space-y-2 max-w-2xl mx-auto">
                <p className="text-xs text-slate-600">
                  Atas partisipasi aktif dan kehadiran penuh sebagai{' '}
                  <strong className="text-slate-900">
                    Peserta ({certificate.tierName})
                  </strong>{' '}
                  dalam kegiatan:
                </p>
                <div className="text-lg sm:text-xl font-bold text-[#0b1c30]">
                  {certificate.eventTitle}
                </div>
                <p className="text-xs text-slate-600">
                  Diselenggarakan pada{' '}
                  <strong className="text-slate-900">
                    {certificate.eventDate}
                  </strong>{' '}
                  bertempat di{' '}
                  <strong className="text-slate-900">
                    {certificate.eventLocation}
                  </strong>
                </p>
                <div className="pt-1">
                  <span className="inline-flex items-center px-3 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono-code text-xs font-bold">
                    KREDIT POIN KEAKTIFAN: {certificate.skpPoints}
                  </span>
                </div>
              </div>

              {/* Signatures & Digital QR Verification Footer */}
              <div className="pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-6 items-end text-center">
                <div className="space-y-1">
                  <span className="text-[11px] text-slate-500 block">
                    Mengetahui, Pembina HIMAKA UMBY
                  </span>
                  <div className="h-10 flex items-center justify-center">
                    <span className="font-mono-code text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                      TERVERIFIKASI DIGITAL
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-900 underline underline-offset-4">
                    {certificate.advisorName}
                  </p>
                  <span className="text-[11px] text-slate-500 block">
                    Dosen Pembina Kemahasiswaan Informatika
                  </span>
                </div>

                <div className="flex flex-col items-center justify-center">
                  <DeterministicQrSvg
                    value={certificate.certificateNumber}
                    size={88}
                  />
                  <span className="mt-1 text-[10px] font-mono-code text-slate-500">
                    TIKET: {certificate.ticketCode}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] text-slate-500 block">
                    Yogyakarta, {certificate.eventDate}
                  </span>
                  <div className="h-10 flex items-center justify-center">
                    <span className="font-mono-code text-[11px] text-[#1d4ed8] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                      TTD ELEKTRONIK SAH
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-900 underline underline-offset-4">
                    {certificate.chairpersonName}
                  </p>
                  <span className="text-[11px] font-mono-code text-slate-500 block">
                    Ketua Umum HIMAKA 2026 · NIM {certificate.chairpersonNim}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
