import React from 'react';
import { MapPin } from 'lucide-react';
import { ThirdSpace } from '../types';

interface MapSectionProps {
  spaces: ThirdSpace[];
  onSpaceClick: (id: string) => void;
}

const MapSection: React.FC<MapSectionProps> = ({ spaces, onSpaceClick }) => {
  // In a real implementation, we would use a mapping library like Mapbox, Google Maps,
  // or Leaflet to render an interactive map with the space locations
  
  return (
    <section id="map" className="py-16 bg-indigo-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-3">Find Spaces Near You</h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
          Discover third spaces in your area with our interactive map. 
          Click on a marker to view details about each location.
        </p>
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="h-96 bg-gray-100 relative">
            {/* This would be replaced with an actual map component */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <MapPin size={40} className="mx-auto mb-4 text-indigo-600" />
                <p className="text-gray-600 mb-2">Interactive Map Placeholder</p>
                <p className="text-sm text-gray-500">
                  In a real implementation, this would display an interactive map with markers for each third space.
                </p>
              </div>
            </div>
            
            {/* Sample markers for illustration */}
            <div className="absolute" style={{ top: '30%', left: '25%' }}>
              <div 
                className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center cursor-pointer transform hover:scale-110 transition-transform duration-200"
                onClick={() => onSpaceClick('1')}
              >
                <MapPin size={16} className="text-white" />
              </div>
            </div>
            <div className="absolute" style={{ top: '50%', left: '60%' }}>
              <div 
                className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center cursor-pointer transform hover:scale-110 transition-transform duration-200"
                onClick={() => onSpaceClick('2')}
              >
                <MapPin size={16} className="text-white" />
              </div>
            </div>
            <div className="absolute" style={{ top: '65%', left: '40%' }}>
              <div 
                className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center cursor-pointer transform hover:scale-110 transition-transform duration-200"
                onClick={() => onSpaceClick('3')}
              >
                <MapPin size={16} className="text-white" />
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Current Location</h3>
                <p className="text-gray-600">San Francisco, CA</p>
              </div>
              
              <div className="flex gap-2">
                <button className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  Filter by Distance
                </button>
                <button className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200">
                  Use My Location
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapSection;