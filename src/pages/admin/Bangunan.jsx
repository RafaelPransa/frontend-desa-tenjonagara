import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Plus,
  Search,
  Edit,
  Trash2,
  ExternalLink,
  MapPin,
  Calendar,
  AlertCircle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import { getAdminBangunan, deleteBangunan } from '../../services/adminService';

const categories = [
  { key: 'all', label: 'Semua Kategori' },
  { key: 'fasilitas_pendidikan', label: 'Pendidikan' },
  { key: 'fasilitas_kesehatan', label: 'Kesehatan' },
  { key: 'fasilitas_umum', label: 'Umum & Kantor' },
  { key: 'fasilitas_ibadah', label: 'Ibadah' },
  { key: 'fasilitas_olahraga', label: 'Olahraga' },
];

export default function AdminBangunan() {
  const [bangunanList, setBangunanList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchBangunan = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAdminBangunan();
      const list = res.data?.data || res.data || [];
      setBangunanList(Array.isArray(list) ? list : []);
    } catch (err) {
      setError('Gagal mengambil data bangunan desa.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBangunan();
  }, []);

  const handleDelete = async (id, nama) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus data bangunan:\n"${nama}"?`)) {
      return;
    }

    setDeletingId(id);
    setError(null);
    setSuccessMsg(null);

    try {
      await deleteBangunan(id);
      setSuccessMsg(`Bangunan "${nama}" berhasil dihapus.`);
      setBangunanList((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      setError(err.message || 'Gagal menghapus data bangunan.');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredList = bangunanList.filter((item) => {
    const matchSearch =
      item.nama.toLowerCase().includes(search.toLowerCase()) ||
      (item.deskripsi && item.deskripsi.toLowerCase().includes(search.toLowerCase())) ||
      (item.alamat && item.alamat.toLowerCase().includes(search.toLowerCase()));
    const matchCategory = categoryFilter === 'all' || item.kategori === categoryFilter;
    return matchSearch && matchCategory;
  });

  const getCategoryLabel = (catKey) => {
    const found = categories.find((c) => c.key === catKey);
    return found ? found.label : catKey;
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold shadow-xs">
            <Building2 className="w-6 h-6 text-blue-700" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">Kelola Bangunan & Fasilitas Desa</h1>
            <p className="text-xs sm:text-sm text-slate-500">Daftar aset fisik, sekolah, puskesmas, dan fasilitas publik</p>
          </div>
        </div>

        <Link
          to="/admin/bangunan/tambah"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs sm:text-sm shadow-md transition-all group shrink-0"
        >
          <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span>Tambah Bangunan Baru</span>
        </Link>
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Cari nama bangunan atau lokasi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary text-xs sm:text-sm"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end overflow-x-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold bg-white text-slate-800 focus:ring-2 focus:ring-primary"
          >
            {categories.map((cat) => (
              <option key={cat.key} value={cat.key}>
                {cat.label}
              </option>
            ))}
          </select>

          <button
            onClick={fetchBangunan}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors shrink-0"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Bangunan Table / Grid */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-primary" />
            <p className="text-xs sm:text-sm font-medium">Memuat data bangunan desa...</p>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-3">
            <Building2 className="w-12 h-12 mx-auto text-slate-300" />
            <p className="text-sm font-bold text-slate-700">Tidak ada data bangunan ditemukan</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {search ? 'Coba ubah kata kunci pencarian Anda.' : 'Belum ada data bangunan yang ditambahkan.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4 sm:px-6">Nama Bangunan</th>
                  <th className="py-3.5 px-4">Kategori</th>
                  <th className="py-3.5 px-4 hidden md:table-cell">Alamat / Lokasi</th>
                  <th className="py-3.5 px-4 hidden sm:table-cell">Tahun</th>
                  <th className="py-3.5 px-4 text-right pr-6">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {filteredList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        {item.gambar_url ? (
                          <img
                            src={item.gambar_url}
                            alt={item.nama}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                            <Building2 className="w-5 h-5 text-blue-600" />
                          </div>
                        )}
                        <div className="space-y-0.5">
                          <div className="font-bold text-slate-900 line-clamp-1 max-w-xs sm:max-w-md">
                            {item.nama}
                          </div>
                          <div className="text-[11px] text-slate-400 line-clamp-1 max-w-xs">
                            {item.deskripsi}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold border border-slate-200">
                        {getCategoryLabel(item.kategori)}
                      </span>
                    </td>

                    <td className="py-4 px-4 hidden md:table-cell text-slate-600">
                      <div className="flex items-center gap-1.5 text-xs">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate max-w-xs">{item.alamat || 'Desa Tenjonagara'}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4 hidden sm:table-cell text-slate-500 text-xs">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.tahun_dibangun || '-'}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-right pr-6">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/bangunan/${item.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                          title="Lihat Tampilan Publik"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>

                        <Link
                          to={`/admin/bangunan/${item.id}`}
                          className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors"
                          title="Edit Bangunan"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>

                        <button
                          onClick={() => handleDelete(item.id, item.nama)}
                          disabled={deletingId === item.id}
                          className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors disabled:opacity-50"
                          title="Hapus Bangunan"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
