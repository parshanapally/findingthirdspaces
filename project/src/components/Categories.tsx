import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { spaceTypeLabels, SpaceType } from '../types';
import { Coffee, BookOpen, Briefcase, Trees as Tree, Users, Book, Palette } from 'lucide-react';

interface CategoriesProps {
  searchLocation?: string; // Accept search location as prop
  usingRealData?: boolean; // Know if we're showing search results
}

const Categories: React.FC<CategoriesProps> = ({ searchLocation, usingRealData }) => {
  const categoryIcons: Record<SpaceType, JSX.Element> = {
    cafe: <Coffee size={32} className="text-indigo-600" />,
    library: <BookOpen size={32} className="text-indigo-600" />,
    coworking: <Briefcase size={32} className="text-indigo-600" />,
    park: <Tree size={32} className="text-indigo-600" />,
    community_center: <Users size={32} className="text-indigo-600" />,
    bookstore: <Book size={32} className="text-indigo-600" />,
    art_gallery: <Palette size={32} className="text-indigo-600" />
  };

  // Map space types to URL-friendly category names
  const categoryUrlMap: Record<SpaceType, string> = {
    cafe: 'cafes',
    library: 'libraries',
    coworking: 'coworking',
    park: 'parks',
    community_center: 'community-centers',
    bookstore: 'bookstores',
    art_gallery: 'art-galleries'
  };

  const categories = Object.entries(spaceTypeLabels).map(([key, label]) => ({
    type: key as SpaceType,
    label,
    icon: categoryIcons[key as SpaceType],
    description: getCategoryDescription(key as SpaceType),
    url: categoryUrlMap[key as SpaceType]
  }));

  // Build category URL with search context
  const buildCategoryUrl = (categoryUrl: string) => {
    let url = `/category/${categoryUrl}`;
    
    // Add search parameters if we have a search location
    if (searchLocation && usingRealData) {
      const params = new URLSearchParams();
      params.set('location', searchLocation);
      params.set('source', 'search');
      url += `?${params.toString()}`;
    }
    
    return url;
  };

  // Track category clicks with search context
  const handleCategoryClick = (categoryType: SpaceType, categoryUrl: string) => {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'category_navigation', {
        event_category: 'engagement',
        event_label: `${categoryType} category${searchLocation ? ` from ${searchLocation} search` : ''}`,
        custom_parameter_category: categoryType,
        custom_parameter_location: searchLocation || 'global',
        custom_parameter_from_search: usingRealData || false
      });
    }
    
    console.log(`Analytics: Category navigation - ${categoryType}${searchLocation ? ` with location ${searchLocation}` : ''}`);
  };

  return (
    <section id="categories" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-3">Categories</h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-4">
          Explore different types of third spaces, each offering unique experiences and environments for work, leisure, and community.
        </p>
        
        {/* Search Context Indicator */}
        {searchLocation && usingRealData && (
          <div className="text-center mb-8">
            <div className="inline-flex items-center bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm">
              <span>🔍 Showing categories for your search in <strong>{searchLocation}</strong></span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.type}
              to={buildCategoryUrl(category.url)}
              className="group block"
              onClick={() => handleCategoryClick(category.type, category.url)}
            >
              <div className="bg-white border border-gray-100 rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-all duration-300 group-hover:-translate-y-1">
                <div className="bg-indigo-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-indigo-100 transition-colors duration-300">
                  {category.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-indigo-600 transition-colors duration-300">
                  {category.label}
                  {/* Show location context in category titles when relevant */}
                  {searchLocation && usingRealData && (
                    <div className="text-xs text-indigo-600 font-normal mt-1">
                      in {searchLocation}
                    </div>
                  )}
                </h3>
                <p className="text-gray-600 text-sm group-hover:text-gray-700 transition-colors duration-300">
                  {searchLocation && usingRealData 
                    ? `${category.description.replace(/\.$/, '')} in ${searchLocation}.`
                    : category.description
                  }
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA with search context */}
        <div className="text-center mt-12">
          {searchLocation && usingRealData ? (
            <>
              <p className="text-gray-600 mb-6">
                Want to explore all spaces in {searchLocation}?
              </p>
              <Link
                to="/"
                className="inline-flex items-center bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200 mr-4"
              >
                View All {searchLocation} Results
              </Link>
              <Link
                to="/"
                className="inline-flex items-center bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors duration-200"
              >
                Browse All Global Spaces
              </Link>
            </>
          ) : (
            <>
              <p className="text-gray-600 mb-6">
                Can't find what you're looking for?
              </p>
              <Link
                to="/"
                className="inline-flex items-center bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200"
              >
                Browse All Spaces
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

function getCategoryDescription(type: SpaceType): string {
  const descriptions: Record<SpaceType, string> = {
    cafe: 'Cozy environments for coffee, conversation, and casual work.',
    library: 'Quiet spaces for reading, research, and focused study.',
    coworking: 'Shared workspaces designed for productivity and networking.',
    park: 'Outdoor environments for recreation, relaxation, and connection with nature.',
    community_center: 'Gathering spaces for events, classes, and community activities.',
    bookstore: 'Havens for book lovers with reading areas and literary events.',
    art_gallery: 'Creative spaces showcasing artwork and fostering cultural appreciation.'
  };
    
  return descriptions[type];
}

export default Categories;