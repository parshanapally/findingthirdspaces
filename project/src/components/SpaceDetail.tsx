import React, { useEffect } from 'react';
import { ThirdSpace, spaceTypeLabels } from '../types';
import { X, MapPin, Star, Coffee, Wifi, Clock, Users, ExternalLink } from 'lucide-react';
import SEOHead from '../seo/SEOHead'; 
 

interface SpaceDetailProps {
  space: ThirdSpace | null;
  onClose: () => void;
}

const SpaceDetail: React.FC<SpaceDetailProps> = ({ space, onClose }) => {
  if (!space) return null;

  const amenityIcons: Record<string, JSX.Element> = {
    'Free Wi-Fi': <Wifi size={16} className="mr-2" />,
    'Coffee bar': <Coffee size={16} className="mr-2" />,
    'Power outlets': <Clock size={16} className="mr-2" />,
    'Study rooms': <Users size={16} className="mr-2" />
  };

  // Track when someone views this space detail
  useEffect(() => {
  console.log('Analytics: Space detail viewed -', space.name, 'in', space.city);
}, [space.name, space.city]);

  const getDirectionsUrl = (lat: number, lng: number) => {
  // Only use Apple Maps for actual iOS mobile devices
  const isIOSMobile = /iPhone|iPod/.test(navigator.userAgent);

 
  
  if (isIOSMobile) {
    return `https://maps.apple.com/?daddr=${lat},${lng}`;
  } else {
    // Everyone else gets Google Maps (Android, Desktop, iPad)
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  }
  
};

const handleGoogleReviewsClick = () => {
  console.log('Analytics: Google Reviews clicked -', space.name);
};

 // Track Get Directions clicks with map type
const handleDirectionsClick = () => {
  const isIOSMobile = /iPhone|iPod/.test(navigator.userAgent);
  const mapType = isIOSMobile ? 'apple_maps' : 'google_maps';
  
  console.log('Analytics: Get Directions clicked -', space.name, 'using', mapType);
};

  return (
    <>
      <SEOHead 
        title={`${space.name} - ${space.city}`}
        description={`${space.description} Located in ${space.city}. ${space.amenities.join(', ')}.`}
        keywords={`${space.name}, ${spaceTypeLabels[space.type]}, ${space.city}, third spaces, ${space.amenities.join(', ')}`}
        image={space.imageUrl}
        type="place"
      />
      
      <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-xl max-w-2xl w-full relative animate-fadeIn"
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors duration-200"
            aria-label="Close details"
          >
            <X size={20} className="text-gray-700" />
          </button>
          
          {/* Hero Image Section */}
          <div className="relative h-48 sm:h-56">
            <img 
              src={space.imageUrl} 
              alt={`${space.name} - ${spaceTypeLabels[space.type]} in ${space.city} featuring ${space.amenities.slice(0,2).join(' and ')}`}
              className="w-full h-full object-cover object-center rounded-t-xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-t-xl"></div>
            <div className="absolute bottom-0 left-0 p-6">
              <span className="inline-block bg-indigo-600 text-white text-xs font-semibold py-1 px-2 rounded-full mb-2">
                {spaceTypeLabels[space.type]}
              </span>
              <h2 className="text-2xl font-bold text-white mb-1">{space.name}</h2>
              <div className="flex items-center text-white/90">
                <MapPin size={16} className="mr-1" />
                <span className="text-sm">{space.address}, {space.city}</span>
              </div>
            </div>
          </div>
          
          {/* Content Section */}
          <div className="p-6">
            {/* Rating */}
            <div className="flex items-center mb-4">
              <div className="bg-indigo-50 p-2 rounded-lg">
                <Star size={20} className="text-yellow-500" fill="#FACC15" />
              </div>
              <div className="ml-3">
                <div className="font-medium">{space.rating.toFixed(1)} rating</div>
                <div className="text-sm text-gray-500">Based on community feedback</div>
              </div>
            </div>
              <a 
              href={`https://www.google.com/search?q=${encodeURIComponent(`${space.name} ${space.address} reviews`)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleGoogleReviewsClick}
                className="w-full sm:w-1/2 bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200 text-center text-sm flex items-center justify-center mx-auto"
              >
                <ExternalLink size={16} className="mr-2" />
                View Google Reviews
              </a>
           
            
            {/* Description */}
            <h3 className="text-lg font-semibold mb-2">About this space</h3>
            <p className="text-gray-700 mb-4 leading-relaxed">
              {space.description}
            </p>
            
            {/* Amenities */}
            <h3 className="text-lg font-semibold mb-3">Amenities</h3>
            <div className="grid grid-cols-2 gap-2 mb-6">
              {space.amenities.map((amenity, index) => (
                <div 
                  key={index} 
                  className="flex items-center text-gray-700 bg-gray-50 py-2 px-3 rounded-lg text-sm"
                >
                  {amenityIcons[amenity] || <div className="w-4 h-4 mr-2 rounded-full bg-indigo-100"></div>}
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
            {/* ADD THIS HOURS SECTION HERE: */}
            {space.hours && (
              <>
                <h3 className="text-lg font-semibold mb-3">Hours</h3>
                <div className="mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-3">
                      <Clock size={16} className="mr-2 text-gray-600" />
                      <span className="font-medium text-gray-800">Opening Hours</span>
                    </div>
                    {typeof space.hours === 'string' ? (
                      <p className="text-gray-700">{space.hours}</p>
                    ) : (
                      <div className="space-y-2">
                        {Object.entries(space.hours).map(([day, hours]) => (
                          <div key={day} className="flex justify-between text-sm">
                            <span className="capitalize font-medium text-gray-600">{day}:</span>
                            <span className="text-gray-800">{hours}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

          

            <div className="mb-4">
              <div className="flex items-center text-gray-600 mb-3">
                <MapPin size={16} className="mr-2" />
                <span className="text-sm font-medium">{space.address} </span>
              </div>
            </div>
            
            {/* Get Directions Button - Prominent! */}
           <a 
            href={getDirectionsUrl(space.coordinates.lat, space.coordinates.lng)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleDirectionsClick} // ADD THIS LINE
            className="w-full bg-indigo-600 text-white py-4 px-6 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200 text-center text-lg flex items-center justify-center"
          >
            <MapPin size={20} className="mr-2" />
            Get Directions
          </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default SpaceDetail;