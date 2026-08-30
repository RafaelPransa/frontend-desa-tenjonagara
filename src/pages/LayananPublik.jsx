import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  FileText,
  CheckCircle2,
  Send,
  AlertCircle,
  ShieldCheck,
  User,
  ArrowRight,
  ArrowLeft,
  FileCheck,
  Info,
  Check,
  Search,
  Clock,
  CheckCircle,
  Loader2,
  Sparkles,
  Calendar,
  Building,
  HelpCircle,
  MapPin
} from 'lucide-react';
import { getLayanan, submitPengajuanLayanan, trackPengajuanLayanan } from '../services/desaService';
import DokumenUploader from '../components/DokumenUploader';
import ScrollReveal from '../components/ScrollReveal';
import SEOHead from '../components/SEOHead';

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

/**
 * Format tanggal Indonesia
 */
function formatTanggalIndo(dateStr) {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    }).format(d);
  } catch (e) {
    return dateStr;
  }
}

export default function LayananPublik() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Tab State ('pengajuan' | 'tracking')
  const [activeTab, setActiveTab] = useState(
    searchParams.get('tab') === 'status' ? 'tracking' : 'pengajuan'
  );

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
  const [lastSubmittedNik, setLastSubmittedNik] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Tracking State
  const [trackingNik, setTrackingNik] = useState(searchParams.get('nik') || '');
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingError, setTrackingError] = useState(null);
  const [trackingResults, setTrackingResults] = useState(null);

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

  // Handle URL param tracking auto-search
  useEffect(() => {
    const urlNik = searchParams.get('nik');
    if (urlNik && urlNik.length === 16) {
      setTrackingNik(urlNik);
      setActiveTab('tracking');
      handlePerformTrack(urlNik);
    }
  }, []);

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

      const submittedNikValue = formData.nik;
      const payload = {
        ...formData,
        dokumen_url: dokumenJson
      };

      const res = await submitPengajuanLayanan(payload);
      if (res.success || res.data) {
        setLastSubmittedNik(submittedNikValue);
        setStatusMsg({
          type: 'success',
          text: 'Permohonan surat Anda berhasil dikirim ke Kantor Desa Tenjonagara! Petugas desa akan segera memproses berkas Anda.'
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

  // Perform Tracking by NIK
  const handlePerformTrack = async (nikToTrack) => {
    const cleanNik = (nikToTrack || trackingNik).trim();
    if (!cleanNik) {
      setTrackingError('Silakan masukkan 16 digit Nomor Induk Kependudukan (NIK).');
      return;
    }
    if (cleanNik.length !== 16 || isNaN(cleanNik)) {
      setTrackingError('Nomor NIK harus terdiri dari tepat 16 digit angka.');
      return;
    }

    setTrackingLoading(true);
    setTrackingError(null);
    try {
      const res = await trackPengajuanLayanan(cleanNik);
      const list = res.data?.data || res.data || [];
      setTrackingResults(Array.isArray(list) ? list : []);
    } catch (err) {
      setTrackingError(err.response?.data?.message || err.message || 'Gagal memeriksa status permohonan surat.');
      setTrackingResults([]);
    } finally {
      setTrackingLoading(false);
    }
  };

  const handleTrackingSubmit = (e) => {
    e.preventDefault();
    handlePerformTrack(trackingNik);
  };

  const switchToTrackingWithNik = (nik) => {
    setActiveTab('tracking');
    setTrackingNik(nik);
    handlePerformTrack(nik);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const steps = [
    { num: 1, title: 'Pilih Layanan', icon: FileText },
    { num: 2, title: 'Data Diri KTP', icon: User },
    { num: 3, title: 'Unggah Berkas', icon: ShieldCheck },
    { num: 4, title: 'Ringkasan & Kirim', icon: CheckCircle2 }
  ];

  return (
    <div className="space-y-12 pb-20">
      <SEOHead
        title="Layanan Publik & Cek Status Surat Online"
        description="Portal pelayanan administrasi mandiri warga Desa Tenjonagara. Pengajuan surat keterangan dan pelacakan status permohonan surat secara online menggunakan NIK."
        url="/layanan"
      />

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
              Ajukan permohonan surat keterangan warga secara mandiri atau lacak proses penyelesaian surat Anda secara real-time.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* TAB SWITCHER */}
        <ScrollReveal direction="up" delay={50}>
          <div className="flex items-center justify-center">
            <div className="bg-slate-200/90 p-1.5 rounded-2xl flex items-center gap-2 shadow-inner max-w-lg w-full">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('pengajuan');
                  setStatusMsg(null);
                }}
                className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'pengajuan'
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Buat Pengajuan Baru</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('tracking');
                  setStatusMsg(null);
                }}
                className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'tracking'
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                }`}
              >
                <Search className="w-4 h-4" />
                <span>Cek Status Surat</span>
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* ══════════════════════════════════════════════════════════
            TAB 1: FORMULIR PENGAJUAN SURAT BARU
        ══════════════════════════════════════════════════════════ */}
        {activeTab === 'pengajuan' && (
          <div className="space-y-8 animate-in fade-in duration-300">
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
                              ? 'bg-primary text-white'
                              : 'bg-slate-200 text-slate-500'
                          }`}
                        >
                          {isPassed ? <Check className="w-4 h-4 stroke-[3]" /> : s.num}
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold uppercase tracking-wider block opacity-70">
                            Langkah {s.num}
                          </span>
                          <span className="font-bold text-xs sm:text-sm truncate block">{s.title}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </ScrollReveal>

            {/* STATUS ALERT MESSAGE */}
            {statusMsg && (
              <div
                className={`p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-300 shadow-sm ${
                  statusMsg.type === 'success'
                    ? 'bg-emerald-50 border border-emerald-300 text-emerald-900'
                    : 'bg-rose-50 border border-rose-300 text-rose-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  {statusMsg.type === 'success' ? (
                    <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-rose-600 shrink-0" />
                  )}
                  <span className="text-sm font-semibold">{statusMsg.text}</span>
                </div>

                {statusMsg.type === 'success' && lastSubmittedNik && (
                  <button
                    type="button"
                    onClick={() => switchToTrackingWithNik(lastSubmittedNik)}
                    className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 shadow-sm"
                  >
                    <Search className="w-3.5 h-3.5 text-accent" />
                    <span>Lacak Status Surat Ini ➔</span>
                  </button>
                )}
              </div>
            )}

            {/* STEPPER CONTENT BOX */}
            <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200/80">
              {/* 📑 STEP 1: PILIH JENIS LAYANAN */}
              {currentStep === 1 && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <div>
                    <span className="text-accent font-bold text-xs uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-lg">
                      Langkah 1 dari 4
                    </span>
                    <h2 className="font-serif text-2xl font-bold text-primary mt-2">Pilih Jenis Layanan Surat</h2>
                    <p className="text-slate-500 text-sm mt-1">
                      Pilih jenis surat keterangan yang ingin Anda buat di Kantor Desa Tenjonagara.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {layananList.map((layanan) => {
                      const isSelected = selectedLayanan?.id === layanan.id;
                      return (
                        <div
                          key={layanan.id}
                          onClick={() => {
                            setSelectedLayanan(layanan);
                            setFormData((prev) => ({ ...prev, layanan_id: layanan.id }));
                          }}
                          className={`p-6 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between group transform hover:-translate-y-1 ${
                            isSelected
                              ? 'border-primary bg-emerald-50/50 shadow-lg ring-1 ring-primary'
                              : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <div
                                className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                                  isSelected ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                                }`}
                              >
                                <FileText className="w-6 h-6" />
                              </div>
                              {isSelected && (
                                <span className="px-2.5 py-1 bg-accent text-primary-dark font-extrabold text-[10px] rounded-full uppercase tracking-wider">
                                  Dipilih
                                </span>
                              )}
                            </div>
                            <h3 className="font-bold text-base text-slate-900 group-hover:text-primary transition-colors">
                              {layanan.nama_layanan}
                            </h3>
                            <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                              {layanan.deskripsi || 'Layanan administrasi resmi Desa Tenjonagara.'}
                            </p>
                          </div>

                          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-primary">
                            <span>Pilih Layanan Ini</span>
                            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Navigation Action */}
                  <div className="pt-6 border-t border-slate-100 flex justify-end">
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="px-8 py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 transform hover:-translate-y-0.5"
                    >
                      <span>Lanjut Isi Data Diri</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* 👤 STEP 2: DATA DIRI PEMOHON SESUAI KTP */}
              {currentStep === 2 && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <div>
                    <span className="text-accent font-bold text-xs uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-lg">
                      Langkah 2 dari 4
                    </span>
                    <h2 className="font-serif text-2xl font-bold text-primary mt-2">Data Diri Pemohon (Sesuai KTP)</h2>
                    <p className="text-slate-500 text-sm mt-1">
                      Pastikan seluruh informasi identitas sesuai dengan dokumen kependudukan resmi Anda.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Nama Lengkap */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Nama Lengkap <span className="text-rose-600">*</span>
                      </label>
                      <input
                        type="text"
                        name="nama_pemohon"
                        placeholder="Contoh: Asep Sunandar"
                        value={formData.nama_pemohon}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                        required
                      />
                    </div>

                    {/* NIK */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Nomor Induk Kependudukan (NIK 16 Digit) <span className="text-rose-600">*</span>
                      </label>
                      <input
                        type="text"
                        name="nik"
                        placeholder="Contoh: 3206010000000001"
                        maxLength={16}
                        value={formData.nik}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
                        required
                      />
                      <span className="text-[11px] text-slate-400 block">{formData.nik.length}/16 Angka</span>
                    </div>

                    {/* Tempat Lahir */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Tempat Lahir <span className="text-rose-600">*</span>
                      </label>
                      <input
                        type="text"
                        name="tempat_lahir"
                        placeholder="Contoh: Tasikmalaya"
                        value={formData.tempat_lahir}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                        required
                      />
                    </div>

                    {/* Tanggal Lahir */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Tanggal Lahir <span className="text-rose-600">*</span>
                      </label>
                      <input
                        type="date"
                        name="tanggal_lahir"
                        value={formData.tanggal_lahir}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                        required
                      />
                    </div>

                    {/* Jenis Kelamin */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Jenis Kelamin <span className="text-rose-600">*</span>
                      </label>
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

                    {/* Agama */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Agama <span className="text-rose-600">*</span>
                      </label>
                      <select
                        name="agama"
                        value={formData.agama}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent text-sm bg-white"
                        required
                      >
                        <option value="">-- Pilih Agama --</option>
                        <option value="Islam">Islam</option>
                        <option value="Kristen">Kristen</option>
                        <option value="Katolik">Katolik</option>
                        <option value="Hindu">Hindu</option>
                        <option value="Buddha">Buddha</option>
                        <option value="Konghucu">Konghucu</option>
                      </select>
                    </div>

                    {/* Alamat Lengkap */}
                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Alamat Lengkap (Dusun, RT/RW) <span className="text-rose-600">*</span>
                      </label>
                      <textarea
                        name="alamat"
                        rows={3}
                        placeholder="Contoh: Dusun Tenjonagara RT 02 / RW 01, Desa Tenjonagara"
                        value={formData.alamat}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
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
                      className="px-8 py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 transform hover:-translate-y-0.5"
                    >
                      <span>Lanjut Unggah Berkas</span>
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
                    <h2 className="font-serif text-2xl font-bold text-primary mt-2">
                      Unggah Berkas Persyaratan — {selectedLayanan?.nama_layanan}
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">
                      Unggah foto / scan dokumen persyaratan asli yang jelas dan dapat dibaca.
                    </p>
                  </div>

                  {syaratList.length > 0 ? (
                    <div className="space-y-4">
                      {syaratList.map((syarat, index) => {
                        const isOptional = isRequirementOptional(syarat);
                        const isMissing = missingDocIndexes.includes(index);

                        return (
                          <DokumenUploader
                            key={index}
                            index={index}
                            label={syarat}
                            value={dokumenUrls[index] || ''}
                            onChange={(url) => handleDokumenChange(index, url)}
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
        )}

        {/* ══════════════════════════════════════════════════════════
            TAB 2: CEK STATUS PERMOHONAN SURAT
        ══════════════════════════════════════════════════════════ */}
        {activeTab === 'tracking' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Search Box */}
            <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200/80 space-y-6">
              <div className="max-w-2xl">
                <span className="text-accent font-bold text-xs uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-lg">
                  Pelacakan Mandiri
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary mt-2">
                  Lacak Status Permohonan Surat
                </h2>
                <p className="text-slate-500 text-xs sm:text-sm mt-1">
                  Masukkan 16 digit Nomor Induk Kependudukan (NIK) yang digunakan saat mengajukan permohonan surat.
                </p>
              </div>

              <form onSubmit={handleTrackingSubmit} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    placeholder="Masukkan 16 Digit NIK Anda (contoh: 320601...)"
                    value={trackingNik}
                    onChange={(e) => setTrackingNik(e.target.value)}
                    maxLength={16}
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm sm:text-base font-semibold text-slate-900 bg-slate-50/60 focus:bg-white transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={trackingLoading}
                  className="px-8 py-3.5 rounded-2xl bg-primary hover:bg-primary-hover text-white font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
                >
                  {trackingLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Memeriksa...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5 text-accent" />
                      <span>Lacak Status</span>
                    </>
                  )}
                </button>
              </form>

              {/* Error Alert */}
              {trackingError && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  <span>{trackingError}</span>
                </div>
              )}
            </div>

            {/* Results Section */}
            {trackingResults !== null && (
              <div className="space-y-6">
                {trackingResults.length === 0 ? (
                  <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
                    <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                      <Search className="w-8 h-8" />
                    </div>
                    <h3 className="font-serif font-bold text-lg text-slate-800">
                      Tidak Ditemukan Riwayat Pengajuan
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                      Tidak ada permohonan surat aktif yang terdaftar dengan NIK tersebut. Pastikan NIK yang Anda masukkan sudah benar atau ajukan surat baru pada tab di atas.
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveTab('pengajuan')}
                      className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-sm hover:bg-primary-hover transition-all"
                    >
                      <FileText className="w-4 h-4 text-accent" />
                      <span>Buat Pengajuan Baru</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between px-1">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Ditemukan {trackingResults.length} Permohonan Surat
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                      {trackingResults.map((item) => {
                        const isPending = item.status === 'pending';
                        const isDiproses = item.status === 'diproses';
                        const isSelesai = item.status === 'selesai';

                        return (
                          <div
                            key={item.id}
                            className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg hover:shadow-xl transition-all space-y-6"
                          >
                            {/* Card Top: Service Name & Status Badge */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-mono font-bold">
                                    ID #{item.id}
                                  </span>
                                  <span className="text-slate-400 text-xs flex items-center gap-1">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span>{formatTanggalIndo(item.created_at)}</span>
                                  </span>
                                </div>
                                <h3 className="font-serif text-xl font-bold text-slate-900 mt-1">
                                  {item.layanan_nama}
                                </h3>
                              </div>

                              {/* Status Tag */}
                              <div>
                                {isPending && (
                                  <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-extrabold shadow-xs">
                                    <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
                                    <span>Menunggu Verifikasi</span>
                                  </span>
                                )}
                                {isDiproses && (
                                  <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-blue-100 border border-blue-300 text-blue-900 text-xs font-extrabold shadow-xs">
                                    <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                                    <span>Sedang Diproses</span>
                                  </span>
                                )}
                                {isSelesai && (
                                  <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-extrabold shadow-xs">
                                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                                    <span>Selesai & Siap Diambil</span>
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Visual Progress Timeline */}
                            <div className="py-2">
                              <div className="grid grid-cols-3 gap-2 relative">
                                {/* Step 1: Terkirim */}
                                <div className="text-center space-y-2">
                                  <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs mx-auto shadow-sm">
                                    <Check className="w-4 h-4 stroke-[3]" />
                                  </div>
                                  <div>
                                    <div className="text-xs font-bold text-slate-800">Terkirim</div>
                                    <div className="text-[10px] text-slate-400 hidden sm:block">Berkas diterima</div>
                                  </div>
                                </div>

                                {/* Step 2: Diverifikasi / Diproses */}
                                <div className="text-center space-y-2">
                                  <div
                                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs mx-auto shadow-sm ${
                                      isDiproses || isSelesai
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-slate-200 text-slate-400'
                                    }`}
                                  >
                                    {isSelesai ? <Check className="w-4 h-4 stroke-[3]" /> : 2}
                                  </div>
                                  <div>
                                    <div
                                      className={`text-xs font-bold ${
                                        isDiproses || isSelesai ? 'text-blue-700' : 'text-slate-400'
                                      }`}
                                    >
                                      Verifikasi & Proses
                                    </div>
                                    <div className="text-[10px] text-slate-400 hidden sm:block">
                                      Pemeriksaan berkas
                                    </div>
                                  </div>
                                </div>

                                {/* Step 3: Selesai */}
                                <div className="text-center space-y-2">
                                  <div
                                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs mx-auto shadow-sm ${
                                      isSelesai
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-slate-200 text-slate-400'
                                    }`}
                                  >
                                    {isSelesai ? <Check className="w-4 h-4 stroke-[3]" /> : 3}
                                  </div>
                                  <div>
                                    <div
                                      className={`text-xs font-bold ${
                                        isSelesai ? 'text-emerald-700' : 'text-slate-400'
                                      }`}
                                    >
                                      Siap Diambil
                                    </div>
                                    <div className="text-[10px] text-slate-400 hidden sm:block">
                                      Kantor Desa
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Card Footer Info Box */}
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
                                <div>
                                  <span className="font-semibold text-slate-400 block text-[10px] uppercase">
                                    Nama Pemohon:
                                  </span>
                                  <span className="font-bold text-slate-800">{item.nama_pemohon}</span>
                                </div>
                                <div>
                                  <span className="font-semibold text-slate-400 block text-[10px] uppercase">
                                    NIK Pemohon:
                                  </span>
                                  <span className="font-mono font-bold text-slate-800">{item.nik_masked}</span>
                                </div>
                              </div>

                              {item.keterangan && (
                                <div className="pt-2 border-t border-slate-200/80">
                                  <span className="font-semibold text-slate-400 block text-[10px] uppercase">
                                    Keperluan:
                                  </span>
                                  <span className="italic text-slate-700">{item.keterangan}</span>
                                </div>
                              )}

                              {/* Action Instruction */}
                              {isSelesai && (
                                <div className="mt-3 p-3.5 rounded-xl bg-emerald-100/70 border border-emerald-300 text-emerald-950 font-medium flex items-start gap-2.5">
                                  <Building className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                                  <span className="leading-relaxed">
                                    Surat telah selesai ditandatangani! Silakan datang ke <strong>Kantor Desa Tenjonagara</strong> pada jam kerja operasional (Senin - Jumat, 08:00 - 15:00 WIB) dengan membawa KTP asli untuk pengambilan fisik surat.
                                  </span>
                                </div>
                              )}

                              {isDiproses && (
                                <div className="mt-3 p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-950 font-medium flex items-start gap-2.5">
                                  <Clock className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                                  <span className="leading-relaxed">
                                    Berkas Anda telah lengkap dan saat ini sedang dalam proses pencetakan & penandatanganan oleh pejabat desa terkait.
                                  </span>
                                </div>
                              )}

                              {isPending && (
                                <div className="mt-3 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 font-medium flex items-start gap-2.5">
                                  <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                                  <span className="leading-relaxed">
                                    Permohonan surat telah masuk ke antrean operator desa. Petugas akan segera memverifikasi kelengkapan dokumen yang Anda lampirkan.
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
