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
    return formatResults(uniqueResults);
    
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
    description: `A ${place.types[0].replace(/_/g, ' ')} in ${place.vicinity}`,
    amenities: extractAmenities(place),
    address: place.vicinity,
    city: place.vicinity,
    imageUrl: place.photos?.[0] ? 
      place.photos[0].getUrl({ maxWidth: 400 }) : 
      'https://images.pexels.com/photos/590493/pexels-photo-590493.jpeg',
    rating: place.rating || 4.0,
    coordinates: {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng()
    },
    // Add this line to your return object:
    googleReviewsUrl: `https://www.google.com/search?q=${encodeURIComponent(`${place.name} ${place.vicinity} reviews`)}`
  }));
};

const determineThirdSpaceType = (types: string[]): SpaceType => {
  if (types.includes('library')) return 'library';
  if (types.includes('cafe') || types.includes('restaurant')) return 'cafe';
  if (types.includes('book_store')) return 'bookstore';
  if (types.includes('park')) return 'park';
  return 'cafe';
};

const extractAmenities = (place: any): string[] => {
  const amenities = [];
  if (place.price_level <= 2) amenities.push('Affordable');
  if (place.rating >= 4.0) amenities.push('Highly rated');
  amenities.push('Real location');
  return amenities;
};