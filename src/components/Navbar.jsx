import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogIn } from 'lucide-react';
import logoPemkab from '../assets/logo-pemkab-tasikmalaya.png';

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
  const isLoginActive = location.pathname === '/login';

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 text-slate-800 transition-all">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src={logoPemkab}
              alt="Logo Pemkab Tasikmalaya"
              className="w-10 h-10 sm:w-11 sm:h-11 object-contain drop-shadow-sm group-hover:scale-105 transition-transform rounded-lg"
            />
            <div>
              <h1 className="font-serif font-bold text-lg sm:text-xl tracking-tight text-primary leading-none">
                DESA TENJONAGARA
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-1">Kec. Cigalontang, Kab. Tasikmalaya</p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1.5 xl:space-x-3">
            {navItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path) && (item.path !== '/' || location.pathname === '/');
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative py-2.5 px-2 text-xs xl:text-sm font-medium transition-colors group flex items-center ${
                    isActive ? 'text-primary font-bold' : 'text-slate-600 hover:text-primary'
                  }`}
                >
                  <span>{item.name}</span>
                  {/* Left-to-Right Animated Underline */}
                  <span
                    className={`absolute bottom-0 left-0 h-[2.5px] bg-primary rounded-full transition-all duration-300 ease-out ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  ></span>
                </Link>
              );
            })}

            {/* Vertical Separator & Standalone Login Button */}
            <div className="h-6 w-px bg-slate-200 ml-3 mr-1 xl:ml-4 xl:mr-2"></div>
            <Link
              to="/login"
              className={`ml-2 xl:ml-3 px-4 py-2 rounded-xl text-xs xl:text-sm font-bold flex items-center gap-1.5 transition-all shadow-sm hover:shadow-md hover:scale-105 active:scale-95 ${
                isLoginActive
                  ? 'bg-primary-dark text-white ring-2 ring-primary/30'
                  : 'bg-primary text-white hover:bg-primary-dark'
              }`}
            >
              <LogIn className="w-4 h-4 text-accent" />
              <span>Login</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-primary hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {isOpen ? <X className="w-6 h-6 text-primary" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <div className="lg:hidden pb-4 pt-2 border-t border-slate-200 bg-white rounded-b-2xl shadow-xl animate-fadeIn">
            <div className="flex flex-col space-y-1 px-2">
              {navItems.map((item) => {
                const isActive = location.pathname.startsWith(item.path) && (item.path !== '/' || location.pathname === '/');
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary/10 text-primary font-bold border border-primary/20'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-primary'
                    }`}
                  >
                    <span>{item.name}</span>
                  </Link>
                );
              })}

              {/* Mobile Distinct Login Button */}
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="mt-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-primary text-white hover:bg-primary-dark text-center flex items-center justify-center gap-2 shadow-md transition-colors"
              >
                <LogIn className="w-4 h-4 text-accent" />
                <span>Login</span>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}



