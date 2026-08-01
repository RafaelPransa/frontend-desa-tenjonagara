import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, Calendar, User, Search, ChevronRight } from 'lucide-react';
import { getBerita } from '../services/desaService';

export default function Berita() {
  const [beritaList, setBeritaList] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBerita('published')
      .then((res) => {
        setBeritaList(res.data || []);
      })
      .catch(() => setBeritaList([]))
      .finally(() => setLoading(false));
  }, []);

  const filteredBerita = beritaList.filter((b) =>
    b.judul.toLowerCase().includes(search.toLowerCase()) ||
    b.konten.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-12 pb-16">
      {/* Header */}
      <section className="bg-primary text-white py-14 px-4 sm:px-6 lg:px-8 shadow-inner">
        <div className="max-w-7xl mx-auto text-center space-y-3">
          <span className="text-accent font-semibold text-sm uppercase tracking-widest">Informasi & Pembangunan</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold">Kabar & Berita Desa</h1>
          <p className="text-emerald-100 max-w-2xl mx-auto text-sm sm:text-base">
            Dapatkan berita terkini kegiatan, pengumuman resmi, dan dinamika warga Desa Tenjonagara.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Search Bar */}
        <div className="max-w-md mx-auto relative">
          <input
            type="text"
            placeholder="Cari kata kunci berita..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm bg-white"
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
        </div>

        {/* Grid List Berita */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBerita.map((item) => (
            <article key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-slate-200 flex flex-col group">
              <Link to={`/berita/${item.slug}`} className="h-48 overflow-hidden relative block">
                <img
                  src={item.gambar_url || "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80"}
                  alt={item.judul}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 bg-primary text-white text-xs px-3 py-1 rounded-md font-medium shadow-sm">
                  Publikasi Resmi
                </span>
              </Link>
              <div className="p-6 flex flex-col flex-grow space-y-3">
                <div className="flex items-center gap-4 text-xs text-slate-400">
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
                    className="text-primary font-semibold text-sm flex items-center gap-1 group-hover:translate-x-1 transition-transform inline-flex"
                  >
                    <span>Baca Artikel Lengkap</span>
                    <ChevronRight className="w-4 h-4 text-accent" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </div>
  );
}
