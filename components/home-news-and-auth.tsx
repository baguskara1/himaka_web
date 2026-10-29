'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Search,
  LogIn,
  UserPlus,
  BookOpen,
  ArrowRight,
  Lock,
  Ticket,
  Camera,
  Maximize2,
  Trash2,
} from 'lucide-react';
import {
  AcademicEvent,
  HimakaNewsArticle,
  HimakaUser,
  MedinfoAnnouncement,
  NewsCategory,
  HimakaOrganizationProfile,
  HimakaCabinetPeriod,
  HimakaDivisionName,
  ProkerStatus,
  HimakaDocumentationItem,
  authenticateUser,
  registerNewUser,
  formatRupiah,
  isEventSoldOut,
  getCabinetByPeriod,
  filterPeriodMembers,
  filterPeriodProkers,
  getDocumentationForNews,
  getDocumentationForProker,
  getDocumentationForDivision,
  getHimakaDocumentationGallery,
} from '@/lib/ticketing-core';
import { AcademicModal, StatusBadge } from './ui-primitives';

interface HomeNewsPortalViewProps {
  organizationProfile: HimakaOrganizationProfile;
  cabinetPeriods: HimakaCabinetPeriod[];
  newsArticles: HimakaNewsArticle[];
  events: AcademicEvent[];
  announcements: MedinfoAnnouncement[];
  documentationGallery?: HimakaDocumentationItem[];
  currentUser: HimakaUser | null;
  onSelectEventForRegistration: (event: AcademicEvent) => void;
  onOpenCatalog: () => void;
  onOpenAuthModal: (reason?: string) => void;
  onDeleteNewsArticle?: (newsId: string, title?: string) => void;
  onDeleteDocumentationMedia?: (docId: string, title?: string) => void;
  onDeleteProker?: (prokerId: string, name?: string) => void;
}

export type HomeSectionFilter =
  | 'semua'
  | 'profil'
  | 'proker'
  | 'anggota'
  | 'dokumentasi'
  | 'berita';

export function HomeNewsPortalView({
  organizationProfile,
  cabinetPeriods,
  newsArticles,
  events,
  announcements,
  documentationGallery: customGalleryProp,
  currentUser,
  onSelectEventForRegistration,
  onOpenCatalog,
  onOpenAuthModal,
  onDeleteNewsArticle,
  onDeleteDocumentationMedia,
  onDeleteProker,
}: HomeNewsPortalViewProps) {
  const isAdmin = currentUser?.role === 'pengurus';
  // Active section filter ('semua' displays the complete institutional portal; tabs allow focusing)
  const [activeSection, setActiveSection] =
    useState<HomeSectionFilter>('semua');

  // Selected Cabinet Period Year ('2025/2026', '2024/2025', '2023/2024')
  const [selectedPeriodYear, setSelectedPeriodYear] = useState<string>(
    cabinetPeriods[0]?.periodYear || '2025/2026',
  );

  // Proker filters
  const [prokerStatusFilter, setProkerStatusFilter] = useState<
    'SEMUA' | ProkerStatus
  >('SEMUA');
  const [prokerDivisionFilter, setProkerDivisionFilter] = useState<
    'Semua Divisi' | HimakaDivisionName
  >('Semua Divisi');

  // Member directory filters
  const [memberDivisionFilter, setMemberDivisionFilter] = useState<
    'Semua Divisi' | HimakaDivisionName
  >('Semua Divisi');
  const [memberSearchQuery, setMemberSearchQuery] = useState<string>('');

  // News filters
  const [selectedNewsCategory, setSelectedNewsCategory] = useState<
    'Semua' | NewsCategory
  >('Semua');
  const [newsSearchQuery, setNewsSearchQuery] = useState('');
  const [readingArticle, setReadingArticle] =
    useState<HimakaNewsArticle | null>(null);

  // Documentation Lightbox Modal State
  const [previewDoc, setPreviewDoc] = useState<HimakaDocumentationItem | null>(
    null,
  );
  const [galleryCategoryFilter, setGalleryCategoryFilter] =
    useState<string>('Semua');

  const documentationGallery = getHimakaDocumentationGallery(customGalleryProp);
  const galleryCategories = [
    'Semua',
    ...Array.from(new Set(documentationGallery.map((d) => d.category))),
  ];
  const filteredGallery = documentationGallery.filter(
    (item) =>
      galleryCategoryFilter === 'Semua' ||
      item.category === galleryCategoryFilter,
  );

  const activeCabinet =
    getCabinetByPeriod(cabinetPeriods, selectedPeriodYear) || cabinetPeriods[0];

  const divisionOptions: ('Semua Divisi' | HimakaDivisionName)[] = [
    'Semua Divisi',
    'Badan Pengurus Harian (BPH)',
    'Divisi PKM (Pengembangan Kreativitas Mahasiswa)',
    'Divisi Hubungan Masyarakat & Kemitraan',
    'Divisi Media & Informasi (Medinfo)',
    'Divisi Pengembangan Akademik & Keprofesian',
    'Divisi Minat Bakat & Kreativitas',
    'Divisi Sosial & Pengabdian Masyarakat',
  ];

  const filteredProkers = activeCabinet
    ? filterPeriodProkers(
        activeCabinet.prokers,
        prokerStatusFilter,
        prokerDivisionFilter,
      )
    : [];

  const filteredMembers = activeCabinet
    ? filterPeriodMembers(
        activeCabinet.members,
        memberDivisionFilter,
        memberSearchQuery,
      )
    : [];

  const newsCategories: ('Semua' | NewsCategory)[] = [
    'Semua',
    'Liputan Utama',
    'Jurnalistik & Medinfo',
    'Akademik & Riset',
    'Pengabdian & Humas',
    'Prestasi Mahasiswa',
  ];

  const filteredArticles = newsArticles.filter((art) => {
    const matchesCategory =
      selectedNewsCategory === 'Semua' || art.category === selectedNewsCategory;
    const q = newsSearchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      art.title.toLowerCase().includes(q) ||
      art.summary.toLowerCase().includes(q) ||
      art.division.toLowerCase().includes(q) ||
      art.location.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const leadArticle =
    filteredArticles.find((a) => a.isLeadStory) || filteredArticles[0] || null;
  const secondaryArticles = filteredArticles.filter(
    (a) => a.id !== leadArticle?.id,
  );

  const showProfile = activeSection === 'semua' || activeSection === 'profil';
  const showProker = activeSection === 'semua' || activeSection === 'proker';
  const showAnggota = activeSection === 'semua' || activeSection === 'anggota';
  const showDokumentasi =
    activeSection === 'semua' || activeSection === 'dokumentasi';
  const showBerita = activeSection === 'semua' || activeSection === 'berita';

  const getProkerBadgeVariant = (status: ProkerStatus) => {
    if (status === 'TERLAKSANA') return 'success';
    if (status === 'BERJALAN') return 'warning';
    return 'neutral';
  };

  return (
    <div className="space-y-10">
      {/* 1. HERO MASTHEAD ORGANISASI HIMAKA UMBY */}
      <section
        aria-labelledby="heading-himaka-main"
        className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-level-1 space-y-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-start gap-5">
            <img
              src="/images/logo-himaka-umby.svg"
              alt="Lambang Resmi Himpunan Mahasiswa Informatika (HIMAKA) Universitas Mercu Buana Yogyakarta"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-contain shrink-0 shadow-level-2"
            />
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono-code text-slate-500">
                <span className="font-semibold text-[#1d4ed8]">
                  PORTAL RESMI ORGANISASI MAHASISWA
                </span>
                <span aria-hidden="true">·</span>
                <span>{organizationProfile.faculty}</span>
                <span aria-hidden="true">·</span>
                <span>{organizationProfile.university}</span>
              </div>

              <h1
                id="heading-himaka-main"
                className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight"
              >
                {organizationProfile.shortName} — {organizationProfile.fullName}
              </h1>

              <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
                Pusat informasi profil organisasi, program kerja satu periode,
                arsip anggota lintas angkatan, dokumentasi visual, serta berita
                kegiatan mahasiswa Informatika UMBY dengan sistem e-ticketing
                terpadu.
              </p>
            </div>
          </div>

          {/* Akses Cepat Akun & Tiket Proker (Flattened without nested box) */}
          <div className="flex flex-col sm:items-end gap-2.5 shrink-0">
            {currentUser ? (
              <div className="text-xs sm:text-right">
                <span className="text-emerald-700 font-mono-code font-semibold">
                  {isAdmin ? 'ADMIN PENGURUS AKTIF' : 'AKUN MAHASISWA AKTIF'}
                </span>
                <span className="text-slate-300 mx-1.5" aria-hidden="true">
                  ·
                </span>
                <span className="font-semibold text-slate-900">
                  {currentUser.name}
                </span>
                <span className="text-slate-300 mx-1.5" aria-hidden="true">
                  ·
                </span>
                <span className="font-mono-code text-slate-500">
                  NIM {currentUser.nim}
                </span>
              </div>
            ) : (
              <span className="text-xs text-slate-500">
                Login akun mahasiswa untuk mendaftar proker seminar &amp; lomba
              </span>
            )}

            <div className="flex flex-wrap items-center gap-2">
              {!currentUser && (
                <button
                  type="button"
                  onClick={() =>
                    onOpenAuthModal(
                      'Silakan Login atau Register akun mahasiswa terlebih dahulu untuk mendaftar proker di HIMAKA UMBY.',
                    )
                  }
                  className="min-h-[40px] px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 transition-colors focus-academic whitespace-nowrap"
                >
                  <LogIn className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Login / Register</span>
                </button>
              )}
              <button
                type="button"
                onClick={onOpenCatalog}
                className="min-h-[40px] px-4 py-2 bg-[#1d4ed8] hover:bg-blue-800 text-white text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 transition-colors focus-academic whitespace-nowrap"
              >
                <Ticket className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Katalog Tiket Proker</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sub-Navigation Filter & Period Year Selector */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          {/* Sub-section tabs */}
          <div
            className="flex flex-wrap gap-1.5"
            role="tablist"
            aria-label="Eksplorasi Informasi HIMAKA UMBY"
          >
            {[
              { id: 'semua', label: 'Semua Informasi' },
              { id: 'profil', label: 'Tentang HIMAKA & Divisi' },
              { id: 'proker', label: 'Proker 1 Periode' },
              { id: 'anggota', label: 'Anggota Per Periode' },
              { id: 'dokumentasi', label: 'Galeri Dokumentasi' },
              { id: 'berita', label: 'Berita & Liputan' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeSection === tab.id}
                onClick={() => setActiveSection(tab.id as HomeSectionFilter)}
                className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all whitespace-nowrap focus-academic ${
                  activeSection === tab.id
                    ? 'bg-slate-900 text-white border-slate-900 shadow-level-1'
                    : 'bg-slate-50/80 text-slate-700 border-slate-200/80 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Global Period Year Selector */}
          <div className="flex flex-wrap items-center gap-1 bg-slate-100/90 border border-slate-200/80 rounded-xl p-1">
            <span className="text-[11px] font-mono-code font-semibold text-slate-600 px-2.5">
              PERIODE:
            </span>
            {cabinetPeriods.map((cab) => (
              <button
                key={cab.periodYear}
                type="button"
                onClick={() => setSelectedPeriodYear(cab.periodYear)}
                className={`min-h-[32px] px-3 py-1 rounded-lg text-xs font-mono-code font-semibold transition-all whitespace-nowrap focus-academic ${
                  selectedPeriodYear === cab.periodYear
                    ? 'bg-[#1d4ed8] text-white shadow-xs'
                    : 'text-slate-700 hover:bg-white/80 hover:text-slate-900'
                }`}
              >
                {cab.periodYear} {cab.isCurrent ? '(Aktif)' : ''}
              </button>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={`${activeSection}-${selectedPeriodYear}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-10"
        >
          {/* 2. APA ITU HIMAKA UMBY? (PROFIL, DOKUMENTASI SEKRETARIAT, VISI MISI, & 6 DIVISI) */}
          {showProfile && (
            <section
              aria-labelledby="heading-tentang-himaka"
              className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-level-1 space-y-8"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-5">
                <div className="flex items-center gap-3.5">
                  <img
                    src="/images/logo-himaka-umby.svg"
                    alt="Logo Resmi HIMAKA UMBY"
                    className="w-12 h-12 rounded-full object-contain shrink-0"
                  />
                  <div>
                    <span className="text-xs font-mono-code font-semibold text-[#1d4ed8] block tracking-wide">
                      PROFIL &amp; IDENTITAS INSTITUSIONAL
                    </span>
                    <h2
                      id="heading-tentang-himaka"
                      className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5"
                    >
                      Apa Itu HIMAKA UMBY?
                    </h2>
                  </div>
                </div>
                <span className="text-xs font-mono-code text-slate-500">
                  Sekretariat: {organizationProfile.secretariatLocation}
                </span>
              </div>

              {/* Penjelasan Apa Itu HIMAKA + Dokumentasi Visual Sekretariat & Visi Misi */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-7 space-y-5 text-sm text-slate-600 leading-relaxed">
                  {/* Visual Documentation Banner for HIMAKA Profile & 4 Study Concentrations */}
                  <figure className="rounded-2xl overflow-hidden border border-slate-200/80 bg-white">
                    <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
                      <img
                        src="/images/dokumentasi/dok-sekretariat-himaka.svg"
                        alt="Dokumentasi Sekretariat HIMAKA UMBY & 4 Peminatan Studi Informatika"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setPreviewDoc(
                            documentationGallery.find(
                              (d) => d.id === 'gal-08',
                            ) || documentationGallery[0],
                          )
                        }
                        className="absolute bottom-3 right-3 min-h-[34px] px-3 py-1.5 rounded-lg bg-white/95 hover:bg-white text-slate-900 border border-slate-200 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors focus-academic shadow-xs"
                      >
                        <Maximize2
                          className="w-3.5 h-3.5 text-[#1d4ed8]"
                          aria-hidden="true"
                        />
                        <span>Perbesar</span>
                      </button>
                    </div>
                    <figcaption className="px-4 py-3 bg-white border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="font-mono-code font-semibold text-[#1d4ed8]">
                        DOK-PROFIL-01 · SEKRETARIAT &amp; 4 PEMINATAN
                        INFORMATIKA
                      </span>
                      <span className="text-slate-500">
                        Gedung Kemahasiswaan Kampus 3 UMBY
                      </span>
                    </figcaption>
                  </figure>

                  {organizationProfile.aboutParagraphs.map((para, i) => (
                    <p key={i} className="text-slate-600 leading-relaxed">
                      {para}
                    </p>
                  ))}
                </div>

                <div className="lg:col-span-5 space-y-5">
                  <div className="space-y-4 pb-5 border-b border-slate-200/80">
                    <div>
                      <span className="text-xs font-mono-code font-semibold text-[#1d4ed8] block">
                        VISI ORGANISASI
                      </span>
                      <p className="text-sm sm:text-base font-semibold text-slate-900 mt-1.5 leading-relaxed">
                        “{organizationProfile.vision}”
                      </p>
                    </div>

                    <div className="pt-2">
                      <span className="text-xs font-mono-code font-semibold text-slate-900 block mb-2">
                        MISI &amp; FOKUS GERAK HIMAKA:
                      </span>
                      <ol className="space-y-2 text-xs text-slate-600 list-decimal pl-4 leading-relaxed">
                        {organizationProfile.missions.map((misi, idx) => (
                          <li key={idx}>{misi}</li>
                        ))}
                      </ol>
                    </div>
                  </div>

                  {/* Secondary Documentation Card: Sidang Pleno & Pelantikan */}
                  <figure className="rounded-2xl overflow-hidden border border-slate-200/80 bg-white">
                    <div className="aspect-video w-full bg-slate-100 overflow-hidden">
                      <img
                        src="/images/dokumentasi/dok-sidang-pleno-bph.svg"
                        alt="Dokumentasi Sidang Pleno dan Pelantikan Pengurus HIMAKA UMBY"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <figcaption className="p-4 space-y-1 text-xs">
                      <span className="font-mono-code font-semibold text-[#1d4ed8] block">
                        DOKUMENTASI TATA KELOLA · {activeCabinet?.cabinetName}
                      </span>
                      <p className="text-slate-600 leading-relaxed">
                        Sidang Pleno & Rapat Kerja Pengurus HIMAKA UMBY dipimpin
                        oleh{' '}
                        <strong className="text-slate-900">
                          {activeCabinet?.chairpersonName}
                        </strong>{' '}
                        dan{' '}
                        <strong className="text-slate-900">
                          {activeCabinet?.viceChairpersonName}
                        </strong>
                        .
                      </p>
                    </figcaption>
                  </figure>
                </div>
              </div>

              {/* 6 Divisi Utama HIMAKA UMBY dengan Visual Dokumentasi */}
              <div className="space-y-4 pt-6 border-t border-slate-100">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-lg font-bold text-slate-900">
                    Struktur 6 Divisi Kepengurusan & Dokumentasi Aktivitas
                    Divisi
                  </h3>
                  <span className="text-xs font-mono-code text-slate-500">
                    Dilengkapi ilustrasi dokumentasi program kerja utama tiap
                    divisi
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {organizationProfile.divisions.map((div) => {
                    const divDoc = getDocumentationForDivision(div);
                    return (
                      <div
                        key={div.id}
                        className="group rounded-2xl bg-white border border-slate-200/80 hover:border-slate-300 overflow-hidden flex flex-col justify-between transition-all"
                      >
                        <div>
                          <div className="aspect-video w-full bg-slate-100 border-b border-slate-100 overflow-hidden">
                            <img
                              src={divDoc.imageUrl}
                              alt={divDoc.imageCaption}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                            />
                          </div>

                          <div className="p-5 space-y-2">
                            <span className="font-mono-code text-xs font-semibold text-[#1d4ed8] block">
                              {div.code} · {div.shortName}
                            </span>
                            <h4 className="text-base font-bold text-slate-900 leading-snug">
                              {div.name}
                            </h4>
                            <p className="text-xs text-slate-600 leading-relaxed">
                              {div.description}
                            </p>
                          </div>
                        </div>

                        <div className="px-5 pb-5 pt-3 border-t border-slate-100 space-y-1.5">
                          <span className="text-xs font-mono-code font-semibold text-slate-800 block">
                            Fokus Program Kerja:
                          </span>
                          <ul className="text-xs text-slate-600 space-y-1 list-disc pl-4">
                            {div.corePrograms.map((cp, idx) => (
                              <li key={idx}>{cp}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          )}

          {/* 3. HIMAKA NGAPAIN AJA SELAMA 1 PERIODE? (PROGRAM KERJA / PROKER 1 PERIODE + GAMBAR DOKUMENTASI) */}
          {showProker && activeCabinet && (
            <section
              aria-labelledby="heading-proker-periode"
              className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-level-1 space-y-6"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono-code">
                    <span className="font-semibold text-[#1d4ed8]">
                      REKAM JEJAK, DOKUMENTASI & AGENDA 1 PERIODE PENUH
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="text-slate-900 font-semibold">
                      PERIODE {activeCabinet.periodYear} (
                      {activeCabinet.cabinetName})
                    </span>
                  </div>
                  <h2
                    id="heading-proker-periode"
                    className="text-xl sm:text-2xl font-bold text-slate-900"
                  >
                    Kegiatan & Program Kerja (Proker) HIMAKA Selama 1 Periode
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
                    {activeCabinet.periodSummary}
                  </p>
                </div>

                {/* Period Switcher Buttons inside Proker Section */}
                <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                  {cabinetPeriods.map((cab) => (
                    <button
                      key={cab.periodYear}
                      type="button"
                      onClick={() => setSelectedPeriodYear(cab.periodYear)}
                      className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-mono-code font-semibold border transition-all focus-academic ${
                        selectedPeriodYear === cab.periodYear
                          ? 'bg-slate-900 text-white border-slate-900 shadow-level-1'
                          : 'bg-slate-50 text-slate-700 border-slate-200/80 hover:bg-slate-100'
                      }`}
                    >
                      Periode {cab.periodYear}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filter Status Proker & Divisi */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-slate-50/80 p-4 rounded-xl border border-slate-200/80">
                <div className="md:col-span-6 flex flex-wrap items-center gap-1.5">
                  <span className="text-xs font-mono-code font-semibold text-slate-700 mr-1">
                    Status Proker:
                  </span>
                  {(
                    ['SEMUA', 'TERLAKSANA', 'BERJALAN', 'AKAN DATANG'] as const
                  ).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setProkerStatusFilter(st)}
                      className={`min-h-[34px] px-3 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                        prokerStatusFilter === st
                          ? 'bg-[#1d4ed8] text-white border-[#1d4ed8]'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                <div className="md:col-span-6 flex items-center gap-2.5">
                  <label
                    htmlFor="proker-division-select"
                    className="text-xs font-semibold text-slate-700 whitespace-nowrap"
                  >
                    Filter Divisi:
                  </label>
                  <select
                    id="proker-division-select"
                    value={prokerDivisionFilter}
                    onChange={(e) =>
                      setProkerDivisionFilter(
                        e.target.value as 'Semua Divisi' | HimakaDivisionName,
                      )
                    }
                    className="w-full min-h-[40px] px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus-academic"
                  >
                    {divisionOptions.map((div) => (
                      <option key={div} value={div}>
                        {div}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Daftar Proker 1 Periode Disertai Gambar Dokumentasi */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProkers.map((proker) => {
                  const linkedEvent = proker.ticketingEventId
                    ? events.find((e) => e.id === proker.ticketingEventId)
                    : undefined;
                  const prokerDoc = getDocumentationForProker(proker);

                  return (
                    <article
                      key={proker.id}
                      className="group rounded-2xl bg-white border border-slate-200/80 hover:border-slate-300 overflow-hidden flex flex-col justify-between transition-all"
                    >
                      <div>
                        {/* Visual Documentation Header on Proker Card */}
                        <figure className="border-b border-slate-100">
                          <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
                            <img
                              src={prokerDoc.imageUrl}
                              alt={`Dokumentasi ${proker.name}`}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setPreviewDoc({
                                  id: proker.id,
                                  archiveCode: prokerDoc.archiveCode,
                                  title: proker.name,
                                  category: proker.category,
                                  periodYear: proker.periodYear,
                                  date: proker.month,
                                  location: 'Kampus UMBY & Lokasi Mitra',
                                  division: proker.division,
                                  photographer: proker.personInCharge,
                                  imageUrl: prokerDoc.imageUrl,
                                  caption: prokerDoc.imageCaption,
                                  relatedEventId: proker.ticketingEventId,
                                })
                              }
                              className="absolute bottom-3 right-3 min-h-[34px] px-3 py-1 rounded-lg bg-white/95 hover:bg-white text-slate-900 border border-slate-200 text-[11px] font-semibold inline-flex items-center gap-1.5 shadow-xs transition-colors"
                            >
                              <Camera
                                className="w-3.5 h-3.5 text-[#1d4ed8]"
                                aria-hidden="true"
                              />
                              <span>Lihat Dokumentasi</span>
                            </button>
                          </div>
                        </figure>

                        <div className="p-5 sm:p-6 space-y-2.5">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="font-mono-code text-xs text-slate-500">
                              <strong className="text-[#1d4ed8]">
                                {proker.code}
                              </strong>{' '}
                              · {proker.month} · {prokerDoc.archiveCode}
                            </span>
                            <StatusBadge
                              variant={getProkerBadgeVariant(proker.status)}
                              label={proker.status}
                            />
                          </div>

                          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                            {proker.name}
                          </h3>

                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                            <span className="font-semibold text-slate-800">
                              {proker.division}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span>PJ: {proker.personInCharge}</span>
                          </div>

                          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                            {proker.summary}
                          </p>
                        </div>
                      </div>

                      <div className="px-5 sm:px-6 pb-5 pt-4 border-t border-slate-100 space-y-3">
                        <div className="text-xs">
                          <span className="font-mono-code font-semibold text-slate-800">
                            Capaian / Target:{' '}
                          </span>
                          <span className="text-slate-600">
                            {proker.achievementOrTarget}
                          </span>
                        </div>

                        {(linkedEvent || (isAdmin && onDeleteProker)) && (
                          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                            {linkedEvent ? (
                              <button
                                type="button"
                                onClick={() =>
                                  onSelectEventForRegistration(linkedEvent)
                                }
                                className="min-h-[36px] px-3.5 py-1.5 bg-[#1d4ed8] hover:bg-blue-800 text-white text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 transition-colors focus-academic"
                              >
                                {!currentUser && (
                                  <Lock
                                    className="w-3.5 h-3.5"
                                    aria-hidden="true"
                                  />
                                )}
                                <span>
                                  {currentUser
                                    ? 'Daftar / Buka Tiket Proker'
                                    : 'Login & Daftar Proker'}
                                </span>
                                <ArrowRight
                                  className="w-3.5 h-3.5"
                                  aria-hidden="true"
                                />
                              </button>
                            ) : (
                              <span />
                            )}

                            {isAdmin && onDeleteProker && (
                              <button
                                type="button"
                                onClick={() =>
                                  onDeleteProker(proker.id, proker.name)
                                }
                                className="min-h-[36px] px-3 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 transition-colors"
                              >
                                <Trash2
                                  className="w-3.5 h-3.5"
                                  aria-hidden="true"
                                />
                                <span>Hapus Proker</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          )}

          {/* 4. SIAPA SAJA ANGGOTA & PENGURUS PER TAHUN PERIODE? */}
          {showAnggota && activeCabinet && (
            <section
              aria-labelledby="heading-anggota-periode"
              className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-level-1 space-y-6"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div className="space-y-1">
                  <span className="text-xs font-mono-code font-semibold text-[#1d4ed8] block">
                    ARSIP & DIREKTORI KEPENGURUSAN LINTAS ANGKATAN
                  </span>
                  <h2
                    id="heading-anggota-periode"
                    className="text-xl sm:text-2xl font-bold text-slate-900"
                  >
                    Daftar Pengurus & Anggota HIMAKA Per Tahun Periode (
                    {activeCabinet.periodYear})
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600">
                    Pilih tahun periode kepengurusan untuk melihat struktur
                    kabinet, Ketua Umum, beserta daftar lengkap anggota dan
                    jabatannya pada setiap divisi.
                  </p>
                </div>

                {/* Period Year Tabs for Member Directory */}
                <div
                  className="flex flex-wrap gap-1.5"
                  role="tablist"
                  aria-label="Pilih Tahun Periode Kepengurusan HIMAKA"
                >
                  {cabinetPeriods.map((cab) => (
                    <button
                      key={cab.periodYear}
                      type="button"
                      role="tab"
                      aria-selected={selectedPeriodYear === cab.periodYear}
                      onClick={() => setSelectedPeriodYear(cab.periodYear)}
                      className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-mono-code font-semibold border transition-all focus-academic ${
                        selectedPeriodYear === cab.periodYear
                          ? 'bg-slate-900 text-white border-slate-900 shadow-level-1'
                          : 'bg-slate-50 text-slate-700 border-slate-200/80 hover:bg-slate-100'
                      }`}
                    >
                      Periode {cab.periodYear} · {cab.cabinetName}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ringkasan Kabinet Periode Terpilih */}
              <div className="p-5 rounded-2xl bg-slate-50/90 border border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div>
                  <span className="text-[11px] font-mono-code text-slate-500 block">
                    NAMA KABINET & PERIODE
                  </span>
                  <span className="text-sm font-bold text-slate-900 block mt-0.5">
                    {activeCabinet.cabinetName} ({activeCabinet.periodYear})
                  </span>
                  <span className="text-xs text-slate-600">
                    {activeCabinet.isCurrent
                      ? 'Periode Kepengurusan Aktif'
                      : 'Arsip Purna Tugas'}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-mono-code text-slate-500 block">
                    KETUA & WAKIL KETUA UMUM
                  </span>
                  <span className="text-sm font-bold text-slate-900 block mt-0.5">
                    {activeCabinet.chairpersonName} (
                    {activeCabinet.chairpersonNim})
                  </span>
                  <span className="text-xs text-slate-600">
                    Wakil: {activeCabinet.viceChairpersonName} (
                    {activeCabinet.viceChairpersonNim})
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-mono-code text-slate-500 block">
                    DOSEN PEMBINA KEMAHASISWAAN
                  </span>
                  <span className="text-sm font-bold text-slate-900 block mt-0.5">
                    {activeCabinet.advisorName}
                  </span>
                  <span className="text-xs text-slate-600">
                    Prodi Informatika UMBY
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-mono-code text-slate-500 block">
                    TEMA KEPENGURUSAN 1 PERIODE
                  </span>
                  <span className="text-xs font-semibold text-slate-900 leading-snug block mt-0.5">
                    “{activeCabinet.theme}”
                  </span>
                </div>
              </div>

              {/* Search & Division Filter for Members */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <div className="md:col-span-6 relative">
                  <label htmlFor="member-search-input" className="sr-only">
                    Cari nama anggota, NIM, jabatan, atau angkatan
                  </label>
                  <Search
                    className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    id="member-search-input"
                    type="text"
                    value={memberSearchQuery}
                    onChange={(e) => setMemberSearchQuery(e.target.value)}
                    placeholder="Cari nama pengurus/anggota, NIM, jabatan, atau angkatan..."
                    className="w-full min-h-[44px] pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus-academic"
                  />
                </div>

                <div className="md:col-span-6 flex items-center gap-2.5">
                  <label
                    htmlFor="member-division-select"
                    className="text-xs font-semibold text-slate-700 whitespace-nowrap"
                  >
                    Divisi:
                  </label>
                  <select
                    id="member-division-select"
                    value={memberDivisionFilter}
                    onChange={(e) =>
                      setMemberDivisionFilter(
                        e.target.value as 'Semua Divisi' | HimakaDivisionName,
                      )
                    }
                    className="w-full min-h-[44px] px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus-academic"
                  >
                    {divisionOptions.map((div) => (
                      <option key={div} value={div}>
                        {div}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Desktop Table of Members per Period */}
              {filteredMembers.length > 0 ? (
                <>
                  <div className="hidden md:block overflow-x-auto border border-slate-200/80 rounded-2xl">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50/90 border-b border-slate-200/80 text-xs font-mono-code text-slate-700">
                          <th className="py-3.5 px-4 w-14">No</th>
                          <th className="py-3.5 px-4">NIM &amp; Angkatan</th>
                          <th className="py-3.5 px-4">Nama Lengkap Anggota</th>
                          <th className="py-3.5 px-4">Jabatan</th>
                          <th className="py-3.5 px-4">Divisi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs">
                        {filteredMembers.map((mem, idx) => {
                          const initials = mem.name
                            .split(' ')
                            .filter(Boolean)
                            .slice(0, 2)
                            .map((part) => part[0]?.toUpperCase() || '')
                            .join('');
                          return (
                            <tr
                              key={mem.id}
                              className="hover:bg-slate-50/80 transition-colors"
                            >
                              <td className="py-3.5 px-4 font-mono-code text-slate-500">
                                {idx + 1}
                              </td>
                              <td className="py-3.5 px-4 font-mono-code whitespace-nowrap">
                                <span className="font-semibold text-slate-900">
                                  {mem.nim}
                                </span>
                                <span
                                  className="text-slate-400 mx-1.5"
                                  aria-hidden="true"
                                >
                                  ·
                                </span>
                                <span className="text-slate-500">
                                  Angkatan {mem.cohortYear}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 font-bold text-slate-900">
                                <div className="flex items-center gap-2.5">
                                  {mem.avatarUrl ? (
                                    <img
                                      src={mem.avatarUrl}
                                      alt={`Foto ${mem.name}`}
                                      className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0 bg-slate-100"
                                    />
                                  ) : (
                                    <span
                                      aria-hidden="true"
                                      className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 text-[#1d4ed8] font-mono-code text-[11px] font-bold inline-flex items-center justify-center shrink-0"
                                    >
                                      {initials}
                                    </span>
                                  )}
                                  <span>{mem.name}</span>
                                </div>
                              </td>
                              <td className="py-3.5 px-4 font-semibold text-[#1d4ed8]">
                                {mem.roleTitle}
                              </td>
                              <td className="py-3.5 px-4 text-slate-600">
                                {mem.division}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Stacked Cards of Members per Period */}
                  <div className="md:hidden divide-y divide-slate-200/80 border border-slate-200/80 rounded-2xl bg-white overflow-hidden">
                    {filteredMembers.map((mem, idx) => {
                      const initials = mem.name
                        .split(' ')
                        .filter(Boolean)
                        .slice(0, 2)
                        .map((part) => part[0]?.toUpperCase() || '')
                        .join('');
                      return (
                        <div
                          key={mem.id}
                          className="p-4 flex items-center gap-3 text-xs"
                        >
                          {mem.avatarUrl ? (
                            <img
                              src={mem.avatarUrl}
                              alt={`Foto ${mem.name}`}
                              className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0 bg-slate-100"
                            />
                          ) : (
                            <span
                              aria-hidden="true"
                              className="w-10 h-10 rounded-full bg-blue-50 border border-blue-200 text-[#1d4ed8] font-mono-code text-xs font-bold inline-flex items-center justify-center shrink-0"
                            >
                              {initials}
                            </span>
                          )}
                          <div className="space-y-0.5 flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 font-mono-code text-slate-500">
                              <span className="font-semibold text-[#1d4ed8]">
                                #{idx + 1} · NIM {mem.nim}
                              </span>
                              <span>Angkatan {mem.cohortYear}</span>
                            </div>
                            <p className="text-sm font-bold text-slate-900 truncate">
                              {mem.name}
                            </p>
                            <p className="font-semibold text-slate-800">
                              {mem.roleTitle}{' '}
                              <span className="font-normal text-slate-500">
                                · {mem.division}
                              </span>
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="p-8 text-center bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
                  <p className="text-sm font-bold text-slate-900">
                    Tidak ditemukan anggota pada periode{' '}
                    {activeCabinet.periodYear} dengan filter tersebut
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setMemberDivisionFilter('Semua Divisi');
                      setMemberSearchQuery('');
                    }}
                    className="min-h-[40px] px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl"
                  >
                    Tampilkan Seluruh Anggota Periode {activeCabinet.periodYear}
                  </button>
                </div>
              )}
            </section>
          )}

          {/* 4B. GALERI & ARSIP DOKUMENTASI VISUAL INFORMASI KEGIATAN HIMAKA */}
          {showDokumentasi && (
            <section
              aria-labelledby="heading-galeri-dokumentasi"
              className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-level-1 space-y-6"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div className="space-y-1">
                  <span className="text-xs font-mono-code font-semibold text-[#1d4ed8] block">
                    ARSIP VISUAL & DOKUMENTASI INFORMASI MEDINFO HIMAKA
                  </span>
                  <h2
                    id="heading-galeri-dokumentasi"
                    className="text-xl sm:text-2xl font-bold text-slate-900"
                  >
                    Galeri Dokumentasi Kegiatan & Informasi HIMAKA UMBY
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-3xl">
                    Dokumentasi visual kegiatan akademik informatika, kunjungan
                    industri teknologi, pengabdian desa mitra digitalisasi UMKM,
                    workshop cloud &amp; jaringan, serta sidang pleno
                    organisasi. Klik kartu untuk membuka detail dokumentasi
                    ukuran penuh.
                  </p>
                </div>

                <div
                  className="flex flex-wrap gap-1.5"
                  role="tablist"
                  aria-label="Filter Kategori Dokumentasi"
                >
                  {galleryCategories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      role="tab"
                      aria-selected={galleryCategoryFilter === cat}
                      onClick={() => setGalleryCategoryFilter(cat)}
                      className={`min-h-[36px] px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        galleryCategoryFilter === cat
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-slate-50 text-slate-700 border-slate-200/80 hover:bg-slate-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {filteredGallery.map((doc) => (
                  <figure
                    key={doc.id}
                    className="group rounded-2xl bg-white border border-slate-200/80 hover:border-slate-300 overflow-hidden flex flex-col justify-between transition-all"
                  >
                    <div>
                      <div className="aspect-video w-full bg-slate-100 border-b border-slate-100 overflow-hidden">
                        <img
                          src={doc.imageUrl}
                          alt={doc.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                        />
                      </div>

                      <figcaption className="p-4 space-y-1.5">
                        <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono-code text-slate-500">
                          <span className="text-[#1d4ed8] font-semibold">
                            {doc.archiveCode}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{doc.category}</span>
                          <span aria-hidden="true">·</span>
                          <span>{doc.date}</span>
                        </div>
                        <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                          {doc.title}
                        </h3>
                        <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                          {doc.caption}
                        </p>
                      </figcaption>
                    </div>

                    <div className="px-4 pb-4 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono-code text-slate-500 truncate">
                        Foto: {doc.photographer}
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
                        {isAdmin && onDeleteDocumentationMedia && (
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
          )}

          {/* 5. PORTAL BERITA KEGIATAN HIMAKA DISERTAI GAMBAR DOKUMENTASI & SIDEBAR PENDAFTARAN */}
          {showBerita && (
            <section
              aria-labelledby="heading-berita-kegiatan"
              className="space-y-6"
            >
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-level-1 space-y-5">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 border-b border-slate-200/80 pb-4">
                  <div className="space-y-1">
                    <span className="text-xs font-mono-code font-semibold tracking-wider text-[#1d4ed8] block">
                      REDAKSI WARTA &amp; DOKUMENTASI KEGIATAN
                    </span>
                    <h2
                      id="heading-berita-kegiatan"
                      className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight"
                    >
                      Berita Kegiatan &amp; Liputan HIMAKA UMBY
                    </h2>
                  </div>
                  <span className="text-xs font-mono-code text-slate-500">
                    Divisi Media &amp; Informasi (Medinfo) ·{' '}
                    {newsArticles.length} Artikel
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-5 relative">
                    <label htmlFor="news-search-input" className="sr-only">
                      Cari berita kegiatan HIMAKA
                    </label>
                    <Search
                      className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                      aria-hidden="true"
                    />
                    <input
                      id="news-search-input"
                      type="text"
                      value={newsSearchQuery}
                      onChange={(e) => setNewsSearchQuery(e.target.value)}
                      placeholder="Cari liputan kegiatan, divisi, atau lokasi..."
                      className="w-full min-h-[42px] pl-10 pr-4 py-2 bg-slate-50/70 focus:bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus-academic transition-colors"
                    />
                  </div>

                  <div
                    className="md:col-span-7 flex flex-wrap gap-1.5"
                    role="tablist"
                    aria-label="Kategori Berita HIMAKA"
                  >
                    {newsCategories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        role="tab"
                        aria-selected={selectedNewsCategory === cat}
                        onClick={() => setSelectedNewsCategory(cat)}
                        className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all whitespace-nowrap focus-academic ${
                          selectedNewsCategory === cat
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

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-8 space-y-6">
                  {leadArticle
                    ? (() => {
                        const leadDoc = getDocumentationForNews(leadArticle);
                        return (
                          <article className="bg-white border border-slate-200/80 rounded-2xl shadow-level-1 overflow-hidden">
                            {/* Featured Documentation Image for Lead News Article */}
                            <figure className="border-b border-slate-200/80 bg-slate-50">
                              <div className="relative aspect-video w-full bg-slate-100 overflow-hidden group">
                                <img
                                  src={leadDoc.imageUrl}
                                  alt={leadArticle.title}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-300"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    setPreviewDoc({
                                      id: leadArticle.id,
                                      archiveCode: leadDoc.archiveCode,
                                      title: leadArticle.title,
                                      category: leadArticle.category,
                                      periodYear: selectedPeriodYear,
                                      date: leadArticle.publishedAt,
                                      location: leadArticle.location,
                                      division: leadArticle.division,
                                      photographer: leadDoc.photographer,
                                      imageUrl: leadDoc.imageUrl,
                                      caption: leadDoc.imageCaption,
                                      relatedEventId:
                                        leadArticle.relatedEventId,
                                    })
                                  }
                                  className="absolute bottom-3.5 right-3.5 min-h-[36px] px-3.5 py-1.5 rounded-xl bg-white/95 hover:bg-white text-slate-900 border border-slate-200 text-xs font-semibold inline-flex items-center gap-1.5 shadow-xs transition-all"
                                >
                                  <Maximize2
                                    className="w-3.5 h-3.5 text-[#1d4ed8]"
                                    aria-hidden="true"
                                  />
                                  <span>Perbesar Foto</span>
                                </button>
                              </div>
                            </figure>

                            <div className="p-6 sm:p-8 space-y-4">
                              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono-code text-slate-500">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="font-semibold text-[#1d4ed8]">
                                    LIPUTAN UTAMA · {leadArticle.code}
                                  </span>
                                  <span aria-hidden="true">·</span>
                                  <span>{leadArticle.category}</span>
                                  <span aria-hidden="true">·</span>
                                  <span>{leadDoc.archiveCode}</span>
                                </div>
                                <span>
                                  {leadArticle.publishedAt} ·{' '}
                                  {leadArticle.readTimeMinutes} mnt baca
                                </span>
                              </div>

                              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug tracking-tight">
                                <button
                                  type="button"
                                  onClick={() => setReadingArticle(leadArticle)}
                                  className="text-left hover:text-[#1d4ed8] transition-colors focus-academic rounded"
                                >
                                  {leadArticle.title}
                                </button>
                              </h3>

                              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                                <span className="font-semibold text-slate-800">
                                  Oleh: {leadArticle.author} (
                                  {leadArticle.division})
                                </span>
                                <span aria-hidden="true">·</span>
                                <span>Lokasi: {leadArticle.location}</span>
                              </div>

                              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                                {leadArticle.summary}
                              </p>

                              <div className="pt-4 border-t border-slate-100 space-y-1.5">
                                <span className="text-xs font-mono-code font-semibold text-slate-900 block">
                                  Sorotan Hasil Kegiatan:
                                </span>
                                <ul className="space-y-1 text-xs text-slate-600 list-disc pl-5">
                                  {leadArticle.keyHighlights.map(
                                    (item, idx) => (
                                      <li key={idx}>{item}</li>
                                    ),
                                  )}
                                </ul>
                              </div>

                              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                                <div className="flex flex-wrap items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setReadingArticle(leadArticle)
                                    }
                                    className="min-h-[42px] px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl inline-flex items-center gap-2 transition-colors focus-academic"
                                  >
                                    <BookOpen
                                      className="w-4 h-4"
                                      aria-hidden="true"
                                    />
                                    <span>Baca Liputan Lengkap</span>
                                  </button>

                                  {leadArticle.relatedEventId && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const rel = events.find(
                                          (e) =>
                                            e.id === leadArticle.relatedEventId,
                                        );
                                        if (rel)
                                          onSelectEventForRegistration(rel);
                                      }}
                                      className="min-h-[42px] px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 text-xs font-semibold rounded-xl inline-flex items-center gap-2 transition-colors focus-academic"
                                    >
                                      <span>Daftar Proker Terkait</span>
                                      <ArrowRight
                                        className="w-4 h-4 text-[#1d4ed8]"
                                        aria-hidden="true"
                                      />
                                    </button>
                                  )}
                                </div>

                                {isAdmin && onDeleteNewsArticle && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      onDeleteNewsArticle(
                                        leadArticle.id,
                                        leadArticle.title,
                                      )
                                    }
                                    aria-label={`Hapus berita ${leadArticle.title}`}
                                    className="min-h-[40px] px-3.5 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 transition-colors"
                                  >
                                    <Trash2
                                      className="w-3.5 h-3.5"
                                      aria-hidden="true"
                                    />
                                    <span>Hapus Berita</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          </article>
                        );
                      })()
                    : null}

                  {secondaryArticles.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {secondaryArticles.map((article) => {
                        const artDoc = getDocumentationForNews(article);
                        return (
                          <article
                            key={article.id}
                            className="bg-white border border-slate-200/80 hover:border-slate-300 rounded-2xl overflow-hidden flex flex-col justify-between transition-all"
                          >
                            <div>
                              <div className="aspect-video w-full bg-slate-100 border-b border-slate-200/80 overflow-hidden group">
                                <img
                                  src={artDoc.imageUrl}
                                  alt={article.title}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                                />
                              </div>

                              <div className="p-5 space-y-2">
                                <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono-code text-slate-500">
                                  <span className="font-semibold text-[#1d4ed8]">
                                    {article.category}
                                  </span>
                                  <span aria-hidden="true">·</span>
                                  <span>{article.publishedAt}</span>
                                </div>

                                <h4 className="text-base font-bold text-slate-900 leading-snug">
                                  <button
                                    type="button"
                                    onClick={() => setReadingArticle(article)}
                                    className="text-left hover:text-[#1d4ed8] transition-colors focus-academic rounded"
                                  >
                                    {article.title}
                                  </button>
                                </h4>

                                <p className="text-xs text-slate-600 leading-relaxed">
                                  {article.summary}
                                </p>
                              </div>
                            </div>

                            <div className="px-5 pb-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                              <span className="text-slate-500 truncate">
                                {article.division}
                              </span>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => setReadingArticle(article)}
                                  className="min-h-[34px] px-3 py-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 font-semibold rounded-lg inline-flex items-center gap-1 transition-colors focus-academic"
                                >
                                  <span>Baca</span>
                                  <ArrowRight
                                    className="w-3.5 h-3.5 text-[#1d4ed8]"
                                    aria-hidden="true"
                                  />
                                </button>
                                {isAdmin && onDeleteNewsArticle && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      onDeleteNewsArticle(
                                        article.id,
                                        article.title,
                                      )
                                    }
                                    aria-label={`Hapus berita ${article.title}`}
                                    className="min-h-[34px] px-2.5 py-1 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 font-semibold rounded-lg inline-flex items-center gap-1 transition-colors"
                                  >
                                    <Trash2
                                      className="w-3 h-3"
                                      aria-hidden="true"
                                    />
                                    <span>Hapus</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Right Sidebar: Fitur Ticketing Proker & Pengumuman (Flattened with hairline dividers) */}
                <aside className="lg:col-span-4 space-y-6">
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-level-1 space-y-4">
                    <div className="border-b border-slate-200/80 pb-3.5">
                      <span className="text-xs font-mono-code font-semibold text-[#1d4ed8] block">
                        E-TICKETING PROKER HIMAKA
                      </span>
                      <h3 className="text-base font-bold text-slate-900 mt-0.5">
                        Pendaftaran Seminar &amp; Lomba
                      </h3>
                    </div>

                    <div className="divide-y divide-slate-200/80">
                      {events.map((ev) => {
                        const soldOut = isEventSoldOut(ev) || !ev.isOpen;
                        const minPrice = Math.min(
                          ...ev.tiers.map((t) => t.price),
                        );
                        return (
                          <div
                            key={ev.id}
                            className="py-4 first:pt-0 last:pb-0 space-y-2"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-mono-code text-xs text-slate-500">
                                <strong className="text-[#1d4ed8]">
                                  {ev.code}
                                </strong>{' '}
                                · {ev.date} · {ev.skpPoints}
                              </span>
                              {soldOut ? (
                                <StatusBadge variant="neutral" label="HABIS" />
                              ) : (
                                <StatusBadge variant="success" label="BUKA" />
                              )}
                            </div>

                            <h4 className="text-sm font-bold text-slate-900 leading-snug">
                              {ev.title}
                            </h4>

                            <div className="flex items-center justify-between gap-2 pt-1">
                              <span className="text-xs text-slate-900 font-mono-code font-semibold">
                                Mulai {formatRupiah(minPrice)}
                              </span>
                              <button
                                type="button"
                                onClick={() => onSelectEventForRegistration(ev)}
                                className="min-h-[36px] px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 transition-colors focus-academic"
                              >
                                {!currentUser && (
                                  <Lock
                                    className="w-3 h-3"
                                    aria-hidden="true"
                                  />
                                )}
                                <span>
                                  {currentUser
                                    ? 'Pilih Tier'
                                    : 'Login & Daftar'}
                                </span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Pengumuman Medinfo (Flattened with hairline dividers) */}
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-level-1 space-y-3.5">
                    <h3 className="text-base font-bold text-slate-900 border-b border-slate-200/80 pb-3">
                      Papan Informasi Medinfo
                    </h3>
                    <div className="divide-y divide-slate-200/80">
                      {announcements
                        .filter((a) => a.isActive)
                        .map((ann) => (
                          <div
                            key={ann.id}
                            className="py-3.5 first:pt-0 last:pb-0 space-y-1 text-xs"
                          >
                            <span className="font-mono-code font-semibold text-[#1d4ed8] block">
                              {ann.category.toUpperCase()} · {ann.updatedAt}
                            </span>
                            <p className="font-bold text-slate-900">
                              {ann.title}
                            </p>
                            <p className="text-slate-600 leading-relaxed">
                              {ann.content}
                            </p>
                          </div>
                        ))}
                    </div>
                  </div>
                </aside>
              </div>
            </section>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Full Article Reader Modal (Dilengkapi Gambar Dokumentasi) */}
      <AcademicModal
        isOpen={Boolean(readingArticle)}
        onClose={() => setReadingArticle(null)}
        title={readingArticle?.title || ''}
        subtitle={
          readingArticle
            ? `${readingArticle.code} · ${readingArticle.publishedAt} · ${readingArticle.division}`
            : ''
        }
      >
        {readingArticle &&
          (() => {
            const modalDoc = getDocumentationForNews(readingArticle);
            return (
              <div className="space-y-5 text-sm text-slate-600">
                <figure className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                  <div className="aspect-video w-full bg-slate-100 overflow-hidden">
                    <img
                      src={modalDoc.imageUrl}
                      alt={readingArticle.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <figcaption className="p-3.5 text-xs bg-white border-t border-slate-200 space-y-1">
                    <div className="flex flex-wrap items-center justify-between gap-2 font-mono-code">
                      <span className="font-semibold text-[#1d4ed8]">
                        ARSIP DOKUMENTASI: {modalDoc.archiveCode}
                      </span>
                      <span className="text-slate-500">
                        Fotografer: {modalDoc.photographer}
                      </span>
                    </div>
                    <p className="text-slate-600">{modalDoc.imageCaption}</p>
                  </figcaption>
                </figure>

                <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/80 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-900">
                  <span>
                    Penulis: <strong>{readingArticle.author}</strong> (
                    {readingArticle.division})
                  </span>
                  <span className="font-mono-code text-slate-600">
                    Lokasi: {readingArticle.location}
                  </span>
                </div>

                <div className="space-y-3.5 leading-relaxed">
                  {readingArticle.bodyParagraphs.map((para, idx) => (
                    <p
                      key={idx}
                      className={
                        idx === 0
                          ? 'first-letter:text-3xl first-letter:font-bold first-letter:text-slate-900 first-letter:mr-1.5'
                          : ''
                      }
                    >
                      {para}
                    </p>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="text-xs font-mono-code font-semibold text-slate-900 block">
                    RINGKASAN CAPAIAN KEGIATAN:
                  </span>
                  <ul className="space-y-1 text-xs list-disc pl-5">
                    {readingArticle.keyHighlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>

                <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setReadingArticle(null)}
                    className="min-h-[42px] px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 text-xs font-semibold rounded-xl transition-colors"
                  >
                    Tutup Artikel
                  </button>

                  {readingArticle.relatedEventId && (
                    <button
                      type="button"
                      onClick={() => {
                        const rel = events.find(
                          (e) => e.id === readingArticle.relatedEventId,
                        );
                        setReadingArticle(null);
                        if (rel) onSelectEventForRegistration(rel);
                      }}
                      className="min-h-[42px] px-4 py-2 bg-[#1d4ed8] hover:bg-[#1e40af] text-white text-xs font-semibold rounded-xl inline-flex items-center gap-2 transition-colors shadow-xs"
                    >
                      <span>Daftar Proker Terkait Ini</span>
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </button>
                  )}
                </div>
              </div>
            );
          })()}
      </AcademicModal>

      {/* Lightbox Modal Detail Dokumentasi Visual HIMAKA */}
      <AcademicModal
        isOpen={Boolean(previewDoc)}
        onClose={() => setPreviewDoc(null)}
        title={previewDoc?.title || 'Detail Dokumentasi Kegiatan HIMAKA'}
        subtitle={
          previewDoc
            ? `${previewDoc.archiveCode} · ${previewDoc.category} · Periode ${previewDoc.periodYear}`
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

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono-code text-slate-900">
                <div>
                  <span className="text-slate-500 block text-[11px]">
                    KODE ARSIP MEDINFO:
                  </span>
                  <strong>{previewDoc.archiveCode}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">
                    TANGGAL & LOKASI:
                  </span>
                  <strong>
                    {previewDoc.date} · {previewDoc.location}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">
                    DIVISI PENANGGUNG JAWAB:
                  </span>
                  <strong>{previewDoc.division}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">
                    DOKUMENTATOR / FOTOGRAFER:
                  </span>
                  <strong>{previewDoc.photographer}</strong>
                </div>
              </div>

              <div className="pt-2.5 border-t border-slate-200">
                <span className="font-mono-code font-semibold text-slate-900 block mb-1">
                  NARASI DOKUMENTASI KEGIATAN:
                </span>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {previewDoc.caption}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="min-h-[42px] px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 text-xs font-semibold rounded-xl transition-colors"
              >
                Tutup Pratinjau Foto
              </button>

              {previewDoc.relatedEventId && (
                <button
                  type="button"
                  onClick={() => {
                    const rel = events.find(
                      (e) => e.id === previewDoc.relatedEventId,
                    );
                    setPreviewDoc(null);
                    if (rel) onSelectEventForRegistration(rel);
                  }}
                  className="min-h-[42px] px-4 py-2 bg-[#1d4ed8] hover:bg-[#1e40af] text-white text-xs font-semibold rounded-xl inline-flex items-center gap-2 transition-colors shadow-xs"
                >
                  <span>Buka Proker Terkait</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        )}
      </AcademicModal>
    </div>
  );
}

interface AuthGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  gateMessage?: string | null;
  users: HimakaUser[];
  onLoginSuccess: (user: HimakaUser) => void;
  onRegisterSuccess: (user: HimakaUser) => void;
}

export function AuthGateModal({
  isOpen,
  onClose,
  gateMessage,
  users,
  onLoginSuccess,
  onRegisterSuccess,
}: AuthGateModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Login State
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Register State
  const [regName, setRegName] = useState('');
  const [regNim, setRegNim] = useState('');
  const [regFaculty, setRegFaculty] = useState('Informatika UMBY');
  const [regEmail, setRegEmail] = useState('');
  const [regWhatsapp, setRegWhatsapp] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regErrors, setRegErrors] = useState<Record<string, string>>({});

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = authenticateUser(users, identifier, password);
    if (res.error || !res.user) {
      setLoginError(res.error || 'Gagal masuk.');
      return;
    }
    setLoginError(null);
    onLoginSuccess(res.user);
  };

  const handleQuickDemoLogin = () => {
    const demoUser = users.find((u) => u.role === 'peserta') || users[0];
    if (demoUser) {
      setIdentifier(demoUser.nim);
      setPassword(demoUser.password);
      setLoginError(null);
      onLoginSuccess(demoUser);
    }
  };

  const handleQuickAdminLogin = () => {
    const adminUser =
      users.find((u) => u.role === 'pengurus') ||
      users.find((u) => u.nim === '220710164');
    if (adminUser) {
      setIdentifier(adminUser.nim);
      setPassword(adminUser.password);
      setLoginError(null);
      onLoginSuccess(adminUser);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = registerNewUser(users, {
      name: regName,
      nim: regNim,
      faculty: regFaculty,
      email: regEmail,
      whatsapp: regWhatsapp,
      password: regPassword,
    });
    if (res.errors || !res.user) {
      setRegErrors(res.errors || {});
      return;
    }
    setRegErrors({});
    onRegisterSuccess(res.user);
  };

  const handleFillDemoRegister = () => {
    const randomNum = Math.floor(100 + Math.random() * 899);
    setRegName('Rizky Pratama Wijaya');
    setRegNim(`240710${randomNum}`);
    setRegFaculty('Informatika UMBY');
    setRegEmail(`rizky.wijaya${randomNum}@student.mercubuana-yogya.ac.id`);
    setRegWhatsapp('081234998877');
    setRegPassword('himaka2025');
    setRegErrors({});
  };

  return (
    <AcademicModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        mode === 'login'
          ? 'Login Portal HIMAKA UMBY (User / Admin)'
          : 'Register Akun Mahasiswa Baru (Portal User)'
      }
      subtitle="Pilih masuk ke Portal User (Mahasiswa/Peserta) atau Portal Admin (Pengurus HIMAKA)"
    >
      <div className="space-y-5">
        {gateMessage && (
          <div
            role="alert"
            className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5"
          >
            <Lock
              className="w-4 h-4 shrink-0 mt-0.5 text-amber-700"
              aria-hidden="true"
            />
            <div>
              <span className="font-semibold block">
                Autentikasi Diperlukan Sebelum Mendaftar
              </span>
              <span>{gateMessage}</span>
            </div>
          </div>
        )}

        {/* Mode Switcher Tabs (Login vs Register) */}
        <div
          className="grid grid-cols-2 p-1 bg-slate-100 border border-slate-200/80 rounded-xl"
          role="tablist"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'login'}
            onClick={() => {
              setMode('login');
              setLoginError(null);
            }}
            className={`min-h-[40px] px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              mode === 'login'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            Login Akun Terdaftar
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'register'}
            onClick={() => {
              setMode('register');
              setRegErrors({});
            }}
            className={`min-h-[40px] px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              mode === 'register'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            Register Akun Baru
          </button>
        </div>

        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} noValidate className="space-y-4">
            {loginError && (
              <div
                role="alert"
                className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs"
              >
                {loginError}
              </div>
            )}

            <div>
              <label
                htmlFor="auth-login-id"
                className="block text-sm font-medium text-slate-900 mb-1.5"
              >
                NIM atau Alamat Email Kampus *
              </label>
              <input
                id="auth-login-id"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="User: 220710142 | Admin: 220710164"
                className="w-full min-h-[44px] px-3.5 py-2 bg-slate-50/70 focus:bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus-academic transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="auth-login-pass"
                className="block text-sm font-medium text-slate-900 mb-1.5"
              >
                Kata Sandi *
              </label>
              <input
                id="auth-login-pass"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Demo User: himaka2025 | Demo Admin: admin2025"
                className="w-full min-h-[44px] px-3.5 py-2 bg-slate-50/70 focus:bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus-academic transition-colors"
              />
            </div>

            {/* Quick Demo Login Buttons for Portal 2 (User) & Portal 3 (Admin) */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <span className="text-[11px] font-mono-code font-semibold uppercase tracking-wider text-slate-700 block">
                AKSES CEPAT AKUN DEMO:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleQuickDemoLogin}
                  className="min-h-[40px] px-3 py-2 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100/70 text-emerald-800 text-xs font-semibold rounded-xl transition-colors focus-academic text-left"
                >
                  Masuk Portal User (Nadia · 220710142)
                </button>
                <button
                  type="button"
                  onClick={handleQuickAdminLogin}
                  className="min-h-[40px] px-3 py-2 bg-blue-50 border border-blue-200 hover:bg-blue-100/70 text-[#1d4ed8] text-xs font-semibold rounded-xl transition-colors focus-academic text-left"
                >
                  Masuk Portal Admin (Pengurus · 220710164)
                </button>
              </div>
            </div>

            <div className="pt-1 flex justify-end">
              <button
                type="submit"
                className="min-h-[44px] px-6 py-2 bg-[#1d4ed8] hover:bg-[#1e40af] text-white text-xs font-semibold rounded-xl inline-flex items-center justify-center gap-2 transition-colors focus-academic shadow-xs"
              >
                <LogIn className="w-4 h-4" aria-hidden="true" />
                <span>Masuk Sekarang</span>
              </button>
            </div>
          </form>
        ) : (
          <form
            onSubmit={handleRegisterSubmit}
            noValidate
            className="space-y-4"
          >
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleFillDemoRegister}
                className="min-h-[36px] px-3 py-1.5 bg-slate-100 border border-slate-200 hover:bg-slate-200/70 text-slate-900 text-xs font-semibold rounded-xl transition-colors"
              >
                Isi Otomatis Data Register Demo
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label
                  htmlFor="reg-name"
                  className="block text-sm font-medium text-slate-900 mb-1"
                >
                  Nama Lengkap Sesuai KTM *
                </label>
                <input
                  id="reg-name"
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Nama lengkap mahasiswa"
                  className="w-full min-h-[44px] px-3.5 py-2 bg-slate-50/70 focus:bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus-academic transition-colors"
                />
                {regErrors.name && (
                  <p className="mt-1 text-xs text-rose-700">{regErrors.name}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="reg-nim"
                  className="block text-sm font-medium text-slate-900 mb-1"
                >
                  NIM / Nomor Identitas *
                </label>
                <input
                  id="reg-nim"
                  type="text"
                  value={regNim}
                  onChange={(e) => setRegNim(e.target.value)}
                  placeholder="Contoh: 240710333"
                  className="w-full min-h-[44px] px-3.5 py-2 bg-slate-50/70 focus:bg-white border border-slate-200 rounded-xl font-mono-code text-sm text-slate-900 focus-academic transition-colors"
                />
                {regErrors.nim && (
                  <p className="mt-1 text-xs text-rose-700">{regErrors.nim}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="reg-faculty"
                  className="block text-sm font-medium text-slate-900 mb-1"
                >
                  Program Studi / Instansi *
                </label>
                <input
                  id="reg-faculty"
                  type="text"
                  value={regFaculty}
                  onChange={(e) => setRegFaculty(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2 bg-slate-50/70 focus:bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus-academic transition-colors"
                />
                {regErrors.faculty && (
                  <p className="mt-1 text-xs text-rose-700">
                    {regErrors.faculty}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="reg-wa"
                  className="block text-sm font-medium text-slate-900 mb-1"
                >
                  Nomor WhatsApp Aktif *
                </label>
                <input
                  id="reg-wa"
                  type="tel"
                  value={regWhatsapp}
                  onChange={(e) => setRegWhatsapp(e.target.value)}
                  placeholder="081234567890"
                  className="w-full min-h-[44px] px-3.5 py-2 bg-slate-50/70 focus:bg-white border border-slate-200 rounded-xl font-mono-code text-sm text-slate-900 focus-academic transition-colors"
                />
                {regErrors.whatsapp && (
                  <p className="mt-1 text-xs text-rose-700">
                    {regErrors.whatsapp}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="reg-email"
                  className="block text-sm font-medium text-slate-900 mb-1"
                >
                  Email Mahasiswa / Personal *
                </label>
                <input
                  id="reg-email"
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="nama@student.mercubuana-yogya.ac.id"
                  className="w-full min-h-[44px] px-3.5 py-2 bg-slate-50/70 focus:bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus-academic transition-colors"
                />
                {regErrors.email && (
                  <p className="mt-1 text-xs text-rose-700">
                    {regErrors.email}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="reg-pass"
                  className="block text-sm font-medium text-slate-900 mb-1"
                >
                  Buat Kata Sandi (Min. 6 Karakter) *
                </label>
                <input
                  id="reg-pass"
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full min-h-[44px] px-3.5 py-2 bg-slate-50/70 focus:bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus-academic transition-colors"
                />
                {regErrors.password && (
                  <p className="mt-1 text-xs text-rose-700">
                    {regErrors.password}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="min-h-[44px] px-6 py-2 bg-[#1d4ed8] hover:bg-[#1e40af] text-white text-xs font-semibold rounded-xl inline-flex items-center gap-2 transition-colors focus-academic shadow-xs"
              >
                <UserPlus className="w-4 h-4" aria-hidden="true" />
                <span>Register & Lanjutkan</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </AcademicModal>
  );
}
