import React, { useEffect, useState } from 'react';
import {
  Inbox,
  Search,
  RefreshCw,
  Eye,
  CheckCircle2,
  Clock,
  FileText,
  User,
  ShieldCheck,
  ExternalLink,
  X,
  FileCheck,
  AlertCircle,
  Calendar,
  Check,
  ChevronRight
} from 'lucide-react';
import { getAdminPengajuanLayanan, updateStatusPengajuanLayanan } from '../../services/adminService';

export default function AdminPengajuan() {
  const [pengajuanList, setPengajuanList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Selected item for Detail / Verification Modal
  const [selectedItem, setSelectedItem] = useState(null);

  // Image lightbox state
  const [previewMedia, setPreviewMedia] = useState(null); // { url, title }

  const fetchPengajuan = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAdminPengajuanLayanan();
      const list = res.data?.data || res.data || [];
      setPengajuanList(Array.isArray(list) ? list : []);
    } catch (err) {
      setError('Gagal mengambil data pengajuan surat warga.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPengajuan();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    setError(null);
    setSuccessMsg(null);
    try {
      await updateStatusPengajuanLayanan(id, newStatus);
      setSuccessMsg(`Status pengajuan berhasil diperbarui menjadi "${newStatus}".`);
      
      // Update local state
      setPengajuanList((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
      );

      if (selectedItem && selectedItem.id === id) {
        setSelectedItem((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      setError(err.message || 'Gagal memperbarui status pengajuan.');
    }
  };

  // Filter List
  const filteredList = pengajuanList.filter((item) => {
    const matchSearch =
      (item.nama_pemohon && item.nama_pemohon.toLowerCase().includes(search.toLowerCase())) ||
      (item.nik && item.nik.includes(search)) ||
      (item.layanan?.nama_layanan && item.layanan.nama_layanan.toLowerCase().includes(search.toLowerCase()));
    
    const matchStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Calculate Counter Stats
  const countPending = pengajuanList.filter((i) => i.status === 'pending').length;
  const countDiproses = pengajuanList.filter((i) => i.status === 'diproses').length;
  const countSelesai = pengajuanList.filter((i) => i.status === 'selesai').length;

  // Format JSON Dokumen
  const parseDokumen = (dokumenUrlStr) => {
    if (!dokumenUrlStr) return [];
    try {
      const parsed = JSON.parse(dokumenUrlStr);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      // Fallback jika berupa single URL string biasa
      if (typeof dokumenUrlStr === 'string' && dokumenUrlStr.startsWith('http')) {
        return [{ syarat: 'Dokumen Pendukung', url: dokumenUrlStr }];
      }
    }
    return [];
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200 shadow-xs">
            <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            <span>Menunggu (Pending)</span>
          </span>
        );
      case 'diproses':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold border border-blue-200 shadow-xs">
            <RefreshCw className="w-3.5 h-3.5 text-blue-600 animate-spin" />
            <span>Sedang Diproses</span>
          </span>
        );
      case 'selesai':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Selesai</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
            {status}
          </span>
        );
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold shadow-xs shrink-0">
            <Inbox className="w-6 h-6 text-amber-700" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">Kelola Pengajuan Surat Warga</h1>
            <p className="text-xs sm:text-sm text-slate-500">Verifikasi berkas persyaratan dan perbarui status pengurusan surat warga</p>
          </div>
        </div>

        {/* Counter Stats Cards */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 md:pt-0">
          <div className="px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-center shrink-0">
            <div className="text-xs text-amber-700 font-semibold">Pending</div>
            <div className="text-base font-bold font-mono">{countPending}</div>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-blue-50 border border-blue-200/80 text-blue-900 text-center shrink-0">
            <div className="text-xs text-blue-700 font-semibold">Diproses</div>
            <div className="text-base font-bold font-mono">{countDiproses}</div>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-900 text-center shrink-0">
            <div className="text-xs text-emerald-700 font-semibold">Selesai</div>
            <div className="text-base font-bold font-mono">{countSelesai}</div>
          </div>
        </div>
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)}>
            <X className="w-4 h-4 text-emerald-600" />
          </button>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Cari nama, NIK, atau jenis surat..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary text-xs sm:text-sm"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end overflow-x-auto">
          {/* Status Tabs Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold bg-white text-slate-800 focus:ring-2 focus:ring-primary"
          >
            <option value="all">Semua Status ({pengajuanList.length})</option>
            <option value="pending">Pending ({countPending})</option>
            <option value="diproses">Diproses ({countDiproses})</option>
            <option value="selesai">Selesai ({countSelesai})</option>
          </select>

          <button
            onClick={fetchPengajuan}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors shrink-0"
            title="Refresh Data Pengajuan"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Pengajuan Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-primary" />
            <p className="text-xs sm:text-sm font-medium">Memuat daftar pengajuan surat...</p>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-3">
            <Inbox className="w-12 h-12 mx-auto text-slate-300" />
            <p className="text-sm font-bold text-slate-700">Tidak ada pengajuan surat ditemukan</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {search ? 'Coba ubah kata kunci pencarian Anda.' : 'Belum ada pengajuan surat online dari warga.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4 sm:px-6">Nama Pemohon & NIK</th>
                  <th className="py-3.5 px-4">Jenis Surat</th>
                  <th className="py-3.5 px-4 hidden md:table-cell">Tanggal</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 hidden sm:table-cell text-center">Dokumen</th>
                  <th className="py-3.5 px-4 text-right pr-6">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {filteredList.map((item) => {
                  const dokumenList = parseDokumen(item.dokumen_url);
                  const validDokumenCount = dokumenList.filter((d) => d.url).length;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Pemohon */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-bold shrink-0">
                            <User className="w-5 h-5 text-slate-500" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 line-clamp-1">{item.nama_pemohon}</div>
                            <div className="text-[11px] font-mono text-slate-500 tracking-wider">
                              NIK: {item.nik}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Jenis Surat */}
                      <td className="py-4 px-4">
                        <div className="font-semibold text-slate-800 line-clamp-1 max-w-xs">
                          {item.layanan?.nama_layanan || 'Surat Keterangan'}
                        </div>
                        {item.keterangan && (
                          <div className="text-[11px] text-slate-400 line-clamp-1 max-w-xs mt-0.5">
                            {item.keterangan}
                          </div>
                        )}
                      </td>

                      {/* Tanggal */}
                      <td className="py-4 px-4 hidden md:table-cell text-slate-500 text-xs">
                        <div className="flex items-center gap-1.5 whitespace-nowrap">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{formatDate(item.created_at)}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        {getStatusBadge(item.status)}
                      </td>

                      {/* Dokumen Count */}
                      <td className="py-4 px-4 hidden sm:table-cell text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          validDokumenCount > 0
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}>
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>{validDokumenCount} Berkas</span>
                        </span>
                      </td>

                      {/* Aksi */}
                      <td className="py-4 px-4 text-right pr-6">
                        <button
                          onClick={() => setSelectedItem(item)}
                          className="px-3.5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-xs transition-all inline-flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Verifikasi</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── MODAL DETAIL & VERIFIKASI DOKUMEN ── */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold shadow-xs">
                  <FileText className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Verifikasi Pengajuan Surat #{selectedItem.id}</h2>
                  <p className="text-xs text-slate-500">{selectedItem.layanan?.nama_layanan}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedItem(null)}
                className="p-2 rounded-xl bg-slate-200/80 hover:bg-slate-200 text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
              
              {/* Applicant Info Box */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-200/80">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    <span className="font-bold text-slate-900 text-base">{selectedItem.nama_pemohon}</span>
                  </div>
                  <div>{getStatusBadge(selectedItem.status)}</div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block font-semibold uppercase text-[10px]">Nomor NIK</span>
                    <span className="font-mono font-bold text-slate-800 text-sm">{selectedItem.nik}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold uppercase text-[10px]">Tanggal Pengajuan</span>
                    <span className="font-medium text-slate-800">{formatDate(selectedItem.created_at)}</span>
                  </div>
                </div>

                {selectedItem.keterangan && (
                  <div className="pt-2 border-t border-slate-200/60 text-xs">
                    <span className="text-slate-400 block font-semibold uppercase text-[10px]">Keperluan / Catatan Pemohon</span>
                    <p className="text-slate-700 mt-0.5 leading-relaxed bg-white p-3 rounded-xl border border-slate-200">
                      {selectedItem.keterangan}
                    </p>
                  </div>
                )}
              </div>

              {/* Uploaded Documents List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                    <span>Berkas Dokumen Persyaratan yang Diunggah</span>
                  </h3>
                </div>

                {(() => {
                  const docs = parseDokumen(selectedItem.dokumen_url);
                  if (docs.length === 0) {
                    return (
                      <div className="p-6 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-400 space-y-1">
                        <FileText className="w-8 h-8 mx-auto text-slate-300" />
                        <p className="text-xs font-semibold text-slate-600">Tidak ada berkas dokumen terlampir</p>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-3">
                      {docs.map((doc, idx) => {
                        const hasUrl = Boolean(doc.url && doc.url.trim());
                        const isPdf = hasUrl && doc.url.toLowerCase().endsWith('.pdf');

                        return (
                          <div
                            key={idx}
                            className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                              hasUrl
                                ? 'bg-emerald-50/50 border-emerald-200'
                                : 'bg-rose-50/50 border-rose-200'
                            }`}
                          >
                            <div className="space-y-1">
                              <div className="font-bold text-slate-800 text-xs sm:text-sm flex items-center gap-2">
                                <span>{doc.syarat || `Dokumen #${idx + 1}`}</span>
                                {doc.is_optional && (
                                  <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-md font-normal">
                                    Opsional
                                  </span>
                                )}
                              </div>

                              {hasUrl ? (
                                <p className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Dokumen terupload dan siap diverifikasi</span>
                                </p>
                              ) : (
                                <p className="text-[11px] text-rose-600 font-medium flex items-center gap-1">
                                  <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                                  <span>Tidak diunggah (Kosong)</span>
                                </p>
                              )}
                            </div>

                            {hasUrl && (
                              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                                {!isPdf && (
                                  <button
                                    type="button"
                                    onClick={() => setPreviewMedia({ url: doc.url, title: doc.syarat })}
                                    className="flex-1 sm:flex-none px-3 py-2 rounded-xl bg-white border border-emerald-300 text-emerald-800 text-xs font-bold hover:bg-emerald-100 transition-all flex items-center justify-center gap-1.5 shadow-xs"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>Pratinjau Foto</span>
                                  </button>
                                )}

                                <a
                                  href={doc.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex-1 sm:flex-none px-3 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs"
                                >
                                  <span>Buka File</span>
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>

              {/* Status Update Action Box */}
              <div className="bg-slate-100/80 p-5 rounded-2xl border border-slate-200 space-y-3">
                <span className="block font-bold text-slate-800 text-xs uppercase tracking-wider">
                  Ubah Status Pengajuan Surat
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedItem.id, 'pending')}
                    disabled={selectedItem.status === 'pending'}
                    className={`py-2.5 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                      selectedItem.status === 'pending'
                        ? 'bg-amber-600 text-white shadow-md cursor-default ring-2 ring-amber-300'
                        : 'bg-white text-slate-700 hover:bg-amber-50 border border-slate-300'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Menunggu (Pending)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedItem.id, 'diproses')}
                    disabled={selectedItem.status === 'diproses'}
                    className={`py-2.5 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                      selectedItem.status === 'diproses'
                        ? 'bg-blue-600 text-white shadow-md cursor-default ring-2 ring-blue-300'
                        : 'bg-white text-slate-700 hover:bg-blue-50 border border-slate-300'
                    }`}
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Setujui & Proses</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedItem.id, 'selesai')}
                    disabled={selectedItem.status === 'selesai'}
                    className={`py-2.5 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                      selectedItem.status === 'selesai'
                        ? 'bg-emerald-700 text-white shadow-md cursor-default ring-2 ring-emerald-300'
                        : 'bg-white text-slate-700 hover:bg-emerald-50 border border-slate-300'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Tandai Selesai</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition-all"
              >
                Tutup
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ── IMAGE LIGHTBOX PREVIEW MODAL ── */}
      {previewMedia && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-3xl w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col space-y-2 p-4">
            <div className="flex items-center justify-between text-white pb-2 border-b border-slate-800">
              <span className="font-bold text-sm truncate">{previewMedia.title}</span>
              <button
                onClick={() => setPreviewMedia(null)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-[75vh] flex items-center justify-center overflow-auto bg-black rounded-xl">
              <img
                src={previewMedia.url}
                alt={previewMedia.title}
                className="max-h-[75vh] w-auto object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
