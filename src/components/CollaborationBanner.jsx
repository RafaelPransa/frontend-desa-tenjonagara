import React from 'react';
import { Award, ChevronDown, Sparkles } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import logoPemkab from '../assets/logo-pemkab-tasikmalaya.png';
import logoUnper from '../assets/logo-unper.png';
import logoLP2M from '../assets/logo-lp2m.png';

/**
 * Komponen Showcase Full Screen (100vh) Kolaborasi Kerjasama KKN & Pengabdian Masyarakat
 * Menampilkan Logo Pemkab Tasikmalaya, Universitas Perjuangan Tasikmalaya, dan LP2M.
 */
export default function CollaborationBanner() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-b from-[#064E3B] via-[#04392B] to-[#02261C] text-white py-16 px-4 sm:px-6 lg:px-8 shadow-2xl my-0">
      {/* Background Decorative Glow Ornaments */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 left-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto text-center space-y-10 my-auto">
        {/* Badge & Title Header */}
        <ScrollReveal direction="down" delay={0}>
          <div className="space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/20 border border-accent/40 text-accent text-xs font-bold uppercase tracking-widest shadow-md">
              <Sparkles className="w-4 h-4 text-accent" />
              <span>Program KKN & Pengabdian Kepada Masyarakat</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white leading-tight tracking-wide">
              Sinergi & Kolaborasi Strategis Pembangunan Digital Desa
            </h2>

            <p className="text-sm sm:text-base text-emerald-100/90 font-light leading-relaxed max-w-2xl mx-auto">
              Website Portal Desa Tenjonagara merupakan karya nyata pengabdian masyarakat berkolaborasi antara{' '}
              <strong className="text-white font-semibold">Pemerintah Desa Tenjonagara</strong>,{' '}
              <strong className="text-accent font-semibold">Universitas Perjuangan Tasikmalaya</strong>, dan{' '}
              <strong className="text-white font-semibold">LP2M</strong>.
            </p>
          </div>
        </ScrollReveal>

        {/* 3 Large Logo Cards Showcase */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto pt-4">
          {/* Card 1: Pemdes Tenjonagara / Pemkab Tasikmalaya */}
          <ScrollReveal direction="up" delay={150}>
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/20 hover:border-accent/60 hover:bg-white/15 transition-all duration-500 shadow-2xl group flex flex-col items-center justify-center space-y-4 transform hover:-translate-y-2 h-full">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white/95 p-3 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
                <img
                  src={logoPemkab}
                  alt="Logo Pemkab Tasikmalaya"
                  className="w-full h-full object-contain drop-shadow-md"
                />
              </div>
              <div className="space-y-1 text-center">
                <div className="text-xs font-semibold text-accent uppercase tracking-wider">Mitra Pemerintah</div>
                <h3 className="font-serif font-bold text-lg sm:text-xl text-white">Pemdes Tenjonagara</h3>
                <p className="text-[11px] text-emerald-200/80 font-light">Kecamatan Cigalontang, Kab. Tasikmalaya</p>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 2: Universitas Perjuangan Tasikmalaya */}
          <ScrollReveal direction="up" delay={300}>
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-accent/40 hover:border-accent hover:bg-white/15 transition-all duration-500 shadow-2xl group flex flex-col items-center justify-center space-y-4 transform hover:-translate-y-2 h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-accent text-primary-dark text-[10px] font-extrabold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                Perguruan Tinggi
              </div>
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white/95 p-3 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
                <img
                  src={logoUnper}
                  alt="Logo Universitas Perjuangan Tasikmalaya"
                  className="w-full h-full object-contain drop-shadow-md"
                />
              </div>
              <div className="space-y-1 text-center">
                <div className="text-xs font-semibold text-accent uppercase tracking-wider">Penyelenggara KKN</div>
                <h3 className="font-serif font-bold text-lg sm:text-xl text-white">UNPER Tasikmalaya</h3>
                <p className="text-[11px] text-emerald-200/80 font-light">Universitas Perjuangan Tasikmalaya</p>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 3: LP2M UNPER */}
          <ScrollReveal direction="up" delay={450}>
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/20 hover:border-accent/60 hover:bg-white/15 transition-all duration-500 shadow-2xl group flex flex-col items-center justify-center space-y-4 transform hover:-translate-y-2 h-full">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white/95 p-3 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
                <img
                  src={logoLP2M}
                  alt="Logo LP2M UNPER"
                  className="w-full h-full object-contain drop-shadow-md"
                />
              </div>
              <div className="space-y-1 text-center">
                <div className="text-xs font-semibold text-accent uppercase tracking-wider">Lembaga Pengabdian</div>
                <h3 className="font-serif font-bold text-lg sm:text-xl text-white">LP2M UNPER</h3>
                <p className="text-[11px] text-emerald-200/80 font-light">Lembaga Penelitian & Pengabdian Masyarakat</p>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Footer Scroll Down Indicator */}
        <ScrollReveal direction="up" delay={600}>
          <div className="pt-4 flex flex-col items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity">
            <span className="text-[11px] text-emerald-200/70 uppercase tracking-widest font-semibold">
              Scroll Ke Bawah Untuk Informasi Footer
            </span>
            <ChevronDown className="w-5 h-5 text-accent animate-bounce" />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
