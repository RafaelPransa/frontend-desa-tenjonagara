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
  Calculator,
  Coins,
  Plus,
  Edit2,
  Trash2,
  TrendingUp,
  X,
  ShieldCheck,
  DollarSign
} from 'lucide-react';
import {
  getAdminStatistik,
  updateAdminStatistik,
  getAdminApbdes,
  createAdminApbdes,
  updateAdminApbdes,
  deleteAdminApbdes
} from '../../services/adminService';
import ScrollReveal from '../../components/ScrollReveal';
import ConfirmModal from '../../components/ConfirmModal';

// Format Angka ke Rupiah
function formatRupiah(num) {
  if (num === null || num === undefined || isNaN(num)) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(num);
}

export default function AdminStatistik() {
  const [activeTab, setActiveTab] = useState('demografi'); // 'demografi' | 'apbdes'

  // Demografi State
  const [formData, setFormData] = useState({
    id: 1,
    tahun: 2026,
    jumlah_total: 7312,
    jumlah_laki: 3835,
    jumlah_perempuan: 3477,
    jumlah_kk: 2553,
    rata_anggota_keluarga: 2.86,
    pendidikan: [
      { tingkat: 'Tidak/Belum sekolah', jumlah: 1306, persentase: 17.86 },
      { tingkat: 'Belum Tamat SD/Sederajat', jumlah: 757, persentase: 10.35 },
      { tingkat: 'Tamat SD/Sederajat', jumlah: 2871, persentase: 39.26 },
      { tingkat: 'Tamat SMP/Sederajat', jumlah: 1141, persentase: 15.60 },
      { tingkat: 'Tamat SLTA/Sederajat', jumlah: 986, persentase: 13.48 },
      { tingkat: 'Tamat Diploma I-II', jumlah: 9, persentase: 0.12 },
      { tingkat: 'Tamat Diploma III', jumlah: 19, persentase: 0.26 },
      { tingkat: 'Tamat S1/D-IV', jumlah: 111, persentase: 1.52 },
      { tingkat: 'Tamat S2', jumlah: 10, persentase: 0.14 }
    ],
    pekerjaan: [
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
    ]
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // APBDes State
  const [apbdesList, setApbdesList] = useState([]);
  const [apbdesLoading, setApbdesLoading] = useState(false);
  const [apbdesModalOpen, setApbdesModalOpen] = useState(false);
  const [apbdesEditingItem, setApbdesEditingItem] = useState(null);
  const [apbdesFormData, setApbdesFormData] = useState({
    tahun: 2026,
    bidang: '',
    pagu_anggaran: '',
    realisasi: ''
  });
  const [deleteApbdesTarget, setDeleteApbdesTarget] = useState(null);
  const [apbdesActionLoading, setApbdesActionLoading] = useState(false);

  const recalculatePendidikanPercentages = (listPendidikan) => {
    const totalPendidikan = listPendidikan.reduce((acc, curr) => acc + (Number(curr.jumlah) || 0), 0);
    return listPendidikan.map((item) => {
      const jml = Number(item.jumlah) || 0;
      const pct = totalPendidikan > 0 ? Number(((jml / totalPendidikan) * 100).toFixed(2)) : 0;
      return { ...item, jumlah: jml, persentase: pct };
    });
  };

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
      const payload = res.data?.data || res.data;
      const data = Array.isArray(payload) ? payload[0] : payload;
      if (data) {
        setFormData({
          id: data.id || 1,
          tahun: data.tahun || 2026,
          jumlah_total: Number(data.jumlah_total) || 7312,
          jumlah_laki: Number(data.jumlah_laki) || 3835,
          jumlah_perempuan: Number(data.jumlah_perempuan) || 3477,
          jumlah_kk: Number(data.jumlah_kk) || 2553,
          rata_anggota_keluarga: Number(data.rata_anggota_keluarga) || 2.86,
          pendidikan: Array.isArray(data.pendidikan) && data.pendidikan.length > 0 ? data.pendidikan : formData.pendidikan,
          pekerjaan: Array.isArray(data.pekerjaan) && data.pekerjaan.length > 0 ? data.pekerjaan : formData.pekerjaan
        });
      }
    } catch (err) {
      setError('Gagal memuat data statistik dari server. Menggunakan data cadangan lokal.');
    } finally {
      setFetching(false);
    }
  };

  const fetchApbdes = async () => {
    setApbdesLoading(true);
    try {
      const res = await getAdminApbdes();
      const list = res.data?.data || res.data || [];
      setApbdesList(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error('Failed to load APBDes', err);
    } finally {
      setApbdesLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistik();
    fetchApbdes();
  }, []);

  // ── HANDLERS DEMOGRAFI ──
  const handleGeneralChange = (e) => {
    const { name, value } = e.target;
    const numVal = Number(value);

    setFormData((prev) => {
      const updated = { ...prev, [name]: numVal };
      if (name === 'jumlah_laki' || name === 'jumlah_perempuan') {
        const laki = name === 'jumlah_laki' ? numVal : prev.jumlah_laki;
        const perempuan = name === 'jumlah_perempuan' ? numVal : prev.jumlah_perempuan;
        updated.jumlah_total = laki + perempuan;
        if (prev.jumlah_kk > 0) {
          updated.rata_anggota_keluarga = Number(((laki + perempuan) / prev.jumlah_kk).toFixed(2));
        }
      }
      if (name === 'jumlah_kk' && numVal > 0) {
        updated.rata_anggota_keluarga = Number((prev.jumlah_total / numVal).toFixed(2));
      }
      return updated;
    });
  };

  const handlePendidikanChange = (index, value) => {
    const updated = [...formData.pendidikan];
    updated[index] = { ...updated[index], jumlah: Number(value) || 0 };
    setFormData((prev) => ({
      ...prev,
      pendidikan: recalculatePendidikanPercentages(updated)
    }));
  };

  const handlePekerjaanChange = (index, value) => {
    const updated = [...formData.pekerjaan];
    updated[index] = { ...updated[index], jumlah: Number(value) || 0 };
    setFormData((prev) => ({
      ...prev,
      pekerjaan: recalculatePekerjaanPercentages(updated)
    }));
  };

  const handleSubmitStatistik = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await updateAdminStatistik(formData.id, formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3500);
    } catch (err) {
      setError(err.message || 'Gagal menyimpan perubahan statistik.');
    } finally {
      setLoading(false);
    }
  };

  // ── HANDLERS APBDES ──
  const handleOpenAddApbdes = () => {
    setApbdesEditingItem(null);
    setApbdesFormData({
      tahun: 2025,
      bidang: '',
      pagu_anggaran: '',
      realisasi: ''
    });
    setApbdesModalOpen(true);
  };

  const handleOpenEditApbdes = (item) => {
    setApbdesEditingItem(item);
    setApbdesFormData({
      tahun: item.tahun || 2025,
      bidang: item.bidang || '',
      pagu_anggaran: item.pagu_anggaran || '',
      realisasi: item.realisasi || ''
    });
    setApbdesModalOpen(true);
  };

  const handleSaveApbdes = async (e) => {
    e.preventDefault();
    if (!apbdesFormData.bidang.trim()) {
      alert('Nama bidang kegiatan wajib diisi.');
      return;
    }
    if (!apbdesFormData.pagu_anggaran) {
      alert('Pagu anggaran wajib diisi.');
      return;
    }

    setApbdesActionLoading(true);
    try {
      if (apbdesEditingItem) {
        await updateAdminApbdes(apbdesEditingItem.id, apbdesFormData);
      } else {
        await createAdminApbdes(apbdesFormData);
      }
      setApbdesModalOpen(false);
      fetchApbdes();
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Gagal menyimpan data APBDes.');
    } finally {
      setApbdesActionLoading(false);
    }
  };

  const handleConfirmDeleteApbdes = async () => {
    if (!deleteApbdesTarget) return;
    setApbdesActionLoading(true);
    try {
      await deleteAdminApbdes(deleteApbdesTarget.id);
      setDeleteApbdesTarget(null);
      fetchApbdes();
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Gagal menghapus data APBDes.');
    } finally {
      setApbdesActionLoading(false);
    }
  };

  // Kalkulasi Ringkasan APBDes
  const totalPagu = apbdesList.reduce((acc, curr) => acc + (Number(curr.pagu_anggaran) || 0), 0);
  const totalRealisasi = apbdesList.reduce((acc, curr) => acc + (Number(curr.realisasi) || 0), 0);
  const penyerapanPersen = totalPagu > 0 ? ((totalRealisasi / totalPagu) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold shadow-xs shrink-0">
            <BarChart3 className="w-6 h-6 text-purple-700" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
              Kelola Statistik & Keuangan Desa
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Perbarui data demografi penduduk, pendidikan, pekerjaan, serta transparansi APBDes Tenjonagara.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            fetchStatistik();
            fetchApbdes();
          }}
          className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors self-start sm:self-center shrink-0"
          title="Refresh Data"
        >
          <RefreshCw className={`w-4 h-4 ${fetching || apbdesLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center justify-center sm:justify-start">
        <div className="bg-slate-200/90 p-1.5 rounded-2xl flex items-center gap-1.5 shadow-inner max-w-md w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveTab('demografi')}
            className={`flex-1 sm:flex-initial py-2.5 px-5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'demografi'
                ? 'bg-white text-primary shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Demografi & Penduduk</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('apbdes')}
            className={`flex-1 sm:flex-initial py-2.5 px-5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'apbdes'
                ? 'bg-white text-primary shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Coins className="w-4 h-4" />
            <span>Transparansi APBDes</span>
          </button>
        </div>
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
          <span>Data statistik demografi penduduk berhasil disimpan dan diperbarui di website!</span>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          TAB 1: DEMOGRAFI & KEPENDUDUKAN
      ══════════════════════════════════════════════════════════ */}
      {activeTab === 'demografi' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {fetching ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
              <p className="text-sm font-medium text-slate-500">Memuat data demografi...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmitStatistik} className="space-y-6">
              {/* Card 1: Data Pokok Jiwa & KK */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Data Pokok Demografi Penduduk</h2>
                    <p className="text-xs text-slate-500">Jumlah jiwa, jenis kelamin, dan kepala keluarga</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Tahun Data Statistik
                    </label>
                    <input
                      type="number"
                      name="tahun"
                      value={formData.tahun}
                      onChange={handleGeneralChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 font-bold text-slate-900 text-sm focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Jumlah Laki-laki (Jiwa)
                    </label>
                    <input
                      type="number"
                      name="jumlah_laki"
                      value={formData.jumlah_laki}
                      onChange={handleGeneralChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 font-bold text-slate-900 text-sm focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Jumlah Perempuan (Jiwa)
                    </label>
                    <input
                      type="number"
                      name="jumlah_perempuan"
                      value={formData.jumlah_perempuan}
                      onChange={handleGeneralChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 font-bold text-slate-900 text-sm focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Total Penduduk (Otomatis)
                    </label>
                    <div className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 font-bold text-primary text-base">
                      {formData.jumlah_total.toLocaleString('id-ID')} Jiwa
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Jumlah Kepala Keluarga (KK)
                    </label>
                    <input
                      type="number"
                      name="jumlah_kk"
                      value={formData.jumlah_kk}
                      onChange={handleGeneralChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 font-bold text-slate-900 text-sm focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Rata-rata Jiwa / KK (Otomatis)
                    </label>
                    <div className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 font-bold text-slate-800 text-sm">
                      {formData.rata_anggota_keluarga} Jiwa / KK
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Tingkat Pendidikan */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Distribusi Tingkat Pendidikan</h2>
                    <p className="text-xs text-slate-500">Persentase dihitung otomatis berdasarkan total penduduk sekolah</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.pendidikan.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-50/60 border border-slate-200/80 flex items-center justify-between gap-4"
                    >
                      <div className="font-semibold text-slate-800 text-xs sm:text-sm flex-1">
                        {item.tingkat}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <input
                          type="number"
                          value={item.jumlah}
                          onChange={(e) => handlePendidikanChange(idx, e.target.value)}
                          className="w-24 px-3 py-1.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold text-slate-900 bg-white focus:ring-2 focus:ring-primary"
                          min={0}
                        />
                        <span className="text-xs font-bold text-emerald-700 w-14 text-right">
                          {item.persentase}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 3: Mata Pencaharian / Pekerjaan */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Mata Pencaharian & Profesi Penduduk</h2>
                    <p className="text-xs text-slate-500">Sebaran profesi dan sektor pekerjaan warga Tenjonagara</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2">
                  {formData.pekerjaan.map((job, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-50/60 border border-slate-200/80 flex items-center justify-between gap-4"
                    >
                      <div className="font-semibold text-slate-800 text-xs sm:text-sm flex-1 truncate">
                        {job.pekerjaan}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <input
                          type="number"
                          value={job.jumlah}
                          onChange={(e) => handlePekerjaanChange(idx, e.target.value)}
                          className="w-24 px-3 py-1.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold text-slate-900 bg-white focus:ring-2 focus:ring-primary"
                          min={0}
                        />
                        <span className="text-xs font-bold text-amber-700 w-14 text-right">
                          {job.persentase}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Save Button */}
              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-bold shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Simpan Perubahan Demografi</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          TAB 2: TRANSPARANSI APBDES
      ══════════════════════════════════════════════════════════ */}
      {activeTab === 'apbdes' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0">
                <Coins className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Pagu Anggaran</div>
                <div className="text-lg sm:text-xl font-bold font-serif text-slate-900">{formatRupiah(totalPagu)}</div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Realisasi Belanja</div>
                <div className="text-lg sm:text-xl font-bold font-serif text-emerald-700">{formatRupiah(totalRealisasi)}</div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold shrink-0">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tingkat Penyerapan</div>
                <div className="text-lg sm:text-xl font-bold font-serif text-amber-700">{penyerapanPersen}%</div>
              </div>
            </div>
          </div>

          {/* Table Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Daftar Rincian Bidang APBDes</h2>
                <p className="text-xs text-slate-500">Anggaran Pendapatan dan Belanja Desa per bidang kegiatan</p>
              </div>

              <button
                type="button"
                onClick={handleOpenAddApbdes}
                className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shadow-xs"
              >
                <Plus className="w-4 h-4 text-accent" />
                <span>Tambah Bidang Anggaran</span>
              </button>
            </div>

            {apbdesLoading ? (
              <div className="p-12 text-center text-slate-400 space-y-3">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                <p className="text-xs sm:text-sm">Memuat data APBDes...</p>
              </div>
            ) : apbdesList.length === 0 ? (
              <div className="p-12 text-center text-slate-500 space-y-2">
                <Coins className="w-12 h-12 mx-auto text-slate-300" />
                <p className="text-sm font-bold text-slate-700">Belum ada rincian data APBDes</p>
                <p className="text-xs text-slate-400">Klik tombol "Tambah Bidang Anggaran" untuk memasukkan data.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-3.5 px-4 sm:px-6">Tahun</th>
                      <th className="py-3.5 px-4">Bidang Kegiatan</th>
                      <th className="py-3.5 px-4">Pagu Anggaran</th>
                      <th className="py-3.5 px-4">Realisasi</th>
                      <th className="py-3.5 px-4 text-center">Penyerapan</th>
                      <th className="py-3.5 px-4 text-right pr-6">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {apbdesList.map((item) => {
                      const pagu = Number(item.pagu_anggaran) || 0;
                      const real = Number(item.realisasi) || 0;
                      const pct = pagu > 0 ? ((real / pagu) * 100).toFixed(1) : 0;

                      return (
                        <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-4 px-4 sm:px-6 font-bold font-mono text-slate-700">
                            {item.tahun}
                          </td>
                          <td className="py-4 px-4 font-semibold text-slate-900">{item.bidang}</td>
                          <td className="py-4 px-4 font-mono font-bold text-slate-800">
                            {formatRupiah(pagu)}
                          </td>
                          <td className="py-4 px-4 font-mono font-bold text-emerald-700">
                            {formatRupiah(real)}
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                                Number(pct) >= 80
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : Number(pct) >= 50
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {pct}%
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right pr-6">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleOpenEditApbdes(item)}
                                className="p-2 rounded-xl text-slate-500 hover:text-primary hover:bg-slate-100 transition-colors"
                                title="Edit Anggaran"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteApbdesTarget(item)}
                                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                title="Hapus Anggaran"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── MODAL FORM TAMBAH / EDIT APBDES ── */}
      {apbdesModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in duration-200">
            <div className="p-6 bg-primary text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Coins className="w-5 h-5 text-accent" />
                <h3 className="font-serif font-bold text-base sm:text-lg">
                  {apbdesEditingItem ? 'Edit Bidang Anggaran APBDes' : 'Tambah Bidang Anggaran APBDes'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setApbdesModalOpen(false)}
                className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveApbdes} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Tahun Anggaran <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  value={apbdesFormData.tahun}
                  onChange={(e) => setApbdesFormData({ ...apbdesFormData, tahun: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-800"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Nama Bidang Kegiatan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Bidang Pelaksanaan Pembangunan Desa"
                  value={apbdesFormData.bidang}
                  onChange={(e) => setApbdesFormData({ ...apbdesFormData, bidang: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Pagu Anggaran (Rp) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="Contoh: 450000000"
                  value={apbdesFormData.pagu_anggaran}
                  onChange={(e) => setApbdesFormData({ ...apbdesFormData, pagu_anggaran: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-mono text-slate-800"
                  min={0}
                  required
                />
                <span className="text-[11px] text-slate-500 block">
                  Pratinjau: {formatRupiah(Number(apbdesFormData.pagu_anggaran))}
                </span>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Realisasi Belanja (Rp)
                </label>
                <input
                  type="number"
                  placeholder="Contoh: 380000000"
                  value={apbdesFormData.realisasi}
                  onChange={(e) => setApbdesFormData({ ...apbdesFormData, realisasi: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-mono text-slate-800"
                  min={0}
                />
                <span className="text-[11px] text-slate-500 block">
                  Pratinjau: {formatRupiah(Number(apbdesFormData.realisasi))}
                </span>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setApbdesModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={apbdesActionLoading}
                  className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-md disabled:opacity-50"
                >
                  {apbdesActionLoading ? 'Menyimpan...' : 'Simpan Bidang Anggaran'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── CONFIRM DELETE APBDES MODAL ── */}
      <ConfirmModal
        isOpen={!!deleteApbdesTarget}
        onClose={() => setDeleteApbdesTarget(null)}
        onConfirm={handleConfirmDeleteApbdes}
        title="Hapus Bidang Anggaran APBDes"
        message={`Apakah Anda yakin ingin menghapus bidang anggaran "${deleteApbdesTarget?.bidang}"? Data ini akan terhapus dari tabel transparansi publik.`}
        confirmText="Ya, Hapus"
        cancelText="Batal"
        variant="danger"
        loading={apbdesActionLoading}
      />
    </div>
  );
}
