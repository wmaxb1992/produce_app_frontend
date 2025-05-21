import { create } from 'zustand';
import { SubscriptionBundle } from '@/types';

interface SubscriptionState {
  bundles: SubscriptionBundle[];
  userSubscriptions: string[]; // IDs of bundles the user is subscribed to
  isLoading: boolean;
  fetchBundles: () => Promise<{ bundles: SubscriptionBundle[] }>;
  subscribe: (bundleId: string, frequency: 'weekly' | 'monthly', deliveryDay: string) => void;
  unsubscribe: (bundleId: string) => void;
}

// Define mock bundles outside the store for better organization
const mockBundles: SubscriptionBundle[] = [
  {
    id: 'bundle-1',
    name: 'Seasonal Veggie Box',
    description: 'A curated selection of seasonal vegetables, perfect for a week of healthy meals.',
    image: 'https://images.unsplash.com/photo-1518843875459-f738682238a6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
    price: 49.99,
    weeklyPrice: 44.99,
    monthlyPrice: 39.99,
    discountPercentage: 25,
    items: {
      vegetables: 8,
      fruits: 0,
      herbs: 2
    },
    products: ['prod-1', 'prod-2', 'prod-3', 'prod-4', 'prod-5', 'prod-6', 'prod-7', 'prod-8', 'prod-9', 'prod-10'],
    farmName: 'Green Valley Farms'
  },
  {
    id: 'bundle-2',
    name: 'Fruit & Veggie Mix',
    description: 'The perfect balance of seasonal fruits and vegetables for a varied diet.',
    image: 'https://images.unsplash.com/photo-1573246123716-6b1782bfc499?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
    price: 59.99,
    weeklyPrice: 54.99,
    monthlyPrice: 49.99,
    discountPercentage: 30,
    items: {
      vegetables: 5,
      fruits: 5,
      herbs: 1
    },
    products: ['prod-2', 'prod-3', 'prod-6', 'prod-7', 'prod-11', 'prod-12', 'prod-13', 'prod-14', 'prod-15', 'prod-16', 'prod-17'],
    farmName: 'Sunny Acres'
  },
  {
    id: 'bundle-3',
    name: 'Herb & Greens Box',
    description: 'Fresh herbs and leafy greens for salads, garnishes, and healthy cooking.',
    image: 'https://images.unsplash.com/photo-1615484477778-ca3b77940c25?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
    price: 39.99,
    weeklyPrice: 34.99,
    monthlyPrice: 29.99,
    discountPercentage: 20,
    items: {
      vegetables: 3,
      fruits: 0,
      herbs: 6
    },
    products: ['prod-18', 'prod-19', 'prod-20', 'prod-21', 'prod-22', 'prod-23', 'prod-24', 'prod-25'],
    farmName: 'Herbal Haven'
  },
  {
    id: 'bundle-4',
    name: 'Family Harvest Box',
    description: 'A large selection of vegetables, fruits, and herbs for the whole family.',
    image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
    price: 79.99,
    weeklyPrice: 74.99,
    monthlyPrice: 69.99,
    discountPercentage: 35,
    items: {
      vegetables: 10,
      fruits: 6,
      herbs: 3
    },
    products: ['prod-1', 'prod-2', 'prod-3', 'prod-4', 'prod-5', 'prod-6', 'prod-7', 'prod-8', 'prod-11', 'prod-12', 'prod-13', 'prod-14', 'prod-15', 'prod-18', 'prod-19', 'prod-20', 'prod-21', 'prod-26'],
    farmName: 'Family Farms Cooperative'
  },
  {
    id: 'bundle-5',
    name: 'Root Vegetable Bundle',
    description: 'A selection of hearty root vegetables perfect for soups, stews, and roasting.',
    image: 'https://images.unsplash.com/photo-1635774855317-edf3ee4463db?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
    price: 45.99,
    weeklyPrice: 40.99,
    monthlyPrice: 35.99,
    discountPercentage: 22,
    items: {
      vegetables: 7,
      fruits: 0,
      herbs: 0
    },
    products: ['prod-27', 'prod-28', 'prod-29', 'prod-30', 'prod-31', 'prod-32', 'prod-33'],
    farmName: 'Root & Soil Farm'
  }
];

const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  bundles: [],
  userSubscriptions: [],
  isLoading: false,

  fetchBundles: async () => {
    set({ isLoading: true });
    
    try {
      // Shorter delay for faster loading
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Pre-process the data
      const processedBundles = [...mockBundles];
      
      // In a real app, this would be an API call and processing logic
      console.log('Subscription bundles processed and ready to display');
      
      set({ bundles: processedBundles, isLoading: false });
      
      // Return processed data for immediate use
      return { bundles: processedBundles };
    } catch (error) {
      console.error('Error fetching subscription bundles:', error);
      set({ isLoading: false });
      return { bundles: [] };
    }
  },

  subscribe: (bundleId, frequency, deliveryDay) => {
    // In a real app, this would make an API call to subscribe
    console.log(`Subscribed to bundle ${bundleId} with ${frequency} frequency for delivery on ${deliveryDay}`);
    set((state) => ({
      userSubscriptions: [...state.userSubscriptions, bundleId]
    }));
  },

  unsubscribe: (bundleId) => {
    // In a real app, this would make an API call to unsubscribe
    set((state) => ({
      userSubscriptions: state.userSubscriptions.filter(id => id !== bundleId)
    }));
  }
}));

export default useSubscriptionStore; 