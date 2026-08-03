import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { createBerita, updateBerita, getBeritaByIdOrSlug } from '../../services/adminService';
import ImageUploader from '../../components/ImageUploader';

export default function BeritaForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    judul: '',
    status: 'published',
    gambar_url: '',
    konten: ''
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isEdit) {
      async function loadBerita() {
        setFetching(true);
        setError(null);
        try {
          const res = await getBeritaByIdOrSlug(id);
          const data = res.data?.data || res.data;
          if (data) {
            setFormData({
              judul: data.judul || '',
              status: data.status || 'published',
              gambar_url: data.gambar_url || '',
              konten: data.konten || ''
            });
          }
        } catch (err) {
          setError('Gagal memuat detail berita. Pastikan data berita tersedia.');
        } finally {
          setFetching(false);
        }
      }
      loadBerita();
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

    if (!formData.judul.trim() || formData.judul.length < 5) {
      setError('Judul berita minimal 5 karakter.');
      return;
    }

    if (!formData.konten.trim() || formData.konten.length < 20) {
      setError('Konten berita minimal 20 karakter.');
      return;
    }

    setLoading(true);
    try {
      if (isEdit) {
        await updateBerita(id, formData);
      } else {
        await createBerita(formData);
      }
      setSuccess(true);
      setTimeout(() => {
        navigate('/admin/berita');
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan berita. Silakan periksa kembali.');
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
            to="/admin/berita"
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            title="Kembali ke Daftar Berita"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
              {isEdit ? 'Edit Berita' : 'Tambah Berita Baru'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              {isEdit ? `Mengubah berita #${id}` : 'Isi formulir di bawah ini untuk merilis berita desa baru'}
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
          <span>Berita berhasil {isEdit ? 'diperbarui' : 'dibuat'}! Mengalihkan...</span>
        </div>
      )}

      {/* Main Form */}
      {fetching ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-sm font-medium text-slate-500">Memuat data berita...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          {/* Judul Berita */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Judul Berita <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="judul"
              placeholder="Contoh: Pelatihan Kewirausahaan UMKM Desa Tenjonagara"
              value={formData.judul}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary text-sm sm:text-base font-semibold text-slate-900"
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Status Publikasi */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Status Publikasi <span className="text-rose-500">*</span>
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary text-sm font-semibold bg-white text-slate-800"
              >
                <option value="published">Published (Langsung Tampil di Website)</option>
                <option value="draft">Draft (Simpan Sementara)</option>
              </select>
            </div>

            {/* Image Uploader Component */}
            <ImageUploader
              label="Gambar Sampul / Headline Berita"
              value={formData.gambar_url}
              onChange={(url) => setFormData((prev) => ({ ...prev, gambar_url: url }))}
            />
          </div>

          {/* Konten Berita */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Isi Artikel / Konten Berita <span className="text-rose-500">*</span>
            </label>
            <textarea
              name="konten"
              rows={10}
              placeholder="Tuliskan berita lengkap di sini..."
              value={formData.konten}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary text-sm text-slate-800 leading-relaxed"
              required
            />
          </div>

          {/* Form Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <Link
              to="/admin/berita"
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
                  <span>{isEdit ? 'Simpan Perubahan' : 'Publikasikan Berita'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
