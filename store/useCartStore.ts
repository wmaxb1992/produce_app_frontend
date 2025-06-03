import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem, CartGroup, Product, Variety } from '@/types';

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  addVarietyToCart: (variety: Variety, products: Product[]) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getCartGroups: () => CartGroup[];
  generateMagicCart: (productIds: string[], allProducts: Product[]) => void;
}

// Helper function to select the best product from available options
const selectBestProduct = (products: Product[]): Product => {
  // Sort products by a weighted score
  return products.sort((a, b) => {
    // Calculate scores based on multiple factors
    const scoreA = calculateProductScore(a);
    const scoreB = calculateProductScore(b);
    return scoreB - scoreA;
  })[0]; // Return the product with the highest score
};

// Calculate a score for each product based on various factors
const calculateProductScore = (product: Product): number => {
  let score = 0;
  
  // Price factor (lower is better)
  score += (1 / product.price) * 10;
  
  // Rating factor
  score += product.rating * 2;
  
  // Freshness factor
  if (product.freshness) {
    score += (product.freshness / 100) * 5;
  }
  
  // Review count factor (more reviews = more reliable rating)
  score += Math.min(product.reviewCount / 100, 1) * 3;
  
  return score;
};

const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addVarietyToCart: (variety: Variety, products: Product[]) => {
        // Only consider products that are in stock and available for instant delivery
        const availableProducts = products.filter(p => 
          p.inStock && 
          p.availableForInstantDelivery && 
          p.variety === variety.id
        );

        if (availableProducts.length === 0) return;

        // Select the best product based on our algorithm
        const bestProduct = selectBestProduct(availableProducts);

        // Add the selected product to cart
        const existingItem = get().items.find(
          (item) => item.productId === bestProduct.id
        );

        let newItems;
        if (existingItem) {
          newItems = get().items.map((item) =>
            item.productId === bestProduct.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          const newItem: CartItem = {
            id: Math.random().toString(36).substr(2, 9),
            productId: bestProduct.id,
            name: bestProduct.name,
            price: bestProduct.price,
            quantity: 1,
            image: bestProduct.image,
            farmId: bestProduct.farmId,
            farmName: bestProduct.farmName,
            unit: bestProduct.unit,
          };
          newItems = [...get().items, newItem];
        }

        set({ items: newItems });
      },
      
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
              id: Math.random().toString(36).substr(2, 9),
              productId: product.id,
              farmId: product.farmId,
              farmName: product.farmName,
              quantity,
              price: product.price,
              name: product.name,
              image: product.image,
              unit: product.unit,
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
          
          // Group by farm
          const farmGroups: Record<string, CartGroup> = {};
          
          items.forEach(item => {
            if (!farmGroups[item.farmId]) {
              farmGroups[item.farmId] = {
                name: item.farmName,
                items: [],
                farms: {},
              };
            }
            farmGroups[item.farmId].items.push(item);

            // Add to farm subgroup
            if (!farmGroups[item.farmId].farms[item.farmId]) {
              farmGroups[item.farmId].farms[item.farmId] = {
                name: item.farmName,
                items: [],
              };
            }
            farmGroups[item.farmId].farms[item.farmId].items.push(item);
          });
          
          return Object.values(farmGroups);
        } catch (error) {
          console.error('Error getting cart groups:', error);
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