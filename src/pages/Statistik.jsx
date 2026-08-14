import React, { useEffect, useState } from 'react';
import { BarChart3, Users, Home, GraduationCap, Award, Briefcase, RefreshCw, Sparkles } from 'lucide-react';
import { getStatistikPenduduk } from '../services/desaService';
import ScrollReveal from '../components/ScrollReveal';
import SEOHead from '../components/SEOHead';

export default function Statistik() {
  const [statistik, setStatistik] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStatistikPenduduk()
      .then((res) => {
        const payload = res.data || res;
        const list = Array.isArray(payload)
          ? payload
          : payload?.data && Array.isArray(payload.data)
          ? payload.data
          : [payload];
        setStatistik(list);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Gagal memuat statistik:', err);
        setStatistik([]);
        setLoading(false);
      });
  }, []);

  const defaultPendidikan = [
    { tingkat: 'Tidak/Belum sekolah', jumlah: 1306, persentase: 17.86 },
    { tingkat: 'Belum Tamat SD/Sederajat', jumlah: 757, persentase: 10.35 },
    { tingkat: 'Tamat SD/Sederajat', jumlah: 2871, persentase: 39.26 },
    { tingkat: 'Tamat SMP/Sederajat', jumlah: 1141, persentase: 15.60 },
    { tingkat: 'Tamat SLTA/Sederajat', jumlah: 986, persentase: 13.48 },
    { tingkat: 'Tamat Diploma I-II', jumlah: 9, persentase: 0.12 },
    { tingkat: 'Tamat Diploma III', jumlah: 19, persentase: 0.26 },
    { tingkat: 'Tamat S1/D-IV', jumlah: 111, persentase: 1.52 },
    { tingkat: 'Tamat S2', jumlah: 10, persentase: 0.14 }
  ];

  const defaultPekerjaan = [
    { pekerjaan: 'Mengurus Rumah Tangga', jumlah: 1925, persentase: 26.33 },
    { pekerjaan: 'Belum/Tidak Bekerja', jumlah: 1466, persentase: 20.05 },
    { pekerjaan: 'Pelajar/Mahasiswa', jumlah: 1353, persentase: 18.50 },
    { pekerjaan: 'Buruh Harian Lepas', jumlah: 1281, persentase: 17.52 },
    { pekerjaan: 'Wiraswasta', jumlah: 600, persentase: 8.21 },
    { pekerjaan: 'Petani / Pekebun', jumlah: 210, persentase: 2.87 },
    { pekerjaan: 'Pedagang', jumlah: 147, persentase: 2.01 },
    { pekerjaan: 'Karyawan Swasta', jumlah: 64, persentase: 0.88 },
    { pekerjaan: 'Buruh Tani / Perkebunan', jumlah: 34, persentase: 0.46 },
    { pekerjaan: 'Karyawan Honorer', jumlah: 27, persentase: 0.37 },
    { pekerjaan: 'Pensiunan', jumlah: 26, persentase: 0.36 },
    { pekerjaan: 'PNS', jumlah: 21, persentase: 0.29 },
    { pekerjaan: 'Guru', jumlah: 19, persentase: 0.26 },
    { pekerjaan: 'Bidan', jumlah: 5, persentase: 0.07 },
    { pekerjaan: 'Tukang Cukur', jumlah: 5, persentase: 0.07 },
    { pekerjaan: 'Sopir', jumlah: 4, persentase: 0.05 },
    { pekerjaan: 'Perdagangan', jumlah: 4, persentase: 0.05 },
    { pekerjaan: 'Karyawan BUMN', jumlah: 3, persentase: 0.04 },
    { pekerjaan: 'Perangkat Desa', jumlah: 3, persentase: 0.04 },
    { pekerjaan: 'Dokter', jumlah: 2, persentase: 0.03 },
    { pekerjaan: 'Perawat', jumlah: 2, persentase: 0.03 },
    { pekerjaan: 'POLRI', jumlah: 2, persentase: 0.03 },
    { pekerjaan: 'Ustadz / Mubaligh', jumlah: 2, persentase: 0.03 },
    { pekerjaan: 'TNI', jumlah: 1, persentase: 0.01 },
    { pekerjaan: 'Kepala Desa', jumlah: 1, persentase: 0.01 },
    { pekerjaan: 'Penata Rias', jumlah: 1, persentase: 0.01 },
    { pekerjaan: 'Konstruksi', jumlah: 1, persentase: 0.01 },
    { pekerjaan: 'Pekerjaan Lainnya', jumlah: 1, persentase: 0.01 }
  ];

  const firstStat = Array.isArray(statistik) && statistik.length > 0 ? statistik[0] : null;

  const statTerbaru = {
    tahun: firstStat?.tahun || 2026,
    jumlah_total: firstStat?.jumlah_total || 7312,
    jumlah_laki: firstStat?.jumlah_laki || 3835,
    jumlah_perempuan: firstStat?.jumlah_perempuan || 3477,
    jumlah_kk: firstStat?.jumlah_kk || 2553,
    rata_anggota_keluarga: firstStat?.rata_anggota_keluarga || 2.86,
    pendidikan: firstStat?.pendidikan ? firstStat.pendidikan : defaultPendidikan,
    pekerjaan: firstStat?.pekerjaan ? firstStat.pekerjaan : defaultPekerjaan
  };

  const getShortEducationName = (tingkat) => {
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

  const getShortJobName = (pekerjaan) => {
    if (!pekerjaan) return '';
    if (pekerjaan.includes('PNS') || pekerjaan.includes('POLRI') || pekerjaan.includes('TNI')) return 'PNS/TNI';
    if (pekerjaan.includes('Karyawan')) return 'Karyawan';
    if (pekerjaan.includes('Buruh')) return 'Buruh';
    if (pekerjaan.includes('Petani') || pekerjaan.includes('Pekebun')) return 'Petani';
    if (pekerjaan.includes('Peternak')) return 'Peternak';
    if (pekerjaan.includes('Wiraswasta')) return 'Wiraswasta';
    if (pekerjaan.includes('Pelajar') || pekerjaan.includes('Mahasiswa')) return 'Pelajar';
    if (pekerjaan.includes('Belum') || pekerjaan.includes('tidak')) return 'Blm Kerja';
    return 'Lainnya';
  };

  const getEducationThemeProps = (idx) => {
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

  const getJobThemeProps = (idx) => {
    const themes = [
      { gradient: 'linear-gradient(180deg, #D97706 0%, #B45309 100%)', badgeBg: 'bg-amber-50 text-amber-900 border-amber-200' },
      { gradient: 'linear-gradient(180deg, #2563EB 0%, #1D4ED8 100%)', badgeBg: 'bg-blue-50 text-blue-800 border-blue-200' },
      { gradient: 'linear-gradient(180deg, #059669 0%, #047857 100%)', badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
      { gradient: 'linear-gradient(180deg, #15803D 0%, #166534 100%)', badgeBg: 'bg-green-50 text-green-800 border-green-200' },
      { gradient: 'linear-gradient(180deg, #854D0E 0%, #713F12 100%)', badgeBg: 'bg-yellow-50 text-yellow-900 border-yellow-200' },
      { gradient: 'linear-gradient(180deg, #0D9488 0%, #0F766E 100%)', badgeBg: 'bg-teal-50 text-teal-800 border-teal-200' },
      { gradient: 'linear-gradient(180deg, #4F46E5 0%, #3730A3 100%)', badgeBg: 'bg-indigo-50 text-indigo-800 border-indigo-200' },
      { gradient: 'linear-gradient(180deg, #64748B 0%, #334155 100%)', badgeBg: 'bg-slate-100 text-slate-800 border-slate-300' },
      { gradient: 'linear-gradient(180deg, #9333EA 0%, #7E22CE 100%)', badgeBg: 'bg-purple-50 text-purple-800 border-purple-200' }
    ];
    return themes[idx % themes.length];
  };

  const calcHeightPercent = (jumlah, maxJumlah) => {
    const numJml = Number(jumlah);
    const numMax = Number(maxJumlah);
    if (isNaN(numJml) || isNaN(numMax) || numMax <= 0) return 8;
    const pct = (numJml / numMax) * 100;
    if (isNaN(pct)) return 8;
    return Math.min(100, Math.max(8, Number(pct.toFixed(2))));
  };

  // Process Pendidikan
  let rawPendidikan = defaultPendidikan;
  if (Array.isArray(statTerbaru.pendidikan) && statTerbaru.pendidikan.length > 0) {
    rawPendidikan = statTerbaru.pendidikan;
  } else if (typeof statTerbaru.pendidikan === 'string') {
    try {
      const parsed = JSON.parse(statTerbaru.pendidikan);
      if (Array.isArray(parsed) && parsed.length > 0) rawPendidikan = parsed;
    } catch (e) {}
  }

  const dataPendidikan = rawPendidikan.map((item, idx) => {
    const theme = getEducationThemeProps(idx);
    const jumlah = Number(item.jumlah) || 0;
    const persentase = item.persentase !== undefined ? Number(item.persentase) : 0;
    return {
      tingkat: item.tingkat || '',
      short: getShortEducationName(item.tingkat),
      jumlah,
      persentase,
      gradient: theme.gradient,
      badgeBg: theme.badgeBg
    };
  });

  const maxJumlahPendidikan = dataPendidikan.length > 0 ? Math.max(...dataPendidikan.map((d) => d.jumlah)) || 1 : 1;
  const totalTercatatPendidikan = dataPendidikan.reduce((acc, curr) => acc + curr.jumlah, 0);

  // Process Pekerjaan
  let rawPekerjaan = defaultPekerjaan;
  if (Array.isArray(statTerbaru.pekerjaan) && statTerbaru.pekerjaan.length > 0) {
    rawPekerjaan = statTerbaru.pekerjaan;
  } else if (typeof statTerbaru.pekerjaan === 'string') {
    try {
      const parsed = JSON.parse(statTerbaru.pekerjaan);
      if (Array.isArray(parsed) && parsed.length > 0) rawPekerjaan = parsed;
    } catch (e) {}
  }

  const dataPekerjaan = rawPekerjaan.map((item, idx) => {
    const theme = getJobThemeProps(idx);
    const jumlah = Number(item.jumlah) || 0;
    const persentase = item.persentase !== undefined ? Number(item.persentase) : 0;
    return {
      pekerjaan: item.pekerjaan || item.tingkat || '',
      short: getShortJobName(item.pekerjaan || item.tingkat || ''),
      jumlah,
      persentase,
      gradient: theme.gradient,
      badgeBg: theme.badgeBg
    };
  });

  const maxJumlahPekerjaan = dataPekerjaan.length > 0 ? Math.max(...dataPekerjaan.map((d) => d.jumlah)) || 1 : 1;
  const totalTercatatPekerjaan = dataPekerjaan.reduce((acc, curr) => acc + curr.jumlah, 0);

  return (
    <div className="space-y-16 pb-20">
      <SEOHead
        title="Statistik & Demografi Penduduk Desa Tenjonagara"
        description="Data statistik kependudukan resmi Desa Tenjonagara tahun 2026 — jumlah total 7.312 jiwa penduduk, 2.553 Kepala Keluarga (KK), diagram sebaran tingkat pendidikan, dan persentase mata pencaharian warga."
        url="/statistik"
      />

      {/* Header Banner */}
      <section className="gradient-hero text-white py-16 px-4 sm:px-6 lg:px-8 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4A017_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="max-w-7xl mx-auto text-center space-y-3 relative z-10">
          <ScrollReveal direction="down" delay={0}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-accent backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-4 h-4 text-accent" />
              Statistik Kependudukan
            </span>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={100}>
            <h1 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight">
              Statistik Penduduk <span className="text-accent">Desa Tenjonagara</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={200}>
            <p className="text-emerald-100 max-w-2xl mx-auto text-sm sm:text-base font-light">
              Informasi demografi kependudukan, diagram batang tingkat pendidikan, dan profil mata pencaharian warga Desa Tenjonagara.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* STATISTIK DEMOGRAFI UTAMA */}
        <section className="space-y-6">
          <ScrollReveal direction="up" delay={100}>
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
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ScrollReveal direction="up" delay={100}>
              <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-200 border-t-4 border-t-primary hover:shadow-2xl transition-all transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Penduduk</span>
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div className="text-3xl font-serif font-bold text-primary mt-2">
                  {statTerbaru.jumlah_total ? Number(statTerbaru.jumlah_total).toLocaleString('id-ID') : '6,146'}
                </div>
                <div className="text-xs text-emerald-700 font-semibold mt-1">Jiwa Terdaftar</div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={200}>
              <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-200 border-t-4 border-t-secondary hover:shadow-2xl transition-all transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Jumlah Kepala Keluarga</span>
                  <Home className="w-5 h-5 text-secondary" />
                </div>
                <div className="text-3xl font-serif font-bold text-secondary mt-2">
                  {statTerbaru.jumlah_kk ? Number(statTerbaru.jumlah_kk).toLocaleString('id-ID') : '2,262'}
                </div>
                <div className="text-xs text-slate-500 font-medium mt-1">Kepala Keluarga (KK)</div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={300}>
              <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-200 border-t-4 border-t-accent hover:shadow-2xl transition-all transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Rata-rata Anggota</span>
                  <Users className="w-5 h-5 text-accent-dark" />
                </div>
                <div className="text-3xl font-serif font-bold text-slate-800 mt-2">
                  {statTerbaru.rata_anggota_keluarga || '2.7'}
                </div>
                <div className="text-xs text-amber-700 font-semibold mt-1">Jiwa per Kepala Keluarga</div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={400}>
              <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-200 border-t-4 border-t-emerald-600 hover:shadow-2xl transition-all transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Terdata Pendidikan</span>
                  <GraduationCap className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="text-3xl font-serif font-bold text-emerald-800 mt-2">
                  {totalTercatatPendidikan.toLocaleString('id-ID')}
                </div>
                <div className="text-xs text-emerald-700 font-semibold mt-1">Warga Terdata Sekolah</div>
              </div>
            </ScrollReveal>
          </div>
        </section>


        {/* GRAFIK 1: GRAFIK GARIS TINGKAT PENDIDIKAN WARGA (RESPONSIF LINE & AREA CHART) */}
        <ScrollReveal direction="up" delay={150}>
          <section className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shadow-md shrink-0">
                  <BarChart3 className="w-7 h-7 text-emerald-800" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl font-bold text-slate-900">Grafik Tingkat Pendidikan Warga</h2>
                  <p className="text-slate-500 text-xs sm:text-sm">
                    Diagram tren dan sebaran jenjang pendidikan terdaftar masyarakat Desa Tenjonagara (9 Kategori)
                  </p>
                </div>
              </div>
              <div className="bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center gap-2 shrink-0">
                <Award className="w-4 h-4 text-emerald-600" />
                <span>Total Terdata: {totalTercatatPendidikan.toLocaleString('id-ID')} Jiwa (9 Jenjang)</span>
              </div>
            </div>

            {/* SVG Line & Area Chart Container */}
            <div className="relative pt-6 pb-8 px-2 overflow-x-auto">
              <div className="min-w-[650px] sm:min-w-full">
                {/* SVG Graphics */}
                <div className="relative w-full h-[320px]">
                  <svg viewBox="0 0 900 320" className="w-full h-full overflow-visible">
                    <defs>
                      <linearGradient id="educationAreaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10B981" stopOpacity="0.45" />
                        <stop offset="60%" stopColor="#10B981" stopOpacity="0.1" />
                        <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                      </linearGradient>
                      <linearGradient id="educationLineGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#1E293B" />
                        <stop offset="25%" stopColor="#059669" />
                        <stop offset="50%" stopColor="#10B981" stopOpacity="1" />
                        <stop offset="75%" stopColor="#D97706" />
                        <stop offset="100%" stopColor="#4F46E5" />
                      </linearGradient>
                      <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>

                    {/* Y-Axis Horizontal Gridlines & Scale Labels (0 to 3000) */}
                    {[3000, 2500, 2000, 1500, 1000, 500, 0].map((val, i) => {
                      const yPos = 50 + (i * 35); // Y range 50 to 260
                      return (
                        <g key={i}>
                          <line
                            x1="55"
                            y1={yPos}
                            x2="880"
                            y2={yPos}
                            stroke="#E2E8F0"
                            strokeDasharray={val === 0 ? "none" : "4 4"}
                            strokeWidth={val === 0 ? "2" : "1"}
                          />
                          <text
                            x="45"
                            y={yPos + 4}
                            textAnchor="end"
                            className="text-[11px] font-mono font-semibold fill-slate-400"
                          >
                            {val.toLocaleString('id-ID')}
                          </text>
                        </g>
                      );
                    })}

                    {/* Generate Line & Filled Area Paths */}
                    {(() => {
                      const points = dataPendidikan.map((item, idx) => {
                        const x = 75 + idx * 98; // 9 points evenly spaced between 75 and 859
                        const y = 260 - (item.jumlah / 3000) * 210;
                        return { x, y, item };
                      });

                      // Create smooth curve SVG path definition (cubic bezier)
                      let lineD = `M ${points[0].x} ${points[0].y}`;
                      for (let i = 0; i < points.length - 1; i++) {
                        const p0 = points[i];
                        const p1 = points[i + 1];
                        const cpX1 = p0.x + (p1.x - p0.x) / 2;
                        const cpY1 = p0.y;
                        const cpX2 = p0.x + (p1.x - p0.x) / 2;
                        const cpY2 = p1.y;
                        lineD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
                      }

                      const areaD = `${lineD} L ${points[points.length - 1].x} 260 L ${points[0].x} 260 Z`;

                      return (
                        <g>
                          {/* Filled Background Area */}
                          <path d={areaD} fill="url(#educationAreaGradient)" />

                          {/* Smooth Main Line */}
                          <path
                            d={lineD}
                            fill="none"
                            stroke="url(#educationLineGradient)"
                            strokeWidth="4.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            filter="url(#glowEffect)"
                          />

                          {/* Data Node Dots & Value Badges */}
                          {points.map((p, idx) => (
                            <g key={idx} className="group/node cursor-pointer">
                              {/* Glowing Dot Ring */}
                              <circle
                                cx={p.x}
                                cy={p.y}
                                r="7"
                                fill="#FFFFFF"
                                stroke="#10B981"
                                strokeWidth="3.5"
                                className="transition-all duration-300 group-hover/node:r-9 group-hover/node:stroke-primary"
                              />

                              {/* Value Label & Percentage Badge Above Node */}
                              <foreignObject
                                x={p.x - 45}
                                y={p.y - 48}
                                width="90"
                                height="42"
                                className="overflow-visible"
                              >
                                <div className="flex flex-col items-center justify-center pointer-events-none transition-transform duration-200 group-hover/node:-translate-y-1">
                                  <span className="text-[11px] font-extrabold font-mono text-slate-900 bg-white px-1.5 py-0.5 rounded shadow-sm border border-slate-200">
                                    {p.item.jumlah.toLocaleString('id-ID')}
                                  </span>
                                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border mt-0.5 whitespace-nowrap shadow-2xs ${p.item.badgeBg}`}>
                                    {p.item.persentase}%
                                  </span>
                                </div>
                              </foreignObject>

                              {/* X-Axis Slanted Label Below Graph */}
                              <foreignObject
                                x={p.x - 45}
                                y="272"
                                width="90"
                                height="50"
                                className="overflow-visible"
                              >
                                <div className="text-center">
                                  {/* Mobile: Miring -45 Derajat | Desktop: Tegak */}
                                  <span className="block font-bold text-xs text-slate-800 transform -rotate-45 sm:rotate-0 origin-top-right whitespace-nowrap sm:whitespace-normal transition-transform">
                                    {p.item.short}
                                  </span>
                                  <span className="text-[10px] text-slate-500 hidden sm:block truncate mt-0.5">
                                    {p.item.tingkat}
                                  </span>
                                </div>
                              </foreignObject>
                            </g>
                          ))}
                        </g>
                      );
                    })()}
                  </svg>
                </div>
              </div>
            </div>

            {/* Grid 9 Kartu Ringkasan Jenjang Pendidikan */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2.5 pt-4 border-t border-slate-100 text-center">
              {dataPendidikan.map((item, idx) => (
                <div key={idx} className="bg-slate-50 p-3 rounded-2xl border border-slate-200/90 space-y-1 hover:border-emerald-400 hover:shadow-sm transition-all">
                  <div className="text-[11px] font-semibold text-slate-500 truncate" title={item.tingkat}>{item.tingkat}</div>
                  <div className="text-base font-bold font-mono text-slate-800">{item.jumlah.toLocaleString('id-ID')}</div>
                  <div className="text-xs font-bold text-emerald-700">{item.persentase}%</div>
                </div>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* GRAFIK 2: GRAFIK MATA PENCAHARIAN / PEKERJAAN WARGA (RESPONSIF 28 KATEGORI) */}
        <ScrollReveal direction="up" delay={200}>
          <section className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold shadow-md shrink-0">
                  <Briefcase className="w-7 h-7 text-amber-800" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl font-bold text-slate-900">Grafik & Sebaran Mata Pencaharian Warga</h2>
                  <p className="text-slate-500 text-xs sm:text-sm">
                    Statistik lengkap rincian 28 sektor pekerjaan dan profesi masyarakat Desa Tenjonagara
                  </p>
                </div>
              </div>
              <div className="bg-amber-50 px-4 py-2 rounded-xl border border-amber-200 text-xs text-amber-900 font-semibold flex items-center gap-2 shrink-0">
                <Award className="w-4 h-4 text-amber-700" />
                <span>Total Terdata: {totalTercatatPekerjaan.toLocaleString('id-ID')} Jiwa (28 Profesi)</span>
              </div>
            </div>

            {/* Horizontal Progress Bars Grid (2 Kolom di Desktop, 1 Kolom di Mobile) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4 pt-2">
              {dataPekerjaan.map((item, idx) => {
                const widthPct = Math.max((item.jumlah / maxJumlahPekerjaan) * 100, 2);

                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-amber-300 hover:shadow-md transition-all space-y-2 group"
                  >
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-900 font-extrabold text-[11px] flex items-center justify-center shrink-0 shadow-sm">
                          #{idx + 1}
                        </span>
                        <span className="font-bold text-slate-800 text-sm truncate group-hover:text-amber-900 transition-colors" title={item.pekerjaan}>
                          {item.pekerjaan}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-bold font-mono text-slate-900 text-sm">
                          {item.jumlah.toLocaleString('id-ID')} <span className="text-[10px] font-normal text-slate-500">jiwa</span>
                        </span>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${item.badgeBg}`}>
                          {item.persentase}%
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar Container */}
                    <div className="w-full h-3 bg-slate-200/80 rounded-full overflow-hidden p-0.5 border border-slate-200">
                      <div
                        className="h-full rounded-full transition-all duration-700 ease-out group-hover:brightness-110"
                        style={{
                          width: `${widthPct}%`,
                          background: item.gradient
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </ScrollReveal>
      </div>
    </div>
  );
}
