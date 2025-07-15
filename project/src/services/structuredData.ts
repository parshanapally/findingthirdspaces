export interface ThirdSpace {
  id: string;
  name: string;
  description: string;
  category: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  coordinates: { lat: number; lng: number };
  website?: string;
  phone?: string;
  hours?: string;
  amenities: string[];
  images?: string[];
}

export const generateLocalBusinessSchema = (space: ThirdSpace) => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": space.name,
  "description": space.description,
  "address": {
    "@type": "PostalAddress",
    "streetAddress": space.address,
    "addressLocality": space.city,
    "addressRegion": space.state,
    "postalCode": space.zipCode,
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": space.coordinates.lat,
    "longitude": space.coordinates.lng
  },
  "url": space.website,
  "telephone": space.phone,
  "openingHours": space.hours,
  "amenityFeature": space.amenities.map(amenity => ({
    "@type": "LocationFeatureSpecification",
    "name": amenity
  })),
  "image": space.images || [],
  "category": space.category
});

export const generateWebsiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Finding Third Spaces",
  "description": "Discover and explore third spaces in your local community",
  "url": "https://findingthirdspaces.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://findingthirdspaces.com/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  },
  "sameAs": [
    "https://instagram.com/findingthirdspaces",
    "https://facebook.com/findingthirdspaces"
  ]
});

export const generateBreadcrumbSchema = (breadcrumbs: Array<{name: string; url: string}>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": breadcrumbs.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});