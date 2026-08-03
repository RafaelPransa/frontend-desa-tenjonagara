import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TreePine, Users, Map, Landmark, ArrowRight, ShieldCheck, Sparkles, FileText, CheckCircle2, ChevronRight, Home, GraduationCap } from 'lucide-react';
import { getProfilDesa, getBerita, getPotensiDesa, getPerangkatDesa } from '../services/desaService';

export default function Beranda() {
  const [profil, setProfil] = useState(null);
  const [beritaList, setBeritaList] = useState([]);
  const [potensiList, setPotensiList] = useState([]);
  const [perangkatList, setPerangkatList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getProfilDesa().catch(() => ({ data: null })),
      getBerita('published').catch(() => ({ data: [] })),
      getPotensiDesa().catch(() => ({ data: [] })),
      getPerangkatDesa().catch(() => ({ data: [] }))
    ]).then(([resProfil, resBerita, resPotensi, resPerangkat]) => {
      setProfil(resProfil.data);
      setBeritaList(resBerita.data ? resBerita.data.slice(0, 3) : []);
      setPotensiList(resPotensi.data ? resPotensi.data.slice(0, 3) : []);
      setPerangkatList(resPerangkat.data ? resPerangkat.data.slice(0, 4) : []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-16 pb-16">

      {/* HERO SECTION */}
      <section className="gradient-hero text-white relative overflow-hidden py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4A017_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-accent backdrop-blur-md border border-white/20 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-accent" />
              Selamat Datang di Portal Resmi
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
              Website Profil <span className="text-accent underline decoration-accent/40">Desa Tenjonagara</span>
            </h1>

            <p className="text-emerald-100 text-base sm:text-lg max-w-2xl leading-relaxed font-light">
              Pusat informasi publik, layanan administrasi digital warga, dan potensi ekonomi lokal Kecamatan Cigalontang, Kabupaten Tasikmalaya.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
              <Link
                to="/layanan"
                className="px-6 py-3.5 rounded-xl bg-accent hover:bg-accent-hover text-primary-dark font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 transform hover:-translate-y-0.5"
              >
                <FileText className="w-5 h-5" />
                <span>Pengajuan Layanan Surat</span>
              </Link>
              <Link
                to="/profil"
                className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold backdrop-blur-md border border-white/20 transition-all flex items-center gap-2"
              >
                <span>Jelajahi Profil Desa</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Quick Stats Cards (Data Terbaru) */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center hover:bg-white/15 transition-all">
              <Users className="w-8 h-8 text-accent mx-auto mb-2" />
              <div className="text-2xl font-bold font-serif text-white">6,146</div>
              <div className="text-xs text-emerald-200 uppercase tracking-wider font-medium">Jiwa Penduduk</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center hover:bg-white/15 transition-all">
              <Home className="w-8 h-8 text-accent mx-auto mb-2" />
              <div className="text-2xl font-bold font-serif text-white">2,262</div>
              <div className="text-xs text-emerald-200 uppercase tracking-wider font-medium">Kepala Keluarga (KK)</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center hover:bg-white/15 transition-all">
              <Users className="w-8 h-8 text-accent mx-auto mb-2" />
              <div className="text-2xl font-bold font-serif text-white">2.70</div>
              <div className="text-xs text-emerald-200 uppercase tracking-wider font-medium">Rata-rata Anggota/KK</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center hover:bg-white/15 transition-all">
              <GraduationCap className="w-8 h-8 text-accent mx-auto mb-2" />
              <div className="text-2xl font-bold font-serif text-white">3,288</div>
              <div className="text-xs text-emerald-200 uppercase tracking-wider font-medium">Terdata Pendidikan</div>
            </div>
          </div>
        </div>
      </section>

      {/* SAMBUTAN KEPALA DESA / PROFIL RINGKAS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-200/80 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-4 flex justify-center">
            <div className="relative">
              <div className="w-56 h-64 sm:w-64 sm:h-72 rounded-2xl overflow-hidden shadow-2xl border-4 border-primary/20">
                <img
                  src={perangkatList[0]?.foto_url || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80"}
                  alt="Kepala Desa Tenjonagara"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-accent text-primary-dark font-bold px-4 py-2 rounded-xl text-xs shadow-lg">
                Kepala Desa Tenjonagara
              </div>
            </div>
          </div>
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-block text-secondary font-bold text-sm tracking-wider uppercase">Sambutan Kuwu / Kepala Desa</div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary">
              Heri Priana
            </h2>
            <p className="text-slate-600 leading-relaxed italic border-l-4 border-accent pl-4 py-1">
              "Sampurasun warga Desa Tenjonagara. Selamat datang di portal resmi desa kami. Website ini kami hadirkan sebagai bentuk transparansi tata kelola pemerintahan desa serta memudahkan seluruh warga dalam mendapatkan informasi dan layanan administrasi tanpa hambatan."
            </p>
            <div className="pt-2">
              <Link to="/profil" className="inline-flex items-center gap-2 text-primary font-semibold hover:text-accent transition-colors">
                <span>Baca Selengkapnya Tentang Desa</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* BERITA TERKINI */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary">Berita & Kabar Desa</h2>
            <p className="text-slate-500 text-sm mt-1">Informasi kegiatan dan kabar terbaru seputar Desa Tenjonagara</p>
          </div>
          <Link to="/berita" className="hidden sm:flex items-center gap-1 text-primary font-semibold hover:text-accent transition-colors text-sm">
            <span>Lihat Semua Berita</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {beritaList.map((item) => (
            <article key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-slate-200 flex flex-col group">
              <div className="h-48 overflow-hidden relative">
                <img
                  src={item.gambar_url || "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80"}
                  alt={item.judul}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 bg-primary text-white text-xs px-2.5 py-1 rounded-md font-medium">
                  Kabar Desa
                </span>
              </div>
              <div className="p-6 flex flex-col flex-grow space-y-3">
                <span className="text-xs text-slate-400">
                  {new Date(item.created_at || Date.now()).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
                <h3 className="font-bold text-lg text-slate-800 group-hover:text-primary transition-colors line-clamp-2">
                  {item.judul}
                </h3>
                <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed">
                  {item.konten}
                </p>
                <div className="pt-4 mt-auto">
                  <Link to={`/berita/${item.slug}`} className="text-primary font-semibold text-sm flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Baca Selengkapnya</span>
                    <ChevronRight className="w-4 h-4 text-accent" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* POTENSI UNGGULAN DESA */}
      <section className="bg-emerald-900/5 py-16 border-y border-emerald-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-secondary font-bold text-sm uppercase tracking-wider">Potensi & Kekayaan Alami</span>
            <h2 className="font-serif text-3xl font-bold text-primary mt-1">Potensi Desa Tenjonagara</h2>
            <p className="text-slate-600 text-sm mt-2">Sektor pertanian, UMKM warga, dan pesona wisata alam Cigalontang</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {potensiList.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200/80 hover:-translate-y-1 transition-all">
                <div className="h-44 rounded-xl overflow-hidden mb-4">
                  <img src={item.gambar_url} alt={item.nama} className="w-full h-full object-cover" />
                </div>
                <span className="inline-block px-3 py-1 bg-accent/20 text-accent-dark text-xs font-bold rounded-full uppercase mb-2">
                  {item.kategori}
                </span>
                <h3 className="font-bold text-xl text-slate-800 mb-2">{item.nama}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{item.deskripsi}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/potensi" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-hover transition-colors shadow-md">
              <span>Jelajahi Semua Potensi Desa</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
