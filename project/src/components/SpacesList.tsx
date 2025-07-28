import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ThirdSpace, SpaceType, spaceTypeLabels } from '../types';
import SpaceCard from './SpaceCard';
import { Coffee, BookOpen, Users, TreePine, Building, ShoppingBag, Palette, Filter } from 'lucide-react';

declare global {
  function gtag(...args: any[]): void;
}

interface SpacesListProps {
  spaces: ThirdSpace[];
  onSpaceClick: (id: string) => void;
  loading: boolean;
  usingRealData: boolean;
  onFindNearby: () => void;
  onResetToSample: () => void;
  searchLocation: string;
}

const SpacesList: React.FC<SpacesListProps> = ({
  spaces,
  onSpaceClick,
  loading,
  usingRealData,
  onFindNearby,
  onResetToSample,
  searchLocation
}) => {
  const [selectedCategory, setSelectedCategory] = useState<SpaceType | 'all'>('all');

  // Category configuration with icons and URLs for deep linking
  const categoryConfig: Record<SpaceType, { icon: JSX.Element; url: string; color: string }> = {
    cafe: { 
      icon: <Coffee size={20} />, 
      url: 'cafes', 
      color: 'text-amber-600 border-amber-200 bg-amber-50 hover:bg-amber-100' 
    },
    library: { 
      icon: <BookOpen size={20} />, 
      url: 'libraries', 
      color: 'text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100' 
    },
    coworking: { 
      icon: <Users size={20} />, 
      url: 'coworking', 
      color: 'text-green-600 border-green-200 bg-green-50 hover:bg-green-100' 
    },
    park: { 
      icon: <TreePine size={20} />, 
      url: 'parks', 
      color: 'text-emerald-600 border-emerald-200 bg-emerald-50 hover:bg-emerald-100' 
    },
    community_center: { 
      icon: <Building size={20} />, 
      url: 'community-centers', 
      color: 'text-purple-600 border-purple-200 bg-purple-50 hover:bg-purple-100' 
    },
    bookstore: { 
      icon: <ShoppingBag size={20} />, 
      url: 'bookstores', 
      color: 'text-red-600 border-red-200 bg-red-50 hover:bg-red-100' 
    },
    art_gallery: { 
      icon: <Palette size={20} />, 
      url: 'art-galleries', 
      color: 'text-pink-600 border-pink-200 bg-pink-50 hover:bg-pink-100' 
    }
  };

  // Filter spaces based on selected category
  const filteredSpaces = selectedCategory === 'all' 
    ? spaces 
    : spaces.filter(space => space.type === selectedCategory);

  // Get unique space types from ALL spaces in current search context
  const availableTypes = Array.from(new Set(spaces.map(space => space.type)));

  // Helper function to get category display text
  const getCategoryDisplayText = (type: SpaceType) => {
    const totalCount = spaces.filter(space => space.type === type).length;
    const filteredCount = filteredSpaces.filter(space => space.type === type).length;
    
    if (selectedCategory === 'all') {
      return `${spaceTypeLabels[type]} (${totalCount})`;
    } else if (selectedCategory === type) {
      return `${spaceTypeLabels[type]} (${totalCount})`;
    } else {
      // Show if this category has results in current location
      return `${spaceTypeLabels[type]} (${totalCount})`;
    }
  };

  // Handle category filter clicks
  const handleCategoryFilter = (category: SpaceType | 'all') => {
    setSelectedCategory(category);
    
    // Track category filtering
    if (typeof gtag !== 'undefined') {
      gtag('event', 'filter_spaces', {
        event_category: 'engagement',
        event_label: `Filter by ${category}${searchLocation ? ` in ${searchLocation}` : ''}`,
        custom_parameter_category: category,
        custom_parameter_location: searchLocation || 'global',
        custom_parameter_total_results: spaces.length,
        custom_parameter_filtered_results: category === 'all' ? spaces.length : spaces.filter(s => s.type === category).length
      });
    }
    
    console.log(`Analytics: Spaces filtered by ${category}${searchLocation ? ` in ${searchLocation}` : ''}`);
  };

  // Build category page URL with search context
  const buildCategoryUrl = (categoryUrl: string) => {
    let url = `/category/${categoryUrl}`;
    if (searchLocation && usingRealData) {
      const params = new URLSearchParams();
      params.set('location', searchLocation);
      params.set('source', 'search');
      url += `?${params.toString()}`;
    }
    return url;
  };

  return (
    <section id="spaces" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {usingRealData && searchLocation 
              ? `Third Spaces ${searchLocation === 'your location' ? 'Near You' : `in ${searchLocation}`}`
              : 'Explore Third Spaces'
            }
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {usingRealData 
              ? `Discover ${spaces.length} amazing spaces ${searchLocation === 'your location' ? 'near you' : `in ${searchLocation}`}`
              : 'Discover amazing places beyond home and work where communities thrive and connections are made.'
            }
          </p>
        </div>

        {/* Search Context & Controls */}
        <div className="bg-white rounded-xl p-6 mb-8 shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center text-sm text-gray-600">
              {usingRealData ? (
                <>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium mr-3">
                    Live Results
                  </span>
                  Showing real places {searchLocation === 'your location' ? 'near you' : `in ${searchLocation}`}
                </>
              ) : (
                <>
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium mr-3">
                    Sample Data
                  </span>
                  Explore our curated collection of third spaces
                </>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={onFindNearby}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors"
              >
                Find Near Me
              </button>
              {usingRealData && (
                <button
                  onClick={onResetToSample}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700 transition-colors"
                >
                  Browse All
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Filter size={20} className="text-gray-500 mr-2" />
            <span className="text-sm font-medium text-gray-700">Filter by category:</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {/* All Categories Tab */}
            <button
              onClick={() => handleCategoryFilter('all')}
              className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedCategory === 'all'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              All ({spaces.length})
            </button>

            {/* Category Filter Tabs - Show ALL possible categories */}
            {Object.entries(categoryConfig).map(([type, config]) => {
              const spaceType = type as SpaceType;
              const count = spaces.filter(space => space.type === spaceType).length;
              const isDisabled = count === 0;
              
              return (
                <div key={type} className="relative group">
                  <button
                    onClick={() => handleCategoryFilter(spaceType)}
                    disabled={isDisabled}
                    className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
                      selectedCategory === spaceType
                        ? `${config.color} shadow-md`
                        : isDisabled
                        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {config.icon}
                    <span className="ml-2">
                      {spaceTypeLabels[spaceType]} ({count})
                      {isDisabled && <span className="text-red-400 ml-1">• No results</span>}
                    </span>
                  </button>
                  
                  {/* Tooltip with link to dedicated category page */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                    <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap">
                      <Link 
                        to={buildCategoryUrl(config.url)}
                        className="hover:text-indigo-300"
                        onClick={() => {
                          gtag('event', 'category_page_visit', {
                            event_category: 'engagement',
                            event_label: `${type} category page${searchLocation ? ` from ${searchLocation}` : ''}`,
                            custom_parameter_category: type,
                            custom_parameter_location: searchLocation || 'global'
                          });
                        }}
                      >
                       View {spaceTypeLabels[spaceType]} page →
                      </Link>
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center text-indigo-600">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mr-3"></div>
              Searching for amazing spaces...
            </div>
          </div>
        )}

        {/* Results Count */}
        {!loading && (
          <div className="flex items-center justify-between mb-6">
            <div className="text-sm text-gray-600">
              {selectedCategory === 'all' 
                ? `${filteredSpaces.length} spaces found`
                : `${filteredSpaces.length} ${spaceTypeLabels[selectedCategory as SpaceType]?.toLowerCase()} found`
              }
              {searchLocation && ` in ${searchLocation}`}
            </div>
            
            {selectedCategory !== 'all' && (
              <button
                onClick={() => handleCategoryFilter('all')}
                className="text-sm text-indigo-600 hover:text-indigo-700 underline"
              >
                Clear filter
              </button>
            )}
          </div>
        )}

        {/* Spaces Grid */}
        {!loading && filteredSpaces.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSpaces.map((space) => (
              <SpaceCard 
                key={space.id} 
                space={space} 
                onClick={onSpaceClick}
              />
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && filteredSpaces.length === 0 && spaces.length > 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-600 mb-4">
              No {selectedCategory !== 'all' ? spaceTypeLabels[selectedCategory]?.toLowerCase() : 'spaces'} found
              {searchLocation && ` in ${searchLocation}`}
            </h3>
            <p className="text-gray-500 mb-6">
              {selectedCategory !== 'all' 
                ? `There are no ${spaceTypeLabels[selectedCategory]?.toLowerCase()} in this location. Try selecting a different category or search another location.`
                : 'Try selecting a different category or search another location.'
              }
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => handleCategoryFilter('all')}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Show all {spaces.length} spaces
              </button>
              <button
                onClick={onFindNearby}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Search Another Location
              </button>
            </div>
          </div>
        )}

        {/* Empty State (no spaces at all) */}
        {!loading && spaces.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-600 mb-4">No spaces found</h3>
            <p className="text-gray-500 mb-6">
              Try searching for a different location or use the "Find Nearby" feature.
            </p>
            <button
              onClick={onFindNearby}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Find Spaces Near Me
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default SpacesList;