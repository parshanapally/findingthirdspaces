import React from 'react';
import { Search, ChevronDown } from 'lucide-react';

const Hero: React.FC = () => {
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
          <span className="text-indigo-400">Third Space</span>
        </h1>
        
        <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
          Find places beyond home and work where communities thrive, 
          creativity flourishes, and connections are made.
        </p>
        
        <div className="max-w-xl mx-auto bg-white rounded-full overflow-hidden shadow-xl p-1 flex">
          <input 
            type="text" 
            placeholder="Find a café, library, or community space..." 
            className="w-full py-3 px-6 outline-none text-gray-700"
          />
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full flex items-center transition-colors duration-300">
            <Search size={20} className="mr-2" />
            <span>Search</span>
          </button>
        </div>
        
        <div className="mt-16 flex justify-center">
          <a 
            href="#explore" 
            className="text-white flex flex-col items-center transition-opacity duration-300 hover:opacity-80"
            aria-label="Scroll down"
          >
            <span className="mb-2">Explore Spaces</span>
            <ChevronDown size={24} className="animate-bounce" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;