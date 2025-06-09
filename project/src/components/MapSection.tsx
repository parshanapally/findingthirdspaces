import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Loader } from 'lucide-react';
import { ThirdSpace } from '../types';

interface MapSectionProps {
  spaces: ThirdSpace[];
  onSpaceClick: (id: string) => void;
}

declare global {
  interface Window {
    google: any;
  }
}

const MapSection: React.FC<MapSectionProps> = ({ spaces, onSpaceClick }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);

  // Load Google Maps
  useEffect(() => {
    const loadGoogleMaps = async () => {
      try {
        // Check if Google Maps is already loaded
        if (window.google && window.google.maps) {
          setMapLoaded(true);
          return;
        }

        // Load Google Maps script
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
        script.async = true;
        script.defer = true;
        
        script.onload = () => {
          setMapLoaded(true);
        };
        
        script.onerror = () => {
          setMapError(true);
        };

        document.head.appendChild(script);
      } catch (error) {
        console.error('Error loading Google Maps:', error);
        setMapError(true);
      }
    };

    loadGoogleMaps();
  }, []);

  // Initialize map when loaded
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || mapInstanceRef.current) return;

    try {
      // Default center (will be updated when spaces load)
      const defaultCenter = { lat: 39.8283, lng: -98.5795 }; // Center of US
      
      // Create map
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        zoom: spaces.length > 0 ? 12 : 4,
        center: defaultCenter,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });
    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError(true);
    }
  }, [mapLoaded]);

  // Update markers when spaces change
  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    if (spaces.length === 0) return;

    // Add markers for each space
    const bounds = new window.google.maps.LatLngBounds();
    
    spaces.forEach((space) => {
      const marker = new window.google.maps.Marker({
        position: { lat: space.coordinates.lat, lng: space.coordinates.lng },
        map: mapInstanceRef.current,
        title: space.name,
        icon: {
          url: getMarkerIcon(space.type),
          scaledSize: new window.google.maps.Size(30, 30),
        }
      });

      // Add click listener
      marker.addListener('click', () => {
        onSpaceClick(space.id);
      });

      // Create info window
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; max-width: 200px;">
            <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">${space.name}</h3>
            <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">${space.address}</p>
            <p style="margin: 0; font-size: 12px;">⭐ ${space.rating} • ${space.type}</p>
          </div>
        `
      });

      // Show info window on hover
      marker.addListener('mouseover', () => {
        infoWindow.open(mapInstanceRef.current, marker);
      });

      marker.addListener('mouseout', () => {
        infoWindow.close();
      });

      markersRef.current.push(marker);
      bounds.extend(marker.getPosition());
    });

    // Fit map to show all markers
    if (spaces.length > 1) {
      mapInstanceRef.current.fitBounds(bounds);
    } else if (spaces.length === 1) {
      mapInstanceRef.current.setCenter({ 
        lat: spaces[0].coordinates.lat, 
        lng: spaces[0].coordinates.lng 
      });
      mapInstanceRef.current.setZoom(14);
    }
  }, [spaces, mapLoaded, onSpaceClick]);

  const getMarkerIcon = (type: string) => {
    const baseUrl = 'https://maps.google.com/mapfiles/ms/icons/';
    switch (type) {
      case 'cafe': return baseUrl + 'orange-dot.png';
      case 'library': return baseUrl + 'blue-dot.png';
      case 'park': return baseUrl + 'green-dot.png';
      case 'bookstore': return baseUrl + 'purple-dot.png';
      case 'coworking': return baseUrl + 'yellow-dot.png';
      default: return baseUrl + 'red-dot.png';
    }
  };

  if (mapError) {
    return (
      <section id="map" className="py-16 bg-indigo-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-3">Find Spaces Near You</h2>
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="h-96 bg-gray-100 flex items-center justify-center">
              <div className="text-center">
                <MapPin size={40} className="mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">Map unavailable</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="map" className="py-16 bg-indigo-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-3">Find Spaces Near You</h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
          Discover third spaces in your area with our interactive map. 
          Click on a marker to view details about each location.
        </p>
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="h-96 relative">
            {!mapLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="text-center">
                  <Loader size={40} className="mx-auto mb-4 text-indigo-600 animate-spin" />
                  <p className="text-gray-600">Loading map...</p>
                </div>
              </div>
            )}
            <div ref={mapRef} className="w-full h-full" />
          </div>
          
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">
                  {spaces.length > 0 ? `${spaces.length} Spaces Found` : 'No Spaces Selected'}
                </h3>
                <p className="text-gray-600">
                  {spaces.length > 0 
                    ? 'Click markers to view details' 
                    : 'Use "Find Near Me" or search to see places on the map'
                  }
                </p>
              </div>
              
              <div className="flex gap-2 text-sm">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span>Cafes</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Libraries</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Parks</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapSection;