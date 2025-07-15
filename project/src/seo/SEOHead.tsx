import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'place';
  structuredData?: object;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = 'Finding Third Spaces - Discover Community Spaces Near You',
  description = 'Find and explore third spaces like cafés, libraries, coworking spaces, and community centers where people gather, work, and connect in your local area.',
  keywords = 'third spaces, cafes, libraries, coworking spaces, community centers, local spaces, social spaces, work spaces',
  image = '/og-image.jpg',
  url = 'https://findingthirdspaces.com',
  type = 'website',
  structuredData
}) => {
  const fullTitle = title.includes('Finding Third Spaces') ? title : `${title} | Finding Third Spaces`;
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Finding Third Spaces" />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Finding Third Spaces" />
      <meta property="og:locale" content="en_US" />
      
      {/* Instagram/Social Media Meta Tags */}
      <meta property="instagram:card" content="summary_large_image" />
      <meta property="instagram:title" content={fullTitle} />
      <meta property="instagram:description" content={description} />
      <meta property="instagram:image" content={image} />
      
      {/* Additional SEO Meta Tags */}
      <meta name="theme-color" content="#2563eb" />
      <meta name="msapplication-TileColor" content="#2563eb" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;