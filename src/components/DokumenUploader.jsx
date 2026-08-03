import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  X,
  FileText,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { uploadDokumenPublik } from '../services/desaService';

/**
 * DokumenUploader - Upload dokumen per-persyaratan layanan (tanpa auth)
 */
export default function DokumenUploader({ label, value, onChange, required = true, hint, isMissing = false }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [fileInfo, setFileInfo] = useState(null);
  const fileInputRef = useRef(null);

  const isPdf = (url) => url && url.toLowerCase().endsWith('.pdf');

  const handleFileChange = async (file) => {
    if (!file) return;

    // Validasi tipe file
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setError('Format tidak didukung. Gunakan foto (.jpg, .png) atau PDF.');
      return;
    }

    // Validasi ukuran (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Ukuran file terlalu besar. Maksimal 5MB.');
      return;
    }

    setError(null);
    setUploading(true);
    setFileInfo({ name: file.name, size: file.size, type: file.type });

    try {
      const res = await uploadDokumenPublik(file);
      const uploadedUrl = res.data?.url || res.url;
      if (uploadedUrl) {
        onChange(uploadedUrl);
      } else {
        setError('Gagal mendapatkan URL dari server. Coba lagi.');
        setFileInfo(null);
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Gagal mengunggah. Coba lagi.';
      setError(msg);
      setFileInfo(null);
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = () => {
    onChange('');
    setFileInfo(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-2">
      {/* Label header */}
      <div className="flex items-center justify-between gap-1.5 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="block text-sm font-bold text-slate-800">
            {label}
          </span>
          {required ? (
            <span className="inline-flex items-center text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
              Wajib
            </span>
          ) : (
            <span className="inline-flex items-center text-[11px] font-medium text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
              Opsional
            </span>
          )}
        </div>

        {value && (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Terunggah
          </span>
        )}
      </div>

      {hint && (
        <p className="text-[11px] text-slate-500">{hint}</p>
      )}

      {/* Internal Error */}
      {error && (
        <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button type="button" onClick={() => setError(null)}>
            <X className="w-3.5 h-3.5 text-rose-400 hover:text-rose-700" />
          </button>
        </div>
      )}

      {/* Uploaded File Preview */}
      {value ? (
        <div className="flex items-center gap-3 p-3 bg-emerald-50/90 border border-emerald-300 rounded-xl shadow-xs">
          {/* Icon/Preview */}
          <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-white border border-emerald-200 flex items-center justify-center">
            {isPdf(value) ? (
              <FileText className="w-6 h-6 text-rose-500" />
            ) : (
              <img
                src={value}
                alt={label}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            )}
          </div>
          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-800 truncate">
              {fileInfo?.name || (isPdf(value) ? 'Dokumen PDF' : 'Foto Dokumen')}
            </p>
            <p className="text-[11px] text-slate-500">
              {fileInfo ? formatSize(fileInfo.size) : ''}{' '}
              <span className="text-emerald-700 font-semibold">· Berhasil diunggah ✓</span>
            </p>
          </div>
          {/* Remove Button */}
          <button
            type="button"
            onClick={handleRemove}
            className="p-1.5 rounded-lg bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors shrink-0"
            title="Hapus dokumen"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* Empty Upload Dropzone */
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-4 text-center transition-all cursor-pointer ${
            isMissing
              ? 'border-rose-400 bg-rose-50/50 ring-2 ring-rose-200'
              : dragActive
                ? 'border-primary bg-emerald-50/60 scale-[0.99]'
                : uploading
                  ? 'border-slate-300 bg-slate-50 cursor-not-allowed'
                  : 'border-slate-300 bg-white hover:bg-slate-50 hover:border-primary/60'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
            onChange={(e) => handleFileChange(e.target.files[0])}
            className="hidden"
            disabled={uploading}
          />

          {uploading ? (
            <div className="flex flex-col items-center gap-1.5 py-1">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <p className="text-xs font-bold text-slate-700">Mengunggah file...</p>
            </div>
          ) : (
            <div className="flex items-center gap-3 justify-center py-0.5">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                isMissing ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-primary'
              }`}>
                <UploadCloud className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className={`text-xs font-bold ${isMissing ? 'text-rose-700' : 'text-slate-800'}`}>
                  Klik untuk unggah {label}
                  <span className="text-slate-400 font-normal"> (foto / PDF)</span>
                </p>
                <p className="text-[11px] text-slate-400">Maksimal 5MB</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
