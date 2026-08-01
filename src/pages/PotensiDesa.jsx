import React, { useEffect, useState } from 'react';
import { Sparkles, Sprout, Store, Trees } from 'lucide-react';
import { getPotensiDesa } from '../services/desaService';

export default function PotensiDesa() {
  const [potensiList, setPotensiList] = useState([]);
  const [activeKategori, setActiveKategori] = useState('all');

  useEffect(() => {
    getPotensiDesa()
      .then((res) => setPotensiList(res.data || []))
      .catch(() => setPotensiList([]));
  }, []);

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
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={() => setActiveKategori('all')}
            className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center gap-2 ${
              activeKategori === 'all' ? 'bg-primary text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-accent" />
            <span>Semua Potensi</span>
          </button>
          <button
            onClick={() => setActiveKategori('pertanian')}
            className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center gap-2 ${
              activeKategori === 'pertanian' ? 'bg-primary text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Sprout className="w-4 h-4 text-emerald-400" />
            <span>Pertanian & Perkebunan</span>
          </button>
          <button
            onClick={() => setActiveKategori('umkm')}
            className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center gap-2 ${
              activeKategori === 'umkm' ? 'bg-primary text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Store className="w-4 h-4 text-amber-400" />
            <span>UMKM & Kerajinan</span>
          </button>
          <button
            onClick={() => setActiveKategori('wisata')}
            className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center gap-2 ${
              activeKategori === 'wisata' ? 'bg-primary text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Trees className="w-4 h-4 text-emerald-300" />
            <span>Wisata Alam</span>
          </button>
        </div>

        {/* Grid List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-200 hover:-translate-y-1 transition-all">
              <div className="h-52 overflow-hidden relative">
                <img src={item.gambar_url} alt={item.nama} className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 bg-secondary text-white text-xs px-3 py-1 rounded-md font-semibold uppercase tracking-wider shadow-sm">
                  {item.kategori}
                </span>
              </div>
              <div className="p-6 space-y-3">
                <h3 className="font-bold text-xl text-slate-800">{item.nama}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{item.deskripsi}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
