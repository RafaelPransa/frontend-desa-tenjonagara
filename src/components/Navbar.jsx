import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const navItems = [
  { name: 'Beranda', path: '/' },
  { name: 'Profil Desa', path: '/profil' },
  { name: 'Bangunan Desa', path: '/bangunan' },
  { name: 'Berita', path: '/berita' },
  { name: 'Potensi Desa', path: '/potensi' },
  { name: 'Layanan Publik', path: '/layanan' },
  { name: 'Statistik Penduduk', path: '/statistik' },
  { name: 'Kontak', path: '/kontak' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-primary shadow-lg border-b border-primary-light/30 text-white">
      {/* Topbar Banner */}
      <div className="bg-primary-dark/80 px-4 py-1 text-xs text-center border-b border-white/10 flex justify-between items-center max-w-7xl mx-auto">
        <span className="truncate">Desa Tenjonagara, Kec. Cigalontang, Kab. Tasikmalaya</span>
        <Link to="/login" className="hover:text-accent transition-colors font-medium ml-2">
          <span>Admin Portal</span>
        </Link>
      </div>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-accent text-primary flex items-center justify-center font-bold text-lg sm:text-xl shadow-md group-hover:scale-105 transition-transform">
              DT
            </div>
            <div>
              <h1 className="font-serif font-bold text-lg sm:text-xl tracking-tight text-white leading-none">
                DESA TENJONAGARA
              </h1>
              <p className="text-xs text-emerald-200 mt-1">Kec. Cigalontang, Kab. Tasikmalaya</p>
            </div>
          </Link>

          {/* Desktop Navigation Links (Tanpa Icon) */}
          <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path) && (item.path !== '/' || location.pathname === '/');
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-lg text-xs xl:text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-white/15 text-accent shadow-sm font-semibold border border-white/20'
                      : 'text-emerald-100 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {isOpen ? <X className="w-6 h-6 text-accent" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu (Tanpa Icon) */}
        {isOpen && (
          <div className="lg:hidden pb-4 pt-2 border-t border-white/10 animate-fadeIn">
            <div className="flex flex-col space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname.startsWith(item.path) && (item.path !== '/' || location.pathname === '/');
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-accent text-primary font-bold shadow-md'
                        : 'text-emerald-100 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
