import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Sparkles,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { createPotensi, updatePotensi, getPotensiById } from '../../services/adminService';
import ImageUploader from '../../components/ImageUploader';

const categoryOptions = [
  { value: 'pertanian', label: 'Pertanian & Perkebunan' },
  { value: 'umkm', label: 'UMKM & Produk Kerajinan Lokal' },
  { value: 'wisata', label: 'Wisata Alam & Destinasi Komunitas' },
  { value: 'perikanan', label: 'Perikanan & Peternakan' },
  { value: 'lainnya', label: 'Kategori Lainnya' },
];

export default function PotensiForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nama: '',
    kategori: 'pertanian',
    deskripsi: '',
    gambar_url: ''
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
          const res = await getPotensiById(id);
          const data = res.data?.data || res.data;
          if (data) {
            setFormData({
              nama: data.nama || '',
              kategori: data.kategori || 'pertanian',
              deskripsi: data.deskripsi || '',
              gambar_url: data.gambar_url || ''
            });
          }
        } catch (err) {
          setError('Gagal memuat detail potensi desa.');
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
      setError('Nama potensi desa wajib diisi.');
      return;
    }

    if (!formData.deskripsi.trim()) {
      setError('Deskripsi potensi desa wajib diisi.');
      return;
    }

    setLoading(true);
    try {
      if (isEdit) {
        await updatePotensi(id, formData);
      } else {
        await createPotensi(formData);
      }
      setSuccess(true);
      setTimeout(() => {
        navigate('/admin/potensi');
      }, 1200);
    } catch (err) {
      setError(err.message || 'Gagal menyimpan data potensi desa.');
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
            to="/admin/potensi"
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            title="Kembali ke Daftar Potensi"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
              {isEdit ? 'Edit Potensi Desa' : 'Tambah Potensi Desa Baru'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              {isEdit ? `Mengubah potensi #${id}` : 'Isi formulir untuk mempublikasikan potensi komoditas/wisata desa'}
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
          <span>Data potensi berhasil {isEdit ? 'diperbarui' : 'ditambahkan'}! Mengalihkan...</span>
        </div>
      )}

      {/* Main Form */}
      {fetching ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-sm font-medium text-slate-500">Memuat data potensi...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          {/* Nama Potensi */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Nama Potensi / Komoditas / Produk <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="nama"
              placeholder="Contoh: Perkebunan Teh & Padi Sawah Organik / Kerajinan Kopi Asli Cigalontang"
              value={formData.nama}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary text-sm font-semibold text-slate-900"
              required
            />
          </div>

          {/* Kategori Potensi */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Kategori Potensi <span className="text-rose-500">*</span>
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

          {/* Image Uploader */}
          <ImageUploader
            label="Foto Unggulan Potensi Desa"
            value={formData.gambar_url}
            onChange={(url) => setFormData((prev) => ({ ...prev, gambar_url: url }))}
          />

          {/* Deskripsi */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Deskripsi Potensi & Nilai Unggulan <span className="text-rose-500">*</span>
            </label>
            <textarea
              name="deskripsi"
              rows={6}
              placeholder="Tuliskan deskripsi lengkap mengenai potensi desa, keunggulan produk, atau daya tarik wisata..."
              value={formData.deskripsi}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary text-sm text-slate-800 leading-relaxed"
              required
            />
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <Link
              to="/admin/potensi"
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
                  <span>{isEdit ? 'Simpan Perubahan' : 'Simpan Potensi'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
