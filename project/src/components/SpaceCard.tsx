import React from 'react';
import { ThirdSpace } from '../types';
import { Star, MapPin } from 'lucide-react';

interface SpaceCardProps {
  space: ThirdSpace;
  onClick: (id: string) => void;
}

const SpaceCard: React.FC<SpaceCardProps> = ({ space, onClick }) => {
  return (
    <div 
      className="bg-white rounded-lg overflow-hidden shadow-md transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
      onClick={() => onClick(space.id)}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={space.imageUrl} 
          alt={`${space.name} - ${space.type.replace('_', ' ')} in ${space.city} with ${space.rating.toFixed(1)} star rating`}
          className="w-full h-full object-cover object-center transform transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute top-3 left-3 bg-indigo-600 text-white text-xs font-semibold py-1 px-2 rounded-full">
          {space.type.replace('_', ' ')}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          {space.name}
        </h3>
        
        <div className="flex items-center mb-2">
          <MapPin size={16} className="text-gray-500 mr-1" />
          <span className="text-sm text-gray-500">{space.city}</span>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {space.description}
        </p>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Star size={16} className="text-yellow-500 mr-1" fill="#FACC15" />
            <span className="text-sm font-medium">{space.rating.toFixed(1)}</span>
          </div>
          
          <div className="flex flex-wrap gap-1">
            {space.amenities.slice(0, 2).map((amenity, index) => (
              <span 
                key={index} 
                className="inline-block text-xs bg-gray-100 text-gray-600 py-1 px-2 rounded-full"
              >
                {amenity}
              </span>
            ))}
            {space.amenities.length > 2 && (
              <span className="inline-block text-xs bg-gray-100 text-gray-600 py-1 px-2 rounded-full">
                +{space.amenities.length - 2} more
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpaceCard;