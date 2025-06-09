import React, { useState } from 'react';
import { ThirdSpace, SpaceType, spaceTypeLabels } from '../types';
import SpaceCard from './SpaceCard';
import { Grid, Columns, MapPin, RefreshCw } from 'lucide-react';

interface SpacesListProps {
  spaces: ThirdSpace[];
  onSpaceClick: (id: string) => void;
  loading?: boolean;
  usingRealData?: boolean;
  onFindNearby?: () => void;
  onResetToSample?: () => void;
  searchLocation?: string;
}

const SpacesList: React.FC<SpacesListProps> = ({ 
  spaces, 
  onSpaceClick, 
  loading = false,
  usingRealData = false,
  onFindNearby,
  onResetToSample,
  searchLocation = ''
}) => {
  const [selectedType, setSelectedType] = useState<SpaceType | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredSpaces = selectedType === 'all' 
    ? spaces 
    : spaces.filter(space => space.type === selectedType);

  const spaceTypes: Array<SpaceType | 'all'> = ['all', 'cafe', 'library', 'coworking', 'park', 'community_center', 'bookstore', 'art_gallery'];

  return (
    <section id="explore" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Explore Third Spaces</h2>
        
        {/* Status Bar */}
        {(usingRealData || loading) && (
          <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border-l-4 border-indigo-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <MapPin className="text-indigo-600 mr-2" size={20} />
                <span className="text-sm font-medium text-gray-700">
                  {loading ? 'Searching for nearby spaces...' : 
                   searchLocation ? `Showing ${spaces.length} spaces in ${searchLocation}` :
                   `Showing ${spaces.length} real spaces near you`}
                </span>
              </div>
              {!loading && usingRealData && onResetToSample && (
                <button
                  onClick={onResetToSample}
                  className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
                >
                  <RefreshCw size={16} className="mr-1" />
                  Show sample data
                </button>
              )}
            </div>
          </div>
        )}

        <div className="mb-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex overflow-x-auto pb-2 mb-4 md:mb-0 gap-2 hide-scrollbar">
            {spaceTypes.map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                  selectedType === type
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {type === 'all' ? 'All Spaces' : spaceTypeLabels[type]}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-4">
            {/* Find Nearby Button */}
            {!usingRealData && onFindNearby && (
              <button
                onClick={onFindNearby}
                disabled={loading}
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
              >
                <MapPin size={16} />
                {loading ? 'Finding...' : 'Find Near Me'}
              </button>
            )}
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">View:</span>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  viewMode === 'grid' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500 hover:bg-gray-100'
                }`}
                aria-label="Grid view"
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  viewMode === 'list' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500 hover:bg-gray-100'
                }`}
                aria-label="List view"
              >
                <Columns size={18} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-gray-600">Searching for nearby third spaces...</p>
          </div>
        )}
        
        {/* No Results */}
        {!loading && filteredSpaces.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No spaces found. Try another category.</p>
            {usingRealData && onFindNearby && (
              <button
                onClick={onFindNearby}
                className="text-indigo-600 hover:text-indigo-800"
              >
                Search again
              </button>
            )}
          </div>
        )}
        
        {/* Spaces Grid/List */}
        {!loading && filteredSpaces.length > 0 && (
          <div className={`
            ${viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
              : 'flex flex-col space-y-4'
            }
          `}>
            {filteredSpaces.map(space => (
              <SpaceCard 
                key={space.id} 
                space={space} 
                onClick={onSpaceClick}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default SpacesList;