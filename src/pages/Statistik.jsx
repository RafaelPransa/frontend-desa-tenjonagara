import React, { useEffect, useState } from 'react';
import { BarChart3, Users, Landmark, TrendingUp, PieChart, ShieldAlert } from 'lucide-react';
import { getStatistikPenduduk, getApbdes } from '../services/desaService';

export default function Statistik() {
  const [statistik, setStatistik] = useState([]);
  const [apbdes, setApbdes] = useState([]);
  const [loading, setLoading] = useState(true);

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
    jumlah_total: 4250,
    jumlah_laki: 2180,
    jumlah_perempuan: 2070,
    jumlah_kk: 1120
  };

  const totalPagu = apbdes.reduce((acc, curr) => acc + parseFloat(curr.pagu_anggaran || 0), 0);
  const totalRealisasi = apbdes.reduce((acc, curr) => acc + parseFloat(curr.realisasi || 0), 0);

  return (
    <div className="space-y-12 pb-16">
      {/* Header */}
      <section className="bg-primary text-white py-14 px-4 sm:px-6 lg:px-8 shadow-inner">
        <div className="max-w-7xl mx-auto text-center space-y-3">
          <span className="text-accent font-semibold text-sm uppercase tracking-widest">Transparansi Data Desa</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold">Statistik Penduduk & APBDES</h1>
          <p className="text-emerald-100 max-w-2xl mx-auto text-sm sm:text-base">
            Informasi demografi kependudukan serta rincian transparansi Anggaran Pendapatan dan Belanja Desa (APBDES).
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* STATISTIK PENDUDUK */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/20 text-accent-dark flex items-center justify-center font-bold">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-primary">Demografi Penduduk ({statTerbaru.tahun})</h2>
              <p className="text-slate-500 text-xs sm:text-sm">Rincian komposisi warga Desa Tenjonagara</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200 border-t-4 border-t-primary">
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Penduduk</div>
              <div className="text-3xl font-serif font-bold text-primary mt-2">{statTerbaru.jumlah_total.toLocaleString()}</div>
              <div className="text-xs text-emerald-600 font-medium mt-1">Jiwa Terdaftar</div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200 border-t-4 border-t-blue-600">
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Laki-Laki</div>
              <div className="text-3xl font-serif font-bold text-blue-700 mt-2">{statTerbaru.jumlah_laki.toLocaleString()}</div>
              <div className="text-xs text-slate-500 mt-1">({((statTerbaru.jumlah_laki / statTerbaru.jumlah_total) * 100).toFixed(1)}%)</div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200 border-t-4 border-t-pink-500">
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Perempuan</div>
              <div className="text-3xl font-serif font-bold text-pink-600 mt-2">{statTerbaru.jumlah_perempuan.toLocaleString()}</div>
              <div className="text-xs text-slate-500 mt-1">({((statTerbaru.jumlah_perempuan / statTerbaru.jumlah_total) * 100).toFixed(1)}%)</div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200 border-t-4 border-t-accent">
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Jumlah Kepala Keluarga</div>
              <div className="text-3xl font-serif font-bold text-slate-800 mt-2">{statTerbaru.jumlah_kk.toLocaleString()}</div>
              <div className="text-xs text-amber-600 font-medium mt-1">Kepala Keluarga (KK)</div>
            </div>
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
