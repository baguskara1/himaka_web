'use client';

import React, { useState } from 'react';
import {
  CalendarPlus,
  Camera,
  Edit3,
  Newspaper,
  Plus,
  Save,
  Ticket,
  Trash2,
  Upload,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import {
  AcademicEvent,
  CabinetMemberInput,
  CreateAcademicEventInput,
  HimakaCabinetPeriod,
  HimakaDivisionName,
  HimakaDocumentationItem,
  HimakaNewsArticle,
  HimakaPeriodMember,
  HimakaProkerItem,
  MedinfoAfterProkerDocInput,
  MedinfoAnnouncement,
  MedinfoConfig,
  MedinfoNewsInput,
  MedinfoUpcomingProkerInput,
  NewsCategory,
  PRESET_MEDINFO_MEDIA_ASSETS,
  ProkerStatus,
  RegistrationMode,
  UpdateAcademicEventInput,
  formatRupiah,
  getDocumentationForNews,
  getDocumentationForProker,
} from '@/lib/ticketing-core';
import { ScanDecisionBadge, StatusBadge } from './ui-primitives';

interface MedinfoAndSpecsProps {
  medinfo: MedinfoConfig;
  events: AcademicEvent[];
  cabinetPeriods: HimakaCabinetPeriod[];
  documentationGallery: HimakaDocumentationItem[];
  newsArticles: HimakaNewsArticle[];
  onPublishUpcomingProker: (input: MedinfoUpcomingProkerInput) => void;
  onUpdateProker?: (
    prokerId: string,
    input: Partial<MedinfoUpcomingProkerInput>,
  ) => void;
  onUploadAfterProkerDoc: (input: MedinfoAfterProkerDocInput) => void;
  onPublishStandaloneNews: (input: MedinfoNewsInput) => void;
  onUpdateNewsArticle?: (
    newsId: string,
    input: Partial<MedinfoNewsInput>,
  ) => void;
  onDeleteNewsArticle: (newsId: string, title?: string) => void;
  onDeleteDocumentationMedia: (docId: string, title?: string) => void;
  onDeleteProker: (prokerId: string, name?: string) => void;
  onAddCabinetMember?: (input: CabinetMemberInput) => void;
  onUpdateCabinetMember?: (
    memberId: string,
    input: Partial<CabinetMemberInput>,
  ) => void;
  onDeleteCabinetMember?: (memberId: string, name?: string) => void;
  onCreateAcademicEvent?: (input: CreateAcademicEventInput) => void;
  onUpdateAcademicEvent?: (
    eventId: string,
    input: UpdateAcademicEventInput,
  ) => void;
  onUpdateMedinfo: (next: MedinfoConfig) => void;
  onToggleEventOpen: (eventId: string) => void;
  onNotify: (msg: string, type?: 'success' | 'warning' | 'danger') => void;
}

export function MedinfoView({
  medinfo,
  events,
  cabinetPeriods,
  documentationGallery,
  newsArticles,
  onPublishUpcomingProker,
  onUpdateProker,
  onUploadAfterProkerDoc,
  onPublishStandaloneNews,
  onUpdateNewsArticle,
  onDeleteNewsArticle,
  onDeleteDocumentationMedia,
  onDeleteProker,
  onAddCabinetMember,
  onUpdateCabinetMember,
  onDeleteCabinetMember,
  onCreateAcademicEvent,
  onUpdateAcademicEvent,
  onUpdateMedinfo,
  onToggleEventOpen,
  onNotify,
}: MedinfoAndSpecsProps) {
  const [subTab, setSubTab] = useState<
    | 'proker-media'
    | 'berita-galeri'
    | 'pengurus-2026'
    | 'kelola-acara'
    | 'cms'
    | 'specs'
  >('proker-media');
  const [workflowPhase, setWorkflowPhase] = useState<
    'pre-proker' | 'after-proker'
  >('pre-proker');

  const activeCabinet = cabinetPeriods[0];
  const allCurrentProkers = activeCabinet?.prokers || [];
  const allCurrentMembers = activeCabinet?.members || [];

  // --- STATE TAHAP 1: POST / EDIT PROKER (PRE-PROKER & UPLOAD POSTER/MEDIA) ---
  const [editingProkerId, setEditingProkerId] = useState<string | null>(null);
  const [prokerName, setProkerName] = useState('');
  const [prokerDivision, setProkerDivision] = useState<HimakaDivisionName>(
    'Divisi Media & Informasi (Medinfo)',
  );
  const [prokerMonth, setProkerMonth] = useState('Desember 2026');
  const [prokerCategory, setProkerCategory] = useState(
    'Klinik & Bootcamp Informatika',
  );
  const [prokerStatus, setProkerStatus] = useState<ProkerStatus>('AKAN DATANG');
  const [prokerPic, setProkerPic] = useState(
    'Rio Ardiyansyah (Anggota Medinfo)',
  );
  const [prokerSummary, setProkerSummary] = useState('');
  const [prokerTarget, setProkerTarget] = useState('');
  const [prokerMediaUrl, setProkerMediaUrl] = useState(
    PRESET_MEDINFO_MEDIA_ASSETS[0].imageUrl,
  );
  const [prokerMediaFileName, setProkerMediaFileName] = useState<string>('');
  const [prokerMediaCaption, setProkerMediaCaption] = useState(
    'Poster & media publikasi resmi proker kedepan oleh Divisi Medinfo HIMAKA UMBY 2026.',
  );
  const [alsoPostAnnouncement, setAlsoPostAnnouncement] = useState(true);

  // --- STATE TAHAP 2: UPLOAD DOKUMENTASI AFTER-PROKER (PASCA KEGIATAN) ---
  const [selectedProkerId, setSelectedProkerId] = useState<string>(
    allCurrentProkers.find((p) => p.status !== 'TERLAKSANA')?.id ||
      allCurrentProkers[0]?.id ||
      'prk-25-05',
  );
  const [afterDocTitle, setAfterDocTitle] = useState('');
  const [afterDocDate, setAfterDocDate] = useState('25 Oktober 2026');
  const [afterDocLocation, setAfterDocLocation] = useState(
    'Auditorium & Lab Komputasi Kampus 3 UMBY',
  );
  const [afterDocPhotographer, setAfterDocPhotographer] = useState(
    'Rio Ardiyansyah (Tim Dokumentasi Medinfo)',
  );
  const [afterDocMediaUrl, setAfterDocMediaUrl] = useState(
    PRESET_MEDINFO_MEDIA_ASSETS[3].imageUrl,
  );
  const [afterDocFileName, setAfterDocFileName] = useState<string>('');
  const [afterDocCaption, setAfterDocCaption] = useState('');
  const [markProkerCompleted, setMarkProkerCompleted] = useState(true);
  const [updatedAchievement, setUpdatedAchievement] = useState('');
  const [alsoPublishNews, setAlsoPublishNews] = useState(true);

  // Form state for standalone news article (and editing existing news)
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  const [newsTitle, setNewsTitle] = useState('');
  const [newsCategory, setNewsCategory] = useState<NewsCategory>(
    'Jurnalistik & Medinfo',
  );
  const [newsAuthor, setNewsAuthor] = useState('Tim Redaksi Medinfo HIMAKA');
  const [newsDivision, setNewsDivision] = useState<HimakaDivisionName>(
    'Divisi Media & Informasi (Medinfo)',
  );
  const [newsLocation, setNewsLocation] = useState(
    'Auditorium Kampus 3 UMBY, Yogyakarta',
  );
  const [newsSummary, setNewsSummary] = useState('');
  const [newsBodyText, setNewsBodyText] = useState('');
  const [newsImageUrl, setNewsImageUrl] = useState(
    PRESET_MEDINFO_MEDIA_ASSETS[3].imageUrl,
  );
  const [newsImageFileName, setNewsImageFileName] = useState('');
  const [newsImageCaption, setNewsImageCaption] = useState(
    'Dokumentasi resmi liputan kegiatan HIMAKA UMBY 2026.',
  );

  // --- STATE TAB 3: KELOLA PENGURUS HIMAKA 2026 & FOTO PROFIL ---
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [memberName, setMemberName] = useState('');
  const [memberNim, setMemberNim] = useState('');
  const [memberCohort, setMemberCohort] = useState('2025');
  const [memberRole, setMemberRole] = useState('Anggota Medinfo');
  const [memberDivision, setMemberDivision] = useState<HimakaDivisionName>(
    'Divisi Media & Informasi (Medinfo)',
  );
  const [memberAvatarUrl, setMemberAvatarUrl] = useState('');
  const [memberAvatarFileName, setMemberAvatarFileName] = useState('');

  // --- STATE TAB 4: BUAT ACARA E-TICKETING BARU & EDIT KUOTA ---
  const [newEvtCode, setNewEvtCode] = useState('');
  const [newEvtTitle, setNewEvtTitle] = useState('');
  const [newEvtCategory, setNewEvtCategory] = useState('Workshop & Bootcamp');
  const [newEvtDate, setNewEvtDate] = useState('12 Desember 2026');
  const [newEvtTime, setNewEvtTime] = useState('08:30 – 15:30 WIB');
  const [newEvtLocation, setNewEvtLocation] = useState(
    'Auditorium & Lab Kampus 3 UMBY',
  );
  const [newEvtSpeaker, setNewEvtSpeaker] = useState(
    'Praktisi Industri & Dosen Informatika UMBY',
  );
  const [newEvtSkp, setNewEvtSkp] = useState('4 SKP Akademik');
  const [newEvtDesc, setNewEvtDesc] = useState('');
  const [newEvtTierName, setNewEvtTierName] = useState(
    'Tiket Peserta Early Bird',
  );
  const [newEvtTierPrice, setNewEvtTierPrice] = useState(50000);
  const [newEvtTierQuota, setNewEvtTierQuota] = useState(80);
  const [newEvtTierMode, setNewEvtTierMode] =
    useState<RegistrationMode>('individu');
  const [newEvtAlsoProker, setNewEvtAlsoProker] = useState(true);

  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [editEvtTitle, setEditEvtTitle] = useState('');
  const [editEvtDate, setEditEvtDate] = useState('');
  const [editEvtLocation, setEditEvtLocation] = useState('');
  const [editEvtSkp, setEditEvtSkp] = useState('');
  const [editEvtTiers, setEditEvtTiers] = useState<
    {
      tierId: string;
      name: string;
      price: number;
      quota: number;
      sold: number;
    }[]
  >([]);

  // Form state for new announcement
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] =
    useState<MedinfoAnnouncement['category']>('Penting');
  const [newContent, setNewContent] = useState('');

  // Editable bank/gate config state
  const [bankName, setBankName] = useState(medinfo.bankName);
  const [bankAccountNumber, setBankAccountNumber] = useState(
    medinfo.bankAccountNumber,
  );
  const [bankAccountHolder, setBankAccountHolder] = useState(
    medinfo.bankAccountHolder,
  );
  const [helpdeskWhatsapp, setHelpdeskWhatsapp] = useState(
    medinfo.helpdeskWhatsapp,
  );
  const [gateCheckinNote, setGateCheckinNote] = useState(
    medinfo.gateCheckinNote,
  );

  const handleFileUploadToDataUrl = (
    e: React.ChangeEvent<HTMLInputElement>,
    target: 'pre-proker' | 'after-proker' | 'news-media' | 'member-avatar',
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === 'string' ? reader.result : '';
      if (!dataUrl) return;
      if (target === 'pre-proker') {
        setProkerMediaUrl(dataUrl);
        setProkerMediaFileName(file.name);
      } else if (target === 'after-proker') {
        setAfterDocMediaUrl(dataUrl);
        setAfterDocFileName(file.name);
      } else if (target === 'member-avatar') {
        setMemberAvatarUrl(dataUrl);
        setMemberAvatarFileName(file.name);
      } else {
        setNewsImageUrl(dataUrl);
        setNewsImageFileName(file.name);
      }
      onNotify(
        `File "${file.name}" berhasil dimuat dan siap disimpan.`,
        'success',
      );
    };
    reader.readAsDataURL(file);
  };

  const handleStartEditNews = (art: HimakaNewsArticle) => {
    const artDoc = getDocumentationForNews(art);
    setEditingNewsId(art.id);
    setNewsTitle(art.title);
    setNewsCategory(art.category);
    setNewsAuthor(art.author);
    setNewsDivision(art.division as HimakaDivisionName);
    setNewsLocation(art.location);
    setNewsSummary(art.summary);
    setNewsBodyText((art.bodyParagraphs || []).join('\n'));
    setNewsImageUrl(artDoc.imageUrl);
    setNewsImageCaption(artDoc.imageCaption);
    setSubTab('berita-galeri');
    onNotify(`Mode edit berita "${art.title}" diaktifkan.`, 'success');
  };

  const handleCancelEditNews = () => {
    setEditingNewsId(null);
    setNewsTitle('');
    setNewsSummary('');
    setNewsBodyText('');
    setNewsImageFileName('');
  };

  const handleSubmitStandaloneNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitle.trim() || !newsSummary.trim()) {
      onNotify(
        'Judul berita dan ringkasan liputan wajib diisi sebelum disimpan.',
        'warning',
      );
      return;
    }

    if (editingNewsId && onUpdateNewsArticle) {
      onUpdateNewsArticle(editingNewsId, {
        title: newsTitle.trim(),
        category: newsCategory,
        author: newsAuthor.trim() || 'Tim Redaksi Medinfo',
        division: newsDivision,
        location: newsLocation.trim() || 'Kampus 3 UMBY',
        summary: newsSummary.trim(),
        bodyText: newsBodyText.trim(),
        imageUrl: newsImageUrl,
        imageCaption: newsImageCaption.trim() || newsSummary.trim(),
      });
      setEditingNewsId(null);
    } else {
      onPublishStandaloneNews({
        title: newsTitle.trim(),
        category: newsCategory,
        author: newsAuthor.trim() || 'Tim Redaksi Medinfo',
        division: newsDivision,
        location: newsLocation.trim() || 'Kampus 3 UMBY',
        summary: newsSummary.trim(),
        bodyText: newsBodyText.trim(),
        imageUrl: newsImageUrl,
        imageCaption: newsImageCaption.trim() || newsSummary.trim(),
        photographer: newsAuthor.trim(),
        isLeadStory: true,
      });
    }

    setNewsTitle('');
    setNewsSummary('');
    setNewsBodyText('');
    setNewsImageFileName('');
  };

  const handleStartEditProker = (prk: HimakaProkerItem) => {
    const prkDoc = getDocumentationForProker(prk);
    setEditingProkerId(prk.id);
    setWorkflowPhase('pre-proker');
    setProkerName(prk.name);
    setProkerDivision(prk.division);
    setProkerMonth(prk.month);
    setProkerCategory(prk.category);
    setProkerStatus(prk.status);
    setProkerPic(prk.personInCharge);
    setProkerSummary(prk.summary);
    setProkerTarget(prk.achievementOrTarget);
    setProkerMediaUrl(prkDoc.imageUrl);
    setProkerMediaCaption(prkDoc.imageCaption);
    setSubTab('proker-media');
    onNotify(`Mode edit proker "${prk.name}" diaktifkan.`, 'success');
  };

  const handleCancelEditProker = () => {
    setEditingProkerId(null);
    setProkerName('');
    setProkerSummary('');
    setProkerTarget('');
    setProkerMediaFileName('');
  };

  const handleSubmitPreProker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prokerName.trim() || !prokerSummary.trim()) {
      onNotify(
        'Nama proker dan deskripsi singkat wajib diisi oleh Medinfo.',
        'warning',
      );
      return;
    }

    if (editingProkerId && onUpdateProker) {
      onUpdateProker(editingProkerId, {
        name: prokerName.trim(),
        division: prokerDivision,
        month: prokerMonth.trim() || 'Desember 2026',
        category: prokerCategory.trim() || 'Program Kerja Divisi',
        status: prokerStatus,
        summary: prokerSummary.trim(),
        achievementOrTarget:
          prokerTarget.trim() || 'Terlaksana sesuai target IKU Kabinet.',
        personInCharge: prokerPic.trim() || 'Tim Divisi Medinfo HIMAKA',
        imageUrl: prokerMediaUrl,
        imageCaption: prokerMediaCaption.trim(),
      });
      setEditingProkerId(null);
    } else {
      onPublishUpcomingProker({
        periodYear: activeCabinet?.periodYear || '2025/2026',
        name: prokerName.trim(),
        division: prokerDivision,
        month: prokerMonth.trim() || 'Desember 2026',
        category: prokerCategory.trim() || 'Program Kerja Divisi',
        status: prokerStatus,
        summary: prokerSummary.trim(),
        achievementOrTarget:
          prokerTarget.trim() || 'Terlaksana sesuai target IKU Kabinet.',
        personInCharge: prokerPic.trim() || 'Tim Divisi Medinfo HIMAKA',
        imageUrl: prokerMediaUrl,
        imageCaption: prokerMediaCaption.trim(),
        alsoPostAnnouncement,
      });
    }

    setProkerName('');
    setProkerSummary('');
    setProkerTarget('');
    setProkerMediaFileName('');
  };

  const handleStartEditMember = (mem: HimakaPeriodMember) => {
    setEditingMemberId(mem.id);
    setMemberName(mem.name);
    setMemberNim(mem.nim);
    setMemberCohort(mem.cohortYear);
    setMemberRole(mem.roleTitle);
    setMemberDivision(mem.division);
    setMemberAvatarUrl(mem.avatarUrl || '');
    setMemberAvatarFileName('');
    onNotify(`Mode edit pengurus "${mem.name}" diaktifkan.`, 'success');
  };

  const handleCancelEditMember = () => {
    setEditingMemberId(null);
    setMemberName('');
    setMemberNim('');
    setMemberCohort('2025');
    setMemberRole('Anggota Medinfo');
    setMemberAvatarUrl('');
    setMemberAvatarFileName('');
  };

  const handleSubmitMemberForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName.trim() || !memberNim.trim()) {
      onNotify('Nama lengkap dan NIM pengurus wajib diisi.', 'warning');
      return;
    }

    if (editingMemberId && onUpdateCabinetMember) {
      onUpdateCabinetMember(editingMemberId, {
        name: memberName.trim(),
        nim: memberNim.trim(),
        cohortYear: memberCohort.trim() || '2025',
        roleTitle: memberRole.trim() || 'Anggota',
        division: memberDivision,
        avatarUrl: memberAvatarUrl.trim(),
      });
      setEditingMemberId(null);
    } else if (onAddCabinetMember) {
      onAddCabinetMember({
        periodYear: activeCabinet?.periodYear || '2025/2026',
        name: memberName.trim(),
        nim: memberNim.trim(),
        cohortYear:
          memberCohort.trim() ||
          (memberNim.trim().startsWith('24') ? '2024' : '2025'),
        roleTitle: memberRole.trim() || 'Anggota',
        division: memberDivision,
        avatarUrl: memberAvatarUrl.trim() || undefined,
      });
    }

    setMemberName('');
    setMemberNim('');
    setMemberAvatarUrl('');
    setMemberAvatarFileName('');
  };

  const handleCreateNewEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvtTitle.trim() || !newEvtDesc.trim()) {
      onNotify(
        'Judul acara baru dan deskripsi kegiatan wajib diisi.',
        'warning',
      );
      return;
    }
    if (onCreateAcademicEvent) {
      onCreateAcademicEvent({
        code: newEvtCode.trim() || undefined,
        title: newEvtTitle.trim(),
        category: newEvtCategory.trim() || 'Kegiatan Akademik',
        date: newEvtDate.trim() || 'Desember 2026',
        time: newEvtTime.trim() || '08:30 – 15:30 WIB',
        location: newEvtLocation.trim() || 'Auditorium Kampus 3 UMBY',
        speakerOrHost: newEvtSpeaker.trim() || 'Narasumber & Panitia HIMAKA',
        skpPoints: newEvtSkp.trim() || '4 SKP Akademik',
        description: newEvtDesc.trim(),
        tierName: newEvtTierName.trim() || 'Tiket Peserta Reguler',
        tierPrice: Number(newEvtTierPrice) || 0,
        tierQuota: Number(newEvtTierQuota) || 50,
        tierMode: newEvtTierMode,
        alsoCreateProker: newEvtAlsoProker,
      });
      setNewEvtCode('');
      setNewEvtTitle('');
      setNewEvtDesc('');
    }
  };

  const handleStartEditEvent = (ev: AcademicEvent) => {
    setEditingEventId(ev.id);
    setEditEvtTitle(ev.title);
    setEditEvtDate(ev.date);
    setEditEvtLocation(ev.location);
    setEditEvtSkp(ev.skpPoints);
    setEditEvtTiers(
      ev.tiers.map((t) => ({
        tierId: t.id,
        name: t.name,
        price: t.price,
        quota: t.quota,
        sold: t.sold,
      })),
    );
  };

  const handleSaveEditEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEventId || !onUpdateAcademicEvent) return;
    onUpdateAcademicEvent(editingEventId, {
      title: editEvtTitle.trim(),
      date: editEvtDate.trim(),
      location: editEvtLocation.trim(),
      skpPoints: editEvtSkp.trim(),
      tierUpdates: editEvtTiers.map((t) => ({
        tierId: t.tierId,
        name: t.name,
        price: Number(t.price),
        quota: Number(t.quota),
      })),
    });
    setEditingEventId(null);
  };

  const handleSubmitAfterProkerDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProkerId) {
      onNotify(
        'Pilih program kerja yang akan ditambahkan dokumentasinya.',
        'warning',
      );
      return;
    }
    if (!afterDocTitle.trim() || !afterDocCaption.trim()) {
      onNotify(
        'Judul dokumentasi dan keterangan/caption kegiatan after-proker wajib diisi.',
        'warning',
      );
      return;
    }

    onUploadAfterProkerDoc({
      prokerId: selectedProkerId,
      title: afterDocTitle.trim(),
      date: afterDocDate.trim() || 'Oktober 2026',
      location: afterDocLocation.trim() || 'Kampus 3 UMBY',
      photographer: afterDocPhotographer.trim() || 'Tim Dokumentasi Medinfo',
      imageUrl: afterDocMediaUrl,
      caption: afterDocCaption.trim(),
      markProkerCompleted,
      updatedAchievement: updatedAchievement.trim(),
      alsoPublishNews,
    });

    setAfterDocTitle('');
    setAfterDocCaption('');
    setUpdatedAchievement('');
    setAfterDocFileName('');
  };

  const handleSelectProkerForAfterDoc = (
    prokerId: string,
    prokerTitle: string,
  ) => {
    setSelectedProkerId(prokerId);
    setWorkflowPhase('after-proker');
    setAfterDocTitle(`Dokumentasi Pelaksanaan ${prokerTitle}`);
    onNotify(
      `Proker "${prokerTitle}" dipilih untuk upload dokumentasi after-proker.`,
      'success',
    );
  };

  const handleAddAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      onNotify('Judul dan isi pengumuman Medinfo wajib diisi.', 'warning');
      return;
    }

    const created: MedinfoAnnouncement = {
      id: `ann-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      content: newContent.trim(),
      updatedAt: 'Baru saja diperbarui',
      isActive: true,
    };

    onUpdateMedinfo({
      ...medinfo,
      announcements: [created, ...medinfo.announcements],
    });
    setNewTitle('');
    setNewContent('');
    onNotify(
      'Pengumuman Medinfo baru berhasil ditambahkan ke Katalog.',
      'success',
    );
  };

  const handleToggleAnnouncement = (id: string) => {
    const nextAnnouncements = medinfo.announcements.map((a) =>
      a.id === id ? { ...a, isActive: !a.isActive } : a,
    );
    onUpdateMedinfo({
      ...medinfo,
      announcements: nextAnnouncements,
    });
    onNotify('Status tayang pengumuman diperbarui.', 'success');
  };

  const handleDeleteAnnouncement = (id: string) => {
    const nextAnnouncements = medinfo.announcements.filter((a) => a.id !== id);
    onUpdateMedinfo({
      ...medinfo,
      announcements: nextAnnouncements,
    });
    onNotify('Pengumuman berhasil dihapus.', 'warning');
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateMedinfo({
      ...medinfo,
      bankName,
      bankAccountNumber,
      bankAccountHolder,
      helpdeskWhatsapp,
      gateCheckinNote,
    });
    onNotify(
      'Konfigurasi informasi pembayaran & pintu berhasil disimpan.',
      'success',
    );
  };

  const divisionList: HimakaDivisionName[] = [
    'Badan Pengurus Harian (BPH)',
    'Divisi PKM (Pengembangan Kreativitas Mahasiswa)',
    'Divisi Hubungan Masyarakat & Kemitraan',
    'Divisi Media & Informasi (Medinfo)',
    'Divisi Pengembangan Akademik & Keprofesian',
    'Divisi Minat Bakat & Kreativitas',
    'Divisi Sosial & Pengabdian Masyarakat',
  ];

  const selectedProkerObj =
    allCurrentProkers.find((p) => p.id === selectedProkerId) ||
    allCurrentProkers[0];

  return (
    <section aria-labelledby="heading-medinfo" className="space-y-6">
      {/* Header & Mode Switch */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-level-1">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-mono-code font-semibold tracking-wider text-[#1d4ed8]">
              PORTAL ADMIN &amp; CMS MEDINFO · HIMAKA UMBY 2026
            </span>
            <h1
              id="heading-medinfo"
              className="text-2xl font-bold text-slate-900 tracking-tight"
            >
              CMS Organisasi: Proker, Berita, Pengurus 2026 &amp; Acara Tiket
            </h1>
            <p className="text-sm text-slate-600 max-w-2xl">
              Kelola publikasi proker &amp; berita, tambah/edit pengurus HIMAKA
              2026 beserta foto profil, dan buat acara e-ticketing baru atau
              ubah kuota tiket.
            </p>
          </div>

          <div
            className="flex flex-wrap p-1 bg-slate-100 border border-slate-200/80 rounded-xl self-start lg:self-auto shrink-0 gap-1"
            role="tablist"
          >
            <button
              type="button"
              role="tab"
              aria-selected={subTab === 'proker-media'}
              onClick={() => setSubTab('proker-media')}
              className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap focus-academic ${
                subTab === 'proker-media'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
              }`}
            >
              1. Siklus Proker
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={subTab === 'berita-galeri'}
              onClick={() => setSubTab('berita-galeri')}
              className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap focus-academic ${
                subTab === 'berita-galeri'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
              }`}
            >
              2. Berita &amp; Media ({newsArticles.length})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={subTab === 'pengurus-2026'}
              onClick={() => setSubTab('pengurus-2026')}
              className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap focus-academic ${
                subTab === 'pengurus-2026'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
              }`}
            >
              3. Pengurus 2026 ({allCurrentMembers.length})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={subTab === 'kelola-acara'}
              onClick={() => setSubTab('kelola-acara')}
              className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap focus-academic ${
                subTab === 'kelola-acara'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
              }`}
            >
              4. Acara &amp; Kuota ({events.length})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={subTab === 'cms'}
              onClick={() => setSubTab('cms')}
              className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap focus-academic ${
                subTab === 'cms'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
              }`}
            >
              5. Pengumuman &amp; Bank
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={subTab === 'specs'}
              onClick={() => setSubTab('specs')}
              className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap focus-academic ${
                subTab === 'specs'
                  ? 'bg-[#1d4ed8] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
              }`}
            >
              6. Design System
            </button>
          </div>
        </div>
      </div>

      {subTab === 'proker-media' ? (
        <div className="space-y-6">
          {/* Alur Siklus Publikasi Medinfo: Switcher Tahap 1 (Pre-Proker) vs Tahap 2 (After-Proker) */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-level-1 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
              <div>
                <span className="text-xs font-mono-code font-semibold tracking-wider text-[#1d4ed8] block">
                  ALUR KERJA PUBLIKASI MEDIA DIVISI MEDINFO
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                  Pilih Tahap Publikasi Media Proker HIMAKA
                </h2>
              </div>

              <div
                className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full md:w-auto"
                role="group"
                aria-label="Pilih Tahap Publikasi Proker Medinfo"
              >
                <button
                  type="button"
                  onClick={() => setWorkflowPhase('pre-proker')}
                  aria-pressed={workflowPhase === 'pre-proker'}
                  className={`min-h-[44px] px-4 py-2.5 rounded-xl border text-left text-xs font-semibold flex items-center gap-2.5 transition-all focus-academic ${
                    workflowPhase === 'pre-proker'
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-slate-50/80 text-slate-700 border-slate-200/90 hover:bg-slate-100/80'
                  }`}
                >
                  <CalendarPlus
                    className={`w-4 h-4 shrink-0 ${
                      workflowPhase === 'pre-proker'
                        ? 'text-blue-400'
                        : 'text-[#1d4ed8]'
                    }`}
                    aria-hidden="true"
                  />
                  <div>
                    <span className="block font-bold">
                      Tahap 1: Post Proker Kedepan (Pre-Proker)
                    </span>
                    <span className="text-[11px] opacity-80 font-normal">
                      Upload poster &amp; info &quot;Ada proker ini
                      kedepannya&quot;
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setWorkflowPhase('after-proker')}
                  aria-pressed={workflowPhase === 'after-proker'}
                  className={`min-h-[44px] px-4 py-2.5 rounded-xl border text-left text-xs font-semibold flex items-center gap-2.5 transition-all focus-academic ${
                    workflowPhase === 'after-proker'
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                      : 'bg-slate-50/80 text-slate-700 border-slate-200/90 hover:bg-slate-100/80'
                  }`}
                >
                  <Camera className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <div>
                    <span className="block font-bold">
                      Tahap 2: Upload Dokumentasi After-Proker
                    </span>
                    <span className="text-[11px] opacity-85 font-normal">
                      Tambah foto dokumentasi &amp; laporan pasca proker selesai
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {workflowPhase === 'pre-proker' ? (
              /* FORM TAHAP 1: POST PROKER KEDEPAN + UPLOAD MEDIA POSTER */
              <form
                onSubmit={handleSubmitPreProker}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
              >
                <div className="lg:col-span-7 space-y-4">
                  <div>
                    <label
                      htmlFor="pre-proker-name"
                      className="block text-sm font-semibold text-slate-900 mb-1.5"
                    >
                      Nama Program Kerja (Proker) Kedepan
                    </label>
                    <input
                      id="pre-proker-name"
                      type="text"
                      value={prokerName}
                      onChange={(e) => setProkerName(e.target.value)}
                      placeholder="Contoh: Bootcamp Full-Stack Next.js & Cyber Security 2026"
                      className="w-full min-h-[44px] px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus-academic"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="pre-proker-div"
                        className="block text-sm font-semibold text-slate-900 mb-1.5"
                      >
                        Divisi Penyelenggara
                      </label>
                      <select
                        id="pre-proker-div"
                        value={prokerDivision}
                        onChange={(e) =>
                          setProkerDivision(
                            e.target.value as HimakaDivisionName,
                          )
                        }
                        className="w-full min-h-[44px] px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 focus-academic"
                      >
                        {divisionList.map((div) => (
                          <option key={div} value={div}>
                            {div}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="pre-proker-month"
                        className="block text-sm font-semibold text-slate-900 mb-1.5"
                      >
                        Waktu / Bulan Pelaksanaan
                      </label>
                      <input
                        id="pre-proker-month"
                        type="text"
                        value={prokerMonth}
                        onChange={(e) => setProkerMonth(e.target.value)}
                        placeholder="Contoh: Desember 2025 / Februari 2026"
                        className="w-full min-h-[44px] px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus-academic"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label
                        htmlFor="pre-proker-cat"
                        className="block text-sm font-semibold text-slate-900 mb-1.5"
                      >
                        Kategori Kegiatan
                      </label>
                      <input
                        id="pre-proker-cat"
                        type="text"
                        value={prokerCategory}
                        onChange={(e) => setProkerCategory(e.target.value)}
                        placeholder="Bootcamp / Seminar / Lomba"
                        className="w-full min-h-[44px] px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus-academic"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="pre-proker-status"
                        className="block text-sm font-semibold text-slate-900 mb-1.5"
                      >
                        Status Tahapan
                      </label>
                      <select
                        id="pre-proker-status"
                        value={prokerStatus}
                        onChange={(e) =>
                          setProkerStatus(e.target.value as ProkerStatus)
                        }
                        className="w-full min-h-[44px] px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 focus-academic"
                      >
                        <option value="AKAN DATANG">
                          AKAN DATANG (Rencana Kedepan)
                        </option>
                        <option value="BERJALAN">
                          BERJALAN (Persiapan / Buka Pendaftaran)
                        </option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="pre-proker-pic"
                        className="block text-sm font-semibold text-slate-900 mb-1.5"
                      >
                        Penanggung Jawab (PIC)
                      </label>
                      <input
                        id="pre-proker-pic"
                        type="text"
                        value={prokerPic}
                        onChange={(e) => setProkerPic(e.target.value)}
                        placeholder="Nama Koordinator Proker"
                        className="w-full min-h-[44px] px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus-academic"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="pre-proker-summary"
                      className="block text-sm font-semibold text-slate-900 mb-1.5"
                    >
                      Deskripsi Informasi Proker Kedepan
                    </label>
                    <textarea
                      id="pre-proker-summary"
                      rows={3}
                      value={prokerSummary}
                      onChange={(e) => setProkerSummary(e.target.value)}
                      placeholder="Jelaskan agenda kegiatan, materi yang akan dibahas, dan manfaat bagi mahasiswa Informatika UMBY..."
                      className="w-full p-3.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus-academic"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="pre-proker-target"
                      className="block text-sm font-semibold text-slate-900 mb-1.5"
                    >
                      Target Peserta / Indikator Capaian Proker
                    </label>
                    <input
                      id="pre-proker-target"
                      type="text"
                      value={prokerTarget}
                      onChange={(e) => setProkerTarget(e.target.value)}
                      placeholder="Contoh: Target 80 mahasiswa Informatika & publikasi 10 proyek latihan."
                      className="w-full min-h-[44px] px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus-academic"
                    />
                  </div>

                  <label className="flex items-start gap-2.5 p-3.5 rounded-xl bg-slate-50/90 border border-slate-200/80 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={alsoPostAnnouncement}
                      onChange={(e) =>
                        setAlsoPostAnnouncement(e.target.checked)
                      }
                      className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#1d4ed8]"
                    />
                    <span>
                      <strong className="text-slate-900">
                        Siarkan juga ke Papan Pengumuman Beranda &amp; Katalog:
                      </strong>{' '}
                      Otomatis membuat pengumuman aktif agar pengunjung langsung
                      melihat adanya proker baru ini.
                    </span>
                  </label>
                </div>

                {/* Kolom Kanan: Upload Media / Poster Visual Pre-Proker */}
                <div className="lg:col-span-5 space-y-4 bg-slate-50/90 border border-slate-200/90 rounded-2xl p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono-code font-semibold text-[#1d4ed8]">
                      UPLOAD MEDIA POSTER / VISUAL PROKER
                    </span>
                    <StatusBadge variant="warning" label="PRE-PROKER MEDIA" />
                  </div>

                  {/* Preview Gambar Poster */}
                  <figure className="rounded-xl overflow-hidden border border-slate-200/90 bg-white shadow-xs">
                    <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
                      <img
                        src={prokerMediaUrl}
                        alt="Pratinjau Poster Proker"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <figcaption className="p-2.5 text-[11px] font-mono-code text-slate-600 bg-white border-t border-slate-200/80 flex items-center justify-between">
                      <span className="truncate">
                        {prokerMediaFileName
                          ? `File lokal: ${prokerMediaFileName}`
                          : `Media aktif: ${prokerMediaUrl}`}
                      </span>
                    </figcaption>
                  </figure>

                  {/* Input Upload File Gambar dari Komputer/HP */}
                  <div>
                    <label
                      htmlFor="pre-proker-file-upload"
                      className="block text-xs font-semibold text-slate-900 mb-1.5"
                    >
                      Unggah File Poster / Gambar dari Perangkat
                      (JPG/PNG/SVG/WebP)
                    </label>
                    <input
                      id="pre-proker-file-upload"
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleFileUploadToDataUrl(e, 'pre-proker')
                      }
                      className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-3.5 file:rounded-lg file:border file:border-slate-300 file:text-xs file:font-semibold file:bg-white file:text-slate-900 hover:file:bg-slate-50"
                    />
                  </div>

                  {/* Atau Pilih Cepat dari Template Visual Kampus */}
                  <div>
                    <label
                      htmlFor="pre-proker-preset"
                      className="block text-xs font-semibold text-slate-900 mb-1.5"
                    >
                      Atau Pilih Cepat dari Pustaka Media Kampus HIMAKA
                    </label>
                    <select
                      id="pre-proker-preset"
                      value={
                        PRESET_MEDINFO_MEDIA_ASSETS.some(
                          (p) => p.imageUrl === prokerMediaUrl,
                        )
                          ? prokerMediaUrl
                          : ''
                      }
                      onChange={(e) => {
                        if (!e.target.value) return;
                        setProkerMediaUrl(e.target.value);
                        setProkerMediaFileName('');
                        const found = PRESET_MEDINFO_MEDIA_ASSETS.find(
                          (p) => p.imageUrl === e.target.value,
                        );
                        if (found) {
                          setProkerMediaCaption(found.defaultCaption);
                        }
                      }}
                      className="w-full min-h-[40px] px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus-academic"
                    >
                      <option value="" disabled>
                        -- Menggunakan File Upload Kustom --
                      </option>
                      {PRESET_MEDINFO_MEDIA_ASSETS.map((preset) => (
                        <option key={preset.id} value={preset.imageUrl}>
                          {preset.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="pre-proker-caption"
                      className="block text-xs font-semibold text-slate-900 mb-1.5"
                    >
                      Caption / Keterangan Media Poster
                    </label>
                    <input
                      id="pre-proker-caption"
                      type="text"
                      value={prokerMediaCaption}
                      onChange={(e) => setProkerMediaCaption(e.target.value)}
                      className="w-full min-h-[40px] px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus-academic"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      type="submit"
                      className="flex-1 min-h-[44px] px-5 py-2.5 bg-[#1d4ed8] hover:bg-[#1e40af] text-white text-xs font-semibold rounded-xl inline-flex items-center justify-center gap-2 transition-colors shadow-xs focus-academic"
                    >
                      <Upload className="w-4 h-4" aria-hidden="true" />
                      <span>
                        {editingProkerId
                          ? 'Simpan Perubahan Proker'
                          : 'Post Proker Kedepan & Publikasikan Media'}
                      </span>
                    </button>
                    {editingProkerId && (
                      <button
                        type="button"
                        onClick={handleCancelEditProker}
                        className="min-h-[44px] px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl inline-flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <X className="w-4 h-4" aria-hidden="true" />
                        <span>Batal Edit</span>
                      </button>
                    )}
                  </div>
                </div>
              </form>
            ) : (
              /* FORM TAHAP 2: UPLOAD DOKUMENTASI AFTER-PROKER (PASCA KEGIATAN) */
              <form
                onSubmit={handleSubmitAfterProkerDoc}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
              >
                <div className="lg:col-span-7 space-y-4">
                  <div>
                    <label
                      htmlFor="after-proker-select"
                      className="block text-sm font-semibold text-slate-900 mb-1.5"
                    >
                      Pilih Program Kerja (Proker) yang Akan Ditambahkan
                      Dokumentasinya
                    </label>
                    <select
                      id="after-proker-select"
                      value={selectedProkerId}
                      onChange={(e) => setSelectedProkerId(e.target.value)}
                      className="w-full min-h-[44px] px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus-academic"
                    >
                      {allCurrentProkers.map((prk) => (
                        <option key={prk.id} value={prk.id}>
                          [{prk.code} · {prk.status}] {prk.name} ({prk.month})
                        </option>
                      ))}
                    </select>
                    {selectedProkerObj && (
                      <p className="text-xs text-slate-600 mt-1.5">
                        Divisi:{' '}
                        <strong className="text-slate-900">
                          {selectedProkerObj.division}
                        </strong>{' '}
                        · Target Awal: {selectedProkerObj.achievementOrTarget}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="after-doc-title"
                      className="block text-sm font-semibold text-slate-900 mb-1.5"
                    >
                      Judul Dokumentasi After-Proker
                    </label>
                    <input
                      id="after-doc-title"
                      type="text"
                      value={afterDocTitle}
                      onChange={(e) => setAfterDocTitle(e.target.value)}
                      placeholder={
                        selectedProkerObj
                          ? `Contoh: Dokumentasi Pelaksanaan ${selectedProkerObj.name}`
                          : 'Judul Dokumentasi Kegiatan'
                      }
                      className="w-full min-h-[44px] px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus-academic"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label
                        htmlFor="after-doc-date"
                        className="block text-sm font-semibold text-slate-900 mb-1.5"
                      >
                        Tanggal Pelaksanaan
                      </label>
                      <input
                        id="after-doc-date"
                        type="text"
                        value={afterDocDate}
                        onChange={(e) => setAfterDocDate(e.target.value)}
                        placeholder="Contoh: 15 November 2026"
                        className="w-full min-h-[44px] px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus-academic"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="after-doc-loc"
                        className="block text-sm font-semibold text-slate-900 mb-1.5"
                      >
                        Lokasi Kegiatan
                      </label>
                      <input
                        id="after-doc-loc"
                        type="text"
                        value={afterDocLocation}
                        onChange={(e) => setAfterDocLocation(e.target.value)}
                        placeholder="Auditorium Kampus 3 UMBY"
                        className="w-full min-h-[44px] px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus-academic"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="after-doc-photo"
                        className="block text-sm font-semibold text-slate-900 mb-1.5"
                      >
                        Fotografer / Dokumentator
                      </label>
                      <input
                        id="after-doc-photo"
                        type="text"
                        value={afterDocPhotographer}
                        onChange={(e) =>
                          setAfterDocPhotographer(e.target.value)
                        }
                        placeholder="Nama Tim Medinfo"
                        className="w-full min-h-[44px] px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus-academic"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="after-doc-caption"
                      className="block text-sm font-semibold text-slate-900 mb-1.5"
                    >
                      Narasi / Caption Dokumentasi After-Proker
                    </label>
                    <textarea
                      id="after-doc-caption"
                      rows={3}
                      value={afterDocCaption}
                      onChange={(e) => setAfterDocCaption(e.target.value)}
                      placeholder="Ceritakan jalannya kegiatan, antusiasme mahasiswa Informatika yang hadir, serta hasil dokumentasi di lapangan..."
                      className="w-full p-3.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus-academic"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="after-doc-achievement"
                      className="block text-sm font-semibold text-slate-900 mb-1.5"
                    >
                      Realisasi &amp; Capaian Akhir Proker (Opsional —
                      Memperbarui Data Proker)
                    </label>
                    <input
                      id="after-doc-achievement"
                      type="text"
                      value={updatedAchievement}
                      onChange={(e) => setUpdatedAchievement(e.target.value)}
                      placeholder="Contoh: Terlaksana sukses dihadiri 195 peserta mahasiswa & dokumentasi lengkap."
                      className="w-full min-h-[44px] px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus-academic"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="flex items-start gap-2.5 p-3.5 rounded-xl bg-slate-50/90 border border-slate-200/80 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={markProkerCompleted}
                        onChange={(e) =>
                          setMarkProkerCompleted(e.target.checked)
                        }
                        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-700"
                      />
                      <span>
                        <strong className="text-slate-900">
                          Tandai Proker TERLAKSANA:
                        </strong>{' '}
                        Otomatis memperbarui status proker menjadi selesai
                        beserta foto dokumentasi terbarunya.
                      </span>
                    </label>

                    <label className="flex items-start gap-2.5 p-3.5 rounded-xl bg-slate-50/90 border border-slate-200/80 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={alsoPublishNews}
                        onChange={(e) => setAlsoPublishNews(e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#1d4ed8]"
                      />
                      <span>
                        <strong className="text-slate-900">
                          Terbitkan Liputan Warta Berita:
                        </strong>{' '}
                        Otomatis mem-posting artikel berita after-proker di
                        halaman utama (Home).
                      </span>
                    </label>
                  </div>
                </div>

                {/* Kolom Kanan: Upload Foto Dokumentasi After-Proker */}
                <div className="lg:col-span-5 space-y-4 bg-slate-50/90 border border-slate-200/90 rounded-2xl p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono-code font-semibold text-emerald-700">
                      UPLOAD FOTO DOKUMENTASI AFTER-PROKER
                    </span>
                    <StatusBadge variant="success" label="AFTER-PROKER DOCS" />
                  </div>

                  <figure className="rounded-xl overflow-hidden border border-slate-200/90 bg-white shadow-xs">
                    <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
                      <img
                        src={afterDocMediaUrl}
                        alt="Pratinjau Foto Dokumentasi After-Proker"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <figcaption className="p-2.5 text-[11px] font-mono-code text-slate-600 bg-white border-t border-slate-200/80 truncate">
                      {afterDocFileName
                        ? `File dokumentasi: ${afterDocFileName}`
                        : `Media aktif: ${afterDocMediaUrl}`}
                    </figcaption>
                  </figure>

                  <div>
                    <label
                      htmlFor="after-proker-file-upload"
                      className="block text-xs font-semibold text-slate-900 mb-1.5"
                    >
                      Unggah File Foto Dokumentasi Kegiatan (JPG/PNG/SVG/WebP)
                    </label>
                    <input
                      id="after-proker-file-upload"
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleFileUploadToDataUrl(e, 'after-proker')
                      }
                      className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-3.5 file:rounded-lg file:border file:border-slate-300 file:text-xs file:font-semibold file:bg-white file:text-slate-900 hover:file:bg-slate-50"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="after-proker-preset"
                      className="block text-xs font-semibold text-slate-900 mb-1.5"
                    >
                      Atau Pilih dari Arsip Visual Dokumentasi Kampus
                    </label>
                    <select
                      id="after-proker-preset"
                      value={
                        PRESET_MEDINFO_MEDIA_ASSETS.some(
                          (p) => p.imageUrl === afterDocMediaUrl,
                        )
                          ? afterDocMediaUrl
                          : ''
                      }
                      onChange={(e) => {
                        if (!e.target.value) return;
                        setAfterDocMediaUrl(e.target.value);
                        setAfterDocFileName('');
                      }}
                      className="w-full min-h-[40px] px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus-academic"
                    >
                      <option value="" disabled>
                        -- Menggunakan File Upload Kustom --
                      </option>
                      {PRESET_MEDINFO_MEDIA_ASSETS.map((preset) => (
                        <option key={preset.id} value={preset.imageUrl}>
                          {preset.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full min-h-[44px] px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl inline-flex items-center justify-center gap-2 transition-colors shadow-xs focus-academic"
                  >
                    <Camera className="w-4 h-4" aria-hidden="true" />
                    <span>Upload Dokumentasi After-Proker &amp; Simpan</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* DAFTAR PROKER PERIODE BERJALAN & AKSI CEPAT EDIT / DOKUMENTASI AFTER-PROKER */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-level-1 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-4">
              <div>
                <span className="text-xs font-mono-code font-semibold tracking-wider text-[#1d4ed8] block">
                  MONITORING SIKLUS PROKER &amp; MEDIA DOKUMENTASI (
                  {allCurrentProkers.length} PROKER)
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                  Daftar Proker {activeCabinet?.cabinetName} (
                  {activeCabinet?.periodYear})
                </h2>
              </div>
              <span className="text-xs text-slate-600">
                Klik <strong>&quot;Edit Proker&quot;</strong> atau{' '}
                <strong>&quot;+ Dokumentasi&quot;</strong> pada proker mana
                saja.
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {allCurrentProkers.map((prk) => {
                const prkDoc = getDocumentationForProker(prk);
                const linkedAfterDocs = documentationGallery.filter(
                  (d) =>
                    d.relatedProkerId === prk.id &&
                    d.mediaPhase === 'AFTER_PROKER',
                );

                return (
                  <article
                    key={prk.id}
                    className="rounded-2xl bg-white border border-slate-200/80 overflow-hidden flex flex-col justify-between hover:border-slate-300 transition-colors"
                  >
                    <div>
                      <div className="aspect-video w-full bg-slate-100 border-b border-slate-200/80 overflow-hidden">
                        <img
                          src={prkDoc.imageUrl}
                          alt={prk.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="p-5 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-mono-code text-slate-500">
                            <strong className="text-[#1d4ed8]">
                              {prk.code}
                            </strong>{' '}
                            · {prk.month} · {prkDoc.archiveCode}
                          </span>
                          <StatusBadge
                            variant={
                              prk.status === 'TERLAKSANA'
                                ? 'success'
                                : prk.status === 'BERJALAN'
                                  ? 'warning'
                                  : 'neutral'
                            }
                            label={prk.status}
                          />
                        </div>

                        <h3 className="text-sm font-bold text-slate-900 leading-snug">
                          {prk.name}
                        </h3>

                        <p className="text-xs text-slate-500">{prk.division}</p>

                        <p className="text-xs text-slate-600 leading-relaxed">
                          {prk.summary}
                        </p>

                        <p className="text-xs text-slate-600 pt-2 border-t border-slate-100">
                          <strong className="text-slate-900">
                            Target / Capaian:
                          </strong>{' '}
                          {prk.achievementOrTarget}
                        </p>
                      </div>
                    </div>

                    <div className="px-5 pb-4 pt-3 border-t border-slate-200/80 bg-slate-50/50 flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[11px] font-mono-code text-slate-500">
                        PIC: {prk.personInCharge}
                        {linkedAfterDocs.length > 0 &&
                          ` · ${linkedAfterDocs.length} Foto`}
                      </span>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleStartEditProker(prk)}
                          className="min-h-[36px] px-3 py-1.5 bg-white hover:bg-blue-50 border border-slate-300 hover:border-blue-300 text-slate-900 hover:text-[#1d4ed8] text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 transition-colors"
                        >
                          <Edit3
                            className="w-3.5 h-3.5 text-[#1d4ed8]"
                            aria-hidden="true"
                          />
                          <span>Edit Proker</span>
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleSelectProkerForAfterDoc(prk.id, prk.name)
                          }
                          className="min-h-[36px] px-3 py-1.5 bg-white hover:bg-emerald-50 border border-slate-300 hover:border-emerald-300 text-slate-900 hover:text-emerald-800 text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 transition-colors"
                        >
                          <Camera
                            className="w-3.5 h-3.5 text-emerald-700"
                            aria-hidden="true"
                          />
                          <span>+ Dokumentasi</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteProker(prk.id, prk.name)}
                          aria-label={`Hapus proker ${prk.name}`}
                          className="min-h-[36px] px-3 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Hapus</span>
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      ) : subTab === 'berita-galeri' ? (
        <div className="space-y-6">
          {/* Form Terbitkan / Edit Berita + Daftar Berita Terunggah */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <form
              onSubmit={handleSubmitStandaloneNews}
              className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-level-1 space-y-4"
            >
              <div className="border-b border-slate-200/80 pb-3.5">
                <span className="text-xs font-mono-code font-semibold text-[#1d4ed8] block">
                  PUBLIKASI WARTA MEDINFO 2026
                </span>
                <h2 className="text-base font-bold text-slate-900 mt-0.5">
                  {editingNewsId
                    ? 'Edit Artikel Berita & Liputan'
                    : 'Terbitkan Berita & Liputan Baru'}
                </h2>
              </div>

              <div>
                <label
                  htmlFor="medinfo-news-title"
                  className="block text-xs font-semibold text-slate-900 mb-1"
                >
                  Judul Berita Kegiatan
                </label>
                <input
                  id="medinfo-news-title"
                  type="text"
                  value={newsTitle}
                  onChange={(e) => setNewsTitle(e.target.value)}
                  placeholder="Contoh: HIMAKA UMBY Raih Juara 1 Hackathon Nasional 2026"
                  className="w-full min-h-[42px] px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus-academic"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="medinfo-news-cat"
                    className="block text-xs font-semibold text-slate-900 mb-1"
                  >
                    Kategori Berita
                  </label>
                  <select
                    id="medinfo-news-cat"
                    value={newsCategory}
                    onChange={(e) =>
                      setNewsCategory(e.target.value as NewsCategory)
                    }
                    className="w-full min-h-[42px] px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus-academic"
                  >
                    <option value="Liputan Utama">Liputan Utama</option>
                    <option value="Jurnalistik & Medinfo">
                      Jurnalistik &amp; Medinfo
                    </option>
                    <option value="Akademik & Riset">
                      Akademik &amp; Riset
                    </option>
                    <option value="Pengabdian & Humas">
                      Pengabdian &amp; Humas
                    </option>
                    <option value="Prestasi Mahasiswa">
                      Prestasi Mahasiswa
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="medinfo-news-author"
                    className="block text-xs font-semibold text-slate-900 mb-1"
                  >
                    Penulis / Redaktur
                  </label>
                  <input
                    id="medinfo-news-author"
                    type="text"
                    value={newsAuthor}
                    onChange={(e) => setNewsAuthor(e.target.value)}
                    className="w-full min-h-[42px] px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus-academic"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="medinfo-news-div"
                    className="block text-xs font-semibold text-slate-900 mb-1"
                  >
                    Divisi Terkait
                  </label>
                  <select
                    id="medinfo-news-div"
                    value={newsDivision}
                    onChange={(e) =>
                      setNewsDivision(e.target.value as HimakaDivisionName)
                    }
                    className="w-full min-h-[42px] px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus-academic"
                  >
                    {divisionList.map((div) => (
                      <option key={div} value={div}>
                        {div}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="medinfo-news-loc"
                    className="block text-xs font-semibold text-slate-900 mb-1"
                  >
                    Lokasi Liputan
                  </label>
                  <input
                    id="medinfo-news-loc"
                    type="text"
                    value={newsLocation}
                    onChange={(e) => setNewsLocation(e.target.value)}
                    className="w-full min-h-[42px] px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus-academic"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="medinfo-news-summary"
                  className="block text-xs font-semibold text-slate-900 mb-1"
                >
                  Ringkasan Utama Berita
                </label>
                <textarea
                  id="medinfo-news-summary"
                  rows={2}
                  value={newsSummary}
                  onChange={(e) => setNewsSummary(e.target.value)}
                  placeholder="Ringkasan 1-2 kalimat mengenai kegiatan yang diliput..."
                  className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus-academic"
                />
              </div>

              <div>
                <label
                  htmlFor="medinfo-news-body"
                  className="block text-xs font-semibold text-slate-900 mb-1"
                >
                  Isi Paragraf Berita (Opsional)
                </label>
                <textarea
                  id="medinfo-news-body"
                  rows={3}
                  value={newsBodyText}
                  onChange={(e) => setNewsBodyText(e.target.value)}
                  placeholder="Pisahkan antar paragraf dengan baris baru (Enter)..."
                  className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus-academic"
                />
              </div>

              <div className="space-y-2.5 pt-2 border-t border-slate-200/80">
                <label
                  htmlFor="medinfo-news-file"
                  className="block text-xs font-semibold text-slate-900"
                >
                  Media Foto Berita ({newsImageFileName || 'Preset Aktif'})
                </label>
                <input
                  id="medinfo-news-file"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUploadToDataUrl(e, 'news-media')}
                  className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border file:border-slate-300 file:text-xs file:font-semibold file:bg-white file:text-slate-900 hover:file:bg-slate-50"
                />
                <select
                  aria-label="Pilih foto preset untuk berita"
                  value={
                    PRESET_MEDINFO_MEDIA_ASSETS.some(
                      (p) => p.imageUrl === newsImageUrl,
                    )
                      ? newsImageUrl
                      : ''
                  }
                  onChange={(e) => {
                    if (!e.target.value) return;
                    setNewsImageUrl(e.target.value);
                    setNewsImageFileName('');
                    const found = PRESET_MEDINFO_MEDIA_ASSETS.find(
                      (p) => p.imageUrl === e.target.value,
                    );
                    if (found) setNewsImageCaption(found.defaultCaption);
                  }}
                  className="w-full min-h-[38px] px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus-academic"
                >
                  <option value="" disabled>
                    -- File Upload Kustom --
                  </option>
                  {PRESET_MEDINFO_MEDIA_ASSETS.map((preset) => (
                    <option key={preset.id} value={preset.imageUrl}>
                      {preset.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="submit"
                  className="flex-1 min-h-[44px] px-4 py-2.5 bg-[#1d4ed8] hover:bg-[#1e40af] text-white text-xs font-semibold rounded-xl inline-flex items-center justify-center gap-2 transition-colors focus-academic"
                >
                  <Newspaper className="w-4 h-4" aria-hidden="true" />
                  <span>
                    {editingNewsId
                      ? 'Simpan Perubahan Berita'
                      : 'Terbitkan Berita Medinfo'}
                  </span>
                </button>
                {editingNewsId && (
                  <button
                    type="button"
                    onClick={handleCancelEditNews}
                    className="min-h-[44px] px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl inline-flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <X className="w-4 h-4" aria-hidden="true" />
                    <span>Batal</span>
                  </button>
                )}
              </div>
            </form>

            {/* Daftar Berita & Liputan Terunggah (Bisa Diedit & Dihapus Admin) */}
            <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-level-1 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-3.5">
                <div>
                  <span className="text-xs font-mono-code font-semibold text-[#1d4ed8] block">
                    MANAJEMEN ARTIKEL &amp; BERITA TERUNGGAH
                  </span>
                  <h2 className="text-base font-bold text-slate-900 mt-0.5">
                    Daftar Berita &amp; Liputan Aktif ({newsArticles.length})
                  </h2>
                </div>
                <span className="text-xs text-slate-500">
                  Admin dapat mengedit atau menghapus berita kapan saja
                </span>
              </div>

              {newsArticles.length > 0 ? (
                <div className="divide-y divide-slate-200/80">
                  {newsArticles.map((art) => {
                    const artDoc = getDocumentationForNews(art);
                    return (
                      <article
                        key={art.id}
                        className="py-4 first:pt-1 last:pb-1 flex flex-col sm:flex-row sm:items-start justify-between gap-4"
                      >
                        <div className="flex items-start gap-3.5">
                          <img
                            src={artDoc.imageUrl}
                            alt={art.title}
                            referrerPolicy="no-referrer"
                            className="w-24 h-16 rounded-lg object-cover border border-slate-200 shrink-0 bg-slate-100"
                          />
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono-code text-slate-500">
                              <span className="font-semibold text-[#1d4ed8]">
                                {art.code}
                              </span>
                              <span aria-hidden="true">·</span>
                              <span>{art.category}</span>
                              <span aria-hidden="true">·</span>
                              <span>{art.publishedAt}</span>
                              {art.isLeadStory && (
                                <>
                                  <span aria-hidden="true">·</span>
                                  <span className="font-semibold text-emerald-700">
                                    HEADLINE UTAMA
                                  </span>
                                </>
                              )}
                            </div>
                            <h3 className="text-sm font-bold text-slate-900 leading-snug">
                              {art.title}
                            </h3>
                            <p className="text-xs text-slate-600 line-clamp-2">
                              {art.summary}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-start">
                          <button
                            type="button"
                            onClick={() => handleStartEditNews(art)}
                            className="min-h-[38px] px-3 py-1.5 bg-white hover:bg-blue-50 border border-slate-300 hover:border-blue-300 text-slate-800 hover:text-[#1d4ed8] text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 transition-colors"
                          >
                            <Edit3
                              className="w-3.5 h-3.5 text-[#1d4ed8]"
                              aria-hidden="true"
                            />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              onDeleteNewsArticle(art.id, art.title)
                            }
                            data-testid={`delete-news-${art.id}`}
                            aria-label={`Hapus berita ${art.title}`}
                            className="min-h-[38px] px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 transition-colors"
                          >
                            <Trash2
                              className="w-3.5 h-3.5"
                              aria-hidden="true"
                            />
                            <span>Hapus</span>
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <p className="py-8 text-center text-xs text-slate-500">
                  Belum ada artikel berita yang tayang. Gunakan formulir di
                  samping untuk menerbitkan berita baru.
                </p>
              )}
            </div>
          </div>

          {/* Galeri Media & Dokumentasi Terunggah (Bisa Dihapus Admin) */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-level-1 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-3.5">
              <div>
                <span className="text-xs font-mono-code font-semibold text-[#1d4ed8] block">
                  ARSIP MEDIA &amp; DOKUMENTASI TERUNGGAH
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                  Galeri Media Dokumentasi ({documentationGallery.length} Media)
                </h2>
              </div>
              <span className="text-xs text-slate-500">
                Hapus media poster atau foto dokumentasi yang tidak diperlukan
              </span>
            </div>

            {documentationGallery.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {documentationGallery.map((doc) => (
                  <article
                    key={doc.id}
                    className="rounded-xl bg-white border border-slate-200/80 overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      <div className="aspect-video w-full bg-slate-100 border-b border-slate-200/80 overflow-hidden">
                        <img
                          src={doc.imageUrl}
                          alt={doc.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4 space-y-1">
                        <span className="text-[11px] font-mono-code text-slate-500 block">
                          <strong className="text-[#1d4ed8]">
                            {doc.archiveCode}
                          </strong>{' '}
                          · {doc.date}
                        </span>
                        <h3 className="text-xs font-bold text-slate-900 leading-snug">
                          {doc.title}
                        </h3>
                        <p className="text-[11px] text-slate-600 line-clamp-2">
                          {doc.caption}
                        </p>
                      </div>
                    </div>

                    <div className="px-4 pb-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono-code text-slate-500 truncate">
                        {doc.photographer}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          onDeleteDocumentationMedia(doc.id, doc.title)
                        }
                        data-testid={`delete-media-${doc.id}`}
                        aria-label={`Hapus media ${doc.title}`}
                        className="min-h-[32px] px-2.5 py-1 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-[11px] font-semibold rounded-lg inline-flex items-center gap-1 shrink-0 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" aria-hidden="true" />
                        <span>Hapus Media</span>
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-xs text-slate-500">
                Tidak ada media dokumentasi di galeri.
              </p>
            )}
          </div>
        </div>
      ) : subTab === 'pengurus-2026' ? (
        /* TAB 3: KELOLA PENGURUS HIMAKA 2026 & UNGGAH FOTO PROFIL */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Kolom Kiri: Form Tambah / Edit Pengurus & Foto Profil */}
          <form
            onSubmit={handleSubmitMemberForm}
            className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-level-1 space-y-4"
          >
            <div className="border-b border-slate-200/80 pb-3.5 flex items-center justify-between gap-2">
              <div>
                <span className="text-xs font-mono-code font-semibold text-[#1d4ed8] block">
                  DIREKTORI PENGURUS HIMAKA 2026
                </span>
                <h2 className="text-base font-bold text-slate-900 mt-0.5">
                  {editingMemberId
                    ? 'Edit Data & Foto Profil Pengurus'
                    : 'Tambah Anggota Pengurus Baru (2026)'}
                </h2>
              </div>
              <Users className="w-5 h-5 text-[#1d4ed8]" aria-hidden="true" />
            </div>

            <div>
              <label
                htmlFor="member-form-name"
                className="block text-xs font-semibold text-slate-900 mb-1"
              >
                Nama Lengkap Pengurus
              </label>
              <input
                id="member-form-name"
                type="text"
                value={memberName}
                onChange={(e) => setMemberName(e.target.value)}
                placeholder="Contoh: Aziz Zaghul Ikhsanudin"
                className="w-full min-h-[42px] px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus-academic"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="member-form-nim"
                  className="block text-xs font-semibold text-slate-900 mb-1"
                >
                  NIM Mahasiswa
                </label>
                <input
                  id="member-form-nim"
                  type="text"
                  value={memberNim}
                  onChange={(e) => setMemberNim(e.target.value)}
                  placeholder="Contoh: 241110051"
                  className="w-full min-h-[42px] px-3.5 py-2 bg-white border border-slate-300 rounded-xl font-mono-code text-xs text-slate-900 focus-academic"
                />
              </div>

              <div>
                <label
                  htmlFor="member-form-cohort"
                  className="block text-xs font-semibold text-slate-900 mb-1"
                >
                  Tahun Angkatan
                </label>
                <input
                  id="member-form-cohort"
                  type="text"
                  value={memberCohort}
                  onChange={(e) => setMemberCohort(e.target.value)}
                  placeholder="2024 / 2025"
                  className="w-full min-h-[42px] px-3.5 py-2 bg-white border border-slate-300 rounded-xl font-mono-code text-xs text-slate-900 focus-academic"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="member-form-role"
                  className="block text-xs font-semibold text-slate-900 mb-1"
                >
                  Jabatan di Kabinet
                </label>
                <input
                  id="member-form-role"
                  type="text"
                  value={memberRole}
                  onChange={(e) => setMemberRole(e.target.value)}
                  placeholder="Ketua / Sekretaris 1 / Anggota Medinfo"
                  className="w-full min-h-[42px] px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus-academic"
                />
              </div>

              <div>
                <label
                  htmlFor="member-form-div"
                  className="block text-xs font-semibold text-slate-900 mb-1"
                >
                  Divisi Penempatan
                </label>
                <select
                  id="member-form-div"
                  value={memberDivision}
                  onChange={(e) =>
                    setMemberDivision(e.target.value as HimakaDivisionName)
                  }
                  className="w-full min-h-[42px] px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus-academic"
                >
                  {divisionList.map((div) => (
                    <option key={div} value={div}>
                      {div}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Unggah Foto Profil Pengurus */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-900">
                  Foto Profil Pengurus (Opsional)
                </span>
                {memberAvatarUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      setMemberAvatarUrl('');
                      setMemberAvatarFileName('');
                    }}
                    className="text-[11px] font-semibold text-rose-700 hover:underline"
                  >
                    Hapus Foto
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3.5">
                {memberAvatarUrl ? (
                  <img
                    src={memberAvatarUrl}
                    alt="Pratinjau Foto Pengurus"
                    className="w-14 h-14 rounded-full object-cover border border-slate-300 shrink-0 bg-white"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-blue-50 border border-blue-200 text-[#1d4ed8] font-mono-code text-sm font-bold flex items-center justify-center shrink-0">
                    {(memberName || 'HM')
                      .split(' ')
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((p) => p[0]?.toUpperCase() || '')
                      .join('')}
                  </div>
                )}

                <div className="flex-1 min-w-0 space-y-1.5">
                  <label
                    htmlFor="member-avatar-file"
                    className="block text-[11px] text-slate-600"
                  >
                    {memberAvatarFileName
                      ? `File terpilih: ${memberAvatarFileName}`
                      : 'Unggah foto dari perangkat (JPG/PNG/WebP/SVG)'}
                  </label>
                  <input
                    id="member-avatar-file"
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleFileUploadToDataUrl(e, 'member-avatar')
                    }
                    className="w-full text-xs text-slate-600 file:mr-2.5 file:py-1.5 file:px-3 file:rounded-lg file:border file:border-slate-300 file:text-xs file:font-semibold file:bg-white file:text-slate-900 hover:file:bg-slate-50"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <button
                type="submit"
                className="flex-1 min-h-[44px] px-4 py-2.5 bg-[#1d4ed8] hover:bg-[#1e40af] text-white text-xs font-semibold rounded-xl inline-flex items-center justify-center gap-2 transition-colors focus-academic"
              >
                <UserPlus className="w-4 h-4" aria-hidden="true" />
                <span>
                  {editingMemberId
                    ? 'Simpan Perubahan Pengurus'
                    : 'Tambah ke Pengurus 2026'}
                </span>
              </button>
              {editingMemberId && (
                <button
                  type="button"
                  onClick={handleCancelEditMember}
                  className="min-h-[44px] px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl inline-flex items-center justify-center gap-1.5 transition-colors"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                  <span>Batal</span>
                </button>
              )}
            </div>
          </form>

          {/* Kolom Kanan: Tabel Daftar Pengurus HIMAKA 2026 (Edit Foto / Hapus) */}
          <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-level-1 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-3.5">
              <div>
                <span className="text-xs font-mono-code font-semibold text-[#1d4ed8] block">
                  KABINET AKSARA CIPTA · PERIODE {activeCabinet?.periodYear}
                </span>
                <h2 className="text-base font-bold text-slate-900 mt-0.5">
                  Daftar Pengurus Aktif HIMAKA 2026 ({allCurrentMembers.length}{' '}
                  Anggota)
                </h2>
              </div>
              <span className="text-xs text-slate-500">
                Klik <strong>Edit / Foto</strong> untuk mengunggah foto profil
                pengurus
              </span>
            </div>

            <div className="divide-y divide-slate-200/80 max-h-[600px] overflow-y-auto pr-1">
              {allCurrentMembers.map((mem, idx) => {
                const initials = mem.name
                  .split(' ')
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((p) => p[0]?.toUpperCase() || '')
                  .join('');
                return (
                  <div
                    key={mem.id}
                    className="py-3.5 first:pt-1 last:pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
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
                      <div>
                        <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono-code text-slate-500">
                          <span className="font-semibold text-slate-900">
                            #{idx + 1} · {mem.nim}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>Angkatan {mem.cohortYear}</span>
                        </div>
                        <p className="text-sm font-bold text-slate-900">
                          {mem.name}
                        </p>
                        <p className="text-xs font-semibold text-[#1d4ed8]">
                          {mem.roleTitle}{' '}
                          <span className="font-normal text-slate-500">
                            · {mem.division}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                      <button
                        type="button"
                        onClick={() => handleStartEditMember(mem)}
                        className="min-h-[36px] px-3 py-1.5 bg-white hover:bg-blue-50 border border-slate-300 hover:border-blue-300 text-slate-800 hover:text-[#1d4ed8] text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 transition-colors"
                      >
                        <Edit3
                          className="w-3.5 h-3.5 text-[#1d4ed8]"
                          aria-hidden="true"
                        />
                        <span>Edit / Foto</span>
                      </button>
                      {onDeleteCabinetMember && (
                        <button
                          type="button"
                          onClick={() =>
                            onDeleteCabinetMember(mem.id, mem.name)
                          }
                          aria-label={`Hapus pengurus ${mem.name}`}
                          className="min-h-[36px] px-3 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Hapus</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : subTab === 'kelola-acara' ? (
        /* TAB 4: BUAT ACARA E-TICKETING BARU & EDIT KUOTA / DETAIL ACARA */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Kolom Kiri: Form Buat Acara E-Ticketing Baru */}
          <form
            onSubmit={handleCreateNewEventSubmit}
            className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-level-1 space-y-4"
          >
            <div className="border-b border-slate-200/80 pb-3.5 flex items-center justify-between gap-2">
              <div>
                <span className="text-xs font-mono-code font-semibold text-[#1d4ed8] block">
                  E-TICKETING PORTAL · PERIODE 2026
                </span>
                <h2 className="text-base font-bold text-slate-900 mt-0.5">
                  Buat Acara Baru yang Membuka Pendaftaran Tiket
                </h2>
              </div>
              <Ticket className="w-5 h-5 text-[#1d4ed8]" aria-hidden="true" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label
                  htmlFor="new-evt-code"
                  className="block text-xs font-semibold text-slate-900 mb-1"
                >
                  Kode Acara
                </label>
                <input
                  id="new-evt-code"
                  type="text"
                  value={newEvtCode}
                  onChange={(e) => setNewEvtCode(e.target.value)}
                  placeholder="BCF-26"
                  className="w-full min-h-[42px] px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono-code text-xs text-slate-900 uppercase focus-academic"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="new-evt-cat"
                  className="block text-xs font-semibold text-slate-900 mb-1"
                >
                  Kategori Kegiatan
                </label>
                <input
                  id="new-evt-cat"
                  type="text"
                  value={newEvtCategory}
                  onChange={(e) => setNewEvtCategory(e.target.value)}
                  placeholder="Seminar / Workshop / Kompetisi"
                  className="w-full min-h-[42px] px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus-academic"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="new-evt-title"
                className="block text-xs font-semibold text-slate-900 mb-1"
              >
                Nama / Judul Acara E-Ticketing
              </label>
              <input
                id="new-evt-title"
                type="text"
                value={newEvtTitle}
                onChange={(e) => setNewEvtTitle(e.target.value)}
                placeholder="Contoh: Bootcamp Cloud Native & DevSecOps HIMAKA 2026"
                className="w-full min-h-[42px] px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus-academic"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="new-evt-date"
                  className="block text-xs font-semibold text-slate-900 mb-1"
                >
                  Tanggal Pelaksanaan
                </label>
                <input
                  id="new-evt-date"
                  type="text"
                  value={newEvtDate}
                  onChange={(e) => setNewEvtDate(e.target.value)}
                  placeholder="12 Desember 2026"
                  className="w-full min-h-[42px] px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus-academic"
                />
              </div>

              <div>
                <label
                  htmlFor="new-evt-time"
                  className="block text-xs font-semibold text-slate-900 mb-1"
                >
                  Jam Pelaksanaan
                </label>
                <input
                  id="new-evt-time"
                  type="text"
                  value={newEvtTime}
                  onChange={(e) => setNewEvtTime(e.target.value)}
                  placeholder="08:30 – 15:30 WIB"
                  className="w-full min-h-[42px] px-3.5 py-2 bg-white border border-slate-300 rounded-xl font-mono-code text-xs text-slate-900 focus-academic"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="new-evt-loc"
                  className="block text-xs font-semibold text-slate-900 mb-1"
                >
                  Lokasi Kegiatan
                </label>
                <input
                  id="new-evt-loc"
                  type="text"
                  value={newEvtLocation}
                  onChange={(e) => setNewEvtLocation(e.target.value)}
                  className="w-full min-h-[42px] px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus-academic"
                />
              </div>

              <div>
                <label
                  htmlFor="new-evt-skp"
                  className="block text-xs font-semibold text-slate-900 mb-1"
                >
                  Beban Poin SKP (Untuk E-Sertifikat)
                </label>
                <input
                  id="new-evt-skp"
                  type="text"
                  value={newEvtSkp}
                  onChange={(e) => setNewEvtSkp(e.target.value)}
                  placeholder="4 SKP Akademik"
                  className="w-full min-h-[42px] px-3.5 py-2 bg-white border border-slate-300 rounded-xl font-mono-code text-xs text-slate-900 focus-academic"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="new-evt-speaker"
                className="block text-xs font-semibold text-slate-900 mb-1"
              >
                Narasumber / Dewan Juri
              </label>
              <input
                id="new-evt-speaker"
                type="text"
                value={newEvtSpeaker}
                onChange={(e) => setNewEvtSpeaker(e.target.value)}
                className="w-full min-h-[42px] px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus-academic"
              />
            </div>

            <div>
              <label
                htmlFor="new-evt-desc"
                className="block text-xs font-semibold text-slate-900 mb-1"
              >
                Deskripsi Singkat Acara
              </label>
              <textarea
                id="new-evt-desc"
                rows={2}
                value={newEvtDesc}
                onChange={(e) => setNewEvtDesc(e.target.value)}
                placeholder="Jelaskan materi, fasilitas peserta, dan ketentuan pendaftaran..."
                className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus-academic"
              />
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
              <span className="text-xs font-bold text-slate-900 block">
                Konfigurasi Tier Tiket &amp; Kuota Awal
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="new-evt-tier-name"
                    className="block text-[11px] font-semibold text-slate-700 mb-1"
                  >
                    Nama Tier Tiket
                  </label>
                  <input
                    id="new-evt-tier-name"
                    type="text"
                    value={newEvtTierName}
                    onChange={(e) => setNewEvtTierName(e.target.value)}
                    className="w-full min-h-[38px] px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label
                    htmlFor="new-evt-tier-mode"
                    className="block text-[11px] font-semibold text-slate-700 mb-1"
                  >
                    Mode Pendaftaran
                  </label>
                  <select
                    id="new-evt-tier-mode"
                    value={newEvtTierMode}
                    onChange={(e) =>
                      setNewEvtTierMode(e.target.value as RegistrationMode)
                    }
                    className="w-full min-h-[38px] px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900"
                  >
                    <option value="individu">Peserta Individu</option>
                    <option value="tim">Delegasi Tim</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="new-evt-tier-price"
                    className="block text-[11px] font-semibold text-slate-700 mb-1"
                  >
                    Harga Tiket (Rp)
                  </label>
                  <input
                    id="new-evt-tier-price"
                    type="number"
                    min={0}
                    step={5000}
                    value={newEvtTierPrice}
                    onChange={(e) =>
                      setNewEvtTierPrice(Number(e.target.value) || 0)
                    }
                    className="w-full min-h-[38px] px-3 py-1.5 bg-white border border-slate-300 rounded-xl font-mono-code text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label
                    htmlFor="new-evt-tier-quota"
                    className="block text-[11px] font-semibold text-slate-700 mb-1"
                  >
                    Kuota Kursi Tersedia
                  </label>
                  <input
                    id="new-evt-tier-quota"
                    type="number"
                    min={1}
                    value={newEvtTierQuota}
                    onChange={(e) =>
                      setNewEvtTierQuota(Number(e.target.value) || 1)
                    }
                    className="w-full min-h-[38px] px-3 py-1.5 bg-white border border-slate-300 rounded-xl font-mono-code text-xs text-slate-900"
                  />
                </div>
              </div>
            </div>

            <label className="flex items-start gap-2.5 p-3 rounded-xl bg-blue-50/70 border border-blue-200/80 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={newEvtAlsoProker}
                onChange={(e) => setNewEvtAlsoProker(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#1d4ed8]"
              />
              <span>
                <strong className="text-slate-900">
                  Tambahkan otomatis ke Daftar Proker 2026:
                </strong>{' '}
                Menghubungkan acara ini langsung ke matriks Program Kerja HIMAKA
                2026.
              </span>
            </label>

            <button
              type="submit"
              className="w-full min-h-[44px] px-4 py-2.5 bg-[#1d4ed8] hover:bg-[#1e40af] text-white text-xs font-semibold rounded-xl inline-flex items-center justify-center gap-2 transition-colors focus-academic"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              <span>Buka Pendaftaran Acara Baru di Katalog</span>
            </button>
          </form>

          {/* Kolom Kanan: Daftar Acara Aktif — Edit Kuota, Harga & Detail Acara */}
          <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-level-1 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-3.5">
              <div>
                <span className="text-xs font-mono-code font-semibold text-[#1d4ed8] block">
                  MANAJEMEN KUOTA KURSI &amp; HARGA TIKET
                </span>
                <h2 className="text-base font-bold text-slate-900 mt-0.5">
                  Daftar Acara E-Ticketing ({events.length} Acara)
                </h2>
              </div>
              <span className="text-xs text-slate-500">
                Ubah jadwal, poin SKP, harga, atau tambah kuota kursi
              </span>
            </div>

            <div className="space-y-4">
              {events.map((ev) => {
                const isEditingThis = editingEventId === ev.id;
                return (
                  <div
                    key={ev.id}
                    className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/90 space-y-3"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono-code text-xs font-bold text-[#1d4ed8]">
                            {ev.code}
                          </span>
                          <span className="text-xs text-slate-500">
                            · {ev.date} · {ev.skpPoints}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                          {ev.title}
                        </h3>
                        <p className="text-xs text-slate-600">{ev.location}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleStartEditEvent(ev)}
                          className="min-h-[36px] px-3 py-1.5 bg-white hover:bg-blue-50 border border-slate-300 text-slate-800 hover:text-[#1d4ed8] text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 transition-colors"
                        >
                          <Edit3
                            className="w-3.5 h-3.5 text-[#1d4ed8]"
                            aria-hidden="true"
                          />
                          <span>Edit Acara &amp; Kuota</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onToggleEventOpen(ev.id)}
                          className={`min-h-[36px] px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                            ev.isOpen
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                              : 'bg-slate-200 border-slate-300 text-slate-700'
                          }`}
                        >
                          {ev.isOpen ? 'Buka (Aktif)' : 'Ditutup'}
                        </button>
                      </div>
                    </div>

                    {/* Ringkasan Tier & Kuota Saat Ini */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      {ev.tiers.map((tier) => (
                        <div
                          key={tier.id}
                          className="p-3 rounded-xl bg-white border border-slate-200/80 flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-semibold text-slate-900 block">
                              {tier.name}
                            </span>
                            <span className="font-mono-code text-slate-500">
                              {formatRupiah(tier.price)}
                            </span>
                          </div>
                          <span className="font-mono-code font-bold text-[#1d4ed8]">
                            Terjual {tier.sold}/{tier.quota}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Form Edit Inline untuk Acara & Kuota Tier */}
                    {isEditingThis && (
                      <form
                        onSubmit={handleSaveEditEvent}
                        className="mt-3 p-4 rounded-xl bg-white border-2 border-[#1d4ed8] space-y-3"
                      >
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                          <span className="text-xs font-mono-code font-bold text-[#1d4ed8]">
                            EDIT DETAIL &amp; KUOTA ACARA ({ev.code})
                          </span>
                          <button
                            type="button"
                            onClick={() => setEditingEventId(null)}
                            className="text-xs text-slate-500 hover:text-slate-900"
                          >
                            Tutup
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                              Judul Acara
                            </label>
                            <input
                              type="text"
                              value={editEvtTitle}
                              onChange={(e) => setEditEvtTitle(e.target.value)}
                              className="w-full min-h-[38px] px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                              Tanggal Pelaksanaan (2026)
                            </label>
                            <input
                              type="text"
                              value={editEvtDate}
                              onChange={(e) => setEditEvtDate(e.target.value)}
                              className="w-full min-h-[38px] px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                              Lokasi Acara
                            </label>
                            <input
                              type="text"
                              value={editEvtLocation}
                              onChange={(e) =>
                                setEditEvtLocation(e.target.value)
                              }
                              className="w-full min-h-[38px] px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                              Poin SKP E-Sertifikat
                            </label>
                            <input
                              type="text"
                              value={editEvtSkp}
                              onChange={(e) => setEditEvtSkp(e.target.value)}
                              className="w-full min-h-[38px] px-3 py-1.5 bg-white border border-slate-300 rounded-xl font-mono-code text-xs text-slate-900"
                            />
                          </div>
                        </div>

                        <div className="space-y-2 pt-1">
                          <span className="block text-[11px] font-bold text-slate-900">
                            Sesuaikan Harga &amp; Kuota per Tier Tiket:
                          </span>
                          {editEvtTiers.map((t, idx) => (
                            <div
                              key={t.tierId}
                              className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200"
                            >
                              <input
                                type="text"
                                value={t.name}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setEditEvtTiers((prev) =>
                                    prev.map((item, i) =>
                                      i === idx ? { ...item, name: val } : item,
                                    ),
                                  );
                                }}
                                aria-label="Nama tier"
                                className="min-h-[34px] px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-xs text-slate-900"
                              />
                              <input
                                type="number"
                                min={0}
                                step={5000}
                                value={t.price}
                                onChange={(e) => {
                                  const val = Number(e.target.value) || 0;
                                  setEditEvtTiers((prev) =>
                                    prev.map((item, i) =>
                                      i === idx
                                        ? { ...item, price: val }
                                        : item,
                                    ),
                                  );
                                }}
                                aria-label="Harga tier"
                                className="min-h-[34px] px-2.5 py-1 bg-white border border-slate-300 rounded-lg font-mono-code text-xs text-slate-900"
                              />
                              <div className="flex items-center gap-1.5">
                                <span className="text-[11px] text-slate-500 whitespace-nowrap">
                                  Kuota:
                                </span>
                                <input
                                  type="number"
                                  min={t.sold}
                                  value={t.quota}
                                  onChange={(e) => {
                                    const val =
                                      Number(e.target.value) || t.sold;
                                    setEditEvtTiers((prev) =>
                                      prev.map((item, i) =>
                                        i === idx
                                          ? { ...item, quota: val }
                                          : item,
                                      ),
                                    );
                                  }}
                                  aria-label="Kuota kursi tier"
                                  className="w-full min-h-[34px] px-2.5 py-1 bg-white border border-slate-300 rounded-lg font-mono-code text-xs text-slate-900"
                                />
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => setEditingEventId(null)}
                            className="min-h-[38px] px-3.5 py-1.5 bg-white border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl"
                          >
                            Batal
                          </button>
                          <button
                            type="submit"
                            className="min-h-[38px] px-4 py-1.5 bg-[#1d4ed8] hover:bg-[#1e40af] text-white text-xs font-semibold rounded-xl inline-flex items-center gap-1.5"
                          >
                            <Save className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Simpan Perubahan Acara &amp; Kuota</span>
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : subTab === 'cms' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Announcements Management */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-level-1 space-y-4">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200/80 pb-3.5">
                Tambah Pengumuman Informasi Kampus
              </h2>

              <form onSubmit={handleAddAnnouncement} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="medinfo-ann-title"
                      className="block text-sm font-semibold text-slate-900 mb-1.5"
                    >
                      Judul Pengumuman
                    </label>
                    <input
                      id="medinfo-ann-title"
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="Contoh: Pembukaan Presale 2 Seminar Nasional"
                      className="w-full min-h-[44px] px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus-academic"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="medinfo-ann-cat"
                      className="block text-sm font-semibold text-slate-900 mb-1.5"
                    >
                      Kategori Label
                    </label>
                    <select
                      id="medinfo-ann-cat"
                      value={newCategory}
                      onChange={(e) =>
                        setNewCategory(
                          e.target.value as MedinfoAnnouncement['category'],
                        )
                      }
                      className="w-full min-h-[44px] px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 focus-academic"
                    >
                      <option value="Penting">Penting</option>
                      <option value="Pembayaran">Pembayaran</option>
                      <option value="Info Gate">Info Gate</option>
                      <option value="Umum">Umum</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="medinfo-ann-content"
                    className="block text-sm font-semibold text-slate-900 mb-1.5"
                  >
                    Isi Informasi Ringkas
                  </label>
                  <textarea
                    id="medinfo-ann-content"
                    rows={3}
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Tulis informasi yang akan tampil pada bagian atas Katalog Acara..."
                    className="w-full p-3.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus-academic"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="min-h-[44px] px-5 py-2.5 bg-[#1d4ed8] hover:bg-[#1e40af] text-white text-xs font-semibold rounded-xl inline-flex items-center gap-2 transition-colors shadow-xs focus-academic"
                  >
                    <Plus className="w-4 h-4" aria-hidden="true" />
                    <span>Terbitkan Pengumuman</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Active Announcements List */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-level-1 space-y-4">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200/80 pb-3.5">
                Daftar Pengumuman Medinfo ({medinfo.announcements.length})
              </h2>

              <div className="space-y-3">
                {medinfo.announcements.map((ann) => (
                  <article
                    key={ann.id}
                    className="p-4 sm:p-5 rounded-xl bg-slate-50/80 border border-slate-200/80 flex flex-col sm:flex-row sm:items-start justify-between gap-4"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <StatusBadge
                          variant={ann.isActive ? 'success' : 'neutral'}
                          label={
                            ann.isActive
                              ? `TAYANG · ${ann.category.toUpperCase()}`
                              : 'ARSIP / NONAKTIF'
                          }
                        />
                        <span className="font-mono-code text-xs text-slate-500">
                          {ann.updatedAt}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 pt-0.5">
                        {ann.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {ann.content}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleToggleAnnouncement(ann.id)}
                        className="min-h-[40px] px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-900 text-xs font-semibold rounded-xl transition-colors shadow-2xs"
                      >
                        {ann.isActive ? 'Sembunyikan' : 'Tayangkan'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteAnnouncement(ann.id)}
                        aria-label={`Hapus pengumuman ${ann.title}`}
                        className="min-h-[40px] px-3.5 py-1.5 bg-rose-50 border border-rose-300 hover:bg-rose-100/80 text-rose-700 text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Payment Config & Event Status Toggles */}
          <div className="lg:col-span-5 space-y-6">
            <form
              onSubmit={handleSaveConfig}
              className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-level-1 space-y-4"
            >
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200/80 pb-3.5">
                Pengaturan Info Pembayaran & Pintu
              </h2>

              <div>
                <label
                  htmlFor="cfg-bank-name"
                  className="block text-sm font-semibold text-slate-900 mb-1.5"
                >
                  Nama Bank Tujuan
                </label>
                <input
                  id="cfg-bank-name"
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 focus-academic"
                />
              </div>

              <div>
                <label
                  htmlFor="cfg-bank-acc"
                  className="block text-sm font-semibold text-slate-900 mb-1.5"
                >
                  Nomor Rekening Organisasi
                </label>
                <input
                  id="cfg-bank-acc"
                  type="text"
                  value={bankAccountNumber}
                  onChange={(e) => setBankAccountNumber(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2 bg-white border border-slate-300 rounded-xl font-mono-code text-sm text-slate-900 focus-academic"
                />
              </div>

              <div>
                <label
                  htmlFor="cfg-bank-holder"
                  className="block text-sm font-semibold text-slate-900 mb-1.5"
                >
                  Atas Nama Rekening
                </label>
                <input
                  id="cfg-bank-holder"
                  type="text"
                  value={bankAccountHolder}
                  onChange={(e) => setBankAccountHolder(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 focus-academic"
                />
              </div>

              <div>
                <label
                  htmlFor="cfg-helpdesk"
                  className="block text-sm font-semibold text-slate-900 mb-1.5"
                >
                  Kontak WhatsApp Helpdesk Panitia
                </label>
                <input
                  id="cfg-helpdesk"
                  type="text"
                  value={helpdeskWhatsapp}
                  onChange={(e) => setHelpdeskWhatsapp(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2 bg-white border border-slate-300 rounded-xl font-mono-code text-sm text-slate-900 focus-academic"
                />
              </div>

              <div>
                <label
                  htmlFor="cfg-gate-note"
                  className="block text-sm font-semibold text-slate-900 mb-1.5"
                >
                  Instruksi Check-in Pintu
                </label>
                <textarea
                  id="cfg-gate-note"
                  rows={3}
                  value={gateCheckinNote}
                  onChange={(e) => setGateCheckinNote(e.target.value)}
                  className="w-full p-3.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus-academic"
                />
              </div>

              <button
                type="submit"
                className="w-full min-h-[44px] px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl inline-flex items-center justify-center gap-2 transition-colors shadow-xs focus-academic"
              >
                <Save className="w-4 h-4" aria-hidden="true" />
                <span>Simpan Konfigurasi Medinfo</span>
              </button>
            </form>

            {/* Event Visibility Control */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-level-1 space-y-3.5">
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-200/80 pb-3">
                Status Pendaftaran Acara di Katalog
              </h2>
              {events.map((ev) => (
                <div
                  key={ev.id}
                  className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <span className="font-mono-code font-bold text-slate-900 block">
                      {ev.code}
                    </span>
                    <span className="font-medium text-slate-600">
                      {ev.title}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onToggleEventOpen(ev.id)}
                    className={`min-h-[38px] px-3.5 py-1.5 rounded-xl font-semibold border transition-colors shrink-0 ${
                      ev.isOpen
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                        : 'bg-slate-100 border-slate-300 text-slate-600'
                    }`}
                  >
                    {ev.isOpen ? 'Buka (Aktif)' : 'Ditutup'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* DESIGN SYSTEM & TOKEN SPECIFICATION VIEW (Output Requirements #3, #4, #5) */
        <div className="space-y-6">
          {/* 1. Color Palette & Semantic Tokens */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-level-1 space-y-4">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200/80 pb-3.5">
              1. Spesifikasi Token Warna (Refined Institutional Editorial)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
              {[
                {
                  name: 'Base Canvas',
                  hex: '#f8fafc',
                  desc: 'Alabaster Slate — Latar utama bebas silau',
                  sampleBg: 'bg-[#f8fafc]',
                },
                {
                  name: 'Surface / Card Base',
                  hex: '#ffffff',
                  desc: 'Crisp White — Permukaan kartu & modal',
                  sampleBg: 'bg-[#ffffff]',
                },
                {
                  name: 'Surface Subdued',
                  hex: '#f1f5f9',
                  desc: 'Header tabel, segmen pasif, backing struktural',
                  sampleBg: 'bg-[#f1f5f9]',
                },
                {
                  name: 'Hairline Border',
                  hex: '#e2e8f0',
                  desc: 'Garis pemisah presisi 1px solid',
                  sampleBg: 'bg-[#e2e8f0]',
                },
                {
                  name: 'Deep Academic Navy',
                  hex: '#0f172a',
                  desc: 'Heading, label kuat, tombol aksi utama',
                  sampleBg: 'bg-[#0f172a]',
                },
                {
                  name: 'Academic Royal Blue',
                  hex: '#1d4ed8',
                  desc: 'Trigger checkout, fokus aktif, progress',
                  sampleBg: 'bg-[#1d4ed8]',
                },
                {
                  name: 'Tier Accent Crimson',
                  hex: '#be123c',
                  desc: 'Khusus badge tier VIP & Early-Bird',
                  sampleBg: 'bg-[#be123c]',
                },
                {
                  name: 'Body & Muted Text',
                  hex: '#334155 / #64748b',
                  desc: 'Teks paragraf utama & metadata sekunder',
                  sampleBg: 'bg-[#334155]',
                },
              ].map((token) => (
                <div
                  key={token.name}
                  className="p-4 rounded-xl border border-slate-200/80 bg-white flex items-start gap-3 shadow-2xs"
                >
                  <div
                    className={`w-10 h-10 rounded-lg border border-slate-200 shrink-0 ${token.sampleBg}`}
                  />
                  <div>
                    <span className="font-bold text-slate-900 block">
                      {token.name}
                    </span>
                    <span className="font-mono-code text-[#1d4ed8] font-semibold block">
                      {token.hex}
                    </span>
                    <span className="text-slate-600 mt-0.5 block">
                      {token.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Semantic Status Architecture & All Component States */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-level-1 space-y-4">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200/80 pb-3.5">
              2. Galeri State Komponen (Success, Warning, Danger, Neutral,
              Loading, Error)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-emerald-50/90 border border-emerald-300 text-emerald-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono-code font-semibold">
                    SUCCESS TOKEN (#ECFDF5 · #10B981 · #047857)
                  </span>
                  <ScanDecisionBadge decision="BOLEH MASUK" />
                </div>
                <p>
                  Digunakan untuk status transaksi <strong>LUNAS</strong> dan
                  keputusan scanner pintu <strong>BOLEH MASUK</strong>.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/90 border border-amber-300 text-amber-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono-code font-semibold">
                    WARNING TOKEN (#FFFBEB · #F59E0B · #B45309)
                  </span>
                  <ScanDecisionBadge decision="SUDAH PERNAH SCAN" />
                </div>
                <p>
                  Digunakan untuk status transaksi <strong>PENDING</strong> dan
                  peringatan anti-passback <strong>SUDAH PERNAH SCAN</strong>.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-rose-50/90 border border-rose-300 text-rose-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono-code font-semibold">
                    DANGER TOKEN (#FEF2F2 · #EF4444 · #B91C1C)
                  </span>
                  <ScanDecisionBadge decision="TIKET TIDAK VALID" />
                </div>
                <p>
                  Digunakan untuk status <strong>DITOLAK</strong>, pesan
                  validasi form error, dan keputusan{' '}
                  <strong>TIKET TIDAK VALID</strong>.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-100 border border-slate-300 text-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono-code font-semibold">
                    NEUTRAL TOKEN (#F1F5F9 · #CBD5E1 · #475569)
                  </span>
                  <StatusBadge variant="neutral" label="HABIS · EXPIRED" />
                </div>
                <p>
                  Digunakan untuk kuota tier <strong>HABIS (Sold Out)</strong>{' '}
                  dan transaksi melewati batas waktu <strong>EXPIRED</strong>.
                </p>
              </div>
            </div>

            {/* Skeleton Loading State Preview */}
            <div className="p-4 rounded-xl bg-slate-50/90 border border-slate-200/80 space-y-2.5">
              <span className="text-xs font-semibold text-slate-900 block">
                State Loading (Skeleton Baris Tabel & Kartu Tiket)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 animate-pulse">
                <div className="h-11 bg-slate-200/80 rounded-xl" />
                <div className="h-11 bg-slate-200/80 rounded-xl" />
                <div className="h-11 bg-slate-200/80 rounded-xl" />
              </div>
            </div>
          </div>

          {/* 3. Typography, Spacing, Radius, Shadow & Responsive Breakpoints */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-level-1 space-y-3.5 text-xs">
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-200/80 pb-3">
                3. Tipografi Tri-Font & Hierarki Nominal
              </h2>
              <div className="space-y-2.5">
                <div className="p-3.5 rounded-xl bg-slate-50/90 border border-slate-200/80">
                  <span className="text-slate-500 block mb-0.5">
                    Heading & Label (Plus Jakarta Sans 600/700)
                  </span>
                  <span className="text-base font-bold text-slate-900">
                    Seminar Nasional Informatika &amp; Etika AI 2025
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50/90 border border-slate-200/80">
                  <span className="text-slate-500 block mb-0.5">
                    Body, Form & Instruksi (Inter Regular/Medium 400/500)
                  </span>
                  <span className="text-sm text-slate-600">
                    Pastikan nominal transfer sesuai hingga 3 digit kode unik
                    terakhir.
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50/90 border border-slate-200/80">
                  <span className="text-slate-500 block mb-0.5">
                    Technical, QR Metadata & Currency (JetBrains Mono 600
                    Tabular)
                  </span>
                  <span className="font-mono-code text-base font-bold text-slate-900">
                    HMK-2025-A01 · TRX-2025-0101 · {formatRupiah(150102)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-level-1 space-y-3.5 text-xs">
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-200/80 pb-3">
                4. Breakpoint, Grid, Radius & Elevation
              </h2>
              <ul className="space-y-2.5 text-slate-600 leading-relaxed">
                <li>
                  <strong className="text-slate-900">
                    Mobile (320px–639px):
                  </strong>{' '}
                  4 kolom, margin & gutter{' '}
                  <code className="font-mono-code">16px (1rem)</code>, tinggi
                  target sentuh minimum{' '}
                  <code className="font-mono-code">44px</code>, tabel otomatis
                  reflow menjadi kartu ringkas.
                </li>
                <li>
                  <strong className="text-slate-900">
                    Tablet (640px–1023px):
                  </strong>{' '}
                  8 kolom, gutter{' '}
                  <code className="font-mono-code">20px (1.25rem)</code>, margin{' '}
                  <code className="font-mono-code">24px (1.5rem)</code>.
                </li>
                <li>
                  <strong className="text-slate-900">Desktop (1024px+):</strong>{' '}
                  12 kolom, container maksimum{' '}
                  <code className="font-mono-code">1280px</code>, gutter{' '}
                  <code className="font-mono-code">24px (1.5rem)</code>, margin{' '}
                  <code className="font-mono-code">32px (2rem)</code>.
                </li>
                <li>
                  <strong className="text-slate-900">Shape & Border:</strong>{' '}
                  Input/Button radius{' '}
                  <code className="font-mono-code">12px (rounded-xl)</code>,
                  Card radius{' '}
                  <code className="font-mono-code">16px (rounded-2xl)</code>,
                  Status badge arsitektural{' '}
                  <code className="font-mono-code">6px (rounded-md)</code>.
                  Seluruh border{' '}
                  <code className="font-mono-code">1px solid #e2e8f0</code>.
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
