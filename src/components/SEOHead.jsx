import React from 'react';
import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'Desa Tenjonagara';
const DEFAULT_TITLE = 'Website Resmi Profil Desa Tenjonagara | Kec. Cigalontang, Kab. Tasikmalaya';
const DEFAULT_DESCRIPTION = 'Website resmi Desa Tenjonagara, Kecamatan Cigalontang, Kabupaten Tasikmalaya. Portal berita, informasi profil desa, statistik penduduk, potensi desa, dan pelayanan publik online.';
const DEFAULT_IMAGE = '/og-image.jpg';
const FALLBACK_ORIGIN = 'https://tenjonagara.id';

export default function SEOHead({
  title,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  url = '',
  type = 'website',
  noIndex = false,
}) {
  const fullTitle = title 
    ? (title.toLowerCase().includes('desa tenjonagara') ? title : `${title} | Desa Tenjonagara`)
    : DEFAULT_TITLE;

  // Resolve absolute URL
  const baseUrl = typeof window !== 'undefined' && window.location?.origin ? window.location.origin : FALLBACK_ORIGIN;
  const canonicalUrl = url.startsWith('http') ? url : `${baseUrl}${url.startsWith('/') ? url : `/${url}`}`;
  const fullImageUrl = image?.startsWith('http') ? image : `${baseUrl}${image?.startsWith('/') ? image : `/${image}`}`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook / WhatsApp */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:locale" content="id_ID" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
    </Helmet>
  );
}
