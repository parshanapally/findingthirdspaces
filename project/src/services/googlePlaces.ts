import { Loader } from '@googlemaps/js-api-loader';
import { ThirdSpace, SpaceType } from '../types';

const loader = new Loader({
  apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  version: 'weekly',
  libraries: ['places']
});

export const searchNearbyThirdSpaces = async (
  location: { lat: number; lng: number }, 
  radius: number = 5000
): Promise<ThirdSpace[]> => {
  try {
    const google = await loader.load();
    
    const service = new google.maps.places.PlacesService(
      document.createElement('div')
    );

    // Types that qualify as "third spaces"
    const searchTypes = ['library', 'cafe', 'book_store', 'park'];
    const allResults = [];

    for (const type of searchTypes) {
      const results = await searchByType(service, location, type, radius);
      allResults.push(...results);
    }

    // Remove duplicates and format results
    const uniqueResults = removeDuplicates(allResults);
    const sortedResults = uniqueResults.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    return formatResults(sortedResults);
    
  } catch (error) {
    console.error('Error searching places:', error);
    return [];
  }
};

const searchByType = (
  service: google.maps.places.PlacesService, 
  location: { lat: number; lng: number }, 
  type: string, 
  radius: number
): Promise<any[]> => {
  return new Promise((resolve) => {
    const request = {
      location: new google.maps.LatLng(location.lat, location.lng),
      radius: radius,
      type: type
    };

    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        resolve(results || []);
      } else {
        resolve([]);
      }
    });
  });
};

const removeDuplicates = (results: any[]): any[] => {
  const seen = new Set();
  return results.filter(place => {
    if (seen.has(place.place_id)) {
      return false;
    }
    seen.add(place.place_id);
    return true;
  });
};

const formatResults = (results: any[]): ThirdSpace[] => {
  return results.map(place => ({
    id: place.place_id,
    name: place.name,
    type: determineThirdSpaceType(place.types),
    description: `${place.business_status === 'OPERATIONAL' ? 'Open' : 'Check hours'} • ${place.vicinity}`,
    amenities: extractAmenities(place),
    address: place.vicinity || place.formatted_address,
    city: place.vicinity,
    imageUrl: place.photos?.[0] ? 
      place.photos[0].getUrl({ maxWidth: 400, maxHeight: 300 }) : 
      getDefaultImage(place.types),
    rating: place.rating || 4.0,
    coordinates: {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng()
    },
    priceLevel: place.price_level,
    isOpen: place.business_status === 'OPERATIONAL',
    placeId: place.place_id,
    googleReviewsUrl: `https://www.google.com/search?q=${encodeURIComponent(`${place.name} ${place.vicinity} reviews`)}`
  }));
};

const determineThirdSpaceType = (types: string[]): SpaceType => {
  if (types.includes('library')) return 'library';
  if (types.includes('cafe') || types.includes('restaurant')) return 'cafe';
  if (types.includes('book_store')) return 'bookstore';
  if (types.includes('park')) return 'park';
  if (types.includes('coworking_space')) return 'coworking';
  // Additional mappings for Google Places API types
  if (types.includes('museum')) return 'art_gallery';
  if (types.includes('art_gallery')) return 'art_gallery';
  if (types.includes('community_center')) return 'community_center';
  return 'cafe';
};

const extractAmenities = (place: any): string[] => {
  const amenities = [];
  
  if (place.price_level && place.price_level <= 2) amenities.push('Affordable');
  if (place.rating >= 4.0) amenities.push('Highly rated');
  if (place.business_status === 'OPERATIONAL') amenities.push('Currently open');
  
  // Add likely amenities based on type
  if (place.types.includes('cafe') || place.types.includes('restaurant')) {
    amenities.push('Coffee', 'Wi-Fi likely');
  }
  if (place.types.includes('library')) {
    amenities.push('Free Wi-Fi', 'Quiet space');
  }
  if (place.types.includes('park')) {
    amenities.push('Outdoor space', 'Fresh air');
  }
  if (place.types.includes('book_store')) {
    amenities.push('Reading nooks', 'Books');
  }
  
  return amenities.slice(0, 4);
};

const getDefaultImage = (types: string[]): string => {
  if (types.includes('library')) {
    return 'https://images.pexels.com/photos/590493/pexels-photo-590493.jpeg';
  }
  if (types.includes('cafe') || types.includes('restaurant')) {
    return 'https://images.pexels.com/photos/1813466/pexels-photo-1813466.jpeg';
  }
  if (types.includes('park')) {
    return 'https://images.pexels.com/photos/1487010/pexels-photo-1487010.jpeg';
  }
  if (types.includes('book_store')) {
    return 'https://images.pexels.com/photos/5372830/pexels-photo-5372830.jpeg';
  }
  return 'https://images.pexels.com/photos/590493/pexels-photo-590493.jpeg';
};