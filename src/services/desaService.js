import api from './api';

export const checkHealth = () => api.get('/health');

export const getProfilDesa = () => api.get('/profil-desa');
export const getPerangkatDesa = () => api.get('/perangkat-desa');

export const getBerita = (status) => api.get('/berita', { params: { status } });
export const getBeritaBySlug = (slug) => api.get(`/berita/${slug}`);

export const getPotensiDesa = (kategori) => api.get('/potensi-desa', { params: { kategori } });

export const getBangunanDesa = (kategori) => api.get('/bangunan-desa', { params: { kategori } });
export const getBangunanDesaById = (id) => api.get(`/bangunan-desa/${id}`);

export const getLayanan = () => api.get('/layanan');
export const submitPengajuanLayanan = (data) => api.post('/layanan/pengajuan', data);

export const uploadDokumenPublik = (file) => {
  const formData = new FormData();
  formData.append('dokumen', file);
  return api.post('/upload/public', formData, {
    headers: { 'Content-Type': undefined }
  });
};


export const getStatistikPenduduk = () => api.get('/statistik/penduduk');
export const getApbdes = () => api.get('/statistik/apbdes');

export const sendPesanKontak = (data) => api.post('/kontak', data);

export const loginAdmin = (credentials) => api.post('/auth/login', credentials);
export const getMe = () => api.get('/auth/me');
