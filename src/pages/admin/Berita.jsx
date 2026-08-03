import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Newspaper,
  Plus,
  Search,
  Edit,
  Trash2,
  ExternalLink,
  Calendar,
  User,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Clock
} from 'lucide-react';
import { getAdminBerita, deleteBerita } from '../../services/adminService';

export default function AdminBerita() {
  const [beritaList, setBeritaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchBerita = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAdminBerita();
      if (res.data?.success && Array.isArray(res.data?.data)) {
        setBeritaList(res.data.data);
      } else if (Array.isArray(res.data)) {
        setBeritaList(res.data);
      } else {
        setBeritaList([]);
      }
    } catch (err) {
      setError('Gagal mengambil data berita. Pastikan server terhubung.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBerita();
  }, []);

  const handleDelete = async (id, judul) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus berita:\n"${judul}"?`)) {
      return;
    }

    setDeletingId(id);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await deleteBerita(id);
      if (res.data?.success || res.status === 200) {
        setSuccessMsg(`Berita "${judul}" berhasil dihapus.`);
        setBeritaList((prev) => prev.filter((b) => b.id !== id));
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menghapus berita.');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredBerita = beritaList.filter((item) => {
    const matchSearch = item.judul.toLowerCase().includes(search.toLowerCase()) ||
      (item.konten && item.konten.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-primary flex items-center justify-center font-bold shadow-xs">
            <Newspaper className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">Kelola Berita & Pengumuman</h1>
            <p className="text-xs sm:text-sm text-slate-500">Daftar semua artikel dan berita publikasi desa</p>
          </div>
        </div>

        <Link
          to="/admin/berita/tambah"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs sm:text-sm shadow-md transition-all group shrink-0"
        >
          <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span>Tambah Berita Baru</span>
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
            placeholder="Cari judul berita..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary text-xs sm:text-sm"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Semua ({beritaList.length})
            </button>
            <button
              onClick={() => setStatusFilter('published')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusFilter === 'published' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Published ({beritaList.filter((b) => b.status === 'published').length})
            </button>
            <button
              onClick={() => setStatusFilter('draft')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusFilter === 'draft' ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Draft ({beritaList.filter((b) => b.status === 'draft').length})
            </button>
          </div>

          <button
            onClick={fetchBerita}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* News Table / List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-primary" />
            <p className="text-xs sm:text-sm font-medium">Memuat data berita...</p>
          </div>
        ) : filteredBerita.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-3">
            <Newspaper className="w-12 h-12 mx-auto text-slate-300" />
            <p className="text-sm font-bold text-slate-700">Tidak ada data berita ditemukan</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {search ? 'Coba ubah kata kunci pencarian Anda.' : 'Belum ada berita yang ditambahkan.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4 sm:px-6">Info Berita</th>
                  <th className="py-3.5 px-4 hidden md:table-cell">Penulis</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 hidden sm:table-cell">Tanggal</th>
                  <th className="py-3.5 px-4 text-right pr-6">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {filteredBerita.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        {item.gambar_url ? (
                          <img
                            src={item.gambar_url}
                            alt={item.judul}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                            <Newspaper className="w-5 h-5 text-slate-400" />
                          </div>
                        )}
                        <div className="space-y-0.5">
                          <div className="font-bold text-slate-900 line-clamp-1 max-w-md">
                            {item.judul}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            slug: {item.slug}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 hidden md:table-cell text-slate-600">
                      <div className="flex items-center gap-1.5 text-xs">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.penulis?.nama || 'Admin Desa'}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      {item.status === 'published' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-200">
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                          <span>Published</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold border border-amber-200">
                          <Clock className="w-3 h-3 text-amber-600" />
                          <span>Draft</span>
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4 hidden sm:table-cell text-slate-500 text-xs">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          {item.created_at
                            ? new Date(item.created_at).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })
                            : '-'}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-right pr-6">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/berita/${item.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                          title="Lihat Tampilan Publik"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>

                        <Link
                          to={`/admin/berita/${item.id}`}
                          className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors"
                          title="Edit Berita"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>

                        <button
                          onClick={() => handleDelete(item.id, item.judul)}
                          disabled={deletingId === item.id}
                          className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors disabled:opacity-50"
                          title="Hapus Berita"
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
