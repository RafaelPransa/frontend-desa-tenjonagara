import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Plus,
  Search,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import { getAdminPotensi, deletePotensi } from '../../services/adminService';
import ScrollReveal from '../../components/ScrollReveal';

const categories = [
  { key: 'all', label: 'Semua Kategori' },
  { key: 'pertanian', label: 'Pertanian & Perkebunan' },
  { key: 'umkm', label: 'UMKM & Kerajinan' },
  { key: 'wisata', label: 'Wisata & Alam' },
  { key: 'perikanan', label: 'Perikanan & Peternakan' },
  { key: 'lainnya', label: 'Lainnya' },
];

export default function AdminPotensi() {
  const [potensiList, setPotensiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchPotensi = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAdminPotensi();
      const list = res.data?.data || res.data || [];
      setPotensiList(Array.isArray(list) ? list : []);
    } catch (err) {
      setError('Gagal mengambil data potensi desa.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPotensi();
  }, []);

  const handleDelete = async (id, nama) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus potensi desa:\n"${nama}"?`)) {
      return;
    }

    setDeletingId(id);
    setError(null);
    setSuccessMsg(null);

    try {
      await deletePotensi(id);
      setSuccessMsg(`Potensi desa "${nama}" berhasil dihapus.`);
      setPotensiList((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(err.message || 'Gagal menghapus potensi desa.');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredList = potensiList.filter((item) => {
    const matchSearch =
      item.nama.toLowerCase().includes(search.toLowerCase()) ||
      (item.deskripsi && item.deskripsi.toLowerCase().includes(search.toLowerCase()));

    const matchCategory = categoryFilter === 'all' || item.kategori === categoryFilter;
    return matchSearch && matchCategory;
  });

  const getCategoryMeta = (catKey) => {
    switch (catKey) {
      case 'pertanian':
        return { label: 'Pertanian & Perkebunan', badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-200' };
      case 'umkm':
        return { label: 'UMKM & Kerajinan', badgeClass: 'bg-amber-100 text-amber-900 border-amber-200' };
      case 'wisata':
        return { label: 'Wisata & Alam', badgeClass: 'bg-teal-100 text-teal-900 border-teal-200' };
      case 'perikanan':
        return { label: 'Perikanan & Peternakan', badgeClass: 'bg-blue-100 text-blue-900 border-blue-200' };
      default:
        return { label: catKey || 'Lainnya', badgeClass: 'bg-purple-100 text-purple-900 border-purple-200' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <ScrollReveal direction="down" delay={0}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold shadow-xs shrink-0">
              <Sparkles className="w-6 h-6 text-amber-700" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">Kelola Potensi Desa</h1>
              <p className="text-xs sm:text-sm text-slate-500">Hasil perkebunan, produk UMKM warga, dan objek wisata lokal</p>
            </div>
          </div>

          <Link
            to="/admin/potensi/tambah"
            className="px-5 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4 text-accent" />
            <span>Tambah Potensi Baru</span>
          </Link>
        </div>
      </ScrollReveal>

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
            placeholder="Cari potensi atau deskripsi..."
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
            onClick={fetchPotensi}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors shrink-0"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Potensi Grid / Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-primary" />
            <p className="text-xs sm:text-sm font-medium">Memuat data potensi desa...</p>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-3">
            <Sparkles className="w-12 h-12 mx-auto text-slate-300" />
            <p className="text-sm font-bold text-slate-700">Tidak ada data potensi ditemukan</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {search ? 'Coba ubah kata kunci pencarian Anda.' : 'Belum ada data potensi desa yang ditambahkan.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4 sm:px-6">Nama Potensi</th>
                  <th className="py-3.5 px-4">Kategori</th>
                  <th className="py-3.5 px-4 hidden md:table-cell">Deskripsi Ringkas</th>
                  <th className="py-3.5 px-4 text-right pr-6">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {filteredList.map((item) => {
                  const meta = getCategoryMeta(item.kategori);

                  return (
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
                            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
                              <Sparkles className="w-5 h-5 text-amber-600" />
                            </div>
                          )}
                          <div className="font-bold text-slate-900 line-clamp-1 max-w-xs sm:max-w-md">
                            {item.nama}
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${meta.badgeClass}`}>
                          {meta.label}
                        </span>
                      </td>

                      <td className="py-4 px-4 hidden md:table-cell text-slate-600">
                        <span className="line-clamp-2 max-w-md text-xs">{item.deskripsi}</span>
                      </td>

                      <td className="py-4 px-4 text-right pr-6">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/admin/potensi/${item.id}`}
                            className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors"
                            title="Edit Potensi"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>

                          <button
                            onClick={() => handleDelete(item.id, item.nama)}
                            disabled={deletingId === item.id}
                            className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors disabled:opacity-50"
                            title="Hapus Potensi"
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
  );
}
