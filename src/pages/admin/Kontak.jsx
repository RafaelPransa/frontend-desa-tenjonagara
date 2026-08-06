import React, { useEffect, useState } from 'react';
import {
  MessageSquare,
  Search,
  Trash2,
  Mail,
  User,
  Calendar,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Eye,
  X,
  Send
} from 'lucide-react';
import { getAdminKontak, deleteAdminKontak } from '../../services/adminService';
import ScrollReveal from '../../components/ScrollReveal';

export default function AdminKontak() {
  const [pesanList, setPesanList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedPesan, setSelectedPesan] = useState(null);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchKontak = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAdminKontak();
      const list = res.data?.data || res.data || [];
      setPesanList(Array.isArray(list) ? list : []);
    } catch (err) {
      setError('Gagal mengambil daftar pesan kontak.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKontak();
  }, []);

  const handleDelete = async (id, subjek) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus pesan:\n"${subjek}"?`)) {
      return;
    }

    setDeletingId(id);
    setError(null);
    setSuccessMsg(null);

    try {
      await deleteAdminKontak(id);
      setSuccessMsg('Pesan berhasil dihapus.');
      setPesanList((prev) => prev.filter((p) => p.id !== id));
      if (selectedPesan?.id === id) {
        setSelectedPesan(null);
      }
    } catch (err) {
      setError(err.message || 'Gagal menghapus pesan.');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredList = pesanList.filter((item) => {
    return (
      (item.nama && item.nama.toLowerCase().includes(search.toLowerCase())) ||
      (item.subjek && item.subjek.toLowerCase().includes(search.toLowerCase())) ||
      (item.email && item.email.toLowerCase().includes(search.toLowerCase())) ||
      (item.pesan && item.pesan.toLowerCase().includes(search.toLowerCase()))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <ScrollReveal direction="down" delay={0}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold shadow-xs shrink-0">
              <MessageSquare className="w-6 h-6 text-rose-700" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">Kelola Pesan Kontak & Pengaduan</h1>
              <p className="text-xs sm:text-sm text-slate-500">Daftar aspirasi, masukan, dan pertanyaan dari warga desa</p>
            </div>
          </div>

          <button
            onClick={fetchKontak}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold transition-colors shrink-0"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Pesan</span>
          </button>
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
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Cari pengirim, email, atau subjek..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary text-xs sm:text-sm"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        </div>
      </div>

      {/* Messages List & Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-primary" />
            <p className="text-xs sm:text-sm font-medium">Memuat daftar pesan masuk...</p>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-3">
            <MessageSquare className="w-12 h-12 mx-auto text-slate-300" />
            <p className="text-sm font-bold text-slate-700">Belum ada pesan kontak masuk</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {search ? 'Coba ubah kata kunci pencarian Anda.' : 'Pesan yang dikirim oleh pengunjung melalui form kontak akan muncul di sini.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4 sm:px-6">Pengirim</th>
                  <th className="py-3.5 px-4">Subjek</th>
                  <th className="py-3.5 px-4 hidden md:table-cell">Isi Pesan</th>
                  <th className="py-3.5 px-4 hidden sm:table-cell">Tanggal</th>
                  <th className="py-3.5 px-4 text-right pr-6">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {filteredList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-4 sm:px-6">
                      <div className="space-y-0.5">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-primary" />
                          <span>{item.nama}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span>{item.email}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 font-semibold text-slate-800">
                      <span className="line-clamp-1 max-w-xs">{item.subjek}</span>
                    </td>

                    <td className="py-4 px-4 hidden md:table-cell text-slate-600">
                      <span className="line-clamp-1 max-w-sm text-xs">{item.pesan}</span>
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
                            : 'Baru saja'}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-right pr-6">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedPesan(item)}
                          className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-primary transition-colors"
                          title="Baca Pesan Lengkap"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <a
                          href={`mailto:${item.email}?subject=Re: ${encodeURIComponent(item.subjek)}`}
                          className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors"
                          title="Balas via Email"
                        >
                          <Send className="w-4 h-4" />
                        </a>

                        <button
                          onClick={() => handleDelete(item.id, item.subjek)}
                          disabled={deletingId === item.id}
                          className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors disabled:opacity-50"
                          title="Hapus Pesan"
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

      {/* Modal Detail Pesan */}
      {selectedPesan && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-primary flex items-center justify-center font-bold">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{selectedPesan.subjek}</h3>
                  <p className="text-xs text-slate-500">
                    Dari: {selectedPesan.nama} ({selectedPesan.email})
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedPesan(null)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Isi Pesan:</label>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-sm leading-relaxed whitespace-pre-line max-h-60 overflow-y-auto">
                {selectedPesan.pesan}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400">
                {selectedPesan.created_at
                  ? new Date(selectedPesan.created_at).toLocaleString('id-ID')
                  : 'Baru saja'}
              </span>

              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${selectedPesan.email}?subject=Re: ${encodeURIComponent(selectedPesan.subjek)}`}
                  className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Balas Email</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
