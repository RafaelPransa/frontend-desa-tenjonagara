import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, Calendar, User, Search, ChevronRight, Sparkles } from 'lucide-react';
import { getBerita } from '../services/desaService';
import ScrollReveal from '../components/ScrollReveal';
import Pagination from '../components/Pagination';

export default function Berita() {
  const [beritaList, setBeritaList] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    getBerita('published')
      .then((res) => {
        setBeritaList(res.data || []);
      })
      .catch(() => setBeritaList([]))
      .finally(() => setLoading(false));
  }, []);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const filteredBerita = beritaList.filter((b) =>
    b.judul.toLowerCase().includes(search.toLowerCase()) ||
    b.konten.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBerita.length / itemsPerPage);
  const paginatedBerita = filteredBerita.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );


  return (
    <div className="space-y-16 pb-20">
      {/* Header */}
      <section className="gradient-hero text-white py-16 px-4 sm:px-6 lg:px-8 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4A017_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="max-w-7xl mx-auto text-center space-y-3 relative z-10">
          <ScrollReveal direction="down" delay={0}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-accent backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-4 h-4 text-accent" />
              Informasi & Pembangunan
            </span>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={100}>
            <h1 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight">
              Kabar & Berita <span className="text-accent">Desa Tenjonagara</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={200}>
            <p className="text-emerald-100 max-w-2xl mx-auto text-sm sm:text-base font-light">
              Dapatkan berita terkini kegiatan, pengumuman resmi, dan dinamika warga Desa Tenjonagara.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Search Bar */}
        <ScrollReveal direction="up" delay={100}>
          <div className="max-w-md mx-auto relative">
            <input
              type="text"
              placeholder="Cari kata kunci berita..."
              value={search}
              onChange={handleSearchChange}
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-300 shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm bg-white"
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-4" />
          </div>
        </ScrollReveal>

        {/* Grid List Berita with ScrollReveal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedBerita.map((item, index) => (
            <ScrollReveal key={item.id} direction="up" delay={(index % 3) * 150}>
              <article className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 flex flex-col group h-full transform hover:-translate-y-1.5">
                <Link to={`/berita/${item.slug}`} className="h-52 overflow-hidden relative block">
                  <img
                    src={item.gambar_url || "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80"}
                    alt={item.judul}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-primary/90 backdrop-blur-md text-white text-xs px-3 py-1 rounded-lg font-bold shadow-md">
                    Publikasi Resmi
                  </span>
                </Link>
                <div className="p-6 flex flex-col flex-grow space-y-3">
                  <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-accent" />
                      {new Date(item.created_at || Date.now()).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-accent" />
                      {item.penulis?.nama || 'Admin Desa'}
                    </span>
                  </div>

                  <h2 className="font-bold text-lg text-slate-800 group-hover:text-primary transition-colors line-clamp-2">
                    <Link to={`/berita/${item.slug}`}>
                      {item.judul}
                    </Link>
                  </h2>
                  
                  <p className="text-slate-600 text-sm line-clamp-4 leading-relaxed">
                    {item.konten}
                  </p>

                  <div className="pt-4 mt-auto border-t border-slate-100">
                    <Link
                      to={`/berita/${item.slug}`}
                      className="text-primary font-bold text-sm flex items-center gap-1 group-hover:translate-x-1 transition-transform inline-flex"
                    >
                      <span>Baca Artikel Lengkap</span>
                      <ChevronRight className="w-4 h-4 text-accent" />
                    </Link>
                  </div>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredBerita.length}
          itemsPerPage={itemsPerPage}
        />
      </div>
    </div>
  );
}


