import React from 'react';
import { MapPin, Search, Home, Coffee, BookOpen, Users } from 'lucide-react';
import SEOHead from '../seo/SEOHead';

interface NotFoundPageProps {
  popularSpaces?: Array<{
    id: string;
    name: string;
    type: string;
    city: string;
  }>;
}

const NotFoundPage: React.FC<NotFoundPageProps> = ({ popularSpaces = [] }) => {
  const suggestions = [
    { icon: <Coffee size={20} />, text: "Browse Cafes", search: "cafe" },
    { icon: <BookOpen size={20} />, text: "Find Libraries", search: "library" },
    { icon: <Users size={20} />, text: "Coworking Spaces", search: "coworking" },
  ];

  return (
    <>
      <SEOHead 
        title="Page Not Found - Finding Third Spaces"
        description="The page you're looking for doesn't exist. Discover amazing third spaces including cafes, libraries, and coworking spaces near you."
        keywords="third spaces, cafes, libraries, coworking spaces, community spaces"
        type="website"
      />
      
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-2xl w-full text-center">
          {/* 404 Hero */}
          <div className="mb-8">
            <h1 className="text-6xl font-bold text-indigo-600 mb-4">404</h1>
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">
              Oops! This space doesn't exist
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              The page you're looking for might have been moved, deleted, or you entered the wrong URL.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 mb-12">
            <a 
              href="/"
              className="inline-flex items-center bg-indigo-600 text-white px-8 py-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200 text-lg"
            >
              <Home size={20} className="mr-2" />
              Back to Home
            </a>
          </div>

          {/* Quick Suggestions */}
          {/* <div className="mb-12">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              Looking for something specific?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {suggestions.map((suggestion, index) => (
                <a
                  key={index}
                  href={`/?search=${suggestion.search}`}
                  className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="text-indigo-600 mb-3">
                      {suggestion.icon}
                    </div>
                    <span className="font-medium text-gray-800">
                      {suggestion.text}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div> */}

          {/* Popular Spaces */}
          {/* {popularSpaces.length > 0 && (
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                Popular Third Spaces
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {popularSpaces.slice(0, 4).map((space) => (
                  <a
                    key={space.id}
                    href={`/space/${space.id}`}
                    className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <MapPin size={16} className="text-indigo-600 mr-3 flex-shrink-0" />
                    <div className="text-left">
                      <div className="font-medium text-gray-800">{space.name}</div>
                      <div className="text-sm text-gray-600">{space.city}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )} */}

          {/* Help Text */}
          {/* <div className="mt-12 text-sm text-gray-500">
            <p>
              Still can't find what you're looking for? 
              <a href="mailto:hello@findingthirdspaces.com" className="text-indigo-600 hover:text-indigo-700 ml-1">
                Contact us
              </a>
            </p>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;