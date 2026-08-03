import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import PrivateRoute from './components/PrivateRoute';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import Beranda from './pages/Beranda';
import ProfilDesa from './pages/ProfilDesa';
import BangunanDesa from './pages/BangunanDesa';
import DetailBangunan from './pages/DetailBangunan';
import Berita from './pages/Berita';
import DetailBerita from './pages/DetailBerita';
import PotensiDesa from './pages/PotensiDesa';
import LayananPublik from './pages/LayananPublik';
import Statistik from './pages/Statistik';
import Kontak from './pages/Kontak';
import Login from './pages/Login';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminBerita from './pages/admin/Berita';
import BeritaForm from './pages/admin/BeritaForm';
import AdminBangunan from './pages/admin/Bangunan';
import BangunanForm from './pages/admin/BangunanForm';
import AdminPotensi from './pages/admin/Potensi';
import PotensiForm from './pages/admin/PotensiForm';

export default function App() {
  return (
    <Router>
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
        </Route>
      </Routes>
    </Router>
  );
}
