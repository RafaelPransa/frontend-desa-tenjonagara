import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Plus,
  Search,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  FileCheck
} from 'lucide-react';
import { getAdminLayanan, deleteLayanan } from '../../services/adminService';
import ScrollReveal from '../../components/ScrollReveal';
import ConfirmModal from '../../components/ConfirmModal';

export default function AdminLayanan() {
  const [layananList, setLayananList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null); // { id, nama_layanan }

  const fetchLayanan = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAdminLayanan();
      const list = res.data?.data || res.data || [];
      setLayananList(Array.isArray(list) ? list : []);
    } catch (err) {
      setError('Gagal mengambil data layanan publik.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLayanan();
  }, []);

  const openDeleteModal = (id, nama_layanan) => {
    setDeleteTarget({ id, nama_layanan });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const { id, nama_layanan } = deleteTarget;

    setDeletingId(id);
    setError(null);
    setSuccessMsg(null);

    try {
      await deleteLayanan(id);
      setSuccessMsg(`Layanan "${nama_layanan}" berhasil dihapus.`);
      setLayananList((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      setError(err.message || 'Gagal menghapus jenis layanan.');
    } finally {
      setDeletingId(null);
      setDeleteTarget(null);
    }
  };

  const filteredList = layananList.filter((item) => {
    return (
      item.nama_layanan.toLowerCase().includes(search.toLowerCase()) ||
      (item.deskripsi && item.deskripsi.toLowerCase().includes(search.toLowerCase()))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <ScrollReveal direction="down" delay={0}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold shadow-xs shrink-0">
              <FileText className="w-6 h-6 text-indigo-700" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">Master Layanan Surat Publik</h1>
              <p className="text-xs sm:text-sm text-slate-500">Atur jenis surat keterangan dan dokumen persyaratan yang diperlukan</p>
            </div>
          </div>

          <Link
            to="/admin/layanan/tambah"
            className="px-5 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4 text-accent" />
            <span>Tambah Layanan Baru</span>
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
            placeholder="Cari nama layanan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary text-xs sm:text-sm"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        </div>

        <button
          onClick={fetchLayanan}
          className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors shrink-0"
          title="Refresh Data"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Layanan Table / List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-primary" />
            <p className="text-xs sm:text-sm font-medium">Memuat data layanan publik...</p>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-3">
            <FileText className="w-12 h-12 mx-auto text-slate-300" />
            <p className="text-sm font-bold text-slate-700">Tidak ada jenis layanan ditemukan</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {search ? 'Coba ubah kata kunci pencarian Anda.' : 'Belum ada data jenis layanan yang ditambahkan.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4 sm:px-6">Nama Layanan</th>
                  <th className="py-3.5 px-4 hidden md:table-cell">Deskripsi</th>
                  <th className="py-3.5 px-4">Persyaratan Dokumen</th>
                  <th className="py-3.5 px-4 text-right pr-6">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {filteredList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                          <FileCheck className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div className="font-bold text-slate-900 line-clamp-1 max-w-xs sm:max-w-md">
                          {item.nama_layanan}
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 hidden md:table-cell text-slate-600">
                      <span className="line-clamp-2 max-w-xs text-xs">{item.deskripsi}</span>
                    </td>

                    <td className="py-4 px-4 text-slate-600">
                      <div className="whitespace-pre-line text-xs line-clamp-2 max-w-xs font-mono bg-slate-50 p-2 rounded-lg border border-slate-200">
                        {item.syarat || '-'}
                      </div>
                    </td>

                    <td className="py-4 px-4 text-right pr-6">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/admin/layanan/${item.id}`}
                          className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors"
                          title="Edit Layanan"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>

                        <button
                          onClick={() => openDeleteModal(item.id, item.nama_layanan)}
                          disabled={deletingId === item.id}
                          className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors disabled:opacity-50"
                          title="Hapus Layanan"
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

      {/* Modal Konfirmasi Hapus Layanan */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Hapus Jenis Layanan Surat"
        message={
          deleteTarget
            ? `Apakah Anda yakin ingin menghapus jenis layanan surat "${deleteTarget.nama_layanan}"? Permohonan warga yang menggunakan layanan ini mungkin akan terpengaruh.`
            : ''
        }
        confirmText="Hapus Layanan"
        cancelText="Batal"
        variant="danger"
        loading={!!deletingId}
      />
    </div>
  );
}
