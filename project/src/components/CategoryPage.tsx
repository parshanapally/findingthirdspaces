import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { spacesData } from '../data/spacesData';
import { ThirdSpace, SpaceType, spaceTypeLabels } from '../types';
import SEOHead from '../seo/SEOHead';
import Header from './Header';
import Footer from './Footer';
import SpaceCard from './SpaceCard';
import SpaceDetail from './SpaceDetail';
import { Coffee, BookOpen, Users, TreePine, Building, ShoppingBag, Palette } from 'lucide-react';

declare global {
  function gtag(...args: any[]): void;
}

const CategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [searchParams] = useSearchParams(); // ADD THIS LINE
  const [selectedSpace, setSelectedSpace] = useState<ThirdSpace | null>(null);
  const [filteredSpaces, setFilteredSpaces] = useState<ThirdSpace[]>([]);

  // GET LOCATION FROM URL PARAMETERS
  const searchLocation = searchParams.get('location');
  const isFromSearch = searchParams.get('source') === 'search';

  // Map URL categories to space types
  const categoryMap: Record<string, SpaceType> = {
    'cafes': 'cafe',
    'libraries': 'library', 
    'coworking': 'coworking',
    'parks': 'park',
    'community-centers': 'community_center',
    'bookstores': 'bookstore',
    'art-galleries': 'art_gallery'
  };

  // Category metadata for SEO and display
  const categoryInfo = {
    'cafes': {
      title: searchLocation ? `Best Cafes in ${searchLocation}` : 'Best Cafes & Coffee Shops',
      description: searchLocation 
        ? `Discover amazing cafes and coffee shops in ${searchLocation}. Perfect for work, study, or socializing with great coffee, WiFi, and atmosphere.`
        : 'Discover amazing cafes and coffee shops perfect for work, study, or socializing. Find spaces with great coffee, WiFi, and atmosphere.',
      icon: <Coffee size={48} className="text-amber-600" />,
      keywords: searchLocation 
        ? `cafes in ${searchLocation}, coffee shops ${searchLocation}, work cafe ${searchLocation}`
        : 'cafes, coffee shops, third spaces, work from cafe, study cafe, coffee culture',
      hero: searchLocation ? `Cafes in ${searchLocation}` : 'Find Your Perfect Cafe',
      subtitle: searchLocation 
        ? `Great coffee and productive atmosphere in ${searchLocation}`
        : 'Great coffee, comfortable seating, and productive atmosphere'
    },
    'libraries': {
      title: searchLocation ? `Libraries in ${searchLocation}` : 'Public Libraries & Study Spaces',
      description: searchLocation
        ? `Explore quiet libraries and study spaces in ${searchLocation}. Perfect for focused work, research, and learning with free WiFi.`
        : 'Explore quiet libraries and study spaces ideal for focused work, research, and learning. Free WiFi and peaceful environments.',
      icon: <BookOpen size={48} className="text-blue-600" />,
      keywords: searchLocation
        ? `libraries in ${searchLocation}, study spaces ${searchLocation}, quiet work ${searchLocation}`
        : 'libraries, study spaces, quiet work, research, free wifi, public libraries',
      hero: searchLocation ? `Libraries in ${searchLocation}` : 'Discover Inspiring Libraries',
      subtitle: searchLocation
        ? `Quiet spaces for study and research in ${searchLocation}`
        : 'Quiet spaces for study, research, and focused work'
    },
    'coworking': {
      title: searchLocation ? `Coworking Spaces in ${searchLocation}` : 'Coworking Spaces & Shared Offices',
      description: searchLocation
        ? `Find professional coworking spaces in ${searchLocation} with networking opportunities, meeting rooms, and business amenities.`
        : 'Find professional coworking spaces and shared offices with networking opportunities, meeting rooms, and business amenities.',
      icon: <Users size={48} className="text-green-600" />,
      keywords: searchLocation
        ? `coworking ${searchLocation}, shared offices ${searchLocation}, workspace ${searchLocation}`
        : 'coworking spaces, shared offices, networking, professional workspace, meeting rooms',
      hero: searchLocation ? `Coworking in ${searchLocation}` : 'Professional Coworking Spaces',
      subtitle: searchLocation
        ? `Network and collaborate in ${searchLocation}`
        : 'Network, collaborate, and grow your business'
    },
    'parks': {
      title: searchLocation ? `Parks in ${searchLocation}` : 'Parks & Outdoor Spaces',
      description: searchLocation
        ? `Enjoy fresh air and nature in beautiful parks in ${searchLocation}. Perfect for relaxation, exercise, and outdoor activities.`
        : 'Enjoy fresh air and nature in beautiful parks and outdoor spaces perfect for relaxation, exercise, and outdoor activities.',
      icon: <TreePine size={48} className="text-emerald-600" />,
      keywords: searchLocation
        ? `parks in ${searchLocation}, outdoor spaces ${searchLocation}, nature ${searchLocation}`
        : 'parks, outdoor spaces, nature, fresh air, recreation, outdoor activities',
      hero: searchLocation ? `Parks in ${searchLocation}` : 'Beautiful Parks & Nature',
      subtitle: searchLocation
        ? `Fresh air and green spaces in ${searchLocation}`
        : 'Fresh air, green spaces, and outdoor recreation'
    },
    'community-centers': {
      title: searchLocation ? `Community Centers in ${searchLocation}` : 'Community Centers & Hubs',
      description: searchLocation
        ? `Connect with your community at local centers in ${searchLocation} offering events, classes, and gathering spaces.`
        : 'Connect with your community at local centers offering events, classes, and gathering spaces for all ages.',
      icon: <Building size={48} className="text-purple-600" />,
      keywords: searchLocation
        ? `community centers ${searchLocation}, local community ${searchLocation}, events ${searchLocation}`
        : 'community centers, local community, events, classes, gathering spaces',
      hero: searchLocation ? `Community Centers in ${searchLocation}` : 'Community Centers & Hubs',
      subtitle: searchLocation
        ? `Connect with your community in ${searchLocation}`
        : 'Connect, learn, and engage with your community'
    },
    'bookstores': {
      title: searchLocation ? `Bookstores in ${searchLocation}` : 'Bookstores & Reading Spaces',
      description: searchLocation
        ? `Browse books and enjoy reading in cozy bookstores in ${searchLocation} with comfortable seating and literary atmosphere.`
        : 'Browse books and enjoy reading in cozy bookstores with comfortable seating and literary atmosphere.',
      icon: <ShoppingBag size={48} className="text-red-600" />,
      keywords: searchLocation
        ? `bookstores in ${searchLocation}, reading spaces ${searchLocation}, books ${searchLocation}`
        : 'bookstores, reading spaces, books, literary culture, cozy atmosphere',
      hero: searchLocation ? `Bookstores in ${searchLocation}` : 'Cozy Bookstores',
      subtitle: searchLocation
        ? `Books and reading nooks in ${searchLocation}`
        : 'Books, reading nooks, and literary inspiration'
    },
    'art-galleries': {
      title: searchLocation ? `Art Galleries in ${searchLocation}` : 'Art Galleries & Creative Spaces',
      description: searchLocation
        ? `Explore art galleries and creative spaces in ${searchLocation} that inspire and showcase artistic talent.`
        : 'Explore art galleries and creative spaces that inspire and showcase local and international artistic talent.',
      icon: <Palette size={48} className="text-pink-600" />,
      keywords: searchLocation
        ? `art galleries in ${searchLocation}, creative spaces ${searchLocation}, art ${searchLocation}`
        : 'art galleries, creative spaces, art, culture, exhibitions, artistic inspiration',
      hero: searchLocation ? `Art & Creative Spaces in ${searchLocation}` : 'Art & Creative Spaces',
      subtitle: searchLocation
        ? `Inspiration and creativity in ${searchLocation}`
        : 'Inspiration, creativity, and artistic expression'
    }
  };

  const currentCategory = category || 'cafes';
  const spaceType = categoryMap[currentCategory];
  const info = categoryInfo[currentCategory as keyof typeof categoryInfo] || categoryInfo['cafes'];

  useEffect(() => {
    const filterSpaces = async () => {
      if (!spaceType) return;

      let filtered: ThirdSpace[] = [];

      if (searchLocation && isFromSearch) {
        // If we have a search location, fetch location-specific results
        try {
          // Import the search function dynamically to avoid circular imports
          const { searchThirdSpacesByLocation } = await import('../services/locationSearch');
          
          // Get all spaces for the search location
          const locationSpaces = await searchThirdSpacesByLocation(searchLocation);
          
          // Filter by category type
          filtered = locationSpaces.filter(space => space.type === spaceType);
          
          console.log(`Found ${filtered.length} ${spaceTypeLabels[spaceType]?.toLowerCase()} in ${searchLocation}`);
        } catch (error) {
          console.error('Error filtering by location:', error);
          // Fallback to sample data filtering
          filtered = spacesData.filter(space => space.type === spaceType);
        }
      } else {
        // No search location, filter sample data by category
        filtered = spacesData.filter(space => space.type === spaceType);
      }

      setFilteredSpaces(filtered);
    };

    filterSpaces();

    // Track category page views with location context
    gtag('event', 'page_view', {
      page_title: info.title,
      page_location: `/category/${currentCategory}${searchLocation ? `?location=${searchLocation}` : ''}`,
      event_category: 'category_page',
      custom_parameter_category: currentCategory,
      custom_parameter_location: searchLocation || 'global',
      custom_parameter_from_search: isFromSearch
    });

    console.log(`Analytics: Category page viewed - ${currentCategory}${searchLocation ? ` in ${searchLocation}` : ''}`);
  }, [category, spaceType, currentCategory, searchLocation, isFromSearch, info.title]);

  const handleSpaceClick = (id: string) => {
    const space = filteredSpaces.find(space => space.id === id);
    setSelectedSpace(space || null);
    
    if (space) {
      gtag('event', 'space_click', {
        event_category: 'engagement',
        event_label: `${space.name} from ${currentCategory} category${searchLocation ? ` in ${searchLocation}` : ''}`,
        custom_parameter_space_name: space.name,
        custom_parameter_category: currentCategory,
        custom_parameter_location: searchLocation || 'global'
      });
    }
  };

  return (
    <>
      <SEOHead 
        title={`${info.title} | Finding Third Spaces`}
        description={info.description}
        keywords={info.keywords}
        type="website"
      />
      
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        {/* Location Context Banner */}
        {searchLocation && (
          <div className="bg-indigo-50 border-b border-indigo-100 py-3">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-center text-sm">
                <span className="text-indigo-700">
                  Showing {spaceTypeLabels[spaceType]?.toLowerCase() || 'spaces'} in{' '}
                  <strong>{searchLocation}</strong>
                  {isFromSearch && ' (from your search)'}
                </span>
                <a 
                  href={`/category/${currentCategory}`}
                  className="ml-4 text-indigo-600 hover:text-indigo-800 underline"
                >
                  View all {spaceTypeLabels[spaceType]?.toLowerCase() || 'spaces'}
                </a>
              </div>
            </div>
          </div>
        )}
        
        {/* Category Hero Section */}
        <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="flex justify-center mb-6">
              {info.icon}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {info.hero}
            </h1>
            <p className="text-xl text-indigo-100 max-w-2xl mx-auto mb-8">
              {info.subtitle}
            </p>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4 inline-block">
              <p className="text-indigo-100">
                <span className="font-semibold text-white">{filteredSpaces.length}</span> amazing {spaceTypeLabels[spaceType]?.toLowerCase() || 'spaces'} found
                {searchLocation && ` in ${searchLocation}`}
              </p>
            </div>
          </div>
        </section>

        {/* Category Description */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Why Choose {spaceTypeLabels[spaceType] || 'These Spaces'}
                {searchLocation && ` in ${searchLocation}`}?
              </h2>
              <div className="prose prose-lg text-gray-700">
                <p>{info.description}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Spaces Grid */}
        <section className="pb-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Explore {spaceTypeLabels[spaceType] || 'Spaces'}
              {searchLocation && ` in ${searchLocation}`}
            </h2>
            
            {filteredSpaces.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSpaces.map((space) => (
                  <SpaceCard 
                    key={space.id} 
                    space={space} 
                    onClick={handleSpaceClick}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-600 mb-4">
                  No {spaceTypeLabels[spaceType]?.toLowerCase() || 'spaces'} found
                  {searchLocation && ` in ${searchLocation}`}
                </h3>
                <p className="text-gray-500 mb-8">
                  {searchLocation 
                    ? `We don't have any ${spaceTypeLabels[spaceType]?.toLowerCase() || 'spaces'} in ${searchLocation} yet. Try exploring other categories or locations.`
                    : "We're always adding new spaces. Check back soon!"
                  }
                </p>
                
                {searchLocation && (
                  <div className="space-y-4">
                    {/* Suggest other categories in the same location */}
                    <div className="bg-blue-50 rounded-lg p-6 mb-6">
                      <h4 className="font-semibold text-blue-900 mb-3">
                        Try other categories in {searchLocation}:
                      </h4>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {Object.entries(categoryMap)
                          .filter(([, type]) => type !== spaceType)
                          .slice(0, 4)
                          .map(([categoryUrl, type]) => (
                          <a
                            key={categoryUrl}
                            href={`/category/${categoryUrl}?location=${encodeURIComponent(searchLocation)}&source=search`}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                          >
                            {spaceTypeLabels[type]}
                          </a>
                        ))}
                      </div>
                    </div>
                    
                    {/* Remove location filter */}
                    <div className="space-x-4">
                      <a 
                        href={`/category/${currentCategory}`}
                        className="inline-flex items-center bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200"
                      >
                        View all {spaceTypeLabels[spaceType]?.toLowerCase() || 'spaces'} globally
                      </a>
                      
                      <a 
                        href="/"
                        className="inline-flex items-center bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors duration-200"
                      >
                        Search another location
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        <Footer />
        
        {selectedSpace && (
          <SpaceDetail 
            space={selectedSpace} 
            onClose={() => setSelectedSpace(null)} 
          />
        )}
      </div>
    </>
  );
};

export default CategoryPage;