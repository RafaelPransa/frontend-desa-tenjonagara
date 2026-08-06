import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  Phone,
  UserCheck,
  AlertCircle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import { getAdminPerangkat, deletePerangkat } from '../../services/adminService';
import ScrollReveal from '../../components/ScrollReveal';
import ConfirmModal from '../../components/ConfirmModal';

export default function AdminPerangkat() {
  const [perangkatList, setPerangkatList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null); // { id, nama }

  const fetchPerangkat = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAdminPerangkat();
      const list = res.data?.data || res.data || [];
      setPerangkatList(Array.isArray(list) ? list : []);
    } catch (err) {
      setError('Gagal mengambil data perangkat desa.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerangkat();
  }, []);

  const openDeleteModal = (id, nama) => {
    setDeleteTarget({ id, nama });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const { id, nama } = deleteTarget;

    setDeletingId(id);
    setError(null);
    setSuccessMsg(null);

    try {
      await deletePerangkat(id);
      setSuccessMsg(`Perangkat desa "${nama}" berhasil dihapus.`);
      setPerangkatList((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(err.message || 'Gagal menghapus data perangkat desa.');
    } finally {
      setDeletingId(null);
      setDeleteTarget(null);
    }
  };

  const filteredList = perangkatList.filter((item) => {
    return (
      item.nama.toLowerCase().includes(search.toLowerCase()) ||
      (item.jabatan && item.jabatan.toLowerCase().includes(search.toLowerCase()))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <ScrollReveal direction="down" delay={0}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold shadow-xs shrink-0">
              <Users className="w-6 h-6 text-purple-700" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">Kelola Perangkat Desa</h1>
              <p className="text-xs sm:text-sm text-slate-500">Struktur organisasi aparatur pemerintah dan foto profil aparatur desa</p>
            </div>
          </div>

          <Link
            to="/admin/perangkat/tambah"
            className="px-5 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4 text-accent" />
            <span>Tambah Perangkat Baru</span>
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

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Cari nama atau jabatan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary text-xs sm:text-sm"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        </div>

        <button
          onClick={fetchPerangkat}
          className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors shrink-0"
          title="Refresh Data"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Perangkat Grid / Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-primary" />
            <p className="text-xs sm:text-sm font-medium">Memuat data perangkat desa...</p>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-3">
            <Users className="w-12 h-12 mx-auto text-slate-300" />
            <p className="text-sm font-bold text-slate-700">Tidak ada perangkat desa ditemukan</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {search ? 'Coba ubah kata kunci pencarian Anda.' : 'Belum ada data perangkat desa yang ditambahkan.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4 sm:px-6">Nama Aparatur</th>
                  <th className="py-3.5 px-4">Jabatan</th>
                  <th className="py-3.5 px-4 hidden md:table-cell">Kontak (No HP)</th>
                  <th className="py-3.5 px-4 text-center hidden sm:table-cell">Urutan</th>
                  <th className="py-3.5 px-4 text-right pr-6">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {filteredList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        {item.foto_url ? (
                          <img
                            src={item.foto_url}
                            alt={item.nama}
                            className="w-11 h-11 rounded-xl object-cover border border-slate-200 shrink-0"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0">
                            <UserCheck className="w-5 h-5 text-purple-600" />
                          </div>
                        )}
                        <div className="font-bold text-slate-900 line-clamp-1 max-w-xs sm:max-w-md">
                          {item.nama}
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-purple-100 text-purple-900 text-[11px] font-bold border border-purple-200">
                        {item.jabatan}
                      </span>
                    </td>

                    <td className="py-4 px-4 hidden md:table-cell text-slate-600">
                      <div className="flex items-center gap-1.5 text-xs font-mono">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.no_hp || '-'}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-center hidden sm:table-cell text-slate-500 font-mono text-xs">
                      {item.urutan || '-'}
                    </td>

                    <td className="py-4 px-4 text-right pr-6">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/admin/perangkat/${item.id}`}
                          className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors"
                          title="Edit Perangkat"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>

                        <button
                          onClick={() => openDeleteModal(item.id, item.nama)}
                          disabled={deletingId === item.id}
                          className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors disabled:opacity-50"
                          title="Hapus Perangkat"
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

      {/* Modal Konfirmasi Hapus Perangkat */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Hapus Data Perangkat Desa"
        message={
          deleteTarget
            ? `Apakah Anda yakin ingin menghapus data aparatur/perangkat desa "${deleteTarget.nama}"? Data yang dihapus tidak dapat dikembalikan.`
            : ''
        }
        confirmText="Hapus Perangkat"
        cancelText="Batal"
        variant="danger"
        loading={!!deletingId}
      />
    </div>
  );
}
