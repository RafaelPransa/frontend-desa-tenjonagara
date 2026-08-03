import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Inbox,
  Newspaper,
  Building2,
  Sparkles,
  FileText,
  Users,
  BarChart3,
  MessageSquare,
  LogOut,
  Globe,
  Menu,
  X,
  ShieldCheck,
  User,
  ChevronRight
} from 'lucide-react';
import logoPemkab from '../assets/logo-pemkab-tasikmalaya.png';

const navItems = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
  { name: 'Pengajuan Surat', path: '/admin/pengajuan', icon: Inbox },
  { name: 'Master Layanan', path: '/admin/layanan', icon: FileText },
  { name: 'Kelola Berita', path: '/admin/berita', icon: Newspaper },
  { name: 'Bangunan Desa', path: '/admin/bangunan', icon: Building2 },
  { name: 'Potensi Desa', path: '/admin/potensi', icon: Sparkles },
  { name: 'Perangkat Desa', path: '/admin/perangkat', icon: Users },
  { name: 'Statistik Penduduk', path: '/admin/statistik', icon: BarChart3 },
  { name: 'Pesan Kontak', path: '/admin/kontak', icon: MessageSquare },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error('Failed to parse user session', e);
    }
  }, []);

  const handleLogout = () => {
    if (window.confirm('Apakah Anda yakin ingin keluar dari Admin Panel?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Topbar */}
      <header className="sticky top-0 z-30 bg-primary text-white shadow-md border-b border-white/10">
        <div className="px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg text-emerald-100 hover:bg-white/10 focus:outline-none"
              aria-label="Toggle menu"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <Link to="/admin" className="flex items-center gap-3 group">
              <img
                src={logoPemkab}
                alt="Logo Pemkab Tasikmalaya"
                className="w-9 h-9 object-contain drop-shadow-md group-hover:scale-105 transition-transform"
              />
              <div className="hidden sm:block">
                <div className="font-serif font-bold text-base leading-tight tracking-wide text-white">
                  Desa Tenjonagara
                </div>
                <div className="text-[11px] font-semibold tracking-wider text-accent uppercase flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-accent" />
                  <span>Admin Control Center</span>
                </div>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs sm:text-sm font-medium text-emerald-100 hover:text-white transition-all flex items-center gap-1.5 border border-white/10"
              title="Buka Website Publik di Tab Baru"
            >
              <Globe className="w-4 h-4 text-accent" />
              <span className="hidden sm:inline">Lihat Website</span>
            </Link>

            <div className="h-6 w-px bg-white/20 hidden sm:block"></div>

            <div className="flex items-center gap-2.5 bg-white/15 px-3 py-1.5 rounded-xl border border-white/10">
              <div className="w-8 h-8 rounded-lg bg-accent text-primary flex items-center justify-center font-bold text-sm shadow-sm">
                <User className="w-4 h-4 text-primary" />
              </div>
              <div className="hidden md:block text-left">
                <div className="text-xs font-bold leading-tight text-white">{user?.nama || 'Administrator'}</div>
                <div className="text-[10px] text-emerald-200">{user?.email || 'admin@tenjonagara.desa.id'}</div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-rose-600/90 hover:bg-rose-600 text-white text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 shadow-sm hover:shadow"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Mobile Backdrop */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/50 z-20 lg:hidden backdrop-blur-xs"
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-20 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out transform ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Navigasi Panel</span>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-primary">v1.0</span>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = item.exact
                ? location.pathname === item.path
                : location.pathname.startsWith(item.path);

              const Icon = item.icon;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-primary text-white font-bold shadow-md shadow-primary/20'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-accent' : 'text-slate-400'}`} />
                    <span>{item.name}</span>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 text-accent" />}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-100 bg-slate-50/50 text-center">
            <p className="text-[11px] text-slate-400 font-medium">PEMDES Tenjonagara &copy; 2026</p>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
