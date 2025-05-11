export interface ThirdSpace {
  id: string;
  name: string;
  type: SpaceType;
  description: string;
  amenities: string[];
  address: string;
  city: string;
  imageUrl: string;
  rating: number;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export type SpaceType = 
  | 'cafe'
  | 'library'
  | 'coworking'
  | 'park'
  | 'community_center'
  | 'bookstore'
  | 'art_gallery';

export const spaceTypeLabels: Record<SpaceType, string> = {
  cafe: 'Café',
  library: 'Library',
  coworking: 'Coworking Space',
  park: 'Park',
  community_center: 'Community Center',
  bookstore: 'Bookstore',
  art_gallery: 'Art Gallery'
};