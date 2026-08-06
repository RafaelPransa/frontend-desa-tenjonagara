import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, LogOut, Trash2, X, RefreshCw } from 'lucide-react';

/**
 * Komponen Modal Konfirmasi Modern Admin Control Center
 * Menampilkan overlay latar hitam transparan penuh di atas seluruh antarmuka (z-[9999])
 */
export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Konfirmasi Aksi',
  message = 'Apakah Anda yakin ingin melanjutkan aksi ini?',
  confirmText = 'Ya, Lanjutkan',
  cancelText = 'Batal',
  variant = 'danger', // 'danger' | 'warning' | 'primary'
  loading = false,
}) {
  // Lock scroll & handle ESC key when open
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !loading) {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, loading, onClose]);

  if (!isOpen) return null;

  const isDanger = variant === 'danger';
  const isWarning = variant === 'warning';

  const iconBgClass = isDanger
    ? 'bg-rose-100 text-rose-600'
    : isWarning
    ? 'bg-amber-100 text-amber-600'
    : 'bg-emerald-100 text-primary';

  const confirmBtnClass = isDanger
    ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-200'
    : isWarning
    ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-200'
    : 'bg-primary hover:bg-primary-hover text-white shadow-emerald-200';

  const IconComponent = isDanger ? Trash2 : isWarning ? LogOut : AlertTriangle;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs transition-opacity duration-300">
      {/* Click outside backdrop to dismiss */}
      <div
        className="absolute inset-0"
        onClick={() => {
          if (!loading) onClose();
        }}
      />

      {/* Modal Dialog Card */}
      <div
        className="relative z-10 w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 transform transition-all duration-300 scale-100 animate-in fade-in zoom-in-95"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Icon Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors disabled:opacity-50"
          aria-label="Tutup Dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center space-y-4">
          {/* Header Icon */}
          <div className={`w-16 h-16 rounded-2xl ${iconBgClass} flex items-center justify-center shadow-inner shrink-0`}>
            <IconComponent className="w-8 h-8" />
          </div>

          {/* Title & Message */}
          <div className="space-y-1.5">
            <h3 className="text-xl font-serif font-bold text-slate-900 leading-tight">
              {title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm leading-relaxed">
              {message}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 w-full pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs sm:text-sm hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              {cancelText}
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 ${confirmBtnClass} disabled:opacity-50`}
            >
              {loading && <RefreshCw className="w-4 h-4 animate-spin" />}
              <span>{loading ? 'Memproses...' : confirmText}</span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
