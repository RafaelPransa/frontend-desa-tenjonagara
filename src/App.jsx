import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Beranda from './pages/Beranda';
import ProfilDesa from './pages/ProfilDesa';
import Berita from './pages/Berita';
import PotensiDesa from './pages/PotensiDesa';
import LayananPublik from './pages/LayananPublik';
import Statistik from './pages/Statistik';
import Kontak from './pages/Kontak';
import Login from './pages/Login';

export default function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Beranda />} />
          <Route path="/profil" element={<ProfilDesa />} />
          <Route path="/berita" element={<Berita />} />
          <Route path="/potensi" element={<PotensiDesa />} />
          <Route path="/layanan" element={<LayananPublik />} />
          <Route path="/statistik" element={<Statistik />} />
          <Route path="/kontak" element={<Kontak />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}
