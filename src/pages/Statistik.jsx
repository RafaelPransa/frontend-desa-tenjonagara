import React, { useEffect, useState } from 'react';
import { BarChart3, Users, Home, GraduationCap, Award } from 'lucide-react';
import { getStatistikPenduduk } from '../services/desaService';

export default function Statistik() {
  const [statistik, setStatistik] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStatistikPenduduk()
      .then((res) => {
        const data = res.data || res || [];
        setStatistik(Array.isArray(data) ? data : [data]);
        setLoading(false);
      })
      .catch(() => {
        setStatistik([]);
        setLoading(false);
      });
  }, []);

  const defaultPendidikan = [
    { tingkat: 'Tidak/Belum sekolah', jumlah: 500, persentase: 8.14 },
    { tingkat: 'Tamat SD/Sederajat', jumlah: 2793, persentase: 45.44 },
    { tingkat: 'Tamat SMP/Sederajat', jumlah: 1343, persentase: 21.85 },
    { tingkat: 'Tamat SLTA/Sederajat', jumlah: 971, persentase: 15.8 },
    { tingkat: 'Tamat Diploma I-II', jumlah: 20, persentase: 0.33 },
    { tingkat: 'Tamat Diploma III', jumlah: 35, persentase: 0.57 },
    { tingkat: 'Tamat S1', jumlah: 470, persentase: 7.65 },
    { tingkat: 'Tamat S2', jumlah: 14, persentase: 0.23 }
  ];

  const statTerbaru = (Array.isArray(statistik) && statistik[0]) || {
    tahun: 2026,
    jumlah_total: 6146,
    jumlah_kk: 2262,
    rata_anggota_keluarga: 2.7,
    pendidikan: defaultPendidikan
  };

  const getShortName = (tingkat) => {
    if (!tingkat) return '';
    if (tingkat.includes('Tidak') || tingkat.includes('Belum')) return 'Blm/Tdk';
    if (tingkat.includes('SD')) return 'SD';
    if (tingkat.includes('SMP')) return 'SMP';
    if (tingkat.includes('SLTA') || tingkat.includes('SMA')) return 'SLTA';
    if (tingkat.includes('Diploma I-II') || tingkat.includes('D1-D2') || tingkat.includes('I-II')) return 'D1-D2';
    if (tingkat.includes('Diploma III') || tingkat.includes('D3') || tingkat.includes('III')) return 'D3';
    if (tingkat.includes('S1') || tingkat.includes('Sarjana')) return 'S1';
    if (tingkat.includes('S2') || tingkat.includes('Magister')) return 'S2';
    return tingkat.slice(0, 5);
  };

  const getThemeProps = (idx) => {
    const themes = [
      { gradient: 'linear-gradient(180deg, #475569 0%, #1E293B 100%)', badgeBg: 'bg-slate-100 text-slate-800 border-slate-300' },
      { gradient: 'linear-gradient(180deg, #3F664C 0%, #2D4B37 100%)', badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
      { gradient: 'linear-gradient(180deg, #10B981 0%, #047857 100%)', badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
      { gradient: 'linear-gradient(180deg, #9E7761 0%, #7D5C4A 100%)', badgeBg: 'bg-amber-50 text-amber-900 border-amber-200' },
      { gradient: 'linear-gradient(180deg, #E5B83B 0%, #D4A017 100%)', badgeBg: 'bg-yellow-50 text-yellow-900 border-yellow-200' },
      { gradient: 'linear-gradient(180deg, #14B8A6 0%, #0F766E 100%)', badgeBg: 'bg-teal-50 text-teal-800 border-teal-200' },
      { gradient: 'linear-gradient(180deg, #6366F1 0%, #4338CA 100%)', badgeBg: 'bg-indigo-50 text-indigo-800 border-indigo-200' },
      { gradient: 'linear-gradient(180deg, #8B5CF6 0%, #6D28D9 100%)', badgeBg: 'bg-purple-50 text-purple-800 border-purple-200' }
    ];
    return themes[idx % themes.length];
  };

  let rawPendidikan = defaultPendidikan;
  if (Array.isArray(statTerbaru.pendidikan) && statTerbaru.pendidikan.length > 0) {
    rawPendidikan = statTerbaru.pendidikan;
  } else if (typeof statTerbaru.pendidikan === 'string') {
    try {
      const parsed = JSON.parse(statTerbaru.pendidikan);
      if (Array.isArray(parsed) && parsed.length > 0) {
        rawPendidikan = parsed;
      }
    } catch (e) {
      // fallback
    }
  }

  const dataPendidikan = rawPendidikan.map((item, idx) => {
    const theme = getThemeProps(idx);
    const jumlah = Number(item.jumlah) || 0;
    const persentase = item.persentase !== undefined ? Number(item.persentase) : 0;
    return {
      tingkat: item.tingkat,
      short: getShortName(item.tingkat),
      jumlah,
      persentase,
      gradient: theme.gradient,
      badgeBg: theme.badgeBg
    };
  });

  const maxJumlah = dataPendidikan.length > 0 ? Math.max(...dataPendidikan.map((d) => d.jumlah)) || 1 : 1;
  const totalTercatatPendidikan = dataPendidikan.reduce((acc, curr) => acc + curr.jumlah, 0);

  return (
    <div className="space-y-12 pb-16">
      {/* Header Banner */}
      <section className="bg-primary text-white py-14 px-4 sm:px-6 lg:px-8 shadow-inner">
        <div className="max-w-7xl mx-auto text-center space-y-3">
          <span className="text-accent font-semibold text-sm uppercase tracking-widest">Statistik Kependudukan</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold">Statistik Penduduk Desa</h1>
          <p className="text-emerald-100 max-w-2xl mx-auto text-sm sm:text-base">
            Informasi demografi resmi kependudukan dan grafik batang tingkat pendidikan warga Desa Tenjonagara.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* STATISTIK DEMOGRAFI UTAMA */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/20 text-accent-dark flex items-center justify-center font-bold">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-primary">
                Demografi Penduduk Desa Tenjonagara (Tahun {statTerbaru.tahun || 2026})
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm">Data statistik kependudukan resmi terdaftar</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200 border-t-4 border-t-primary hover:shadow-lg transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Penduduk</span>
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div className="text-3xl font-serif font-bold text-primary mt-2">
                {statTerbaru.jumlah_total ? Number(statTerbaru.jumlah_total).toLocaleString('id-ID') : '6,146'}
              </div>
              <div className="text-xs text-emerald-700 font-semibold mt-1">Jiwa Terdaftar</div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200 border-t-4 border-t-secondary hover:shadow-lg transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Jumlah Kepala Keluarga</span>
                <Home className="w-5 h-5 text-secondary" />
              </div>
              <div className="text-3xl font-serif font-bold text-secondary mt-2">
                {statTerbaru.jumlah_kk ? Number(statTerbaru.jumlah_kk).toLocaleString('id-ID') : '2,262'}
              </div>
              <div className="text-xs text-slate-500 font-medium mt-1">Kepala Keluarga (KK)</div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200 border-t-4 border-t-accent hover:shadow-lg transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Rata-rata Anggota</span>
                <Users className="w-5 h-5 text-accent-dark" />
              </div>
              <div className="text-3xl font-serif font-bold text-slate-800 mt-2">
                {statTerbaru.rata_anggota_keluarga || '2.7'}
              </div>
              <div className="text-xs text-amber-700 font-semibold mt-1">Jiwa per Kepala Keluarga</div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200 border-t-4 border-t-emerald-600 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Terdata Pendidikan</span>
                <GraduationCap className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-3xl font-serif font-bold text-emerald-800 mt-2">
                {totalTercatatPendidikan.toLocaleString('id-ID')}
              </div>
              <div className="text-xs text-emerald-700 font-semibold mt-1">Warga Terdata Sekolah</div>
            </div>
          </div>
        </section>

        {/* GRAFIK BATANG TEGAK (VERTICAL BAR CHART) TINGKAT PENDIDIKAN */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary text-accent flex items-center justify-center font-bold shadow-md shrink-0">
                <BarChart3 className="w-7 h-7 text-accent" />
              </div>
              <div>
                <h2 className="font-serif text-2xl font-bold text-primary">Grafik Batang Tingkat Pendidikan Warga</h2>
                <p className="text-slate-500 text-xs sm:text-sm">
                  Diagram statistik jenjang pendidikan terdaftar di Desa Tenjonagara (8 Kategori)
                </p>
              </div>
            </div>
            <div className="bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center gap-2 shrink-0">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>Total Terdata: {totalTercatatPendidikan.toLocaleString('id-ID')} Jiwa</span>
            </div>
          </div>

          {/* Visual Vertical Bar Chart (Grafik Batang Tegak) */}
          <div className="pt-6 pb-2">
            <div className="w-full flex items-end justify-between gap-1.5 sm:gap-4 px-1 sm:px-4 border-b-2 border-slate-300 relative">
              {/* Y-Axis Gridlines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                <div className="border-b border-slate-400 w-full"></div>
                <div className="border-b border-slate-400 w-full"></div>
                <div className="border-b border-slate-400 w-full"></div>
                <div className="border-b border-slate-400 w-full"></div>
              </div>

              {/* Vertical Bars */}
              {dataPendidikan.map((item, idx) => {
                const heightPercent = Math.max((item.jumlah / maxJumlah) * 100, 6);

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center justify-end group z-10">
                    {/* Top Label (Count & Percentage Badge) */}
                    <div className="mb-2.5 text-center transition-all transform group-hover:-translate-y-1">
                      <div className="text-[11px] sm:text-xs font-bold font-mono text-slate-800">
                        {item.jumlah.toLocaleString('id-ID')}
                      </div>
                      <div className={`text-[9px] sm:text-[11px] font-semibold px-1.5 py-0.5 rounded border mt-0.5 whitespace-nowrap ${item.badgeBg}`}>
                        {item.persentase}%
                      </div>
                    </div>

                    {/* Outer Track with explicit Height (h-48 sm:h-60) */}
                    <div className="w-full max-w-[48px] h-44 sm:h-60 bg-slate-100/90 rounded-t-xl overflow-hidden shadow-inner flex items-end border border-slate-200">
                      {/* Inner Filled Bar */}
                      <div
                        className="w-full rounded-t-lg transition-all duration-700 ease-out group-hover:brightness-110 group-hover:shadow-lg"
                        style={{
                          height: `${heightPercent}%`,
                          background: item.gradient
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* X-Axis Labels */}
            <div className="flex justify-between gap-1.5 sm:gap-4 px-1 sm:px-4 pt-4 text-center">
              {dataPendidikan.map((item, idx) => (
                <div key={idx} className="flex-1">
                  <span className="font-bold text-[11px] sm:text-xs text-slate-800 block truncate" title={item.tingkat}>
                    {item.short}
                  </span>
                  <span className="text-[9px] sm:text-[11px] text-slate-500 hidden md:block truncate">
                    {item.tingkat}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Grid Cards Summary Ringkasan Grafik */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 pt-4 border-t border-slate-100 text-center">
            {dataPendidikan.map((item, idx) => (
              <div key={idx} className="bg-surface p-3 rounded-xl border border-slate-200 space-y-1 hover:border-primary transition-colors">
                <div className="text-[11px] font-semibold text-slate-500 truncate" title={item.tingkat}>{item.tingkat}</div>
                <div className="text-base font-bold font-mono text-slate-800">{item.jumlah.toLocaleString('id-ID')}</div>
                <div className="text-xs font-bold text-primary">{item.persentase}%</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
