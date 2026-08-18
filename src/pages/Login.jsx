import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, Key, AlertCircle } from 'lucide-react';
import { loginAdmin } from '../services/desaService';
import SEOHead from '../components/SEOHead';

export default function Login() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/admin', { replace: true });
    }
  }, [navigate]);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await loginAdmin(credentials);
      if (res.success && res.data?.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        const redirectPath = location.state?.from?.pathname || '/admin';
        navigate(redirectPath, { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Login gagal. Periksa email & password.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <SEOHead
        title="Login Portal Administrator"
        description="Portal otentikasi petugas dan administrator website resmi Desa Tenjonagara."
        url="/login"
        noIndex={true}
      />
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-200 space-y-6">

        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-primary text-accent flex items-center justify-center mx-auto shadow-lg">
            <Lock className="w-7 h-7 text-accent" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-primary">Portal Admin Desa</h1>
          <p className="text-slate-500 text-xs sm:text-sm">Silakan login untuk mengelola berita & data desa</p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Email Admin</label>
            <div className="relative">
              <input
                type="email"
                name="email"
                placeholder="Masukkan email anda"
                value={credentials.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary text-sm"
                required
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Password</label>
            <div className="relative">
              <input
                type="password"
                name="password"
                placeholder="Masukkan password anda"
                value={credentials.password}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary text-sm"
                required
              />
              <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{loading ? 'Memproses Authentikasi...' : 'Masuk ke Admin Panel'}</span>
          </button>
        </form>

      </div>
    </div>
  );
}
