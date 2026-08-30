import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Landmark,
  Save,
  Map,
  Users,
  ShieldCheck,
  Globe,
  AlertCircle,
  CheckCircle,
  Loader2,
  RefreshCw,
  Sparkles,
  BookOpen,
  Compass,
  FileText
} from 'lucide-react';
import { getAdminProfil, updateAdminProfil } from '../../services/adminService';
import ScrollReveal from '../../components/ScrollReveal';

export default function AdminProfil() {
  const [formData, setFormData] = useState({
    sejarah: '',
    visi: '',
    misi: '',
    luas_wilayah: '',
    jumlah_dusun: 0,
    jumlah_rw: 0,
    jumlah_rt: 0
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const fetchProfil = async () => {
    setFetching(true);
    setError(null);
    try {
      const res = await getAdminProfil();
      const data = res.data?.data || res.data;
      if (data) {
        setFormData({
          sejarah: data.sejarah || '',
          visi: data.visi || '',
          misi: data.misi || '',
          luas_wilayah: data.luas_wilayah || '490 Hektar',
          jumlah_dusun: Number(data.jumlah_dusun) || 4,
          jumlah_rw: Number(data.jumlah_rw) || 8,
          jumlah_rt: Number(data.jumlah_rt) || 38
        });
      }
    } catch (err) {
      setError('Gagal memuat data profil desa dari server.');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchProfil();
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await updateAdminProfil(formData);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 4000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Gagal menyimpan pembaruan profil desa.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Banner */}
      <ScrollReveal direction="down" delay={0}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-primary flex items-center justify-center font-bold shadow-sm shrink-0">
              <Landmark className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-accent uppercase tracking-wider">Pemerintahan & Informasi Publik</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 mt-0.5">
                Kelola Profil Desa Tenjonagara
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Perbarui visi, misi, asal-usul sejarah, serta data kewilayahan desa yang ditampilkan ke publik.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              to="/profil"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5"
            >
              <Globe className="w-4 h-4 text-emerald-600" />
              <span>Lihat Halaman Publik</span>
            </Link>

            <button
              type="button"
              onClick={fetchProfil}
              disabled={fetching || loading}
              className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors disabled:opacity-50"
              title="Muat Ulang Data"
            >
              <RefreshCw className={`w-4 h-4 ${fetching ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </ScrollReveal>

      {/* Status Alerts */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-3 animate-fade-in">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-3 animate-fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Profil Desa Tenjonagara berhasil diperbarui! Perubahan telah tersimpan dan aktif di halaman publik.</span>
        </div>
      )}

      {/* Main Content / Form */}
      {fetching ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 space-y-3">
          <Loader2 className="w-9 h-9 animate-spin mx-auto text-primary" />
          <p className="text-sm font-semibold text-slate-600">Memuat data profil desa...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card 1: Data Kewilayahan */}
          <ScrollReveal direction="up" delay={50}>
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0">
                  <Map className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Data Wilayah & Administrasi</h2>
                  <p className="text-xs text-slate-500">Statistik cakupan wilayah administratif Desa Tenjonagara</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Luas Wilayah */}
                <div className="space-y-1.5 bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Map className="w-3.5 h-3.5 text-accent" />
                    <span>Luas Wilayah</span>
                  </label>
                  <input
                    type="text"
                    name="luas_wilayah"
                    placeholder="Contoh: 490 Hektar"
                    value={formData.luas_wilayah}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-primary text-sm font-semibold text-slate-800"
                    required
                  />
                  <p className="text-[11px] text-slate-500">Cantumkan satuan (Hektar / km²)</p>
                </div>

                {/* Jumlah Dusun */}
                <div className="space-y-1.5 bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Landmark className="w-3.5 h-3.5 text-accent" />
                    <span>Jumlah Dusun</span>
                  </label>
                  <input
                    type="number"
                    name="jumlah_dusun"
                    placeholder="4"
                    value={formData.jumlah_dusun}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-primary text-sm font-bold text-slate-800"
                    min={0}
                    required
                  />
                  <p className="text-[11px] text-slate-500">Total dusun di Desa Tenjonagara</p>
                </div>

                {/* Jumlah RW */}
                <div className="space-y-1.5 bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-accent" />
                    <span>Jumlah RW</span>
                  </label>
                  <input
                    type="number"
                    name="jumlah_rw"
                    placeholder="8"
                    value={formData.jumlah_rw}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-primary text-sm font-bold text-slate-800"
                    min={0}
                    required
                  />
                  <p className="text-[11px] text-slate-500">Rukun Warga aktif</p>
                </div>

                {/* Jumlah RT */}
                <div className="space-y-1.5 bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                    <span>Jumlah RT</span>
                  </label>
                  <input
                    type="number"
                    name="jumlah_rt"
                    placeholder="38"
                    value={formData.jumlah_rt}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-primary text-sm font-bold text-slate-800"
                    min={0}
                    required
                  />
                  <p className="text-[11px] text-slate-500">Rukun Tetangga aktif</p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 2: Visi & Misi */}
          <ScrollReveal direction="up" delay={100}>
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold shrink-0">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Visi & Misi Pembangunan Desa</h2>
                  <p className="text-xs text-slate-500">Arah haluan dan target strategis kepemimpinan Desa Tenjonagara</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Visi Desa */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-accent" />
                    <span>Visi Desa</span>
                  </label>
                  <textarea
                    name="visi"
                    rows={6}
                    placeholder="Tuliskan pernyataan visi pembangunan desa..."
                    value={formData.visi}
                    onChange={handleChange}
                    className="w-full p-4 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-primary text-sm text-slate-800 leading-relaxed resize-y"
                    required
                  />
                  <p className="text-[11px] text-slate-500 italic">
                    * Ditampilkan sebagai kutipan utama berlatar gradien hijau di halaman Profil Publik.
                  </p>
                </div>

                {/* Misi Desa */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-accent" />
                    <span>Misi Desa (Daftar Poin-Poin)</span>
                  </label>
                  <textarea
                    name="misi"
                    rows={6}
                    placeholder="1. Meningkatkan profesionalisme pelayanan publik.&#10;2. Meningkatkan kualitas sumber daya manusia..."
                    value={formData.misi}
                    onChange={handleChange}
                    className="w-full p-4 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-primary text-sm text-slate-800 leading-relaxed font-sans resize-y"
                    required
                  />
                  <p className="text-[11px] text-slate-500 italic">
                    * Pisahkan tiap poin misi dengan baris baru (Enter) atau penomoran 1, 2, 3...
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 3: Sejarah & Asal Usul */}
          <ScrollReveal direction="up" delay={150}>
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Sejarah & Asal Usul Desa Tenjonagara</h2>
                  <p className="text-xs text-slate-500">Narasi historis, pemekaran wilayah, dan nilai kearifan lokal</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Uraian Lengkap Sejarah Desa
                </label>
                <textarea
                  name="sejarah"
                  rows={9}
                  placeholder="Tuliskan sejarah berdirinya desa, asal-usul penamaan, perjalanan pembangunan..."
                  value={formData.sejarah}
                  onChange={handleChange}
                  className="w-full p-4 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-primary text-sm sm:text-base text-slate-800 leading-relaxed resize-y"
                  required
                />
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Dukungan format paragraf rapi (Enter untuk paragraf baru)</span>
                  <span>{formData.sejarah.length} Karakter</span>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Bottom Sticky Action Bar */}
          <div className="sticky bottom-4 z-20 bg-white/90 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xl flex items-center justify-between gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Perubahan akan langsung diperbarui ke database & halaman profil publik</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={fetchProfil}
                disabled={loading}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold transition-colors disabled:opacity-50"
              >
                Reset Perubahan
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-bold shadow-md shadow-primary/20 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Simpan Profil Desa</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
