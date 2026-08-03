import React, { useEffect, useState } from 'react';
import { Sparkles, Sprout, Store, Trees, Fish } from 'lucide-react';
import { getPotensiDesa } from '../services/desaService';

export default function PotensiDesa() {
  const [potensiList, setPotensiList] = useState([]);
  const [activeKategori, setActiveKategori] = useState('all');

  useEffect(() => {
    getPotensiDesa()
      .then((res) => setPotensiList(res.data || []))
      .catch(() => setPotensiList([]));
  }, []);

  const getCategoryMeta = (kategori) => {
    switch (kategori) {
      case 'pertanian':
        return {
          label: 'Pertanian & Perkebunan',
          badgeBg: 'bg-emerald-700 text-white shadow-emerald-900/20',
          filterActive: 'bg-emerald-700 text-white shadow-md'
        };
      case 'umkm':
        return {
          label: 'UMKM & Kerajinan',
          badgeBg: 'bg-amber-600 text-white shadow-amber-900/20',
          filterActive: 'bg-amber-600 text-white shadow-md'
        };
      case 'wisata':
        return {
          label: 'Wisata & Alam',
          badgeBg: 'bg-teal-600 text-white shadow-teal-900/20',
          filterActive: 'bg-teal-600 text-white shadow-md'
        };
      case 'perikanan':
        return {
          label: 'Perikanan & Peternakan',
          badgeBg: 'bg-blue-600 text-white shadow-blue-900/20',
          filterActive: 'bg-blue-600 text-white shadow-md'
        };
      default:
        return {
          label: 'Lainnya',
          badgeBg: 'bg-purple-600 text-white shadow-purple-900/20',
          filterActive: 'bg-purple-600 text-white shadow-md'
        };
    }
  };

  const filtered = activeKategori === 'all'
    ? potensiList
    : potensiList.filter((item) => item.kategori === activeKategori);

  return (
    <div className="space-y-12 pb-16">
      {/* Header */}
      <section className="bg-primary text-white py-14 px-4 sm:px-6 lg:px-8 shadow-inner">
        <div className="max-w-7xl mx-auto text-center space-y-3">
          <span className="text-accent font-semibold text-sm uppercase tracking-widest">Kekayaan & Komoditas</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold">Potensi Desa Tenjonagara</h1>
          <p className="text-emerald-100 max-w-2xl mx-auto text-sm sm:text-base">
            Mulai dari hasil perkebunan teh, pertanian padi organik, UMKM khas warga, hingga objek wisata alam.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3">
          <button
            onClick={() => setActiveKategori('all')}
            className={`px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 ${
              activeKategori === 'all' ? 'bg-primary text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-accent" />
            <span>Semua Potensi</span>
          </button>
          
          <button
            onClick={() => setActiveKategori('pertanian')}
            className={`px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 ${
              activeKategori === 'pertanian' ? 'bg-emerald-700 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Sprout className="w-4 h-4 text-emerald-400" />
            <span>Pertanian & Perkebunan</span>
          </button>

          <button
            onClick={() => setActiveKategori('umkm')}
            className={`px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 ${
              activeKategori === 'umkm' ? 'bg-amber-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Store className="w-4 h-4 text-amber-400" />
            <span>UMKM & Kerajinan</span>
          </button>

          <button
            onClick={() => setActiveKategori('wisata')}
            className={`px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 ${
              activeKategori === 'wisata' ? 'bg-teal-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Trees className="w-4 h-4 text-teal-300" />
            <span>Wisata & Alam</span>
          </button>

          <button
            onClick={() => setActiveKategori('perikanan')}
            className={`px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 ${
              activeKategori === 'perikanan' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Fish className="w-4 h-4 text-blue-300" />
            <span>Perikanan & Peternakan</span>
          </button>
        </div>

        {/* Grid List with Equal Height Cards & Distinctive Category Color Badges */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {filtered.map((item) => {
            const meta = getCategoryMeta(item.kategori);

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-slate-200/90 flex flex-col h-full group"
              >
                {/* Image Container */}
                <div className="h-56 overflow-hidden relative bg-slate-100 shrink-0">
                  <img
                    src={item.gambar_url || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'}
                    alt={item.nama}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className={`absolute top-3 left-3 text-xs px-3.5 py-1.5 rounded-full font-bold tracking-wide shadow-md ${meta.badgeBg}`}>
                    {meta.label}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-6 flex flex-col flex-1 space-y-3">
                  <h3 className="font-bold text-2xl text-slate-800 tracking-tight leading-snug group-hover:text-primary transition-colors">
                    {item.nama}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                    {item.deskripsi}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
