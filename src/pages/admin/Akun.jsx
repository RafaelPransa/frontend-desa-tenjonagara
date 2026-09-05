import React, { useState, useEffect } from 'react';
import {
  KeyRound,
  ShieldCheck,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  Sparkles,
  Info,
  Check,
  X
} from 'lucide-react';
import {
  getAdminMe,
  changeAdminPassword,
  updateAdminProfile
} from '../../services/adminService';
import ScrollReveal from '../../components/ScrollReveal';

export default function AdminAkun() {
  // Profile State
  const [profile, setProfile] = useState({
    id: null,
    nama: '',
    email: '',
    role: 'admin'
  });
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(null);
  const [profileError, setProfileError] = useState(null);

  // Password State
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  const fetchProfile = async () => {
    setLoadingProfile(true);
    setProfileError(null);
    try {
      // First try from localStorage
      const cachedUser = localStorage.getItem('user');
      if (cachedUser) {
        try {
          const parsed = JSON.parse(cachedUser);
          setProfile({
            id: parsed.id || 1,
            nama: parsed.nama || '',
            email: parsed.email || '',
            role: parsed.role || 'admin'
          });
        } catch (e) {
          // ignore
        }
      }

      // Then fetch fresh data from server
      const res = await getAdminMe();
      const userData = res.data?.data || res.data;
      if (userData) {
        setProfile({
          id: userData.id || 1,
          nama: userData.nama || '',
          email: userData.email || '',
          role: userData.role || 'admin'
        });
        localStorage.setItem('user', JSON.stringify(userData));
      }
    } catch (err) {
      // Handled silently with cached fallback
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // ── UPDATE PROFIL HANDLER ──
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileSuccess(null);
    setProfileError(null);

    if (!profile.nama.trim()) {
      setProfileError('Nama lengkap operator wajib diisi.');
      setSavingProfile(false);
      return;
    }
    if (!profile.email.trim()) {
      setProfileError('Email login wajib diisi.');
      setSavingProfile(false);
      return;
    }

    try {
      const res = await updateAdminProfile({
        nama: profile.nama.trim(),
        email: profile.email.trim()
      });
      const updatedUser = res.data?.data || res.data;
      if (updatedUser) {
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setProfile((prev) => ({
          ...prev,
          nama: updatedUser.nama,
          email: updatedUser.email
        }));
      }
      setProfileSuccess('Profil akun administrator berhasil diperbarui.');
      setTimeout(() => setProfileSuccess(null), 4000);
    } catch (err) {
      setProfileError(
        err.response?.data?.message || err.message || 'Gagal memperbarui profil pengguna.'
      );
    } finally {
      setSavingProfile(false);
    }
  };

  // ── GANTI PASSWORD HANDLER ──
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setSavingPassword(true);
    setPasswordSuccess(null);
    setPasswordError(null);

    const { current_password, new_password, confirm_password } = passwordData;

    if (!current_password) {
      setPasswordError('Password saat ini wajib diisi.');
      setSavingPassword(false);
      return;
    }
    if (!new_password) {
      setPasswordError('Password baru wajib diisi.');
      setSavingPassword(false);
      return;
    }
    if (new_password.length < 6) {
      setPasswordError('Password baru minimal harus terdiri dari 6 karakter.');
      setSavingPassword(false);
      return;
    }
    if (new_password !== confirm_password) {
      setPasswordError('Konfirmasi password tidak cocok dengan password baru.');
      setSavingPassword(false);
      return;
    }
    if (current_password === new_password) {
      setPasswordError('Password baru tidak boleh sama dengan password saat ini.');
      setSavingPassword(false);
      return;
    }

    try {
      await changeAdminPassword({
        current_password,
        new_password
      });
      setPasswordSuccess(
        'Kata sandi administrator berhasil diperbarui! Gunakan password baru ini untuk login berikutnya.'
      );
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
      setTimeout(() => setPasswordSuccess(null), 5000);
    } catch (err) {
      setPasswordError(
        err.response?.data?.message || err.message || 'Gagal mengubah kata sandi.'
      );
    } finally {
      setSavingPassword(false);
    }
  };

  // Password Validation Checkers
  const isLengthValid = passwordData.new_password.length >= 6;
  const isMatch =
    passwordData.new_password &&
    passwordData.confirm_password &&
    passwordData.new_password === passwordData.confirm_password;
  const hasNumber = /\d/.test(passwordData.new_password);
  const hasLetter = /[a-zA-Z]/.test(passwordData.new_password);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header Banner */}
      <ScrollReveal direction="down" delay={0}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shadow-xs shrink-0">
              <KeyRound className="w-6 h-6 text-emerald-700" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
                Pengaturan Akun & Keamanan
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Kelola identitas operator dan perbarui kata sandi login panel kontrol desa
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200/80 self-start sm:self-center">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Hak Akses: Administrator</span>
          </div>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ══════════════════════════════════════════════════════════
            KOLOM KIRI: FORM GANTI PASSWORD (UTAMA)
        ══════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-7 space-y-6">
          <ScrollReveal direction="up" delay={100}>
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Ubah Kata Sandi (Password)</h2>
                  <p className="text-xs text-slate-500">Gunakan kombinasi yang kuat untuk menjaga keamanan akun</p>
                </div>
              </div>

              {/* Alerts */}
              {passwordError && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center gap-3 animate-in fade-in duration-200">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              {passwordSuccess && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-3 animate-in fade-in duration-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{passwordSuccess}</span>
                </div>
              )}

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                {/* 1. Password Saat Ini */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Kata Sandi Saat Ini <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      placeholder="Masukkan kata sandi lama Anda"
                      value={passwordData.current_password}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, current_password: e.target.value })
                      }
                      className="w-full pl-10 pr-11 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-primary"
                      required
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="p-2 text-slate-400 hover:text-slate-600 absolute right-2 top-2 rounded-lg transition-colors"
                      title={showCurrentPassword ? 'Sembunyikan' : 'Tampilkan'}
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* 2. Password Baru */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Kata Sandi Baru <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      placeholder="Minimal 6 karakter kombinasi"
                      value={passwordData.new_password}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, new_password: e.target.value })
                      }
                      className="w-full pl-10 pr-11 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-primary"
                      required
                    />
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="p-2 text-slate-400 hover:text-slate-600 absolute right-2 top-2 rounded-lg transition-colors"
                      title={showNewPassword ? 'Sembunyikan' : 'Tampilkan'}
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Syarat Keamanan Checklist */}
                {passwordData.new_password && (
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-[11px] space-y-1.5 animate-in fade-in duration-200">
                    <span className="font-bold text-slate-600 block">Kriteria Keamanan Kata Sandi:</span>
                    <div className="flex items-center gap-2">
                      {isLengthValid ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600 font-bold" />
                      ) : (
                        <X className="w-3.5 h-3.5 text-rose-500" />
                      )}
                      <span className={isLengthValid ? 'text-emerald-800 font-semibold' : 'text-slate-500'}>
                        Minimal 6 karakter (saat ini: {passwordData.new_password.length} karakter)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {hasLetter && hasNumber ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600 font-bold" />
                      ) : (
                        <Info className="w-3.5 h-3.5 text-amber-500" />
                      )}
                      <span className={hasLetter && hasNumber ? 'text-emerald-800 font-semibold' : 'text-slate-500'}>
                        Disarankan memuat perpaduan huruf dan angka
                      </span>
                    </div>
                  </div>
                )}

                {/* 3. Konfirmasi Password Baru */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Ulangi Kata Sandi Baru <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Ketik ulang kata sandi baru"
                      value={passwordData.confirm_password}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, confirm_password: e.target.value })
                      }
                      className="w-full pl-10 pr-11 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-primary"
                      required
                    />
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="p-2 text-slate-400 hover:text-slate-600 absolute right-2 top-2 rounded-lg transition-colors"
                      title={showConfirmPassword ? 'Sembunyikan' : 'Tampilkan'}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {passwordData.confirm_password && (
                    <div className="pt-1">
                      {isMatch ? (
                        <span className="text-emerald-600 text-xs font-semibold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Konfirmasi kata sandi cocok
                        </span>
                      ) : (
                        <span className="text-rose-500 text-xs font-semibold flex items-center gap-1">
                          <X className="w-3.5 h-3.5" /> Konfirmasi kata sandi belum sama
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-3 border-t border-slate-100 flex justify-end">
                  <button
                    type="submit"
                    disabled={savingPassword}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {savingPassword ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Memperbarui Sandi...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Simpan Kata Sandi Baru</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </ScrollReveal>
        </div>

        {/* ══════════════════════════════════════════════════════════
            KOLOM KANAN: INFORMASI PROFIL & PANDUAN
        ══════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card 1: Profil Operator */}
          <ScrollReveal direction="up" delay={200}>
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Identitas Operator</h2>
                  <p className="text-xs text-slate-500">Nama dan email akun yang aktif</p>
                </div>
              </div>

              {/* Alerts */}
              {profileError && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{profileError}</span>
                </div>
              )}

              {profileSuccess && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{profileSuccess}</span>
                </div>
              )}

              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Nama Operator <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Nama lengkap operator"
                      value={profile.nama}
                      onChange={(e) => setProfile({ ...profile, nama: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-primary"
                      required
                    />
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Email Login <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="email@tenjonagara.id"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-primary"
                      required
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Tingkat Wewenang (Role)
                  </label>
                  <div className="w-full px-4 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs sm:text-sm font-bold text-slate-700">
                    Administrator Desa Tenjonagara
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    {savingProfile ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Menyimpan Profil...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        <span>Simpan Perubahan Profil</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </ScrollReveal>

          {/* Card 2: Panduan Keamanan */}
          <ScrollReveal direction="up" delay={300}>
            <div className="p-6 rounded-3xl bg-amber-50/60 border border-amber-200/80 text-slate-700 space-y-3">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs sm:text-sm">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Tips Keamanan Akun Desa</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside leading-relaxed">
                <li>Jangan pernah membagikan kata sandi kepada orang lain di luar perangkat resmi desa.</li>
                <li>Lakukan penggantian kata sandi secara berkala setelah pergantian periode kepengurusan.</li>
                <li>Pastikan selalu menekan tombol <strong>Keluar</strong> setelah selesai bertugas di komputer umum.</li>
              </ul>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
