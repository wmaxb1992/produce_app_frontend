import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Order } from '@/components/user/OrderCard';
import { mockOrders } from '@/mocks/orderData';

interface OrderState {
  orders: Order[];
  
  // Actions
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  getOrdersByUserId: (userId: string) => Order[];
  clearOrders: () => void;
}

const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: mockOrders, // Initialize with mock data for development
      
      addOrder: (order) => {
        set((state) => ({
          orders: [...state.orders, order]
        }));
      },
      
      updateOrderStatus: (orderId, status) => {
        set((state) => ({
          orders: state.orders.map(order => 
            order.id === orderId 
              ? { ...order, status, updatedAt: new Date().toISOString() } 
              : order
          )
        }));
      },
      
      getOrdersByUserId: (userId) => {
        const { orders } = get();
        return orders.filter(order => order.userId === userId);
      },
      
      clearOrders: () => {
        set({ orders: [] });
      },
    }),
    {
      name: 'order-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useOrderStore; 