import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, DM_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-heading',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'HIMAKA UMBY — Portal Organisasi & E-Ticketing Proker',
  description:
    'Portal informasi resmi organisasi, dokumentasi proker 1 periode, direktori anggota, dan e-ticketing kegiatan Himpunan Mahasiswa Informatika Universitas Mercu Buana Yogyakarta.',
  openGraph: {
    title: 'HIMAKA UMBY — Portal Organisasi & E-Ticketing Proker',
    description:
      'Portal informasi resmi organisasi, dokumentasi proker 1 periode, direktori anggota, dan e-ticketing kegiatan Himpunan Mahasiswa Informatika Universitas Mercu Buana Yogyakarta.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HIMAKA UMBY — Portal Organisasi & E-Ticketing Proker',
    description:
      'Portal informasi resmi organisasi, dokumentasi proker 1 periode, direktori anggota, dan e-ticketing kegiatan Himpunan Mahasiswa Informatika Universitas Mercu Buana Yogyakarta.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${plusJakarta.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
    >
      <body
        suppressHydrationWarning
        className="min-h-screen bg-[#f8fafc] text-[#334155] antialiased selection:bg-[#1d4ed8]/15 selection:text-[#0f172a] overflow-x-hidden"
      >
        {children}
      </body>
    </html>
  );
}
