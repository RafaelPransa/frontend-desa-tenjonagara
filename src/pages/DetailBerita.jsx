import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Share2, Tag, Newspaper } from 'lucide-react';
import { getBeritaBySlug } from '../services/desaService';
import SEOHead from '../components/SEOHead';

export default function DetailBerita() {
  const { slug } = useParams();
  const [berita, setBerita] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    getBeritaBySlug(slug)
      .then((res) => {
        if (res.data) {
          setBerita(res.data);
        } else {
          setError(true);
        }
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-slate-500 font-medium">Memuat artikel berita...</p>
      </div>
    );
  }

  if (error || !berita) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-6">
        <SEOHead
          title="Berita Tidak Ditemukan — Desa Tenjonagara"
          description="Artikel berita yang Anda cari tidak ditemukan atau telah dihapus."
          url={`/berita/${slug}`}
        />
        <div className="w-20 h-20 bg-rose-50 text-rose-500 border border-rose-100 rounded-3xl flex items-center justify-center mx-auto">
          <Newspaper className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-serif font-bold text-slate-800">Berita Tidak Ditemukan</h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            Maaf, artikel berita yang Anda tuju tidak ditemukan atau mungkin sudah dihapus oleh pengelola desa.
          </p>
        </div>
        <div className="pt-2">
          <Link
            to="/berita"
            className="px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold text-sm transition-all shadow-md inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4 text-accent" />
            <span>Kembali ke Daftar Berita</span>
          </Link>
        </div>
      </div>
    );
  }

  const excerpt = berita?.konten 
    ? berita.konten.replace(/\s+/g, ' ').trim().substring(0, 160) + '...'
    : 'Baca berita dan pengumuman resmi terkini dari Pemerintah Desa Tenjonagara.';

  return (
    <div className="pb-20 space-y-10">
      <SEOHead
        title={berita?.judul}
        description={excerpt}
        image={berita?.gambar_url}
        url={`/berita/${slug}`}
        type="article"
      />

      {/* Header Banner */}
      <section className="bg-primary text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-4">
          <Link to="/berita" className="inline-flex items-center gap-2 text-accent hover:underline text-sm font-semibold">
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Daftar Berita
          </Link>
          <div className="flex items-center gap-3 text-xs text-emerald-200">
            <span className="bg-accent/20 text-accent font-semibold px-3 py-1 rounded-full border border-accent/30">
              Publikasi Resmi Desa
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-accent" />
              {new Date(berita?.created_at || Date.now()).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold leading-tight">
            {berita?.judul}
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <User className="w-4 h-4 text-accent" />
            <span>Ditulis oleh: <strong>{berita?.penulis?.nama || 'Admin Desa Tenjonagara'}</strong></span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <article className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200 space-y-8">
          {/* Main Hero Photo */}
          <div className="rounded-2xl overflow-hidden shadow-md max-h-[450px]">
            <img
              src={berita?.gambar_url || 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80'}
              alt={berita?.judul}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Article Text Paragraphs */}
          <div className="prose prose-emerald max-w-none text-slate-700 leading-relaxed text-base sm:text-lg space-y-6 whitespace-pre-line font-sans">
            {berita?.konten}
          </div>

          {/* Footer Action & Back Button */}
          <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Tag className="w-4 h-4 text-primary" />
              <span>Kategori: Berita Desa, Pembangunan, Warga</span>
            </div>
            <Link
              to="/berita"
              className="px-6 py-3 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary-dark transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              <ArrowLeft className="w-4 h-4 text-accent" />
              Lihat Berita Lainnya
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}
