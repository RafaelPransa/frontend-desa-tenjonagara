import React, { useEffect, useState } from 'react';
import {
  BarChart3,
  Save,
  Users,
  GraduationCap,
  Briefcase,
  AlertCircle,
  CheckCircle,
  Loader2,
  RefreshCw,
  Calculator
} from 'lucide-react';
import { getAdminStatistik, updateAdminStatistik } from '../../services/adminService';

export default function AdminStatistik() {
  const [formData, setFormData] = useState({
    id: 1,
    tahun: 2026,
    jumlah_total: 6146,
    jumlah_laki: 3120,
    jumlah_perempuan: 3026,
    jumlah_kk: 2262,
    rata_anggota_keluarga: 2.7,
    pendidikan: [
      { tingkat: 'Tidak/Belum sekolah', jumlah: 500, persentase: 8.14 },
      { tingkat: 'Tamat SD/Sederajat', jumlah: 2793, persentase: 45.44 },
      { tingkat: 'Tamat SMP/Sederajat', jumlah: 1343, persentase: 21.85 },
      { tingkat: 'Tamat SLTA/Sederajat', jumlah: 971, persentase: 15.8 },
      { tingkat: 'Tamat Diploma I-II', jumlah: 20, persentase: 0.33 },
      { tingkat: 'Tamat Diploma III', jumlah: 35, persentase: 0.57 },
      { tingkat: 'Tamat S1', jumlah: 470, persentase: 7.65 },
      { tingkat: 'Tamat S2', jumlah: 14, persentase: 0.23 }
    ],
    pekerjaan: [
      { pekerjaan: 'PNS, POLRI & TNI', jumlah: 45, persentase: 0.73 },
      { pekerjaan: 'Karyawan', jumlah: 650, persentase: 10.58 },
      { pekerjaan: 'Buruh', jumlah: 1200, persentase: 19.52 },
      { pekerjaan: 'Petani / Pekebun', jumlah: 2100, persentase: 34.17 },
      { pekerjaan: 'Peternakan', jumlah: 180, persentase: 2.93 },
      { pekerjaan: 'Wiraswasta', jumlah: 750, persentase: 12.2 },
      { pekerjaan: 'Pelajar/Mahasiswa', jumlah: 820, persentase: 13.34 },
      { pekerjaan: 'Belum/tidak bekerja', jumlah: 350, persentase: 5.69 },
      { pekerjaan: 'Pekerjaan lainnya', jumlah: 51, persentase: 0.83 }
    ]
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Helper untuk menghitung ulang persentase Pendidikan
  const recalculatePendidikanPercentages = (listPendidikan) => {
    const totalPendidikan = listPendidikan.reduce((acc, curr) => acc + (Number(curr.jumlah) || 0), 0);
    return listPendidikan.map((item) => {
      const jml = Number(item.jumlah) || 0;
      const pct = totalPendidikan > 0 ? Number(((jml / totalPendidikan) * 100).toFixed(2)) : 0;
      return { ...item, jumlah: jml, persentase: pct };
    });
  };

  // Helper untuk menghitung ulang persentase Pekerjaan
  const recalculatePekerjaanPercentages = (listPekerjaan) => {
    const totalPekerjaan = listPekerjaan.reduce((acc, curr) => acc + (Number(curr.jumlah) || 0), 0);
    return listPekerjaan.map((item) => {
      const jml = Number(item.jumlah) || 0;
      const pct = totalPekerjaan > 0 ? Number(((jml / totalPekerjaan) * 100).toFixed(2)) : 0;
      return { ...item, jumlah: jml, persentase: pct };
    });
  };

  const fetchStatistik = async () => {
    setFetching(true);
    setError(null);
    try {
      const res = await getAdminStatistik();
      const list = res.data?.data || res.data || [];
      const item = Array.isArray(list) ? list[0] : list;
      if (item) {
        const rawEdu = Array.isArray(item.pendidikan) ? item.pendidikan : formData.pendidikan;
        const rawJob = Array.isArray(item.pekerjaan) ? item.pekerjaan : formData.pekerjaan;
        setFormData({
          id: item.id || 1,
          tahun: item.tahun || 2026,
          jumlah_total: item.jumlah_total || 6146,
          jumlah_laki: item.jumlah_laki || 3120,
          jumlah_perempuan: item.jumlah_perempuan || 3026,
          jumlah_kk: item.jumlah_kk || 2262,
          rata_anggota_keluarga: item.rata_anggota_keluarga || 2.7,
          pendidikan: recalculatePendidikanPercentages(rawEdu),
          pekerjaan: recalculatePekerjaanPercentages(rawJob)
        });
      }
    } catch (err) {
      console.error('Gagal mengambil data statistik', err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchStatistik();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: Number(value) || value }));
  };

  const handlePendidikanChange = (index, value) => {
    const updated = [...formData.pendidikan];
    updated[index].jumlah = Math.max(0, Number(value) || 0);
    const recalculated = recalculatePendidikanPercentages(updated);
    const newTotalPendidikan = recalculated.reduce((sum, item) => sum + item.jumlah, 0);

    setFormData((prev) => ({
      ...prev,
      jumlah_total: newTotalPendidikan,
      pendidikan: recalculated
    }));
  };

  const handlePekerjaanChange = (index, value) => {
    const updated = [...formData.pekerjaan];
    updated[index].jumlah = Math.max(0, Number(value) || 0);
    const recalculated = recalculatePekerjaanPercentages(updated);

    setFormData((prev) => ({
      ...prev,
      pekerjaan: recalculated
    }));
  };

  const totalTerdataPendidikan = formData.pendidikan.reduce((sum, item) => sum + (Number(item.jumlah) || 0), 0);
  const totalTerdataPekerjaan = formData.pekerjaan.reduce((sum, item) => sum + (Number(item.jumlah) || 0), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    const payload = {
      ...formData,
      pendidikan: recalculatePendidikanPercentages(formData.pendidikan),
      pekerjaan: recalculatePekerjaanPercentages(formData.pekerjaan)
    };

    try {
      await updateAdminStatistik(formData.id, payload);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Gagal memperbarui data statistik penduduk.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold shadow-xs">
            <BarChart3 className="w-6 h-6 text-purple-700" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">Edit Data Statistik Penduduk</h1>
            <p className="text-xs sm:text-sm text-slate-500">Perbarui statistik demografi, pendidikan, dan mata pencaharian warga</p>
          </div>
        </div>

        <button
          onClick={fetchStatistik}
          className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors shrink-0"
          title="Refresh Data"
        >
          <RefreshCw className={`w-4 h-4 ${fetching ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Status Alerts */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Data statistik demografi penduduk berhasil diperbarui!</span>
        </div>
      )}

      {fetching ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-sm font-medium text-slate-500">Memuat data statistik penduduk...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-8">
          {/* Section 1: Demografi Umum */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Users className="w-5 h-5 text-primary" />
              <span>Ringkasan Demografi Jiwa & KK</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Tahun Data</label>
                <input
                  type="number"
                  name="tahun"
                  value={formData.tahun}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary text-sm font-bold text-slate-900"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Total Penduduk (Jiwa)</label>
                <input
                  type="number"
                  name="jumlah_total"
                  value={formData.jumlah_total}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary text-sm font-bold text-slate-900 bg-slate-50"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Jumlah Kepala Keluarga (KK)</label>
                <input
                  type="number"
                  name="jumlah_kk"
                  value={formData.jumlah_kk}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary text-sm font-bold text-slate-900"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Laki-laki (Jiwa)</label>
                <input
                  type="number"
                  name="jumlah_laki"
                  value={formData.jumlah_laki}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary text-sm text-slate-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Perempuan (Jiwa)</label>
                <input
                  type="number"
                  name="jumlah_perempuan"
                  value={formData.jumlah_perempuan}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary text-sm text-slate-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Rata-rata Anggota / KK</label>
                <input
                  type="number"
                  step="0.1"
                  name="rata_anggota_keluarga"
                  value={formData.rata_anggota_keluarga}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary text-sm text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Tingkat Pendidikan */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-primary" />
                <span>Tingkat Pendidikan Penduduk</span>
              </h2>
              <div className="text-xs text-emerald-800 font-semibold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5 self-start sm:self-auto">
                <Calculator className="w-3.5 h-3.5 text-emerald-600" />
                <span>Persentase dihitung otomatis (Total: {totalTerdataPendidikan.toLocaleString('id-ID')} Jiwa)</span>
              </div>
            </div>

            <div className="space-y-3">
              {formData.pendidikan.map((edu, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="font-bold text-slate-900 text-sm sm:text-base w-48 shrink-0">
                    {edu.tingkat}
                  </div>

                  <div className="flex-1 w-full sm:w-auto grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Jumlah Penduduk (Jiwa)
                      </label>
                      <input
                        type="number"
                        value={edu.jumlah}
                        onChange={(e) => handlePendidikanChange(idx, e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-primary"
                        min={0}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Hasil Kalkulasi Persentase
                      </label>
                      <div className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-sm font-bold text-primary flex items-center justify-between">
                        <span>{edu.persentase}%</span>
                        <span className="text-[10px] text-slate-400 font-normal">otomatis</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Mata Pencaharian / Pekerjaan Warga */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-secondary" />
                <span>Mata Pencaharian & Pekerjaan Warga</span>
              </h2>
              <div className="text-xs text-amber-900 font-semibold bg-amber-50 px-3 py-1 rounded-full border border-amber-200 flex items-center gap-1.5 self-start sm:self-auto">
                <Calculator className="w-3.5 h-3.5 text-amber-700" />
                <span>Persentase dihitung otomatis (Total: {totalTerdataPekerjaan.toLocaleString('id-ID')} Jiwa)</span>
              </div>
            </div>

            <div className="space-y-3">
              {formData.pekerjaan.map((job, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-amber-50/40 border border-amber-200/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="font-bold text-slate-900 text-sm sm:text-base w-48 shrink-0">
                    {job.pekerjaan}
                  </div>

                  <div className="flex-1 w-full sm:w-auto grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Jumlah Penduduk (Jiwa)
                      </label>
                      <input
                        type="number"
                        value={job.jumlah}
                        onChange={(e) => handlePekerjaanChange(idx, e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-secondary"
                        min={0}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Hasil Kalkulasi Persentase
                      </label>
                      <div className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-sm font-bold text-secondary flex items-center justify-between">
                        <span>{job.persentase}%</span>
                        <span className="text-[10px] text-slate-400 font-normal">otomatis</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-bold shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memproses Update...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan Statistik</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
