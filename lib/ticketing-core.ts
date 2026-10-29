export const STORAGE_KEY = 'himaka_proto_v2';

export type TransactionStatus = 'PENDING' | 'LUNAS' | 'DITOLAK' | 'EXPIRED';
export type RegistrationMode = 'individu' | 'tim';
export type ScanDecision =
  | 'BOLEH MASUK'
  | 'SUDAH PERNAH SCAN'
  | 'TIKET TIDAK VALID';

export interface EventTier {
  id: string;
  name: string;
  price: number;
  quota: number;
  sold: number;
  mode: RegistrationMode;
  maxMembers?: number;
  isVipOrEarlyBird?: boolean;
  badgeText?: string;
  benefits: string[];
}

export interface AcademicEvent {
  id: string;
  code: string;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  speakerOrHost: string;
  skpPoints: string;
  description: string;
  isOpen: boolean;
  imageUrl?: string;
  imageCaption?: string;
  tiers: EventTier[];
}

export interface Transaction {
  id: string;
  ticketCode: string;
  eventId: string;
  eventTitle: string;
  tierId: string;
  tierName: string;
  mode: RegistrationMode;
  participantName: string;
  nim: string;
  faculty: string;
  email: string;
  whatsapp: string;
  teamName?: string;
  teamMembers?: string[];
  basePrice: number;
  uniqueCode: number;
  totalAmount: number;
  status: TransactionStatus;
  proofFileName?: string;
  proofUploadedAt?: string;
  proofSenderBank?: string;
  proofSenderName?: string;
  rejectionReason?: string;
  createdAt: string;
  expiresAt: string;
  verifiedAt?: string;
  verifiedBy?: string;
  scannedAt?: string;
  scanCount: number;
  attendanceStatus?: 'HADIR' | 'BELUM_HADIR';
}

export interface ScanLogEntry {
  id: string;
  timestamp: string;
  inputCode: string;
  decision: ScanDecision;
  reason: string;
  participantName?: string;
  eventTitle?: string;
  tierName?: string;
  firstScannedAt?: string;
}

export interface MedinfoAnnouncement {
  id: string;
  title: string;
  category: 'Penting' | 'Info Gate' | 'Pembayaran' | 'Umum';
  content: string;
  updatedAt: string;
  isActive: boolean;
  imageUrl?: string;
  imageCaption?: string;
}

export interface MedinfoConfig {
  organizationName: string;
  period: string;
  bankName: string;
  bankAccountNumber: string;
  bankAccountHolder: string;
  qrisMerchantName: string;
  paymentDeadlineMinutes: number;
  helpdeskWhatsapp: string;
  helpdeskEmail: string;
  gateCheckinNote: string;
  announcements: MedinfoAnnouncement[];
}

export interface HimakaUser {
  id: string;
  name: string;
  nim: string;
  faculty: string;
  email: string;
  whatsapp: string;
  password: string;
  role: 'peserta' | 'pengurus';
  joinedAt: string;
}

export type NewsCategory =
  | 'Liputan Utama'
  | 'Akademik & Riset'
  | 'Jurnalistik & Medinfo'
  | 'Pengabdian & Humas'
  | 'Prestasi Mahasiswa';

export interface HimakaNewsArticle {
  id: string;
  code: string;
  title: string;
  category: NewsCategory;
  publishedAt: string;
  author: string;
  division: string;
  readTimeMinutes: number;
  location: string;
  isLeadStory?: boolean;
  summary: string;
  bodyParagraphs: string[];
  keyHighlights: string[];
  relatedEventId?: string;
  imageUrl?: string;
  imageCaption?: string;
  photographer?: string;
  archiveCode?: string;
}

export interface HimakaDocumentationItem {
  id: string;
  archiveCode: string;
  title: string;
  category: string;
  periodYear: string;
  date: string;
  location: string;
  division: string;
  photographer: string;
  imageUrl: string;
  caption: string;
  relatedEventId?: string;
  relatedProkerId?: string;
  mediaPhase?: 'PRE_PROKER' | 'AFTER_PROKER';
}

export type ProkerStatus = 'TERLAKSANA' | 'BERJALAN' | 'AKAN DATANG';

export type HimakaDivisionName =
  | 'Badan Pengurus Harian (BPH)'
  | 'Divisi PKM (Pengembangan Kreativitas Mahasiswa)'
  | 'Divisi Pengembangan Akademik & Keprofesian'
  | 'Divisi Media & Informasi (Medinfo)'
  | 'Divisi Hubungan Masyarakat & Kemitraan'
  | 'Divisi Minat Bakat & Kreativitas'
  | 'Divisi Sosial & Pengabdian Masyarakat';

export interface HimakaDivisionInfo {
  id: string;
  code: string;
  name: HimakaDivisionName;
  shortName: string;
  description: string;
  corePrograms: string[];
  imageUrl?: string;
  imageCaption?: string;
}

export interface HimakaProkerItem {
  id: string;
  code: string;
  periodYear: string;
  name: string;
  division: HimakaDivisionName;
  month: string;
  category: string;
  status: ProkerStatus;
  summary: string;
  achievementOrTarget: string;
  personInCharge: string;
  ticketingEventId?: string;
  imageUrl?: string;
  imageCaption?: string;
  archiveCode?: string;
}

export interface HimakaPeriodMember {
  id: string;
  periodYear: string;
  name: string;
  nim: string;
  cohortYear: string;
  roleTitle: string;
  division: HimakaDivisionName;
  concentration: string;
  mainProker: string;
  avatarUrl?: string;
}

export interface HimakaCabinetPeriod {
  periodYear: string;
  cabinetName: string;
  isCurrent: boolean;
  theme: string;
  advisorName: string;
  chairpersonName: string;
  chairpersonNim: string;
  viceChairpersonName: string;
  viceChairpersonNim: string;
  periodSummary: string;
  prokers: HimakaProkerItem[];
  members: HimakaPeriodMember[];
}

export interface HimakaOrganizationProfile {
  shortName: string;
  fullName: string;
  university: string;
  faculty: string;
  establishedInfo: string;
  secretariatLocation: string;
  aboutParagraphs: string[];
  vision: string;
  missions: string[];
  divisions: HimakaDivisionInfo[];
}

export type PortalMode = 'guest' | 'user' | 'admin';

export interface ProtoState {
  version: number;
  events: AcademicEvent[];
  transactions: Transaction[];
  scanLogs: ScanLogEntry[];
  medinfo: MedinfoConfig;
  users?: HimakaUser[];
  currentUser?: HimakaUser | null;
  activePortal?: PortalMode;
  newsArticles?: HimakaNewsArticle[];
  organizationProfile?: HimakaOrganizationProfile;
  cabinetPeriods?: HimakaCabinetPeriod[];
  documentationGallery?: HimakaDocumentationItem[];
}

export interface RegistrationFormInput {
  participantName: string;
  nim: string;
  faculty: string;
  email: string;
  whatsapp: string;
  mode: RegistrationMode;
  teamName?: string;
  teamMembersText?: string;
}

export interface FormValidationErrors {
  participantName?: string;
  nim?: string;
  faculty?: string;
  email?: string;
  whatsapp?: string;
  teamName?: string;
  teamMembersText?: string;
}

export function formatRupiah(amount: number): string {
  const rounded = Math.round(amount);
  const formatted = rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `Rp ${formatted}`;
}

export function computeUniqueCode(seedIndex: number): number {
  const normalized = ((seedIndex % 899) + 899) % 899;
  return 101 + normalized;
}

export function calculateCheckoutTotal(
  basePrice: number,
  uniqueCode: number,
): number {
  if (basePrice <= 0) return 0;
  return basePrice + uniqueCode;
}

export function getTierRemainingQuota(tier: EventTier): number {
  return Math.max(0, tier.quota - tier.sold);
}

export function isTierSoldOut(tier: EventTier): boolean {
  return getTierRemainingQuota(tier) === 0;
}

export function isEventSoldOut(event: AcademicEvent): boolean {
  return event.tiers.every((t) => isTierSoldOut(t));
}

export function validateRegistrationForm(
  input: RegistrationFormInput,
  maxMembers = 3,
): FormValidationErrors {
  const errors: FormValidationErrors = {};

  if (!input.participantName || input.participantName.trim().length < 3) {
    errors.participantName = 'Nama lengkap wajib diisi (minimal 3 karakter).';
  }

  if (!input.nim || input.nim.trim().length < 5) {
    errors.nim = 'NIM atau Nomor Identitas wajib diisi (minimal 5 karakter).';
  }

  if (!input.faculty || input.faculty.trim().length < 2) {
    errors.faculty = 'Program Studi / Instansi wajib dipilih atau diisi.';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!input.email || !emailRegex.test(input.email.trim())) {
    errors.email = 'Alamat email institusi atau personal tidak valid.';
  }

  const cleanWa = (input.whatsapp || '').replace(/[\s-]/g, '');
  if (!cleanWa || !/^(08|\+628|628)\d{7,12}$/.test(cleanWa)) {
    errors.whatsapp =
      'Nomor WhatsApp aktif wajib diawali 08 atau +628 (9-14 digit).';
  }

  if (input.mode === 'tim') {
    if (!input.teamName || input.teamName.trim().length < 3) {
      errors.teamName = 'Nama tim wajib diisi untuk pendaftaran kategori tim.';
    }
    const members = (input.teamMembersText || '')
      .split('\n')
      .map((m) => m.trim())
      .filter(Boolean);
    if (members.length < 1) {
      errors.teamMembersText =
        'Masukkan minimal 1 anggota tim tambahan (1 baris per anggota).';
    } else if (members.length > maxMembers) {
      errors.teamMembersText = `Maksimal ${maxMembers} anggota tim untuk tier ini.`;
    }
  }

  return errors;
}

export function validateTicketScan(
  state: ProtoState,
  rawCode: string,
  nowIso: string,
): {
  nextState: ProtoState;
  result: ScanLogEntry;
  matchedTransaction?: Transaction;
} {
  const normalizedCode = rawCode.trim().toUpperCase();
  const txIndex = state.transactions.findIndex(
    (t) =>
      t.ticketCode.toUpperCase() === normalizedCode ||
      t.id.toUpperCase() === normalizedCode,
  );

  const logId = `SCN-${String(state.scanLogs.length + 1).padStart(4, '0')}`;

  if (txIndex === -1) {
    const result: ScanLogEntry = {
      id: logId,
      timestamp: nowIso,
      inputCode: normalizedCode || '(KOSONG)',
      decision: 'TIKET TIDAK VALID',
      reason:
        'Kode tiket atau ID transaksi tidak terdaftar dalam database HIMAKA.',
    };
    return {
      nextState: {
        ...state,
        scanLogs: [result, ...state.scanLogs],
      },
      result,
    };
  }

  const tx = state.transactions[txIndex];

  if (tx.status !== 'LUNAS') {
    const statusMap: Record<TransactionStatus, string> = {
      PENDING:
        'Transaksi masih berstatus PENDING (menunggu verifikasi Bendahara).',
      DITOLAK: `Transaksi DITOLAK oleh Bendahara (${tx.rejectionReason || 'Bukti tidak sesuai'}).`,
      EXPIRED: 'Transaksi telah EXPIRED (melewati batas waktu pembayaran).',
      LUNAS: '',
    };
    const result: ScanLogEntry = {
      id: logId,
      timestamp: nowIso,
      inputCode: tx.ticketCode,
      decision: 'TIKET TIDAK VALID',
      reason: statusMap[tx.status],
      participantName: tx.participantName,
      eventTitle: tx.eventTitle,
      tierName: tx.tierName,
    };
    return {
      nextState: {
        ...state,
        scanLogs: [result, ...state.scanLogs],
      },
      result,
      matchedTransaction: tx,
    };
  }

  if (tx.scannedAt || tx.scanCount > 0 || tx.attendanceStatus === 'HADIR') {
    const updatedTx: Transaction = {
      ...tx,
      scanCount: tx.scanCount + 1,
      attendanceStatus: 'HADIR',
    };
    const nextTransactions = [...state.transactions];
    nextTransactions[txIndex] = updatedTx;

    const result: ScanLogEntry = {
      id: logId,
      timestamp: nowIso,
      inputCode: tx.ticketCode,
      decision: 'SUDAH PERNAH SCAN',
      reason: `Anti-passback aktif: Tiket ini sudah digunakan masuk pada ${tx.scannedAt}. Percobaan scan ke-${updatedTx.scanCount}.`,
      participantName: tx.participantName,
      eventTitle: tx.eventTitle,
      tierName: tx.tierName,
      firstScannedAt: tx.scannedAt,
    };

    return {
      nextState: {
        ...state,
        transactions: nextTransactions,
        scanLogs: [result, ...state.scanLogs],
      },
      result,
      matchedTransaction: updatedTx,
    };
  }

  // First valid scan on LUNAS ticket
  const updatedTx: Transaction = {
    ...tx,
    scannedAt: nowIso,
    scanCount: 1,
    attendanceStatus: 'HADIR',
  };
  const nextTransactions = [...state.transactions];
  nextTransactions[txIndex] = updatedTx;

  const result: ScanLogEntry = {
    id: logId,
    timestamp: nowIso,
    inputCode: tx.ticketCode,
    decision: 'BOLEH MASUK',
    reason: 'Tiket lunas & terverifikasi. Check-in gerbang berhasil dicatat.',
    participantName: tx.participantName,
    eventTitle: tx.eventTitle,
    tierName: tx.tierName,
    firstScannedAt: nowIso,
  };

  return {
    nextState: {
      ...state,
      transactions: nextTransactions,
      scanLogs: [result, ...state.scanLogs],
    },
    result,
    matchedTransaction: updatedTx,
  };
}

export function approveTransaction(
  state: ProtoState,
  transactionId: string,
  verifiedAtIso: string,
): ProtoState {
  return {
    ...state,
    transactions: state.transactions.map((tx) => {
      if (tx.id !== transactionId) return tx;
      return {
        ...tx,
        status: 'LUNAS',
        verifiedAt: verifiedAtIso,
        verifiedBy: 'Bendahara HIMAKA',
        rejectionReason: undefined,
      };
    }),
  };
}

export function rejectTransaction(
  state: ProtoState,
  transactionId: string,
  reason: string,
  verifiedAtIso: string,
): ProtoState {
  const target = state.transactions.find((t) => t.id === transactionId);
  if (!target) return state;

  const shouldRestoreQuota =
    target.status !== 'DITOLAK' && target.status !== 'EXPIRED';

  const nextEvents = shouldRestoreQuota
    ? state.events.map((ev) => {
        if (ev.id !== target.eventId) return ev;
        return {
          ...ev,
          tiers: ev.tiers.map((tier) => {
            if (tier.id !== target.tierId) return tier;
            return {
              ...tier,
              sold: Math.max(0, tier.sold - 1),
            };
          }),
        };
      })
    : state.events;

  return {
    ...state,
    events: nextEvents,
    transactions: state.transactions.map((tx) => {
      if (tx.id !== transactionId) return tx;
      return {
        ...tx,
        status: 'DITOLAK',
        rejectionReason:
          reason.trim() ||
          'Nominal atau bukti transfer tidak sesuai mutasi rekening.',
        verifiedAt: verifiedAtIso,
        verifiedBy: 'Bendahara HIMAKA',
      };
    }),
  };
}

export function generateTransactionsCsv(transactions: Transaction[]): string {
  const headers = [
    'ID_Transaksi',
    'Kode_Tiket',
    'Acara',
    'Tier',
    'Kategori',
    'Nama_Peserta',
    'NIM',
    'Prodi_Instansi',
    'Email',
    'WhatsApp',
    'Nama_Tim',
    'Anggota_Tim',
    'Harga_Dasar',
    'Kode_Unik',
    'Total_Bayar',
    'Total_Rupiah',
    'Status_Pembayaran',
    'File_Bukti_Transfer',
    'Bank_Pengirim',
    'Waktu_Daftar',
    'Waktu_Verifikasi',
    'Catatan_Penolakan',
    'Waktu_Scan',
    'Jumlah_Scan',
  ];

  const escapeCsvCell = (val: string | number | undefined) => {
    const str = val === undefined || val === null ? '' : String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const rows = transactions.map((tx) =>
    [
      tx.id,
      tx.ticketCode,
      tx.eventTitle,
      tx.tierName,
      tx.mode,
      tx.participantName,
      tx.nim,
      tx.faculty,
      tx.email,
      tx.whatsapp,
      tx.teamName || '-',
      tx.teamMembers && tx.teamMembers.length > 0
        ? tx.teamMembers.join(' | ')
        : '-',
      tx.basePrice,
      tx.uniqueCode,
      tx.totalAmount,
      formatRupiah(tx.totalAmount),
      tx.status,
      tx.proofFileName || 'BELUM_UNGGAH',
      tx.proofSenderBank || '-',
      tx.createdAt,
      tx.verifiedAt || '-',
      tx.rejectionReason || '-',
      tx.scannedAt || 'BELUM_SCAN',
      tx.scanCount,
    ]
      .map(escapeCsvCell)
      .join(','),
  );

  return [headers.join(','), ...rows].join('\n');
}

export function createInitialSeedState(): ProtoState {
  const events: AcademicEvent[] = [
    {
      id: 'evt-semnas-2025',
      code: 'SMN-25',
      title:
        'Seminar Nasional Informatika, Rekayasa Perangkat Lunak & Etika AI 2026',
      category: 'Seminar Nasional',
      date: '15 November 2026',
      time: '08:30 – 15:00 WIB',
      location: 'Auditorium Kampus 3 UMBY, Ringroad Utara',
      speakerOrHost:
        'Dr. Eng. R. Raharjo, S.Kom., M.Cs. & Praktisi Software Engineering',
      skpPoints: '4 SKP Akademik',
      description:
        'Sidang ilmiah tahunan HIMAKA UMBY 2026 membahas arsitektur kecerdasan buatan, keamanan siber, rekayasa data, dan kesiapan karir mahasiswa Informatika.',
      isOpen: true,
      tiers: [
        {
          id: 'tier-semnas-eb',
          name: 'Early Bird Mahasiswa UMBY',
          price: 45000,
          quota: 60,
          sold: 60,
          mode: 'individu',
          isVipOrEarlyBird: true,
          badgeText: 'EARLY BIRD · HABIS',
          benefits: [
            'Akses Kursi Reguler Auditorium',
            'E-Sertifikat 4 SKP Ber-barcode',
            'Seminar Kit & Snack Box',
          ],
        },
        {
          id: 'tier-semnas-reg',
          name: 'Presale Reguler Mahasiswa',
          price: 65000,
          quota: 120,
          sold: 94,
          mode: 'individu',
          isVipOrEarlyBird: false,
          benefits: [
            'Akses Kursi Reguler Auditorium',
            'E-Sertifikat 4 SKP Ber-barcode',
            'Seminar Kit & Makan Siang',
          ],
        },
        {
          id: 'tier-semnas-vip',
          name: 'VIP Executive & Sesi Mentoring',
          price: 110000,
          quota: 25,
          sold: 19,
          mode: 'individu',
          isVipOrEarlyBird: true,
          badgeText: 'VIP TIER · SISA 6 KURSI',
          benefits: [
            'Baris Depan Reserved Seat (Baris A-B)',
            'Sesi Diskusi Eksklusif bersama Pembicara',
            'Merchandise Totebag Kanvas HIMAKA & Makan Siang',
          ],
        },
      ],
    },
    {
      id: 'evt-commfest-2025',
      code: 'INF-25',
      title:
        'Kompetisi Software Development & UI/UX Hackathon IT-Fest HIMAKA 2026',
      category: 'Kompetisi Akademik',
      date: '22 November 2026',
      time: '09:00 – 17:00 WIB',
      location: 'Laboratorium Terpadu Informatika & Ruang Sidang 2',
      speakerOrHost:
        'Dewan Juri Praktisi Tech Industry & Dosen Informatika UMBY',
      skpPoints: '6 SKP Kompetisi',
      description:
        'Kompetisi pengembangan aplikasi, UI/UX produk digital, dan pitching inovasi teknologi bagi tim mahasiswa (2-3 orang) maupun peserta observer individu pada babak final.',
      isOpen: true,
      tiers: [
        {
          id: 'tier-commfest-tim',
          name: 'Delegasi Tim Developer (2–3 Mahasiswa)',
          price: 150000,
          quota: 20,
          sold: 14,
          mode: 'tim',
          maxMembers: 3,
          isVipOrEarlyBird: true,
          badgeText: 'BUNDLE TIM · EARLY SLOT',
          benefits: [
            'Slot Presentasi Demo Aplikasi di Hadapan Juri Industri',
            'Sertifikat Delegasi untuk Seluruh Anggota Tim',
            'Konsumsi & Brief Studi Kasus Resmi',
          ],
        },
        {
          id: 'tier-commfest-obs',
          name: 'Tiket Observer Sidang Final (Individu)',
          price: 35000,
          quota: 50,
          sold: 38,
          mode: 'individu',
          isVipOrEarlyBird: false,
          benefits: [
            'Akses Ruang Sidang Presentasi Finalis',
            'E-Sertifikat Peserta Observer 2 SKP',
            'Softcopy Dokumentasi Arsitektur Terbaik',
          ],
        },
      ],
    },
    {
      id: 'evt-work-jurnalistik',
      code: 'WKS-25',
      title:
        'Workshop Cloud Computing, DevSecOps & Deployment Arsitektur Modern 2026',
      category: 'Workshop Praktik',
      date: '29 November 2026',
      time: '13:00 – 17:30 WIB',
      location: 'Laboratorium Komputasi & Jaringan Kampus 3 UMBY',
      speakerOrHost:
        'Divisi PKM & Medinfo HIMAKA bersama Senior Cloud Engineer',
      skpPoints: '3 SKP Praktikum',
      description:
        'Pelatihan intensif containerization, CI/CD pipeline, pengujian keamanan aplikasi web, dan deployment server produksi.',
      isOpen: true,
      tiers: [
        {
          id: 'tier-wks-studio',
          name: 'Akses Praktik Laboratorium Penuh',
          price: 55000,
          quota: 30,
          sold: 30,
          mode: 'individu',
          isVipOrEarlyBird: false,
          badgeText: 'KUOTA PENUH',
          benefits: [
            'Akses Workstation Lab & Cloud Sandbox',
            'Modul Cetak Praktikum DevSecOps HIMAKA',
            'E-Sertifikat Praktikum 3 SKP',
          ],
        },
      ],
    },
  ];

  const transactions: Transaction[] = [
    {
      id: 'TRX-2025-0101',
      ticketCode: 'HMK-2025-A01',
      eventId: 'evt-semnas-2025',
      eventTitle:
        'Seminar Nasional Informatika, Rekayasa Perangkat Lunak & Etika AI 2026',
      tierId: 'tier-semnas-vip',
      tierName: 'VIP Executive & Sesi Mentoring',
      mode: 'individu',
      participantName: 'Nadia Pramesti Kusuma',
      nim: '220710142',
      faculty: 'Informatika UMBY',
      email: 'nadia.pramesti@student.mercubuana-yogya.ac.id',
      whatsapp: '081234567801',
      basePrice: 110000,
      uniqueCode: 101,
      totalAmount: 110101,
      status: 'LUNAS',
      proofFileName: 'struk_bca_nadia_110101.jpg',
      proofUploadedAt: '2026-10-20 14:22 WIB',
      proofSenderBank: 'BCA Mobile',
      proofSenderName: 'Nadia Pramesti K',
      createdAt: '2026-10-20 14:10 WIB',
      expiresAt: '2026-10-21 14:10 WIB',
      verifiedAt: '2026-10-20 15:05 WIB',
      verifiedBy: 'Bendahara HIMAKA',
      scanCount: 0,
    },
    {
      id: 'TRX-2025-0102',
      ticketCode: 'HMK-2025-B02',
      eventId: 'evt-commfest-2025',
      eventTitle:
        'Kompetisi Software Development & UI/UX Hackathon IT-Fest HIMAKA 2026',
      tierId: 'tier-commfest-tim',
      tierName: 'Delegasi Tim Developer (2–3 Mahasiswa)',
      mode: 'tim',
      participantName: 'Bagas Adi Nugroho',
      nim: '210710088',
      faculty: 'Informatika UMBY',
      email: 'bagas.nugroho@student.mercubuana-yogya.ac.id',
      whatsapp: '081398765432',
      teamName: 'Tim Kode Aksara',
      teamMembers: [
        'Bagas Adi Nugroho (210710088 - Lead Developer)',
        'Rania Salsabila (210710095 - UI/UX Engineer)',
        'Dimas Prakoso (220710019 - Backend Architect)',
      ],
      basePrice: 150000,
      uniqueCode: 102,
      totalAmount: 150102,
      status: 'PENDING',
      proofFileName: 'bukti_qris_suaraaksara_150102.png',
      proofUploadedAt: '2026-10-23 08:15 WIB',
      proofSenderBank: 'QRIS Livin Mandiri',
      proofSenderName: 'Bagas Adi Nugroho',
      createdAt: '2026-10-23 08:05 WIB',
      expiresAt: '2026-10-24 08:05 WIB',
      scanCount: 0,
    },
    {
      id: 'TRX-2025-0103',
      ticketCode: 'HMK-2025-C03',
      eventId: 'evt-semnas-2025',
      eventTitle:
        'Seminar Nasional Informatika, Rekayasa Perangkat Lunak & Etika AI 2026',
      tierId: 'tier-semnas-reg',
      tierName: 'Presale Reguler Mahasiswa',
      mode: 'individu',
      participantName: 'Fajar Siddiq Mahendra',
      nim: '230710211',
      faculty: 'Informatika UMBY',
      email: 'fajar.mahendra@student.mercubuana-yogya.ac.id',
      whatsapp: '085711223344',
      basePrice: 65000,
      uniqueCode: 103,
      totalAmount: 65103,
      status: 'LUNAS',
      proofFileName: 'transfer_bri_fajar_65103.jpg',
      proofUploadedAt: '2026-10-19 10:02 WIB',
      proofSenderBank: 'BRImo',
      proofSenderName: 'Fajar Siddiq M',
      createdAt: '2026-10-19 09:45 WIB',
      expiresAt: '2026-10-20 09:45 WIB',
      verifiedAt: '2026-10-19 11:20 WIB',
      verifiedBy: 'Bendahara HIMAKA',
      scannedAt: '2026-10-23 07:55 WIB',
      scanCount: 1,
      attendanceStatus: 'HADIR',
    },
    {
      id: 'TRX-2025-0104',
      ticketCode: 'HMK-2025-D04',
      eventId: 'evt-semnas-2025',
      eventTitle:
        'Seminar Nasional Informatika, Rekayasa Perangkat Lunak & Etika AI 2026',
      tierId: 'tier-semnas-reg',
      tierName: 'Presale Reguler Mahasiswa',
      mode: 'individu',
      participantName: 'Alya Zahra Putri',
      nim: '230710305',
      faculty: 'Sistem Informasi UMBY',
      email: 'alya.zahra@student.mercubuana-yogya.ac.id',
      whatsapp: '082144556677',
      basePrice: 65000,
      uniqueCode: 104,
      totalAmount: 65104,
      status: 'DITOLAK',
      proofFileName: 'struk_buram_65000.jpg',
      proofUploadedAt: '2026-10-21 16:40 WIB',
      proofSenderBank: 'BSI Mobile',
      proofSenderName: 'Alya Zahra',
      rejectionReason:
        'Nominal transfer kurang kode unik (tertulis Rp 65.000, seharusnya Rp 65.104) dan foto bukti terpotong.',
      createdAt: '2026-10-21 16:30 WIB',
      expiresAt: '2026-10-22 16:30 WIB',
      verifiedAt: '2026-10-21 19:10 WIB',
      verifiedBy: 'Bendahara HIMAKA',
      scanCount: 0,
    },
    {
      id: 'TRX-2025-0105',
      ticketCode: 'HMK-2025-E05',
      eventId: 'evt-commfest-2025',
      eventTitle:
        'Kompetisi Software Development & UI/UX Hackathon IT-Fest HIMAKA 2026',
      tierId: 'tier-commfest-obs',
      tierName: 'Tiket Observer Sidang Final (Individu)',
      mode: 'individu',
      participantName: 'Reza Kurniawan',
      nim: '240710054',
      faculty: 'Informatika UMBY',
      email: 'reza.kurniawan@student.mercubuana-yogya.ac.id',
      whatsapp: '081900112233',
      basePrice: 35000,
      uniqueCode: 105,
      totalAmount: 35105,
      status: 'EXPIRED',
      createdAt: '2026-10-18 09:00 WIB',
      expiresAt: '2026-10-19 09:00 WIB',
      scanCount: 0,
    },
  ];

  const scanLogs: ScanLogEntry[] = [
    {
      id: 'SCN-0001',
      timestamp: '2026-10-23 07:55 WIB',
      inputCode: 'HMK-2025-C03',
      decision: 'BOLEH MASUK',
      reason: 'Tiket lunas & terverifikasi. Check-in gerbang berhasil dicatat.',
      participantName: 'Fajar Siddiq Mahendra',
      eventTitle:
        'Seminar Nasional Informatika, Rekayasa Perangkat Lunak & Etika AI 2026',
      tierName: 'Presale Reguler Mahasiswa',
      firstScannedAt: '2026-10-23 07:55 WIB',
    },
  ];

  const medinfo: MedinfoConfig = {
    organizationName: 'Himpunan Mahasiswa Informatika (HIMAKA) UMBY',
    period: 'Periode Kepengurusan HIMAKA 2026 (2025/2026)',
    bankName: 'Bank Mandiri KCP Yogyakarta Gejayan',
    bankAccountNumber: '137-00-2025889-1',
    bankAccountHolder: 'HIMAKA UMBY / BENDAHARA KEGIATAN',
    qrisMerchantName: 'HIMAKA UMBY OFFICIAL EVENT',
    paymentDeadlineMinutes: 1440,
    helpdeskWhatsapp: '0812-2700-9910 (Admin Ticketing HIMAKA)',
    helpdeskEmail: 'ticketing.himaka@mercubuana-yogya.ac.id',
    gateCheckinNote:
      'Siapkan E-Ticket QR dalam kecerahan layar penuh beserta Kartu Tanda Mahasiswa (KTM) fisik atau digital saat antre di meja registrasi.',
    announcements: [
      {
        id: 'ann-1',
        title: 'Ketentuan Kode Unik 3 Digit untuk Verifikasi Cepat Bendahara',
        category: 'Pembayaran',
        content:
          'Setiap pendaftaran menghasilkan 3 digit kode unik (contoh: Rp 65.103). Pastikan nominal transfer sesuai hingga 3 digit terakhir agar Bendahara dapat memverifikasi mutasi kurang dari 15 menit.',
        updatedAt: '23 Okt 2026, 07:30 WIB',
        isActive: true,
      },
      {
        id: 'ann-2',
        title:
          'Prosedur Anti-Passback Gate Check-in & E-Sertifikat Otomatis 2026',
        category: 'Info Gate',
        content:
          'Satu kode tiket hanya berlaku untuk satu kali pemindaian masuk (single entry). Setelah tiket LUNAS dipindai di Gate Scanner, peserta dapat langsung mencetak E-Sertifikat resmi di menu Tiketku.',
        updatedAt: '22 Okt 2026, 19:00 WIB',
        isActive: true,
      },
      {
        id: 'ann-3',
        title:
          'Kuota Early Bird Seminar Nasional & Workshop Lab Komputasi 2026 Telah Habis',
        category: 'Penting',
        content:
          'Kuota Early Bird Seminar Nasional Informatika (60 kursi) dan Workshop Cloud & DevSecOps (30 kursi) telah terpenuhi. Peserta masih dapat mendaftar pada tier Presale Reguler dan VIP Executive.',
        updatedAt: '21 Okt 2026, 16:15 WIB',
        isActive: true,
      },
    ],
  };

  const users: HimakaUser[] = [
    {
      id: 'usr-101',
      name: 'Nadia Pramesti Kusuma',
      nim: '220710142',
      faculty: 'Informatika UMBY',
      email: 'nadia.pramesti@student.mercubuana-yogya.ac.id',
      whatsapp: '081234567801',
      password: 'himaka2025',
      role: 'peserta',
      joinedAt: '10 Okt 2026',
    },
    {
      id: 'usr-102',
      name: 'Bagas Adi Nugroho',
      nim: '210710088',
      faculty: 'Informatika UMBY',
      email: 'bagas.nugroho@student.mercubuana-yogya.ac.id',
      whatsapp: '081398765432',
      password: 'himaka2025',
      role: 'peserta',
      joinedAt: '12 Okt 2026',
    },
    {
      id: 'usr-admin-01',
      name: 'Rio Ardiyansyah (Admin Medinfo)',
      nim: '241110075',
      faculty: 'Divisi Medinfo HIMAKA UMBY (Informatika)',
      email: 'rio.ardiyansyah@student.mercubuana-yogya.ac.id',
      whatsapp: '081227009910',
      password: 'admin2025',
      role: 'pengurus',
      joinedAt: '01 Sep 2026',
    },
    {
      id: 'usr-admin-02',
      name: 'Aziz Zaghul Ikhsanudin (Ketua HIMAKA)',
      nim: '241110051',
      faculty: 'BPH HIMAKA UMBY (Informatika)',
      email: 'aziz.ikhsanudin@student.mercubuana-yogya.ac.id',
      whatsapp: '081227009911',
      password: 'admin2025',
      role: 'pengurus',
      joinedAt: '01 Sep 2026',
    },
    {
      id: 'usr-admin-legacy',
      name: 'Siti Nurhaliza Putri (Admin Pengurus)',
      nim: '220710164',
      faculty: 'BPH & Medinfo HIMAKA UMBY (Informatika)',
      email: 'admin.himaka@mercubuana-yogya.ac.id',
      whatsapp: '081227009910',
      password: 'admin2025',
      role: 'pengurus',
      joinedAt: '01 Sep 2026',
    },
  ];

  const newsArticles: HimakaNewsArticle[] = [
    {
      id: 'news-01',
      code: 'WARTA-HMK-2501',
      title:
        'HIMAKA UMBY 2026 Gelar Kunjungan Industri Teknologi & Diskusi Arsitektur Data Bersama Engineer Nasional di Yogyakarta',
      category: 'Jurnalistik & Medinfo',
      publishedAt: '21 Oktober 2026',
      author: 'Rio Ardiyansyah & Tim Redaksi Medinfo',
      division: 'Divisi Media & Informasi',
      readTimeMinutes: 4,
      location: 'Tech Hub Yogyakarta & Auditorium Kampus 3 UMBY',
      isLeadStory: true,
      summary:
        'Sebanyak 65 mahasiswa Informatika UMBY mengikuti bedah arsitektur sistem skala besar, pipeline data real-time, serta standar keamanan aplikasi bersama senior software engineer.',
      bodyParagraphs: [
        'YOGYAKARTA — Himpunan Mahasiswa Informatika (HIMAKA) Universitas Mercu Buana Yogyakarta periode 2026 baru saja merampungkan rangkaian Kunjungan Industri Teknologi & Klinik Data Engineering pada pekan ketiga Oktober 2026. Kegiatan ini menjadi agenda pembuka sebelum pelaksanaan Seminar Nasional Informatika, Rekayasa Perangkat Lunak & Etika AI pada bulan November mendatang.',
        'Dalam kegiatan tersebut, pengurus Kabinet Aksara Cipta bersama mahasiswa Informatika angkatan 2023 hingga 2025 membedah alur pengembangan perangkat lunak modern dan tata kelola model kecerdasan buatan. Peserta diajak melihat langsung proses code review, pengujian beban server, hingga manajemen infrastruktur cloud.',
        'Ketua HIMAKA UMBY 2026, Aziz Zaghul Ikhsanudin, menyampaikan bahwa rangkuman studi kasus dari kunjungan industri ini dipublikasikan melalui repositori dan buletin mahasiswa Informatika sebagai bekal utama bagi peserta Seminar Nasional maupun Workshop Cloud & DevSecOps.',
      ],
      keyHighlights: [
        'Diikuti oleh 65 delegasi mahasiswa Informatika UMBY lintas angkatan.',
        'Menghasilkan 12 modul dokumentasi teknis bertema rekayasa sistem dan AI.',
        'Tindak lanjut langsung menuju Seminar Nasional Informatika 15 November 2026.',
      ],
      relatedEventId: 'evt-semnas-2025',
    },
    {
      id: 'news-02',
      code: 'WARTA-HMK-2502',
      title:
        'Pengabdian Masyarakat HIMAKA 2026 di Desa Mitra Bantul: Digitalisasi Sistem Katalog & Website UMKM Lokal',
      category: 'Pengabdian & Humas',
      publishedAt: '18 Oktober 2026',
      author: 'Siti Saskia Widyanti & Divisi Humas',
      division: 'Divisi Hubungan Masyarakat & Kemitraan',
      readTimeMinutes: 3,
      location: 'Balai Desa Wisata Argodadi, Sedayu, Bantul',
      summary:
        'Mahasiswa Informatika HIMAKA UMBY mendampingi 24 pelaku UMKM kerajinan lokal dalam membangun katalog web responsif, sistem pencatatan kas sederhana, dan foto produk.',
      bodyParagraphs: [
        'BANTUL — Wujud nyata Tri Dharma Perguruan Tinggi kembali dijalankan oleh pengurus HIMAKA UMBY 2026 melalui program Desa Mitra Digital di kawasan Sedayu, Bantul. Selama dua hari penuh, mahasiswa Informatika turun langsung mendampingi pelaku usaha mikro dalam mengoperasikan katalog web dan pemotretan produk.',
        'Para perajin lokal yang sebelumnya hanya mengandalkan pencatatan manual kini memiliki halaman katalog digital terstruktur yang terhubung langsung ke pemesanan daring. Kegiatan ini sekaligus menjadi laboratorium implementasi rekayasa perangkat lunak tepat guna bagi mahasiswa Informatika.',
      ],
      keyHighlights: [
        '24 UMKM lokal mendapatkan katalog web terpadu dan dokumentasi produk digital.',
        'Pelatihan langsung pengelolaan stok digital dan keamanan transaksi daring.',
      ],
      relatedEventId: 'evt-commfest-2025',
    },
    {
      id: 'news-03',
      code: 'WARTA-HMK-2503',
      title:
        'Malam Demo Karya & Bedah Proyek Open-Source Mahasiswa Informatika UMBY 2026 di Laboratorium Komputasi',
      category: 'Akademik & Riset',
      publishedAt: '14 Oktober 2026',
      author: 'Muhammad Yasir Alfatah & Divisi PKM',
      division: 'Divisi PKM (Pengembangan Kreativitas Mahasiswa)',
      readTimeMinutes: 5,
      location: 'Laboratorium Komputasi Kampus 3 UMBY',
      summary:
        'Empat proyek perangkat lunak dan riset kecerdasan buatan terbaik hasil praktikum mahasiswa Informatika dipresentasikan dan dibedah bersama dosen pengampu.',
      bodyParagraphs: [
        'SLEMAN — Divisi PKM HIMAKA UMBY 2026 sukses menyelenggarakan Malam Apresiasi Inovasi & Bedah Proyek Open-Source di Laboratorium Komputasi Kampus 3. Acara ini menampilkan empat aplikasi karya mahasiswa Informatika yang mengangkat solusi pemantauan kualitas udara IoT, sistem klasifikasi citra medis, dan optimasi rute logistik.',
        'Sesi diskusi berlangsung hangat dengan membedah arsitektur backend, efisiensi algoritma, serta praktik deployment container. Antusiasme peserta mendorong dibukanya kelas Workshop Cloud Computing, DevSecOps & Deployment Arsitektur Modern pada akhir November 2026.',
      ],
      keyHighlights: [
        'Demo langsung 4 proyek aplikasi unggulan mahasiswa Informatika UMBY.',
        'Sesi code review terbuka bersama dosen pembimbing dan praktisi software engineer.',
      ],
      relatedEventId: 'evt-work-jurnalistik',
    },
    {
      id: 'news-04',
      code: 'WARTA-HMK-2504',
      title:
        'Delegasi Mahasiswa Informatika UMBY Raih Juara 2 Hackathon Pengembangan Aplikasi Tingkat Nasional 2026',
      category: 'Prestasi Mahasiswa',
      publishedAt: '09 Oktober 2026',
      author: 'Desi Kristiani Sumaredi',
      division: 'Divisi PKM (Pengembangan Kreativitas Mahasiswa)',
      readTimeMinutes: 3,
      location: 'Universitas Mercu Buana Yogyakarta',
      summary:
        'Tim Kode Aksara berhasil menyisihkan 48 tim perguruan tinggi lewat prototipe aplikasi deteksi kebocoran privasi data berbasis machine learning.',
      bodyParagraphs: [
        'YOGYAKARTA — Prestasi membanggakan kembali ditorehkan oleh mahasiswa Program Studi Informatika UMBY. Tim delegasi yang dibina melalui komunitas riset pemrograman HIMAKA berhasil meraih podium Juara 2 Nasional dalam ajang kompetisi Hackathon Rekayasa Perangkat Lunak 2026.',
        'Melalui karya bertajuk "GuardNet AI", tim merancang sistem audit privasi data mandiri yang dinilai dewan juri memiliki arsitektur sistem paling tangguh. Pengalaman teknis ini turut dibagikan kepada mahasiswa lain sebagai persiapan menuju IT-Fest Hackathon HIMAKA 2026.',
      ],
      keyHighlights: [
        'Menyisihkan 48 tim informatika dari berbagai universitas negeri dan swasta se-Indonesia.',
        'Sesi berbagi arsitektur sistem dibuka untuk peserta IT-Fest HIMAKA UMBY 2026.',
      ],
      relatedEventId: 'evt-commfest-2025',
    },
    {
      id: 'news-05',
      code: 'WARTA-HMK-2505',
      title:
        'Sidang Pleno Tengah Periode HIMAKA 2026: Laporan Transparansi Kegiatan & Peluncuran E-Sertifikat Otomatis',
      category: 'Liputan Utama',
      publishedAt: '03 Oktober 2026',
      author: 'Anita Yulinar Simanjutak & M.Ikrar Fatahillah',
      division: 'Badan Pengurus Harian (BPH)',
      readTimeMinutes: 4,
      location: 'Ruang Sidang 2 Kampus 3 UMBY',
      summary:
        'Pengurus inti memaparkan capaian program kerja periode 2026 serta meresmikan sistem registrasi acara dengan kode unik 3 digit, anti-passback QR, dan e-sertifikat otomatis.',
      bodyParagraphs: [
        'YOGYAKARTA — Dalam rangka menjaga akuntabilitas organisasi mahasiswa, HIMAKA UMBY menggelar Sidang Pleno Tengah Periode 2026 yang dihadiri oleh perwakilan angkatan, Badan Perwakilan Mahasiswa, serta pembina kemahasiswaan Program Studi Informatika.',
        'Salah satu terobosan utama yang disahkan adalah pemakaian Portal Tiket Akademik HIMAKA dengan sistem 3 digit kode unik rekonsiliasi Bendahara, pemindaian E-Ticket QR satu kali masuk (anti-passback), serta penerbitan E-Sertifikat otomatis bagi peserta yang telah melakukan check-in kehadiran di lokasi acara.',
      ],
      keyHighlights: [
        'Evaluasi terbuka program kerja yang telah terlaksana sepanjang periode 2026.',
        'Penerapan standar baru transparansi keuangan dan e-sertifikat otomatis peserta.',
      ],
      relatedEventId: 'evt-semnas-2025',
    },
  ];

  const organizationProfile: HimakaOrganizationProfile = {
    shortName: 'HIMAKA UMBY',
    fullName:
      'Himpunan Mahasiswa Informatika Universitas Mercu Buana Yogyakarta',
    university: 'Universitas Mercu Buana Yogyakarta (UMBY)',
    faculty: 'Fakultas Teknologi Informasi (FTI)',
    establishedInfo:
      'Ditetapkan sebagai organisasi kemahasiswaan resmi tingkat Program Studi Informatika sejak 2008',
    secretariatLocation:
      'Gedung Kemahasiswaan Kampus 3 UMBY, Jl. Ringroad Utara, Condongcatur, Sleman, DIY',
    aboutParagraphs: [
      'Himpunan Mahasiswa Informatika Universitas Mercu Buana Yogyakarta (HIMAKA UMBY) adalah organisasi kemahasiswaan eksekutif di tingkat Program Studi Informatika (Fakultas Teknologi Informasi) yang mewadahi aspirasi intelektual, pengembangan keprofesian rekayasa perangkat lunak & teknologi informasi, serta pengabdian masyarakat seluruh mahasiswa Informatika UMBY.',
      'Sebagai rumah kolaborasi bagi mahasiswa dari empat peminatan utama—Rekayasa Perangkat Lunak (Software Engineering), Kecerdasan Buatan & Sains Data (AI & Data Science), Jaringan & Keamanan Siber (Network & Cyber Security), serta Komputasi Cerdas & Multimedia—HIMAKA UMBY menyelenggarakan program kerja terpadu selama satu periode kepengurusan penuh.',
      'Portal website resmi HIMAKA UMBY ini berfungsi sebagai pusat informasi publik organisasi, dokumentasi rekam jejak program kerja (proker) selama satu periode, arsip direktori pengurus dan anggota lintas angkatan per tahun periode, sekaligus menyediakan fitur registrasi, e-ticketing terpadu, dan pencetakan e-sertifikat otomatis.',
    ],
    vision:
      'Mewujudkan HIMAKA UMBY sebagai organisasi mahasiswa Informatika yang inklusif, unggul dalam inovasi rekayasa perangkat lunak dan riset komputasi, serta berdampak nyata bagi sivitas akademika maupun masyarakat luas.',
    missions: [
      'Menyelenggarakan program kerja akademik, kelompok studi pemrograman (study club), dan laboratorium praktik informatika yang adaptif terhadap perkembangan teknologi komputasi.',
      'Membangun tata kelola organisasi dan administrasi keuangan kepanitiaan yang transparan, tertib, serta dapat dipertanggungjawabkan secara terbuka.',
      'Memperluas jejaring kemitraan strategis dengan industri teknologi, komunitas pengembang (developer community), himpunan mahasiswa informatika nasional (PERMIKOMNAS), dan desa mitra di DIY.',
      'Mendokumentasikan rekam jejak karya perangkat lunak, prestasi mahasiswa, serta direktori kepengurusan lintas periode secara terstruktur dan mudah diakses.',
    ],
    divisions: [
      {
        id: 'div-bph',
        code: 'BPH',
        name: 'Badan Pengurus Harian (BPH)',
        shortName: 'BPH Inti',
        description:
          'Bertanggung jawab atas koordinasi strategis organisasi, tata kelola kesekretariatan, sidang pleno evaluasi proker, serta transparansi kebendaharaan.',
        corePrograms: [
          'Rapat Kerja & Pelantikan Pengurus',
          'Sidang Pleno Tengah Periode',
          'Audit & Rekonsiliasi Keuangan Proker',
          'Musyawarah Besar (Mubes) HIMAKA',
        ],
      },
      {
        id: 'div-pkm',
        code: 'PKM',
        name: 'Divisi PKM (Pengembangan Kreativitas Mahasiswa)',
        shortName: 'Divisi PKM',
        description:
          'Mengelola pengembangan kreativitas mahasiswa, seminar nasional informatika, kompetisi pengembangan perangkat lunak, serta pembinaan riset & inovasi teknologi.',
        corePrograms: [
          'Seminar Nasional Informatika & Etika AI',
          'Kompetisi Software & Hackathon IT-Fest UMBY',
          'Pembinaan PKM & Kelompok Studi Pemrograman',
        ],
      },
      {
        id: 'div-medinfo',
        code: 'MDF',
        name: 'Divisi Media & Informasi (Medinfo)',
        shortName: 'Medinfo & Publikasi',
        description:
          'Mengelola publikasi resmi organisasi, redaksi buletin teknologi HIMAKA, dokumentasi visual proker, serta pemeliharaan sistem informasi web himpunan.',
        corePrograms: [
          'Redaksi Warta & Buletin Teknologi Aksara',
          'Kunjungan Industri Teknologi & Dokumentasi',
          'Pengelolaan Portal Web & Identitas Visual',
        ],
      },
      {
        id: 'div-humas',
        code: 'HMS',
        name: 'Divisi Hubungan Masyarakat & Kemitraan',
        shortName: 'Humas & Kemitraan',
        description:
          'Menjadi jembatan relasi internal-eksternal, jejaring PERMIKOMNAS (Perhimpunan Mahasiswa Informatika & Komputer Nasional), serta kemitraan industri.',
        corePrograms: [
          'Delegasi Wilayah & Nasional PERMIKOMNAS',
          'Career Talk Alumni Informatika & Industri IT',
          'Kemitraan Tech Partner & Sponsorship',
        ],
      },
      {
        id: 'div-minatbakat',
        code: 'MBK',
        name: 'Divisi Minat Bakat & Kreativitas',
        shortName: 'Minat Bakat & Kompetisi',
        description:
          'Melejitkan potensi kompetisi pengembangan perangkat lunak, Hackathon IT-Fest tahunan, UI/UX design challenge, serta pameran produk teknologi mahasiswa.',
        corePrograms: [
          'Kompetisi Software & Hackathon IT-Fest UMBY',
          'Malam Demo Karya & Ekshibisi Produk Digital',
          'Pembinaan Delegasi Gemastik & Hackathon Nasional',
        ],
      },
      {
        id: 'div-sosmas',
        code: 'SOS',
        name: 'Divisi Sosial & Pengabdian Masyarakat',
        shortName: 'Sosial & Pengabdian',
        description:
          'Menggerakkan program pemberdayaan digital masyarakat desa mitra, pendampingan sistem katalog UMKM lokal, dan literasi keamanan siber sekolah.',
        corePrograms: [
          'Desa Mitra Digital & Katalog Web UMKM',
          'HIMAKA Peduli & Bakti Sosial',
          'Edukasi Literasi Digital & Keamanan Siber Pelajar',
        ],
      },
    ],
  };

  const cabinetPeriods: HimakaCabinetPeriod[] = [
    {
      periodYear: '2025/2026',
      cabinetName: 'Kabinet Aksara Cipta',
      isCurrent: true,
      theme:
        'Kolaborasi Rekayasa Teknologi, Transparansi Gerak, dan Inovasi Informatika Berdampak',
      advisorName: 'Dr. Eng. R. Raharjo, S.Kom., M.Cs.',
      chairpersonName: 'Aziz Zaghul Ikhsanudin',
      chairpersonNim: '241110051',
      viceChairpersonName: 'Wulandari',
      viceChairpersonNim: '241110080',
      periodSummary:
        'Pada periode kepengurusan HIMAKA 2026 (2025/2026), Kabinet Aksara Cipta dipimpin oleh Aziz Zaghul Ikhsanudin (Ketua) dan Wulandari (Wakil Ketua) bersama total 15 pengurus aktif lintas BPH, Divisi PKM, Divisi Humas, dan Divisi Medinfo di Program Studi Informatika UMBY.',
      prokers: [
        {
          id: 'prk-25-01',
          code: 'PRK-2501',
          periodYear: '2025/2026',
          name: 'Rapat Kerja & Pelantikan Pengurus HIMAKA 2026',
          division: 'Badan Pengurus Harian (BPH)',
          month: 'September 2026',
          category: 'Internal & Tata Kelola',
          status: 'TERLAKSANA',
          summary:
            'Perumusan indikator kinerja utama (IKU) seluruh divisi, pengesahan anggaran kegiatan 1 periode, dan penandatanganan pakta integritas 15 pengurus HIMAKA 2026.',
          achievementOrTarget:
            '15 pengurus resmi dilantik & 8 dokumen SOP proker disahkan.',
          personInCharge: 'Aziz Zaghul Ikhsanudin (Ketua)',
        },
        {
          id: 'prk-25-02',
          code: 'PRK-2502',
          periodYear: '2025/2026',
          name: 'Sidang Pleno Tengah Periode & Standarisasi Keuangan Kepanitiaan 2026',
          division: 'Badan Pengurus Harian (BPH)',
          month: 'Oktober 2026',
          category: 'Evaluasi & Transparansi',
          status: 'TERLAKSANA',
          summary:
            'Evaluasi terbuka capaian paruh periode di hadapan perwakilan mahasiswa Informatika dan peluncuran sistem rekonsiliasi 3 digit kode unik Bendahara.',
          achievementOrTarget:
            'Laporan keuangan paruh pertama dipublikasikan tanpa selisih.',
          personInCharge: 'M.Ikrar Fatahillah (Bendahara)',
        },
        {
          id: 'prk-25-03',
          code: 'PRK-2503',
          periodYear: '2025/2026',
          name: 'Desa Mitra Digital 2026: Pembuatan Katalog Web & Branding UMKM Argodadi',
          division: 'Divisi Hubungan Masyarakat & Kemitraan',
          month: 'Oktober 2026',
          category: 'Pengabdian & Humas',
          status: 'TERLAKSANA',
          summary:
            'Pendampingan pembuatan katalog web produk, fotografi katalog, dan pelatihan transaksi digital bagi perajin lokal di Desa Argodadi, Sedayu, Bantul.',
          achievementOrTarget:
            '24 pelaku UMKM desa mitra memiliki katalog digital aktif.',
          personInCharge: 'Muhammad Duta Arkazora Dalimunthe (Anggota Humas)',
        },
        {
          id: 'prk-25-04',
          code: 'PRK-2504',
          periodYear: '2025/2026',
          name: 'Kunjungan Industri Teknologi & Klinik Arsitektur Data Nasional 2026',
          division: 'Divisi Media & Informasi (Medinfo)',
          month: 'Oktober 2026',
          category: 'Kunjungan Industri & Medinfo',
          status: 'TERLAKSANA',
          summary:
            'Bedah infrastruktur sistem perusahaan teknologi di Yogyakarta, pelatihan pipeline data, dan penulisan dokumentasi teknis mahasiswa Informatika.',
          achievementOrTarget:
            '65 delegasi mahasiswa & 12 artikel buletin teknologi terbit.',
          personInCharge: 'Rio Ardiyansyah (Anggota Medinfo)',
        },
        {
          id: 'prk-25-05',
          code: 'PRK-2505',
          periodYear: '2025/2026',
          name: 'Seminar Nasional Informatika, Rekayasa Perangkat Lunak & Etika AI 2026',
          division: 'Divisi PKM (Pengembangan Kreativitas Mahasiswa)',
          month: '15 November 2026',
          category: 'Seminar Nasional (Fitur Ticketing)',
          status: 'BERJALAN',
          summary:
            'Sidang ilmiah tahunan membahas arsitektur kecerdasan buatan, rekayasa perangkat lunak modern, dan kesiapan karir mahasiswa Informatika.',
          achievementOrTarget:
            'Target 205 peserta auditorium (4 SKP Akademik). Pendaftaran dibuka.',
          personInCharge: 'Muhammad Yasir Alfatah (Anggota PKM)',
          ticketingEventId: 'evt-semnas-2025',
        },
        {
          id: 'prk-25-06',
          code: 'PRK-2506',
          periodYear: '2025/2026',
          name: 'Kompetisi Software Development & UI/UX Hackathon IT-Fest HIMAKA 2026',
          division: 'Divisi PKM (Pengembangan Kreativitas Mahasiswa)',
          month: '22 November 2026',
          category: 'Lomba & Kompetisi (Fitur Ticketing)',
          status: 'BERJALAN',
          summary:
            'Kompetisi pengembangan solusi perangkat lunak dan prototipe UI/UX bagi tim delegasi mahasiswa (2–3 orang) serta sesi sidang final terbuka untuk observer.',
          achievementOrTarget:
            '20 Tim Delegasi & 50 Peserta Observer (6 SKP Kompetisi).',
          personInCharge: 'Desi Kristiani Sumaredi (Anggota PKM)',
          ticketingEventId: 'evt-commfest-2025',
        },
        {
          id: 'prk-25-07',
          code: 'PRK-2507',
          periodYear: '2025/2026',
          name: 'Workshop Cloud Computing, DevSecOps & Deployment Arsitektur Modern 2026',
          division: 'Divisi Media & Informasi (Medinfo)',
          month: '29 November 2026',
          category: 'Workshop Praktikum (Fitur Ticketing)',
          status: 'BERJALAN',
          summary:
            'Pelatihan intensif containerization, CI/CD otomatis, dan pengujian keamanan aplikasi di Laboratorium Komputasi Kampus 3 UMBY.',
          achievementOrTarget:
            '30 kursi laboratorium terpenuhi (Kuota Penuh · 3 SKP Praktikum).',
          personInCharge: 'Adil Saputra (Anggota Medinfo)',
          ticketingEventId: 'evt-work-jurnalistik',
        },
        {
          id: 'prk-25-08',
          code: 'PRK-2508',
          periodYear: '2025/2026',
          name: 'Musyawarah Besar (Mubes) & Laporan Pertanggungjawaban Akhir Periode 2026',
          division: 'Badan Pengurus Harian (BPH)',
          month: 'Desember 2026',
          category: 'Sidang Umum Akhir Periode',
          status: 'AKAN DATANG',
          summary:
            'Sidang paripurna laporan pertanggungjawaban seluruh divisi Kabinet Aksara Cipta serta pemilihan ketua umum HIMAKA periode berikutnya.',
          achievementOrTarget:
            'Penyusunan bundel LPJ cetak & arsip digital terbuka.',
          personInCharge: 'Wulandari (Wakil Ketua)',
        },
      ],
      members: [
        {
          id: 'mem-26-01',
          periodYear: '2025/2026',
          name: 'Aziz Zaghul Ikhsanudin',
          nim: '241110051',
          cohortYear: '2024',
          roleTitle: 'Ketua',
          division: 'Badan Pengurus Harian (BPH)',
          concentration: 'Rekayasa Perangkat Lunak',
          mainProker: 'Penanggung Jawab Umum & Rapat Kerja Kabinet HIMAKA 2026',
        },
        {
          id: 'mem-26-02',
          periodYear: '2025/2026',
          name: 'Wulandari',
          nim: '241110080',
          cohortYear: '2024',
          roleTitle: 'Wakil Ketua',
          division: 'Badan Pengurus Harian (BPH)',
          concentration: 'Kecerdasan Buatan & Data',
          mainProker: 'Supervisi Internal Divisi & Musyawarah Besar HIMAKA',
        },
        {
          id: 'mem-26-03',
          periodYear: '2025/2026',
          name: 'M.Ikrar Fatahillah',
          nim: '251110015',
          cohortYear: '2025',
          roleTitle: 'Bendahara',
          division: 'Badan Pengurus Harian (BPH)',
          concentration: 'Kecerdasan Buatan & Data',
          mainProker: 'Verifikasi Mutasi Tiket Proker & Audit Kas Himpunan',
        },
        {
          id: 'mem-26-04',
          periodYear: '2025/2026',
          name: 'Anita Yulinar Simanjutak',
          nim: '251110020',
          cohortYear: '2025',
          roleTitle: 'Sekretaris 1',
          division: 'Badan Pengurus Harian (BPH)',
          concentration: 'Rekayasa Perangkat Lunak',
          mainProker: 'Tata Kelola Kesekretariatan, Surat & Proposal Kegiatan',
        },
        {
          id: 'mem-26-05',
          periodYear: '2025/2026',
          name: 'Aaswin Suayb',
          nim: '251110021',
          cohortYear: '2025',
          roleTitle: 'Sekretaris 2',
          division: 'Badan Pengurus Harian (BPH)',
          concentration: 'Rekayasa Perangkat Lunak',
          mainProker: 'Inventarisasi Arsip Organisasi, Notulensi & SKP',
        },
        {
          id: 'mem-26-06',
          periodYear: '2025/2026',
          name: 'Muhammad Yasir Alfatah',
          nim: '241110085',
          cohortYear: '2024',
          roleTitle: 'Anggota PKM',
          division: 'Divisi PKM (Pengembangan Kreativitas Mahasiswa)',
          concentration: 'Kecerdasan Buatan & Data',
          mainProker: 'Seminar Nasional Informatika, RPL & Etika AI 2025',
        },
        {
          id: 'mem-26-07',
          periodYear: '2025/2026',
          name: 'Desi Kristiani Sumaredi',
          nim: '251110066',
          cohortYear: '2025',
          roleTitle: 'Anggota PKM',
          division: 'Divisi PKM (Pengembangan Kreativitas Mahasiswa)',
          concentration: 'Jaringan & Keamanan Siber',
          mainProker: 'Kompetisi Software Development & Hackathon IT-Fest',
        },
        {
          id: 'mem-26-08',
          periodYear: '2025/2026',
          name: 'Muhammad Duta Arkazora Dalimunthe',
          nim: '241110079',
          cohortYear: '2024',
          roleTitle: 'Anggota Humas',
          division: 'Divisi Hubungan Masyarakat & Kemitraan',
          concentration: 'Jaringan & Keamanan Siber',
          mainProker: 'Jejaring PERMIKOMNAS & Kemitraan Eksternal HIMAKA',
        },
        {
          id: 'mem-26-09',
          periodYear: '2025/2026',
          name: 'Riski Naufal Pradana',
          nim: '241110088',
          cohortYear: '2024',
          roleTitle: 'Anggota Humas',
          division: 'Divisi Hubungan Masyarakat & Kemitraan',
          concentration: 'Rekayasa Perangkat Lunak',
          mainProker: 'Relasi Industri IT, Sponsorship & Career Talk Alumni',
        },
        {
          id: 'mem-26-10',
          periodYear: '2025/2026',
          name: 'Amanda Cahyani',
          nim: '251110067',
          cohortYear: '2025',
          roleTitle: 'Anggota Humas',
          division: 'Divisi Hubungan Masyarakat & Kemitraan',
          concentration: 'Komputasi Cerdas & Multimedia',
          mainProker: 'Protokoler Acara & Koordinator Gate Check-in Semnas',
        },
        {
          id: 'mem-26-11',
          periodYear: '2025/2026',
          name: 'Siti Saskia Widyanti',
          nim: '251110050',
          cohortYear: '2025',
          roleTitle: 'Anggota Humas',
          division: 'Divisi Hubungan Masyarakat & Kemitraan',
          concentration: 'Rekayasa Perangkat Lunak',
          mainProker: 'Sosialisasi Publik & Pengabdian Desa Mitra Digital',
        },
        {
          id: 'mem-26-12',
          periodYear: '2025/2026',
          name: 'Rio Ardiyansyah',
          nim: '241110075',
          cohortYear: '2024',
          roleTitle: 'Anggota Medinfo',
          division: 'Divisi Media & Informasi (Medinfo)',
          concentration: 'Rekayasa Perangkat Lunak',
          mainProker:
            'Pengelolaan Portal Web HIMAKA & Publikasi Proker Medinfo',
        },
        {
          id: 'mem-26-13',
          periodYear: '2025/2026',
          name: 'Ellan Septrysa',
          nim: '251110035',
          cohortYear: '2025',
          roleTitle: 'Anggota Medinfo',
          division: 'Divisi Media & Informasi (Medinfo)',
          concentration: 'Komputasi Cerdas & Multimedia',
          mainProker: 'Desain Visual Poster Proker & Identitas Media Sosial',
        },
        {
          id: 'mem-26-14',
          periodYear: '2025/2026',
          name: 'Mohammad Al Farel Deu',
          nim: '251110017',
          cohortYear: '2025',
          roleTitle: 'Anggota Medinfo',
          division: 'Divisi Media & Informasi (Medinfo)',
          concentration: 'Komputasi Cerdas & Multimedia',
          mainProker: 'Dokumentasi Foto/Video After-Proker & Liputan Kegiatan',
        },
        {
          id: 'mem-26-15',
          periodYear: '2025/2026',
          name: 'Adil Saputra',
          nim: '241110038',
          cohortYear: '2024',
          roleTitle: 'Anggota Medinfo',
          division: 'Divisi Media & Informasi (Medinfo)',
          concentration: 'Jaringan & Keamanan Siber',
          mainProker: 'Redaksi Warta Berita HIMAKA & Arsip Dokumentasi Digital',
        },
      ],
    },
    {
      periodYear: '2024/2025',
      cabinetName: 'Kabinet Sintaks Kolektif',
      isCurrent: false,
      theme: 'Merajut Solidaritas Kampus dan Inovasi Perangkat Lunak Terbuka',
      advisorName: 'Dr. Eng. R. Raharjo, S.Kom., M.Cs.',
      chairpersonName: 'Hendra Wijaya Kusuma',
      chairpersonNim: '200710041',
      viceChairpersonName: 'Bagas Adi Nugroho',
      viceChairpersonNim: '210710088',
      periodSummary:
        'Pada periode 2024/2025, Kabinet Sintaks Kolektif berhasil menuntaskan seluruh 4 program kerja unggulan dengan fokus pada penguatan kelompok studi algoritma, simposium keamanan siber, dan ekshibisi karya aplikasi mahasiswa Informatika.',
      prokers: [
        {
          id: 'prk-24-01',
          code: 'PRK-2401',
          periodYear: '2024/2025',
          name: 'Simposium Nasional Keamanan Siber & Perlindungan Data Pribadi',
          division: 'Divisi Pengembangan Akademik & Keprofesian',
          month: 'Oktober 2024',
          category: 'Seminar Nasional',
          status: 'TERLAKSANA',
          summary:
            'Forum akademik membahas kriptografi, pengujian celah keamanan aplikasi, dan regulasi pelindungan data bersama pakar Informatika DIY.',
          achievementOrTarget:
            'Terlaksana dengan 190 peserta mahasiswa & prosiding ringkas.',
          personInCharge: 'Dian Pertiwi (Kabid Akademik 2024)',
        },
        {
          id: 'prk-24-02',
          code: 'PRK-2402',
          periodYear: '2024/2025',
          name: 'Ekshibisi Karya Inovasi Perangkat Lunak & IoT Mahasiswa Informatika',
          division: 'Divisi Minat Bakat & Kreativitas',
          month: 'November 2024',
          category: 'Pameran & Apresiasi Karya',
          status: 'TERLAKSANA',
          summary:
            'Pameran 45 karya aplikasi web, mobile, dan purwarupa IoT mahasiswa Informatika UMBY untuk solusi masalah perkotaan.',
          achievementOrTarget:
            '45 karya dipamerkan selama 3 hari di Galeri Kampus 3.',
          personInCharge: 'Rania Salsabila (Koordinator Ekshibisi)',
        },
        {
          id: 'prk-24-03',
          code: 'PRK-2403',
          periodYear: '2024/2025',
          name: 'Kemah Bakti Informatika & Literasi Keamanan Siber Pelajar SMA Sleman',
          division: 'Divisi Sosial & Pengabdian Masyarakat',
          month: 'Desember 2024',
          category: 'Pengabdian Masyarakat',
          status: 'TERLAKSANA',
          summary:
            'Edukasi pemrograman dasar, keamanan kata sandi, dan pencegahan rekayasa sosial (phishing) bagi siswa SMA/SMK mitra di Kabupaten Sleman.',
          achievementOrTarget:
            '3 sekolah mitra & 150 siswa mengikuti modul literasi.',
          personInCharge: 'Yusuf Maulana (Kabid Sosmas 2024)',
        },
        {
          id: 'prk-24-04',
          code: 'PRK-2404',
          periodYear: '2024/2025',
          name: 'Penerbitan Buletin Cetak & Digital "Informatika Aksara Edisi Tahunan"',
          division: 'Divisi Media & Informasi (Medinfo)',
          month: 'Januari 2025',
          category: 'Publikasi & Dokumentasi',
          status: 'TERLAKSANA',
          summary:
            'Penyusunan buletin tahunan berisi artikel teknis mahasiswa, profil lulusan berprestasi, dan dokumentasi satu periode kepengurusan.',
          achievementOrTarget:
            'Terbit 64 halaman cetak & repositori PDF akses terbuka.',
          personInCharge: 'Taufik Hidayat (Pemimpin Redaksi 2024)',
        },
      ],
      members: [
        {
          id: 'mem-24-01',
          periodYear: '2024/2025',
          name: 'Hendra Wijaya Kusuma',
          nim: '200710041',
          cohortYear: '2020',
          roleTitle: 'Ketua Umum HIMAKA 2024/2025',
          division: 'Badan Pengurus Harian (BPH)',
          concentration: 'Rekayasa Perangkat Lunak',
          mainProker: 'Koordinasi Umum Kabinet Sintaks Kolektif',
        },
        {
          id: 'mem-24-02',
          periodYear: '2024/2025',
          name: 'Bagas Adi Nugroho',
          nim: '210710088',
          cohortYear: '2021',
          roleTitle: 'Wakil Ketua Umum',
          division: 'Badan Pengurus Harian (BPH)',
          concentration: 'Rekayasa Perangkat Lunak',
          mainProker: 'Kaderisasi & Evaluasi Program Kerja',
        },
        {
          id: 'mem-24-03',
          periodYear: '2024/2025',
          name: 'Anisa Fitriani',
          nim: '200710089',
          cohortYear: '2020',
          roleTitle: 'Sekretaris Umum',
          division: 'Badan Pengurus Harian (BPH)',
          concentration: 'Kecerdasan Buatan & Data',
          mainProker: 'Administrasi Kesekretariatan & LPJ Tahunan',
        },
        {
          id: 'mem-24-04',
          periodYear: '2024/2025',
          name: 'M. Gilang Saputra',
          nim: '200710112',
          cohortYear: '2020',
          roleTitle: 'Bendahara Umum',
          division: 'Badan Pengurus Harian (BPH)',
          concentration: 'Kecerdasan Buatan & Data',
          mainProker: 'Pengelolaan Dana Kemahasiswaan & Sponsorship',
        },
        {
          id: 'mem-24-05',
          periodYear: '2024/2025',
          name: 'Dian Pertiwi',
          nim: '210710034',
          cohortYear: '2021',
          roleTitle: 'Kepala Divisi Pengembangan Akademik',
          division: 'Divisi Pengembangan Akademik & Keprofesian',
          concentration: 'Jaringan & Keamanan Siber',
          mainProker: 'Simposium Nasional Keamanan Siber 2024',
        },
        {
          id: 'mem-24-06',
          periodYear: '2024/2025',
          name: 'Taufik Hidayat',
          nim: '210710077',
          cohortYear: '2021',
          roleTitle: 'Kepala Divisi Media & Informasi (Medinfo)',
          division: 'Divisi Media & Informasi (Medinfo)',
          concentration: 'Komputasi Cerdas & Multimedia',
          mainProker: 'Buletin Tahunan Informatika & Repositori Kampus',
        },
        {
          id: 'mem-24-07',
          periodYear: '2024/2025',
          name: 'Rania Salsabila',
          nim: '210710095',
          cohortYear: '2021',
          roleTitle: 'Koordinator Ekshibisi & Minat Bakat',
          division: 'Divisi Minat Bakat & Kreativitas',
          concentration: 'Rekayasa Perangkat Lunak',
          mainProker: 'Ekshibisi Karya Inovasi Perangkat Lunak & IoT',
        },
        {
          id: 'mem-24-08',
          periodYear: '2024/2025',
          name: 'Yusuf Maulana',
          nim: '210710140',
          cohortYear: '2021',
          roleTitle: 'Kepala Divisi Sosial & Pengabdian Masyarakat',
          division: 'Divisi Sosial & Pengabdian Masyarakat',
          concentration: 'Jaringan & Keamanan Siber',
          mainProker: 'Kemah Bakti Informatika & Literasi Siber Sleman',
        },
      ],
    },
    {
      periodYear: '2023/2024',
      cabinetName: 'Kabinet Lentera Algoritma',
      isCurrent: false,
      theme:
        'Revitalisasi Laboratorium Komputasi & Jejaring Informatika Nusantara',
      advisorName: 'Dr. Eng. R. Raharjo, S.Kom., M.Cs.',
      chairpersonName: 'Arif Rahman Hakim',
      chairpersonNim: '190710012',
      viceChairpersonName: 'Hendra Wijaya Kusuma',
      viceChairpersonNim: '200710041',
      periodSummary:
        'Periode 2023/2024 menandai kebangkitan penuh aktivitas luring di auditorium kampus melalui penyelenggaraan Pekan Informatika UMBY, revitalisasi komunitas open-source kampus, dan temu ramah alumni lintas angkatan.',
      prokers: [
        {
          id: 'prk-23-01',
          code: 'PRK-2301',
          periodYear: '2023/2024',
          name: 'Pekan Informatika & Orasi Ilmiah Transformasi Digital',
          division: 'Divisi Pengembangan Akademik & Keprofesian',
          month: 'Oktober 2023',
          category: 'Pekan Ilmiah Tahunan',
          status: 'TERLAKSANA',
          summary:
            'Rangkaian kuliah umum, bedah riset skripsi informatika terbaik, dan diskusi panel industri teknologi Yogyakarta.',
          achievementOrTarget:
            '210 peserta hadir & 5 pembicara industri nasional.',
          personInCharge: 'Citra Kirana Dewi (Kabid Akademik 2023)',
        },
        {
          id: 'prk-23-02',
          code: 'PRK-2302',
          periodYear: '2023/2024',
          name: 'Revitalisasi Komunitas Open-Source & Kelompok Studi Linux Kampus',
          division: 'Divisi Media & Informasi (Medinfo)',
          month: 'November 2023',
          category: 'Laboratorium Komputasi',
          status: 'TERLAKSANA',
          summary:
            'Pelatihan administrasi server Linux, pengelolaan Git repository, dan peluncuran portal dokumentasi belajar mahasiswa Informatika.',
          achievementOrTarget:
            '20 modul tutorial pemrograman dipublikasikan selama 1 periode.',
          personInCharge: 'Wahyu Setiawan (Kabid Medinfo 2023)',
        },
        {
          id: 'prk-23-03',
          code: 'PRK-2303',
          periodYear: '2023/2024',
          name: 'Forum Silaturahmi & Career Talk Alumni Informatika UMBY',
          division: 'Divisi Hubungan Masyarakat & Kemitraan',
          month: 'Desember 2023',
          category: 'Jejaring Alumni & Karir',
          status: 'TERLAKSANA',
          summary:
            'Pertemuan lintas angkatan bersama software engineer, data analyst, dan system administrator alumni UMBY untuk pemetaan magang mahasiswa.',
          achievementOrTarget:
            '14 perusahaan teknologi mitra magang baru terhubung dengan prodi.',
          personInCharge: 'Putri Ayu Lestari (Kabid Humas 2023)',
        },
      ],
      members: [
        {
          id: 'mem-23-01',
          periodYear: '2023/2024',
          name: 'Arif Rahman Hakim',
          nim: '190710012',
          cohortYear: '2019',
          roleTitle: 'Ketua Umum HIMAKA 2023/2024',
          division: 'Badan Pengurus Harian (BPH)',
          concentration: 'Rekayasa Perangkat Lunak',
          mainProker: 'Pimpinan Umum Kabinet Lentera Algoritma',
        },
        {
          id: 'mem-23-02',
          periodYear: '2023/2024',
          name: 'Hendra Wijaya Kusuma',
          nim: '200710041',
          cohortYear: '2020',
          roleTitle: 'Wakil Ketua Umum',
          division: 'Badan Pengurus Harian (BPH)',
          concentration: 'Rekayasa Perangkat Lunak',
          mainProker: 'Koordinasi Internal & Kaderisasi Mahasiswa Baru',
        },
        {
          id: 'mem-23-03',
          periodYear: '2023/2024',
          name: 'Mega Puspitasari',
          nim: '190710055',
          cohortYear: '2019',
          roleTitle: 'Sekretaris Umum',
          division: 'Badan Pengurus Harian (BPH)',
          concentration: 'Kecerdasan Buatan & Data',
          mainProker: 'Standarisasi Pedoman Administrasi Himpunan',
        },
        {
          id: 'mem-23-04',
          periodYear: '2023/2024',
          name: 'Citra Kirana Dewi',
          nim: '200710023',
          cohortYear: '2020',
          roleTitle: 'Kepala Divisi Pengembangan Akademik',
          division: 'Divisi Pengembangan Akademik & Keprofesian',
          concentration: 'Kecerdasan Buatan & Data',
          mainProker: 'Pekan Informatika UMBY 2023',
        },
        {
          id: 'mem-23-05',
          periodYear: '2023/2024',
          name: 'Wahyu Setiawan',
          nim: '200710067',
          cohortYear: '2020',
          roleTitle: 'Kepala Divisi Media & Informasi (Medinfo)',
          division: 'Divisi Media & Informasi (Medinfo)',
          concentration: 'Jaringan & Keamanan Siber',
          mainProker: 'Revitalisasi Komunitas Open-Source & Portal Belajar',
        },
        {
          id: 'mem-23-06',
          periodYear: '2023/2024',
          name: 'Putri Ayu Lestari',
          nim: '200710094',
          cohortYear: '2020',
          roleTitle: 'Kepala Divisi Hubungan Masyarakat & Kemitraan',
          division: 'Divisi Hubungan Masyarakat & Kemitraan',
          concentration: 'Komputasi Cerdas & Multimedia',
          mainProker: 'Career Talk Alumni Informatika & Kemitraan Magang IT',
        },
      ],
    },
  ];

  return {
    version: 2,
    events,
    transactions,
    scanLogs,
    medinfo,
    users,
    currentUser: null,
    activePortal: 'guest',
    newsArticles,
    organizationProfile,
    cabinetPeriods,
    documentationGallery: getHimakaDocumentationGallery(),
  };
}

export function resolvePortalModeForUser(
  user: HimakaUser | null | undefined,
): PortalMode {
  if (!user) return 'guest';
  if (user.role === 'pengurus') return 'admin';
  return 'user';
}

export function getUserTransactions(
  transactions: Transaction[],
  user: HimakaUser | null | undefined,
): Transaction[] {
  if (!user) return [];
  const nimClean = user.nim.trim().toLowerCase();
  const emailClean = user.email.trim().toLowerCase();
  return transactions.filter(
    (t) =>
      t.nim.trim().toLowerCase() === nimClean ||
      t.email.trim().toLowerCase() === emailClean,
  );
}

export function getCabinetByPeriod(
  periods: HimakaCabinetPeriod[],
  periodYear: string,
): HimakaCabinetPeriod | undefined {
  return periods.find((p) => p.periodYear === periodYear) || periods[0];
}

export function filterPeriodMembers(
  members: HimakaPeriodMember[],
  division: 'Semua Divisi' | HimakaDivisionName,
  searchQuery: string,
): HimakaPeriodMember[] {
  const q = searchQuery.trim().toLowerCase();
  return members.filter((m) => {
    const matchDiv = division === 'Semua Divisi' || m.division === division;
    const matchQuery =
      !q ||
      m.name.toLowerCase().includes(q) ||
      m.nim.toLowerCase().includes(q) ||
      m.roleTitle.toLowerCase().includes(q) ||
      m.mainProker.toLowerCase().includes(q) ||
      m.cohortYear.toLowerCase().includes(q);
    return matchDiv && matchQuery;
  });
}

export function filterPeriodProkers(
  prokers: HimakaProkerItem[],
  statusFilter: 'SEMUA' | ProkerStatus,
  divisionFilter: 'Semua Divisi' | HimakaDivisionName,
): HimakaProkerItem[] {
  return prokers.filter((p) => {
    const matchStatus = statusFilter === 'SEMUA' || p.status === statusFilter;
    const matchDiv =
      divisionFilter === 'Semua Divisi' || p.division === divisionFilter;
    return matchStatus && matchDiv;
  });
}

export function authenticateUser(
  users: HimakaUser[],
  identifier: string,
  password: string,
): { user?: HimakaUser; error?: string } {
  const cleanId = identifier.trim().toLowerCase();
  if (!cleanId) {
    return { error: 'Masukkan NIM atau Email kampus Anda.' };
  }
  if (!password || password.trim().length < 4) {
    return { error: 'Kata sandi wajib diisi (minimal 4 karakter).' };
  }

  const found = users.find(
    (u) => u.email.toLowerCase() === cleanId || u.nim.toLowerCase() === cleanId,
  );

  if (!found) {
    return {
      error:
        'Akun dengan NIM atau Email tersebut belum terdaftar. Silakan pilih tab Register Akun Baru.',
    };
  }

  if (found.password !== password) {
    return { error: 'Kata sandi yang Anda masukkan tidak sesuai.' };
  }

  return { user: found };
}

export function registerNewUser(
  users: HimakaUser[],
  input: {
    name: string;
    nim: string;
    faculty: string;
    email: string;
    whatsapp: string;
    password: string;
  },
): { user?: HimakaUser; errors?: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!input.name || input.name.trim().length < 3) {
    errors.name = 'Nama lengkap wajib diisi (minimal 3 karakter).';
  }
  if (!input.nim || input.nim.trim().length < 5) {
    errors.nim = 'NIM / Nomor Identitas wajib diisi (minimal 5 karakter).';
  }
  if (!input.faculty || input.faculty.trim().length < 2) {
    errors.faculty = 'Program Studi / Fakultas wajib diisi.';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!input.email || !emailRegex.test(input.email.trim())) {
    errors.email = 'Format alamat email tidak valid.';
  }
  const cleanWa = (input.whatsapp || '').replace(/[\s-]/g, '');
  if (!cleanWa || !/^(08|\+628|628)\d{7,12}$/.test(cleanWa)) {
    errors.whatsapp = 'Nomor WhatsApp aktif wajib diawali 08 atau +628.';
  }
  if (!input.password || input.password.length < 6) {
    errors.password = 'Kata sandi minimal 6 karakter.';
  }

  const duplicate = users.find(
    (u) =>
      u.nim.toLowerCase() === input.nim.trim().toLowerCase() ||
      u.email.toLowerCase() === input.email.trim().toLowerCase(),
  );
  if (duplicate) {
    errors.nim = 'NIM atau Email sudah terdaftar. Silakan langsung Login.';
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  const newUser: HimakaUser = {
    id: `usr-${Date.now()}`,
    name: input.name.trim(),
    nim: input.nim.trim(),
    faculty: input.faculty.trim(),
    email: input.email.trim(),
    whatsapp: input.whatsapp.trim(),
    password: input.password,
    role: 'peserta',
    joinedAt: 'Baru saja bergabung',
  };

  return { user: newUser };
}

export function getDocumentationForNews(article: HimakaNewsArticle): {
  imageUrl: string;
  imageCaption: string;
  photographer: string;
  archiveCode: string;
} {
  if (
    article.imageUrl &&
    article.imageCaption &&
    article.photographer &&
    article.archiveCode
  ) {
    return {
      imageUrl: article.imageUrl,
      imageCaption: article.imageCaption,
      photographer: article.photographer,
      archiveCode: article.archiveCode,
    };
  }

  switch (article.id) {
    case 'news-01':
      return {
        imageUrl: '/images/dokumentasi/dok-kunjungan-redaksi.svg',
        imageCaption:
          'Dokumentasi 65 delegasi mahasiswa Informatika UMBY saat membedah arsitektur sistem dan pipeline data bersama senior engineer.',
        photographer: 'Bima Arya Pamungkas (Tim Dokumentasi Medinfo)',
        archiveCode: 'DOK-HMK-2501',
      };
    case 'news-02':
      return {
        imageUrl: '/images/dokumentasi/dok-desa-mitra-umkm.svg',
        imageCaption:
          'Sesi pendampingan pembuatan sistem katalog web dan digitalisasi produk bagi 24 UMKM Desa Argodadi, Bantul oleh mahasiswa Informatika.',
        photographer: 'Kezia Aurelia Maharani (Divisi Humas & Sosmas)',
        archiveCode: 'DOK-HMK-2502',
      };
    case 'news-03':
      return {
        imageUrl: '/images/dokumentasi/dok-studio-broadcasting.svg',
        imageCaption:
          'Suasana demo aplikasi dan bedah 4 proyek open-source karya mahasiswa Informatika di Laboratorium Komputasi Kampus 3 UMBY.',
        photographer: 'Reza Kurniawan (Laboratorium Komputasi)',
        archiveCode: 'DOK-HMK-2503',
      };
    case 'news-04':
      return {
        imageUrl: '/images/dokumentasi/dok-commfest-pitching.svg',
        imageCaption:
          'Presentasi arsitektur aplikasi "GuardNet AI" oleh Tim Delegasi Kode Aksara Informatika UMBY yang meraih Juara 2 Hackathon Nasional.',
        photographer: 'Rania Salsabila (Divisi Minat Bakat)',
        archiveCode: 'DOK-HMK-2504',
      };
    default:
      return {
        imageUrl: '/images/dokumentasi/dok-sidang-pleno-bph.svg',
        imageCaption:
          'Sidang Pleno Tengah Periode Kabinet Aksara Cipta di Ruang Sidang 2 Kampus 3 UMBY membahas evaluasi 11 proker dan transparansi mutasi Bendahara.',
        photographer: 'Larasati Sekar Arum (Sekretariat BPH)',
        archiveCode: 'DOK-HMK-2505',
      };
  }
}

export function getDocumentationForProker(proker: HimakaProkerItem): {
  imageUrl: string;
  imageCaption: string;
  archiveCode: string;
} {
  if (proker.imageUrl && proker.imageCaption && proker.archiveCode) {
    return {
      imageUrl: proker.imageUrl,
      imageCaption: proker.imageCaption,
      archiveCode: proker.archiveCode,
    };
  }

  if (
    proker.id === 'prk-25-05' ||
    proker.id === 'prk-24-01' ||
    proker.id === 'prk-23-01' ||
    proker.ticketingEventId === 'evt-semnas-2025'
  ) {
    return {
      imageUrl: '/images/dokumentasi/dok-seminar-auditorium.svg',
      imageCaption:
        'Dokumentasi persiapan dan tata panggung Seminar Nasional Informatika di Auditorium Kampus 3 UMBY (kapasitas 205 kursi dengan gate QR anti-passback).',
      archiveCode: `DOK-${proker.code}`,
    };
  }

  if (
    proker.id === 'prk-25-06' ||
    proker.ticketingEventId === 'evt-commfest-2025'
  ) {
    return {
      imageUrl: '/images/dokumentasi/dok-commfest-pitching.svg',
      imageCaption:
        'Dokumentasi sesi presentasi demo aplikasi dan arsitektur sistem delegasi mahasiswa di hadapan dewan juri pada Hackathon IT-Fest HIMAKA UMBY.',
      archiveCode: `DOK-${proker.code}`,
    };
  }

  if (
    proker.id === 'prk-25-07' ||
    proker.id === 'prk-23-02' ||
    proker.ticketingEventId === 'evt-work-jurnalistik'
  ) {
    return {
      imageUrl: '/images/dokumentasi/dok-studio-broadcasting.svg',
      imageCaption:
        'Dokumentasi praktik Cloud Computing, CI/CD pipeline, dan pengujian keamanan di Laboratorium Komputasi Kampus 3 UMBY.',
      archiveCode: `DOK-${proker.code}`,
    };
  }

  if (proker.id === 'prk-25-03' || proker.id === 'prk-24-03') {
    return {
      imageUrl: '/images/dokumentasi/dok-desa-mitra-umkm.svg',
      imageCaption:
        'Dokumentasi lapangan pengabdian masyarakat HIMAKA UMBY: digitalisasi katalog UMKM desa mitra dan edukasi keamanan siber pelajar di DIY.',
      archiveCode: `DOK-${proker.code}`,
    };
  }

  if (proker.id === 'prk-25-04' || proker.id === 'prk-24-04') {
    return {
      imageUrl: '/images/dokumentasi/dok-kunjungan-redaksi.svg',
      imageCaption:
        'Dokumentasi kunjungan industri teknologi, klinik data engineering, dan kurasi buletin tahunan mahasiswa Informatika UMBY.',
      archiveCode: `DOK-${proker.code}`,
    };
  }

  if (proker.id === 'prk-24-02' || proker.id === 'prk-23-03') {
    return {
      imageUrl: '/images/dokumentasi/dok-pameran-fotografi.svg',
      imageCaption:
        'Dokumentasi ekshibisi karya inovasi perangkat lunak & IoT mahasiswa Informatika UMBY serta forum silaturahmi alumni.',
      archiveCode: `DOK-${proker.code}`,
    };
  }

  return {
    imageUrl: '/images/dokumentasi/dok-sidang-pleno-bph.svg',
    imageCaption:
      'Dokumentasi sidang pleno pengurus, rapat kerja kabinet, dan perumusan standar tata kelola organisasi HIMAKA UMBY.',
    archiveCode: `DOK-${proker.code}`,
  };
}

export function getDocumentationForEvent(event: AcademicEvent): {
  imageUrl: string;
  imageCaption: string;
  archiveCode: string;
} {
  if (event.imageUrl && event.imageCaption) {
    return {
      imageUrl: event.imageUrl,
      imageCaption: event.imageCaption,
      archiveCode: `DOK-${event.code}`,
    };
  }

  switch (event.id) {
    case 'evt-semnas-2025':
      return {
        imageUrl: '/images/dokumentasi/dok-seminar-auditorium.svg',
        imageCaption:
          'Visualisasi & dokumentasi Auditorium Kampus 3 UMBY — lokasi pelaksanaan Seminar Nasional Informatika, RPL & Etika AI 2025.',
        archiveCode: 'DOK-SMN-25',
      };
    case 'evt-commfest-2025':
      return {
        imageUrl: '/images/dokumentasi/dok-commfest-pitching.svg',
        imageCaption:
          'Dokumentasi panggung presentasi delegasi tim developer & ruang sidang observer Kompetisi Hackathon IT-Fest HIMAKA UMBY.',
        archiveCode: 'DOK-INF-25',
      };
    default:
      return {
        imageUrl: '/images/dokumentasi/dok-studio-broadcasting.svg',
        imageCaption:
          'Dokumentasi fasilitas workstation server, jaringan, dan cloud sandbox di Laboratorium Komputasi Kampus 3 UMBY.',
        archiveCode: 'DOK-WKS-25',
      };
  }
}

export function getDocumentationForDivision(div: HimakaDivisionInfo): {
  imageUrl: string;
  imageCaption: string;
} {
  if (div.imageUrl && div.imageCaption) {
    return { imageUrl: div.imageUrl, imageCaption: div.imageCaption };
  }
  switch (div.code) {
    case 'BPH':
      return {
        imageUrl: '/images/dokumentasi/dok-sidang-pleno-bph.svg',
        imageCaption:
          'Dokumentasi Sidang Pleno & Rapat Koordinasi BPH Inti HIMAKA',
      };
    case 'AKD':
      return {
        imageUrl: '/images/dokumentasi/dok-seminar-auditorium.svg',
        imageCaption:
          'Dokumentasi Seminar Nasional Informatika & Study Club Pemrograman',
      };
    case 'MDF':
      return {
        imageUrl: '/images/dokumentasi/dok-kunjungan-redaksi.svg',
        imageCaption:
          'Dokumentasi Kunjungan Industri IT & Pengelolaan Sistem Web Medinfo',
      };
    case 'HMS':
      return {
        imageUrl: '/images/dokumentasi/dok-sekretariat-himaka.svg',
        imageCaption:
          'Dokumentasi Jejaring PERMIKOMNAS & Kemitraan Industri HIMAKA',
      };
    case 'MBK':
      return {
        imageUrl: '/images/dokumentasi/dok-commfest-pitching.svg',
        imageCaption:
          'Dokumentasi Hackathon IT-Fest & Ekshibisi Karya Perangkat Lunak',
      };
    default:
      return {
        imageUrl: '/images/dokumentasi/dok-desa-mitra-umkm.svg',
        imageCaption:
          'Dokumentasi Digitalisasi Katalog Web UMKM Desa Mitra Bantul',
      };
  }
}

export function getHimakaDocumentationGallery(
  customGallery?: HimakaDocumentationItem[],
): HimakaDocumentationItem[] {
  if (Array.isArray(customGallery)) {
    return customGallery;
  }
  return [
    {
      id: 'gal-01',
      archiveCode: 'DOK-HMK-2501',
      title: 'Kunjungan Industri Teknologi & Klinik Data Engineering Nasional',
      category: 'Industri & Medinfo',
      periodYear: '2025/2026',
      date: '21 Oktober 2025',
      location: 'Tech Hub Yogyakarta & Auditorium Kampus 3 UMBY',
      division: 'Divisi Media & Informasi (Medinfo)',
      photographer: 'Bima Arya Pamungkas',
      imageUrl: '/images/dokumentasi/dok-kunjungan-redaksi.svg',
      caption:
        'Sebanyak 65 delegasi mahasiswa Informatika UMBY membedah arsitektur microservices, pipeline data real-time, dan keamanan sistem bersama senior software engineer.',
      relatedEventId: 'evt-semnas-2025',
    },
    {
      id: 'gal-02',
      archiveCode: 'DOK-HMK-2502',
      title:
        'Pendampingan Pembuatan Katalog Web & Digitalisasi 24 UMKM Desa Mitra',
      category: 'Pengabdian Masyarakat',
      periodYear: '2025/2026',
      date: '18 Oktober 2025',
      location: 'Balai Desa Wisata Argodadi, Sedayu, Bantul',
      division: 'Divisi Sosial & Pengabdian Masyarakat',
      photographer: 'Kezia Aurelia Maharani',
      imageUrl: '/images/dokumentasi/dok-desa-mitra-umkm.svg',
      caption:
        'Mahasiswa Informatika menyiapkan studio foto produk dan merancang sistem katalog web responsif untuk mempermudah pemasaran produk kerajinan warga.',
      relatedEventId: 'evt-commfest-2025',
    },
    {
      id: 'gal-03',
      archiveCode: 'DOK-HMK-2503',
      title: 'Malam Demo Karya Open-Source & Workshop Cloud DevSecOps',
      category: 'Akademik & Laboratorium',
      periodYear: '2025/2026',
      date: '14 Oktober 2025',
      location: 'Laboratorium Komputasi Kampus 3 UMBY',
      division: 'Divisi Pengembangan Akademik & Keprofesian',
      photographer: 'Reza Kurniawan',
      imageUrl: '/images/dokumentasi/dok-studio-broadcasting.svg',
      caption:
        'Presentasi 4 proyek aplikasi open-source mahasiswa Informatika UMBY dilanjutkan dengan bedah arsitektur container dan pengujian keamanan.',
      relatedEventId: 'evt-work-jurnalistik',
    },
    {
      id: 'gal-04',
      archiveCode: 'DOK-SMN-2025',
      title:
        'Konfigurasi Auditorium & Gate QR Seminar Nasional Informatika & AI',
      category: 'Seminar Nasional',
      periodYear: '2025/2026',
      date: '15 November 2025',
      location: 'Auditorium Kampus 3 UMBY, Ringroad Utara',
      division: 'Divisi Pengembangan Akademik & Keprofesian',
      photographer: 'Dimas Prakoso',
      imageUrl: '/images/dokumentasi/dok-seminar-auditorium.svg',
      caption:
        'Tata ruang Auditorium Kampus 3 UMBY berkapasitas 205 kursi (VIP Executive & Reguler) yang dilengkapi meja validasi QR anti-passback.',
      relatedEventId: 'evt-semnas-2025',
    },
    {
      id: 'gal-05',
      archiveCode: 'DOK-INF-2025',
      title:
        'Sesi Demo Aplikasi & Pitching Delegasi di Hackathon IT-Fest HIMAKA',
      category: 'Kompetisi & Prestasi',
      periodYear: '2025/2026',
      date: '22 November 2025',
      location: 'Laboratorium Terpadu Informatika & Ruang Sidang 2',
      division: 'Divisi Minat Bakat & Kreativitas',
      photographer: 'Rania Salsabila',
      imageUrl: '/images/dokumentasi/dok-commfest-pitching.svg',
      caption:
        'Tim delegasi mahasiswa mempresentasikan prototipe perangkat lunak dan arsitektur UI/UX di hadapan dewan juri praktisi industri teknologi dan dosen Informatika.',
      relatedEventId: 'evt-commfest-2025',
    },
    {
      id: 'gal-06',
      archiveCode: 'DOK-HMK-2505',
      title: 'Sidang Pleno Tengah Periode & Laporan Rekonsiliasi Bendahara',
      category: 'Tata Kelola & BPH',
      periodYear: '2025/2026',
      date: '03 Oktober 2025',
      location: 'Ruang Sidang 2 Kampus 3 UMBY',
      division: 'Badan Pengurus Harian (BPH)',
      photographer: 'Larasati Sekar Arum',
      imageUrl: '/images/dokumentasi/dok-sidang-pleno-bph.svg',
      caption:
        'Presidium sidang bersama Ketua Umum, Wakil Ketua Umum, dan Bendahara memaparkan capaian proker serta pengesahan sistem 3 digit kode unik.',
      relatedEventId: 'evt-semnas-2025',
    },
    {
      id: 'gal-07',
      archiveCode: 'DOK-PRK-2402',
      title:
        'Ekshibisi Karya Inovasi Perangkat Lunak & IoT Mahasiswa Informatika',
      category: 'Apresiasi Karya',
      periodYear: '2024/2025',
      date: '16 November 2024',
      location: 'Galeri Kampus 3 UMBY',
      division: 'Divisi Minat Bakat & Kreativitas',
      photographer: 'Taufik Hidayat',
      imageUrl: '/images/dokumentasi/dok-pameran-fotografi.svg',
      caption:
        'Dokumentasi pameran 45 karya aplikasi web, mobile, dan purwarupa IoT mahasiswa Informatika UMBY untuk solusi masalah perkotaan di Yogyakarta.',
    },
    {
      id: 'gal-08',
      archiveCode: 'DOK-PROFIL-01',
      title: 'Sekretariat HIMAKA UMBY & 4 Peminatan Studi Informatika',
      category: 'Profil Institusi',
      periodYear: '2025/2026',
      date: 'September 2025',
      location: 'Gedung Kemahasiswaan Kampus 3 UMBY, Condongcatur, Sleman',
      division: 'Badan Pengurus Harian (BPH)',
      photographer: 'Tim Dokumentasi Medinfo',
      imageUrl: '/images/dokumentasi/dok-sekretariat-himaka.svg',
      caption:
        'Pusat koordinasi 6 divisi HIMAKA UMBY (Himpunan Mahasiswa Informatika) yang menaungi peminatan RPL, Kecerdasan Buatan & Data, Jaringan & Keamanan Siber, serta Komputasi Cerdas.',
    },
  ];
}

export type BreadcrumbNavTab =
  | 'home'
  | 'user-dashboard'
  | 'admin-dashboard'
  | 'katalog'
  | 'tiketku'
  | 'medinfo'
  | 'scanner'
  | 'bendahara';

export type BreadcrumbSubScreen = 'katalog' | 'detail' | 'form' | 'pembayaran';

export type BreadcrumbTargetAction =
  | { type: 'tab'; tab: BreadcrumbNavTab }
  | { type: 'katalog-subscreen'; subScreen: BreadcrumbSubScreen };

export interface BreadcrumbItem {
  id: string;
  label: string;
  codeBadge?: string;
  isCurrent: boolean;
  action?: BreadcrumbTargetAction;
}

export interface BuildBreadcrumbsParams {
  portal: PortalMode;
  activeTab: BreadcrumbNavTab;
  pesertaSubScreen: BreadcrumbSubScreen;
  selectedEvent?: Pick<AcademicEvent, 'id' | 'code' | 'title'> | null;
  selectedTier?: Pick<EventTier, 'id' | 'name'> | null;
  activeTransaction?: Pick<Transaction, 'id' | 'ticketCode' | 'status'> | null;
}

export function buildPortalBreadcrumbs(
  params: BuildBreadcrumbsParams,
): BreadcrumbItem[] {
  const {
    portal,
    activeTab,
    pesertaSubScreen,
    selectedEvent,
    selectedTier,
    activeTransaction,
  } = params;

  // Root views for each portal do not render the inner-view breadcrumb bar
  if (portal === 'guest' && activeTab === 'home') return [];
  if (portal === 'user' && activeTab === 'user-dashboard') return [];
  if (portal === 'admin' && activeTab === 'admin-dashboard') return [];

  const rootCrumb: BreadcrumbItem =
    portal === 'admin'
      ? {
          id: 'root-admin',
          label: 'Overview Admin',
          codeBadge: 'PORTAL ADMIN',
          isCurrent: false,
          action: { type: 'tab', tab: 'admin-dashboard' },
        }
      : portal === 'user'
        ? {
            id: 'root-user',
            label: 'Dashboard Peserta',
            codeBadge: 'PORTAL USER',
            isCurrent: false,
            action: { type: 'tab', tab: 'user-dashboard' },
          }
        : {
            id: 'root-guest',
            label: 'Beranda Organisasi',
            codeBadge: 'PORTAL GUEST',
            isCurrent: false,
            action: { type: 'tab', tab: 'home' },
          };

  if (activeTab === 'katalog') {
    if (pesertaSubScreen === 'katalog') {
      return [
        rootCrumb,
        {
          id: 'katalog-root',
          label: 'Katalog Proker & Acara',
          codeBadge: 'KATALOG',
          isCurrent: true,
        },
      ];
    }

    const catalogParentCrumb: BreadcrumbItem = {
      id: 'katalog-parent',
      label: 'Katalog Proker & Acara',
      isCurrent: false,
      action: { type: 'katalog-subscreen', subScreen: 'katalog' },
    };

    if (pesertaSubScreen === 'detail') {
      return [
        rootCrumb,
        catalogParentCrumb,
        {
          id: 'event-detail',
          label: selectedEvent
            ? selectedEvent.title
            : 'Detail Acara & Pilihan Tier',
          codeBadge: selectedEvent?.code || 'DETAIL ACARA',
          isCurrent: true,
        },
      ];
    }

    const eventDetailParentCrumb: BreadcrumbItem = {
      id: 'event-detail-parent',
      label: selectedEvent ? selectedEvent.title : 'Detail Acara',
      codeBadge: selectedEvent?.code,
      isCurrent: false,
      action: { type: 'katalog-subscreen', subScreen: 'detail' },
    };

    if (pesertaSubScreen === 'form') {
      return [
        rootCrumb,
        catalogParentCrumb,
        eventDetailParentCrumb,
        {
          id: 'registration-form',
          label: selectedTier
            ? `Form Pendaftaran (${selectedTier.name})`
            : 'Form Pendaftaran Peserta',
          codeBadge: 'FORM REGISTRASI',
          isCurrent: true,
        },
      ];
    }

    // pesertaSubScreen === 'pembayaran'
    return [
      rootCrumb,
      catalogParentCrumb,
      eventDetailParentCrumb,
      {
        id: 'transaction-payment',
        label: 'Transaksi & Instruksi Pembayaran',
        codeBadge: activeTransaction?.id || 'PEMBAYARAN',
        isCurrent: true,
      },
    ];
  }

  if (activeTab === 'tiketku') {
    return [
      rootCrumb,
      {
        id: 'katalog-link',
        label: 'Transaksi Peserta',
        isCurrent: false,
        action: { type: 'tab', tab: 'katalog' },
      },
      {
        id: 'my-tickets',
        label: 'Status Transaksi & E-Ticket QR',
        codeBadge: activeTransaction?.ticketCode || 'E-TICKET QR',
        isCurrent: true,
      },
    ];
  }

  if (activeTab === 'bendahara') {
    return [
      rootCrumb,
      {
        id: 'admin-tools-finance',
        label: 'Perangkat Admin',
        isCurrent: false,
        action: {
          type: 'tab',
          tab: portal === 'admin' ? 'admin-dashboard' : 'home',
        },
      },
      {
        id: 'treasurer-tool',
        label: 'Dashboard Bendahara & Transaksi',
        codeBadge: 'BENDAHARA',
        isCurrent: true,
      },
    ];
  }

  if (activeTab === 'scanner') {
    return [
      rootCrumb,
      {
        id: 'admin-tools-gate',
        label: 'Perangkat Admin',
        isCurrent: false,
        action: {
          type: 'tab',
          tab: portal === 'admin' ? 'admin-dashboard' : 'home',
        },
      },
      {
        id: 'scanner-tool',
        label: 'Scanner Gate & Anti-Passback',
        codeBadge: 'GATE SCANNER',
        isCurrent: true,
      },
    ];
  }

  if (activeTab === 'medinfo') {
    return [
      rootCrumb,
      {
        id: 'admin-tools-cms',
        label: 'Perangkat Admin',
        isCurrent: false,
        action: {
          type: 'tab',
          tab: portal === 'admin' ? 'admin-dashboard' : 'home',
        },
      },
      {
        id: 'medinfo-tool',
        label: 'CMS Medinfo & Publikasi',
        codeBadge: 'CMS MEDINFO',
        isCurrent: true,
      },
    ];
  }

  if (activeTab === 'home') {
    return [
      rootCrumb,
      {
        id: 'public-org-info',
        label: 'Beranda Informasi Organisasi HIMAKA',
        codeBadge: 'INFO PUBLIK',
        isCurrent: true,
      },
    ];
  }

  return [];
}

export function normalizeHimakaInformatikaState(state: ProtoState): ProtoState {
  const seed = createInitialSeedState();
  const hasLegacyKomunikasi =
    state.medinfo?.organizationName?.includes('Komunikasi') ||
    state.organizationProfile?.fullName?.includes('Komunikasi') ||
    state.events?.some(
      (e) =>
        e.title.includes('Komunikasi') || e.location.includes('Komunikasi'),
    );

  const needs2026RosterMigration =
    state.cabinetPeriods?.[0]?.chairpersonNim !== '241110051';

  const needs2026DateMigration =
    state.events?.[0]?.date?.includes('2025') ||
    state.cabinetPeriods?.[0]?.prokers?.[0]?.month?.includes('2025');

  const seedEventsById = new Map(seed.events.map((e) => [e.id, e]));
  const seedNewsById = new Map((seed.newsArticles || []).map((n) => [n.id, n]));

  let nextCabinetPeriods = state.cabinetPeriods || seed.cabinetPeriods;
  if (
    (needs2026RosterMigration || needs2026DateMigration) &&
    seed.cabinetPeriods
  ) {
    const seedCurrentCabinet = seed.cabinetPeriods[0];
    const existingCurrentCabinet = state.cabinetPeriods?.[0];
    const seedProkerById = new Map(
      seedCurrentCabinet.prokers.map((p) => [p.id, p]),
    );
    const mergedProkers = existingCurrentCabinet?.prokers?.length
      ? existingCurrentCabinet.prokers.map((p) => seedProkerById.get(p.id) || p)
      : seedCurrentCabinet.prokers;

    nextCabinetPeriods = [
      {
        ...seedCurrentCabinet,
        prokers: mergedProkers,
        members: needs2026RosterMigration
          ? seedCurrentCabinet.members
          : existingCurrentCabinet?.members || seedCurrentCabinet.members,
      },
      ...seed.cabinetPeriods.slice(1),
    ];
  }

  const nextEvents = (state.events || seed.events).map((ev) => {
    const seedEv = seedEventsById.get(ev.id);
    if (!seedEv || (!hasLegacyKomunikasi && !needs2026DateMigration)) {
      return ev;
    }
    return {
      ...seedEv,
      isOpen: ev.isOpen,
      tiers: ev.tiers.map((t) => {
        const seedTier = seedEv.tiers.find((st) => st.id === t.id);
        return seedTier
          ? { ...seedTier, quota: t.quota, price: t.price, sold: t.sold }
          : t;
      }),
    };
  });

  const nextNewsArticles = (state.newsArticles || seed.newsArticles || []).map(
    (art) => {
      const seedArt = seedNewsById.get(art.id);
      if (seedArt && (hasLegacyKomunikasi || needs2026DateMigration)) {
        return { ...seedArt, isLeadStory: art.isLeadStory };
      }
      return art;
    },
  );

  const normalizedTransactions = (state.transactions || seed.transactions).map(
    (tx) => {
      const seedEv = seedEventsById.get(tx.eventId);
      const isHadir =
        tx.attendanceStatus === 'HADIR' ||
        Boolean(tx.scannedAt) ||
        (tx.scanCount ?? 0) > 0;
      return {
        ...tx,
        eventTitle:
          seedEv && (hasLegacyKomunikasi || needs2026DateMigration)
            ? seedEv.title
            : tx.eventTitle,
        attendanceStatus: (isHadir ? 'HADIR' : 'BELUM_HADIR') as
          | 'HADIR'
          | 'BELUM_HADIR',
      };
    },
  );

  if (!hasLegacyKomunikasi) {
    return {
      ...state,
      events: nextEvents,
      transactions: normalizedTransactions,
      newsArticles: nextNewsArticles,
      medinfo: needs2026DateMigration
        ? {
            ...state.medinfo,
            period: seed.medinfo.period,
          }
        : state.medinfo,
      organizationProfile: needs2026RosterMigration
        ? seed.organizationProfile
        : state.organizationProfile || seed.organizationProfile,
      cabinetPeriods: nextCabinetPeriods,
    };
  }

  return {
    ...state,
    organizationProfile: seed.organizationProfile,
    cabinetPeriods: seed.cabinetPeriods,
    newsArticles: seed.newsArticles,
    medinfo: {
      ...state.medinfo,
      organizationName: seed.medinfo.organizationName,
      period: seed.medinfo.period,
    },
    events: nextEvents,
    transactions: state.transactions.map((tx) => {
      const seedEv = seedEventsById.get(tx.eventId);
      return {
        ...tx,
        eventTitle: seedEv
          ? seedEv.title
          : tx.eventTitle.replace(/Ilmu Komunikasi/gi, 'Informatika'),
        faculty: tx.faculty.replace(/Ilmu Komunikasi/gi, 'Informatika'),
      };
    }),
    users: (state.users || []).map((u) => ({
      ...u,
      faculty: u.faculty.replace(/Ilmu Komunikasi/gi, 'Informatika'),
    })),
    currentUser: state.currentUser
      ? {
          ...state.currentUser,
          faculty: state.currentUser.faculty.replace(
            /Ilmu Komunikasi/gi,
            'Informatika',
          ),
        }
      : null,
    documentationGallery:
      Array.isArray(state.documentationGallery) &&
      state.documentationGallery.length > 0
        ? state.documentationGallery
        : seed.documentationGallery,
  };
}

export interface MedinfoMediaPreset {
  id: string;
  label: string;
  imageUrl: string;
  defaultCaption: string;
}

export const PRESET_MEDINFO_MEDIA_ASSETS: MedinfoMediaPreset[] = [
  {
    id: 'preset-semnas',
    label: 'Auditorium Seminar Nasional Informatika & AI',
    imageUrl: '/images/dokumentasi/dok-seminar-auditorium.svg',
    defaultCaption:
      'Visualisasi & dokumentasi kegiatan akademik di Auditorium Kampus 3 UMBY.',
  },
  {
    id: 'preset-hackathon',
    label: 'Panggung Pitching & Hackathon IT-Fest',
    imageUrl: '/images/dokumentasi/dok-commfest-pitching.svg',
    defaultCaption:
      'Dokumentasi sesi demo aplikasi dan presentasi inovasi perangkat lunak mahasiswa Informatika.',
  },
  {
    id: 'preset-lab',
    label: 'Laboratorium Komputasi, Cloud & DevSecOps',
    imageUrl: '/images/dokumentasi/dok-studio-broadcasting.svg',
    defaultCaption:
      'Suasana praktikum rekayasa perangkat lunak, jaringan, dan cloud di Laboratorium Komputasi UMBY.',
  },
  {
    id: 'preset-kunjungan',
    label: 'Kunjungan Industri Teknologi & Klinik Data',
    imageUrl: '/images/dokumentasi/dok-kunjungan-redaksi.svg',
    defaultCaption:
      'Dokumentasi delegasi mahasiswa Informatika UMBY dalam diskusi arsitektur sistem bersama praktisi industri.',
  },
  {
    id: 'preset-sosmas',
    label: 'Desa Mitra Digital & Katalog Web UMKM',
    imageUrl: '/images/dokumentasi/dok-desa-mitra-umkm.svg',
    defaultCaption:
      'Pendampingan digitalisasi katalog web UMKM lokal oleh Divisi Sosial & Pengabdian Masyarakat HIMAKA.',
  },
  {
    id: 'preset-pleno',
    label: 'Sidang Pleno & Rapat Kerja Pengurus HIMAKA',
    imageUrl: '/images/dokumentasi/dok-sidang-pleno-bph.svg',
    defaultCaption:
      'Sidang evaluasi proker dan transparansi anggaran kepengurusan HIMAKA UMBY.',
  },
  {
    id: 'preset-ekshibisi',
    label: 'Ekshibisi Karya Software & IoT Mahasiswa',
    imageUrl: '/images/dokumentasi/dok-pameran-fotografi.svg',
    defaultCaption:
      'Pameran purwarupa IoT dan aplikasi karya mahasiswa Program Studi Informatika UMBY.',
  },
  {
    id: 'preset-sekre',
    label: 'Sekretariat HIMAKA & Koordinasi Divisi',
    imageUrl: '/images/dokumentasi/dok-sekretariat-himaka.svg',
    defaultCaption:
      'Dokumentasi koordinasi kepanitiaan di Gedung Kemahasiswaan Kampus 3 UMBY.',
  },
];

export interface MedinfoUpcomingProkerInput {
  periodYear?: string;
  name: string;
  division: HimakaDivisionName;
  month: string;
  category: string;
  status?: ProkerStatus;
  summary: string;
  achievementOrTarget: string;
  personInCharge: string;
  imageUrl: string;
  imageCaption: string;
  alsoPostAnnouncement?: boolean;
}

export function publishUpcomingProkerByMedinfo(
  state: ProtoState,
  input: MedinfoUpcomingProkerInput,
): {
  nextState: ProtoState;
  createdProker: HimakaProkerItem;
} {
  const targetPeriod =
    input.periodYear || state.cabinetPeriods?.[0]?.periodYear || '2025/2026';
  const existingPeriods =
    state.cabinetPeriods || createInitialSeedState().cabinetPeriods || [];
  const activeCabinet =
    existingPeriods.find((p) => p.periodYear === targetPeriod) ||
    existingPeriods[0];
  const nextNumber = (activeCabinet?.prokers.length || 8) + 1;
  const paddedNum = String(nextNumber).padStart(2, '0');
  const yearShort = targetPeriod.slice(2, 4) || '25';
  const code = `PRK-${yearShort}${paddedNum}`;
  const archiveCode = `POSTER-${code}`;

  const createdProker: HimakaProkerItem = {
    id: `prk-${yearShort}-${paddedNum}-${Date.now()}`,
    code,
    periodYear: targetPeriod,
    name: input.name.trim(),
    division: input.division,
    month: input.month.trim(),
    category: input.category.trim() || 'Program Kerja Divisi',
    status: input.status || 'AKAN DATANG',
    summary: input.summary.trim(),
    achievementOrTarget: input.achievementOrTarget.trim(),
    personInCharge: input.personInCharge.trim(),
    imageUrl:
      input.imageUrl.trim() || '/images/dokumentasi/dok-seminar-auditorium.svg',
    imageCaption:
      input.imageCaption.trim() ||
      `Poster & media publikasi resmi proker ${input.name.trim()} oleh Divisi Medinfo HIMAKA UMBY.`,
    archiveCode,
  };

  const nextCabinetPeriods = existingPeriods.map((period) => {
    if (period.periodYear !== targetPeriod) return period;
    return {
      ...period,
      prokers: [createdProker, ...period.prokers],
    };
  });

  const existingGallery = getHimakaDocumentationGallery(
    state.documentationGallery,
  );
  const preProkerGalleryItem: HimakaDocumentationItem = {
    id: `gal-pre-${Date.now()}`,
    archiveCode,
    title: `[Poster & Info Proker Kedepan] ${createdProker.name}`,
    category: `Pre-Proker · ${createdProker.category}`,
    periodYear: targetPeriod,
    date: createdProker.month,
    location: 'Kampus 3 UMBY, Yogyakarta',
    division: createdProker.division,
    photographer: `${createdProker.personInCharge} / Tim Medinfo`,
    imageUrl: createdProker.imageUrl!,
    caption: `${createdProker.summary} — Target: ${createdProker.achievementOrTarget}`,
    relatedProkerId: createdProker.id,
    mediaPhase: 'PRE_PROKER',
  };

  const nextAnnouncements = input.alsoPostAnnouncement
    ? [
        {
          id: `ann-prk-${Date.now()}`,
          title: `[Info Proker Kedepan] ${createdProker.name} (${createdProker.month})`,
          category: 'Umum' as const,
          content: `${createdProker.summary} Penanggung Jawab: ${createdProker.personInCharge}. Target: ${createdProker.achievementOrTarget}`,
          updatedAt: 'Baru saja dipublikasikan Medinfo',
          isActive: true,
          imageUrl: createdProker.imageUrl,
          imageCaption: createdProker.imageCaption,
        },
        ...state.medinfo.announcements,
      ]
    : state.medinfo.announcements;

  return {
    createdProker,
    nextState: {
      ...state,
      cabinetPeriods: nextCabinetPeriods,
      documentationGallery: [preProkerGalleryItem, ...existingGallery],
      medinfo: {
        ...state.medinfo,
        announcements: nextAnnouncements,
      },
    },
  };
}

export interface MedinfoAfterProkerDocInput {
  prokerId: string;
  title: string;
  date: string;
  location: string;
  photographer: string;
  imageUrl: string;
  caption: string;
  markProkerCompleted?: boolean;
  updatedAchievement?: string;
  alsoPublishNews?: boolean;
}

export function uploadAfterProkerDocumentationByMedinfo(
  state: ProtoState,
  input: MedinfoAfterProkerDocInput,
): {
  nextState: ProtoState;
  createdDoc: HimakaDocumentationItem;
  createdNews?: HimakaNewsArticle;
} {
  const existingPeriods =
    state.cabinetPeriods || createInitialSeedState().cabinetPeriods || [];
  let matchedProker: HimakaProkerItem | undefined;

  for (const period of existingPeriods) {
    const found = period.prokers.find((p) => p.id === input.prokerId);
    if (found) {
      matchedProker = found;
      break;
    }
  }

  const existingGallery = getHimakaDocumentationGallery(
    state.documentationGallery,
  );
  const nextDocNumber = existingGallery.length + 1;
  const archiveCode = matchedProker
    ? `DOK-AFTER-${matchedProker.code}`
    : `DOK-HMK-25${String(nextDocNumber).padStart(2, '0')}`;

  const createdDoc: HimakaDocumentationItem = {
    id: `gal-after-${Date.now()}`,
    archiveCode,
    title: input.title.trim(),
    category: matchedProker
      ? `After-Proker · ${matchedProker.category}`
      : 'Dokumentasi After-Proker',
    periodYear: matchedProker?.periodYear || '2025/2026',
    date: input.date.trim() || matchedProker?.month || 'Oktober 2026',
    location: input.location.trim() || 'Kampus 3 UMBY, Yogyakarta',
    division: matchedProker?.division || 'Divisi Media & Informasi (Medinfo)',
    photographer: input.photographer.trim() || 'Tim Dokumentasi Medinfo',
    imageUrl:
      input.imageUrl.trim() || '/images/dokumentasi/dok-kunjungan-redaksi.svg',
    caption: input.caption.trim(),
    relatedProkerId: input.prokerId,
    relatedEventId: matchedProker?.ticketingEventId,
    mediaPhase: 'AFTER_PROKER',
  };

  const nextCabinetPeriods = existingPeriods.map((period) => ({
    ...period,
    prokers: period.prokers.map((prk) => {
      if (prk.id !== input.prokerId) return prk;
      return {
        ...prk,
        status: input.markProkerCompleted ? 'TERLAKSANA' : prk.status,
        achievementOrTarget:
          input.updatedAchievement && input.updatedAchievement.trim().length > 0
            ? input.updatedAchievement.trim()
            : prk.achievementOrTarget,
        imageUrl: createdDoc.imageUrl,
        imageCaption: createdDoc.caption,
        archiveCode: createdDoc.archiveCode,
      };
    }),
  }));

  let createdNews: HimakaNewsArticle | undefined;
  const existingNews = state.newsArticles || [];

  if (input.alsoPublishNews) {
    const newsNum = existingNews.length + 1;
    createdNews = {
      id: `news-after-${Date.now()}`,
      code: `WARTA-HMK-250${newsNum}`,
      title: createdDoc.title,
      category: 'Jurnalistik & Medinfo',
      publishedAt: createdDoc.date,
      author: `${createdDoc.photographer} (Redaksi Medinfo)`,
      division: createdDoc.division,
      readTimeMinutes: 3,
      location: createdDoc.location,
      isLeadStory: true,
      summary: createdDoc.caption,
      bodyParagraphs: [
        `YOGYAKARTA — Divisi Media & Informasi (Medinfo) HIMAKA UMBY merilis dokumentasi resmi pasca pelaksanaan program kerja "${
          matchedProker?.name || createdDoc.title
        }" yang diselenggarakan di ${createdDoc.location} pada ${
          createdDoc.date
        }.`,
        createdDoc.caption,
        input.updatedAchievement && input.updatedAchievement.trim().length > 0
          ? `Realisasi & Capaian Program Kerja: ${input.updatedAchievement.trim()}`
          : `Kegiatan ini terlaksana sesuai rencana kerja satu periode HIMAKA UMBY dan terdokumentasi di dalam arsip visual resmi himpunan.`,
      ],
      keyHighlights: [
        `Kode Arsip Dokumentasi: ${createdDoc.archiveCode}`,
        `Divisi Pelaksana: ${createdDoc.division}`,
        input.updatedAchievement?.trim() ||
          matchedProker?.achievementOrTarget ||
          'Dokumentasi resmi after-proker telah terverifikasi Medinfo.',
      ],
      relatedEventId: matchedProker?.ticketingEventId,
      imageUrl: createdDoc.imageUrl,
      imageCaption: createdDoc.caption,
      photographer: createdDoc.photographer,
      archiveCode: createdDoc.archiveCode,
    };
  }

  return {
    createdDoc,
    createdNews,
    nextState: {
      ...state,
      cabinetPeriods: nextCabinetPeriods,
      documentationGallery: [createdDoc, ...existingGallery],
      newsArticles: createdNews
        ? [
            createdNews,
            ...existingNews.map((n) => ({ ...n, isLeadStory: false })),
          ]
        : existingNews,
    },
  };
}

export interface MedinfoNewsInput {
  title: string;
  category: NewsCategory;
  publishedAt?: string;
  author: string;
  division: string;
  location: string;
  summary: string;
  bodyText?: string;
  imageUrl: string;
  imageCaption: string;
  photographer?: string;
  isLeadStory?: boolean;
}

export function publishStandaloneNewsByMedinfo(
  state: ProtoState,
  input: MedinfoNewsInput,
): {
  nextState: ProtoState;
  createdNews: HimakaNewsArticle;
} {
  const existingNews = state.newsArticles || [];
  const nextNum = existingNews.length + 1;
  const code = `WARTA-HMK-25${String(nextNum).padStart(2, '0')}`;
  const archiveCode = `DOK-WARTA-25${String(nextNum).padStart(2, '0')}`;
  const makeLead = input.isLeadStory ?? true;

  const paragraphs = input.bodyText
    ? input.bodyText
        .split('\n')
        .map((p) => p.trim())
        .filter(Boolean)
    : [];

  const bodyParagraphs =
    paragraphs.length > 0
      ? paragraphs
      : [
          `YOGYAKARTA — ${input.summary.trim()}`,
          `Kegiatan ini diselenggarakan oleh ${input.division.trim()} bertempat di ${input.location.trim()} dan didokumentasikan secara resmi oleh Divisi Media & Informasi (Medinfo) HIMAKA UMBY.`,
        ];

  const createdNews: HimakaNewsArticle = {
    id: `news-medinfo-${Date.now()}`,
    code,
    title: input.title.trim(),
    category: input.category,
    publishedAt: input.publishedAt?.trim() || 'Baru saja diterbitkan',
    author: input.author.trim() || 'Tim Redaksi Medinfo HIMAKA',
    division: input.division.trim() || 'Divisi Media & Informasi (Medinfo)',
    readTimeMinutes: Math.max(2, Math.min(6, bodyParagraphs.length + 1)),
    location: input.location.trim() || 'Kampus 3 UMBY, Yogyakarta',
    isLeadStory: makeLead,
    summary: input.summary.trim(),
    bodyParagraphs,
    keyHighlights: [
      `Diterbitkan oleh: ${input.author.trim() || 'Redaksi Medinfo'} (${input.division.trim()})`,
      `Lokasi Kegiatan: ${input.location.trim() || 'Kampus 3 UMBY'}`,
      `Kode Arsip Media: ${archiveCode}`,
    ],
    imageUrl:
      input.imageUrl.trim() || '/images/dokumentasi/dok-kunjungan-redaksi.svg',
    imageCaption: input.imageCaption.trim() || input.summary.trim(),
    photographer: input.photographer?.trim() || input.author.trim(),
    archiveCode,
  };

  const updatedExisting = makeLead
    ? existingNews.map((n) => ({ ...n, isLeadStory: false }))
    : existingNews;

  return {
    createdNews,
    nextState: {
      ...state,
      newsArticles: [createdNews, ...updatedExisting],
    },
  };
}

export function deleteNewsArticleByMedinfo(
  state: ProtoState,
  newsId: string,
): ProtoState {
  const existingNews = state.newsArticles || [];
  const filtered = existingNews.filter((n) => n.id !== newsId);

  // Ensure at least one article is marked as lead story if any remain
  const hasLead = filtered.some((n) => n.isLeadStory);
  const normalizedNews =
    filtered.length > 0 && !hasLead
      ? filtered.map((n, idx) => (idx === 0 ? { ...n, isLeadStory: true } : n))
      : filtered;

  return {
    ...state,
    newsArticles: normalizedNews,
  };
}

export function deleteDocumentationMediaByMedinfo(
  state: ProtoState,
  docId: string,
): ProtoState {
  const existingGallery = getHimakaDocumentationGallery(
    state.documentationGallery,
  );
  const filteredGallery = existingGallery.filter((d) => d.id !== docId);

  return {
    ...state,
    documentationGallery: filteredGallery,
  };
}

export function deleteProkerByMedinfo(
  state: ProtoState,
  prokerId: string,
): ProtoState {
  const existingPeriods = state.cabinetPeriods || [];
  const nextCabinetPeriods = existingPeriods.map((period) => ({
    ...period,
    prokers: period.prokers.filter((p) => p.id !== prokerId),
  }));

  const existingGallery = getHimakaDocumentationGallery(
    state.documentationGallery,
  );
  const nextGallery = existingGallery.filter(
    (d) => d.relatedProkerId !== prokerId && d.id !== prokerId,
  );

  return {
    ...state,
    cabinetPeriods: nextCabinetPeriods,
    documentationGallery: nextGallery,
  };
}

// --- PENGELOLAAN PENGURUS HIMAKA 2026 (TAMBAH, EDIT, HAPUS & FOTO PROFIL) ---

export interface CabinetMemberInput {
  periodYear?: string;
  name: string;
  nim: string;
  cohortYear: string;
  roleTitle: string;
  division: HimakaDivisionName;
  concentration?: string;
  mainProker?: string;
  avatarUrl?: string;
}

export function addCabinetMemberByAdmin(
  state: ProtoState,
  input: CabinetMemberInput,
): {
  nextState: ProtoState;
  createdMember: HimakaPeriodMember;
} {
  const targetPeriod =
    input.periodYear || state.cabinetPeriods?.[0]?.periodYear || '2025/2026';
  const existingPeriods =
    state.cabinetPeriods || createInitialSeedState().cabinetPeriods || [];

  const createdMember: HimakaPeriodMember = {
    id: `mem-26-custom-${Date.now()}`,
    periodYear: targetPeriod,
    name: input.name.trim(),
    nim: input.nim.trim(),
    cohortYear:
      input.cohortYear.trim() ||
      (input.nim.trim().startsWith('24') ? '2024' : '2025'),
    roleTitle: input.roleTitle.trim() || 'Anggota',
    division: input.division,
    concentration: input.concentration?.trim() || 'Rekayasa Perangkat Lunak',
    mainProker:
      input.mainProker?.trim() ||
      `Program Kerja ${input.division} HIMAKA UMBY 2026`,
    avatarUrl: input.avatarUrl?.trim() ? input.avatarUrl.trim() : undefined,
  };

  const nextCabinetPeriods = existingPeriods.map((period) => {
    if (period.periodYear !== targetPeriod) return period;
    return {
      ...period,
      members: [...period.members, createdMember],
    };
  });

  return {
    createdMember,
    nextState: {
      ...state,
      cabinetPeriods: nextCabinetPeriods,
    },
  };
}

export function updateCabinetMemberByAdmin(
  state: ProtoState,
  memberId: string,
  input: Partial<CabinetMemberInput>,
): ProtoState {
  const existingPeriods = state.cabinetPeriods || [];
  const nextCabinetPeriods = existingPeriods.map((period) => ({
    ...period,
    members: period.members.map((mem) => {
      if (mem.id !== memberId) return mem;
      return {
        ...mem,
        name: input.name !== undefined ? input.name.trim() : mem.name,
        nim: input.nim !== undefined ? input.nim.trim() : mem.nim,
        cohortYear:
          input.cohortYear !== undefined
            ? input.cohortYear.trim()
            : mem.cohortYear,
        roleTitle:
          input.roleTitle !== undefined
            ? input.roleTitle.trim()
            : mem.roleTitle,
        division: input.division !== undefined ? input.division : mem.division,
        concentration:
          input.concentration !== undefined
            ? input.concentration.trim()
            : mem.concentration,
        mainProker:
          input.mainProker !== undefined
            ? input.mainProker.trim()
            : mem.mainProker,
        avatarUrl:
          input.avatarUrl !== undefined
            ? input.avatarUrl.trim() || undefined
            : mem.avatarUrl,
      };
    }),
  }));

  return {
    ...state,
    cabinetPeriods: nextCabinetPeriods,
  };
}

export function deleteCabinetMemberByAdmin(
  state: ProtoState,
  memberId: string,
): ProtoState {
  const existingPeriods = state.cabinetPeriods || [];
  const nextCabinetPeriods = existingPeriods.map((period) => {
    if (period.members.length <= 1) return period;
    return {
      ...period,
      members: period.members.filter((m) => m.id !== memberId),
    };
  });

  return {
    ...state,
    cabinetPeriods: nextCabinetPeriods,
  };
}

// --- FITUR EDIT PROKER & BERITA YANG SUDAH TAYANG ---

export function updateProkerByMedinfo(
  state: ProtoState,
  prokerId: string,
  input: Partial<MedinfoUpcomingProkerInput>,
): ProtoState {
  const existingPeriods = state.cabinetPeriods || [];
  const nextCabinetPeriods = existingPeriods.map((period) => ({
    ...period,
    prokers: period.prokers.map((prk) => {
      if (prk.id !== prokerId) return prk;
      return {
        ...prk,
        name: input.name !== undefined ? input.name.trim() : prk.name,
        division: input.division !== undefined ? input.division : prk.division,
        month: input.month !== undefined ? input.month.trim() : prk.month,
        category:
          input.category !== undefined ? input.category.trim() : prk.category,
        status: input.status !== undefined ? input.status : prk.status,
        summary:
          input.summary !== undefined ? input.summary.trim() : prk.summary,
        achievementOrTarget:
          input.achievementOrTarget !== undefined
            ? input.achievementOrTarget.trim()
            : prk.achievementOrTarget,
        personInCharge:
          input.personInCharge !== undefined
            ? input.personInCharge.trim()
            : prk.personInCharge,
        imageUrl:
          input.imageUrl !== undefined ? input.imageUrl.trim() : prk.imageUrl,
        imageCaption:
          input.imageCaption !== undefined
            ? input.imageCaption.trim()
            : prk.imageCaption,
      };
    }),
  }));

  return {
    ...state,
    cabinetPeriods: nextCabinetPeriods,
  };
}

export function updateNewsArticleByMedinfo(
  state: ProtoState,
  newsId: string,
  input: Partial<MedinfoNewsInput>,
): ProtoState {
  const existingNews = state.newsArticles || [];
  const nextNews = existingNews.map((art) => {
    if (art.id !== newsId) return art;
    const nextParagraphs =
      input.bodyText !== undefined
        ? input.bodyText
            .split('\n')
            .map((p) => p.trim())
            .filter(Boolean)
        : art.bodyParagraphs;
    return {
      ...art,
      title: input.title !== undefined ? input.title.trim() : art.title,
      category: input.category !== undefined ? input.category : art.category,
      publishedAt:
        input.publishedAt !== undefined
          ? input.publishedAt.trim()
          : art.publishedAt,
      author: input.author !== undefined ? input.author.trim() : art.author,
      division:
        input.division !== undefined ? input.division.trim() : art.division,
      location:
        input.location !== undefined ? input.location.trim() : art.location,
      summary: input.summary !== undefined ? input.summary.trim() : art.summary,
      bodyParagraphs:
        nextParagraphs.length > 0 ? nextParagraphs : art.bodyParagraphs,
      imageUrl:
        input.imageUrl !== undefined ? input.imageUrl.trim() : art.imageUrl,
      imageCaption:
        input.imageCaption !== undefined
          ? input.imageCaption.trim()
          : art.imageCaption,
    };
  });

  return {
    ...state,
    newsArticles: nextNews,
  };
}

// --- BUAT ACARA BARU E-TICKETING & EDIT KUOTA / DETAIL ACARA ---

export interface CreateAcademicEventInput {
  code?: string;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  speakerOrHost: string;
  skpPoints: string;
  description: string;
  imageUrl?: string;
  imageCaption?: string;
  tierName: string;
  tierPrice: number;
  tierQuota: number;
  tierMode?: RegistrationMode;
  alsoCreateProker?: boolean;
  prokerDivision?: HimakaDivisionName;
  prokerPic?: string;
}

export function createAcademicEventByAdmin(
  state: ProtoState,
  input: CreateAcademicEventInput,
): {
  nextState: ProtoState;
  createdEvent: AcademicEvent;
} {
  const nextIdx = state.events.length + 1;
  const code =
    input.code?.trim().toUpperCase() ||
    `EVT-26${String(nextIdx).padStart(2, '0')}`;
  const eventId = `evt-2026-${Date.now()}`;
  const tierId = `tier-${Date.now()}`;
  const quota = Math.max(1, Math.round(Number(input.tierQuota) || 50));
  const price = Math.max(0, Math.round(Number(input.tierPrice) || 0));

  const createdEvent: AcademicEvent = {
    id: eventId,
    code,
    title: input.title.trim(),
    category: input.category.trim() || 'Kegiatan Akademik',
    date: input.date.trim() || 'Desember 2026',
    time: input.time.trim() || '09:00 – 15:00 WIB',
    location: input.location.trim() || 'Auditorium Kampus 3 UMBY',
    speakerOrHost: input.speakerOrHost.trim() || 'Narasumber & Panitia HIMAKA',
    skpPoints: input.skpPoints.trim() || '3 SKP Akademik',
    description: input.description.trim(),
    isOpen: true,
    imageUrl:
      input.imageUrl?.trim() ||
      '/images/dokumentasi/dok-seminar-auditorium.svg',
    imageCaption:
      input.imageCaption?.trim() ||
      `Dokumentasi & publikasi resmi acara ${input.title.trim()} HIMAKA UMBY 2026.`,
    tiers: [
      {
        id: tierId,
        name: input.tierName.trim() || 'Tiket Peserta Reguler',
        price,
        quota,
        sold: 0,
        mode: input.tierMode || 'individu',
        maxMembers: input.tierMode === 'tim' ? 3 : undefined,
        isVipOrEarlyBird: false,
        benefits: [
          `Akses Penuh Kegiatan ${input.title.trim()}`,
          `E-Sertifikat Resmi (${input.skpPoints.trim() || '3 SKP'}) Otomatis Setelah Scan Hadir`,
          'Materi Digital & Konsumsi Peserta',
        ],
      },
    ],
  };

  let nextCabinetPeriods = state.cabinetPeriods || [];
  if (input.alsoCreateProker && nextCabinetPeriods.length > 0) {
    const targetPeriod = nextCabinetPeriods[0].periodYear;
    const prkNum = nextCabinetPeriods[0].prokers.length + 1;
    const newProker: HimakaProkerItem = {
      id: `prk-evt-${Date.now()}`,
      code: `PRK-26${String(prkNum).padStart(2, '0')}`,
      periodYear: targetPeriod,
      name: createdEvent.title,
      division:
        input.prokerDivision ||
        'Divisi PKM (Pengembangan Kreativitas Mahasiswa)',
      month: createdEvent.date,
      category: `${createdEvent.category} (Fitur Ticketing)`,
      status: 'BERJALAN',
      summary: createdEvent.description,
      achievementOrTarget: `Kuota ${quota} peserta (${createdEvent.skpPoints}). Pendaftaran e-ticketing dibuka.`,
      personInCharge:
        input.prokerPic?.trim() || 'Panitia Pelaksana HIMAKA 2026',
      ticketingEventId: createdEvent.id,
      imageUrl: createdEvent.imageUrl,
      imageCaption: createdEvent.imageCaption,
      archiveCode: `DOK-${createdEvent.code}`,
    };

    nextCabinetPeriods = nextCabinetPeriods.map((period, idx) =>
      idx === 0
        ? { ...period, prokers: [newProker, ...period.prokers] }
        : period,
    );
  }

  return {
    createdEvent,
    nextState: {
      ...state,
      events: [createdEvent, ...state.events],
      cabinetPeriods: nextCabinetPeriods,
    },
  };
}

export interface UpdateAcademicEventInput {
  title?: string;
  category?: string;
  date?: string;
  time?: string;
  location?: string;
  speakerOrHost?: string;
  skpPoints?: string;
  description?: string;
  isOpen?: boolean;
  tierUpdates?: {
    tierId: string;
    name?: string;
    price?: number;
    quota?: number;
  }[];
}

export function updateAcademicEventByAdmin(
  state: ProtoState,
  eventId: string,
  input: UpdateAcademicEventInput,
): ProtoState {
  const nextEvents = state.events.map((ev) => {
    if (ev.id !== eventId) return ev;
    const nextTiers = ev.tiers.map((tier) => {
      const match = input.tierUpdates?.find((u) => u.tierId === tier.id);
      if (!match) return tier;
      const nextQuota =
        match.quota !== undefined
          ? Math.max(tier.sold, Math.round(Number(match.quota)))
          : tier.quota;
      const nextPrice =
        match.price !== undefined
          ? Math.max(0, Math.round(Number(match.price)))
          : tier.price;
      return {
        ...tier,
        name: match.name !== undefined ? match.name.trim() : tier.name,
        quota: nextQuota,
        price: nextPrice,
      };
    });

    return {
      ...ev,
      title: input.title !== undefined ? input.title.trim() : ev.title,
      category:
        input.category !== undefined ? input.category.trim() : ev.category,
      date: input.date !== undefined ? input.date.trim() : ev.date,
      time: input.time !== undefined ? input.time.trim() : ev.time,
      location:
        input.location !== undefined ? input.location.trim() : ev.location,
      speakerOrHost:
        input.speakerOrHost !== undefined
          ? input.speakerOrHost.trim()
          : ev.speakerOrHost,
      skpPoints:
        input.skpPoints !== undefined ? input.skpPoints.trim() : ev.skpPoints,
      description:
        input.description !== undefined
          ? input.description.trim()
          : ev.description,
      isOpen: input.isOpen !== undefined ? input.isOpen : ev.isOpen,
      tiers: nextTiers,
    };
  });

  return {
    ...state,
    events: nextEvents,
  };
}

// --- PENERBITAN E-SERTIFIKAT OTOMATIS SETELAH SCAN HADIR ---

export interface HimakaCertificateMetadata {
  certificateNumber: string;
  ticketCode: string;
  transactionId: string;
  participantName: string;
  nim: string;
  faculty: string;
  eventTitle: string;
  tierName: string;
  eventDate: string;
  eventLocation: string;
  skpPoints: string;
  scannedAt: string;
  chairpersonName: string;
  chairpersonNim: string;
  advisorName: string;
  issuedYear: string;
}

export function isTicketMarkedHadir(tx: Transaction): boolean {
  return (
    tx.status === 'LUNAS' &&
    (tx.attendanceStatus === 'HADIR' ||
      Boolean(tx.scannedAt) ||
      (tx.scanCount ?? 0) > 0)
  );
}

export function markTransactionHadir(
  state: ProtoState,
  txId: string,
  nowIso: string,
): ProtoState {
  const target = state.transactions.find((t) => t.id === txId);
  if (target?.status !== 'LUNAS') {
    return state;
  }
  const outcome = validateTicketScan(state, target.ticketCode, nowIso);
  return outcome.nextState;
}

export function isTransactionEligibleForCertificate(tx: Transaction): boolean {
  return isTicketMarkedHadir(tx);
}

export function getCertificateForTransaction(
  tx: Transaction,
  events?: AcademicEvent[],
  cabinet?: HimakaCabinetPeriod,
): HimakaCertificateMetadata | null {
  if (!isTicketMarkedHadir(tx)) {
    return null;
  }

  const matchedEvent = events?.find((e) => e.id === tx.eventId);
  const cleanSuffix = tx.ticketCode.replace(/[^A-Z0-9]/gi, '').slice(-5);

  return {
    certificateNumber: `CERT-HMK-2026-${cleanSuffix.toUpperCase()}`,
    ticketCode: tx.ticketCode,
    transactionId: tx.id,
    participantName: tx.participantName,
    nim: tx.nim,
    faculty: tx.faculty,
    eventTitle: matchedEvent?.title || tx.eventTitle,
    tierName: tx.tierName,
    eventDate: matchedEvent?.date || '15 November 2026',
    eventLocation:
      matchedEvent?.location || 'Auditorium Kampus 3 UMBY, Yogyakarta',
    skpPoints: matchedEvent?.skpPoints || '4 SKP Akademik',
    scannedAt: tx.scannedAt || 'Terverifikasi Hadir di Gate HIMAKA',
    chairpersonName: cabinet?.chairpersonName || 'Aziz Zaghul Ikhsanudin',
    chairpersonNim: cabinet?.chairpersonNim || '241110051',
    advisorName: cabinet?.advisorName || 'Dr. Eng. R. Raharjo, S.Kom., M.Cs.',
    issuedYear: '2026',
  };
}

function escapePdfText(raw: string): string {
  return raw
    .replace(/[^\x20-\x7E]/g, ' ')
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

/**
 * Generates a valid, self-contained Landscape A4 PDF-1.4 document string
 * representing the official HIMAKA UMBY E-Certificate for a HADIR participant.
 */
export function generateCertificatePdfString(
  cert: HimakaCertificateMetadata,
): string {
  const contentLines = [
    'q',
    // Page background tint
    '0.98 0.98 1.0 rg',
    '0 0 842 595 re f',
    // Outer institutional navy border
    '0.04 0.11 0.19 RG',
    '3 w',
    '28 28 786 539 re S',
    // Inner electric blue accent border
    '0.15 0.39 0.92 RG',
    '1 w',
    '36 36 770 523 re S',
    // Header banner bar
    '0.04 0.11 0.19 rg',
    '36 495 770 64 re f',
    'Q',
    'BT',
    '/F2 11 Tf',
    '0.75 0.78 1.0 rg',
    '56 534 Td',
    `(${escapePdfText(`HIMPUNAN MAHASISWA INFORMATIKA (HIMAKA) - PERIODE ${cert.issuedYear}`)}) Tj`,
    '/F2 15 Tf',
    '1 1 1 rg',
    '0 -20 Td',
    `(${escapePdfText('FAKULTAS TEKNOLOGI INFORMASI - UNIVERSITAS MERCU BUANA YOGYAKARTA')}) Tj`,
    'ET',
    // Certificate Serial & Attendance Badge on top-right
    'BT',
    '/F2 10 Tf',
    '1 1 1 rg',
    '595 534 Td',
    `(${escapePdfText(`NO. SERI: ${cert.certificateNumber}`)}) Tj`,
    '/F1 9 Tf',
    '0.65 0.95 0.80 rg',
    '0 -18 Td',
    `(${escapePdfText(`STATUS: HADIR (${cert.ticketCode})`)}) Tj`,
    'ET',
    // Certificate Main Heading
    'BT',
    '/F2 13 Tf',
    '0.11 0.31 0.85 rg',
    '245 448 Td',
    '(E-CERTIFICATE OF ACADEMIC PARTICIPATION) Tj',
    'ET',
    'BT',
    '/F1 11 Tf',
    '0.35 0.38 0.45 rg',
    '325 422 Td',
    '(Diberikan dengan bangga kepada:) Tj',
    'ET',
    // Participant Name & NIM
    'BT',
    '/F2 26 Tf',
    '0.04 0.11 0.19 rg',
    '120 380 Td',
    `(${escapePdfText(cert.participantName)}) Tj`,
    '/F2 12 Tf',
    '0.25 0.28 0.35 rg',
    '0 -24 Td',
    `(${escapePdfText(`NIM: ${cert.nim}   |   Program Studi: ${cert.faculty}`)}) Tj`,
    'ET',
    // Event Citation Box
    'q',
    '0.95 0.96 0.99 rg',
    '0.80 0.84 0.92 RG',
    '1 w',
    '80 215 682 118 re B',
    'Q',
    'BT',
    '/F1 11 Tf',
    '0.25 0.28 0.35 rg',
    '104 306 Td',
    `(${escapePdfText(`Atas partisipasi aktif dan kehadiran penuh (Status: HADIR) sebagai Peserta (${cert.tierName}) dalam kegiatan:`)}) Tj`,
    '/F2 15 Tf',
    '0.04 0.11 0.19 rg',
    '0 -26 Td',
    `(${escapePdfText(cert.eventTitle)}) Tj`,
    '/F1 11 Tf',
    '0.25 0.28 0.35 rg',
    '0 -24 Td',
    `(${escapePdfText(`Tanggal: ${cert.eventDate}   |   Lokasi: ${cert.eventLocation}`)}) Tj`,
    '/F2 11 Tf',
    '0.02 0.47 0.34 rg',
    '0 -22 Td',
    `(${escapePdfText(`KREDIT POIN KEAKTIFAN MAHASISWA: ${cert.skpPoints}   |   WAKTU CHECK-IN: ${cert.scannedAt}`)}) Tj`,
    'ET',
    // Signatures Footer
    'BT',
    '/F1 10 Tf',
    '0.35 0.38 0.45 rg',
    '90 155 Td',
    '(Mengetahui, Dosen Pembina HIMAKA UMBY) Tj',
    '/F2 11 Tf',
    '0.04 0.11 0.19 rg',
    '0 -48 Td',
    `(${escapePdfText(cert.advisorName)}) Tj`,
    '/F1 9 Tf',
    '0.35 0.38 0.45 rg',
    '0 -15 Td',
    '(Fakultas Teknologi Informasi UMBY) Tj',
    'ET',
    'BT',
    '/F1 10 Tf',
    '0.35 0.38 0.45 rg',
    '510 155 Td',
    `(${escapePdfText(`Yogyakarta, ${cert.eventDate}`)}) Tj`,
    '/F2 11 Tf',
    '0.04 0.11 0.19 rg',
    '0 -48 Td',
    `(${escapePdfText(cert.chairpersonName)}) Tj`,
    '/F1 9 Tf',
    '0.35 0.38 0.45 rg',
    '0 -15 Td',
    `(${escapePdfText(`Ketua Umum HIMAKA ${cert.issuedYear} - NIM ${cert.chairpersonNim}`)}) Tj`,
    'ET',
  ];

  const streamBody = contentLines.join('\n');
  const objects: string[] = [
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
    '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 842 595] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>\nendobj\n',
    '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n',
    '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n',
    `6 0 obj\n<< /Length ${streamBody.length} >>\nstream\n${streamBody}\nendstream\nendobj\n`,
  ];

  let pdf = '%PDF-1.4\n';
  const offsets: number[] = [0];
  for (const obj of objects) {
    offsets.push(pdf.length);
    pdf += obj;
  }

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';
  for (let i = 1; i <= objects.length; i++) {
    pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  return pdf;
}

export function generateCertificatePdfBytes(
  cert: HimakaCertificateMetadata,
): Uint8Array {
  const pdfString = generateCertificatePdfString(cert);
  const bytes = new Uint8Array(pdfString.length);
  for (let i = 0; i < pdfString.length; i++) {
    bytes[i] = pdfString.charCodeAt(i) & 0xff;
  }
  return bytes;
}

export function getCertificatePdfFilename(
  cert: HimakaCertificateMetadata,
): string {
  return `E-Certificate-${cert.certificateNumber}.pdf`;
}

export function triggerCertificatePdfDownload(
  cert: HimakaCertificateMetadata,
): string {
  const filename = getCertificatePdfFilename(cert);
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return filename;
  }
  const bytes = generateCertificatePdfBytes(cert);
  const blob = new Blob([bytes.buffer as ArrayBuffer], {
    type: 'application/pdf',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 3000);
  return filename;
}
