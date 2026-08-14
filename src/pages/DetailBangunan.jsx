import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Building2, ExternalLink } from 'lucide-react';
import { getBangunanDesaById } from '../services/desaService';
import SEOHead from '../components/SEOHead';

export default function DetailBangunan() {
  const { id } = useParams();
  const [bangunan, setBangunan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBangunanDesaById(id)
      .then((res) => setBangunan(res.data))
      .catch(() => setBangunan(null))
      .finally(() => setLoading(false));
  }, [id]);

  const getCategoryMeta = (kategori) => {
    switch (kategori) {
      case 'fasilitas_pendidikan':
      case 'pendidikan':
        return { label: 'Pendidikan', badgeBg: 'bg-blue-600 text-white' };
      case 'fasilitas_kesehatan':
      case 'kesehatan':
        return { label: 'Kesehatan', badgeBg: 'bg-rose-600 text-white' };
      case 'fasilitas_umum':
      case 'pemerintahan':
        return { label: 'Umum & Kantor', badgeBg: 'bg-emerald-800 text-white' };
      case 'fasilitas_ibadah':
      case 'keagamaan':
        return { label: 'Ibadah', badgeBg: 'bg-amber-600 text-white' };
      case 'fasilitas_olahraga':
      case 'ekonomi_sosial':
        return { label: 'Olahraga', badgeBg: 'bg-purple-600 text-white' };
      default:
        return { label: kategori || 'Fasilitas Desa', badgeBg: 'bg-slate-700 text-white' };
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-slate-500 font-medium">Memuat detail bangunan desa...</p>
      </div>
    );
  }

  if (!bangunan) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Bangunan Tidak Ditemukan</h2>
        <p className="text-slate-500 text-sm">Data bangunan desa yang Anda cari tidak tersedia.</p>
        <Link to="/bangunan" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-semibold">
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Bangunan</span>
        </Link>
      </div>
    );
  }

  const meta = getCategoryMeta(bangunan.kategori);
  const excerpt = bangunan?.deskripsi
    ? bangunan.deskripsi.replace(/\s+/g, ' ').trim().substring(0, 160) + '...'
    : `Informasi detail fasilitas dan bangunan ${bangunan.nama} di Desa Tenjonagara, Kec. Cigalontang.`;

  return (
    <div className="space-y-10 pb-16">
      <SEOHead
        title={`${bangunan.nama} — Fasilitas Desa Tenjonagara`}
        description={excerpt}
        image={bangunan.gambar_url}
        url={`/bangunan/${id}`}
      />

      {/* Top Header Navigation */}
      <section className="bg-primary text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/bangunan" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-md transition-all">
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Daftar Bangunan</span>
          </Link>
          <span className="text-xs text-emerald-200 uppercase font-mono tracking-wider hidden sm:inline">Detail Bangunan Desa</span>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Hero Section */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-200 space-y-6">
          <div className="h-72 sm:h-96 w-full overflow-hidden relative bg-slate-100">
            <img
              src={bangunan.gambar_url || 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80'}
              alt={bangunan.nama}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-6 sm:p-10">
              <div className="space-y-2 text-white">
                <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold shadow-md uppercase tracking-wider ${meta.badgeBg}`}>
                  {meta.label}
                </span>
                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
                  {bangunan.nama}
                </h1>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-10 space-y-8">
            {/* Location & Address Box */}
            <div className="bg-emerald-50/80 p-5 rounded-2xl border border-emerald-200/80 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                <MapPin className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base">Alamat / Lokasi Bangunan</h3>
                <p className="text-slate-700 text-sm mt-1 leading-relaxed">{bangunan.alamat}</p>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h2 className="font-serif text-2xl font-bold text-primary flex items-center gap-2">
                <Building2 className="w-6 h-6 text-accent" />
                <span>Deskripsi & Fungsi Bangunan</span>
              </h2>
              <p className="text-slate-700 leading-relaxed text-base whitespace-pre-line">
                {bangunan.deskripsi}
              </p>
            </div>

            {/* Google Maps Interactive Section */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h2 className="font-serif text-2xl font-bold text-primary flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-accent" />
                  <span>Peta Lokasi Google Maps</span>
                </h2>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(bangunan.nama + ' ' + bangunan.alamat)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-accent transition-colors"
                >
                  <span>Buka di Aplikasi Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Map Embed Frame */}
              <div className="w-full h-80 sm:h-96 rounded-2xl overflow-hidden shadow-md border border-slate-300 relative bg-slate-100">
                <iframe
                  title={`Lokasi ${bangunan.nama}`}
                  src={bangunan.maps_embed_url || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15828.324912384917!2d108.064512345!3d-7.3456789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6f56789abcdef%3A0x123456789abcdef!2sCigalontang%2C%20Tasikmalaya%20Regency%2C%20West%20Java!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid'}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
