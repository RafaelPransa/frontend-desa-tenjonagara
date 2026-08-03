import React, { useState, useRef } from 'react';
import { UploadCloud, Link as LinkIcon, X, Image as ImageIcon, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { uploadImage } from '../services/adminService';

export default function ImageUploader({ value, onChange, label = 'Gambar Sampul / Headline' }) {
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'url'
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (file) => {
    if (!file) return;

    // Validate client side size & type
    if (!file.type.startsWith('image/')) {
      setError('File yang dipilih harus berupa file gambar (.jpg, .png, .webp, dll).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Ukuran file maksimal 5MB.');
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const res = await uploadImage(file);
      const uploadedUrl = res.data?.url || res.url;
      if (uploadedUrl) {
        onChange(uploadedUrl);
      } else {
        setError('Gagal mendapatkan URL gambar dari server.');
      }
    } catch (err) {
      const errorMsg = typeof err === 'string' ? err : (err.message || err.response?.data?.message || 'Gagal mengunggah gambar ke server.');
      setError(errorMsg);
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          {label}
        </label>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-[11px] font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
              activeTab === 'upload' ? 'bg-white text-primary shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Upload File</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
              activeTab === 'url' ? 'bg-white text-primary shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Gunakan URL</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button type="button" onClick={() => setError(null)} className="text-rose-500 hover:text-rose-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Image Preview Box (If image URL exists) */}
      {value ? (
        <div className="relative group rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 p-2 space-y-2">
          <div className="relative h-48 sm:h-56 w-full rounded-xl overflow-hidden bg-slate-900/5">
            <img
              src={value}
              alt="Preview Upload"
              className="w-full h-full object-cover rounded-xl"
              onError={(e) => {
                e.target.src = 'https://placehold.co/600x400?text=Gambar+Tidak+Dapat+Dimuat';
              }}
            />
            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => onChange('')}
                className="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold shadow-md hover:bg-rose-700 transition-all flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                <span>Hapus Gambar</span>
              </button>
            </div>
          </div>
          <div className="px-2 flex items-center justify-between text-[11px] text-slate-500 font-mono truncate">
            <span className="truncate max-w-xs">{value}</span>
            <span className="text-emerald-600 font-bold flex items-center gap-1 shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Tersimpan
            </span>
          </div>
        </div>
      ) : (
        /* Empty State / Upload Area */
        <div>
          {activeTab === 'upload' ? (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
                dragActive
                  ? 'border-primary bg-emerald-50/50 scale-[0.99]'
                  : 'border-slate-300 bg-slate-50/60 hover:bg-slate-100/80 hover:border-slate-400'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e.target.files[0])}
                className="hidden"
              />

              {uploading ? (
                <div className="space-y-2 py-4">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                  <p className="text-xs font-bold text-slate-700">Mengunggah file gambar ke server...</p>
                  <p className="text-[11px] text-slate-400">Mohon tunggu sebentar</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-primary flex items-center justify-center mx-auto shadow-xs">
                    <UploadCloud className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-slate-800">
                      Klik untuk pilih gambar <span className="text-slate-400 font-normal">atau drag & drop ke sini</span>
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Format: JPG, PNG, WEBP, GIF (Maksimal 5MB)
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Tab URL Input */
            <div className="space-y-2">
              <div className="relative">
                <input
                  type="url"
                  placeholder="Paste URL gambar dari internet (https://...)"
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary text-xs sm:text-sm text-slate-800"
                />
                <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
              <p className="text-[11px] text-slate-400">
                Masukkan URL gambar publik yang dapat diakses secara terbuka di internet.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
