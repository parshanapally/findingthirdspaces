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
import { ThirdSpace } from './types';

function App() {
  const [selectedSpace, setSelectedSpace] = useState<ThirdSpace | null>(null);

  useEffect(() => {
    document.title = "Third Spaces - Discover Places Beyond Home & Work";
  }, []);

  const handleSpaceClick = (id: string) => {
    const space = spacesData.find(space => space.id === id);
    setSelectedSpace(space || null);
  };

  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Categories />
      <SpacesList spaces={spacesData} onSpaceClick={handleSpaceClick} />
      <MapSection spaces={spacesData} onSpaceClick={handleSpaceClick} />
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