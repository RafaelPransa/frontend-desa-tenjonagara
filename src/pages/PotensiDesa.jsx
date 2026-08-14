import React, { useEffect, useState } from 'react';
import { Sparkles, Sprout, Store, Trees, Fish } from 'lucide-react';
import { getPotensiDesa } from '../services/desaService';
import ScrollReveal from '../components/ScrollReveal';
import Pagination from '../components/Pagination';
import SEOHead from '../components/SEOHead';

export default function PotensiDesa() {
  const [potensiList, setPotensiList] = useState([]);
  const [activeKategori, setActiveKategori] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    getPotensiDesa()
      .then((res) => setPotensiList(res.data || []))
      .catch(() => setPotensiList([]));
  }, []);

  const handleCategoryChange = (kat) => {
    setActiveKategori(kat);
    setCurrentPage(1);
  };

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

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedPotensi = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-16 pb-20">
      <SEOHead
        title="Potensi Unggulan & Komoditas Desa Tenjonagara"
        description="Eksplorasi kekayaan dan potensi Desa Tenjonagara — sektor pertanian padi organik, perkebunan teh Cigalontang, produk olahan UMKM warga, destinasi wisata alam, serta peternakan dan perikanan."
        url="/potensi"
      />

      {/* Header */}
      <section className="gradient-hero text-white py-16 px-4 sm:px-6 lg:px-8 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4A017_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="max-w-7xl mx-auto text-center space-y-3 relative z-10">
          <ScrollReveal direction="down" delay={0}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-accent backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-4 h-4 text-accent" />
              Kekayaan & Komoditas
            </span>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={100}>
            <h1 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight">
              Potensi <span className="text-accent">Desa Tenjonagara</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={200}>
            <p className="text-emerald-100 max-w-2xl mx-auto text-sm sm:text-base font-light">
              Mulai dari hasil perkebunan teh, pertanian padi organik, UMKM khas warga, hingga objek wisata alam.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Category Tabs */}
        <ScrollReveal direction="up" delay={100}>
          <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3">
            <button
              onClick={() => handleCategoryChange('all')}
              className={`px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 ${
                activeKategori === 'all' ? 'bg-primary text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Sparkles className="w-4 h-4 text-accent" />
              <span>Semua Potensi</span>
            </button>
            
            <button
              onClick={() => handleCategoryChange('pertanian')}
              className={`px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 ${
                activeKategori === 'pertanian' ? 'bg-emerald-700 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Sprout className="w-4 h-4 text-emerald-400" />
              <span>Pertanian & Perkebunan</span>
            </button>

            <button
              onClick={() => handleCategoryChange('umkm')}
              className={`px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 ${
                activeKategori === 'umkm' ? 'bg-amber-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Store className="w-4 h-4 text-amber-400" />
              <span>UMKM & Kerajinan</span>
            </button>

            <button
              onClick={() => handleCategoryChange('wisata')}
              className={`px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 ${
                activeKategori === 'wisata' ? 'bg-teal-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Trees className="w-4 h-4 text-teal-300" />
              <span>Wisata & Alam</span>
            </button>

            <button
              onClick={() => handleCategoryChange('perikanan')}
              className={`px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 ${
                activeKategori === 'perikanan' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Fish className="w-4 h-4 text-blue-300" />
              <span>Perikanan & Peternakan</span>
            </button>
          </div>
        </ScrollReveal>

        {/* Grid List with ScrollReveal Animations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {paginatedPotensi.map((item, index) => {
            const meta = getCategoryMeta(item.kategori);

            return (
              <ScrollReveal key={item.id} direction="up" delay={(index % 3) * 150}>
                <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 flex flex-col h-full group transform hover:-translate-y-1.5">
                  {/* Image Container */}
                  <div className="h-56 overflow-hidden relative bg-slate-100 shrink-0">
                    <img
                      src={item.gambar_url || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'}
                      alt={item.nama}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
              </ScrollReveal>
            );
          })}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filtered.length}
          itemsPerPage={itemsPerPage}
        />
      </div>
    </div>
  );
}


