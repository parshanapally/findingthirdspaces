import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import Categories from './components/Categories';
import SpacesList from './components/SpacesList';
import MapSection from './components/MapSection';
import SpaceDetail from './components/SpaceDetail';
import SubmitForm from './components/SubmitForm';
import { HelmetProvider } from 'react-helmet-async'; 
import Footer from './components/Footer';
import { spacesData } from './data/spacesData';
import { searchNearbyThirdSpaces } from './services/googlePlaces';
import { searchThirdSpacesByLocation } from './services/locationSearch';
import SEOHead from './seo/SEOHead';
import { ThirdSpace } from './types';

function App() {
  const [selectedSpace, setSelectedSpace] = useState<ThirdSpace | null>(null);
  const [spaces, setSpaces] = useState<ThirdSpace[]>(spacesData);
  const [loading, setLoading] = useState(false);
  const [usingRealData, setUsingRealData] = useState(false);
  const [searchLocation, setSearchLocation] = useState<string>('');

  useEffect(() => {
    document.title = "Third Spaces - Discover Places Beyond Home & Work";
  }, []);

  const handleSpaceClick = (id: string) => {
    const space = spaces.find(space => space.id === id);
    setSelectedSpace(space || null);
  };

  const findNearbySpaces = () => {
    setLoading(true);
    setSearchLocation('');
    
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        
        try {
          const realSpaces = await searchNearbyThirdSpaces(location);
          
          if (realSpaces.length > 0) {
            setSpaces(realSpaces);
            setUsingRealData(true);
            setSearchLocation('your location');
          } else {
            alert('No third spaces found nearby. Showing sample locations.');
            setSpaces(spacesData);
            setUsingRealData(false);
          }
        } catch (error) {
          console.error('Error fetching places:', error);
          alert('Error loading nearby places. Showing sample locations.');
          setSpaces(spacesData);
          setUsingRealData(false);
        }
        
        setLoading(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        alert('Unable to get your location. Showing sample locations.');
        setSpaces(spacesData);
        setUsingRealData(false);
        setLoading(false);
      }
    );
  };

  const searchByLocation = async (query: string) => {
    setLoading(true);
    
    try {
      const searchResults = await searchThirdSpacesByLocation(query);
      
      if (searchResults.length > 0) {
        setSpaces(searchResults);
        setUsingRealData(true);
        setSearchLocation(query);
      } else {
        alert(`No third spaces found for "${query}". Try a different search.`);
        setSpaces(spacesData);
        setUsingRealData(false);
        setSearchLocation('');
      }
    } catch (error) {
      console.error('Search error:', error);
      const errorMessage = error.message || 'Search failed. Please try again.';
      alert(errorMessage);
      setSpaces(spacesData);
      setUsingRealData(false);
      setSearchLocation('');
    }
    
    setLoading(false);
  };

  const resetToSampleData = () => {
    setSpaces(spacesData);
    setUsingRealData(false);
    setSearchLocation('');
  };

  return (
  <HelmetProvider> {/* Add this wrapper */}
    <div className="min-h-screen">
      <SEOHead/>
      <Header />
      <Hero 
        onFindNearby={findNearbySpaces} 
        onSearchLocation={searchByLocation}
        loading={loading}
      />
   
      <SpacesList 
        spaces={spaces} 
        onSpaceClick={handleSpaceClick}
        loading={loading}
        usingRealData={usingRealData}
        onFindNearby={findNearbySpaces}
        onResetToSample={resetToSampleData}
        searchLocation={searchLocation}
      />
     <Categories />
      <MapSection spaces={spaces} onSpaceClick={handleSpaceClick} />
      {/* <SubmitForm /> */}
      <Footer />
      {selectedSpace && (
        <SpaceDetail 
          space={selectedSpace} 
          onClose={() => setSelectedSpace(null)} 
        />
      )}
    </div>
    </HelmetProvider>
  );
}

export default App;