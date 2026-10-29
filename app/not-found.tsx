import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f8f9ff] px-4 py-12 text-[#45464d]">
      <div className="max-w-md w-full bg-white border border-[#c6c6cd] rounded-xl p-6 sm:p-8 shadow-level-1 text-center space-y-4">
        <span className="inline-block px-2.5 py-1 rounded bg-[#eff4ff] border border-[#c6c6cd] font-mono-code text-xs font-semibold text-[#0a2cfd]">
          404 · HALAMAN TIDAK DITEMUKAN
        </span>
        <h1 className="text-xl sm:text-2xl font-bold text-[#0b1c30]">
          Halaman Portal HIMAKA UMBY Tidak Ditemukan
        </h1>
        <p className="text-sm text-[#45464d] leading-relaxed">
          Tautan yang Anda tuju tidak tersedia atau telah dipindahkan. Silakan
          kembali ke Beranda Portal Informasi &amp; E-Ticketing HIMAKA
          Universitas Mercu Buana Yogyakarta.
        </p>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center min-h-[42px] px-5 py-2.5 rounded-lg bg-[#0b1c30] hover:bg-[#45464d] text-white text-xs font-semibold transition-colors focus-academic"
          >
            Kembali ke Beranda Portal
          </Link>
        </div>
      </div>
    </main>
  );
}
