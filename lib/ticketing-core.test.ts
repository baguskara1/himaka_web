import test from 'node:test';
import assert from 'node:assert/strict';
import {
  STORAGE_KEY,
  formatRupiah,
  computeUniqueCode,
  calculateCheckoutTotal,
  validateRegistrationForm,
  validateTicketScan,
  approveTransaction,
  rejectTransaction,
  generateTransactionsCsv,
  createInitialSeedState,
  authenticateUser,
  registerNewUser,
  getCabinetByPeriod,
  filterPeriodMembers,
  filterPeriodProkers,
} from './ticketing-core';

test('STORAGE_KEY preserves himaka_proto_v2', () => {
  assert.equal(STORAGE_KEY, 'himaka_proto_v2');
});

test('formatRupiah formats Indonesian currency accurately', () => {
  assert.equal(formatRupiah(75000), 'Rp 75.000');
  assert.equal(formatRupiah(150102), 'Rp 150.102');
});

test('computeUniqueCode and calculateCheckoutTotal produce deterministic 3-digit unique codes', () => {
  const code = computeUniqueCode(5);
  assert.equal(code, 106);
  assert.equal(calculateCheckoutTotal(65000, code), 65106);
});

test('validateRegistrationForm catches missing fields and validates team mode', () => {
  const invalidIndividu = validateRegistrationForm({
    participantName: 'A',
    nim: '12',
    faculty: '',
    email: 'invalid-email',
    whatsapp: '12345',
    mode: 'individu',
  });
  assert.ok(invalidIndividu.participantName);
  assert.ok(invalidIndividu.nim);
  assert.ok(invalidIndividu.faculty);
  assert.ok(invalidIndividu.email);
  assert.ok(invalidIndividu.whatsapp);

  const validTeam = validateRegistrationForm({
    participantName: 'Raka Pratama',
    nim: '220710888',
    faculty: 'Informatika UMBY',
    email: 'raka@student.mercubuana-yogya.ac.id',
    whatsapp: '081234567890',
    mode: 'tim',
    teamName: 'Tim Sinergi',
    teamMembersText: 'Anggota 1\nAnggota 2',
  });
  assert.equal(Object.keys(validTeam).length, 0);
});

test('validateTicketScan enforces BOLEH MASUK, SUDAH PERNAH SCAN, and TIKET TIDAK VALID', () => {
  const seed = createInitialSeedState();

  // 1. Valid unpaid/unscanned LUNAS ticket HMK-2025-A01 -> BOLEH MASUK
  const firstScan = validateTicketScan(
    seed,
    'HMK-2025-A01',
    '2025-10-23 09:00 WIB',
  );
  assert.equal(firstScan.result.decision, 'BOLEH MASUK');
  assert.equal(firstScan.matchedTransaction?.scanCount, 1);

  // 2. Re-scan same ticket -> SUDAH PERNAH SCAN
  const secondScan = validateTicketScan(
    firstScan.nextState,
    'HMK-2025-A01',
    '2025-10-23 09:05 WIB',
  );
  assert.equal(secondScan.result.decision, 'SUDAH PERNAH SCAN');
  assert.equal(secondScan.matchedTransaction?.scanCount, 2);

  // 3. Scan PENDING ticket HMK-2025-B02 -> TIKET TIDAK VALID
  const pendingScan = validateTicketScan(
    seed,
    'HMK-2025-B02',
    '2025-10-23 09:10 WIB',
  );
  assert.equal(pendingScan.result.decision, 'TIKET TIDAK VALID');

  // 4. Scan unknown ticket -> TIKET TIDAK VALID
  const unknownScan = validateTicketScan(
    seed,
    'HMK-9999-ZZZ',
    '2025-10-23 09:12 WIB',
  );
  assert.equal(unknownScan.result.decision, 'TIKET TIDAK VALID');
});

test('approveTransaction and rejectTransaction update status and quota properly', () => {
  const seed = createInitialSeedState();
  const approved = approveTransaction(
    seed,
    'TRX-2025-0102',
    '2025-10-23 10:00 WIB',
  );
  const tx = approved.transactions.find((t) => t.id === 'TRX-2025-0102');
  assert.equal(tx?.status, 'LUNAS');

  const rejected = rejectTransaction(
    seed,
    'TRX-2025-0102',
    'Bukti tidak terbaca',
    '2025-10-23 10:05 WIB',
  );
  const rejectedTx = rejected.transactions.find(
    (t) => t.id === 'TRX-2025-0102',
  );
  assert.equal(rejectedTx?.status, 'DITOLAK');

  const commfest = rejected.events.find((e) => e.id === 'evt-commfest-2025');
  const teamTier = commfest?.tiers.find((t) => t.id === 'tier-commfest-tim');
  assert.equal(teamTier?.sold, 13); // decremented from 14 to 13
});

test('generateTransactionsCsv exports header and formatted transaction rows for current list', () => {
  const seed = createInitialSeedState();
  const csv = generateTransactionsCsv(seed.transactions);
  assert.ok(csv.includes('ID_Transaksi,Kode_Tiket'));
  assert.ok(csv.includes('Total_Rupiah,Status_Pembayaran,File_Bukti_Transfer'));
  assert.ok(csv.includes('TRX-2025-0101'));
  assert.ok(csv.includes('HMK-2025-A01'));
  assert.ok(csv.includes('Rp 110.101'));
  assert.ok(csv.includes('struk_bca_nadia_110101.jpg'));

  // Verify exporting filtered subset
  const lunasOnly = seed.transactions.filter((t) => t.status === 'LUNAS');
  const filteredCsv = generateTransactionsCsv(lunasOnly);
  const lines = filteredCsv.trim().split('\n');
  assert.equal(lines.length, lunasOnly.length + 1);
});

test('authenticateUser and registerNewUser validate credentials and new user registration', () => {
  const seed = createInitialSeedState();
  const users = seed.users || [];

  // Login with existing NIM
  const okLogin = authenticateUser(users, '220710142', 'himaka2025');
  assert.ok(okLogin.user);
  assert.equal(okLogin.user?.name, 'Nadia Pramesti Kusuma');

  // Login with wrong password
  const badLogin = authenticateUser(users, '220710142', 'wrongpass');
  assert.ok(badLogin.error);

  // Register new user
  const regResult = registerNewUser(users, {
    name: 'Gilang Ramadhan',
    nim: '240710333',
    faculty: 'Informatika UMBY',
    email: 'gilang@student.mercubuana-yogya.ac.id',
    whatsapp: '081234009988',
    password: 'password123',
  });
  assert.ok(regResult.user);
  assert.equal(regResult.user?.nim, '240710333');

  // Verify seed news articles exist
  assert.ok((seed.newsArticles || []).length >= 5);
});

test('organizationProfile, cabinetPeriods, 1-period prokers, and members per period work accurately', () => {
  const seed = createInitialSeedState();
  assert.equal(seed.organizationProfile?.shortName, 'HIMAKA UMBY');
  assert.equal(
    seed.organizationProfile?.fullName,
    'Himpunan Mahasiswa Informatika Universitas Mercu Buana Yogyakarta',
  );
  assert.equal(seed.organizationProfile?.divisions.length, 6);

  const periods = seed.cabinetPeriods || [];
  assert.equal(periods.length, 3);

  const cab25 = getCabinetByPeriod(periods, '2025/2026');
  assert.equal(cab25?.cabinetName, 'Kabinet Aksara Cipta');
  assert.equal(cab25?.chairpersonName, 'Aziz Zaghul Ikhsanudin');
  assert.equal(cab25?.chairpersonNim, '241110051');
  assert.equal(cab25?.viceChairpersonName, 'Wulandari');
  assert.equal(cab25?.viceChairpersonNim, '241110080');
  assert.equal(cab25?.prokers.length, 8);
  assert.equal(cab25?.members.length, 15);

  // Verify the 15 official 2026 members
  const expected2026Nims = [
    '241110051',
    '241110080',
    '251110015',
    '251110020',
    '251110021',
    '241110085',
    '251110066',
    '241110079',
    '241110088',
    '251110067',
    '251110050',
    '241110075',
    '251110035',
    '251110017',
    '241110038',
  ];
  assert.deepEqual(
    cab25?.members.map((m) => m.nim),
    expected2026Nims,
  );

  // Check prokers with ticketing features
  const runningProkers = filterPeriodProkers(
    cab25!.prokers,
    'BERJALAN',
    'Semua Divisi',
  );
  assert.equal(runningProkers.length, 3);
  assert.ok(
    runningProkers.some((p) => p.ticketingEventId === 'evt-semnas-2025'),
  );

  // Check filtering members by division and query across periods
  const bph25 = filterPeriodMembers(
    cab25!.members,
    'Badan Pengurus Harian (BPH)',
    '',
  );
  assert.equal(bph25.length, 5);

  const medinfo25 = filterPeriodMembers(
    cab25!.members,
    'Divisi Media & Informasi (Medinfo)',
    '',
  );
  assert.equal(medinfo25.length, 4);

  const cab24 = getCabinetByPeriod(periods, '2024/2025');
  assert.equal(cab24?.cabinetName, 'Kabinet Sintaks Kolektif');
  const hendraSearch = filterPeriodMembers(
    cab24!.members,
    'Semua Divisi',
    'Hendra',
  );
  assert.equal(hendraSearch.length, 1);
  assert.equal(hendraSearch[0].nim, '200710041');
});

test('3 portals (guest, user, admin) resolve accurately from user role and filter user transactions', async () => {
  const { resolvePortalModeForUser, getUserTransactions } = await import(
    './ticketing-core'
  );
  const seed = createInitialSeedState();
  const users = seed.users || [];

  // 1. Portal Guest
  assert.equal(resolvePortalModeForUser(null), 'guest');
  assert.equal(getUserTransactions(seed.transactions, null).length, 0);

  // 2. Portal User (Logged in Peserta: Nadia 220710142)
  const nadia = users.find((u) => u.nim === '220710142')!;
  assert.equal(resolvePortalModeForUser(nadia), 'user');
  const nadiaTxs = getUserTransactions(seed.transactions, nadia);
  assert.equal(nadiaTxs.length, 1);
  assert.equal(nadiaTxs[0].ticketCode, 'HMK-2025-A01');

  // 3. Portal Admin (Logged in Pengurus: Siti Nurhaliza 220710164)
  const adminUser = users.find((u) => u.role === 'pengurus')!;
  assert.ok(adminUser);
  assert.equal(resolvePortalModeForUser(adminUser), 'admin');
});

test('documentation images and captions resolve for news, proker, events, divisions, and gallery', async () => {
  const {
    getDocumentationForNews,
    getDocumentationForProker,
    getDocumentationForEvent,
    getDocumentationForDivision,
    getHimakaDocumentationGallery,
  } = await import('./ticketing-core');
  const seed = createInitialSeedState();

  const gallery = getHimakaDocumentationGallery();
  assert.equal(gallery.length, 8);
  assert.ok(
    gallery.every((g) => g.imageUrl.startsWith('/images/dokumentasi/')),
  );

  const leadDoc = getDocumentationForNews(seed.newsArticles![0]);
  assert.equal(leadDoc.archiveCode, 'DOK-HMK-2501');
  assert.ok(leadDoc.imageUrl.endsWith('.svg'));

  const prokerDoc = getDocumentationForProker(
    seed.cabinetPeriods![0].prokers[4],
  );
  assert.equal(prokerDoc.archiveCode, 'DOK-PRK-2505');
  assert.ok(prokerDoc.imageCaption.length > 10);

  const eventDoc = getDocumentationForEvent(seed.events[0]);
  assert.equal(eventDoc.archiveCode, 'DOK-SMN-25');

  const divDoc = getDocumentationForDivision(
    seed.organizationProfile!.divisions[0],
  );
  assert.ok(divDoc.imageUrl.endsWith('.svg'));
});

test('buildPortalBreadcrumbs builds hierarchical trails for inner views (Event Detail, Transaction, Admin tools) and returns empty on portal root views', async () => {
  const { buildPortalBreadcrumbs } = await import('./ticketing-core');
  const seed = createInitialSeedState();
  const semnas = seed.events[0];
  const regTier = semnas.tiers[1];
  const pendingTx = seed.transactions[1];

  // Root views return empty array
  assert.equal(
    buildPortalBreadcrumbs({
      portal: 'guest',
      activeTab: 'home',
      pesertaSubScreen: 'katalog',
    }).length,
    0,
  );
  assert.equal(
    buildPortalBreadcrumbs({
      portal: 'user',
      activeTab: 'user-dashboard',
      pesertaSubScreen: 'katalog',
    }).length,
    0,
  );
  assert.equal(
    buildPortalBreadcrumbs({
      portal: 'admin',
      activeTab: 'admin-dashboard',
      pesertaSubScreen: 'katalog',
    }).length,
    0,
  );

  // Inner view: Event Detail in Portal User
  const detailCrumbs = buildPortalBreadcrumbs({
    portal: 'user',
    activeTab: 'katalog',
    pesertaSubScreen: 'detail',
    selectedEvent: semnas,
  });
  assert.equal(detailCrumbs.length, 3);
  assert.equal(detailCrumbs[0].label, 'Dashboard Peserta');
  assert.equal(detailCrumbs[1].label, 'Katalog Proker & Acara');
  assert.equal(detailCrumbs[2].codeBadge, 'SMN-25');
  assert.equal(detailCrumbs[2].isCurrent, true);

  // Inner view: Transaction Payment in Portal User
  const txPaymentCrumbs = buildPortalBreadcrumbs({
    portal: 'user',
    activeTab: 'katalog',
    pesertaSubScreen: 'pembayaran',
    selectedEvent: semnas,
    selectedTier: regTier,
    activeTransaction: pendingTx,
  });
  assert.equal(txPaymentCrumbs.length, 4);
  assert.equal(txPaymentCrumbs[3].codeBadge, 'TRX-2025-0102');
  assert.equal(txPaymentCrumbs[3].isCurrent, true);

  // Inner view: My Tickets / Transaction Status
  const ticketCrumbs = buildPortalBreadcrumbs({
    portal: 'user',
    activeTab: 'tiketku',
    pesertaSubScreen: 'katalog',
    activeTransaction: pendingTx,
  });
  assert.equal(ticketCrumbs.length, 3);
  assert.equal(ticketCrumbs[2].label, 'Status Transaksi & E-Ticket QR');
  assert.equal(ticketCrumbs[2].codeBadge, 'HMK-2025-B02');

  // Inner view: Admin Tools (Bendahara, Scanner, Medinfo)
  const bendaharaCrumbs = buildPortalBreadcrumbs({
    portal: 'admin',
    activeTab: 'bendahara',
    pesertaSubScreen: 'katalog',
  });
  assert.equal(bendaharaCrumbs.length, 3);
  assert.equal(bendaharaCrumbs[0].label, 'Overview Admin');
  assert.equal(bendaharaCrumbs[1].label, 'Perangkat Admin');
  assert.equal(bendaharaCrumbs[2].label, 'Dashboard Bendahara & Transaksi');
  assert.equal(bendaharaCrumbs[2].codeBadge, 'BENDAHARA');
});

test('Medinfo Pre-Proker poster publication and After-Proker documentation upload update prokers, gallery, announcements, and news', async () => {
  const {
    publishUpcomingProkerByMedinfo,
    uploadAfterProkerDocumentationByMedinfo,
  } = await import('./ticketing-core');
  const seed = createInitialSeedState();

  // Step 1: Medinfo posts an upcoming proker with media poster
  const preResult = publishUpcomingProkerByMedinfo(seed, {
    name: 'Bootcamp Full-Stack Next.js & Cyber Security 2026',
    division: 'Divisi Media & Informasi (Medinfo)',
    month: 'Desember 2025',
    category: 'Bootcamp & Klinik IT',
    status: 'AKAN DATANG',
    summary:
      'Pelatihan intensif arsitektur web modern dan audit keamanan siber.',
    achievementOrTarget: '80 mahasiswa Informatika UMBY',
    personInCharge: 'Alya Zahra Putri',
    imageUrl: '/images/dokumentasi/dok-studio-broadcasting.svg',
    imageCaption: 'Poster resmi Bootcamp Full-Stack Next.js 2026',
    alsoPostAnnouncement: true,
  });

  assert.equal(preResult.createdProker.code, 'PRK-2509');
  assert.equal(preResult.createdProker.status, 'AKAN DATANG');
  assert.equal(preResult.nextState.cabinetPeriods![0].prokers.length, 9);
  assert.equal(preResult.nextState.documentationGallery!.length, 9);
  assert.equal(preResult.nextState.medinfo.announcements.length, 4);

  // Step 2: After the proker completes, Medinfo uploads after-proker documentation & marks it TERLAKSANA
  const afterResult = uploadAfterProkerDocumentationByMedinfo(
    preResult.nextState,
    {
      prokerId: preResult.createdProker.id,
      title: 'Dokumentasi Pelaksanaan Bootcamp Full-Stack Next.js 2026',
      date: '20 Desember 2025',
      location: 'Laboratorium Komputasi Kampus 3 UMBY',
      photographer: 'Bima Arya Pamungkas',
      imageUrl: '/images/dokumentasi/dok-kunjungan-redaksi.svg',
      caption:
        'Sebanyak 85 mahasiswa Informatika menyelesaikan deployment proyek akhir.',
      markProkerCompleted: true,
      updatedAchievement:
        'Terlaksana dengan 85 peserta & 15 repositori open-source.',
      alsoPublishNews: true,
    },
  );

  assert.equal(afterResult.createdDoc.archiveCode, 'DOK-AFTER-PRK-2509');
  assert.equal(afterResult.createdDoc.mediaPhase, 'AFTER_PROKER');
  const updatedProker = afterResult.nextState.cabinetPeriods![0].prokers.find(
    (p) => p.id === preResult.createdProker.id,
  );
  assert.equal(updatedProker?.status, 'TERLAKSANA');
  assert.equal(
    updatedProker?.achievementOrTarget,
    'Terlaksana dengan 85 peserta & 15 repositori open-source.',
  );
  assert.ok(afterResult.createdNews);
  assert.equal(
    afterResult.nextState.newsArticles![0].id,
    afterResult.createdNews?.id,
  );
});

test('Admin Medinfo can publish standalone news and delete uploaded news articles, documentation media, and prokers', async () => {
  const {
    publishStandaloneNewsByMedinfo,
    deleteNewsArticleByMedinfo,
    deleteDocumentationMediaByMedinfo,
    deleteProkerByMedinfo,
    publishUpcomingProkerByMedinfo,
  } = await import('./ticketing-core');
  const seed = createInitialSeedState();
  const initialNewsCount = seed.newsArticles!.length;
  const initialGalleryCount = seed.documentationGallery!.length;

  // 1. Publish a new news article
  const pubNews = publishStandaloneNewsByMedinfo(seed, {
    title: 'Rilis Berita Uji Coba Medinfo HIMAKA',
    category: 'Jurnalistik & Medinfo',
    author: 'Admin Medinfo',
    division: 'Divisi Media & Informasi (Medinfo)',
    location: 'Kampus 3 UMBY',
    summary: 'Ringkasan berita uji coba yang dapat dihapus kembali oleh Admin.',
    imageUrl: '/images/dokumentasi/dok-kunjungan-redaksi.svg',
    imageCaption: 'Caption foto berita uji coba',
    isLeadStory: true,
  });
  assert.equal(pubNews.nextState.newsArticles!.length, initialNewsCount + 1);
  assert.equal(pubNews.nextState.newsArticles![0].id, pubNews.createdNews.id);
  assert.equal(pubNews.nextState.newsArticles![0].isLeadStory, true);

  // 2. Delete the newly created news article (should restore lead story to next article)
  const afterDeleteNews = deleteNewsArticleByMedinfo(
    pubNews.nextState,
    pubNews.createdNews.id,
  );
  assert.equal(afterDeleteNews.newsArticles!.length, initialNewsCount);
  assert.equal(
    afterDeleteNews.newsArticles!.some((n) => n.id === pubNews.createdNews.id),
    false,
  );
  assert.equal(afterDeleteNews.newsArticles![0].isLeadStory, true);

  // 3. Delete an existing documentation media item from gallery
  const targetDocId = afterDeleteNews.documentationGallery![0].id;
  const afterDeleteDoc = deleteDocumentationMediaByMedinfo(
    afterDeleteNews,
    targetDocId,
  );
  assert.equal(
    afterDeleteDoc.documentationGallery!.length,
    initialGalleryCount - 1,
  );
  assert.equal(
    afterDeleteDoc.documentationGallery!.some((d) => d.id === targetDocId),
    false,
  );

  // 4. Publish a proker and then delete it (removes proker and its linked gallery poster)
  const pubPrk = publishUpcomingProkerByMedinfo(afterDeleteDoc, {
    name: 'Proker Sementara Untuk Dihapus',
    division: 'Divisi Media & Informasi (Medinfo)',
    month: 'Januari 2026',
    category: 'Klinik IT',
    summary: 'Ringkasan proker sementara',
    achievementOrTarget: '50 peserta',
    personInCharge: 'Admin',
    imageUrl: '/images/dokumentasi/dok-seminar-auditorium.svg',
    imageCaption: 'Poster sementara',
  });
  const countBeforePrkDelete =
    pubPrk.nextState.cabinetPeriods![0].prokers.length;
  const afterDeletePrk = deleteProkerByMedinfo(
    pubPrk.nextState,
    pubPrk.createdProker.id,
  );
  assert.equal(
    afterDeletePrk.cabinetPeriods![0].prokers.length,
    countBeforePrkDelete - 1,
  );
  assert.equal(
    afterDeletePrk.documentationGallery!.some(
      (d) => d.relatedProkerId === pubPrk.createdProker.id,
    ),
    false,
  );
});

test('Admin can add, edit (with avatarUrl), and delete cabinet members in HIMAKA 2026', async () => {
  const {
    addCabinetMemberByAdmin,
    updateCabinetMemberByAdmin,
    deleteCabinetMemberByAdmin,
    getCabinetByPeriod,
  } = await import('./ticketing-core');
  const seed = createInitialSeedState();

  // 1. Add a new member with avatarUrl
  const added = addCabinetMemberByAdmin(seed, {
    periodYear: '2025/2026',
    name: 'Rizky Pratama Wijaya',
    nim: '251110099',
    roleTitle: 'Anggota Medinfo',
    division: 'Divisi Media & Informasi (Medinfo)',
    cohortYear: '2025',
    avatarUrl: 'data:image/svg+xml;utf8,<svg></svg>',
  });
  const cabAfterAdd = getCabinetByPeriod(
    added.nextState.cabinetPeriods || [],
    '2025/2026',
  )!;
  assert.equal(cabAfterAdd.members.length, 16);
  assert.equal(added.createdMember.nim, '251110099');
  assert.equal(
    added.createdMember.avatarUrl,
    'data:image/svg+xml;utf8,<svg></svg>',
  );

  // 2. Update the member's role and photo
  const updated = updateCabinetMemberByAdmin(
    added.nextState,
    added.createdMember.id,
    {
      name: 'Rizky Pratama Wijaya, S.Kom',
      nim: '251110099',
      roleTitle: 'Koordinator Kreatif Medinfo',
      division: 'Divisi Media & Informasi (Medinfo)',
      cohortYear: '2025',
      avatarUrl: '/images/logo-himaka-umby.svg',
    },
  );
  const cabAfterUpdate = getCabinetByPeriod(
    updated.cabinetPeriods || [],
    '2025/2026',
  )!;
  const updatedMem = cabAfterUpdate.members.find(
    (m) => m.id === added.createdMember.id,
  );
  assert.equal(updatedMem?.roleTitle, 'Koordinator Kreatif Medinfo');
  assert.equal(updatedMem?.avatarUrl, '/images/logo-himaka-umby.svg');

  // 3. Delete the member
  const afterDelete = deleteCabinetMemberByAdmin(
    updated,
    added.createdMember.id,
  );
  const cabAfterDelete = getCabinetByPeriod(
    afterDelete.cabinetPeriods || [],
    '2025/2026',
  )!;
  assert.equal(cabAfterDelete.members.length, 15);
  assert.equal(
    cabAfterDelete.members.some((m) => m.id === added.createdMember.id),
    false,
  );
});

test('Admin can update existing proker and news articles, and create/update academic events & quotas', async () => {
  const {
    updateProkerByMedinfo,
    updateNewsArticleByMedinfo,
    createAcademicEventByAdmin,
    updateAcademicEventByAdmin,
  } = await import('./ticketing-core');
  const seed = createInitialSeedState();

  // 1. Update existing proker
  const targetProker = seed.cabinetPeriods![0].prokers[0];
  const stateAfterProkerEdit = updateProkerByMedinfo(seed, targetProker.id, {
    name: 'informatics.connect() — Pekan Sambut Maba 2026 (Updated)',
    division: targetProker.division,
    month: 'September 2026',
    category: targetProker.category,
    status: 'TERLAKSANA',
    summary: 'Ringkasan terbaru orientasi akademik.',
    achievementOrTarget: '195 mahasiswa baru hadir.',
    personInCharge: 'Aziz Zaghul Ikhsanudin',
  });
  assert.equal(
    stateAfterProkerEdit.cabinetPeriods![0].prokers[0].name,
    'informatics.connect() — Pekan Sambut Maba 2026 (Updated)',
  );

  // 2. Update existing news article
  const targetNews = stateAfterProkerEdit.newsArticles![0];
  const stateAfterNewsEdit = updateNewsArticleByMedinfo(
    stateAfterProkerEdit,
    targetNews.id,
    {
      title: 'Judul Berita Utama Diperbarui 2026',
      category: targetNews.category,
      author: targetNews.author,
      division: targetNews.division,
      location: 'Auditorium Kampus 3 UMBY',
      summary: 'Ringkasan berita telah diperbarui oleh Admin Medinfo.',
    },
  );
  assert.equal(
    stateAfterNewsEdit.newsArticles![0].title,
    'Judul Berita Utama Diperbarui 2026',
  );

  // 3. Create new academic ticketing event
  const createdEvt = createAcademicEventByAdmin(stateAfterNewsEdit, {
    code: 'BCF-26',
    title: 'Bootcamp DevSecOps & Cloud Native HIMAKA 2026',
    category: 'Workshop & Bootcamp',
    date: '12 Desember 2026',
    time: '08:30 – 16:00 WIB',
    location: 'Lab Komputasi Lantai 3 Kampus 3 UMBY',
    description: 'Pelatihan intensif CI/CD dan Kubernetes untuk mahasiswa.',
    speakerOrHost: 'Tim Cloud Architect Nasional',
    skpPoints: '4 SKP Akademik',
    tierName: 'Tiket Peserta Early Bird',
    tierPrice: 55000,
    tierQuota: 75,
    alsoCreateProker: true,
    prokerDivision: 'Divisi PKM (Pengembangan Kreativitas Mahasiswa)',
    prokerPic: 'Muhammad Yasir Alfatah',
  });
  assert.equal(createdEvt.createdEvent.code, 'BCF-26');
  assert.equal(createdEvt.nextState.events.length, seed.events.length + 1);
  assert.equal(
    createdEvt.nextState.cabinetPeriods![0].prokers[0].ticketingEventId,
    createdEvt.createdEvent.id,
  );

  // 4. Update event details & tier quota/price
  const updatedEvtState = updateAcademicEventByAdmin(
    createdEvt.nextState,
    createdEvt.createdEvent.id,
    {
      title: 'Bootcamp DevSecOps & Cloud Native HIMAKA 2026 (Kuota Ditambah)',
      date: '12 Desember 2026',
      location: 'Auditorium & Lab Kampus 3 UMBY',
      description: 'Pelatihan intensif CI/CD dan Kubernetes untuk mahasiswa.',
      skpPoints: '5 SKP Akademik',
      isOpen: true,
      tierUpdates: createdEvt.createdEvent.tiers.map((t) => ({
        tierId: t.id,
        name: t.name,
        price: 60000,
        quota: 120,
      })),
    },
  );
  const editedEvt = updatedEvtState.events.find(
    (e) => e.id === createdEvt.createdEvent.id,
  )!;
  assert.equal(editedEvt.skpPoints, '5 SKP Akademik');
  assert.equal(editedEvt.tiers[0].quota, 120);
  assert.equal(editedEvt.tiers[0].price, 60000);
});

test('E-Sertifikat is only generated for LUNAS tickets marked as HADIR and produces valid PDF bytes', async () => {
  const {
    isTicketMarkedHadir,
    isTransactionEligibleForCertificate,
    getCertificateForTransaction,
    generateCertificatePdfString,
    generateCertificatePdfBytes,
    getCertificatePdfFilename,
    validateTicketScan,
  } = await import('./ticketing-core');
  const seed = createInitialSeedState();

  // 1. TRX-2025-0101 (HMK-2025-A01) is LUNAS but not yet HADIR -> not eligible yet
  const unscannedTx = seed.transactions.find((t) => t.id === 'TRX-2025-0101')!;
  assert.equal(isTicketMarkedHadir(unscannedTx), false);
  assert.equal(isTransactionEligibleForCertificate(unscannedTx), false);
  assert.equal(
    getCertificateForTransaction(
      unscannedTx,
      seed.events,
      seed.cabinetPeriods?.[0],
    ),
    null,
  );

  // 2. TRX-2025-0103 (HMK-2025-C03) is LUNAS and marked HADIR -> eligible immediately
  const scannedTx = seed.transactions.find((t) => t.id === 'TRX-2025-0103')!;
  assert.equal(isTicketMarkedHadir(scannedTx), true);
  assert.equal(isTransactionEligibleForCertificate(scannedTx), true);
  const certC03 = getCertificateForTransaction(
    scannedTx,
    seed.events,
    seed.cabinetPeriods?.[0],
  );
  assert.ok(certC03);
  assert.ok(certC03.certificateNumber.startsWith('CERT-HMK-2026-'));
  assert.equal(certC03.participantName, 'Fajar Siddiq Mahendra');
  assert.equal(certC03.chairpersonName, 'Aziz Zaghul Ikhsanudin');

  // Verify generated PDF certificate string & bytes
  const pdfString = generateCertificatePdfString(certC03);
  assert.ok(pdfString.startsWith('%PDF-1.4\n'));
  assert.ok(pdfString.includes('Fajar Siddiq Mahendra'));
  assert.ok(pdfString.includes(certC03.certificateNumber));
  assert.ok(pdfString.includes('Aziz Zaghul Ikhsanudin'));
  assert.ok(pdfString.trimEnd().endsWith('%%EOF'));

  const pdfBytes = generateCertificatePdfBytes(certC03);
  assert.ok(pdfBytes.length > 500);
  assert.equal(
    getCertificatePdfFilename(certC03),
    `E-Certificate-${certC03.certificateNumber}.pdf`,
  );

  // 3. Scan HMK-2025-A01 at the gate -> now marked HADIR & eligible for E-Certificate
  const scanOutcome = validateTicketScan(
    seed,
    'HMK-2025-A01',
    '2026-11-15 08:15 WIB',
  );
  const newlyScannedTx = scanOutcome.matchedTransaction!;
  assert.equal(newlyScannedTx.attendanceStatus, 'HADIR');
  assert.equal(isTicketMarkedHadir(newlyScannedTx), true);
  assert.equal(isTransactionEligibleForCertificate(newlyScannedTx), true);
  const certA01 = getCertificateForTransaction(
    newlyScannedTx,
    scanOutcome.nextState.events,
    scanOutcome.nextState.cabinetPeriods?.[0],
  );
  assert.ok(certA01);
  assert.equal(certA01.participantName, 'Nadia Pramesti Kusuma');
  assert.equal(certA01.skpPoints, '4 SKP Akademik');
});
