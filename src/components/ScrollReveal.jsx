import React, { useEffect, useRef, useState } from 'react';

/**
 * ScrollReveal - Komponen pembungkus animasi Scroll Reveal berbasis IntersectionObserver
 * 
 * @param {string} direction - 'up' | 'down' | 'left' | 'right' | 'none'
 * @param {number} delay - Jeda animasi dalam milidetik (contoh: 0, 100, 200)
 * @param {number} duration - Durasi animasi dalam milidetik (default: 600)
 * @param {string} className - Kelas CSS tambahan
 * @param {ReactNode} children - Elemen anak yang dibungkus
 */
export default function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 600,
  className = ''
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  const getInitialTransform = () => {
    switch (direction) {
      case 'up':
        return 'translateY(36px)';
      case 'down':
        return 'translateY(-36px)';
      case 'left':
        return 'translateX(36px)';
      case 'right':
        return 'translateX(-36px)';
      default:
        return 'translateY(0)';
    }
  };

  const style = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translate(0, 0)' : getInitialTransform(),
    transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
    willChange: 'opacity, transform'
  };

  return (
    <div ref={ref} style={style} className={className}>
      {children}
    </div>
  );
}
