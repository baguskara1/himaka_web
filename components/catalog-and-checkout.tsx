'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Calendar,
  MapPin,
  Search,
  ArrowLeft,
  ArrowRight,
  Upload,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  QrCode,
} from 'lucide-react';
import {
  AcademicEvent,
  EventTier,
  HimakaUser,
  MedinfoConfig,
  RegistrationFormInput,
  FormValidationErrors,
  RegistrationMode,
  Transaction,
  formatRupiah,
  getTierRemainingQuota,
  isTierSoldOut,
  isEventSoldOut,
  validateRegistrationForm,
  computeUniqueCode,
  calculateCheckoutTotal,
} from '@/lib/ticketing-core';
import { StatusBadge, TransactionStatusBadge } from './ui-primitives';

export type PesertaSubScreen = 'katalog' | 'detail' | 'form' | 'pembayaran';

interface CatalogAndCheckoutProps {
  events: AcademicEvent[];
  medinfo: MedinfoConfig;
  transactionsCount: number;
  currentUser: HimakaUser | null;
  onRequireAuth: (pendingAction: () => void, reason: string) => void;
  activeSubScreen: PesertaSubScreen;
  setActiveSubScreen: (screen: PesertaSubScreen) => void;
  selectedEventId: string;
  setSelectedEventId: (id: string) => void;
  selectedTierId: string;
  setSelectedTierId: (id: string) => void;
  activeCheckoutTx: Transaction | null;
  onCreateTransaction: (txData: {
    event: AcademicEvent;
    tier: EventTier;
    form: RegistrationFormInput;
  }) => Transaction;
  onUploadProof: (
    txId: string,
    fileName: string,
    senderBank: string,
    senderName: string,
  ) => void;
  onMarkExpired: (txId: string) => void;
  onGoToMyTickets: (txId?: string) => void;
  onNotify: (msg: string, type?: 'success' | 'warning' | 'danger') => void;
}

export function CatalogAndCheckout({
  events,
  medinfo,
  transactionsCount,
  currentUser,
  onRequireAuth,
  activeSubScreen,
  setActiveSubScreen,
  selectedEventId,
  setSelectedEventId,
  selectedTierId,
  setSelectedTierId,
  activeCheckoutTx,
  onCreateTransaction,
  onUploadProof,
  onMarkExpired,
  onGoToMyTickets,
  onNotify,
}: CatalogAndCheckoutProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('Semua');
  const [availabilityFilter, setAvailabilityFilter] = useState<
    'all' | 'available' | 'soldout'
  >('all');

  const selectedEvent =
    events.find((e) => e.id === selectedEventId) || events[0];
  const selectedTier =
    selectedEvent.tiers.find((t) => t.id === selectedTierId) ||
    selectedEvent.tiers.find((t) => !isTierSoldOut(t)) ||
    selectedEvent.tiers[0];

  // Registration Form State
  const [formInput, setFormInput] = useState<RegistrationFormInput>({
    participantName: currentUser?.name || '',
    nim: currentUser?.nim || '',
    faculty: currentUser?.faculty || 'Informatika UMBY',
    email: currentUser?.email || '',
    whatsapp: currentUser?.whatsapp || '',
    mode: selectedTier?.mode || 'individu',
    teamName: '',
    teamMembersText: '',
  });
  const [formErrors, setFormErrors] = useState<FormValidationErrors>({});

  // Pre-fill form with logged-in user details when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setFormInput((prev) => ({
        ...prev,
        participantName: prev.participantName || currentUser.name,
        nim: prev.nim || currentUser.nim,
        faculty: prev.faculty || currentUser.faculty,
        email: prev.email || currentUser.email,
        whatsapp: prev.whatsapp || currentUser.whatsapp,
      }));
    }
  }, [currentUser]);

  // Payment Screen State
  const [paymentMethodTab, setPaymentMethodTab] = useState<'bank' | 'qris'>(
    'bank',
  );
  const [senderBank, setSenderBank] = useState('Bank Mandiri / Livin');
  const [senderName, setSenderName] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');
  const [copiedNominal, setCopiedNominal] = useState(false);
  const [copiedRekening, setCopiedRekening] = useState(false);

  const categories = [
    'Semua',
    ...Array.from(new Set(events.map((e) => e.category))),
  ];

  const filteredEvents = events.filter((ev) => {
    const matchesSearch =
      ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === 'Semua' || ev.category === categoryFilter;
    const soldOut = isEventSoldOut(ev) || !ev.isOpen;
    const matchesAvailability =
      availabilityFilter === 'all' ||
      (availabilityFilter === 'available' && !soldOut) ||
      (availabilityFilter === 'soldout' && soldOut);
    return matchesSearch && matchesCategory && matchesAvailability;
  });

  const handleSelectEvent = (ev: AcademicEvent) => {
    const proceed = () => {
      setSelectedEventId(ev.id);
      const firstAvailable =
        ev.tiers.find((t) => !isTierSoldOut(t)) || ev.tiers[0];
      if (firstAvailable) {
        setSelectedTierId(firstAvailable.id);
        setFormInput((prev) => ({ ...prev, mode: firstAvailable.mode }));
      }
      setActiveSubScreen('detail');
    };

    const eventSoldOut = isEventSoldOut(ev) || !ev.isOpen;
    if (!currentUser && !eventSoldOut) {
      onRequireAuth(
        proceed,
        `Silakan Login atau Register akun terlebih dahulu untuk mendaftar pada acara "${ev.title}".`,
      );
      return;
    }
    proceed();
  };

  const handleSelectTier = (tier: EventTier) => {
    if (isTierSoldOut(tier)) return;
    setSelectedTierId(tier.id);
    setFormInput((prev) => ({ ...prev, mode: tier.mode }));
  };

  const handleProceedToForm = () => {
    if (!selectedTier || isTierSoldOut(selectedTier)) {
      onNotify(
        'Silakan pilih tier tiket yang masih memiliki kuota tersedia.',
        'warning',
      );
      return;
    }
    const proceed = () => {
      setFormInput((prev) => ({
        ...prev,
        mode: selectedTier.mode,
      }));
      setFormErrors({});
      setActiveSubScreen('form');
    };

    if (!currentUser) {
      onRequireAuth(
        proceed,
        `Silakan Login atau Register akun terlebih dahulu sebelum mengisi formulir pendaftaran tier "${selectedTier.name}".`,
      );
      return;
    }
    proceed();
  };

  const handleFillDemoForm = (modeOverride?: RegistrationMode) => {
    const targetMode = modeOverride || formInput.mode;
    if (targetMode === 'tim') {
      setFormInput({
        participantName: 'Damar Wijaya Putra',
        nim: '220710199',
        faculty: 'Informatika UMBY',
        email: 'damar.wijaya@student.mercubuana-yogya.ac.id',
        whatsapp: '081299887766',
        mode: 'tim',
        teamName: 'Tim Kode Nusantara UMBY',
        teamMembersText:
          'Damar Wijaya Putra (220710199 - Ketua)\nSinta Maharani (220710204 - Backend & Data)\nKevin Alvaro (230710045 - UI/UX & Frontend)',
      });
    } else {
      setFormInput({
        participantName: 'Larasati Ningrum',
        nim: '230710118',
        faculty: 'Informatika UMBY',
        email: 'larasati.ningrum@student.mercubuana-yogya.ac.id',
        whatsapp: '081345678912',
        mode: 'individu',
        teamName: '',
        teamMembersText: '',
      });
    }
    setFormErrors({});
  };

  const handleTriggerErrorDemo = () => {
    const badInput: RegistrationFormInput = {
      participantName: 'A',
      nim: '12',
      faculty: '',
      email: 'email-tanpa-domain',
      whatsapp: '12345',
      mode: formInput.mode,
      teamName: '',
      teamMembersText: '',
    };
    setFormInput(badInput);
    const errs = validateRegistrationForm(
      badInput,
      selectedTier?.maxMembers || 3,
    );
    setFormErrors(errs);
    onNotify(
      'Terdapat kesalahan pada isian form pendaftaran. Periksa pesan error di bawah field.',
      'danger',
    );
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateRegistrationForm(
      formInput,
      selectedTier?.maxMembers || 3,
    );
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      onNotify(
        'Mohon lengkapi seluruh field wajib dengan format yang benar.',
        'danger',
      );
      return;
    }

    const createdTx = onCreateTransaction({
      event: selectedEvent,
      tier: selectedTier,
      form: formInput,
    });
    setSenderName(createdTx.participantName);
    setSelectedFileName('');
    setActiveSubScreen('pembayaran');
  };

  const previewUniqueCode = computeUniqueCode(transactionsCount + 1);
  const previewTotal = calculateCheckoutTotal(
    selectedTier?.price || 0,
    previewUniqueCode,
  );

  const currentPaymentTx = activeCheckoutTx;

  const handleCopyText = (text: string, type: 'nominal' | 'rekening') => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    if (type === 'nominal') {
      setCopiedNominal(true);
      setTimeout(() => setCopiedNominal(false), 2000);
    } else {
      setCopiedRekening(true);
      setTimeout(() => setCopiedRekening(false), 2000);
    }
    onNotify('Berhasil disalin ke clipboard.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Sub-navigation Stepper for Peserta Flow (Screens 1 - 4) */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-level-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-mono-code font-semibold uppercase tracking-widest text-[#1d4ed8]">
              ALUR PESERTA · 4 LAYAR UTAMA
            </span>
            <p className="text-xs text-slate-600 mt-0.5">
              Pilih langkah di bawah untuk meninjau setiap layar alur
              pendaftaran peserta.
            </p>
          </div>
          <div
            className="flex flex-wrap items-center gap-1.5"
            role="tablist"
            aria-label="Langkah alur peserta"
          >
            {(
              [
                { id: 'katalog', label: '1. Katalog Acara' },
                { id: 'detail', label: '2. Detail & Tier' },
                { id: 'form', label: '3. Form Pendaftaran' },
                { id: 'pembayaran', label: '4. Pembayaran & Bukti' },
              ] as { id: PesertaSubScreen; label: string }[]
            ).map((step) => {
              const active = activeSubScreen === step.id;
              return (
                <button
                  key={step.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => {
                    if (
                      !currentUser &&
                      (step.id === 'form' || step.id === 'pembayaran')
                    ) {
                      onRequireAuth(
                        () => setActiveSubScreen(step.id),
                        `Silakan Login atau Register akun terlebih dahulu untuk membuka tahap "${step.label}".`,
                      );
                      return;
                    }
                    setActiveSubScreen(step.id);
                  }}
                  className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap focus-academic ${
                    active
                      ? 'bg-[#1d4ed8] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200/70 hover:text-slate-900'
                  }`}
                >
                  {step.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Animated Sub-Screen Container */}
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={`${activeSubScreen}-${selectedEventId}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* SCREEN 1: KATALOG ACARA */}
          {activeSubScreen === 'katalog' && (
            <section aria-labelledby="heading-katalog" className="space-y-6">
              {/* Institutional Header & Active Medinfo Announcements */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-level-1">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-200/80">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-mono-code">
                      <span className="text-[#1d4ed8] font-semibold">
                        PORTAL AKADEMIK
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{medinfo.organizationName}</span>
                    </div>
                    <h1
                      id="heading-katalog"
                      className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight"
                    >
                      Katalog Kegiatan & Sidang Akademik
                    </h1>
                    <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
                      Pendaftaran resmi seminar nasional informatika, kompetisi
                      pengembangan perangkat lunak, dan workshop praktikum
                      mahasiswa Universitas Mercu Buana Yogyakarta.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => onGoToMyTickets()}
                      className="min-h-[42px] px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 text-xs font-semibold rounded-xl inline-flex items-center gap-2 transition-colors focus-academic whitespace-nowrap"
                    >
                      <QrCode
                        className="w-4 h-4 text-[#1d4ed8]"
                        aria-hidden="true"
                      />
                      <span>Cek Status & E-Ticket</span>
                    </button>
                  </div>
                </div>

                {/* Active Medinfo Announcements Strip */}
                {medinfo.announcements.filter((a) => a.isActive).length > 0 && (
                  <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {medinfo.announcements
                      .filter((a) => a.isActive)
                      .slice(0, 3)
                      .map((ann) => (
                        <div
                          key={ann.id}
                          className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 flex flex-col justify-between gap-2"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-mono-code text-xs font-semibold text-[#1d4ed8]">
                                {ann.category.toUpperCase().startsWith('INFO')
                                  ? ann.category.toUpperCase()
                                  : `INFO ${ann.category.toUpperCase()}`}
                              </span>
                              <span className="font-mono-code text-[11px] text-slate-500">
                                {ann.updatedAt}
                              </span>
                            </div>
                            <h2 className="text-xs font-semibold text-slate-900">
                              {ann.title}
                            </h2>
                            <p className="text-xs text-slate-600 leading-relaxed">
                              {ann.content}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Search & Filter Controls */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-level-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                  <div className="md:col-span-8">
                    <label
                      htmlFor="search-event-input"
                      className="block text-sm font-medium text-slate-900 mb-1.5"
                    >
                      Cari Nama Acara, Kode, atau Lokasi
                    </label>
                    <div className="relative">
                      <Search
                        className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                        aria-hidden="true"
                      />
                      <input
                        id="search-event-input"
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Ketik judul seminar, workshop, atau kode..."
                        className="w-full min-h-[44px] pl-10 pr-4 py-2 bg-slate-50/70 focus:bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus-academic transition-colors"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-4">
                    <label
                      htmlFor="filter-availability"
                      className="block text-sm font-medium text-slate-900 mb-1.5"
                    >
                      Status Kuota
                    </label>
                    <select
                      id="filter-availability"
                      value={availabilityFilter}
                      onChange={(e) =>
                        setAvailabilityFilter(
                          e.target.value as 'all' | 'available' | 'soldout',
                        )
                      }
                      className="w-full min-h-[44px] px-3.5 py-2 bg-slate-50/70 focus:bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus-academic transition-colors"
                    >
                      <option value="all">Semua Status Kuota</option>
                      <option value="available">Tersedia (Buka)</option>
                      <option value="soldout">Kuota Habis (Sold Out)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3.5 border-t border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-900">
                    Filter Kategori Kegiatan:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategoryFilter(cat)}
                        className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all whitespace-nowrap focus-academic ${
                          categoryFilter === cat
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Event Catalog Grid (12-column responsive) */}
              {filteredEvents.length === 0 ? (
                <div className="bg-white border border-slate-200/80 rounded-2xl p-8 text-center shadow-level-1 space-y-3">
                  <p className="text-base font-semibold text-slate-900">
                    Tidak ada acara yang sesuai dengan pencarian Anda
                  </p>
                  <p className="text-sm text-slate-600 max-w-md mx-auto">
                    Coba ubah kata kunci pencarian atau reset filter kategori
                    dan status kuota untuk menampilkan kembali seluruh agenda
                    akademik HIMAKA.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setCategoryFilter('Semua');
                      setAvailabilityFilter('all');
                    }}
                    className="min-h-[42px] px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors focus-academic"
                  >
                    Reset Filter Katalog
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {filteredEvents.map((ev) => {
                    const eventSoldOut = isEventSoldOut(ev) || !ev.isOpen;
                    const totalQuota = ev.tiers.reduce(
                      (acc, t) => acc + t.quota,
                      0,
                    );
                    const totalSold = ev.tiers.reduce(
                      (acc, t) => acc + t.sold,
                      0,
                    );
                    const remainingTotal = Math.max(0, totalQuota - totalSold);
                    const minPrice = Math.min(...ev.tiers.map((t) => t.price));
                    const hasVipOrEb = ev.tiers.some(
                      (t) => t.isVipOrEarlyBird && !isTierSoldOut(t),
                    );

                    return (
                      <article
                        key={ev.id}
                        className="lg:col-span-4 bg-white border border-slate-200/80 hover:border-slate-300 rounded-2xl shadow-level-1 flex flex-col justify-between overflow-hidden transition-all"
                      >
                        <div className="p-6 space-y-4">
                          {/* Top Metadata Row */}
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                              <span className="font-mono-code font-semibold text-slate-900">
                                {ev.code}
                              </span>
                              <span aria-hidden="true">·</span>
                              <span>{ev.category}</span>
                              <span aria-hidden="true">·</span>
                              <span className="font-medium text-[#1d4ed8]">
                                {ev.skpPoints}
                              </span>
                            </div>

                            {eventSoldOut ? (
                              <StatusBadge
                                variant="neutral"
                                label="HABIS · SOLD OUT"
                              />
                            ) : hasVipOrEb ? (
                              <StatusBadge
                                variant="crimson"
                                label="VIP / EARLY SLOT"
                              />
                            ) : (
                              <StatusBadge
                                variant="success"
                                label={`TERSEDIA · ${remainingTotal} KURSI`}
                              />
                            )}
                          </div>

                          {/* Event Title & Description */}
                          <div className="space-y-2">
                            <h2 className="text-lg font-bold text-slate-900 leading-snug">
                              {ev.title}
                            </h2>
                            <p className="text-sm text-slate-600 leading-relaxed">
                              {ev.description}
                            </p>
                          </div>

                          {/* Schedule & Location Metadata */}
                          <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                            <div className="flex items-start gap-2">
                              <Calendar
                                className="w-4 h-4 text-slate-400 shrink-0 mt-0.5"
                                aria-hidden="true"
                              />
                              <div>
                                <span className="font-medium text-slate-900">
                                  {ev.date}
                                </span>
                                <span className="mx-1.5" aria-hidden="true">
                                  ·
                                </span>
                                <span className="font-mono-code">
                                  {ev.time}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <MapPin
                                className="w-4 h-4 text-slate-400 shrink-0 mt-0.5"
                                aria-hidden="true"
                              />
                              <span>{ev.location}</span>
                            </div>
                          </div>

                          {/* Tier Preview List */}
                          <div className="pt-3 border-t border-slate-100 space-y-1.5">
                            <span className="block text-xs font-semibold text-slate-900">
                              Pilihan Tier & Kuota ({totalSold}/{totalQuota}{' '}
                              Terisi)
                            </span>
                            {ev.tiers.map((t) => {
                              const soldOut = isTierSoldOut(t);
                              return (
                                <div
                                  key={t.id}
                                  className="flex items-center justify-between text-xs py-1.5 px-3 rounded-lg bg-slate-50/80 border border-slate-200/70"
                                >
                                  <div className="flex items-center gap-1.5 truncate pr-2">
                                    <span
                                      className={`truncate ${
                                        soldOut
                                          ? 'line-through text-slate-400'
                                          : 'text-slate-900 font-medium'
                                      }`}
                                    >
                                      {t.name}
                                    </span>
                                    {t.isVipOrEarlyBird && !soldOut && (
                                      <span className="text-[11px] font-mono-code font-semibold text-rose-700 shrink-0">
                                        [VIP]
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2 shrink-0 font-mono-code">
                                    <span className="font-semibold text-slate-900">
                                      {formatRupiah(t.price)}
                                    </span>
                                    <span
                                      className={`text-[11px] ${
                                        soldOut
                                          ? 'text-slate-400'
                                          : 'text-emerald-700'
                                      }`}
                                    >
                                      (
                                      {soldOut
                                        ? 'Habis'
                                        : `Sisa ${getTierRemainingQuota(t)}`}
                                      )
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Card Footer Action */}
                        <div className="px-6 py-4 bg-slate-50/90 border-t border-slate-200/80 flex items-center justify-between gap-3">
                          <div>
                            <span className="block text-[11px] text-slate-500">
                              Mulai dari
                            </span>
                            <span className="font-mono-code text-base font-semibold text-slate-900">
                              {formatRupiah(minPrice)}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleSelectEvent(ev)}
                            className={`min-h-[42px] px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-2 transition-colors focus-academic whitespace-nowrap ${
                              eventSoldOut
                                ? 'bg-white border border-slate-200 text-slate-900 hover:bg-slate-50'
                                : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                            }`}
                          >
                            <span>
                              {eventSoldOut
                                ? 'Lihat Detail (Habis)'
                                : 'Pilih Tier & Daftar'}
                            </span>
                            <ArrowRight
                              className="w-4 h-4"
                              aria-hidden="true"
                            />
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          )}

          {/* SCREEN 2: DETAIL ACARA DAN PILIHAN TIER */}
          {activeSubScreen === 'detail' && (
            <section
              aria-labelledby="heading-detail"
              className="space-y-6 pb-20 sm:pb-0"
            >
              <div className="flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setActiveSubScreen('katalog')}
                  className="min-h-[42px] px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 text-xs font-semibold rounded-xl inline-flex items-center gap-2 transition-colors focus-academic"
                >
                  <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                  <span>Kembali ke Katalog Acara</span>
                </button>

                <div className="flex items-center gap-2">
                  <label
                    htmlFor="quick-switch-event"
                    className="text-xs font-medium text-slate-600 hidden sm:inline"
                  >
                    Ganti Acara:
                  </label>
                  <select
                    id="quick-switch-event"
                    value={selectedEvent.id}
                    onChange={(e) => {
                      const found = events.find(
                        (ev) => ev.id === e.target.value,
                      );
                      if (found) handleSelectEvent(found);
                    }}
                    className="min-h-[42px] px-3.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus-academic"
                  >
                    {events.map((ev) => (
                      <option key={ev.id} value={ev.id}>
                        {ev.code} — {ev.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Event Full Information Card */}
                <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-level-1 space-y-5">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-mono-code text-slate-500">
                      <span className="font-semibold text-slate-900">
                        {selectedEvent.code}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{selectedEvent.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-[#1d4ed8] font-semibold">
                        {selectedEvent.skpPoints}
                      </span>
                    </div>
                    <h1
                      id="heading-detail"
                      className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight"
                    >
                      {selectedEvent.title}
                    </h1>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {selectedEvent.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-200/80 space-y-3 text-sm">
                    <div>
                      <span className="block text-xs text-slate-500">
                        Hari, Tanggal & Waktu Pelaksanaan
                      </span>
                      <span className="font-semibold text-slate-900">
                        {selectedEvent.date}
                      </span>
                      <span className="block font-mono-code text-xs text-slate-600">
                        {selectedEvent.time}
                      </span>
                    </div>

                    <div>
                      <span className="block text-xs text-slate-500">
                        Lokasi Kampus
                      </span>
                      <span className="font-medium text-slate-900">
                        {selectedEvent.location}
                      </span>
                    </div>

                    <div>
                      <span className="block text-xs text-slate-500">
                        Narasumber / Dewan Penguji
                      </span>
                      <span className="font-medium text-slate-900">
                        {selectedEvent.speakerOrHost}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 text-xs text-slate-900 space-y-1">
                    <span className="font-semibold block">
                      Catatan Check-in Pintu:
                    </span>
                    <p className="text-slate-600 leading-relaxed">
                      {medinfo.gateCheckinNote}
                    </p>
                  </div>
                </div>

                {/* Tier Selector Column */}
                <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-level-1 space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">
                        Pilih Tier Tiket & Kategori Pendaftaran
                      </h2>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Harga ditampilkan dalam format tetap sebelum ditambah 3
                        digit kode unik pada saat checkout.
                      </p>
                    </div>
                  </div>

                  <div
                    className="space-y-3.5"
                    role="radiogroup"
                    aria-label="Pilihan Tier Tiket"
                  >
                    {selectedEvent.tiers.map((tier) => {
                      const soldOut = isTierSoldOut(tier);
                      const isSelected =
                        selectedTier?.id === tier.id && !soldOut;
                      const remaining = getTierRemainingQuota(tier);

                      return (
                        <div
                          key={tier.id}
                          onClick={() => handleSelectTier(tier)}
                          className={`p-5 rounded-xl border transition-all ${
                            soldOut
                              ? 'bg-slate-100 border-slate-200 opacity-85 cursor-not-allowed'
                              : isSelected
                                ? 'bg-blue-50/40 border-[#1d4ed8] shadow-level-2 cursor-pointer'
                                : 'bg-white border-slate-200 hover:bg-slate-50/80 cursor-pointer'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3">
                              <button
                                type="button"
                                role="radio"
                                aria-checked={isSelected}
                                disabled={soldOut}
                                aria-label={`Pilih tier ${tier.name}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSelectTier(tier);
                                }}
                                className={`mt-1 w-[18px] h-[18px] rounded-full border flex items-center justify-center shrink-0 focus-academic ${
                                  soldOut
                                    ? 'border-slate-300 bg-slate-100'
                                    : isSelected
                                      ? 'border-[#1d4ed8] bg-[#1d4ed8]'
                                      : 'border-slate-300 bg-white hover:border-slate-900'
                                }`}
                              >
                                {isSelected && (
                                  <span className="w-2 h-2 rounded-full bg-white" />
                                )}
                              </button>

                              <div className="space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="text-base font-bold text-slate-900">
                                    {tier.name}
                                  </span>
                                  {tier.isVipOrEarlyBird && !soldOut && (
                                    <StatusBadge
                                      variant="crimson"
                                      label={
                                        tier.badgeText || 'VIP / EARLY BIRD'
                                      }
                                    />
                                  )}
                                  {soldOut && (
                                    <StatusBadge
                                      variant="neutral"
                                      label="HABIS · KUOTA TERPENUHI"
                                    />
                                  )}
                                </div>

                                <div className="flex items-center gap-2 text-xs text-slate-500 font-mono-code">
                                  <span>
                                    Kategori:{' '}
                                    {tier.mode === 'tim'
                                      ? `Delegasi Tim (Maks. ${tier.maxMembers || 3} Orang)`
                                      : 'Peserta Individu'}
                                  </span>
                                  <span aria-hidden="true">·</span>
                                  <span>
                                    Terisi {tier.sold}/{tier.quota} (Sisa{' '}
                                    {remaining})
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <span className="font-mono-code text-lg font-semibold text-slate-900 block">
                                {formatRupiah(tier.price)}
                              </span>
                              <span className="text-[11px] text-slate-500">
                                /{tier.mode === 'tim' ? 'tim' : 'peserta'}
                              </span>
                            </div>
                          </div>

                          <ul className="mt-3 pl-7 space-y-1 text-xs text-slate-600 list-disc">
                            {tier.benefits.map((b, i) => (
                              <li key={i}>{b}</li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>

                  {/* Desktop Checkout Summary Box */}
                  <div className="pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="block text-xs text-slate-500">
                        Tier Dipilih Saat Ini:
                      </span>
                      <span className="text-sm font-bold text-slate-900">
                        {selectedTier?.name}
                      </span>
                      <span className="block font-mono-code text-sm font-semibold text-[#1d4ed8]">
                        {formatRupiah(selectedTier?.price || 0)}{' '}
                        <span className="text-xs font-normal text-slate-500">
                          (+ kode unik 3 digit saat checkout)
                        </span>
                      </span>
                    </div>

                    <button
                      type="button"
                      disabled={!selectedTier || isTierSoldOut(selectedTier)}
                      onClick={handleProceedToForm}
                      className={`min-h-[44px] px-5 py-2.5 rounded-xl text-xs font-semibold inline-flex items-center justify-center gap-2 transition-colors focus-academic whitespace-nowrap ${
                        !selectedTier || isTierSoldOut(selectedTier)
                          ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                          : 'bg-[#1d4ed8] hover:bg-[#1e40af] text-white shadow-xs'
                      }`}
                    >
                      <span>Lanjut Isi Form Pendaftaran</span>
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Mobile Sticky Bottom Checkout Bar */}
              <div className="sm:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 p-4 shadow-level-2 flex items-center justify-between gap-3">
                <div className="truncate">
                  <span className="block text-[11px] text-slate-500 truncate">
                    {selectedTier?.name}
                  </span>
                  <span className="font-mono-code text-base font-semibold text-slate-900">
                    {formatRupiah(selectedTier?.price || 0)}
                  </span>
                </div>
                <button
                  type="button"
                  disabled={!selectedTier || isTierSoldOut(selectedTier)}
                  onClick={handleProceedToForm}
                  className="min-h-[42px] px-4 py-2 bg-[#1d4ed8] text-white text-xs font-semibold rounded-xl shrink-0 disabled:bg-slate-100 disabled:text-slate-400"
                >
                  Lanjut Daftar
                </button>
              </div>
            </section>
          )}

          {/* SCREEN 3: FORM PENDAFTARAN INDIVIDU DAN TIM */}
          {activeSubScreen === 'form' && (
            <section aria-labelledby="heading-form" className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setActiveSubScreen('detail')}
                  className="min-h-[44px] px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-900 text-xs font-semibold rounded-xl inline-flex items-center gap-2 transition-colors shadow-xs focus-academic"
                >
                  <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                  <span>Kembali ke Pilihan Tier</span>
                </button>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleFillDemoForm()}
                    className="min-h-[44px] px-4 py-2 bg-slate-100 border border-slate-300 hover:bg-slate-200/80 text-slate-900 text-xs font-semibold rounded-xl transition-colors focus-academic"
                  >
                    Isi Otomatis Data Valid
                  </button>
                  <button
                    type="button"
                    onClick={handleTriggerErrorDemo}
                    className="min-h-[44px] px-4 py-2 bg-rose-50 border border-rose-300 hover:bg-rose-100/80 text-rose-700 text-xs font-semibold rounded-xl transition-colors focus-academic"
                  >
                    Uji State Error Form
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Main Form Column */}
                <form
                  onSubmit={handleSubmitForm}
                  noValidate
                  className="lg:col-span-8 bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-level-1 space-y-6"
                >
                  <div className="border-b border-slate-200/80 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h1
                        id="heading-form"
                        className="text-xl font-bold text-slate-900 tracking-tight"
                      >
                        Formulir Registrasi Peserta
                      </h1>
                      <p className="text-xs text-slate-600 mt-1">
                        Pastikan nama lengkap dan NIM sesuai KTM untuk
                        pencetakan sertifikat SKP dan validasi pintu.
                      </p>
                    </div>

                    {/* Mode Switcher (Individu vs Tim) so both modes can be inspected */}
                    <div
                      className="inline-flex p-1.5 bg-slate-100/90 border border-slate-200/90 rounded-xl self-start"
                      role="group"
                      aria-label="Pilih mode pendaftaran"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setFormInput((prev) => ({
                            ...prev,
                            mode: 'individu',
                          }))
                        }
                        className={`min-h-[36px] px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          formInput.mode === 'individu'
                            ? 'bg-slate-900 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                        }`}
                      >
                        Individu
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setFormInput((prev) => ({ ...prev, mode: 'tim' }))
                        }
                        className={`min-h-[36px] px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          formInput.mode === 'tim'
                            ? 'bg-slate-900 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                        }`}
                      >
                        Delegasi Tim
                      </button>
                    </div>
                  </div>

                  {Object.keys(formErrors).length > 0 && (
                    <div
                      role="alert"
                      className="p-4 rounded-xl bg-rose-50/90 border border-rose-300 text-rose-800 text-xs flex items-start gap-2.5"
                    >
                      <AlertCircle
                        className="w-4 h-4 shrink-0 mt-0.5 text-rose-600"
                        aria-hidden="true"
                      />
                      <div>
                        <span className="font-bold block">
                          Validasi Pendaftaran Gagal (
                          {Object.keys(formErrors).length} field perlu
                          diperbaiki)
                        </span>
                        <span className="text-rose-700 mt-0.5 block">
                          Periksa kembali input bertanda merah di bawah sebelum
                          melanjutkan ke instruksi pembayaran.
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="field-participant-name"
                        className="block text-sm font-semibold text-slate-900 mb-1.5"
                      >
                        {formInput.mode === 'tim'
                          ? 'Nama Lengkap Ketua Tim *'
                          : 'Nama Lengkap Peserta *'}
                      </label>
                      <input
                        id="field-participant-name"
                        type="text"
                        value={formInput.participantName}
                        onChange={(e) =>
                          setFormInput({
                            ...formInput,
                            participantName: e.target.value,
                          })
                        }
                        placeholder="Contoh: Nadia Pramesti Kusuma"
                        aria-invalid={Boolean(formErrors.participantName)}
                        className={`w-full min-h-[44px] px-3.5 py-2 bg-white border rounded-xl text-sm text-slate-900 placeholder:text-slate-400 transition-colors ${
                          formErrors.participantName
                            ? 'border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20'
                            : 'border-slate-300 focus-academic'
                        }`}
                      />
                      {formErrors.participantName && (
                        <p className="mt-1.5 text-xs font-medium text-rose-700">
                          {formErrors.participantName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="field-nim"
                        className="block text-sm font-semibold text-slate-900 mb-1.5"
                      >
                        NIM / Nomor Identitas Mahasiswa *
                      </label>
                      <input
                        id="field-nim"
                        type="text"
                        value={formInput.nim}
                        onChange={(e) =>
                          setFormInput({ ...formInput, nim: e.target.value })
                        }
                        placeholder="Contoh: 220710142"
                        aria-invalid={Boolean(formErrors.nim)}
                        className={`w-full min-h-[44px] px-3.5 py-2 bg-white border rounded-xl text-sm font-mono-code text-slate-900 placeholder:text-slate-400 transition-colors ${
                          formErrors.nim
                            ? 'border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20'
                            : 'border-slate-300 focus-academic'
                        }`}
                      />
                      {formErrors.nim && (
                        <p className="mt-1.5 text-xs font-medium text-rose-700">
                          {formErrors.nim}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="field-faculty"
                        className="block text-sm font-semibold text-slate-900 mb-1.5"
                      >
                        Program Studi / Asal Instansi *
                      </label>
                      <input
                        id="field-faculty"
                        type="text"
                        value={formInput.faculty}
                        onChange={(e) =>
                          setFormInput({
                            ...formInput,
                            faculty: e.target.value,
                          })
                        }
                        placeholder="Contoh: Informatika UMBY"
                        aria-invalid={Boolean(formErrors.faculty)}
                        className={`w-full min-h-[44px] px-3.5 py-2 bg-white border rounded-xl text-sm text-slate-900 placeholder:text-slate-400 transition-colors ${
                          formErrors.faculty
                            ? 'border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20'
                            : 'border-slate-300 focus-academic'
                        }`}
                      />
                      {formErrors.faculty && (
                        <p className="mt-1.5 text-xs font-medium text-rose-700">
                          {formErrors.faculty}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="field-whatsapp"
                        className="block text-sm font-semibold text-slate-900 mb-1.5"
                      >
                        Nomor WhatsApp Aktif *
                      </label>
                      <input
                        id="field-whatsapp"
                        type="tel"
                        value={formInput.whatsapp}
                        onChange={(e) =>
                          setFormInput({
                            ...formInput,
                            whatsapp: e.target.value,
                          })
                        }
                        placeholder="Contoh: 081234567890"
                        aria-invalid={Boolean(formErrors.whatsapp)}
                        className={`w-full min-h-[44px] px-3.5 py-2 bg-white border rounded-xl text-sm font-mono-code text-slate-900 placeholder:text-slate-400 transition-colors ${
                          formErrors.whatsapp
                            ? 'border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20'
                            : 'border-slate-300 focus-academic'
                        }`}
                      />
                      {formErrors.whatsapp && (
                        <p className="mt-1.5 text-xs font-medium text-rose-700">
                          {formErrors.whatsapp}
                        </p>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="field-email"
                        className="block text-sm font-semibold text-slate-900 mb-1.5"
                      >
                        Alamat Email Kampus / Personal *
                      </label>
                      <input
                        id="field-email"
                        type="email"
                        value={formInput.email}
                        onChange={(e) =>
                          setFormInput({ ...formInput, email: e.target.value })
                        }
                        placeholder="nama@student.mercubuana-yogya.ac.id"
                        aria-invalid={Boolean(formErrors.email)}
                        className={`w-full min-h-[44px] px-3.5 py-2 bg-white border rounded-xl text-sm text-slate-900 placeholder:text-slate-400 transition-colors ${
                          formErrors.email
                            ? 'border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20'
                            : 'border-slate-300 focus-academic'
                        }`}
                      />
                      {formErrors.email && (
                        <p className="mt-1.5 text-xs font-medium text-rose-700">
                          {formErrors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Conditional Team Registration Fields */}
                  {formInput.mode === 'tim' && (
                    <div className="pt-5 border-t border-slate-200/80 space-y-4">
                      <div className="flex items-center justify-between">
                        <h2 className="text-sm font-bold text-slate-900">
                          Data Delegasi Tim (Kategori Kelompok)
                        </h2>
                        <span className="text-xs font-mono-code font-semibold text-slate-500">
                          Maks. {selectedTier?.maxMembers || 3} anggota
                        </span>
                      </div>

                      <div>
                        <label
                          htmlFor="field-team-name"
                          className="block text-sm font-semibold text-slate-900 mb-1.5"
                        >
                          Nama Tim / Kelompok *
                        </label>
                        <input
                          id="field-team-name"
                          type="text"
                          value={formInput.teamName || ''}
                          onChange={(e) =>
                            setFormInput({
                              ...formInput,
                              teamName: e.target.value,
                            })
                          }
                          placeholder="Contoh: Suara Aksara Kolektif"
                          aria-invalid={Boolean(formErrors.teamName)}
                          className={`w-full min-h-[44px] px-3.5 py-2 bg-white border rounded-xl text-sm text-slate-900 placeholder:text-slate-400 transition-colors ${
                            formErrors.teamName
                              ? 'border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20'
                              : 'border-slate-300 focus-academic'
                          }`}
                        />
                        {formErrors.teamName && (
                          <p className="mt-1.5 text-xs font-medium text-rose-700">
                            {formErrors.teamName}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="field-team-members"
                          className="block text-sm font-semibold text-slate-900 mb-1.5"
                        >
                          Daftar Lengkap Anggota Tim (1 Baris per Anggota
                          beserta NIM) *
                        </label>
                        <textarea
                          id="field-team-members"
                          rows={3}
                          value={formInput.teamMembersText || ''}
                          onChange={(e) =>
                            setFormInput({
                              ...formInput,
                              teamMembersText: e.target.value,
                            })
                          }
                          placeholder={
                            '1. Nama Ketua (NIM)\n2. Nama Anggota 1 (NIM)\n3. Nama Anggota 2 (NIM)'
                          }
                          aria-invalid={Boolean(formErrors.teamMembersText)}
                          className={`w-full p-3.5 bg-white border rounded-xl text-sm font-mono-code text-slate-900 placeholder:text-slate-400 transition-colors ${
                            formErrors.teamMembersText
                              ? 'border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20'
                              : 'border-slate-300 focus-academic'
                          }`}
                        />
                        {formErrors.teamMembersText && (
                          <p className="mt-1.5 text-xs font-medium text-rose-700">
                            {formErrors.teamMembersText}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="pt-5 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <span className="text-xs text-slate-500">
                      * Wajib diisi dengan data akademik yang dapat
                      dipertanggungjawabkan.
                    </span>
                    <button
                      type="submit"
                      className="min-h-[44px] px-6 py-2.5 bg-[#1d4ed8] hover:bg-[#1e40af] text-white text-xs font-semibold rounded-xl inline-flex items-center justify-center gap-2 transition-colors shadow-xs focus-academic whitespace-nowrap"
                    >
                      <span>Buat Pesanan & Lanjut Pembayaran</span>
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </form>

                {/* Order Summary Sidebar */}
                <aside className="lg:col-span-4 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-level-1 space-y-4">
                  <h2 className="text-base font-bold text-slate-900 border-b border-slate-200/80 pb-3.5">
                    Ringkasan Tiket & Estimasi Kode Unik
                  </h2>

                  <div className="space-y-1 text-sm">
                    <span className="text-xs font-mono-code font-semibold text-slate-500">
                      {selectedEvent.code}
                    </span>
                    <p className="font-bold text-slate-900 leading-snug">
                      {selectedEvent.title}
                    </p>
                    <p className="text-xs text-[#1d4ed8] font-semibold">
                      Tier: {selectedTier?.name}
                    </p>
                  </div>

                  <div className="pt-3.5 border-t border-slate-200/80 space-y-2.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Harga Dasar Tier</span>
                      <span className="font-mono-code font-semibold text-slate-900">
                        {formatRupiah(selectedTier?.price || 0)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">
                        Kode Unik Verifikasi (3 Digit)
                      </span>
                      <span className="font-mono-code font-semibold text-[#1d4ed8]">
                        + Rp {previewUniqueCode}
                      </span>
                    </div>
                    <div className="pt-2.5 border-t border-slate-200/80 flex items-center justify-between text-sm">
                      <span className="font-bold text-slate-900">
                        Total Tagihan
                      </span>
                      <span className="font-mono-code text-base font-bold text-slate-900">
                        {formatRupiah(previewTotal)}
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50/90 border border-slate-200/80 text-xs text-slate-600 leading-relaxed">
                    Kode unik 3 digit digunakan Bendahara HIMAKA untuk
                    mencocokkan mutasi rekening secara akurat tanpa tertukar
                    antar mahasiswa.
                  </div>
                </aside>
              </div>
            </section>
          )}

          {/* SCREEN 4: INSTRUKSI PEMBAYARAN SIMULASI DAN UPLOAD BUKTI */}
          {activeSubScreen === 'pembayaran' && (
            <section aria-labelledby="heading-pembayaran" className="space-y-6">
              {!currentPaymentTx ? (
                <div className="bg-white border border-slate-200/80 rounded-2xl p-8 text-center space-y-3 shadow-level-1">
                  <p className="text-base font-bold text-slate-900">
                    Belum Ada Transaksi Baru yang Dipilih
                  </p>
                  <p className="text-sm text-slate-600">
                    Silakan isi form pendaftaran terlebih dahulu atau pilih
                    transaksi yang sudah ada.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveSubScreen('form')}
                    className="min-h-[44px] px-5 py-2.5 bg-[#1d4ed8] hover:bg-[#1e40af] text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
                  >
                    Ke Form Pendaftaran
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left Column: Payment Breakdown & Destination */}
                  <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-level-1 space-y-5">
                    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200/80 pb-4">
                      <div>
                        <span className="text-xs font-mono-code font-semibold text-slate-500">
                          ID TRANSAKSI: {currentPaymentTx.id} · KODE TIKET:{' '}
                          {currentPaymentTx.ticketCode}
                        </span>
                        <h1
                          id="heading-pembayaran"
                          className="text-xl font-bold text-slate-900 mt-1 tracking-tight"
                        >
                          Instruksi Pembayaran Simulasi
                        </h1>
                      </div>
                      <TransactionStatusBadge
                        status={currentPaymentTx.status}
                      />
                    </div>

                    {/* Exact Nominal Highlight Box */}
                    <div className="p-5 rounded-xl bg-blue-50/70 border border-blue-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className="text-xs font-semibold text-slate-900 block">
                          Nominal Transfer Tepat (Termasuk 3 Digit Kode Unik #
                          {currentPaymentTx.uniqueCode})
                        </span>
                        <div className="font-mono-code text-2xl sm:text-3xl font-bold text-[#1d4ed8]">
                          {formatRupiah(currentPaymentTx.totalAmount)}
                        </div>
                        <span className="text-xs text-slate-600 block">
                          Harga Dasar {formatRupiah(currentPaymentTx.basePrice)}{' '}
                          + Kode Unik Rp {currentPaymentTx.uniqueCode}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleCopyText(
                            String(currentPaymentTx.totalAmount),
                            'nominal',
                          )
                        }
                        className="min-h-[44px] px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-900 text-xs font-semibold rounded-xl inline-flex items-center justify-center gap-2 transition-colors shadow-xs focus-academic shrink-0"
                      >
                        {copiedNominal ? (
                          <>
                            <Check
                              className="w-4 h-4 text-emerald-700"
                              aria-hidden="true"
                            />
                            <span>Nominal Disalin</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" aria-hidden="true" />
                            <span>Salin Angka Nominal</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Payment Channel Selector (Bank Transfer vs QRIS Simulasi) */}
                    <div className="space-y-3.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setPaymentMethodTab('bank')}
                          className={`min-h-[42px] px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                            paymentMethodTab === 'bank'
                              ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          Transfer Rekening Kampus
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentMethodTab('qris')}
                          className={`min-h-[42px] px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                            paymentMethodTab === 'qris'
                              ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          QRIS Statis Organisasi (Simulasi)
                        </button>
                      </div>

                      {paymentMethodTab === 'bank' ? (
                        <div className="p-4 sm:p-5 rounded-xl bg-slate-50/90 border border-slate-200/90 space-y-3.5">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <span className="text-xs text-slate-500 block">
                                Bank Tujuan Resmi
                              </span>
                              <span className="text-sm font-bold text-slate-900">
                                {medinfo.bankName}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                handleCopyText(
                                  medinfo.bankAccountNumber,
                                  'rekening',
                                )
                              }
                              className="min-h-[40px] px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-900 inline-flex items-center gap-1.5 self-start sm:self-auto shadow-xs transition-colors"
                            >
                              {copiedRekening ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-700" />
                                  <span>Nomor Disalin</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Salin No. Rek</span>
                                </>
                              )}
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-200/80">
                            <div>
                              <span className="text-xs text-slate-500 block">
                                Nomor Rekening
                              </span>
                              <span className="font-mono-code text-base font-bold text-slate-900">
                                {medinfo.bankAccountNumber}
                              </span>
                            </div>
                            <div>
                              <span className="text-xs text-slate-500 block">
                                Atas Nama Rekening
                              </span>
                              <span className="text-sm font-semibold text-slate-900">
                                {medinfo.bankAccountHolder}
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 sm:p-5 rounded-xl bg-slate-50/90 border border-slate-200/90 flex flex-col sm:flex-row items-center gap-4">
                          <div className="p-3 bg-white border border-slate-200/90 rounded-xl shrink-0 shadow-xs">
                            <QrCode
                              className="w-20 h-20 text-slate-900"
                              aria-hidden="true"
                            />
                          </div>
                          <div className="space-y-1.5 text-xs text-slate-600 leading-relaxed">
                            <span className="font-mono-code font-bold text-slate-900 block">
                              NMID: ID1025008891204 · {medinfo.qrisMerchantName}
                            </span>
                            <p>
                              Masukkan nominal tepat{' '}
                              <strong className="font-mono-code text-slate-900">
                                {formatRupiah(currentPaymentTx.totalAmount)}
                              </strong>{' '}
                              pada aplikasi m-banking atau e-wallet Anda, lalu
                              simpan tangkapan layar struk untuk diunggah di
                              panel sebelah kanan.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Deadline & Simulation Triggers */}
                    <div className="pt-4 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
                      <div>
                        <span>Batas Waktu Pembayaran: </span>
                        <strong className="font-mono-code text-slate-900">
                          {currentPaymentTx.expiresAt}
                        </strong>
                      </div>

                      <button
                        type="button"
                        onClick={() => onMarkExpired(currentPaymentTx.id)}
                        className="min-h-[40px] px-3.5 py-1.5 bg-slate-100 border border-slate-300 hover:bg-slate-200/80 text-slate-700 font-semibold rounded-lg transition-colors"
                      >
                        Simulasikan Lewat Batas Waktu (Expired)
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Upload Bukti Pembayaran */}
                  <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-level-1 space-y-4">
                    <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200/80 pb-3.5">
                      Unggah Bukti Pembayaran (Struk Demo)
                    </h2>

                    {currentPaymentTx.proofFileName ? (
                      <div className="p-4 rounded-xl bg-emerald-50/90 border border-emerald-300 text-emerald-800 space-y-2 text-xs">
                        <div className="flex items-center gap-2 font-bold">
                          <CheckCircle2
                            className="w-4 h-4 shrink-0 text-emerald-600"
                            aria-hidden="true"
                          />
                          <span>Bukti Transfer Berhasil Diunggah</span>
                        </div>
                        <p className="font-mono-code">
                          File: {currentPaymentTx.proofFileName} (
                          {currentPaymentTx.proofUploadedAt})
                        </p>
                        <p>
                          Pengirim: {currentPaymentTx.proofSenderName} via{' '}
                          {currentPaymentTx.proofSenderBank}
                        </p>
                      </div>
                    ) : (
                      <div className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-300 text-amber-800 text-xs leading-relaxed">
                        Belum ada bukti pembayaran yang diunggah untuk transaksi{' '}
                        <strong className="font-mono-code">
                          {currentPaymentTx.id}
                        </strong>
                        .
                      </div>
                    )}

                    <div className="space-y-3.5">
                      <div>
                        <label
                          htmlFor="upload-sender-bank"
                          className="block text-sm font-semibold text-slate-900 mb-1.5"
                        >
                          Bank / Kanal Pembayaran Pengirim
                        </label>
                        <input
                          id="upload-sender-bank"
                          type="text"
                          value={senderBank}
                          onChange={(e) => setSenderBank(e.target.value)}
                          className="w-full min-h-[44px] px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 focus-academic"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="upload-sender-name"
                          className="block text-sm font-semibold text-slate-900 mb-1.5"
                        >
                          Nama Pemilik Rekening Pengirim
                        </label>
                        <input
                          id="upload-sender-name"
                          type="text"
                          value={senderName || currentPaymentTx.participantName}
                          onChange={(e) => setSenderName(e.target.value)}
                          className="w-full min-h-[44px] px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 focus-academic"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="upload-proof-file"
                          className="block text-sm font-semibold text-slate-900 mb-1.5"
                        >
                          Pilih File Struk (JPG/PNG/PDF)
                        </label>
                        <input
                          id="upload-proof-file"
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) setSelectedFileName(f.name);
                          }}
                          className="w-full min-h-[44px] px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-900 file:text-white hover:file:bg-slate-800"
                        />
                      </div>

                      <div className="pt-2 flex flex-col gap-2.5">
                        <button
                          type="button"
                          onClick={() => {
                            const fileToUse =
                              selectedFileName ||
                              `struk_${currentPaymentTx.id.toLowerCase()}_${currentPaymentTx.totalAmount}.jpg`;
                            onUploadProof(
                              currentPaymentTx.id,
                              fileToUse,
                              senderBank || 'Livin by Mandiri',
                              senderName || currentPaymentTx.participantName,
                            );
                          }}
                          className="w-full min-h-[44px] px-4 py-2.5 bg-[#1d4ed8] hover:bg-[#1e40af] text-white text-xs font-semibold rounded-xl inline-flex items-center justify-center gap-2 transition-colors shadow-xs focus-academic"
                        >
                          <Upload className="w-4 h-4" aria-hidden="true" />
                          <span>
                            {selectedFileName
                              ? `Kirim Bukti (${selectedFileName})`
                              : 'Unggah Struk Simulasi Demo Sekarang'}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onGoToMyTickets(currentPaymentTx.id)}
                          className="w-full min-h-[44px] px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl inline-flex items-center justify-center gap-2 transition-colors shadow-xs focus-academic"
                        >
                          <span>
                            Lihat Status Transaksi & E-Ticket (Tiketku)
                          </span>
                          <ArrowRight className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </section>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
