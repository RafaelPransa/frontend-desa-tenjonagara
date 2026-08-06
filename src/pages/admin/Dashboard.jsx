import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Newspaper,
  Building2,
  Sparkles,
  FileText,
  Users,
  BarChart3,
  ArrowUpRight,
  ShieldCheck,
  Plus,
  Clock,
  Inbox
} from 'lucide-react';
import {
  getBerita,
  getBangunanDesa,
  getPotensiDesa,
  getLayanan,
  getPerangkatDesa
} from '../../services/desaService';
import ScrollReveal from '../../components/ScrollReveal';

export default function Dashboard() {
  const [stats, setStats] = useState({
    berita: 0,
    bangunan: 0,
    potensi: 0,
    layanan: 0,
    perangkat: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      try {
        const [beritaRes, bangunanRes, potensiRes, layananRes, perangkatRes] = await Promise.all([
          getBerita().catch(() => ({ data: [] })),
          getBangunanDesa().catch(() => ({ data: [] })),
          getPotensiDesa().catch(() => ({ data: [] })),
          getLayanan().catch(() => ({ data: [] })),
          getPerangkatDesa().catch(() => ({ data: [] })),
        ]);

        setStats({
          berita: Array.isArray(beritaRes.data) ? beritaRes.data.length : 0,
          bangunan: Array.isArray(bangunanRes.data) ? bangunanRes.data.length : 0,
          potensi: Array.isArray(potensiRes.data) ? potensiRes.data.length : 0,
          layanan: Array.isArray(layananRes.data) ? layananRes.data.length : 0,
          perangkat: Array.isArray(perangkatRes.data) ? perangkatRes.data.length : 0,
        });
      } catch (err) {
        console.error('Error fetching dashboard metrics', err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const cards = [
    { title: 'Total Berita', count: stats.berita, icon: Newspaper, color: 'bg-emerald-500', link: '/admin/berita' },
    { title: 'Bangunan Desa', count: stats.bangunan, icon: Building2, color: 'bg-blue-500', link: '/admin/bangunan' },
    { title: 'Potensi Desa', count: stats.potensi, icon: Sparkles, color: 'bg-amber-500', link: '/admin/potensi' },
    { title: 'Layanan Publik', count: stats.layanan, icon: FileText, color: 'bg-indigo-500', link: '/admin/layanan' },
    { title: 'Perangkat Desa', count: stats.perangkat, icon: Users, color: 'bg-purple-500', link: '/admin/perangkat' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <ScrollReveal direction="down" delay={0}>
        <div className="bg-gradient-to-r from-primary via-emerald-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/20 border border-accent/40 text-accent text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Administrator Authenticated</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              Selamat Datang di Panel Kelola Desa Tenjonagara
            </h1>
            <p className="text-emerald-100 text-xs sm:text-sm max-w-2xl font-light">
              Kelola verifikasi pengajuan surat warga, artikel berita, fasilitas fisik bangunan, potensi ekonomi desa, serta informasi perangkat desa secara efisien dari satu tempat.
            </p>
          </div>
          <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 opacity-10 pointer-events-none">
            <ShieldCheck className="w-72 h-72 text-white" />
          </div>
        </div>
      </ScrollReveal>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <ScrollReveal key={idx} direction="up" delay={idx * 100}>
              <Link
                to={card.link}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all group flex flex-col justify-between transform hover:-translate-y-1 h-full"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-3 rounded-xl ${card.color} text-white shadow-sm group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-800 tracking-tight">
                    {loading ? '...' : card.count}
                  </div>
                  <div className="text-xs font-semibold text-slate-500 mt-0.5">{card.title}</div>
                </div>
              </Link>
            </ScrollReveal>
          );
        })}
      </div>

      {/* Quick Action Cards - Full Width */}
      <ScrollReveal direction="up" delay={200}>
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            <span>Aksi Cepat Manajemen Admin</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/admin/pengajuan"
              className="p-5 rounded-2xl border border-slate-200 hover:border-primary/50 hover:bg-emerald-50/50 transition-all flex items-center gap-3.5 group transform hover:-translate-y-1"
            >
              <div className="p-3 rounded-xl bg-amber-100 text-amber-800 group-hover:bg-accent group-hover:text-primary-dark transition-colors shrink-0">
                <Inbox className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-primary transition-colors">
                  Verifikasi Surat
                </div>
                <div className="text-[11px] text-slate-500">Cek permohonan warga</div>
              </div>
            </Link>

            <Link
              to="/admin/berita/tambah"
              className="p-5 rounded-2xl border border-slate-200 hover:border-primary/50 hover:bg-emerald-50/50 transition-all flex items-center gap-3.5 group transform hover:-translate-y-1"
            >
              <div className="p-3 rounded-xl bg-emerald-100 text-primary group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
                <Newspaper className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-primary transition-colors">
                  Buat Berita Baru
                </div>
                <div className="text-[11px] text-slate-500">Tulis publikasi desa</div>
              </div>
            </Link>

            <Link
              to="/admin/bangunan"
              className="p-5 rounded-2xl border border-slate-200 hover:border-primary/50 hover:bg-emerald-50/50 transition-all flex items-center gap-3.5 group transform hover:-translate-y-1"
            >
              <div className="p-3 rounded-xl bg-blue-100 text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
                  Kelola Bangunan
                </div>
                <div className="text-[11px] text-slate-500">Perbarui aset fisik</div>
              </div>
            </Link>

            <Link
              to="/admin/statistik"
              className="p-5 rounded-2xl border border-slate-200 hover:border-primary/50 hover:bg-emerald-50/50 transition-all flex items-center gap-3.5 group transform hover:-translate-y-1"
            >
              <div className="p-3 rounded-xl bg-purple-100 text-purple-700 group-hover:bg-purple-600 group-hover:text-white transition-colors shrink-0">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-purple-700 transition-colors">
                  Update Demografi
                </div>
                <div className="text-[11px] text-slate-500">Perbarui data jiwa & KK</div>
              </div>
            </Link>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}


