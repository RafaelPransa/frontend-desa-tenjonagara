import api from './api';

// Helper for Authorization Header with JWT Token
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : ''
    }
  };
};

// ── UPLOAD GAMBAR ──
export const uploadImage = (file) => {
  const formData = new FormData();
  formData.append('image', file);
  return api.post('/upload', formData, {
    headers: {
      'Content-Type': undefined
    }
  });
};

// ── KELOLA BERITA ──
export const getAdminBerita = (status = null) =>
  api.get('/berita', { params: status ? { status } : {}, ...getAuthHeaders() });

export const getBeritaByIdOrSlug = (idOrSlug) =>
  api.get(`/berita/${idOrSlug}`);

export const createBerita = (data) =>
  api.post('/berita', data, getAuthHeaders());

export const updateBerita = (id, data) =>
  api.put(`/berita/${id}`, data, getAuthHeaders());

export const deleteBerita = (id) =>
  api.delete(`/berita/${id}`, getAuthHeaders());

// ── KELOLA BANGUNAN DESA ──
export const getAdminBangunan = (kategori = null) =>
  api.get('/bangunan-desa', { params: kategori ? { kategori } : {}, ...getAuthHeaders() });

export const getBangunanById = (id) =>
  api.get(`/bangunan-desa/${id}`);

export const createBangunan = (data) =>
  api.post('/bangunan-desa', data, getAuthHeaders());

export const updateBangunan = (id, data) =>
  api.put(`/bangunan-desa/${id}`, data, getAuthHeaders());

export const deleteBangunan = (id) =>
  api.delete(`/bangunan-desa/${id}`, getAuthHeaders());

// ── KELOLA POTENSI DESA ──
export const getAdminPotensi = (kategori = null) =>
  api.get('/potensi-desa', { params: kategori ? { kategori } : {}, ...getAuthHeaders() });

export const getPotensiById = (id) =>
  api.get(`/potensi-desa/${id}`);

export const createPotensi = (data) =>
  api.post('/potensi-desa', data, getAuthHeaders());

export const updatePotensi = (id, data) =>
  api.put(`/potensi-desa/${id}`, data, getAuthHeaders());

export const deletePotensi = (id) =>
  api.delete(`/potensi-desa/${id}`, getAuthHeaders());

// ── KELOLA LAYANAN PUBLIK ──
export const getAdminLayanan = () =>
  api.get('/layanan', getAuthHeaders());

export const getLayananById = (id) =>
  api.get(`/layanan/${id}`);

export const createLayanan = (data) =>
  api.post('/layanan', data, getAuthHeaders());

export const updateLayanan = (id, data) =>
  api.put(`/layanan/${id}`, data, getAuthHeaders());

export const deleteLayanan = (id) =>
  api.delete(`/layanan/${id}`, getAuthHeaders());

// ── KELOLA PERANGKAT DESA ──
export const getAdminPerangkat = () =>
  api.get('/perangkat-desa', getAuthHeaders());

export const getPerangkatById = (id) =>
  api.get(`/perangkat-desa/${id}`);

export const createPerangkat = (data) =>
  api.post('/perangkat-desa', data, getAuthHeaders());

export const updatePerangkat = (id, data) =>
  api.put(`/perangkat-desa/${id}`, data, getAuthHeaders());

export const deletePerangkat = (id) =>
  api.delete(`/perangkat-desa/${id}`, getAuthHeaders());

// ── KELOLA STATISTIK PENDUDUK ──
export const getAdminStatistik = () =>
  api.get('/statistik/penduduk');

export const updateAdminStatistik = (id, data) =>
  api.put(`/statistik/penduduk/${id || 1}`, data, getAuthHeaders());
