import React from 'react';
import { Tabs } from 'expo-router';
import { Home, Search, Heart, ShoppingBag, User, Leaf } from 'lucide-react-native';
import { View, Text, ImageBackground } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import useCartStore from '@/store/useCartStore';
import SoilGradient from '../../assets/images/soil_gradient.png';

export default function TabsLayout() {
  const { colors } = useTheme();
  
  // Get cart item count
  const [cartItemCount, setCartItemCount] = React.useState(0);
  
  // Subscribe to cart store changes
  React.useEffect(() => {
    // Initialize cart count
    try {
      const count = useCartStore.getState().getTotalItems();
      setCartItemCount(count);
    } catch (error) {
      console.error("Error getting cart count:", error);
    }
    
    // Subscribe to cart store updates
    const unsubscribe = useCartStore.subscribe(
      (state) => {
        try {
          const count = state.getTotalItems();
          setCartItemCount(count);
        } catch (error) {
          console.error("Error updating cart count:", error);
        }
      }
    );
    
    return () => {
      unsubscribe();
    };
  }, []);
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.subtext,
        tabBarStyle: {
          backgroundColor: 'transparent',
          borderTopColor: colors.border,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: colors.card,
        },
        headerTintColor: colors.text,
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          headerShown: false
        }}
      />
      <Tabs.Screen
        name="browse"
        options={{
          title: 'Browse',
          tabBarIcon: ({ color, size }) => <Search size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favorites',
          tabBarIcon: ({ color, size }) => <Heart size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color, size }) => (
            <View>
              <ShoppingBag size={size} color={color} />
              {cartItemCount > 0 && (
                <View
                  style={{
                    position: 'absolute',
                    top: -6,
                    right: -8,
                    backgroundColor: colors.primary,
                    borderRadius: 10,
                    width: 18,
                    height: 18,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      color: '#FFFFFF',
                      fontSize: 10,
                      fontWeight: 'bold',
                    }}
                  >
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}