'use client';

import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Menu,
  X,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  LogIn,
  UserCheck,
  ShieldCheck,
  Globe,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';
import {
  STORAGE_KEY,
  ProtoState,
  PortalMode,
  AcademicEvent,
  EventTier,
  HimakaUser,
  RegistrationFormInput,
  Transaction,
  MedinfoConfig,
  BreadcrumbItem,
  createInitialSeedState,
  computeUniqueCode,
  calculateCheckoutTotal,
  validateTicketScan,
  markTransactionHadir,
  approveTransaction,
  rejectTransaction,
  isTierSoldOut,
  isEventSoldOut,
  resolvePortalModeForUser,
  buildPortalBreadcrumbs,
  normalizeHimakaInformatikaState,
  getHimakaDocumentationGallery,
  publishUpcomingProkerByMedinfo,
  uploadAfterProkerDocumentationByMedinfo,
  publishStandaloneNewsByMedinfo,
  deleteNewsArticleByMedinfo,
  deleteDocumentationMediaByMedinfo,
  deleteProkerByMedinfo,
  updateProkerByMedinfo,
  updateNewsArticleByMedinfo,
  addCabinetMemberByAdmin,
  updateCabinetMemberByAdmin,
  deleteCabinetMemberByAdmin,
  createAcademicEventByAdmin,
  updateAcademicEventByAdmin,
  MedinfoUpcomingProkerInput,
  MedinfoAfterProkerDocInput,
  MedinfoNewsInput,
  CabinetMemberInput,
  CreateAcademicEventInput,
  UpdateAcademicEventInput,
} from '@/lib/ticketing-core';
import {
  CatalogAndCheckout,
  PesertaSubScreen,
} from '@/components/catalog-and-checkout';
import { MyTicketsView } from '@/components/my-tickets-view';
import { TreasurerDashboard } from '@/components/treasurer-dashboard';
import { GateScannerView } from '@/components/gate-scanner-view';
import { MedinfoView } from '@/components/medinfo-and-specs';
import {
  HomeNewsPortalView,
  AuthGateModal,
} from '@/components/home-news-and-auth';
import {
  LoggedInUserPortalDashboard,
  AdminPortalDashboard,
} from '@/components/portal-dashboards';

export type MainNavTab =
  | 'home'
  | 'user-dashboard'
  | 'admin-dashboard'
  | 'katalog'
  | 'tiketku'
  | 'medinfo'
  | 'scanner'
  | 'bendahara';

interface ToastMessage {
  id: number;
  text: string;
  type: 'success' | 'warning' | 'danger';
}

export default function HimakaTicketingPortalPage() {
  const [protoState, setProtoState] = useState<ProtoState>(() =>
    createInitialSeedState(),
  );
  const [isHydrated, setIsHydrated] = useState(false);

  // Navigation State — Default landing screen is 'home' in Portal 1 (Guest)
  const [activeTab, setActiveTab] = useState<MainNavTab>('home');
  const [pesertaSubScreen, setPesertaSubScreen] =
    useState<PesertaSubScreen>('katalog');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Auth Gate Modal State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authGateMessage, setAuthGateMessage] = useState<string | null>(null);
  const pendingAuthActionRef = useRef<(() => void) | null>(null);

  // Selected event / tier / transaction for checkout flow
  const [selectedEventId, setSelectedEventId] =
    useState<string>('evt-semnas-2025');
  const [selectedTierId, setSelectedTierId] =
    useState<string>('tier-semnas-reg');
  const [activeCheckoutTxId, setActiveCheckoutTxId] = useState<string | null>(
    'TRX-2025-0102',
  );
  const [highlightedTicketTxId, setHighlightedTicketTxId] = useState<
    string | null
  >(null);
  const [scannerPreloadCode, setScannerPreloadCode] =
    useState<string>('HMK-2025-A01');

  // Toast Notification State
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = (
    text: string,
    type: 'success' | 'warning' | 'danger' = 'success',
  ) => {
    setToast({ id: Date.now(), text, type });
  };

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  // Load state from localStorage ('himaka_proto_v2') on client mount
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ProtoState;
        const seed = createInitialSeedState();
        if (
          parsed &&
          Array.isArray(parsed.events) &&
          Array.isArray(parsed.transactions)
        ) {
          // Ensure admin user exists in merged users list
          const existingUsers =
            Array.isArray(parsed.users) && parsed.users.length > 0
              ? parsed.users
              : seed.users || [];
          const hasAdmin = existingUsers.some((u) => u.role === 'pengurus');
          const mergedUsers = hasAdmin
            ? existingUsers
            : [
                ...existingUsers,
                ...(seed.users || []).filter((u) => u.role === 'pengurus'),
              ];

          const restoredUser =
            parsed.currentUser !== undefined ? parsed.currentUser : null;
          const restoredPortal =
            parsed.activePortal || resolvePortalModeForUser(restoredUser);

          const hydratedState = normalizeHimakaInformatikaState({
            ...seed,
            ...parsed,
            users: mergedUsers,
            newsArticles: Array.isArray(parsed.newsArticles)
              ? parsed.newsArticles
              : seed.newsArticles,
            organizationProfile:
              parsed.organizationProfile || seed.organizationProfile,
            cabinetPeriods:
              Array.isArray(parsed.cabinetPeriods) &&
              parsed.cabinetPeriods.length > 0
                ? parsed.cabinetPeriods
                : seed.cabinetPeriods,
            documentationGallery: Array.isArray(parsed.documentationGallery)
              ? parsed.documentationGallery
              : seed.documentationGallery,
            currentUser: restoredUser,
            activePortal: restoredPortal,
          });

          setProtoState(hydratedState);
          window.localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(hydratedState),
          );

          if (restoredPortal === 'user') {
            setActiveTab('user-dashboard');
          } else if (restoredPortal === 'admin') {
            setActiveTab('admin-dashboard');
          }
        }
      } else {
        const seed = createInitialSeedState();
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
      }
    } catch {
      // Ignore storage error and use seed
    }
    setIsHydrated(true);
  }, []);

  // Sync changes to localStorage ('himaka_proto_v2')
  const updateAndPersistState = (updater: (prev: ProtoState) => ProtoState) => {
    setProtoState((prev) => {
      const next = updater(prev);
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore storage quota error
      }
      return next;
    });
  };

  const formatNowWib = () => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
      now.getDate(),
    )} ${pad(now.getHours())}:${pad(now.getMinutes())} WIB`;
  };

  const currentUser = protoState.currentUser || null;
  const activePortal: PortalMode =
    protoState.activePortal || resolvePortalModeForUser(currentUser);

  // Switch between the 3 Portals ('guest', 'user', 'admin')
  const handleSwitchPortal = (targetPortal: PortalMode) => {
    setMobileMenuOpen(false);
    const allUsers = protoState.users || createInitialSeedState().users || [];

    if (targetPortal === 'guest') {
      updateAndPersistState((prev) => ({
        ...prev,
        currentUser: null,
        activePortal: 'guest',
      }));
      setActiveTab('home');
      setPesertaSubScreen('katalog');
      showToast(
        'Beralih ke Portal 1: Portal Guest (Pengunjung Publik).',
        'warning',
      );
      return;
    }

    if (targetPortal === 'user') {
      const participantUser =
        currentUser && currentUser.role === 'peserta'
          ? currentUser
          : allUsers.find((u) => u.role === 'peserta') || allUsers[0];

      if (participantUser) {
        updateAndPersistState((prev) => ({
          ...prev,
          currentUser: participantUser,
          activePortal: 'user',
        }));
        setActiveTab('user-dashboard');
        showToast(
          `Aktif di Portal 2: Portal User (${participantUser.name} · NIM ${participantUser.nim}).`,
          'success',
        );
      }
      return;
    }

    if (targetPortal === 'admin') {
      const adminUser =
        currentUser && currentUser.role === 'pengurus'
          ? currentUser
          : allUsers.find((u) => u.role === 'pengurus') ||
            allUsers[allUsers.length - 1];

      if (adminUser) {
        updateAndPersistState((prev) => ({
          ...prev,
          currentUser: adminUser,
          activePortal: 'admin',
        }));
        setActiveTab('admin-dashboard');
        showToast(
          `Aktif di Portal 3: Portal Admin (${adminUser.name}).`,
          'success',
        );
      }
    }
  };

  const handleRequireAuth = (pendingAction: () => void, reason: string) => {
    if (protoState.currentUser) {
      pendingAction();
      return;
    }
    pendingAuthActionRef.current = pendingAction;
    setAuthGateMessage(reason);
    setAuthModalOpen(true);
  };

  const handleLoginSuccess = (user: HimakaUser) => {
    const resolvedPortal = resolvePortalModeForUser(user);
    updateAndPersistState((prev) => ({
      ...prev,
      currentUser: user,
      activePortal: resolvedPortal,
    }));
    setAuthModalOpen(false);
    setAuthGateMessage(null);
    showToast(
      `Selamat datang di ${
        resolvedPortal === 'admin' ? 'Portal Admin' : 'Portal User'
      }, ${user.name} (${user.nim}).`,
      'success',
    );

    if (pendingAuthActionRef.current) {
      const nextFn = pendingAuthActionRef.current;
      pendingAuthActionRef.current = null;
      nextFn();
    } else {
      setActiveTab(
        resolvedPortal === 'admin' ? 'admin-dashboard' : 'user-dashboard',
      );
    }
  };

  const handleRegisterSuccess = (newUser: HimakaUser) => {
    updateAndPersistState((prev) => ({
      ...prev,
      users: [newUser, ...(prev.users || [])],
      currentUser: newUser,
      activePortal: 'user',
    }));
    setAuthModalOpen(false);
    setAuthGateMessage(null);
    showToast(
      `Registrasi akun berhasil! Anda masuk ke Portal User sebagai ${newUser.name} (${newUser.nim}).`,
      'success',
    );

    if (pendingAuthActionRef.current) {
      const nextFn = pendingAuthActionRef.current;
      pendingAuthActionRef.current = null;
      nextFn();
    } else {
      setActiveTab('user-dashboard');
    }
  };

  const handleLogout = () => {
    handleSwitchPortal('guest');
  };

  const handleSelectEventFromHome = (event: AcademicEvent) => {
    const navigateToEvent = () => {
      setSelectedEventId(event.id);
      const firstAvail =
        event.tiers.find((t) => !isTierSoldOut(t)) || event.tiers[0];
      if (firstAvail) {
        setSelectedTierId(firstAvail.id);
      }
      setActiveTab('katalog');
      setPesertaSubScreen('detail');
    };

    const soldOut = isEventSoldOut(event) || !event.isOpen;
    if (!protoState.currentUser && !soldOut) {
      handleRequireAuth(
        navigateToEvent,
        `Silakan Login atau Register akun terlebih dahulu untuk beralih ke Portal User dan mendaftar pada acara "${event.title}".`,
      );
      return;
    }
    navigateToEvent();
  };

  const handleCreateTransaction = ({
    event,
    tier,
    form,
  }: {
    event: AcademicEvent;
    tier: EventTier;
    form: RegistrationFormInput;
  }): Transaction => {
    const nextIndex = protoState.transactions.length + 101;
    const uniqueCode = computeUniqueCode(nextIndex);
    const totalAmount = calculateCheckoutTotal(tier.price, uniqueCode);
    const txId = `TRX-2026-0${nextIndex}`;
    const suffixLetter = String.fromCharCode(65 + (nextIndex % 26));
    const ticketCode = `HMK-2026-${suffixLetter}${String(
      protoState.transactions.length + 1,
    ).padStart(2, '0')}`;

    const createdAt = formatNowWib();
    const expiresAt = 'Besok, 23:59 WIB';

    const members =
      form.mode === 'tim'
        ? (form.teamMembersText || '')
            .split('\n')
            .map((m) => m.trim())
            .filter(Boolean)
        : undefined;

    const newTx: Transaction = {
      id: txId,
      ticketCode,
      eventId: event.id,
      eventTitle: event.title,
      tierId: tier.id,
      tierName: tier.name,
      mode: form.mode,
      participantName: form.participantName.trim(),
      nim: form.nim.trim(),
      faculty: form.faculty.trim(),
      email: form.email.trim(),
      whatsapp: form.whatsapp.trim(),
      teamName: form.mode === 'tim' ? form.teamName?.trim() : undefined,
      teamMembers: members,
      basePrice: tier.price,
      uniqueCode,
      totalAmount,
      status: 'PENDING',
      createdAt,
      expiresAt,
      scanCount: 0,
    };

    updateAndPersistState((prev) => ({
      ...prev,
      events: prev.events.map((ev) => {
        if (ev.id !== event.id) return ev;
        return {
          ...ev,
          tiers: ev.tiers.map((t) => {
            if (t.id !== tier.id) return t;
            return {
              ...t,
              sold: Math.min(t.quota, t.sold + 1),
            };
          }),
        };
      }),
      transactions: [newTx, ...prev.transactions],
    }));

    setActiveCheckoutTxId(newTx.id);
    showToast(
      `Pendaftaran ${newTx.id} berhasil dibuat. Lanjutkan transfer sejumlah Rp ${totalAmount.toLocaleString(
        'id-ID',
      )}.`,
      'success',
    );
    return newTx;
  };

  const handleUploadProof = (
    txId: string,
    fileName: string,
    senderBank: string,
    senderName: string,
  ) => {
    const uploadedAt = formatNowWib();
    updateAndPersistState((prev) => ({
      ...prev,
      transactions: prev.transactions.map((tx) => {
        if (tx.id !== txId) return tx;
        return {
          ...tx,
          status: 'PENDING',
          proofFileName: fileName,
          proofUploadedAt: uploadedAt,
          proofSenderBank: senderBank,
          proofSenderName: senderName,
          rejectionReason: undefined,
        };
      }),
    }));
    showToast(
      `Bukti pembayaran (${fileName}) berhasil diunggah. Menunggu verifikasi Bendahara.`,
      'success',
    );
  };

  const handleMarkExpired = (txId: string) => {
    updateAndPersistState((prev) => {
      const target = prev.transactions.find((t) => t.id === txId);
      if (!target) return prev;
      const shouldRestore =
        target.status !== 'EXPIRED' && target.status !== 'DITOLAK';

      return {
        ...prev,
        events: shouldRestore
          ? prev.events.map((ev) =>
              ev.id !== target.eventId
                ? ev
                : {
                    ...ev,
                    tiers: ev.tiers.map((t) =>
                      t.id !== target.tierId
                        ? t
                        : { ...t, sold: Math.max(0, t.sold - 1) },
                    ),
                  },
            )
          : prev.events,
        transactions: prev.transactions.map((tx) =>
          tx.id === txId ? { ...tx, status: 'EXPIRED' } : tx,
        ),
      };
    });
    showToast(
      `Transaksi ${txId} ditandai EXPIRED dan kuota dikembalikan.`,
      'warning',
    );
  };

  const handleApproveTransaction = (txId: string) => {
    const nowIso = formatNowWib();
    updateAndPersistState((prev) => approveTransaction(prev, txId, nowIso));
    showToast(
      `Transaksi ${txId} disetujui (LUNAS). E-Ticket QR telah aktif.`,
      'success',
    );
  };

  const handleRejectTransaction = (txId: string, reason: string) => {
    const nowIso = formatNowWib();
    updateAndPersistState((prev) =>
      rejectTransaction(prev, txId, reason, nowIso),
    );
    showToast(
      `Transaksi ${txId} ditolak dan kuota kursi dipulihkan.`,
      'danger',
    );
  };

  const handleScanCode = (code: string) => {
    const nowIso = formatNowWib();
    const outcome = validateTicketScan(protoState, code, nowIso);
    updateAndPersistState(() => outcome.nextState);

    if (outcome.result.decision === 'BOLEH MASUK') {
      showToast(
        `BOLEH MASUK: Tiket ${outcome.result.inputCode} valid & dicatat masuk.`,
        'success',
      );
    } else if (outcome.result.decision === 'SUDAH PERNAH SCAN') {
      showToast(
        `SUDAH PERNAH SCAN: Tiket ${outcome.result.inputCode} terdeteksi anti-passback.`,
        'warning',
      );
    } else {
      showToast(`TIKET TIDAK VALID: ${outcome.result.reason}`, 'danger');
    }

    return {
      result: outcome.result,
      matchedTransaction: outcome.matchedTransaction,
    };
  };

  const handleResetDemoData = () => {
    const fresh = createInitialSeedState();
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    } catch {
      // Ignore
    }
    setProtoState(fresh);
    setActiveTab('home');
    setActiveCheckoutTxId('TRX-2025-0102');
    showToast(
      'Data demo prototype (himaka_proto_v2) berhasil direset ke kondisi awal.',
      'warning',
    );
  };

  const handleUpdateMedinfo = (nextMedinfo: MedinfoConfig) => {
    updateAndPersistState((prev) => ({
      ...prev,
      medinfo: nextMedinfo,
    }));
  };

  const handleToggleEventOpen = (eventId: string) => {
    updateAndPersistState((prev) => ({
      ...prev,
      events: prev.events.map((ev) =>
        ev.id === eventId ? { ...ev, isOpen: !ev.isOpen } : ev,
      ),
    }));
    showToast('Status publikasi pendaftaran acara diperbarui.', 'success');
  };

  const handlePublishUpcomingProker = (input: MedinfoUpcomingProkerInput) => {
    let createdCode = '';
    updateAndPersistState((prev) => {
      const outcome = publishUpcomingProkerByMedinfo(prev, input);
      createdCode = outcome.createdProker.code;
      return outcome.nextState;
    });
    showToast(
      `Proker kedepan "${input.name}" (${createdCode}) beserta media posternya berhasil dipublikasikan Medinfo!`,
      'success',
    );
  };

  const handleUploadAfterProkerDoc = (input: MedinfoAfterProkerDocInput) => {
    let archiveCode = '';
    updateAndPersistState((prev) => {
      const outcome = uploadAfterProkerDocumentationByMedinfo(prev, input);
      archiveCode = outcome.createdDoc.archiveCode;
      return outcome.nextState;
    });
    showToast(
      `Dokumentasi After-Proker (${archiveCode}) berhasil diunggah dan ditautkan ke proker serta galeri!`,
      'success',
    );
  };

  const handlePublishStandaloneNews = (input: MedinfoNewsInput) => {
    let createdId = '';
    updateAndPersistState((prev) => {
      const outcome = publishStandaloneNewsByMedinfo(prev, input);
      createdId = outcome.createdNews.id;
      return outcome.nextState;
    });
    showToast(
      `Berita "${input.title}" (${createdId}) berhasil dipublikasikan Medinfo!`,
      'success',
    );
  };

  const handleDeleteNewsArticle = (newsId: string, title?: string) => {
    updateAndPersistState((prev) => deleteNewsArticleByMedinfo(prev, newsId));
    showToast(
      `Berita ${title ? `"${title}" ` : ''}(${newsId}) berhasil dihapus oleh Admin.`,
      'warning',
    );
  };

  const handleDeleteDocumentationMedia = (docId: string, title?: string) => {
    updateAndPersistState((prev) =>
      deleteDocumentationMediaByMedinfo(prev, docId),
    );
    showToast(
      `Media dokumentasi ${title ? `"${title}" ` : ''}berhasil dihapus oleh Admin.`,
      'warning',
    );
  };

  const handleDeleteProker = (prokerId: string, name?: string) => {
    updateAndPersistState((prev) => deleteProkerByMedinfo(prev, prokerId));
    showToast(
      `Program kerja ${name ? `"${name}" ` : ''}berhasil dihapus oleh Admin.`,
      'warning',
    );
  };

  const handleUpdateProker = (
    prokerId: string,
    input: Partial<MedinfoUpcomingProkerInput>,
  ) => {
    updateAndPersistState((prev) =>
      updateProkerByMedinfo(prev, prokerId, input),
    );
  };

  const handleUpdateNewsArticle = (
    newsId: string,
    input: Partial<MedinfoNewsInput>,
  ) => {
    updateAndPersistState((prev) =>
      updateNewsArticleByMedinfo(prev, newsId, input),
    );
  };

  const handleAddCabinetMember = (input: CabinetMemberInput) => {
    updateAndPersistState(
      (prev) => addCabinetMemberByAdmin(prev, input).nextState,
    );
  };

  const handleUpdateCabinetMember = (
    memberId: string,
    input: Partial<CabinetMemberInput>,
  ) => {
    updateAndPersistState((prev) =>
      updateCabinetMemberByAdmin(prev, memberId, input),
    );
  };

  const handleDeleteCabinetMember = (memberId: string, name?: string) => {
    updateAndPersistState((prev) => deleteCabinetMemberByAdmin(prev, memberId));
    showToast(
      `Data pengurus ${name ? `"${name}" ` : ''}berhasil dihapus dari kabinet 2026.`,
      'warning',
    );
  };

  const handleCreateAcademicEvent = (input: CreateAcademicEventInput) => {
    let createdId = '';
    let firstTierId = '';
    updateAndPersistState((prev) => {
      const outcome = createAcademicEventByAdmin(prev, input);
      createdId = outcome.createdEvent.id;
      firstTierId = outcome.createdEvent.tiers[0]?.id || '';
      return outcome.nextState;
    });
    if (createdId) {
      setSelectedEventId(createdId);
      if (firstTierId) setSelectedTierId(firstTierId);
    }
  };

  const handleUpdateAcademicEvent = (
    eventId: string,
    input: UpdateAcademicEventInput,
  ) => {
    updateAndPersistState((prev) =>
      updateAcademicEventByAdmin(prev, eventId, input),
    );
  };

  const activeCheckoutTx =
    protoState.transactions.find((t) => t.id === activeCheckoutTxId) ||
    protoState.transactions[0] ||
    null;

  // Dynamic Navigation Items per Portal Mode
  const navItemsByPortal: Record<
    PortalMode,
    { id: MainNavTab; label: string }[]
  > = {
    guest: [
      { id: 'home', label: 'Beranda Organisasi' },
      { id: 'katalog', label: 'Katalog Proker & Acara' },
    ],
    user: [
      { id: 'user-dashboard', label: 'Dashboard Peserta' },
      { id: 'katalog', label: 'Daftar Proker & Katalog' },
      { id: 'tiketku', label: 'Tiketku & E-Ticket QR' },
      { id: 'home', label: 'Informasi HIMAKA' },
    ],
    admin: [
      { id: 'admin-dashboard', label: 'Overview Admin' },
      { id: 'bendahara', label: 'Bendahara & CSV' },
      { id: 'scanner', label: 'Scanner Gate' },
      { id: 'medinfo', label: 'CMS Medinfo' },
      { id: 'home', label: 'Web Informasi Publik' },
    ],
  };

  const navItems = navItemsByPortal[activePortal];

  const handleNavClick = (tab: MainNavTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    if (tab === 'katalog') {
      setPesertaSubScreen('katalog');
    }
  };

  // Resolve current Event, Tier, and Transaction for Breadcrumb Hierarchy
  const selectedEventForCrumb =
    protoState.events.find((e) => e.id === selectedEventId) ||
    protoState.events[0];
  const selectedTierForCrumb =
    selectedEventForCrumb?.tiers.find((t) => t.id === selectedTierId) ||
    selectedEventForCrumb?.tiers[0];
  const highlightedTicketTx =
    (highlightedTicketTxId &&
      protoState.transactions.find((t) => t.id === highlightedTicketTxId)) ||
    protoState.transactions[0] ||
    null;

  const breadcrumbs = buildPortalBreadcrumbs({
    portal: activePortal,
    activeTab,
    pesertaSubScreen,
    selectedEvent: selectedEventForCrumb,
    selectedTier: selectedTierForCrumb,
    activeTransaction:
      activeTab === 'tiketku' ? highlightedTicketTx : activeCheckoutTx,
  });

  const handleBreadcrumbClick = (crumb: BreadcrumbItem) => {
    if (!crumb.action) return;
    if (crumb.action.type === 'tab') {
      setActiveTab(crumb.action.tab);
      if (crumb.action.tab === 'katalog') {
        setPesertaSubScreen('katalog');
      }
    } else if (crumb.action.type === 'katalog-subscreen') {
      setActiveTab('katalog');
      setPesertaSubScreen(crumb.action.subScreen);
    }
  };

  const parentBreadcrumb =
    breadcrumbs.length >= 2 ? breadcrumbs[breadcrumbs.length - 2] : null;

  return (
    <div
      className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-700"
      data-hydrated={isHydrated ? 'true' : 'false'}
      data-portal={activePortal}
    >
      {/* SCREEN 9: DESKTOP & MOBILE NAVIGATION + 3-PORTAL SWITCHER */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-level-1">
        {/* Sleek Top Institutional Workspace Strip (3-Portal Switcher) */}
        <div className="bg-slate-900 text-slate-300 border-b border-slate-800">
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-[11px] font-mono-code">
              <span className="font-semibold text-white tracking-wide">
                SIMULASI 3 PORTAL HIMAKA UMBY
              </span>
              <span className="hidden md:inline text-slate-400">
                · Pilih ruang kerja sesuai peran pengguna
              </span>
            </div>

            <div
              className="flex flex-wrap items-center gap-1"
              role="group"
              aria-label="Pemilih 3 Portal HIMAKA UMBY"
            >
              <button
                type="button"
                onClick={() => handleSwitchPortal('guest')}
                aria-pressed={activePortal === 'guest'}
                className={`min-h-[30px] px-2.5 py-1 rounded-md text-[11px] font-semibold inline-flex items-center gap-1.5 transition-all focus-academic ${
                  activePortal === 'guest'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Globe className="w-3 h-3" aria-hidden="true" />
                <span>1. Portal Guest</span>
              </button>

              <button
                type="button"
                onClick={() => handleSwitchPortal('user')}
                aria-pressed={activePortal === 'user'}
                className={`min-h-[30px] px-2.5 py-1 rounded-md text-[11px] font-semibold inline-flex items-center gap-1.5 transition-all focus-academic ${
                  activePortal === 'user'
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <UserCheck className="w-3 h-3" aria-hidden="true" />
                <span>2. Portal User (Sudah Login)</span>
              </button>

              <button
                type="button"
                onClick={() => handleSwitchPortal('admin')}
                aria-pressed={activePortal === 'admin'}
                className={`min-h-[30px] px-2.5 py-1 rounded-md text-[11px] font-semibold inline-flex items-center gap-1.5 transition-all focus-academic ${
                  activePortal === 'admin'
                    ? 'bg-[#2563eb] text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <ShieldCheck className="w-3 h-3" aria-hidden="true" />
                <span>3. Portal Admin</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Navigation Bar */}
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
          {/* Zone 1: Brand Wordmark + Clean Typographic Subtitle */}
          <div className="flex items-center gap-3.5 shrink-0">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                if (activePortal === 'user') {
                  handleNavClick('user-dashboard');
                } else if (activePortal === 'admin') {
                  handleNavClick('admin-dashboard');
                } else {
                  handleNavClick('home');
                }
              }}
              className="group flex items-center gap-3 focus-academic rounded-lg py-1"
            >
              <img
                src="/images/logo-himaka-umby.svg"
                alt="Logo Resmi HIMAKA UMBY"
                className="w-10 h-10 rounded-full object-contain shrink-0 shadow-xs"
              />
              <div>
                <span className="block text-base font-extrabold tracking-tight text-slate-900 leading-none">
                  HIMAKA UMBY
                </span>
                <span className="block text-[11px] font-mono-code text-slate-500 mt-1 leading-none">
                  {activePortal === 'guest'
                    ? 'Portal Publik · Informatika'
                    : activePortal === 'user'
                      ? 'Workspace Mahasiswa'
                      : 'Konsol Pengurus & Panitia'}
                </span>
              </div>
            </a>
          </div>

          {/* Zone 2: Clean single-line text navigation links for current portal */}
          <nav
            aria-label="Navigasi Utama"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600"
          >
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.id);
                  }}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative py-2 transition-colors whitespace-nowrap shrink-0 focus-academic ${
                    isActive
                      ? 'text-slate-900 font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.span
                      layoutId="active-portal-nav-underline"
                      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute left-0 right-0 bottom-0 h-0.5 bg-[#1d4ed8] rounded-full"
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Zone 3: Auth CTA on desktop + Mobile menu trigger on mobile */}
          <div className="flex items-center gap-2.5 shrink-0">
            {currentUser ? (
              <button
                type="button"
                onClick={handleLogout}
                className="hidden md:inline-flex min-h-[40px] px-3.5 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200/80 border border-slate-200/90 rounded-xl items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0 focus-academic"
              >
                <UserCheck
                  className="w-3.5 h-3.5 text-emerald-600"
                  aria-hidden="true"
                />
                <span>{currentUser.name.split(' ')[0]} · Keluar</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  pendingAuthActionRef.current = null;
                  setAuthGateMessage(null);
                  setAuthModalOpen(true);
                }}
                className="hidden md:inline-flex min-h-[40px] px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0 focus-academic shadow-level-1"
              >
                <LogIn className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Login / Register</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-drawer"
              aria-label={
                mobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'
              }
              className="md:hidden min-h-[42px] px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 text-xs font-semibold rounded-xl inline-flex items-center gap-2 transition-colors focus-academic"
            >
              {mobileMenuOpen ? (
                <>
                  <X className="w-4 h-4" aria-hidden="true" />
                  <span>Tutup</span>
                </>
              ) : (
                <>
                  <Menu className="w-4 h-4" aria-hidden="true" />
                  <span>Menu</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Collapsible Menu Drawer */}
        {mobileMenuOpen && (
          <nav
            id="mobile-navigation-drawer"
            aria-label="Navigasi Mobile"
            className="md:hidden bg-white border-t border-slate-200 px-4 py-3 space-y-1.5 shadow-level-2"
          >
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full min-h-[44px] px-4 py-2.5 rounded-xl text-left text-sm font-semibold flex items-center justify-between transition-colors ${
                    isActive
                      ? 'bg-blue-50/80 text-[#1d4ed8] border border-blue-200'
                      : 'bg-white text-slate-800 hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="font-mono-code text-xs">Aktif</span>
                  )}
                </button>
              );
            })}

            <div className="pt-2 border-t border-slate-200">
              {currentUser ? (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center justify-between"
                >
                  <span>
                    Akun: {currentUser.name} ({currentUser.nim})
                  </span>
                  <span>Keluar ke Guest</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    pendingAuthActionRef.current = null;
                    setAuthGateMessage(null);
                    setAuthModalOpen(true);
                  }}
                  className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" aria-hidden="true" />
                  <span>Login / Register Akun</span>
                </button>
              )}
            </div>
          </nav>
        )}
      </header>

      {/* BREADCRUMB NAVIGATION BAR ON INNER VIEWS (Below Main Header) */}
      {breadcrumbs.length > 0 && (
        <nav
          aria-label="Breadcrumb Hirarki Portal"
          data-testid="portal-breadcrumb-bar"
          className="bg-white/80 backdrop-blur-xs border-b border-slate-200/80"
        >
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3">
            <ol className="flex flex-wrap items-center gap-1.5 text-xs">
              {breadcrumbs.map((crumb, idx) => {
                const isLast = idx === breadcrumbs.length - 1;
                return (
                  <li
                    key={crumb.id}
                    className="inline-flex items-center gap-1.5"
                  >
                    {idx > 0 && (
                      <ChevronRight
                        className="w-3.5 h-3.5 text-slate-400 shrink-0"
                        aria-hidden="true"
                      />
                    )}
                    {crumb.isCurrent || isLast ? (
                      <span
                        aria-current="page"
                        className="inline-flex items-center gap-1.5 font-semibold text-slate-900"
                      >
                        <span className="truncate max-w-[240px] sm:max-w-[360px]">
                          {crumb.label}
                        </span>
                        {crumb.codeBadge && (
                          <span className="font-mono-code text-[11px] font-semibold text-[#1d4ed8]">
                            · {crumb.codeBadge}
                          </span>
                        )}
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleBreadcrumbClick(crumb)}
                        title={crumb.label}
                        className="text-slate-600 hover:text-[#1d4ed8] font-medium underline-offset-4 hover:underline transition-colors focus-academic rounded px-1 py-0.5 max-w-[180px] sm:max-w-[240px] truncate"
                      >
                        {crumb.label}
                      </button>
                    )}
                  </li>
                );
              })}
            </ol>

            {parentBreadcrumb?.action && (
              <button
                type="button"
                onClick={() => handleBreadcrumbClick(parentBreadcrumb)}
                title={`Kembali ke ${parentBreadcrumb.label}`}
                className="min-h-[32px] px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-xs font-semibold text-slate-800 inline-flex items-center gap-1.5 transition-colors focus-academic shrink-0"
              >
                <ArrowLeft
                  className="w-3.5 h-3.5 text-[#1d4ed8] shrink-0"
                  aria-hidden="true"
                />
                <span className="max-w-[180px] sm:max-w-[220px] truncate">
                  Kembali ke {parentBreadcrumb.label}
                </span>
              </button>
            )}
          </div>
        </nav>
      )}

      {/* Accessible Toast Notification Banner with Smooth Fade-in */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            role="status"
            aria-live="polite"
            className="fixed bottom-4 right-4 left-16 sm:left-auto z-50 max-w-md"
          >
            <div
              className={`px-4 py-3 rounded-xl border shadow-level-3 flex items-center gap-3 text-xs font-medium ${
                toast.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : toast.type === 'warning'
                    ? 'bg-amber-50 border-amber-200 text-amber-800'
                    : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              {toast.type === 'success' && (
                <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
              )}
              {toast.type === 'warning' && (
                <AlertTriangle
                  className="w-4 h-4 shrink-0"
                  aria-hidden="true"
                />
              )}
              {toast.type === 'danger' && (
                <XCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
              )}
              <span>{toast.text}</span>
              <button
                type="button"
                onClick={() => setToast(null)}
                aria-label="Tutup notifikasi"
                className="ml-2 p-1 rounded hover:bg-black/5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Container with Smooth Tab & Portal Fade-In Transition */}
      <main className="flex-1 w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={`${activePortal}-${activeTab}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* PORTAL 2 VIEW: DASHBOARD USER YANG SUDAH LOGIN */}
            {activeTab === 'user-dashboard' && currentUser && (
              <LoggedInUserPortalDashboard
                user={currentUser}
                transactions={protoState.transactions}
                events={protoState.events}
                medinfo={protoState.medinfo}
                documentationGallery={getHimakaDocumentationGallery(
                  protoState.documentationGallery,
                )}
                onSelectEventForRegistration={handleSelectEventFromHome}
                onOpenMyTickets={(txId) => {
                  if (txId) setHighlightedTicketTxId(txId);
                  setActiveTab('tiketku');
                }}
                onOpenPaymentUpload={(tx) => {
                  setActiveCheckoutTxId(tx.id);
                  setActiveTab('katalog');
                  setPesertaSubScreen('pembayaran');
                }}
                onOpenOrgInfo={() => setActiveTab('home')}
                onLogout={handleLogout}
              />
            )}

            {/* PORTAL 3 VIEW: DASHBOARD ADMIN PENGURUS */}
            {activeTab === 'admin-dashboard' && currentUser && (
              <AdminPortalDashboard
                adminUser={currentUser}
                transactions={protoState.transactions}
                scanLogs={protoState.scanLogs}
                events={protoState.events}
                cabinetPeriods={
                  protoState.cabinetPeriods ||
                  createInitialSeedState().cabinetPeriods!
                }
                documentationGallery={getHimakaDocumentationGallery(
                  protoState.documentationGallery,
                )}
                onDeleteDocumentationMedia={handleDeleteDocumentationMedia}
                onOpenTab={(tab) => setActiveTab(tab)}
                onLogout={handleLogout}
              />
            )}

            {/* PORTAL 1 (GUEST) & SHARED ORG INFO VIEW */}
            {activeTab === 'home' && (
              <HomeNewsPortalView
                organizationProfile={
                  protoState.organizationProfile ||
                  createInitialSeedState().organizationProfile!
                }
                cabinetPeriods={
                  protoState.cabinetPeriods ||
                  createInitialSeedState().cabinetPeriods!
                }
                newsArticles={protoState.newsArticles || []}
                events={protoState.events}
                announcements={protoState.medinfo.announcements}
                documentationGallery={getHimakaDocumentationGallery(
                  protoState.documentationGallery,
                )}
                currentUser={currentUser}
                onSelectEventForRegistration={handleSelectEventFromHome}
                onOpenCatalog={() => {
                  setActiveTab('katalog');
                  setPesertaSubScreen('katalog');
                }}
                onOpenAuthModal={(reason) => {
                  pendingAuthActionRef.current = null;
                  setAuthGateMessage(reason || null);
                  setAuthModalOpen(true);
                }}
                onDeleteNewsArticle={handleDeleteNewsArticle}
                onDeleteDocumentationMedia={handleDeleteDocumentationMedia}
                onDeleteProker={handleDeleteProker}
              />
            )}

            {activeTab === 'katalog' && (
              <CatalogAndCheckout
                events={protoState.events}
                medinfo={protoState.medinfo}
                transactionsCount={protoState.transactions.length}
                currentUser={currentUser}
                onRequireAuth={handleRequireAuth}
                activeSubScreen={pesertaSubScreen}
                setActiveSubScreen={setPesertaSubScreen}
                selectedEventId={selectedEventId}
                setSelectedEventId={setSelectedEventId}
                selectedTierId={selectedTierId}
                setSelectedTierId={setSelectedTierId}
                activeCheckoutTx={activeCheckoutTx}
                onCreateTransaction={handleCreateTransaction}
                onUploadProof={handleUploadProof}
                onMarkExpired={handleMarkExpired}
                onGoToMyTickets={(txId) => {
                  if (txId) setHighlightedTicketTxId(txId);
                  setActiveTab('tiketku');
                }}
                onNotify={showToast}
              />
            )}

            {activeTab === 'tiketku' && (
              <MyTicketsView
                transactions={protoState.transactions}
                events={protoState.events}
                activeCabinet={
                  (protoState.cabinetPeriods ||
                    createInitialSeedState().cabinetPeriods)?.[0]
                }
                highlightedTxId={highlightedTicketTxId}
                onOpenPaymentUpload={(tx) => {
                  const openPayment = () => {
                    setActiveCheckoutTxId(tx.id);
                    setActiveTab('katalog');
                    setPesertaSubScreen('pembayaran');
                  };
                  if (!currentUser) {
                    handleRequireAuth(
                      openPayment,
                      'Silakan Login atau Register terlebih dahulu untuk mengunggah bukti pembayaran.',
                    );
                    return;
                  }
                  openPayment();
                }}
                onGoToCatalog={() => {
                  setActiveTab('katalog');
                  setPesertaSubScreen('katalog');
                }}
                onSimulateScanInGate={(ticketCode) => {
                  setScannerPreloadCode(ticketCode);
                  handleSwitchPortal('admin');
                  setActiveTab('scanner');
                }}
                onMarkTicketHadir={(txId) => {
                  const nowIso = formatNowWib();
                  updateAndPersistState((prev) =>
                    markTransactionHadir(prev, txId, nowIso),
                  );
                  showToast(
                    `Status kehadiran tiket ${txId} ditandai HADIR. Tombol E-Certificate kini aktif!`,
                    'success',
                  );
                }}
                onNotify={showToast}
              />
            )}

            {activeTab === 'bendahara' && (
              <TreasurerDashboard
                transactions={protoState.transactions}
                onApprove={handleApproveTransaction}
                onReject={handleRejectTransaction}
                onResetDemoData={handleResetDemoData}
                onNotify={showToast}
              />
            )}

            {activeTab === 'scanner' && (
              <GateScannerView
                transactions={protoState.transactions}
                scanLogs={protoState.scanLogs}
                events={protoState.events}
                activeCabinet={
                  (protoState.cabinetPeriods ||
                    createInitialSeedState().cabinetPeriods)?.[0]
                }
                initialCode={scannerPreloadCode}
                onScanCode={handleScanCode}
                onNotify={showToast}
              />
            )}

            {activeTab === 'medinfo' && (
              <MedinfoView
                medinfo={protoState.medinfo}
                events={protoState.events}
                cabinetPeriods={
                  protoState.cabinetPeriods ||
                  createInitialSeedState().cabinetPeriods!
                }
                newsArticles={protoState.newsArticles || []}
                documentationGallery={getHimakaDocumentationGallery(
                  protoState.documentationGallery,
                )}
                onPublishUpcomingProker={handlePublishUpcomingProker}
                onUpdateProker={handleUpdateProker}
                onUploadAfterProkerDoc={handleUploadAfterProkerDoc}
                onPublishStandaloneNews={handlePublishStandaloneNews}
                onUpdateNewsArticle={handleUpdateNewsArticle}
                onDeleteNewsArticle={handleDeleteNewsArticle}
                onDeleteDocumentationMedia={handleDeleteDocumentationMedia}
                onDeleteProker={handleDeleteProker}
                onAddCabinetMember={handleAddCabinetMember}
                onUpdateCabinetMember={handleUpdateCabinetMember}
                onDeleteCabinetMember={handleDeleteCabinetMember}
                onCreateAcademicEvent={handleCreateAcademicEvent}
                onUpdateAcademicEvent={handleUpdateAcademicEvent}
                onUpdateMedinfo={handleUpdateMedinfo}
                onToggleEventOpen={handleToggleEventOpen}
                onNotify={showToast}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Auth Gate Modal (Login / Register for Portal User & Portal Admin) */}
      <AuthGateModal
        isOpen={authModalOpen}
        onClose={() => {
          setAuthModalOpen(false);
          setAuthGateMessage(null);
          pendingAuthActionRef.current = null;
        }}
        gateMessage={authGateMessage}
        users={protoState.users || []}
        onLoginSuccess={handleLoginSuccess}
        onRegisterSuccess={handleRegisterSuccess}
      />

      {/* Quiet Institutional Footer */}
      <footer className="bg-white border-t border-slate-200/80 mt-16">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2.5">
            <img
              src="/images/logo-himaka-umby.svg"
              alt="Logo HIMAKA UMBY"
              className="w-6 h-6 rounded-full object-contain shrink-0"
            />
            <span className="font-bold text-slate-900">
              {protoState.medinfo.organizationName}
            </span>
            <span aria-hidden="true">·</span>
            <span>{protoState.medinfo.period}</span>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <span>Helpdesk: {protoState.medinfo.helpdeskWhatsapp}</span>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={handleResetDemoData}
              className="text-slate-700 hover:text-[#1d4ed8] font-semibold underline underline-offset-4 focus-academic transition-colors"
            >
              Reset Data Demo (himaka_proto_v2)
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
