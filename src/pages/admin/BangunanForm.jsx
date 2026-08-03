import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Building2,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { createBangunan, updateBangunan, getBangunanById } from '../../services/adminService';
import ImageUploader from '../../components/ImageUploader';

const categoryOptions = [
  { value: 'fasilitas_pendidikan', label: 'Fasilitas Pendidikan (Sekolah, MDTA, PAUD)' },
  { value: 'fasilitas_kesehatan', label: 'Fasilitas Kesehatan (Puskesmas, Posyandu)' },
  { value: 'fasilitas_umum', label: 'Fasilitas Umum & Kantor Desa' },
  { value: 'fasilitas_ibadah', label: 'Fasilitas Ibadah (Masjid, Musholla)' },
  { value: 'fasilitas_olahraga', label: 'Fasilitas Olahraga & Lapangan' },
];

export default function BangunanForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nama: '',
    kategori: 'fasilitas_umum',
    deskripsi: '',
    gambar_url: '',
    alamat: ''
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isEdit) {
      async function loadData() {
        setFetching(true);
        setError(null);
        try {
          const res = await getBangunanById(id);
          const data = res.data?.data || res.data;
          if (data) {
            setFormData({
              nama: data.nama || '',
              kategori: data.kategori || 'fasilitas_umum',
              deskripsi: data.deskripsi || '',
              gambar_url: data.gambar_url || '',
              alamat: data.alamat || ''
            });
          }
        } catch (err) {
          setError('Gagal memuat detail data bangunan desa.');
        } finally {
          setFetching(false);
        }
      }
      loadData();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!formData.nama.trim()) {
      setError('Nama bangunan wajib diisi.');
      return;
    }

    if (!formData.deskripsi.trim()) {
      setError('Deskripsi bangunan wajib diisi.');
      return;
    }

    setLoading(true);
    try {
      if (isEdit) {
        await updateBangunan(id, formData);
      } else {
        await createBangunan(formData);
      }
      setSuccess(true);
      setTimeout(() => {
        navigate('/admin/bangunan');
      }, 1200);
    } catch (err) {
      setError(err.message || 'Gagal menyimpan data bangunan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/bangunan"
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            title="Kembali ke Daftar Bangunan"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
              {isEdit ? 'Edit Bangunan Desa' : 'Tambah Bangunan Desa Baru'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              {isEdit ? `Mengubah data bangunan #${id}` : 'Isi formulir di bawah ini untuk mendaftarkan aset bangunan desa'}
            </p>
          </div>
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
          <span>Data bangunan berhasil {isEdit ? 'diperbarui' : 'ditambahkan'}! Mengalihkan...</span>
        </div>
      )}

      {/* Main Form */}
      {fetching ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-sm font-medium text-slate-500">Memuat data bangunan...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          {/* Nama Bangunan */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Nama Bangunan / Fasilitas <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="nama"
              placeholder="Contoh: Balai Desa Tenjonagara / Posyandu Melati Dusun 2"
              value={formData.nama}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary text-sm font-semibold text-slate-900"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Kategori Bangunan */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Kategori Fasilitas <span className="text-rose-500">*</span>
              </label>
              <select
                name="kategori"
                value={formData.kategori}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary text-sm font-semibold bg-white text-slate-800"
              >
                {categoryOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Alamat / Lokasi */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Alamat / Dusun / Lokasi Fisik
              </label>
              <input
                type="text"
                name="alamat"
                placeholder="Contoh: Dusun 1 RT 02 RW 04 Desa Tenjonagara"
                value={formData.alamat}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary text-sm text-slate-800"
              />
            </div>
          </div>

          {/* Image Uploader */}
          <ImageUploader
            label="Foto Fisik Bangunan"
            value={formData.gambar_url}
            onChange={(url) => setFormData((prev) => ({ ...prev, gambar_url: url }))}
          />

          {/* Deskripsi */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Deskripsi & Sejarah / Fasilitas Bangunan <span className="text-rose-500">*</span>
            </label>
            <textarea
              name="deskripsi"
              rows={6}
              placeholder="Jelaskan fungsi, kapasitas, sejarah berdiri, atau fasilitas yang ada di bangunan ini..."
              value={formData.deskripsi}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary text-sm text-slate-800 leading-relaxed"
              required
            />
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <Link
              to="/admin/bangunan"
              className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition-colors"
            >
              Batal
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-bold shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{isEdit ? 'Simpan Perubahan' : 'Simpan Bangunan'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
