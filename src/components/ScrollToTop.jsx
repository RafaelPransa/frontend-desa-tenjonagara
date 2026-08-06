import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Komponen pembantu untuk otomatis mereset posisi scroll ke paling atas (top: 0)
 * setiap kali pengguna berpindah halaman / rute di React Router.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' // Reset seketika saat navigasi rute
    });
  }, [pathname]);

  return null;
}
