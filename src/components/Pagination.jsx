import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Komponen Reusable Pagination untuk Halaman Publik & Admin Control Center
 */
export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  className = '',
}) {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate range of page numbers
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200/80 ${className}`}>
      {/* Teks Informasi Jumlah Data */}
      <div className="text-xs sm:text-sm text-slate-500 font-medium">
        Menampilkan <span className="font-bold text-slate-800">{startItem}</span> -{' '}
        <span className="font-bold text-slate-800">{endItem}</span> dari{' '}
        <span className="font-bold text-slate-800">{totalItems}</span> data
      </div>

      {/* Navigasi Tombol Halaman */}
      <div className="flex items-center gap-1.5">
        {/* Tombol Previous */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-xl border border-slate-200/90 text-slate-600 hover:bg-slate-100 hover:text-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
          title="Halaman Sebelumnya"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Halaman Pertama jika tersembunyi */}
        {pages[0] > 1 && (
          <>
            <button
              type="button"
              onClick={() => onPageChange(1)}
              className="px-3 py-1.5 rounded-xl border border-slate-200/90 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              1
            </button>
            {pages[0] > 2 && <span className="px-1 text-slate-400 text-xs font-bold">...</span>}
          </>
        )}

        {/* List Nomor Halaman */}
        {pages.map((p) => {
          const isActive = p === currentPage;
          return (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs ${
                isActive
                  ? 'bg-primary text-white shadow-md shadow-emerald-900/10'
                  : 'bg-white border border-slate-200/90 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {p}
            </button>
          );
        })}

        {/* Halaman Terakhir jika tersembunyi */}
        {pages[pages.length - 1] < totalPages && (
          <>
            {pages[pages.length - 1] < totalPages - 1 && (
              <span className="px-1 text-slate-400 text-xs font-bold">...</span>
            )}
            <button
              type="button"
              onClick={() => onPageChange(totalPages)}
              className="px-3 py-1.5 rounded-xl border border-slate-200/90 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Tombol Next */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-xl border border-slate-200/90 text-slate-600 hover:bg-slate-100 hover:text-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
          title="Halaman Selanjutnya"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
