import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Address, PaymentMethod } from '@/types';

interface UserState {
  user: User | null;
  isLoggedIn: boolean;
  
  // Actions
  login: (user: User) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  addAddress: (address: Address) => void;
  removeAddress: (addressId: string) => void;
  setDefaultAddress: (addressId: string) => void;
  addPaymentMethod: (paymentMethod: PaymentMethod) => void;
  removePaymentMethod: (paymentMethodId: string) => void;
  setDefaultPaymentMethod: (paymentMethodId: string) => void;
  addFavoriteFarm: (farmId: string) => void;
  removeFavoriteFarm: (farmId: string) => void;
  addFavoriteProduct: (productId: string) => void;
  removeFavoriteProduct: (productId: string) => void;
  addFavoriteCategory: (categoryId: string) => void;
  removeFavoriteCategory: (categoryId: string) => void;
  addDietaryRestriction: (restriction: string) => void;
  removeDietaryRestriction: (restriction: string) => void;
}

// Mock user for development
const mockUser: User = {
  id: 'user1',
  username: 'johndoe',
  name: 'John Doe',
  email: 'john@example.com',
  phone: '555-123-4567',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  addresses: [
    {
      id: 'addr1',
      userId: 'user1',
      default: true,
      street: '123 Main St',
      city: 'Farmville',
      state: 'CA',
      zip: '94107',
      instructions: 'Leave at the front door',
    },
  ],
  preferences: {
    id: 'pref1',
    userId: 'user1',
    favoriteCategories: ['cat1', 'cat3'],
    dietaryRestrictions: ['organic', 'gluten-free'],
    favoriteProducts: ['prod1', 'prod5'],
    favoriteFarms: ['farm1', 'farm3'],
  },
  paymentMethods: [
    {
      id: 'pm1',
      default: true,
      type: 'visa',
      last4: '4242',
      expiryMonth: 12,
      expiryYear: 2025,
    },
  ],
};

const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: mockUser, // For development, in production this would be null initially
      isLoggedIn: true, // For development, in production this would be false initially
      
      login: (user) => {
        set({ user, isLoggedIn: true });
      },
      
      logout: () => {
        set({ user: null, isLoggedIn: false });
      },
      
      updateUser: (userData) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...userData } });
        }
      },
      
      addAddress: (address) => {
        const { user } = get();
        if (user) {
          // If this is the first address, make it default
          const isFirst = !user.addresses || user.addresses.length === 0;
          const newAddress = { ...address, default: address.default || isFirst };
          
          // If the new address is default, remove default from others
          let updatedAddresses = user.addresses ? [...user.addresses] : [];
          if (newAddress.default) {
            updatedAddresses = updatedAddresses.map(addr => ({
              ...addr,
              default: false,
            }));
          }
          
          set({
            user: {
              ...user,
              addresses: [...updatedAddresses, newAddress],
            },
          });
        }
      },
      
      removeAddress: (addressId) => {
        const { user } = get();
        if (user && user.addresses) {
          const updatedAddresses = user.addresses.filter(addr => addr.id !== addressId);
          
          // If we removed the default address, make the first one default
          if (user.addresses.find(addr => addr.id === addressId)?.default && updatedAddresses.length > 0) {
            updatedAddresses[0].default = true;
          }
          
          set({
            user: {
              ...user,
              addresses: updatedAddresses,
            },
          });
        }
      },
      
      setDefaultAddress: (addressId) => {
        const { user } = get();
        if (user && user.addresses) {
          const updatedAddresses = user.addresses.map(addr => ({
            ...addr,
            default: addr.id === addressId,
          }));
          
          set({
            user: {
              ...user,
              addresses: updatedAddresses,
            },
          });
        }
      },
      
      addPaymentMethod: (paymentMethod) => {
        const { user } = get();
        if (user) {
          // If this is the first payment method, make it default
          const isFirst = !user.paymentMethods || user.paymentMethods.length === 0;
          const newPaymentMethod = { ...paymentMethod, default: paymentMethod.default || isFirst };
          
          // If the new payment method is default, remove default from others
          let updatedPaymentMethods = user.paymentMethods ? [...user.paymentMethods] : [];
          if (newPaymentMethod.default) {
            updatedPaymentMethods = updatedPaymentMethods.map(pm => ({
              ...pm,
              default: false,
            }));
          }
          
          set({
            user: {
              ...user,
              paymentMethods: [...updatedPaymentMethods, newPaymentMethod],
            },
          });
        }
      },
      
      removePaymentMethod: (paymentMethodId) => {
        const { user } = get();
        if (user && user.paymentMethods) {
          const updatedPaymentMethods = user.paymentMethods.filter(pm => pm.id !== paymentMethodId);
          
          // If we removed the default payment method, make the first one default
          if (user.paymentMethods.find(pm => pm.id === paymentMethodId)?.default && updatedPaymentMethods.length > 0) {
            updatedPaymentMethods[0].default = true;
          }
          
          set({
            user: {
              ...user,
              paymentMethods: updatedPaymentMethods,
            },
          });
        }
      },
      
      setDefaultPaymentMethod: (paymentMethodId) => {
        const { user } = get();
        if (user && user.paymentMethods) {
          const updatedPaymentMethods = user.paymentMethods.map(pm => ({
            ...pm,
            default: pm.id === paymentMethodId,
          }));
          
          set({
            user: {
              ...user,
              paymentMethods: updatedPaymentMethods,
            },
          });
        }
      },
      
      addFavoriteFarm: (farmId) => {
        const { user } = get();
        if (user && user.preferences && !user.preferences.favoriteFarms.includes(farmId)) {
          set({
            user: {
              ...user,
              preferences: {
                ...user.preferences,
                favoriteFarms: [...user.preferences.favoriteFarms, farmId],
              },
            },
          });
        }
      },
      
      removeFavoriteFarm: (farmId) => {
        const { user } = get();
        if (user && user.preferences) {
          set({
            user: {
              ...user,
              preferences: {
                ...user.preferences,
                favoriteFarms: user.preferences.favoriteFarms.filter(id => id !== farmId),
              },
            },
          });
        }
      },
      
      addFavoriteProduct: (productId) => {
        const { user } = get();
        if (user && user.preferences && !user.preferences.favoriteProducts.includes(productId)) {
          set({
            user: {
              ...user,
              preferences: {
                ...user.preferences,
                favoriteProducts: [...user.preferences.favoriteProducts, productId],
              },
            },
          });
        }
      },
      
      removeFavoriteProduct: (productId) => {
        const { user } = get();
        if (user && user.preferences) {
          set({
            user: {
              ...user,
              preferences: {
                ...user.preferences,
                favoriteProducts: user.preferences.favoriteProducts.filter(id => id !== productId),
              },
            },
          });
        }
      },
      
      addFavoriteCategory: (categoryId) => {
        const { user } = get();
        if (user && user.preferences && !user.preferences.favoriteCategories.includes(categoryId)) {
          set({
            user: {
              ...user,
              preferences: {
                ...user.preferences,
                favoriteCategories: [...user.preferences.favoriteCategories, categoryId],
              },
            },
          });
        }
      },
      
      removeFavoriteCategory: (categoryId) => {
        const { user } = get();
        if (user && user.preferences) {
          set({
            user: {
              ...user,
              preferences: {
                ...user.preferences,
                favoriteCategories: user.preferences.favoriteCategories.filter(id => id !== categoryId),
              },
            },
          });
        }
      },
      
      addDietaryRestriction: (restriction) => {
        const { user } = get();
        if (user && user.preferences && !user.preferences.dietaryRestrictions.includes(restriction)) {
          set({
            user: {
              ...user,
              preferences: {
                ...user.preferences,
                dietaryRestrictions: [...user.preferences.dietaryRestrictions, restriction],
              },
            },
          });
        }
      },
      
      removeDietaryRestriction: (restriction) => {
        const { user } = get();
        if (user && user.preferences) {
          set({
            user: {
              ...user,
              preferences: {
                ...user.preferences,
                dietaryRestrictions: user.preferences.dietaryRestrictions.filter(r => r !== restriction),
              },
            },
          });
        }
      },
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useUserStore;