import React from 'react';
import { ThirdSpace, spaceTypeLabels } from '../types';

interface StructuredDataProps {
  space: ThirdSpace;
}

const StructuredData: React.FC<StructuredDataProps> = ({ space }) => {
  // Map space types to schema.org types
  const getSchemaType = (spaceType: string): string => {
    const typeMap: Record<string, string> = {
      'cafe': 'CafeOrCoffeeShop',
      'library': 'Library', 
      'coworking': 'LocalBusiness',
      'park': 'Park',
      'community_center': 'CommunityCenter',
      'bookstore': 'BookStore',
      'art_gallery': 'ArtGallery'
    };
    return typeMap[spaceType] || 'LocalBusiness';
  };

  // Generate structured data for the space
  const structuredData = {
    "@context": "https://schema.org",
    "@type": getSchemaType(space.type),
    "name": space.name,
    "description": space.description,
    "image": space.imageUrl,
    "url": `https://findingthirdspaces.com/space/${space.id}`,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": space.address,
      "addressLocality": space.city,
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": space.coordinates.lat,
      "longitude": space.coordinates.lng
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": space.rating,
      "bestRating": 5,
      "worstRating": 1,
      "ratingCount": Math.floor(space.rating * 23) + 12 // Estimated review count
    },
    "amenityFeature": space.amenities.map(amenity => ({
      "@type": "LocationFeatureSpecification",
      "name": amenity,
      "value": true
    })),
    "priceRange": space.type === 'library' || space.type === 'park' ? 'Free' : 
                 space.amenities.includes('Affordable') ? '$' : '$$',
    "telephone": space.type === 'library' ? "+1-555-0123" : undefined, // You can add real phone numbers
    "openingHours": space.hours ? 
      (typeof space.hours === 'string' ? [space.hours] : 
       Object.entries(space.hours).map(([day, hours]) => `${day.slice(0,2).toUpperCase()} ${hours}`)) 
      : undefined,
    "hasMap": `https://www.google.com/maps/search/?api=1&query=${space.coordinates.lat},${space.coordinates.lng}`,
    "sameAs": space.googleReviewsUrl ? [space.googleReviewsUrl] : undefined
  };

  // Remove undefined values
  const cleanedData = JSON.parse(JSON.stringify(structuredData));

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(cleanedData, null, 2)
      }}
    />
  );
};

export default StructuredData;