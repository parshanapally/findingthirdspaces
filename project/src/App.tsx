import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import Categories from './components/Categories';
import SpacesList from './components/SpacesList';
import MapSection from './components/MapSection';
import SpaceDetail from './components/SpaceDetail';
import SubmitForm from './components/SubmitForm';
import Footer from './components/Footer';
import { spacesData } from './data/spacesData';
import { searchNearbyThirdSpaces } from './services/googlePlaces';
import { ThirdSpace } from './types';

function App() {
  const [selectedSpace, setSelectedSpace] = useState<ThirdSpace | null>(null);
  const [spaces, setSpaces] = useState<ThirdSpace[]>(spacesData);
  const [loading, setLoading] = useState(false);
  const [usingRealData, setUsingRealData] = useState(false);

  useEffect(() => {
    document.title = "Third Spaces - Discover Places Beyond Home & Work";
  }, []);

  const handleSpaceClick = (id: string) => {
    const space = spaces.find(space => space.id === id);
    setSelectedSpace(space || null);
  };

  const findNearbySpaces = () => {
    setLoading(true);
    
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

  const resetToSampleData = () => {
    setSpaces(spacesData);
    setUsingRealData(false);
  };

  return (
    <div className="min-h-screen">
      <Header />
      <Hero 
        onFindNearby={findNearbySpaces} 
        loading={loading}
      />
      <Categories />
      <SpacesList 
        spaces={spaces} 
        onSpaceClick={handleSpaceClick}
        loading={loading}
        usingRealData={usingRealData}
        onFindNearby={findNearbySpaces}
        onResetToSample={resetToSampleData}
      />
      <MapSection spaces={spaces} onSpaceClick={handleSpaceClick} />
      <SubmitForm />
      <Footer />
      {selectedSpace && (
        <SpaceDetail 
          space={selectedSpace} 
          onClose={() => setSelectedSpace(null)} 
        />
      )}
    </div>
  );
}

export default App;