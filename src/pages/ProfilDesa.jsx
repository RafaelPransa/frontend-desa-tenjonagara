import React, { useEffect, useState } from 'react';
import { TreePine, Map, Landmark, Users, ShieldCheck, Phone, CheckCircle } from 'lucide-react';
import { getProfilDesa, getPerangkatDesa } from '../services/desaService';

export default function ProfilDesa() {
  const [profil, setProfil] = useState(null);
  const [perangkat, setPerangkat] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getProfilDesa().catch(() => ({ data: null })),
      getPerangkatDesa().catch(() => ({ data: [] }))
    ]).then(([resProfil, resPerangkat]) => {
      setProfil(resProfil.data);
      setPerangkat(resPerangkat.data || []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-12 pb-16">
      
      {/* Header Banner */}
      <section className="bg-primary text-white py-14 px-4 sm:px-6 lg:px-8 shadow-inner">
        <div className="max-w-7xl mx-auto text-center space-y-3">
          <span className="text-accent font-semibold text-sm uppercase tracking-widest">Tentang Desa Kami</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold">Profil Desa Tenjonagara</h1>
          <p className="text-emerald-100 max-w-2xl mx-auto text-sm sm:text-base">
            Kecamatan Cigalontang, Kabupaten Tasikmalaya, Provinsi Jawa Barat
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Sejarah Desa */}
        <section className="bg-white rounded-3xl p-8 sm:p-10 shadow-lg border border-slate-200/80">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent/20 text-accent-dark flex items-center justify-center font-bold">
              <Landmark className="w-6 h-6 text-primary" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-primary">Sejarah Desa</h2>
          </div>
          <p className="text-slate-700 leading-relaxed text-base sm:text-lg whitespace-pre-line">
            {profil?.sejarah || 'Desa Tenjonagara merupakan salah satu desa di Kecamatan Cigalontang, Kabupaten Tasikmalaya, Jawa Barat. Berada di kawasan perbukitan yang asri dengan mata pencaharian utama masyarakat di bidang pertanian dan perkebunan. Desa ini berdiri sejak puluhan tahun lalu dengan kearifan lokal yang terjaga erat.'}
          </p>
        </section>

        {/* Visi & Misi */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-primary to-primary-dark text-white rounded-3xl p-8 shadow-xl flex flex-col justify-between">
            <div>
              <span className="text-accent font-bold text-xs uppercase tracking-widest">Arah Pembangunan</span>
              <h3 className="font-serif text-2xl font-bold text-white mt-2 mb-4">Visi Desa</h3>
              <p className="text-emerald-100 leading-relaxed italic text-lg border-l-4 border-accent pl-4">
                "{profil?.visi || 'Terwujudnya Desa Tenjonagara yang Mandiri, Sejahtera, Agamis, dan Berbudaya Berbasis Potensi Pertanian dan Ekonomi Kerakyatan.'}"
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200/80">
            <span className="text-secondary font-bold text-xs uppercase tracking-widest">Langkah Strategis</span>
            <h3 className="font-serif text-2xl font-bold text-primary mt-2 mb-4">Misi Desa</h3>
            <div className="text-slate-700 leading-relaxed text-sm sm:text-base whitespace-pre-line space-y-2">
              {profil?.misi || `1. Meningkatkan kualitas pelayanan publik dan transparansi tata kelola pemerintahan desa.
2. Mengembangkan sarana dan prasarana pertanian serta UMKM desa.
3. Meningkatkan derajat kesehatan dan pendidikan masyarakat desa.
4. Memelihara kelestarian lingkungan hidup dan nilai kearifan lokal Sunda.`}
            </div>
          </div>
        </section>

        {/* Demografi & Luas Wilayah */}
        <section className="bg-surface rounded-3xl p-8 border border-slate-300/60 shadow-md">
          <h2 className="font-serif text-2xl font-bold text-primary mb-6 text-center">Wilayah & Demografi Singkat</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
              <Map className="w-8 h-8 text-secondary mx-auto mb-2" />
              <div className="text-2xl font-bold font-serif text-primary">{profil?.luas_wilayah || '14.52 km²'}</div>
              <div className="text-xs text-slate-500 uppercase mt-1">Luas Wilayah</div>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
              <Landmark className="w-8 h-8 text-secondary mx-auto mb-2" />
              <div className="text-2xl font-bold font-serif text-primary">{profil?.jumlah_dusun || 4}</div>
              <div className="text-xs text-slate-500 uppercase mt-1">Dusun</div>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
              <Users className="w-8 h-8 text-secondary mx-auto mb-2" />
              <div className="text-2xl font-bold font-serif text-primary">{profil?.jumlah_rw || 6}</div>
              <div className="text-xs text-slate-500 uppercase mt-1">Rukun Warga (RW)</div>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
              <ShieldCheck className="w-8 h-8 text-secondary mx-auto mb-2" />
              <div className="text-2xl font-bold font-serif text-primary">{profil?.jumlah_rt || 22}</div>
              <div className="text-xs text-slate-500 uppercase mt-1">Rukun Tetangga (RT)</div>
            </div>
          </div>
        </section>

        {/* Perangkat Desa / Struktur Organisasi */}
        <section className="space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-secondary font-bold text-xs uppercase tracking-widest">Pemerintahan Desa</span>
            <h2 className="font-serif text-3xl font-bold text-primary mt-1">Perangkat Desa Tenjonagara</h2>
            <p className="text-slate-500 text-sm mt-1">Struktur organisasi dan pelayan masyarakat Desa Tenjonagara</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {perangkat.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all border border-slate-200 text-center flex flex-col items-center">
                <div className="w-28 h-28 rounded-full overflow-hidden mb-4 border-4 border-accent/40 shadow-inner">
                  <img src={item.foto_url} alt={item.nama} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-bold text-lg text-slate-800">{item.nama}</h3>
                <p className="text-primary font-semibold text-xs mt-1 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  {item.jabatan}
                </p>
                {item.no_hp && (
                  <p className="text-slate-500 text-xs mt-3 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-accent" />
                    <span>{item.no_hp}</span>
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
