import React, { useEffect, useState } from 'react';
import { BarChart3, Users, Landmark, Home, GraduationCap, Award, PieChart, CheckCircle2 } from 'lucide-react';
import { getStatistikPenduduk, getApbdes } from '../services/desaService';

export default function Statistik() {
  const [statistik, setStatistik] = useState([]);
  const [apbdes, setApbdes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Data Pendidikan Resmi Desa Tenjonagara
  const dataPendidikan = [
    { tingkat: 'SD / Sederajat', jumlah: 2317, persentase: 70.47, color: 'bg-primary', barColor: '#2D4B37' },
    { tingkat: 'SMP / Sederajat', jumlah: 587, persentase: 17.85, color: 'bg-emerald-600', barColor: '#059669' },
    { tingkat: 'SMA / Sederajat', jumlah: 332, persentase: 10.10, color: 'bg-secondary', barColor: '#7D5C4A' },
    { tingkat: 'Diploma I (D1)', jumlah: 47, persentase: 1.43, color: 'bg-amber-600', barColor: '#D97706' },
    { tingkat: 'Sarjana (S1)', jumlah: 5, persentase: 0.15, color: 'bg-accent-dark', barColor: '#A67C0E' }
  ];

  const totalTercatatPendidikan = dataPendidikan.reduce((acc, curr) => acc + curr.jumlah, 0);

  useEffect(() => {
    Promise.all([
      getStatistikPenduduk().catch(() => ({ data: [] })),
      getApbdes().catch(() => ({ data: [] }))
    ]).then(([resStat, resApbdes]) => {
      setStatistik(resStat.data || []);
      setApbdes(resApbdes.data || []);
      setLoading(false);
    });
  }, []);

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(number);
  };

  const statTerbaru = statistik[0] || {
    tahun: 2026,
    jumlah_total: 6146,
    jumlah_kk: 2262,
    rata_anggota_keluarga: 2.7
  };

  const totalPagu = apbdes.reduce((acc, curr) => acc + parseFloat(curr.pagu_anggaran || 0), 0);
  const totalRealisasi = apbdes.reduce((acc, curr) => acc + parseFloat(curr.realisasi || 0), 0);

  return (
    <div className="space-y-12 pb-16">
      {/* Header Banner */}
      <section className="bg-primary text-white py-14 px-4 sm:px-6 lg:px-8 shadow-inner">
        <div className="max-w-7xl mx-auto text-center space-y-3">
          <span className="text-accent font-semibold text-sm uppercase tracking-widest">Transparansi Data Desa</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold">Statistik Penduduk & APBDES</h1>
          <p className="text-emerald-100 max-w-2xl mx-auto text-sm sm:text-base">
            Informasi demografi resmi kependudukan, grafik tingkat pendidikan warga, serta transparansi APBDES Desa Tenjonagara.
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
              <h2 className="font-serif text-2xl font-bold text-primary">Demografi Penduduk Desa Tenjonagara</h2>
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
                {statTerbaru.jumlah_total ? statTerbaru.jumlah_total.toLocaleString('id-ID') : '6,146'}
              </div>
              <div className="text-xs text-emerald-700 font-semibold mt-1">Jiwa Terdaftar</div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200 border-t-4 border-t-secondary hover:shadow-lg transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Jumlah Kepala Keluarga</span>
                <Home className="w-5 h-5 text-secondary" />
              </div>
              <div className="text-3xl font-serif font-bold text-secondary mt-2">
                {statTerbaru.jumlah_kk ? statTerbaru.jumlah_kk.toLocaleString('id-ID') : '2,262'}
              </div>
              <div className="text-xs text-slate-500 font-medium mt-1">Kepala Keluarga (KK)</div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200 border-t-4 border-t-accent hover:shadow-lg transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Rata-rata Anggota</span>
                <Users className="w-5 h-5 text-accent-dark" />
              </div>
              <div className="text-3xl font-serif font-bold text-slate-800 mt-2">
                {statTerbaru.rata_anggota_keluarga || '2.70'}
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

        {/* GRAFIK TINGKAT PENDIDIKAN (SD S/D S1) */}
        <section className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-200 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary text-accent flex items-center justify-center font-bold shadow-md">
                <GraduationCap className="w-7 h-7 text-accent" />
              </div>
              <div>
                <h2 className="font-serif text-2xl font-bold text-primary">Grafik Tingkat Pendidikan Warga</h2>
                <p className="text-slate-500 text-xs sm:text-sm">Distribusi jenjang pendidikan terdaftar dari SD sampai Sarjana (S1)</p>
              </div>
            </div>
            <div className="bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>Total Terdata: {totalTercatatPendidikan.toLocaleString('id-ID')} Jiwa</span>
            </div>
          </div>

          {/* Visual Horizontal Progress Chart */}
          <div className="space-y-6">
            {dataPendidikan.map((item, idx) => (
              <div key={idx} className="space-y-2 group">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="font-bold text-slate-800 group-hover:text-primary transition-colors flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-mono font-bold">
                      0{idx + 1}
                    </span>
                    {item.tingkat}
                  </span>
                  <div className="text-right">
                    <span className="font-bold font-mono text-primary text-base mr-2">{item.jumlah.toLocaleString('id-ID')} jiwa</span>
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full font-mono font-semibold">
                      ({item.persentase}%)
                    </span>
                  </div>
                </div>

                {/* Animated Progress Bar */}
                <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden border border-slate-200/80">
                  <div
                    className={`h-full rounded-full ${item.color} transition-all duration-700 ease-out group-hover:brightness-110`}
                    style={{ width: `${Math.max(item.persentase, 1.5)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Grid Cards Summary Ringkasan Grafik */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4 border-t border-slate-100 text-center">
            {dataPendidikan.map((item, idx) => (
              <div key={idx} className="bg-surface p-3.5 rounded-xl border border-slate-200 space-y-1">
                <div className="text-xs font-semibold text-slate-500 truncate">{item.tingkat}</div>
                <div className="text-lg font-bold font-mono text-slate-800">{item.jumlah.toLocaleString('id-ID')}</div>
                <div className="text-xs font-bold text-primary">{item.persentase}%</div>
              </div>
            ))}
          </div>
        </section>

        {/* TRANSPARANSI APBDES */}
        <section className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-200 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/20 text-accent-dark flex items-center justify-center font-bold">
                <Landmark className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="font-serif text-2xl font-bold text-primary">Transparansi APBDES 2026</h2>
                <p className="text-slate-500 text-xs sm:text-sm">Laporan Pagu Anggaran & Realisasi Keuangan Desa</p>
              </div>
            </div>

            <div className="flex gap-4 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200">
              <div>
                <div className="text-xs text-slate-500">Total Pagu</div>
                <div className="text-sm font-bold text-primary">{formatRupiah(totalPagu)}</div>
              </div>
              <div className="border-l border-emerald-200 pl-4">
                <div className="text-xs text-slate-500">Total Realisasi</div>
                <div className="text-sm font-bold text-secondary">{formatRupiah(totalRealisasi)}</div>
              </div>
            </div>
          </div>

          {/* Table Breakdown */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 text-xs uppercase tracking-wider border-b border-slate-200">
                  <th className="py-3.5 px-4 font-bold">No</th>
                  <th className="py-3.5 px-4 font-bold">Bidang Kegiatan</th>
                  <th className="py-3.5 px-4 font-bold text-right">Pagu Anggaran</th>
                  <th className="py-3.5 px-4 font-bold text-right">Realisasi</th>
                  <th className="py-3.5 px-4 font-bold text-center">Persentase</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                {apbdes.map((item, idx) => {
                  const pagu = parseFloat(item.pagu_anggaran || 0);
                  const real = parseFloat(item.realisasi || 0);
                  const persen = pagu > 0 ? ((real / pagu) * 100).toFixed(1) : 0;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-4 font-medium text-slate-500">{idx + 1}</td>
                      <td className="py-4 px-4 font-semibold text-slate-800">{item.bidang}</td>
                      <td className="py-4 px-4 text-right font-mono text-slate-700">{formatRupiah(pagu)}</td>
                      <td className="py-4 px-4 text-right font-mono text-primary font-semibold">{formatRupiah(real)}</td>
                      <td className="py-4 px-4 text-center">
                        <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                          {persen}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </div>
  );
}
