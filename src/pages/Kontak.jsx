import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { sendPesanKontak } from '../services/desaService';

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
    <div className="space-y-12 pb-16">
      {/* Header */}
      <section className="bg-primary text-white py-14 px-4 sm:px-6 lg:px-8 shadow-inner">
        <div className="max-w-7xl mx-auto text-center space-y-3">
          <span className="text-accent font-semibold text-sm uppercase tracking-widest">Hubungi Kami</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold">Kontak & Layanan Pengaduan</h1>
          <p className="text-emerald-100 max-w-2xl mx-auto text-sm sm:text-base">
            Silakan kirimkan pertanyaan, saran, atau masukan Anda kepada Pemerintah Desa Tenjonagara.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Info Side */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200 space-y-6">
              <h2 className="font-serif text-2xl font-bold text-primary">Informasi Kantor Desa</h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Kantor Desa Tenjonagara terbuka melayani warga sesuai jam kerja operasional.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/20 text-accent-dark flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">Alamat Alun-Alun Desa</h3>
                    <p className="text-slate-600 text-xs mt-0.5">
                      Jl. Raya Cigalontang No. 1, Desa Tenjonagara, Kec. Cigalontang, Kab. Tasikmalaya, Jawa Barat 46463
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/20 text-accent-dark flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">Telepon / WhatsApp</h3>
                    <p className="text-slate-600 text-xs mt-0.5">(0265) 7520123 / 0812-3456-7890</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/20 text-accent-dark flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">Email Resmi</h3>
                    <p className="text-slate-600 text-xs mt-0.5">pemdes@tenjonagara.desa.id</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-200 space-y-6">
              <div>
                <h2 className="font-serif text-2xl font-bold text-primary">Kirim Pesan / Pengaduan</h2>
                <p className="text-slate-500 text-sm mt-1">Tim kami akan merespons pesan Anda dalam kurun waktu 1x24 jam kerja.</p>
              </div>

              {statusMsg && (
                <div className={`p-4 rounded-xl text-sm flex items-start gap-3 ${
                  statusMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' : 'bg-rose-50 text-rose-800 border border-rose-300'
                }`}>
                  {statusMsg.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" /> : <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />}
                  <span>{statusMsg.text}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nama Anda</label>
                    <input
                      type="text"
                      name="nama"
                      placeholder="Nama Lengkap"
                      value={formData.nama}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email / No. HP</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="email@contoh.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Subjek Pesan</label>
                  <input
                    type="text"
                    name="subjek"
                    placeholder="Subjek pengaduan / pertanyaan..."
                    value={formData.subjek}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Isi Pesan</label>
                  <textarea
                    name="pesan"
                    rows={4}
                    placeholder="Tuliskan pesan lengkap Anda di sini..."
                    value={formData.pesan}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-5 h-5 text-accent" />
                  <span>{isSubmitting ? 'Sending...' : 'Kirim Pesan Sekarang'}</span>
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
