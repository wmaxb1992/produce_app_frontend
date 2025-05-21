import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem, CartGroup, Product } from '@/types';

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getCartGroups: () => CartGroup[];
  // New function for magic basket
  generateMagicCart: (productIds: string[], allProducts: Product[]) => void;
}

const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product: Product, quantity: number) => {
        set((state) => {
          // Check if item already exists in cart
          const existingItemIndex = state.items.findIndex(
            (item) => item.productId === product.id && item.farmId === product.farmId
          );
          
          if (existingItemIndex >= 0) {
            // Update quantity if item exists
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex].quantity += quantity;
            return { items: updatedItems };
          } else {
            // Add new item if it doesn't exist
            const newItem: CartItem = {
              id: `${product.id}-${product.farmId}-${Date.now()}`,
              productId: product.id,
              farmId: product.farmId,
              quantity,
              price: product.price,
              name: product.name,
              image: product.image,
              zone: product.zone,
            };
            return { items: [...state.items, newItem] };
          }
        });
      },
      
      removeItem: (itemId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }));
      },
      
      updateQuantity: (itemId: string, quantity: number) => {
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter((item) => item.id !== itemId),
            };
          }
          
          return {
            items: state.items.map((item) =>
              item.id === itemId ? { ...item, quantity } : item
            ),
          };
        });
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      getTotalItems: () => {
        try {
          const { items } = get();
          if (!items || !Array.isArray(items)) return 0;
          
          return items.reduce((total, item) => total + item.quantity, 0);
        } catch (error) {
          console.error("Error calculating total items:", error);
          return 0;
        }
      },
      
      getTotalPrice: () => {
        try {
          const { items } = get();
          if (!items || !Array.isArray(items)) return 0;
          
          return items.reduce((total, item) => total + (item.price * item.quantity), 0);
        } catch (error) {
          console.error("Error calculating total price:", error);
          return 0;
        }
      },
      
      getCartGroups: () => {
        try {
          const { items } = get();
          if (!items || !Array.isArray(items)) return [];
          
          // Group items by zone
          const groupedByZone: Record<string, CartItem[]> = {};
          
          items.forEach(item => {
            const zone = item.zone || 'unknown';
            if (!groupedByZone[zone]) {
              groupedByZone[zone] = [];
            }
            groupedByZone[zone].push(item);
          });
          
          // Create cart groups
          const cartGroups: CartGroup[] = Object.entries(groupedByZone).map(([zone, zoneItems]) => {
            // Group items by farm within each zone
            const farmGroups: Record<string, { name: string; items: CartItem[] }> = {};
            
            zoneItems.forEach(item => {
              if (!farmGroups[item.farmId]) {
                farmGroups[item.farmId] = {
                  name: `Farm ${item.farmId}`, // This should be replaced with actual farm name
                  items: [],
                };
              }
              farmGroups[item.farmId].items.push(item);
            });
            
            return {
              zone,
              items: zoneItems,
              farms: farmGroups,
            };
          });
          
          return cartGroups;
        } catch (error) {
          console.error("Error grouping cart items:", error);
          return [];
        }
      },
      
      // Function to generate a magic basket and add products to cart
      generateMagicCart: (productIds: string[], allProducts: Product[]) => {
        try {
          // Clear existing cart first
          set({ items: [] });
          
          // Find products by IDs and add them to cart
          productIds.forEach(productId => {
            const product = allProducts.find(p => p.id === productId);
            if (product) {
              // Use the existing addItem function
              get().addItem(product, 1);
            }
          });
        } catch (error) {
          console.error("Error generating magic cart:", error);
        }
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Add error handling for rehydration
      onRehydrateStorage: () => (state) => {
        if (!state) {
          console.warn('Failed to rehydrate cart store');
        }
      },
    }
  )
);

export default useCartStore;