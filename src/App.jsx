import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import PrivateRoute from './components/PrivateRoute';
import AdminLayout from './layouts/AdminLayout';
import ScrollToTop from './components/ScrollToTop';

// Public Pages (Lazy Loaded)
const Beranda = lazy(() => import('./pages/Beranda'));
const ProfilDesa = lazy(() => import('./pages/ProfilDesa'));
const BangunanDesa = lazy(() => import('./pages/BangunanDesa'));
const DetailBangunan = lazy(() => import('./pages/DetailBangunan'));
const Berita = lazy(() => import('./pages/Berita'));
const DetailBerita = lazy(() => import('./pages/DetailBerita'));
const PotensiDesa = lazy(() => import('./pages/PotensiDesa'));
const LayananPublik = lazy(() => import('./pages/LayananPublik'));
const Statistik = lazy(() => import('./pages/Statistik'));
const Kontak = lazy(() => import('./pages/Kontak'));
const Login = lazy(() => import('./pages/Login'));

// Admin Pages (Lazy Loaded)
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminBerita = lazy(() => import('./pages/admin/Berita'));
const BeritaForm = lazy(() => import('./pages/admin/BeritaForm'));
const AdminBangunan = lazy(() => import('./pages/admin/Bangunan'));
const BangunanForm = lazy(() => import('./pages/admin/BangunanForm'));
const AdminPotensi = lazy(() => import('./pages/admin/Potensi'));
const PotensiForm = lazy(() => import('./pages/admin/PotensiForm'));
const AdminLayanan = lazy(() => import('./pages/admin/Layanan'));
const LayananForm = lazy(() => import('./pages/admin/LayananForm'));
const AdminPengajuan = lazy(() => import('./pages/admin/Pengajuan'));
const AdminPerangkat = lazy(() => import('./pages/admin/Perangkat'));
const PerangkatForm = lazy(() => import('./pages/admin/PerangkatForm'));
const AdminStatistik = lazy(() => import('./pages/admin/Statistik'));
const AdminKontak = lazy(() => import('./pages/admin/Kontak'));

// Lightweight Loading Component
function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>

          {/* Public Website Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Beranda />} />
            <Route path="/profil" element={<ProfilDesa />} />
            <Route path="/bangunan" element={<BangunanDesa />} />
            <Route path="/bangunan/:id" element={<DetailBangunan />} />
            <Route path="/berita" element={<Berita />} />
            <Route path="/berita/:slug" element={<DetailBerita />} />
            <Route path="/potensi" element={<PotensiDesa />} />
            <Route path="/layanan" element={<LayananPublik />} />
            <Route path="/statistik" element={<Statistik />} />
            <Route path="/kontak" element={<Kontak />} />
            <Route path="/login" element={<Login />} />
          </Route>

          {/* Protected Admin Portal Routes */}
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <AdminLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="berita" element={<AdminBerita />} />
            <Route path="berita/tambah" element={<BeritaForm />} />
            <Route path="berita/:id" element={<BeritaForm />} />

            <Route path="bangunan" element={<AdminBangunan />} />
            <Route path="bangunan/tambah" element={<BangunanForm />} />
            <Route path="bangunan/:id" element={<BangunanForm />} />

            <Route path="potensi" element={<AdminPotensi />} />
            <Route path="potensi/tambah" element={<PotensiForm />} />
            <Route path="potensi/:id" element={<PotensiForm />} />

            <Route path="layanan" element={<AdminLayanan />} />
            <Route path="layanan/tambah" element={<LayananForm />} />
            <Route path="layanan/:id" element={<LayananForm />} />

            <Route path="pengajuan" element={<AdminPengajuan />} />

            <Route path="perangkat" element={<AdminPerangkat />} />
            <Route path="perangkat/tambah" element={<PerangkatForm />} />
            <Route path="perangkat/:id" element={<PerangkatForm />} />

            <Route path="statistik" element={<AdminStatistik />} />
            <Route path="kontak" element={<AdminKontak />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}
