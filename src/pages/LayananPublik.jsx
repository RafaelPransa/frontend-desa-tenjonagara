import React, { useEffect, useState } from 'react';
import { FileText, CheckCircle2, Send, AlertCircle, ShieldCheck, User, ArrowRight, ArrowLeft, FileCheck, Info, Check } from 'lucide-react';
import { getLayanan, submitPengajuanLayanan } from '../services/desaService';
import DokumenUploader from '../components/DokumenUploader';
import ScrollReveal from '../components/ScrollReveal';

/**
 * Parse string syarat menjadi array persyaratan bersih
 */
function parseSyarat(syaratStr) {
  if (!syaratStr) return [];
  return syaratStr
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) =>
      line.replace(/^[\d]+[\.\)]\s*/, '').replace(/^[-•]\s*/, '').trim()
    )
    .filter((line) => line.length > 0);
}

/**
 * Memeriksa apakah sebuah persyaratan bersifat opsional
 */
function isRequirementOptional(syaratText) {
  if (!syaratText) return false;
  const lower = syaratText.toLowerCase();
  return lower.includes('opsional') || lower.includes('jika ada');
}

export default function LayananPublik() {
  const [layananList, setLayananList] = useState([]);
  const [selectedLayanan, setSelectedLayanan] = useState(null);

  // Stepper State (1: Pilih Layanan, 2: Data Diri KTP, 3: Unggah Berkas, 4: Ringkasan & Kirim)
  const [currentStep, setCurrentStep] = useState(1);

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
    if (url) {
      setMissingDocIndexes((prev) => prev.filter((i) => i !== index));
    }
  };

  // Navigasi Langkah (Stepper Validation)
  const handleNextStep = () => {
    setStatusMsg(null);

    // Validasi Step 1: Pilih Layanan
    if (currentStep === 1) {
      if (!formData.layanan_id || !selectedLayanan) {
        setStatusMsg({ type: 'error', text: 'Silakan pilih salah satu jenis layanan surat terlebih dahulu.' });
        return;
      }
      setCurrentStep(2);
      window.scrollTo({ top: 300, behavior: 'smooth' });
      return;
    }

    // Validasi Step 2: Data Diri KTP
    if (currentStep === 2) {
      if (!formData.nama_pemohon || !formData.nik || !formData.tempat_lahir || !formData.tanggal_lahir || !formData.jenis_kelamin || !formData.alamat || !formData.agama) {
        setStatusMsg({ type: 'error', text: 'Harap lengkapi seluruh data diri sesuai KTP (Nama, NIK, Tempat/Tgl Lahir, Jenis Kelamin, Agama, Alamat).' });
        return;
      }
      if (formData.nik.length !== 16 || isNaN(formData.nik)) {
        setStatusMsg({ type: 'error', text: 'Nomor NIK harus terdiri dari tepat 16 angka.' });
        return;
      }
      setCurrentStep(3);
      window.scrollTo({ top: 300, behavior: 'smooth' });
      return;
    }

    // Validasi Step 3: Unggah Berkas Persyaratan
    if (currentStep === 3) {
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

      setCurrentStep(4);
      window.scrollTo({ top: 300, behavior: 'smooth' });
      return;
    }
  };

  const handlePrevStep = () => {
    setStatusMsg(null);
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg(null);

    if (!formData.keterangan || !formData.keterangan.trim()) {
      setStatusMsg({ type: 'error', text: 'Harap isi keterangan / keperluan penerbitan surat secara singkat.' });
      return;
    }

    setIsSubmitting(true);
    try {
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
        setCurrentStep(1);
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Gagal mengirim pengajuan. Coba lagi.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { num: 1, title: 'Pilih Layanan', icon: FileText },
    { num: 2, title: 'Data Diri KTP', icon: User },
    { num: 3, title: 'Unggah Berkas', icon: ShieldCheck },
    { num: 4, title: 'Ringkasan & Kirim', icon: CheckCircle2 }
  ];

  return (
    <div className="space-y-12 pb-20">

      {/* HEADER BANNER */}
      <section className="gradient-hero text-white py-14 px-4 sm:px-6 lg:px-8 shadow-xl relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-center space-y-3 relative z-10">
          <ScrollReveal direction="down" delay={0}>
            <span className="inline-block px-3.5 py-1 rounded-full bg-white/10 text-accent border border-white/20 text-xs font-bold uppercase tracking-wider">
              Pelayanan Administrasi Digital
            </span>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={100}>
            <h1 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight">
              Layanan Surat Online <span className="text-accent">Desa Tenjonagara</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={200}>
            <p className="text-emerald-100 text-sm sm:text-base max-w-2xl mx-auto font-light">
              Ajukan pembuatan surat keterangan warga secara online dengan mengikuti 4 langkah mudah di bawah ini.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* STEPPER PROGRESS BAR */}
        <ScrollReveal direction="up" delay={100}>
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200/80">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative">
              {steps.map((s) => {
                const Icon = s.icon;
                const isPassed = currentStep > s.num;
                const isCurrent = currentStep === s.num;

                return (
                  <div
                    key={s.num}
                    onClick={() => {
                      if (s.num < currentStep) setCurrentStep(s.num);
                    }}
                    className={`flex items-center gap-3 p-3.5 rounded-2xl transition-all ${
                      s.num < currentStep ? 'cursor-pointer' : ''
                    } ${
                      isCurrent
                        ? 'bg-primary text-white shadow-md shadow-primary/20 ring-2 ring-accent'
                        : isPassed
                        ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                        : 'bg-slate-50 text-slate-400 border border-slate-200'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 transition-transform ${
                        isCurrent
                          ? 'bg-accent text-primary-dark shadow-sm scale-105'
                          : isPassed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {isPassed ? <Check className="w-5 h-5" /> : s.num}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] uppercase font-bold tracking-wider opacity-80">
                        Langkah {s.num}
                      </div>
                      <div className="text-xs sm:text-sm font-bold truncate">
                        {s.title}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Visual Progress Line */}
            <div className="w-full bg-slate-100 h-2 rounded-full mt-5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-primary via-emerald-600 to-accent h-full transition-all duration-500 ease-out"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              />
            </div>
          </div>
        </ScrollReveal>

        {/* STATUS MESSAGE NOTIFICATION */}
        {statusMsg && (
          <div
            className={`p-4 rounded-2xl text-sm flex items-start gap-3 shadow-md animate-in fade-in zoom-in-95 duration-200 ${
              statusMsg.type === 'success'
                ? 'bg-emerald-50 text-emerald-900 border border-emerald-300'
                : 'bg-rose-50 text-rose-900 border border-rose-300 font-medium'
            }`}
          >
            {statusMsg.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            )}
            <span className="leading-relaxed">{statusMsg.text}</span>
          </div>
        )}

        {/* STEP CONTENT CONTAINER */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200/80">

          {/* 📍 STEP 1: PILIH JENIS SURAT */}
          {currentStep === 1 && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div>
                <span className="text-accent font-bold text-xs uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-lg">
                  Langkah 1 dari 4
                </span>
                <h2 className="font-serif text-2xl font-bold text-primary mt-2">Pilih Jenis Surat Keterangan</h2>
                <p className="text-slate-500 text-sm mt-1">
                  Silakan pilih jenis pelayanan surat yang Anda butuhkan di bawah ini.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: List Services Cards */}
                <div className="lg:col-span-6 space-y-4">
                  {layananList.map((item) => {
                    const isSelected = selectedLayanan?.id === item.id;

                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          setSelectedLayanan(item);
                          setFormData((prev) => ({ ...prev, layanan_id: item.id }));
                        }}
                        className={`p-5 rounded-2xl cursor-pointer border-2 transition-all flex items-start gap-4 transform hover:-translate-y-0.5 ${
                          isSelected
                            ? 'bg-primary text-white border-primary shadow-xl shadow-primary/20 scale-[1.01]'
                            : 'bg-white text-slate-800 border-slate-200 hover:border-emerald-300 hover:shadow-md'
                        }`}
                      >
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                            isSelected ? 'bg-accent text-primary-dark' : 'bg-slate-100 text-primary'
                          }`}
                        >
                          <FileText className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-bold text-base sm:text-lg leading-snug">{item.nama_layanan}</h3>
                          <p className={`text-xs sm:text-sm leading-relaxed ${isSelected ? 'text-emerald-100' : 'text-slate-600'}`}>
                            {item.deskripsi}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Right Column: Detail & Syarat Layanan Terpilih */}
                <div className="lg:col-span-6">
                  {selectedLayanan ? (
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-5 sticky top-24">
                      <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
                        <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold">
                          <FileCheck className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-accent uppercase tracking-wider">Persyaratan Dokumen</span>
                          <h3 className="font-bold text-slate-900 text-base">{selectedLayanan.nama_layanan}</h3>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <p className="text-xs font-semibold text-slate-600">
                          Dokumen yang wajib disiapkan pemohon:
                        </p>
                        <ul className="space-y-2.5">
                          {syaratList.map((syarat, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                              <span className="leading-normal">{syarat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-400">
                      <Info className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                      <p className="text-xs">Pilih salah satu layanan untuk melihat persyaratannya.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation Action */}
              <div className="pt-6 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-8 py-3.5 rounded-xl bg-accent hover:bg-accent-hover text-primary-dark font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 transform hover:-translate-y-0.5"
                >
                  <span>Lanjut ke Data Diri (KTP)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* 👤 STEP 2: ISI DATA DIRI KTP */}
          {currentStep === 2 && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div>
                <span className="text-accent font-bold text-xs uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-lg">
                  Langkah 2 dari 4
                </span>
                <h2 className="font-serif text-2xl font-bold text-primary mt-2">Data Diri Pemohon (Sesuai KTP)</h2>
                <p className="text-slate-500 text-sm mt-1">
                  Harap isi data identitas Anda secara lengkap dan akurat sesuai Kartu Tanda Penduduk (KTP) asli.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 max-w-3xl">
                {/* Nama Pemohon */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Nama Lengkap Pemohon</label>
                  <input
                    type="text"
                    name="nama_pemohon"
                    placeholder="Sesuai KTP (Contoh: Ahmad Budiman)"
                    value={formData.nama_pemohon}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent text-sm bg-white"
                    required
                  />
                </div>

                {/* NIK */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Nomor Induk Kependudukan (NIK)</label>
                  <input
                    type="text"
                    name="nik"
                    maxLength={16}
                    placeholder="16 Digit Angka NIK"
                    value={formData.nik}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent text-sm font-mono bg-white"
                    required
                  />
                </div>

                {/* Tempat & Tanggal Lahir */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Tempat Lahir</label>
                    <input
                      type="text"
                      name="tempat_lahir"
                      placeholder="Sesuai KTP (Contoh: Tasikmalaya)"
                      value={formData.tempat_lahir}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent text-sm bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Tanggal Lahir</label>
                    <input
                      type="date"
                      name="tanggal_lahir"
                      value={formData.tanggal_lahir}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent text-sm bg-white text-slate-800"
                      required
                    />
                  </div>
                </div>

                {/* Jenis Kelamin & Agama */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Jenis Kelamin</label>
                    <select
                      name="jenis_kelamin"
                      value={formData.jenis_kelamin}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent text-sm bg-white"
                      required
                    >
                      <option value="">-- Pilih Jenis Kelamin --</option>
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Agama</label>
                    <select
                      name="agama"
                      value={formData.agama}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent text-sm bg-white"
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
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Alamat Lengkap Sesuai KTP</label>
                  <textarea
                    name="alamat"
                    rows={3}
                    placeholder="Contoh: RT 002 / RW 005 Dusun Tenjonagara, Desa Tenjonagara"
                    value={formData.alamat}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent text-sm bg-white"
                    required
                  />
                </div>
              </div>

              {/* Navigation Action */}
              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-all flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Kembali</span>
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-8 py-3.5 rounded-xl bg-accent hover:bg-accent-hover text-primary-dark font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 transform hover:-translate-y-0.5"
                >
                  <span>Lanjut ke Unggah Berkas</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* 📂 STEP 3: UNGGAH BERKAS PERSYARATAN */}
          {currentStep === 3 && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div>
                <span className="text-accent font-bold text-xs uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-lg">
                  Langkah 3 dari 4
                </span>
                <h2 className="font-serif text-2xl font-bold text-primary mt-2">Unggah Berkas Persyaratan</h2>
                <p className="text-slate-500 text-sm mt-1">
                  Foto atau scan dokumen persyaratan di bawah ini. Dokumen bertanda <span className="font-bold text-rose-600">Wajib</span> harus diunggah.
                </p>
              </div>

              {syaratList.length > 0 ? (
                <div className="space-y-6 max-w-3xl">
                  {syaratList.map((syarat, i) => {
                    const isOptional = isRequirementOptional(syarat);
                    const isMissing = missingDocIndexes.includes(i);

                    return (
                      <DokumenUploader
                        key={`${selectedLayanan?.id}-${i}`}
                        label={syarat}
                        value={dokumenUrls[i] || ''}
                        onChange={(url) => handleDokumenChange(i, url)}
                        isOptional={isOptional}
                        isMissing={isMissing}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500">
                  Tidak ada berkas spesifik yang diwajibkan untuk layanan ini.
                </div>
              )}

              {/* Navigation Action */}
              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-all flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Kembali</span>
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-8 py-3.5 rounded-xl bg-accent hover:bg-accent-hover text-primary-dark font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 transform hover:-translate-y-0.5"
                >
                  <span>Lanjut ke Ringkasan & Kirim</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* 📋 STEP 4: RINGKASAN & KONFIRMASI PENGIRIMAN */}
          {currentStep === 4 && (
            <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-300">
              <div>
                <span className="text-accent font-bold text-xs uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-lg">
                  Langkah 4 dari 4
                </span>
                <h2 className="font-serif text-2xl font-bold text-primary mt-2">Ringkasan & Konfirmasi Pengajuan</h2>
                <p className="text-slate-500 text-sm mt-1">
                  Periksa kembali seluruh data pengajuan Anda sebelum menekan tombol kirim di bawah ini.
                </p>
              </div>

              {/* Summary Card Box */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                  <div>
                    <span className="text-[10px] font-bold text-accent uppercase tracking-wider">Jenis Layanan Surat</span>
                    <h3 className="font-bold text-primary text-lg">{selectedLayanan?.nama_layanan}</h3>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full border border-emerald-300">
                    Siap Dikirim
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 font-bold uppercase block text-[10px]">Nama Pemohon</span>
                    <span className="font-bold text-slate-800 text-sm">{formData.nama_pemohon}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold uppercase block text-[10px]">Nomor NIK</span>
                    <span className="font-mono font-bold text-slate-800 text-sm">{formData.nik}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold uppercase block text-[10px]">Tempat, Tanggal Lahir</span>
                    <span className="font-medium text-slate-800">{formData.tempat_lahir}, {formData.tanggal_lahir}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold uppercase block text-[10px]">Jenis Kelamin & Agama</span>
                    <span className="font-medium text-slate-800">{formData.jenis_kelamin} ({formData.agama})</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-400 font-bold uppercase block text-[10px]">Alamat Lengkap</span>
                    <span className="font-medium text-slate-800 leading-relaxed block bg-white p-3 rounded-xl border border-slate-200 mt-1">
                      {formData.alamat}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Keperluan / Catatan Pemohon <span className="text-rose-600">*</span>
                  </label>
                  <textarea
                    name="keterangan"
                    rows={3}
                    placeholder="Jelaskan secara singkat keperluan penerbitan surat..."
                    value={formData.keterangan}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent text-sm bg-white"
                    required
                  />
                </div>
              </div>

              {/* Navigation Action */}
              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  disabled={isSubmitting}
                  className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Kembali</span>
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold shadow-xl hover:shadow-2xl transition-all flex items-center gap-2 transform hover:-translate-y-0.5 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Mengirim Pengajuan...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-accent" />
                      <span>Kirim Pengajuan Surat Sekarang</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
