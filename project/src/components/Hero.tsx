import React, { useState } from 'react';
import { Search, ChevronDown, MapPin } from 'lucide-react';

interface HeroProps {
  onFindNearby: () => void;
  onSearchLocation: (query: string) => void;
  loading: boolean;
}

const Hero: React.FC<HeroProps> = ({ onFindNearby, onSearchLocation, loading }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearchLocation(searchQuery.trim());
    }
  };

  return (
    <section id="home" className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background image with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: 'url(https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg)', 
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/40"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10 text-center py-16 mt-12">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          Discover Your Perfect <br className="hidden md:block" />
          <span className="text-indigo-400">Finding Third Spaces</span>
        </h1>
        
        <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
          Find places beyond home and work where communities thrive, 
          creativity flourishes, and connections are made.
        </p>
        
        {/* Search Form */}
        <form onSubmit={handleSearch} className="max-w-xl mx-auto bg-white rounded-full overflow-hidden shadow-xl p-1 flex">
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search 'cafes in Paris' or 'libraries in Tokyo'" 
            className="w-full py-3 px-6 outline-none text-gray-700"
            disabled={loading}
          />
          <button 
            type="submit"
            disabled={loading || !searchQuery.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full flex items-center transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Search size={20} className="mr-2" />
            <span>{loading ? 'Searching...' : 'Search'}</span>
          </button>
        </form>
        
        

      </div>
    </section>
  );
};

export default Hero;