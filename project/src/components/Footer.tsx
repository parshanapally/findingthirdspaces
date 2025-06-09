import React from 'react';
import { MapPin, Mail, Phone, Instagram, Twitter, Facebook } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <MapPin className="mr-2 text-indigo-400" size={24} />
              <h2 className="text-xl font-bold">Finding Third Spaces</h2>
            </div>
            <p className="text-gray-400 mb-6">
              Discover places beyond home and work where communities thrive and connections are made.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <Facebook size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {['Home', 'About Us', 'Explore Spaces', 'Categories', 'Submit a Space', 'Contact'].map((link) => (
                <li key={link}>
                  <a 
                    href="#" 
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              {['Cafés', 'Libraries', 'Coworking Spaces', 'Parks', 'Community Centers', 'Bookstores', 'Art Galleries'].map((category) => (
                <li key={category}>
                  <a 
                    href="#" 
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {category}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex">
                <MapPin className="mr-3 text-indigo-400 flex-shrink-0" size={18} />
                <span className="text-gray-400">
                  123 Third Space Plaza<br />
                  San Francisco, CA 94103
                </span>
              </li>
              <li className="flex items-center">
                <Mail className="mr-3 text-indigo-400 flex-shrink-0" size={18} />
                <a 
                  href="mailto:info@thirdspaces.com" 
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  info@thirdspaces.com
                </a>
              </li>
              <li className="flex items-center">
                <Phone className="mr-3 text-indigo-400 flex-shrink-0" size={18} />
                <a 
                  href="tel:+14155550123" 
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  (415) 555-0123
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Third Spaces. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <ul className="flex space-x-6">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
                <li key={item}>
                  <a 
                    href="#" 
                    className="text-gray-500 text-sm hover:text-white transition-colors duration-200"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;