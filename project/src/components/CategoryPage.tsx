import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
  const [selectedSpace, setSelectedSpace] = useState<ThirdSpace | null>(null);
  const [filteredSpaces, setFilteredSpaces] = useState<ThirdSpace[]>([]);

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
      title: 'Best Cafes & Coffee Shops',
      description: 'Discover amazing cafes and coffee shops perfect for work, study, or socializing. Find spaces with great coffee, WiFi, and atmosphere.',
      icon: <Coffee size={48} className="text-amber-600" />,
      keywords: 'cafes, coffee shops, third spaces, work from cafe, study cafe, coffee culture',
      hero: 'Find Your Perfect Cafe',
      subtitle: 'Great coffee, comfortable seating, and productive atmosphere'
    },
    'libraries': {
      title: 'Public Libraries & Study Spaces',
      description: 'Explore quiet libraries and study spaces ideal for focused work, research, and learning. Free WiFi and peaceful environments.',
      icon: <BookOpen size={48} className="text-blue-600" />,
      keywords: 'libraries, study spaces, quiet work, research, free wifi, public libraries',
      hero: 'Discover Inspiring Libraries',
      subtitle: 'Quiet spaces for study, research, and focused work'
    },
    'coworking': {
      title: 'Coworking Spaces & Shared Offices',
      description: 'Find professional coworking spaces and shared offices with networking opportunities, meeting rooms, and business amenities.',
      icon: <Users size={48} className="text-green-600" />,
      keywords: 'coworking spaces, shared offices, networking, professional workspace, meeting rooms',
      hero: 'Professional Coworking Spaces',
      subtitle: 'Network, collaborate, and grow your business'
    },
    'parks': {
      title: 'Parks & Outdoor Spaces',
      description: 'Enjoy fresh air and nature in beautiful parks and outdoor spaces perfect for relaxation, exercise, and outdoor activities.',
      icon: <TreePine size={48} className="text-emerald-600" />,
      keywords: 'parks, outdoor spaces, nature, fresh air, recreation, outdoor activities',
      hero: 'Beautiful Parks & Nature',
      subtitle: 'Fresh air, green spaces, and outdoor recreation'
    },
    'community-centers': {
      title: 'Community Centers & Hubs',
      description: 'Connect with your community at local centers offering events, classes, and gathering spaces for all ages.',
      icon: <Building size={48} className="text-purple-600" />,
      keywords: 'community centers, local community, events, classes, gathering spaces',
      hero: 'Community Centers & Hubs',
      subtitle: 'Connect, learn, and engage with your community'
    },
    'bookstores': {
      title: 'Bookstores & Reading Spaces',
      description: 'Browse books and enjoy reading in cozy bookstores with comfortable seating and literary atmosphere.',
      icon: <ShoppingBag size={48} className="text-red-600" />,
      keywords: 'bookstores, reading spaces, books, literary culture, cozy atmosphere',
      hero: 'Cozy Bookstores',
      subtitle: 'Books, reading nooks, and literary inspiration'
    },
    'art-galleries': {
      title: 'Art Galleries & Creative Spaces',
      description: 'Explore art galleries and creative spaces that inspire and showcase local and international artistic talent.',
      icon: <Palette size={48} className="text-pink-600" />,
      keywords: 'art galleries, creative spaces, art, culture, exhibitions, artistic inspiration',
      hero: 'Art & Creative Spaces',
      subtitle: 'Inspiration, creativity, and artistic expression'
    }
  };

  const currentCategory = (category && category in categoryInfo) ? category : 'cafes';
  const spaceType = categoryMap[currentCategory];
  const info = categoryInfo[currentCategory as keyof typeof categoryInfo] || categoryInfo['cafes'];
  
  useEffect(() => {
    // Filter spaces by category
    if (spaceType) {
      const filtered = spacesData.filter(space => space.type === spaceType);
      setFilteredSpaces(filtered);
    }

    // Track category page views
    gtag('event', 'page_view', {
      page_title: `${info.title} - Finding Third Spaces`,
      page_location: `/category/${currentCategory}`,
      event_category: 'category_page'
    });

    console.log(`Analytics: Category page viewed - ${currentCategory}`);
  }, [category, spaceType, currentCategory, info.title]);

  const handleSpaceClick = (id: string) => {
    const space = filteredSpaces.find(space => space.id === id);
    setSelectedSpace(space || null);
    
    if (space) {
      gtag('event', 'space_click', {
        event_category: 'engagement',
        event_label: `${space.name} from ${currentCategory} category`,
        custom_parameter_space_name: space.name,
        custom_parameter_category: currentCategory
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
                <span className="font-semibold text-white">{filteredSpaces.length}</span> amazing {spaceTypeLabels[spaceType] || 'spaces'} found
              </p>
            </div>
          </div>
        </section>

        {/* Category Description */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Why Choose {spaceTypeLabels[spaceType] || 'These Spaces'}?
              </h2>
              <div className="prose prose-lg text-gray-700">
                <p>{info.description}</p>
                
                {currentCategory === 'cafes' && (
                  <p>Perfect for remote work, casual meetings, studying, or simply enjoying great coffee in a social atmosphere. Many offer free WiFi, power outlets, and comfortable seating.</p>
                )}
                
                {currentCategory === 'libraries' && (
                  <p>Ideal for focused work, research, and learning. Libraries provide quiet environments, free resources, and often host community events and workshops.</p>
                )}
                
                {currentCategory === 'coworking' && (
                  <p>Professional environments designed for productivity and networking. Often include meeting rooms, high-speed internet, and opportunities to connect with other professionals.</p>
                )}

                {currentCategory === 'parks' && (
                  <p>Great for outdoor activities, exercise, relaxation, and connecting with nature. Many parks offer walking trails, recreational facilities, and peaceful environments.</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Spaces Grid */}
        <section className="pb-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Explore {spaceTypeLabels[spaceType] || 'Spaces'}
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
                  No {spaceTypeLabels[spaceType] || 'spaces'} found
                </h3>
                <p className="text-gray-500">
                  We're always adding new spaces. Check back soon!
                </p>
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