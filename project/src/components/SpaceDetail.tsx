import React from 'react';
import { ThirdSpace, spaceTypeLabels } from '../types';
import { X, MapPin, Star, Coffee, Wifi, Clock, Users } from 'lucide-react';
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

  return (
    <>
     <SEOHead 
        title={`${space.name} - ${space.city}`}
        description={`${space.description} Located in ${space.city}. ${space.amenities.join(', ')}.`}
        keywords={`${space.name}, ${spaceTypeLabels[space.type]}, ${space.city}, third spaces, ${space.amenities.join(', ')}`}
        image={space.imageUrl}
        type="place"
      />
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div 
        className="bg-white rounded-xl max-w-3xl w-full max-h-screen overflow-y-auto relative animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors duration-200"
          aria-label="Close details"
        >
          <X size={20} className="text-gray-700" />
        </button>
        
        <div className="relative h-64 sm:h-80">
          <img 
            src={space.imageUrl} 
            alt={space.name} 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
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
        
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="bg-indigo-50 p-2 rounded-lg">
              <Star size={20} className="text-yellow-500" fill="#FACC15" />
            </div>
            <div className="ml-3">
              <div className="font-medium">{space.rating.toFixed(1)} rating</div>
              <div className="text-sm text-gray-500">Based on community feedback</div>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mb-2">About this space</h3>
          <p className="text-gray-700 mb-6 leading-relaxed">
            {space.description}
          </p>
          
          <h3 className="text-lg font-semibold mb-3">Amenities</h3>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {space.amenities.map((amenity, index) => (
              <div 
                key={index} 
                className="flex items-center text-gray-700 bg-gray-50 py-2 px-3 rounded-lg"
              >
                {amenityIcons[amenity] || <div className="w-4 h-4 mr-2 rounded-full bg-indigo-100"></div>}
                <span>{amenity}</span>
              </div>
            ))}
          </div>
          
          <h3 className="text-lg font-semibold mb-3">Location</h3>
            <h3 className="text-lg font-semibold mb-3" >{space.address}, {space.city}</h3>
          <div className="bg-gray-100 h-48 rounded-lg mb-6 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <MapPin size={24} className="mx-auto mb-2" />
              <p>Interactive map would be displayed here</p>
              <p className="text-sm">{space.coordinates.lat}, {space.coordinates.lng}</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <a 
              href={`https://www.google.com/maps/dir/?api=1&destination=${space.coordinates.lat},${space.coordinates.lng}`}
              className="bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200 text-center"
            >
              Get Directions
            </a>
            <a 
              href="#" 
              className="border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200 text-center"
            >
              Save to Favorites
            </a>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default SpaceDetail;