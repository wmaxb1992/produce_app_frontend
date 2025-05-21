import { create } from 'zustand';
import { Farm, FarmPost } from '@/types';
import { mockFarms } from '@/mocks/farmData';
import { mockFarmPosts } from '@/mocks/socialData';

interface FarmState {
  farms: Farm[];
  farmPosts: FarmPost[];
  followedFarms: string[]; // Array of farm IDs
  isLoading: boolean;
  
  // Actions
  fetchFarmData: () => Promise<{ farms: Farm[]; farmPosts: FarmPost[] }>;
  getFarmById: (id: string) => Farm | undefined;
  getFarmsByDeliveryArea: (zipCode: string) => Farm[];
  getPostsByFarmId: (farmId: string) => FarmPost[];
  followFarm: (farmId: string) => void;
  unfollowFarm: (farmId: string) => void;
  isFollowingFarm: (farmId: string) => boolean;
  getFollowedFarms: () => Farm[];
}

const useFarmStore = create<FarmState>((set, get) => ({
  farms: [],
  farmPosts: [],
  followedFarms: [],
  isLoading: true,
  
  fetchFarmData: async () => {
    set({ isLoading: true });
    console.log('Starting to fetch farm data...');
    
    // Simulate a network request with a timeout
    try {
      // Shorter network delay for faster loading
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Pre-process the data before setting it in the state
      const processedFarms = [...mockFarms];
      const processedPosts = [...mockFarmPosts];
      
      // In a real app, you might do additional processing here
      
      console.log('Farm data processed and ready to display');
      
      // After processing, update the state all at once
      set({ 
        farms: processedFarms,
        farmPosts: processedPosts,
        isLoading: false // Only set to false after everything is ready
      });
      
      // Return the processed data for immediate use
      return {
        farms: processedFarms,
        farmPosts: processedPosts
      };
    } catch (error) {
      console.error('Error fetching farm data:', error);
      set({ isLoading: false });
      
      // Return empty arrays in case of error
      return {
        farms: [],
        farmPosts: []
      };
    }
  },
  
  getFarmById: (id) => {
    return get().farms.find(farm => farm.id === id);
  },
  
  getFarmsByDeliveryArea: (zipCode) => {
    return get().farms.filter(farm => 
      farm.deliveryZones.some(zone => 
        zone.areas.includes(zipCode)
      )
    );
  },
  
  getPostsByFarmId: (farmId) => {
    return get().farmPosts.filter(post => post.farmId === farmId);
  },
  
  followFarm: (farmId) => {
    const { followedFarms } = get();
    if (!followedFarms.includes(farmId)) {
      set({ followedFarms: [...followedFarms, farmId] });
    }
  },
  
  unfollowFarm: (farmId) => {
    const { followedFarms } = get();
    set({ followedFarms: followedFarms.filter(id => id !== farmId) });
  },
  
  isFollowingFarm: (farmId) => {
    return get().followedFarms.includes(farmId);
  },
  
  getFollowedFarms: () => {
    const { farms, followedFarms } = get();
    return farms.filter(farm => followedFarms.includes(farm.id));
  },
}));

export default useFarmStore;