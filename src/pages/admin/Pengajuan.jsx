import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
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
  ChevronRight,
  Trash2,
  Download,
  Printer,
  Filter,
  CalendarDays,
  SlidersHorizontal,
  Building
} from 'lucide-react';
import {
  getAdminPengajuanLayanan,
  updateStatusPengajuanLayanan,
  deletePengajuanLayanan,
  getAdminLayanan
} from '../../services/adminService';
import ScrollReveal from '../../components/ScrollReveal';
import Pagination from '../../components/Pagination';
import ConfirmModal from '../../components/ConfirmModal';
import logoPemkab from '../../assets/logo-pemkab-tasikmalaya.png';

export default function AdminPengajuan() {
  const [pengajuanList, setPengajuanList] = useState([]);
  const [layananList, setLayananList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [layananFilter, setLayananFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all'); // 'all' | 'today' | 'this_week' | 'this_month' | 'custom'
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showCustomDate, setShowCustomDate] = useState(false);

  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Selected item for Detail / Verification Modal
  const [selectedItem, setSelectedItem] = useState(null);

  // Delete Confirmation State
  const [deleteTarget, setDeleteTarget] = useState(null); // { id, nama_pemohon, nama_layanan }
  const [deleting, setDeleting] = useState(false);

  // Image lightbox state
  const [previewMedia, setPreviewMedia] = useState(null); // { url, title }

  // Print Report Modal State
  const [showPrintModal, setShowPrintModal] = useState(false);

  const fetchPengajuan = async () => {
    setLoading(true);
    setError(null);
    try {
      const [resPengajuan, resLayanan] = await Promise.all([
        getAdminPengajuanLayanan(),
        getAdminLayanan().catch(() => ({ data: [] }))
      ]);
      const list = resPengajuan.data?.data || resPengajuan.data || [];
      setPengajuanList(Array.isArray(list) ? list : []);
      setLayananList(resLayanan.data?.data || resLayanan.data || []);
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

  const openDeleteModal = (item) => {
    setDeleteTarget({
      id: item.id,
      nama_pemohon: item.nama_pemohon,
      nama_layanan: item.layanan?.nama_layanan || 'Surat Keterangan'
    });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const { id, nama_pemohon } = deleteTarget;
    setDeleting(true);
    setError(null);
    setSuccessMsg(null);

    try {
      await deletePengajuanLayanan(id);
      setSuccessMsg(`Pengajuan surat atas nama "${nama_pemohon}" berhasil dihapus.`);
      setPengajuanList((prev) => prev.filter((item) => item.id !== id));
      if (selectedItem && selectedItem.id === id) {
        setSelectedItem(null);
      }
      setDeleteTarget(null);
    } catch (err) {
      setError(err.message || 'Gagal menghapus pengajuan layanan.');
    } finally {
      setDeleting(false);
    }
  };

  // Filter List Logic
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleLayananFilterChange = (e) => {
    setLayananFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleDateFilterChange = (e) => {
    const val = e.target.value;
    setDateFilter(val);
    setShowCustomDate(val === 'custom');
    setCurrentPage(1);
  };

  const filteredList = pengajuanList.filter((item) => {
    // 1. Match Search
    const matchSearch =
      (item.nama_pemohon && item.nama_pemohon.toLowerCase().includes(search.toLowerCase())) ||
      (item.nik && item.nik.includes(search)) ||
      (item.layanan?.nama_layanan && item.layanan.nama_layanan.toLowerCase().includes(search.toLowerCase()));

    // 2. Match Status
    const matchStatus = statusFilter === 'all' || item.status === statusFilter;

    // 3. Match Layanan
    const matchLayanan =
      layananFilter === 'all' ||
      String(item.layanan_id) === String(layananFilter) ||
      item.layanan?.nama_layanan === layananFilter;

    // 4. Match Date Filter
    let matchDate = true;
    if (dateFilter !== 'all' && item.created_at) {
      const itemDate = new Date(item.created_at);
      const now = new Date();

      if (dateFilter === 'today') {
        matchDate = itemDate.toDateString() === now.toDateString();
      } else if (dateFilter === 'this_week') {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(now.getDate() - 7);
        matchDate = itemDate >= oneWeekAgo && itemDate <= now;
      } else if (dateFilter === 'this_month') {
        matchDate =
          itemDate.getMonth() === now.getMonth() &&
          itemDate.getFullYear() === now.getFullYear();
      } else if (dateFilter === 'custom') {
        const start = startDate ? new Date(startDate + 'T00:00:00') : null;
        const end = endDate ? new Date(endDate + 'T23:59:59') : null;
        if (start && itemDate < start) matchDate = false;
        if (end && itemDate > end) matchDate = false;
      }
    }

    return matchSearch && matchStatus && matchLayanan && matchDate;
  });

  const totalPages = Math.ceil(filteredList.length / itemsPerPage);
  const paginatedList = filteredList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

  // ── EXPORT DATA KE CSV / EXCEL ──
  const exportToCSV = () => {
    if (filteredList.length === 0) {
      alert('Tidak ada data pengajuan yang dapat diekspor.');
      return;
    }

    const headers = [
      'No',
      'ID Pengajuan',
      'Tanggal Pengajuan',
      'Nama Pemohon',
      'NIK',
      'Tempat Lahir',
      'Tanggal Lahir',
      'Jenis Kelamin',
      'Agama',
      'Alamat',
      'Jenis Layanan Surat',
      'Status',
      'Keperluan'
    ];

    const rows = filteredList.map((item, index) => [
      index + 1,
      item.id,
      formatDate(item.created_at),
      item.nama_pemohon || '-',
      `'${item.nik || ''}`,
      item.tempat_lahir || '-',
      item.tanggal_lahir || '-',
      item.jenis_kelamin || '-',
      item.agama || '-',
      item.alamat || '-',
      item.layanan?.nama_layanan || 'Surat Keterangan',
      item.status ? item.status.toUpperCase() : '-',
      item.keterangan || '-'
    ]);

    const csvContent =
      '\uFEFF' +
      [
        headers.map((h) => `"${String(h).replace(/"/g, '""')}"`).join(','),
        ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `rekap-pengajuan-surat-tenjonagara-${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <ScrollReveal direction="down" delay={0}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold shadow-xs shrink-0">
              <Inbox className="w-6 h-6 text-amber-700" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">Kelola Pengajuan Surat Warga</h1>
              <p className="text-xs sm:text-sm text-slate-500">Verifikasi berkas persyaratan, filter arsip, dan ekspor data pengurusan surat</p>
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
      </ScrollReveal>

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

      {/* Filter & Search Bar + Export Actions */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Cari nama pemohon, NIK 16 digit, atau jenis surat..."
              value={search}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary text-xs sm:text-sm font-medium"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </div>

          {/* Action Buttons: Export CSV & Print Rekap */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={exportToCSV}
              disabled={filteredList.length === 0}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs disabled:opacity-50"
              title="Unduh Data dalam Format CSV/Excel"
            >
              <Download className="w-4 h-4" />
              <span>Export Excel (CSV)</span>
            </button>

            <button
              type="button"
              onClick={() => setShowPrintModal(true)}
              disabled={filteredList.length === 0}
              className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-50"
              title="Pratinjau & Cetak Rekapitulasi Resmi"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>Cetak Rekap</span>
            </button>

            <button
              type="button"
              onClick={fetchPengajuan}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors shrink-0"
              title="Refresh Data Pengajuan"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Dropdowns Filter Row */}
        <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Filter Status */}
          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Status Pengajuan
            </label>
            <select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white text-slate-800 focus:ring-2 focus:ring-primary"
            >
              <option value="all">Semua Status ({pengajuanList.length})</option>
              <option value="pending">🟡 Pending / Menunggu ({countPending})</option>
              <option value="diproses">🔵 Sedang Diproses ({countDiproses})</option>
              <option value="selesai">🟢 Selesai ({countSelesai})</option>
            </select>
          </div>

          {/* Filter Jenis Layanan */}
          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Jenis Surat
            </label>
            <select
              value={layananFilter}
              onChange={handleLayananFilterChange}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white text-slate-800 focus:ring-2 focus:ring-primary truncate"
            >
              <option value="all">Semua Jenis Layanan Surat</option>
              {layananList.map((lay) => (
                <option key={lay.id} value={lay.id}>
                  {lay.nama_layanan}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Rentang Waktu */}
          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Periode Waktu
            </label>
            <select
              value={dateFilter}
              onChange={handleDateFilterChange}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white text-slate-800 focus:ring-2 focus:ring-primary"
            >
              <option value="all">Semua Waktu</option>
              <option value="today">Hari Ini</option>
              <option value="this_week">7 Hari Terakhir</option>
              <option value="this_month">Bulan Ini</option>
              <option value="custom">Pilih Rentang Tanggal...</option>
            </select>
          </div>
        </div>

        {/* Custom Date Range Row (If selected) */}
        {showCustomDate && (
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center gap-3 animate-in fade-in duration-200">
            <div className="flex-1 w-full space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase block">Tanggal Mulai</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
              />
            </div>
            <div className="flex-1 w-full space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase block">Tanggal Selesai</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
              />
            </div>
            {(startDate || endDate) && (
              <button
                type="button"
                onClick={() => {
                  setStartDate('');
                  setEndDate('');
                  setCurrentPage(1);
                }}
                className="mt-4 px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-colors"
              >
                Reset Tanggal
              </button>
            )}
          </div>
        )}
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
              {search || statusFilter !== 'all' || dateFilter !== 'all' || layananFilter !== 'all'
                ? 'Coba sesuaikan filter atau kata kunci pencarian Anda.'
                : 'Belum ada pengajuan surat online dari warga.'}
            </p>
          </div>
        ) : (
          <div>
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
                  {paginatedList.map((item) => {
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

                        {/* Jenis Layanan */}
                        <td className="py-4 px-4">
                          <div className="font-semibold text-slate-800">
                            {item.layanan?.nama_layanan || 'Surat Keterangan'}
                          </div>
                          {item.keterangan && (
                            <div className="text-[11px] text-slate-400 line-clamp-1 italic">
                              "{item.keterangan}"
                            </div>
                          )}
                        </td>

                        {/* Tanggal */}
                        <td className="py-4 px-4 hidden md:table-cell whitespace-nowrap text-slate-500 text-xs">
                          {formatDate(item.created_at)}
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4 whitespace-nowrap">{getStatusBadge(item.status)}</td>

                        {/* Dokumen Count */}
                        <td className="py-4 px-4 hidden sm:table-cell text-center whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${validDokumenCount > 0
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-100 text-slate-400'
                              }`}
                          >
                            <FileCheck className="w-3.5 h-3.5" />
                            <span>{validDokumenCount} Berkas</span>
                          </span>
                        </td>

                        {/* Aksi Button */}
                        <td className="py-4 px-4 text-right pr-6 whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setSelectedItem(item)}
                              className="px-3 py-1.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5 shadow-xs"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Verifikasi</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => openDeleteModal(item)}
                              className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Hapus Pengajuan"
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Menampilkan {paginatedList.length} dari total {filteredList.length} data
                </span>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── MODAL VERIFIKASI & DETAIL PENGAJUAN ── */}
      {selectedItem &&
        createPortal(
          <div
            onClick={() => setSelectedItem(null)}
            className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8"
            >
              {/* Modal Header */}
              <div className="p-6 bg-primary text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h2 className="text-lg font-serif font-bold text-white">Detail Permohonan Surat Warga</h2>
                    <p className="text-xs text-emerald-200">ID Pengajuan #{selectedItem.id}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                {/* Status Bar */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Status Saat Ini:
                  </span>
                  <div>{getStatusBadge(selectedItem.status)}</div>
                </div>

                {/* Data Pemohon */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-4 h-4 text-primary" />
                    <span>Identitas Pemohon</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Nama Lengkap</span>
                      <span className="font-bold text-slate-800 text-sm">{selectedItem.nama_pemohon}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Nomor NIK</span>
                      <span className="font-mono font-bold text-slate-800 text-sm">{selectedItem.nik}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                        Tempat, Tanggal Lahir
                      </span>
                      <span className="font-medium text-slate-700">
                        {selectedItem.tempat_lahir || '-'}, {selectedItem.tanggal_lahir || '-'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                        Jenis Kelamin & Agama
                      </span>
                      <span className="font-medium text-slate-700">
                        {selectedItem.jenis_kelamin || '-'} ({selectedItem.agama || '-'})
                      </span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Alamat Lengkap</span>
                      <span className="font-medium text-slate-700 leading-relaxed block bg-white p-2.5 rounded-xl border border-slate-200 mt-1">
                        {selectedItem.alamat || '-'}
                      </span>
                    </div>
                    {selectedItem.keterangan && (
                      <div className="sm:col-span-2">
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                          Keperluan / Catatan
                        </span>
                        <span className="italic text-slate-800 block bg-amber-50/60 p-2.5 rounded-xl border border-amber-200/60 mt-1">
                          "{selectedItem.keterangan}"
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Dokumen Lampiran */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                    <span>Berkas Persyaratan yang Diunggah</span>
                  </h3>

                  {(() => {
                    const docs = parseDokumen(selectedItem.dokumen_url);
                    if (docs.length === 0) {
                      return (
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-400">
                          Tidak ada berkas yang dilampirkan pemohon.
                        </div>
                      );
                    }

                    return (
                      <div className="space-y-2">
                        {docs.map((doc, idx) => (
                          <div
                            key={idx}
                            className="p-3.5 rounded-2xl border border-slate-200 bg-white flex items-center justify-between gap-3 shadow-xs"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                                <FileCheck className="w-4 h-4 text-emerald-600" />
                              </div>
                              <div className="min-w-0">
                                <div className="text-xs font-bold text-slate-800 truncate">{doc.syarat}</div>
                                <div className="text-[11px] text-slate-400 truncate">
                                  {doc.url ? 'Dokumen siap ditinjau' : 'Belum diunggah'}
                                </div>
                              </div>
                            </div>

                            {doc.url ? (
                              <div className="flex items-center gap-2 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => setPreviewMedia({ url: doc.url, title: doc.syarat })}
                                  className="px-3 py-1.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all flex items-center gap-1"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>Pratinjau</span>
                                </button>
                                <a
                                  href={doc.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
                                  title="Buka di Tab Baru"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              </div>
                            ) : (
                              <span className="text-xs text-rose-500 italic">Tidak ada file</span>
                            )}
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>

                {/* Status Updater Actions */}
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Ubah Status Pengajuan:
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(selectedItem.id, 'pending')}
                      disabled={selectedItem.status === 'pending'}
                      className={`p-3 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${selectedItem.status === 'pending'
                          ? 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-300'
                          : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
                        }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Pending</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(selectedItem.id, 'diproses')}
                      disabled={selectedItem.status === 'diproses'}
                      className={`p-3 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${selectedItem.status === 'diproses'
                          ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-300'
                          : 'bg-blue-50 text-blue-900 border border-blue-200 hover:bg-blue-100'
                        }`}
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Diproses</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(selectedItem.id, 'selesai')}
                      disabled={selectedItem.status === 'selesai'}
                      className={`p-3 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${selectedItem.status === 'selesai'
                          ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-300'
                          : 'bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100'
                        }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Tandai Selesai</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => openDeleteModal(selectedItem)}
                  className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-bold text-xs transition-all inline-flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus Pengajuan Ini</span>
                </button>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition-all"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* ── IMAGE LIGHTBOX PREVIEW MODAL ── */}
      {previewMedia &&
        createPortal(
          <div
            onClick={() => setPreviewMedia(null)}
            className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col space-y-3 p-5 border border-white/10"
            >
              <div className="flex items-center justify-between text-white pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-accent" />
                  <span className="font-bold text-base truncate">{previewMedia.title}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewMedia(null)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors flex items-center gap-1 text-xs font-semibold"
                >
                  <span>Tutup</span>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="max-h-[75vh] flex items-center justify-center overflow-auto bg-black/60 rounded-2xl p-2 border border-slate-800">
                <img
                  src={previewMedia.url}
                  alt={previewMedia.title}
                  className="max-h-[70vh] w-auto object-contain rounded-xl shadow-lg"
                />
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* ── MODAL PRATINJAU & CETAK REKAPITULASI LAPORAN ── */}
      {showPrintModal &&
        createPortal(
          <div className="fixed inset-0 z-[105] bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
              {/* Header Modal */}
              <div className="p-4 sm:p-5 bg-slate-800 text-white flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Printer className="w-5 h-5 text-accent" />
                  <h2 className="font-serif font-bold text-base sm:text-lg">
                    Pratinjau Laporan Rekapitulasi Pengajuan Surat
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Cetak Dokumen</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPrintModal(false)}
                    className="p-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Printable Document Sheet */}
              <div className="p-6 sm:p-10 overflow-y-auto bg-slate-50 space-y-6">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-slate-800 space-y-6 font-sans">
                  {/* Kop Surat Desa */}
                  <div className="flex items-center justify-center gap-5 pb-5 border-b-4 border-double border-slate-800 text-center">
                    <img src={logoPemkab} alt="Logo" className="w-16 h-16 object-contain shrink-0" />
                    <div>
                      <div className="text-xs font-bold tracking-wider uppercase text-slate-600">
                        Pemerintah Kabupaten Tasikmalaya
                      </div>
                      <div className="text-sm font-bold tracking-wider uppercase text-slate-700">
                        Kecamatan Cigalontang
                      </div>
                      <div className="text-xl font-bold font-serif uppercase tracking-widest text-primary">
                        Pemerintah Desa Tenjonagara
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Jalan Raya Cigalontang KM.06, Kp. Cibangun, Kecamatan Cigalontang, Kabupaten Tasikmalaya, Jawa Barat 46463
                      </div>
                    </div>
                  </div>

                  {/* Judul Laporan */}
                  <div className="text-center space-y-1">
                    <h3 className="font-bold text-base uppercase tracking-wider underline">
                      Laporan Rekapitulasi Pengajuan Surat Warga
                    </h3>
                    <p className="text-xs text-slate-500">
                      Dicetak pada: {new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })} | Total:{' '}
                      {filteredList.length} Pengajuan
                    </p>
                  </div>

                  {/* Summary Ringkasan */}
                  <div className="grid grid-cols-3 gap-3 text-center text-xs">
                    <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 font-semibold">
                      Pending: {filteredList.filter((i) => i.status === 'pending').length}
                    </div>
                    <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 font-semibold">
                      Diproses: {filteredList.filter((i) => i.status === 'diproses').length}
                    </div>
                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 font-semibold">
                      Selesai: {filteredList.filter((i) => i.status === 'selesai').length}
                    </div>
                  </div>

                  {/* Table Rekap */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse border border-slate-300 text-xs">
                      <thead>
                        <tr className="bg-slate-100 text-[11px] font-bold text-slate-700">
                          <th className="border border-slate-300 p-2 text-center w-8">No</th>
                          <th className="border border-slate-300 p-2">Tanggal</th>
                          <th className="border border-slate-300 p-2">Nama Pemohon</th>
                          <th className="border border-slate-300 p-2">NIK</th>
                          <th className="border border-slate-300 p-2">Jenis Surat</th>
                          <th className="border border-slate-300 p-2 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredList.map((item, idx) => (
                          <tr key={item.id} className="border-b border-slate-200">
                            <td className="border border-slate-300 p-2 text-center">{idx + 1}</td>
                            <td className="border border-slate-300 p-2 whitespace-nowrap">
                              {formatDate(item.created_at)}
                            </td>
                            <td className="border border-slate-300 p-2 font-bold">{item.nama_pemohon}</td>
                            <td className="border border-slate-300 p-2 font-mono">{item.nik}</td>
                            <td className="border border-slate-300 p-2">
                              {item.layanan?.nama_layanan || 'Surat Keterangan'}
                            </td>
                            <td className="border border-slate-300 p-2 text-center uppercase font-bold text-[10px]">
                              {item.status}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Kolom Tanda Tangan */}
                  <div className="pt-8 flex justify-between text-xs text-center">
                    <div className="w-48 space-y-16">
                      <div>
                        <div>Mengetahui,</div>
                        <div className="font-bold">Kepala Desa Tenjonagara</div>
                      </div>
                      <div className="border-t border-slate-400 pt-1 font-bold">( ........................................ )</div>
                    </div>

                    <div className="w-48 space-y-16">
                      <div>
                        <div>Tenjonagara, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                        <div className="font-bold">Petugas Operator Pelayanan</div>
                      </div>
                      <div className="border-t border-slate-400 pt-1 font-bold">( ........................................ )</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* ── CONFIRM MODAL HAPUS PENGAJUAN ── */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Hapus Pengajuan Surat Warga"
        message={`Apakah Anda yakin ingin menghapus data pengajuan ${deleteTarget?.nama_layanan} atas nama "${deleteTarget?.nama_pemohon}"? Data dan lampiran berkas yang dihapus tidak dapat dipulihkan kembali.`}
        confirmText="Ya, Hapus Pengajuan"
        cancelText="Batal"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
}
