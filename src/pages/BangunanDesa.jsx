import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Landmark, GraduationCap, Stethoscope, Moon, Store, Sparkles } from 'lucide-react';
import { getBangunanDesa } from '../services/desaService';

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

  const getBadgeLabel = (kategori) => {
    switch (kategori) {
      case 'pendidikan':
        return 'Bangunan Pendidikan';
      case 'pemerintahan':
        return 'Bangunan Pemerintahan';
      case 'kesehatan':
        return 'Bangunan Kesehatan';
      case 'keagamaan':
        return 'Bangunan Keagamaan';
      case 'ekonomi_sosial':
        return 'Bangunan Ekonomi & Sosial';
      default:
        return 'Fasilitas Desa';
    }
  };

  const filtered = activeKategori === 'all'
    ? bangunanList
    : bangunanList.filter((item) => item.kategori === activeKategori);

  return (
    <div className="space-y-12 pb-16">
      {/* Header Banner */}
      <section className="bg-primary text-white py-14 px-4 sm:px-6 lg:px-8 shadow-inner">
        <div className="max-w-7xl mx-auto text-center space-y-3">
          <span className="text-accent font-semibold text-sm uppercase tracking-widest">Infrastruktur & Fasilitas Publik</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold">Bangunan Desa Tenjonagara</h1>
          <p className="text-emerald-100 max-w-2xl mx-auto text-sm sm:text-base">
            Daftar fasilitas fisik, sekolah, sarana kesehatan, dan pusat pemerintahan masyarakat Desa Tenjonagara.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Category Filter Tabs */}
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
            onClick={() => setActiveKategori('pemerintahan')}
            className={`px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 ${
              activeKategori === 'pemerintahan'
                ? 'bg-primary text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Landmark className="w-4 h-4 text-emerald-400" />
            <span>Pemerintahan</span>
          </button>

          <button
            onClick={() => setActiveKategori('pendidikan')}
            className={`px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 ${
              activeKategori === 'pendidikan'
                ? 'bg-primary text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-amber-400" />
            <span>Pendidikan</span>
          </button>

          <button
            onClick={() => setActiveKategori('kesehatan')}
            className={`px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 ${
              activeKategori === 'kesehatan'
                ? 'bg-primary text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Stethoscope className="w-4 h-4 text-rose-400" />
            <span>Kesehatan</span>
          </button>

          <button
            onClick={() => setActiveKategori('keagamaan')}
            className={`px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 ${
              activeKategori === 'keagamaan'
                ? 'bg-primary text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Moon className="w-4 h-4 text-emerald-300" />
            <span>Keagamaan</span>
          </button>

          <button
            onClick={() => setActiveKategori('ekonomi_sosial')}
            className={`px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 ${
              activeKategori === 'ekonomi_sosial'
                ? 'bg-primary text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Store className="w-4 h-4 text-blue-400" />
            <span>Ekonomi & Sosial</span>
          </button>
        </div>

        {/* Card Grid matching the exact reference screenshot */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-slate-200/90 flex flex-col group"
            >
              {/* Image Container */}
              <div className="h-56 overflow-hidden relative bg-slate-100">
                <img
                  src={item.gambar_url || 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80'}
                  alt={item.nama}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col flex-grow space-y-4">
                {/* Pill Badge matching reference styling */}
                <div>
                  <span className="inline-block px-4 py-1.5 rounded-full bg-[#1E4D40] text-white text-xs font-bold tracking-wide shadow-sm">
                    {getBadgeLabel(item.kategori)}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-bold text-2xl text-slate-800 tracking-tight leading-snug group-hover:text-primary transition-colors">
                  {item.nama}
                </h3>

                {/* Short Description line-clamp-3 */}
                <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
                  {item.deskripsi}
                </p>

                {/* Full Width Lihat Detail Action Button */}
                <div className="pt-4 mt-auto">
                  <Link
                    to={`/bangunan/${item.id}`}
                    className="w-full py-3 px-4 rounded-xl bg-[#1E4D40] hover:bg-primary text-white font-bold text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center text-center tracking-wide"
                  >
                    Lihat Detail
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
