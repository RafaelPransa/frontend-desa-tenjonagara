import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Users,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { createPerangkat, updatePerangkat, getPerangkatById } from '../../services/adminService';
import ImageUploader from '../../components/ImageUploader';

export default function PerangkatForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nama: '',
    jabatan: '',
    foto_url: '',
    no_hp: '',
    urutan: 1
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
          const res = await getPerangkatById(id);
          const data = res.data?.data || res.data;
          if (data) {
            setFormData({
              nama: data.nama || '',
              jabatan: data.jabatan || '',
              foto_url: data.foto_url || '',
              no_hp: data.no_hp || '',
              urutan: data.urutan || 1
            });
          }
        } catch (err) {
          setError('Gagal memuat detail data perangkat desa.');
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
      setError('Nama perangkat desa wajib diisi.');
      return;
    }

    if (!formData.jabatan.trim()) {
      setError('Jabatan wajib diisi.');
      return;
    }

    setLoading(true);
    try {
      if (isEdit) {
        await updatePerangkat(id, formData);
      } else {
        await createPerangkat(formData);
      }
      setSuccess(true);
      setTimeout(() => {
        navigate('/admin/perangkat');
      }, 1200);
    } catch (err) {
      setError(err.message || 'Gagal menyimpan data perangkat desa.');
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
            to="/admin/perangkat"
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            title="Kembali ke Daftar Perangkat"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
              {isEdit ? 'Edit Perangkat Desa' : 'Tambah Perangkat Desa Baru'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              {isEdit ? `Mengubah aparatur #${id}` : 'Isi formulir di bawah ini untuk menambah aparatur pemerintah desa'}
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
          <span>Data perangkat desa berhasil {isEdit ? 'diperbarui' : 'ditambahkan'}! Mengalihkan...</span>
        </div>
      )}

      {/* Main Form */}
      {fetching ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-sm font-medium text-slate-500">Memuat data perangkat desa...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Nama Lengkap */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Nama Lengkap & Gelar <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="nama"
                placeholder="Contoh: Asep Saepulloh, S.IP"
                value={formData.nama}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary text-sm font-semibold text-slate-900"
                required
              />
            </div>

            {/* Jabatan */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Jabatan Struktural <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="jabatan"
                placeholder="Contoh: Kepala Desa / Sekretaris Desa / Kaur Keuangan"
                value={formData.jabatan}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary text-sm font-semibold text-slate-900"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* No HP */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Nomor HP / Whatsapp Kontak
              </label>
              <input
                type="text"
                name="no_hp"
                placeholder="Contoh: 081234567890"
                value={formData.no_hp}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary text-sm font-mono text-slate-800"
              />
            </div>

            {/* Urutan Tampil */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Urutan Tampil (Angka)
              </label>
              <input
                type="number"
                name="urutan"
                placeholder="Contoh: 1 (Kepala Desa), 2 (Sekretaris)"
                value={formData.urutan}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary text-sm text-slate-800"
              />
            </div>
          </div>

          {/* Image Uploader */}
          <ImageUploader
            label="Foto Resmi Perangkat Desa"
            value={formData.foto_url}
            onChange={(url) => setFormData((prev) => ({ ...prev, foto_url: url }))}
          />

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <Link
              to="/admin/perangkat"
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
                  <span>{isEdit ? 'Simpan Perubahan' : 'Simpan Perangkat'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
