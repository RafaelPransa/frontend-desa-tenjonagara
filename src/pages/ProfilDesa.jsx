import React, { useEffect, useState } from 'react';
import { TreePine, Map, Landmark, Users, ShieldCheck, Phone, CheckCircle, Award, Sparkles } from 'lucide-react';
import { getProfilDesa, getPerangkatDesa } from '../services/desaService';
import ScrollReveal from '../components/ScrollReveal';
import SEOHead from '../components/SEOHead';
import petaDesaImg from '../assets/peta-desa.png';

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
      <SEOHead
        title="Profil & Sejarah Desa Tenjonagara"
        description="Mengenal lebih dekat Desa Tenjonagara — sejarah berdirinya desa, visi & misi pembangunan, data demografi wilayah (4 dusun, 6 RW, 22 RT), peta administrasi spasial KKN UNPER 2026, dan struktur perangkat desa."
        url="/profil"
      />

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
                {profil?.sejarah || `Desa Tenjonagara berdiri sekitar tahun 2002 sebagai hasil pemekaran dari desa induk untuk meningkatkan efektivitas pemerintahan dan pelayanan kepada masyarakat. Nama "Tenjonagara" berasal dari bahasa Sunda, yaitu "Tenjo" (melihat) dan "Nagara" (negara), yang melambangkan harapan agar desa ini dikenal dan diperhatikan karena potensi yang dimilikinya.

Sebagai desa dengan wilayah terluas di Kecamatan Cigalontang, Tenjonagara memiliki potensi besar di sektor pertanian dan perkebunan yang menjadi tulang punggung perekonomian masyarakat. Seiring perkembangannya, berbagai program pembangunan dan pemberdayaan masyarakat terus dilakukan, mulai dari peningkatan infrastruktur, pengembangan pertanian, peternakan, hingga ekonomi kreatif berbasis desa.

Kini, Desa Tenjonagara dikenal sebagai desa yang mandiri, aktif, dan progresif, dengan masyarakat yang menjunjung tinggi semangat gotong royong, melestarikan nilai-nilai budaya, serta terbuka terhadap inovasi demi mewujudkan kemajuan yang berkelanjutan.`}
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
                  "{profil?.visi || 'Mewujudkan Desa Tenjonagara yang lebih maju berprestasi, berbudaya dan kreatif melalui peningkatan sumber daya manusia, kemampuan ekonomi dan kepedulian sosial masyarakat dan pemantapan pembangunan di berbagai bidang berlandaskan religius, kultural dan budaya daerah.'}"
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
                  {profil?.misi || `1. Meningkatkan profesionalisme pelayanan publik.
2. Meningkatkan kualitas sumber daya manusia bagi aparatur pemerintah desa.
3. Meningkatkan pembangunan fisik dan nonfisik di berbagai bidang.
4. Meningkatkan ketersediaan dan kualitas insfrastruktur pemerintahan desa.
5. Meningkatkan partisipasi swadaya masyarakat dan sektor swasta dalam kegiatan pembangunan dan kegiatan kemsyarakatan desa.
6. Menggali potensi potensi desa dalam rangka peningkatan pendapatan asli daerah.`}
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
                    <div className="text-2xl font-bold font-serif text-primary">{profil?.luas_wilayah || '490 Hektar'}</div>
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
                    <div className="text-2xl font-bold font-serif text-primary">{profil?.jumlah_rw || 8}</div>
                    <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Rukun Warga (RW)</div>
                  </div>
                </ScrollReveal>

                <ScrollReveal direction="up" delay={400}>
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all">
                    <ShieldCheck className="w-8 h-8 text-accent mx-auto mb-2" />
                    <div className="text-2xl font-bold font-serif text-primary">{profil?.jumlah_rt || 38}</div>
                    <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Rukun Tetangga (RT)</div>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* Peta Administrasi & Geografis Desa Tenjonagara */}
        <section>
          <ScrollReveal direction="up" delay={150}>
            <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200/80 space-y-6 relative overflow-hidden">
              {/* Decorative Glow */}
              <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-100/40 rounded-full blur-3xl -z-10"></div>

              <div className="flex items-center gap-3 border-b border-slate-100 pb-6">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold shadow-sm shrink-0">
                  <Map className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-accent font-bold text-xs uppercase tracking-widest">Peta Tematik & Spasial</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold border border-emerald-200">
                      KKN UNPER 2026
                    </span>
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary mt-0.5">
                    Peta Administrasi Desa Tenjonagara
                  </h2>
                </div>
              </div>

              {/* Map Image Direct Full Display */}
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-slate-900/5">
                <img
                  src={petaDesaImg}
                  alt="Peta Administrasi Desa Tenjonagara KKN UNPER 2026"
                  className="w-full h-auto object-contain rounded-2xl shadow-sm"
                />
              </div>

              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200/70 italic">
                * Peta di atas memuat batas wilayah administrasi, jaringan jalan, dan sebaran fasilitas penting (Sekolah, Pesantren, Kantor Desa, Masjid). Dibuat dan disurvei langsung oleh Tim Mahasiswa KKN Desa Tenjonagara Universitas Perjuangan Tasikmalaya Tahun 2026.
              </p>
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
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

