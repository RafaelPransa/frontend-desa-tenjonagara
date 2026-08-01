import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, TreePine, Activity } from 'lucide-react';
import { checkHealth } from '../services/desaService';

export default function Footer() {
  const [apiStatus, setApiStatus] = useState({ online: false, message: 'Memeriksa koneksi server...' });

  useEffect(() => {
    checkHealth()
      .then((res) => {
        if (res.success) {
          setApiStatus({ online: true, message: 'Server API Connected' });
        }
      })
      .catch(() => {
        setApiStatus({ online: false, message: 'Server API Offline (Mode Lokal)' });
      });
  }, []);

  return (
    <footer className="bg-[#1A1C1A] text-slate-300 mt-auto border-t-4 border-accent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          
          {/* Col 1: Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent text-primary flex items-center justify-center font-bold">
                <TreePine className="w-6 h-6 text-primary-dark" />
              </div>
              <h2 className="font-serif font-bold text-lg text-white">Desa Tenjonagara</h2>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Website resmi Pemerintah Desa Tenjonagara, Kecamatan Cigalontang, Kabupaten Tasikmalaya. Pusat transparansi informasi dan layanan publik warga desa.
            </p>
            {/* Live API Health indicator */}
            <div className="flex items-center gap-2 pt-2">
              <span className={`w-2.5 h-2.5 rounded-full ${apiStatus.online ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
              <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                <Activity className="w-3 h-3 text-accent" />
                {apiStatus.message}
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4 border-b border-slate-700 pb-2">Tautan Cepat</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-accent transition-colors">Beranda Utama</Link></li>
              <li><Link to="/profil" className="hover:text-accent transition-colors">Profil & Sejarah Desa</Link></li>
              <li><Link to="/bangunan" className="hover:text-accent transition-colors">Bangunan & Fasilitas Desa</Link></li>
              <li><Link to="/berita" className="hover:text-accent transition-colors">Kabar & Berita Desa</Link></li>
              <li><Link to="/potensi" className="hover:text-accent transition-colors">Potensi Pertanian & Wisata</Link></li>
              <li><Link to="/layanan" className="hover:text-accent transition-colors">Pengajuan Layanan Surat</Link></li>
              <li><Link to="/statistik" className="hover:text-accent transition-colors">Statistik Penduduk Desa</Link></li>
            </ul>
          </div>

          {/* Col 3: Operational Hours */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4 border-b border-slate-700 pb-2">Jam Pelayanan Kantor</h3>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Senin - Kamis</p>
                  <p className="text-slate-400 text-xs">08:00 - 15:00 WIB</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Jumat</p>
                  <p className="text-slate-400 text-xs">08:00 - 11:30 WIB</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-slate-400">Sabtu - Minggu & Libur Nasional</p>
                  <p className="text-emerald-400 text-xs font-medium">Tutup (Layanan Online Aktif)</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact Info */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4 border-b border-slate-700 pb-2">Kantor Desa</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <span>Jl. Raya Cigalontang No. 1, Desa Tenjonagara, Kec. Cigalontang, Kab. Tasikmalaya, Jawa Barat 46463</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-accent shrink-0" />
                <span>(0265) 7520123</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-accent shrink-0" />
                <span>pemdes@tenjonagara.desa.id</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 Pemerintah Desa Tenjonagara. Seluruh Hak Cipta Dilindungi.</p>
          <p className="text-slate-400">Dikembangkan untuk Program KKN & Pengabdian Masyarakat.</p>
        </div>
      </div>
    </footer>
  );
}
