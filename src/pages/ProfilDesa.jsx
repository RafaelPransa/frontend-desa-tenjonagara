import React, { useEffect, useState } from 'react';
import { TreePine, Map, Landmark, Users, ShieldCheck, Phone, CheckCircle, Award, Sparkles } from 'lucide-react';
import { getProfilDesa, getPerangkatDesa } from '../services/desaService';
import ScrollReveal from '../components/ScrollReveal';

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
    <div className="space-y-16 pb-20">
      
      {/* Header Banner */}
      <section className="gradient-hero text-white py-16 px-4 sm:px-6 lg:px-8 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4A017_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="max-w-7xl mx-auto text-center space-y-3 relative z-10">
          <ScrollReveal direction="down" delay={0}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-accent backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-4 h-4 text-accent" />
              Tentang Desa Kami
            </span>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={100}>
            <h1 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight">
              Profil <span className="text-accent">Desa Tenjonagara</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={200}>
            <p className="text-emerald-100 max-w-2xl mx-auto text-sm sm:text-base font-light">
              Kecamatan Cigalontang, Kabupaten Tasikmalaya, Provinsi Jawa Barat
            </p>
          </ScrollReveal>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Sejarah Desa */}
        <section>
          <ScrollReveal direction="up" delay={150}>
            <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-200/80 relative overflow-hidden">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-accent/20 text-primary flex items-center justify-center font-bold shadow-sm">
                  <Landmark className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <span className="text-accent font-bold text-xs uppercase tracking-widest">Asal Usul & Warisan</span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary">Sejarah Desa Tenjonagara</h2>
                </div>
              </div>
              <p className="text-slate-700 leading-relaxed text-base sm:text-lg whitespace-pre-line bg-slate-50/60 p-6 rounded-2xl border border-slate-200/60">
                {profil?.sejarah || 'Desa Tenjonagara merupakan salah satu desa di Kecamatan Cigalontang, Kabupaten Tasikmalaya, Jawa Barat. Berada di kawasan perbukitan yang asri dengan mata pencaharian utama masyarakat di bidang pertanian dan perkebunan. Desa ini berdiri sejak puluhan tahun lalu dengan kearifan lokal yang terjaga erat.'}
              </p>
            </div>
          </ScrollReveal>
        </section>

        {/* Visi & Misi */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ScrollReveal direction="left" delay={100} className="h-full">
            <div className="bg-gradient-to-br from-primary via-primary-dark to-emerald-950 text-white rounded-3xl p-8 sm:p-10 shadow-2xl flex flex-col justify-between h-full relative overflow-hidden border border-white/10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-bl-full pointer-events-none" />
              <div>
                <span className="text-accent font-bold text-xs uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full inline-block">
                  Arah Pembangunan
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-3 mb-5">Visi Desa</h3>
                <p className="text-emerald-100 leading-relaxed italic text-lg sm:text-xl border-l-4 border-accent pl-5 py-2">
                  "{profil?.visi || 'Terwujudnya Desa Tenjonagara yang Mandiri, Sejahtera, Agamis, dan Berbudaya Berbasis Potensi Pertanian dan Ekonomi Kerakyatan.'}"
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={200} className="h-full">
            <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-200/80 h-full flex flex-col justify-between">
              <div>
                <span className="text-accent font-bold text-xs uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full inline-block">
                  Langkah Strategis
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-primary mt-3 mb-5">Misi Desa</h3>
                <div className="text-slate-700 leading-relaxed text-sm sm:text-base whitespace-pre-line space-y-3">
                  {profil?.misi || `1. Meningkatkan kualitas pelayanan publik dan transparansi tata kelola pemerintahan desa.
2. Mengembangkan sarana dan prasarana pertanian serta UMKM desa.
3. Meningkatkan derajat kesehatan dan pendidikan masyarakat desa.
4. Memelihara kelestarian lingkungan hidup dan nilai kearifan lokal Sunda.`}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* Demografi & Luas Wilayah */}
        <section>
          <ScrollReveal direction="up" delay={150}>
            <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-200/80">
              <h2 className="font-serif text-2xl font-bold text-primary mb-8 text-center">Wilayah & Demografi Singkat</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
                <ScrollReveal direction="up" delay={100}>
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all">
                    <Map className="w-8 h-8 text-accent mx-auto mb-2" />
                    <div className="text-2xl font-bold font-serif text-primary">{profil?.luas_wilayah || '14.52 km²'}</div>
                    <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Luas Wilayah</div>
                  </div>
                </ScrollReveal>

                <ScrollReveal direction="up" delay={200}>
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all">
                    <Landmark className="w-8 h-8 text-accent mx-auto mb-2" />
                    <div className="text-2xl font-bold font-serif text-primary">{profil?.jumlah_dusun || 4}</div>
                    <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Dusun</div>
                  </div>
                </ScrollReveal>

                <ScrollReveal direction="up" delay={300}>
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all">
                    <Users className="w-8 h-8 text-accent mx-auto mb-2" />
                    <div className="text-2xl font-bold font-serif text-primary">{profil?.jumlah_rw || 6}</div>
                    <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Rukun Warga (RW)</div>
                  </div>
                </ScrollReveal>

                <ScrollReveal direction="up" delay={400}>
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all">
                    <ShieldCheck className="w-8 h-8 text-accent mx-auto mb-2" />
                    <div className="text-2xl font-bold font-serif text-primary">{profil?.jumlah_rt || 22}</div>
                    <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Rukun Tetangga (RT)</div>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* Perangkat Desa / Struktur Organisasi */}
        <section className="space-y-8">
          <ScrollReveal direction="up" delay={100}>
            <div className="text-center max-w-xl mx-auto">
              <span className="text-accent font-bold text-xs uppercase tracking-widest bg-primary/10 px-3.5 py-1.5 rounded-full inline-block mb-2">
                Pemerintahan Desa
              </span>
              <h2 className="font-serif text-3xl font-bold text-primary">Perangkat Desa Tenjonagara</h2>
              <p className="text-slate-500 text-sm mt-1">Struktur organisasi dan pengabdi masyarakat Desa Tenjonagara</p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {perangkat.map((item, index) => (
              <ScrollReveal key={item.id} direction="up" delay={index * 150}>
                <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 text-center flex flex-col items-center group transform hover:-translate-y-1.5 h-full">
                  <div className="w-28 h-28 rounded-full overflow-hidden mb-4 border-4 border-accent/40 shadow-md group-hover:scale-105 transition-transform duration-300">
                    <img src={item.foto_url} alt={item.nama} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-800 group-hover:text-primary transition-colors">{item.nama}</h3>
                  <p className="text-primary font-bold text-xs mt-2 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    {item.jabatan}
                  </p>
                  {item.no_hp && (
                    <p className="text-slate-500 text-xs mt-4 flex items-center gap-1.5 font-medium">
                      <Phone className="w-3.5 h-3.5 text-accent" />
                      <span>{item.no_hp}</span>
                    </p>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

