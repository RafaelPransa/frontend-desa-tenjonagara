import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  FileText,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { createLayanan, updateLayanan, getLayananById } from '../../services/adminService';

export default function LayananForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nama_layanan: '',
    deskripsi: '',
    syarat: ''
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
          const res = await getLayananById(id);
          const data = res.data?.data || res.data;
          if (data) {
            setFormData({
              nama_layanan: data.nama_layanan || '',
              deskripsi: data.deskripsi || '',
              syarat: data.syarat || ''
            });
          }
        } catch (err) {
          setError('Gagal memuat detail layanan publik.');
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

    if (!formData.nama_layanan.trim()) {
      setError('Nama jenis layanan wajib diisi.');
      return;
    }

    if (!formData.deskripsi.trim()) {
      setError('Deskripsi layanan wajib diisi.');
      return;
    }

    setLoading(true);
    try {
      if (isEdit) {
        await updateLayanan(id, formData);
      } else {
        await createLayanan(formData);
      }
      setSuccess(true);
      setTimeout(() => {
        navigate('/admin/layanan');
      }, 1200);
    } catch (err) {
      setError(err.message || 'Gagal menyimpan jenis layanan.');
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
            to="/admin/layanan"
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            title="Kembali ke Daftar Layanan"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
              {isEdit ? 'Edit Layanan Publik' : 'Tambah Jenis Layanan Baru'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              {isEdit ? `Mengubah data layanan #${id}` : 'Isi formulir di bawah ini untuk mendaftarkan jenis pengurusan surat/layanan'}
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
          <span>Jenis layanan berhasil {isEdit ? 'diperbarui' : 'ditambahkan'}! Mengalihkan...</span>
        </div>
      )}

      {/* Main Form */}
      {fetching ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-sm font-medium text-slate-500">Memuat data layanan...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          {/* Nama Layanan */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Nama Layanan / Pengurusan Surat <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="nama_layanan"
              placeholder="Contoh: Surat Keterangan Usaha (SKU) / Surat Keterangan Domisili"
              value={formData.nama_layanan}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary text-sm font-semibold text-slate-900"
              required
            />
          </div>

          {/* Deskripsi */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Deskripsi & Penjelasan Layanan <span className="text-rose-500">*</span>
            </label>
            <textarea
              name="deskripsi"
              rows={4}
              placeholder="Jelaskan kegunaan dan informasi umum layanan ini bagi masyarakat..."
              value={formData.deskripsi}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary text-sm text-slate-800 leading-relaxed"
              required
            />
          </div>

          {/* Persyaratan Dokumen */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Persyaratan Dokumen & Berkas
            </label>
            <textarea
              name="syarat"
              rows={6}
              placeholder="Tuliskan daftar persyaratan berkas (gunakan nomor/baris baru)...&#10;1. Fotokopi KTP Pemohon&#10;2. Fotokopi KK&#10;3. Surat Pengantar RT/RW"
              value={formData.syarat}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary text-sm text-slate-800 font-mono leading-relaxed"
            />
            <p className="text-[11px] text-slate-400">
              Tips: Tulis per baris dengan penomoran agar rapi saat ditampilkan di halaman warga.
            </p>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <Link
              to="/admin/layanan"
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
                  <span>{isEdit ? 'Simpan Perubahan' : 'Simpan Layanan'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
