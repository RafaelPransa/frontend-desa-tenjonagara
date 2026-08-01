import React, { useEffect, useState } from 'react';
import { FileText, CheckCircle2, Send, AlertCircle, Clock, ShieldCheck } from 'lucide-react';
import { getLayanan, submitPengajuanLayanan } from '../services/desaService';

export default function LayananPublik() {
  const [layananList, setLayananList] = useState([]);
  const [selectedLayanan, setSelectedLayanan] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    layanan_id: '',
    nama_pemohon: '',
    nik: '',
    keterangan: '',
    dokumen_url: ''
  });

  const [statusMsg, setStatusMsg] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getLayanan()
      .then((res) => {
        setLayananList(res.data || []);
        if (res.data && res.data.length > 0) {
          setSelectedLayanan(res.data[0]);
          setFormData((prev) => ({ ...prev, layanan_id: res.data[0].id }));
        }
      })
      .catch(() => setLayananList([]));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg(null);

    if (!formData.nama_pemohon || !formData.nik || !formData.layanan_id) {
      setStatusMsg({ type: 'error', text: 'Harap lengkapi nama pemohon, NIK, dan jenis layanan.' });
      return;
    }

    if (formData.nik.length !== 16 || isNaN(formData.nik)) {
      setStatusMsg({ type: 'error', text: 'NIK harus terdiri dari tepat 16 angka.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitPengajuanLayanan(formData);
      if (res.success) {
        setStatusMsg({ type: 'success', text: 'Pengajuan surat berhasil dikirim! Silakan datang ke kantor desa atau tunggu konfirmasi petugas.' });
        setFormData({
          layanan_id: layananList[0]?.id || '',
          nama_pemohon: '',
          nik: '',
          keterangan: '',
          dokumen_url: ''
        });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Gagal mengirim pengajuan. Coba lagi.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Header */}
      <section className="bg-primary text-white py-14 px-4 sm:px-6 lg:px-8 shadow-inner">
        <div className="max-w-7xl mx-auto text-center space-y-3">
          <span className="text-accent font-semibold text-sm uppercase tracking-widest">Pelayanan Mandiri Warga</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold">Layanan Administrasi Publik</h1>
          <p className="text-emerald-100 max-w-2xl mx-auto text-sm sm:text-base">
            Informasi persyaratan dan formulir pengajuan surat keterangan secara online untuk warga Desa Tenjonagara.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Layout Grid: Left Services, Right Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Daftar & Syarat Layanan */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="font-serif text-2xl font-bold text-primary flex items-center gap-2">
              <FileText className="w-6 h-6 text-accent" />
              <span>Daftar Layanan Tersedia</span>
            </h2>

            <div className="space-y-4">
              {layananList.map((item) => {
                const isSelected = selectedLayanan?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedLayanan(item);
                      setFormData((prev) => ({ ...prev, layanan_id: item.id }));
                    }}
                    className={`p-5 rounded-2xl cursor-pointer transition-all border ${
                      isSelected
                        ? 'bg-primary text-white shadow-lg border-primary border-l-8 border-l-accent'
                        : 'bg-white text-slate-800 hover:bg-emerald-50/50 border-slate-200 shadow-sm'
                    }`}
                  >
                    <h3 className="font-bold text-lg">{item.nama_layanan}</h3>
                    <p className={`text-sm mt-1 ${isSelected ? 'text-emerald-100' : 'text-slate-600'}`}>
                      {item.deskripsi}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Panel Syarat Detail */}
            {selectedLayanan && (
              <div className="bg-surface rounded-2xl p-6 border border-slate-300 space-y-3">
                <h4 className="font-bold text-primary text-base flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-accent" />
                  <span>Persyaratan {selectedLayanan.nama_layanan}</span>
                </h4>
                <div className="text-slate-700 text-sm whitespace-pre-line leading-relaxed pl-2">
                  {selectedLayanan.syarat}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Form Pengajuan */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-200 space-y-6">
              <div>
                <h2 className="font-serif text-2xl font-bold text-primary">Formulir Pengajuan Surat Online</h2>
                <p className="text-slate-500 text-sm mt-1">Isi data diri Anda dengan benar sesuai dokumen KTP / KK asli.</p>
              </div>

              {statusMsg && (
                <div className={`p-4 rounded-xl text-sm flex items-start gap-3 ${
                  statusMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' : 'bg-rose-50 text-rose-800 border border-rose-300'
                }`}>
                  {statusMsg.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" /> : <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />}
                  <span>{statusMsg.text}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Pilih Jenis Layanan</label>
                  <select
                    name="layanan_id"
                    value={formData.layanan_id}
                    onChange={(e) => {
                      handleChange(e);
                      const selected = layananList.find((l) => l.id === parseInt(e.target.value));
                      if (selected) setSelectedLayanan(selected);
                    }}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent text-sm bg-white"
                  >
                    {layananList.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.nama_layanan}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nama Lengkap Pemohon</label>
                  <input
                    type="text"
                    name="nama_pemohon"
                    placeholder="Sesuai KTP (Contoh: Ahmad Budiman)"
                    value={formData.nama_pemohon}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nomor Induk Kependudukan (NIK)</label>
                  <input
                    type="text"
                    name="nik"
                    maxLength={16}
                    placeholder="16 Digit Angka NIK"
                    value={formData.nik}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent text-sm font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Keterangan / Keperluan Surat</label>
                  <textarea
                    name="keterangan"
                    rows={3}
                    placeholder="Jelaskan secara singkat keperluan penerbitan surat..."
                    value={formData.keterangan}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Link Dokumen Pendukung (Opsional)</label>
                  <input
                    type="url"
                    name="dokumen_url"
                    placeholder="URL Google Drive / Cloud storage foto KTP/KK"
                    value={formData.dokumen_url}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-5 h-5 text-accent" />
                  <span>{isSubmitting ? 'Mengirim Pengajuan...' : 'Kirim Pengajuan Layanan'}</span>
                </button>
              </form>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
