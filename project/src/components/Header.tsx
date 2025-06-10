import React, { useState, useEffect } from 'react';
import { Menu, X, Map, MapPin, Home } from 'lucide-react';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <MapPin 
            className={`mr-2 transition-colors duration-300 ${
              isScrolled ? 'text-indigo-600' : 'text-white'
            }`}
            size={24} 
          />
          <h1 
            className={`text-xl md:text-2xl font-bold transition-colors duration-300 ${
              isScrolled ? 'text-gray-900' : 'text-white'
            }`}
          >
            Finding Third Spaces
          </h1>
        </div>
        
        <nav className="hidden md:block">
          <ul className="flex space-x-8">
            {['Home', 'Explore', 'Categories', 'Map'].map((item) => (
              <li key={item}>
                <a 
                  href={`#${item.toLowerCase()}`}
                  className={`font-medium hover:text-indigo-500 transition-colors duration-200 ${
                    isScrolled ? 'text-gray-700' : 'text-white'
                  }`}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        
        <button 
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <X 
              className={`transition-colors duration-300 ${
                isScrolled ? 'text-gray-900' : 'text-white'
              }`} 
              size={24} 
            />
          ) : (
            <Menu 
              className={`transition-colors duration-300 ${
                isScrolled ? 'text-gray-900' : 'text-white'
              }`} 
              size={24} 
            />
          )}
        </button>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg">
          <ul className="flex flex-col py-4">
            {['Home', 'Explore', 'Categories', 'Map', 'Submit'].map((item) => (
              <li key={item}>
                <a 
                  href={`#${item.toLowerCase()}`}
                  className="block py-3 px-6 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;