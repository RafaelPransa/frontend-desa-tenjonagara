import React, { useEffect, useState } from 'react';
import { FileText, CheckCircle2, Send, AlertCircle, ShieldCheck } from 'lucide-react';
import { getLayanan, submitPengajuanLayanan } from '../services/desaService';
import DokumenUploader from '../components/DokumenUploader';

/**
 * Parse string syarat (baris per baris / bernomor) menjadi array persyaratan bersih
 * Contoh input: "1. Fotokopi KTP\n2. Fotokopi KK\n3. Pengantar RT/RW (jika ada)"
 * Output: ["Fotokopi KTP", "Fotokopi KK", "Pengantar RT/RW (jika ada)"]
 */
function parseSyarat(syaratStr) {
  if (!syaratStr) return [];
  return syaratStr
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) =>
      // Hapus prefiks nomor: "1.", "1)", "-", "•"
      line.replace(/^[\d]+[\.\)]\s*/, '').replace(/^[-•]\s*/, '').trim()
    )
    .filter((line) => line.length > 0);
}

/**
 * Memeriksa apakah sebuah persyaratan bersifat opsional berdasarkan keterangannya
 */
function isRequirementOptional(syaratText) {
  if (!syaratText) return false;
  const lower = syaratText.toLowerCase();
  return lower.includes('opsional') || lower.includes('jika ada');
}

export default function LayananPublik() {
  const [layananList, setLayananList] = useState([]);
  const [selectedLayanan, setSelectedLayanan] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    layanan_id: '',
    nama_pemohon: '',
    nik: '',
    tempat_lahir: '',
    tanggal_lahir: '',
    jenis_kelamin: '',
    alamat: '',
    agama: '',
    keterangan: ''
  });

  // dokumenUrls: { [syaratIndex]: url_string }
  const [dokumenUrls, setDokumenUrls] = useState({});

  // missingDocIndexes: array indeks dokumen wajib yang belum diunggah
  const [missingDocIndexes, setMissingDocIndexes] = useState([]);

  const [statusMsg, setStatusMsg] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const syaratList = parseSyarat(selectedLayanan?.syarat);

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

  // Reset dokumen & status saat ganti jenis layanan
  useEffect(() => {
    setDokumenUrls({});
    setMissingDocIndexes([]);
    setStatusMsg(null);
  }, [selectedLayanan]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDokumenChange = (index, url) => {
    setDokumenUrls((prev) => ({ ...prev, [index]: url }));
    // Hapus dari missing index jika sudah diisi
    if (url) {
      setMissingDocIndexes((prev) => prev.filter((i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg(null);

    // 1. Validasi Input Utama
    if (
      !formData.nama_pemohon ||
      !formData.nik ||
      !formData.layanan_id ||
      !formData.tempat_lahir ||
      !formData.tanggal_lahir ||
      !formData.jenis_kelamin ||
      !formData.alamat ||
      !formData.agama
    ) {
      setStatusMsg({ type: 'error', text: 'Harap lengkapi seluruh data diri KTP dan jenis layanan.' });
      return;
    }

    if (formData.nik.length !== 16 || isNaN(formData.nik)) {
      setStatusMsg({ type: 'error', text: 'NIK harus terdiri dari tepat 16 angka.' });
      return;
    }

    // 2. Validasi Dokumen Persyaratan Wajib
    const unuploadedRequired = [];
    const missingNames = [];

    syaratList.forEach((syarat, i) => {
      const isOptional = isRequirementOptional(syarat);
      const url = dokumenUrls[i];
      if (!isOptional && (!url || !url.trim())) {
        unuploadedRequired.push(i);
        missingNames.push(syarat);
      }
    });

    if (unuploadedRequired.length > 0) {
      setMissingDocIndexes(unuploadedRequired);
      setStatusMsg({
        type: 'error',
        text: `Mohon unggah dokumen wajib berikut: ${missingNames.map((n) => `"${n}"`).join(', ')}.`
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Gabungkan semua URL dokumen menjadi JSON string untuk dikirim ke backend
      const dokumenArr = syaratList.map((syarat, i) => ({
        syarat,
        url: dokumenUrls[i] || '',
        is_optional: isRequirementOptional(syarat)
      }));
      const dokumenJson = JSON.stringify(dokumenArr);

      const payload = {
        ...formData,
        dokumen_url: dokumenJson
      };

      const res = await submitPengajuanLayanan(payload);
      if (res.success || res.data) {
        setStatusMsg({
          type: 'success',
          text: 'Pengajuan surat berhasil dikirim! Silakan datang ke kantor desa atau tunggu konfirmasi petugas.'
        });
        setFormData({
          layanan_id: layananList[0]?.id || '',
          nama_pemohon: '',
          nik: '',
          tempat_lahir: '',
          tanggal_lahir: '',
          jenis_kelamin: '',
          alamat: '',
          agama: '',
          keterangan: ''
        });
        setDokumenUrls({});
        setMissingDocIndexes([]);
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Gagal mengirim pengajuan. Coba lagi.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Header Banner */}
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
                    className={`p-5 rounded-2xl cursor-pointer transition-all border ${isSelected
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
                <ol className="text-slate-700 text-sm leading-relaxed space-y-2 pl-1">
                  {syaratList.map((syarat, i) => {
                    const isOptional = isRequirementOptional(syarat);
                    return (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-primary text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <div className="flex-1">
                          <span>{syarat}</span>
                          {isOptional ? (
                            <span className="ml-2 text-[10px] font-semibold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-md">
                              Opsional
                            </span>
                          ) : (
                            <span className="ml-2 text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md">
                              Wajib
                            </span>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ol>
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
                <div className={`p-4 rounded-2xl text-sm flex items-start gap-3 shadow-xs ${statusMsg.type === 'success'
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-300'
                    : 'bg-rose-50 text-rose-900 border border-rose-300 font-medium'
                  }`}>
                  {statusMsg.type === 'success'
                    ? <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    : <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />}
                  <span>{statusMsg.text}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Pilih Jenis Layanan */}
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

                {/* Nama Lengkap */}
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

                {/* NIK */}
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

                {/* Tempat & Tanggal Lahir */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tempat Lahir</label>
                    <input
                      type="text"
                      name="tempat_lahir"
                      placeholder="Sesuai KTP (Contoh: Tasikmalaya)"
                      value={formData.tempat_lahir}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tanggal Lahir</label>
                    <input
                      type="date"
                      name="tanggal_lahir"
                      value={formData.tanggal_lahir}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent text-sm bg-white text-slate-800"
                      required
                    />
                  </div>
                </div>

                {/* Jenis Kelamin & Agama */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Jenis Kelamin</label>
                    <select
                      name="jenis_kelamin"
                      value={formData.jenis_kelamin}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent text-sm bg-white"
                      required
                    >
                      <option value="">-- Pilih Jenis Kelamin --</option>
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Agama</label>
                    <select
                      name="agama"
                      value={formData.agama}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent text-sm bg-white"
                      required
                    >
                      <option value="">-- Pilih Agama --</option>
                      <option value="Islam">Islam</option>
                      <option value="Protestan">Protestan</option>
                      <option value="Katolik">Katolik</option>
                      <option value="Hindu">Hindu</option>
                      <option value="Buddha">Buddha</option>
                      <option value="Khonghucu">Khonghucu</option>
                    </select>
                  </div>
                </div>

                {/* Alamat Lengkap Sesuai KTP */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Alamat Lengkap Sesuai KTP</label>
                  <textarea
                    name="alamat"
                    rows={2}
                    placeholder="Contoh: RT 002 / RW 005 Dusun Tenjonagara, Desa Tenjonagara"
                    value={formData.alamat}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                    required
                  />
                </div>

                {/* Keterangan */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Keterangan / Keperluan Surat</label>
                  <textarea
                    name="keterangan"
                    rows={3}
                    placeholder="Jelaskan secara singkat keperluan penerbitan surat..."
                    value={formData.keterangan}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                    required
                  />
                </div>

                {/* Upload Dokumen Per Persyaratan */}
                {syaratList.length > 0 && (
                  <div className="space-y-4 p-5 bg-slate-50 rounded-2xl border border-slate-200">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
                      <h3 className="font-bold text-sm text-slate-800">Unggah Dokumen Persyaratan</h3>
                    </div>
                    <p className="text-xs text-slate-500 -mt-2">
                      Silakan foto atau scan masing-masing dokumen di bawah ini. Dokumen bertanda <span className="font-bold text-rose-600">Wajib</span> harus diunggah.
                    </p>

                    <div className="space-y-4">
                      {syaratList.map((syarat, i) => {
                        const isOptional = isRequirementOptional(syarat);
                        const isMissing = missingDocIndexes.includes(i);

                        return (
                          <DokumenUploader
                            key={`${selectedLayanan?.id}-${i}`}
                            label={syarat}
                            value={dokumenUrls[i] || ''}
                            onChange={(url) => handleDokumenChange(i, url)}
                            required={!isOptional}
                            isMissing={isMissing}
                            hint={
                              syarat.toLowerCase().includes('ktp')
                                ? 'Foto KTP tampak depan secara jelas'
                                : syarat.toLowerCase().includes('kk') || syarat.toLowerCase().includes('kartu keluarga')
                                  ? 'Foto halaman depan Kartu Keluarga'
                                  : syarat.toLowerCase().includes('pengantar') || syarat.toLowerCase().includes('rt')
                                    ? 'Surat pengantar bertanda tangan RT/RW'
                                    : null
                            }
                          />
                        );
                      })}
                    </div>
                  </div>
                )}

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
