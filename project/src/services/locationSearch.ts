import { Loader } from '@googlemaps/js-api-loader';
import { ThirdSpace, SpaceType } from '../types';

const loader = new Loader({
  apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  version: 'weekly',
  libraries: ['places'],
});

export const searchThirdSpacesByLocation = async (searchQuery: string): Promise<ThirdSpace[]> => {
  try {
    const google = await loader.load();
    
    const geocoder = new google.maps.Geocoder();
    const placesService = new google.maps.places.PlacesService(
      document.createElement('div')
    );

    // Parse the search query to extract place type and location
    const { placeTypes, location } = parseSearchQuery(searchQuery);
    
    // Geocode the location (works internationally)
    const geocodeResult = await geocodeLocation(geocoder, location);
    if (!geocodeResult) {
      throw new Error(`Could not find location: ${location}`);
    }

    // Search for ALL place types (like Find Near Me)
    const allResults: any[] = [];
    
    for (const placeType of placeTypes) {
      const results = await searchPlacesByType(
        placesService, 
        google, 
        geocodeResult, 
        placeType
      );
      allResults.push(...results);
    }

    if (allResults.length === 0) {
      throw new Error(`No third spaces found in ${location}`);
    }

    // Remove duplicates and sort by rating (SAME AS FIND NEAR ME)
    const uniqueResults = removeDuplicates(allResults);
    const sortedResults = uniqueResults.sort((a, b) => (b.rating || 0) - (a.rating || 0));

    // NO SLICE LIMIT - return all results like Find Near Me
    return formatLocationSearchResults(sortedResults, location);
    
  } catch (error) {
    console.error('Error searching by location:', error);
    throw error;
  }
};

const parseSearchQuery = (query: string) => {
  const lowerQuery = query.toLowerCase();
  
  // Use SAME types as Find Near Me for consistency
  const allThirdSpaceTypes = [
    'library', 
    'cafe', 
    'book_store', 
    'park'
  ];
  
  // Extract place type from the query
  let placeTypes: string[] = [];
  
  if (lowerQuery.includes('library') || lowerQuery.includes('libraries')) {
    placeTypes = ['library'];
  } else if (lowerQuery.includes('cafe') || lowerQuery.includes('coffee') || lowerQuery.includes('cafes')) {
    placeTypes = ['cafe'];
  } else if (lowerQuery.includes('coworking') || lowerQuery.includes('workspace')) {
    placeTypes = ['coworking_space'];
  } else if (lowerQuery.includes('park') || lowerQuery.includes('parks')) {
    placeTypes = ['park'];
  } else if (lowerQuery.includes('bookstore') || lowerQuery.includes('book') || lowerQuery.includes('bookstores')) {
    placeTypes = ['book_store'];
  } else if (lowerQuery.includes('restaurant') || lowerQuery.includes('restaurants')) {
    placeTypes = ['restaurant'];
  } else {
    // NO SPECIFIC TYPE MENTIONED - USE SAME TYPES AS FIND NEAR ME!
    placeTypes = allThirdSpaceTypes;
  }

  // Extract location (everything after "in")
  const inIndex = lowerQuery.indexOf(' in ');
  let location = '';
  
  if (inIndex !== -1) {
    location = query.substring(inIndex + 4).trim();
  } else {
    // If no "in", assume the whole query is a location and search ALL types
    location = query.trim();
    placeTypes = allThirdSpaceTypes; // Use same types as Find Near Me!
  }

  return { placeTypes, location };
};

const geocodeLocation = (geocoder: any, location: string) => {
  return new Promise((resolve) => {
    geocoder.geocode({ 
      address: location,
      componentRestrictions: {} 
    }, (results: any[], status: string) => {
      if (status === 'OK' && results.length > 0) {
        const result = results[0];
        resolve({
          lat: result.geometry.location.lat(),
          lng: result.geometry.location.lng(),
          formattedAddress: result.formatted_address,
          placeId: result.place_id
        });
      } else {
        console.log('Geocoding failed:', status);
        resolve(null);
      }
    });
  });
};

const searchPlacesByType = (service: any, google: any, location: any, type: string): Promise<any[]> => {
  return new Promise((resolve) => {
    const request = {
      location: new google.maps.LatLng(location.lat, location.lng),
      radius: 5000, // SAME AS FIND NEAR ME: 5km radius
      type: type
    };

    service.nearbySearch(request, (results: any[], status: string) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        resolve(results || []);
      } else {
        console.log(`Places search failed for ${type}:`, status);
        resolve([]);
      }
    });
  });
};

// Remove duplicate places (same place_id)
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

const formatLocationSearchResults = (results: any[], searchLocation: string): ThirdSpace[] => {
  // NO SLICE LIMIT - return all results like Find Near Me
  return results.map(place => ({
    id: place.place_id,
    name: place.name,
    type: determineThirdSpaceType(place.types),
    description: `${place.business_status === 'OPERATIONAL' ? 'Open' : 'Check hours'} • ${place.vicinity}`,
    amenities: extractAmenities(place),
    address: place.vicinity || place.formatted_address,
    city: searchLocation,
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
    googleReviewsUrl: `https://www.google.com/search?q=${encodeURIComponent(`${place.name} ${place.vicinity || searchLocation} reviews`)}`
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
  return 'cafe'; // fallback
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
  return 'https://images.pexels.com/photos/590493/pexels-photo-590593.jpeg';
};