import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { sendPesanKontak } from '../services/desaService';
import ScrollReveal from '../components/ScrollReveal';
import SEOHead from '../components/SEOHead';

export default function Kontak() {
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    subjek: '',
    pesan: ''
  });

  const [statusMsg, setStatusMsg] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg(null);

    if (!formData.nama || !formData.email || !formData.subjek || !formData.pesan) {
      setStatusMsg({ type: 'error', text: 'Mohon isi seluruh bidang form kontak.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await sendPesanKontak(formData);
      if (res.success) {
        setStatusMsg({ type: 'success', text: 'Pesan Anda telah dikirim ke perangkat desa. Terima kasih!' });
        setFormData({ nama: '', email: '', subjek: '', pesan: '' });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Gagal mengirim pesan.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-16 pb-20">
      <SEOHead
        title="Kontak & Pengaduan Warga Desa Tenjonagara"
        description="Hubungi Pemerintah Desa Tenjonagara melalui formulir pesan & aspirasi online, nomor telepon/WhatsApp resmi, email, atau datang langsung ke Kantor Desa di Jl. Raya Cigalontang No. 1, Kab. Tasikmalaya."
        url="/kontak"
      />

      {/* Header */}
      <section className="gradient-hero text-white py-16 px-4 sm:px-6 lg:px-8 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4A017_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="max-w-7xl mx-auto text-center space-y-3 relative z-10">
          <ScrollReveal direction="down" delay={0}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-accent backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-4 h-4 text-accent" />
              Hubungi Kami
            </span>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={100}>
            <h1 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight">
              Kontak & Layanan <span className="text-accent">Pengaduan Warga</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={200}>
            <p className="text-emerald-100 max-w-2xl mx-auto text-sm sm:text-base font-light">
              Silakan kirimkan pertanyaan, saran, atau masukan Anda kepada Pemerintah Desa Tenjonagara.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Info Side */}
          <div className="lg:col-span-5 space-y-6">
            <ScrollReveal direction="left" delay={100}>
              <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-200/80 space-y-6">
                <h2 className="font-serif text-2xl font-bold text-primary">Informasi Kantor Desa</h2>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Kantor Desa Tenjonagara terbuka melayani warga sesuai jam kerja operasional.
                </p>

                <div className="space-y-5 pt-2">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-2xl bg-accent/20 text-primary flex items-center justify-center shrink-0 shadow-sm">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm">Alamat Alun-Alun Desa</h3>
                      <p className="text-slate-600 text-xs mt-0.5 leading-relaxed">
                        Jl. Raya Cigalontang No. 1, Desa Tenjonagara, Kec. Cigalontang, Kab. Tasikmalaya, Jawa Barat 46463
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-2xl bg-accent/20 text-primary flex items-center justify-center shrink-0 shadow-sm">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm">Telepon / WhatsApp</h3>
                      <p className="text-slate-600 text-xs mt-0.5 font-mono">(0265) 7520123 / 0812-3456-7890</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-2xl bg-accent/20 text-primary flex items-center justify-center shrink-0 shadow-sm">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm">Email Resmi</h3>
                      <p className="text-slate-600 text-xs mt-0.5 font-mono">pemdes@tenjonagara.id</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-7">
            <ScrollReveal direction="right" delay={200}>
              <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-200/80 space-y-6">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-primary">Kirim Pesan / Pengaduan</h2>
                  <p className="text-slate-500 text-sm mt-1">Tim kami akan merespons pesan Anda dalam kurun waktu 1x24 jam kerja.</p>
                </div>

                {statusMsg && (
                  <div className={`p-4 rounded-2xl text-sm flex items-start gap-3 shadow-md animate-in fade-in duration-200 ${
                    statusMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' : 'bg-rose-50 text-rose-800 border border-rose-300'
                  }`}>
                    {statusMsg.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" /> : <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />}
                    <span>{statusMsg.text}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Nama Anda</label>
                      <input
                        type="text"
                        name="nama"
                        placeholder="Nama Lengkap"
                        value={formData.nama}
                        onChange={handleChange}
                        className="w-full px-4 py-3.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent text-sm bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Email / No. HP</label>
                      <input
                        type="email"
                        name="email"
                        placeholder="email@contoh.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent text-sm bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Subjek Pesan</label>
                    <input
                      type="text"
                      name="subjek"
                      placeholder="Subjek pengaduan / pertanyaan..."
                      value={formData.subjek}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent text-sm bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Isi Pesan</label>
                    <textarea
                      name="pesan"
                      rows={4}
                      placeholder="Tuliskan pesan lengkap Anda di sini..."
                      value={formData.pesan}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent text-sm bg-white"
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 disabled:opacity-50"
                  >
                    <Send className="w-5 h-5 text-accent" />
                    <span>{isSubmitting ? 'Mengirim Pesan...' : 'Kirim Pesan Sekarang'}</span>
                  </button>
                </form>
              </div>
            </ScrollReveal>
          </div>

        </div>
      </div>
    </div>
  );
}

