import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Landmark, GraduationCap, Stethoscope, Moon, Store, Sparkles } from 'lucide-react';
import { getBangunanDesa } from '../services/desaService';
import ScrollReveal from '../components/ScrollReveal';

export default function BangunanDesa() {
  const [bangunanList, setBangunanList] = useState([]);
  const [activeKategori, setActiveKategori] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBangunanDesa()
      .then((res) => setBangunanList(res.data || []))
      .catch(() => setBangunanList([]))
      .finally(() => setLoading(false));
  }, []);

  const getCategoryMeta = (kategori) => {
    switch (kategori) {
      case 'fasilitas_pendidikan':
      case 'pendidikan':
        return {
          label: 'Pendidikan',
          badgeBg: 'bg-blue-600 text-white shadow-blue-900/20',
          filterActive: 'bg-blue-600 text-white shadow-md',
          iconColor: 'text-blue-400'
        };
      case 'fasilitas_kesehatan':
      case 'kesehatan':
        return {
          label: 'Kesehatan',
          badgeBg: 'bg-rose-600 text-white shadow-rose-900/20',
          filterActive: 'bg-rose-600 text-white shadow-md',
          iconColor: 'text-rose-400'
        };
      case 'fasilitas_umum':
      case 'pemerintahan':
        return {
          label: 'Umum & Kantor',
          badgeBg: 'bg-emerald-800 text-white shadow-emerald-900/20',
          filterActive: 'bg-emerald-800 text-white shadow-md',
          iconColor: 'text-emerald-400'
        };
      case 'fasilitas_ibadah':
      case 'keagamaan':
        return {
          label: 'Ibadah',
          badgeBg: 'bg-amber-600 text-white shadow-amber-900/20',
          filterActive: 'bg-amber-600 text-white shadow-md',
          iconColor: 'text-amber-400'
        };
      case 'fasilitas_olahraga':
      case 'ekonomi_sosial':
        return {
          label: 'Olahraga',
          badgeBg: 'bg-purple-600 text-white shadow-purple-900/20',
          filterActive: 'bg-purple-600 text-white shadow-md',
          iconColor: 'text-purple-400'
        };
      default:
        return {
          label: kategori || 'Fasilitas Desa',
          badgeBg: 'bg-slate-700 text-white shadow-slate-900/20',
          filterActive: 'bg-primary text-white shadow-md',
          iconColor: 'text-slate-400'
        };
    }
  };

  const filtered = activeKategori === 'all'
    ? bangunanList
    : bangunanList.filter((item) => {
        if (item.kategori === activeKategori) return true;
        if (activeKategori === 'fasilitas_umum' && item.kategori === 'pemerintahan') return true;
        if (activeKategori === 'fasilitas_pendidikan' && item.kategori === 'pendidikan') return true;
        if (activeKategori === 'fasilitas_kesehatan' && item.kategori === 'kesehatan') return true;
        if (activeKategori === 'fasilitas_ibadah' && item.kategori === 'keagamaan') return true;
        if (activeKategori === 'fasilitas_olahraga' && item.kategori === 'ekonomi_sosial') return true;
        return false;
      });

  return (
    <div className="space-y-16 pb-20">
      {/* Header Banner */}
      <section className="gradient-hero text-white py-16 px-4 sm:px-6 lg:px-8 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4A017_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="max-w-7xl mx-auto text-center space-y-3 relative z-10">
          <ScrollReveal direction="down" delay={0}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-accent backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-4 h-4 text-accent" />
              Infrastruktur & Fasilitas Publik
            </span>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={100}>
            <h1 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight">
              Bangunan <span className="text-accent">Desa Tenjonagara</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={200}>
            <p className="text-emerald-100 max-w-2xl mx-auto text-sm sm:text-base font-light">
              Daftar fasilitas fisik, sekolah, sarana kesehatan, dan pusat pemerintahan masyarakat Desa Tenjonagara.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Category Filter Tabs */}
        <ScrollReveal direction="up" delay={100}>
          <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3">
            <button
              onClick={() => setActiveKategori('all')}
              className={`px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 ${
                activeKategori === 'all'
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Sparkles className="w-4 h-4 text-accent" />
              <span>Semua Bangunan</span>
            </button>

            <button
              onClick={() => setActiveKategori('fasilitas_umum')}
              className={`px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 ${
                activeKategori === 'fasilitas_umum'
                  ? 'bg-emerald-800 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Landmark className="w-4 h-4 text-emerald-400" />
              <span>Umum & Kantor</span>
            </button>

            <button
              onClick={() => setActiveKategori('fasilitas_pendidikan')}
              className={`px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 ${
                activeKategori === 'fasilitas_pendidikan'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-blue-400" />
              <span>Pendidikan</span>
            </button>

            <button
              onClick={() => setActiveKategori('fasilitas_kesehatan')}
              className={`px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 ${
                activeKategori === 'fasilitas_kesehatan'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Stethoscope className="w-4 h-4 text-rose-400" />
              <span>Kesehatan</span>
            </button>

            <button
              onClick={() => setActiveKategori('fasilitas_ibadah')}
              className={`px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 ${
                activeKategori === 'fasilitas_ibadah'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Moon className="w-4 h-4 text-amber-300" />
              <span>Ibadah</span>
            </button>

            <button
              onClick={() => setActiveKategori('fasilitas_olahraga')}
              className={`px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 ${
                activeKategori === 'fasilitas_olahraga'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Store className="w-4 h-4 text-purple-400" />
              <span>Olahraga</span>
            </button>
          </div>
        </ScrollReveal>

        {/* Card Grid with ScrollReveal Animations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {filtered.map((item, index) => {
            const meta = getCategoryMeta(item.kategori);

            return (
              <ScrollReveal key={item.id} direction="up" delay={(index % 3) * 150}>
                <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 flex flex-col h-full group transform hover:-translate-y-1.5">
                  {/* Image Container */}
                  <div className="h-56 overflow-hidden relative bg-slate-100 shrink-0">
                    <img
                      src={item.gambar_url || 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80'}
                      alt={item.nama}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex flex-col flex-1 justify-between space-y-4">
                    <div className="space-y-3 flex-1 flex flex-col">
                      <div>
                        <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-wide shadow-xs ${meta.badgeBg}`}>
                          {meta.label}
                        </span>
                      </div>

                      <h3 className="font-bold text-2xl text-slate-800 tracking-tight leading-snug group-hover:text-primary transition-colors line-clamp-2 min-h-[3.5rem] flex items-center">
                        {item.nama}
                      </h3>

                      <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 min-h-[3.75rem]">
                        {item.deskripsi}
                      </p>
                    </div>

                    <div className="pt-4 mt-auto shrink-0">
                      <Link
                        to={`/bangunan/${item.id}`}
                        className="w-full py-3 px-4 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center text-center tracking-wide"
                      >
                        Lihat Detail
                      </Link>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

      </div>
    </div>
  );
}

