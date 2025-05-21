import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Alert
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { ShoppingBag, Truck, AlertCircle, MapPin } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import useCartStore from '@/store/useCartStore';
import CartItem from '@/components/cart/CartItem';
import Button from '@/components/ui/Button';
import LoadingState from '@/components/ui/LoadingState';
import ErrorState from '@/components/ui/ErrorState';
import { CartItem as CartItemType, CartGroup } from '@/types';

export default function CartScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  
  // Add error handling for cart store
  const [items, setItems] = React.useState<CartItemType[]>([]);
  const [cartGroups, setCartGroups] = React.useState<CartGroup[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  
  // Get cart data from store
  React.useEffect(() => {
    try {
      const cartStore = useCartStore.getState();
      setItems(cartStore.items || []);
      
      // Get cart groups
      const groups = cartStore.getCartGroups();
      setCartGroups(groups || []);
    } catch (err) {
      console.error("Error accessing cart store:", err);
      setError(err instanceof Error ? err : new Error("Failed to load cart data"));
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Subscribe to cart store changes
  React.useEffect(() => {
    const unsubscribe = useCartStore.subscribe(
      (state) => {
        setItems(state.items || []);
        setCartGroups(state.getCartGroups());
      }
    );
    
    return () => {
      unsubscribe();
    };
  }, []);
  
  const handleCheckout = () => {
    // Check if cart is empty
    if (items.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to your cart before checking out.');
      return;
    }
    
    // Navigate to checkout
    router.push('/checkout');
  };
  
  const handleClearCart = () => {
    if (items.length === 0) return;
    
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          onPress: () => {
            try {
              useCartStore.getState().clearCart();
            } catch (err) {
              console.error("Error clearing cart:", err);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };
  
  // Show loading state
  if (isLoading) {
    return (
      <>
        <Stack.Screen options={{ title: 'Your Cart' }} />
        <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
          <LoadingState message="Loading your cart..." />
        </View>
      </>
    );
  }
  
  // Show error state
  if (error) {
    return (
      <>
        <Stack.Screen options={{ title: 'Your Cart' }} />
        <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
          <ErrorState 
            message="Could not load your cart" 
            onRetry={() => router.reload()}
          />
        </View>
      </>
    );
  }
  
  if (!items || items.length === 0) {
    return (
      <>
        <Stack.Screen options={{ title: 'Your Cart' }} />
        <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
          <ShoppingBag size={64} color={colors.gray[300]} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            Your cart is empty
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.subtext }]}>
            Add some fresh products to get started
          </Text>
          <Button
            variant="primary"
            style={{ marginTop: 24 }}
            onPress={() => router.push('/')}
          >
            Browse Products
          </Button>
        </View>
      </>
    );
  }
  
  // Calculate total price
  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  return (
    <>
      <Stack.Screen options={{ title: 'Your Cart' }} />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ScrollView>
          {cartGroups.map((group, index) => (
            <View 
              key={index} 
              style={[styles.cartContainer, { backgroundColor: colors.card }]}
            >
              <View style={styles.zoneHeader}>
                <View style={styles.zoneInfo}>
                  <MapPin size={18} color={colors.primary} />
                  <Text style={[styles.zoneName, { color: colors.text }]}>
                    {group.zone || "Unknown"} Delivery Zone
                  </Text>
                </View>
                
                <View style={styles.deliveryInfo}>
                  <Truck size={14} color={colors.primary} />
                  <Text style={[styles.deliveryText, { color: colors.subtext }]}>
                    Delivery available
                  </Text>
                </View>
              </View>
              
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              
              {Object.entries(group.farms || {}).map(([farmId, farmData], farmIndex) => (
                <View key={farmId}>
                  <View style={styles.farmHeader}>
                    <Text style={[styles.farmName, { color: colors.text }]}>
                      {farmData.name || `Farm ${farmId}`}
                    </Text>
                    
                    <TouchableOpacity 
                      style={[styles.viewFarmButton, { borderColor: colors.primary }]}
                      onPress={() => router.push(`/farm/${farmId}`)}
                    >
                      <Text style={[styles.viewFarmText, { color: colors.primary }]}>
                        View Farm
                      </Text>
                    </TouchableOpacity>
                  </View>
                  
                  {farmData.items && farmData.items.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                  
                  {farmIndex < Object.keys(group.farms || {}).length - 1 && (
                    <View style={[styles.farmDivider, { backgroundColor: colors.border }]} />
                  )}
                </View>
              ))}
            </View>
          ))}
          
          <View style={[styles.noteContainer, { backgroundColor: colors.gray[100] }]}>
            <AlertCircle size={16} color={colors.info} />
            <Text style={[styles.noteText, { color: colors.subtext }]}>
              Products from the same delivery zone will be delivered together
            </Text>
          </View>
        </ScrollView>
        
        <View style={[styles.footer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
          <View style={styles.footerContent}>
            <View>
              <Text style={[styles.totalLabel, { color: colors.subtext }]}>
                Total
              </Text>
              <Text style={[styles.totalPrice, { color: colors.text }]}>
                ${getTotalPrice().toFixed(2)}
              </Text>
            </View>
            
            <View style={styles.footerButtons}>
              <TouchableOpacity 
                style={[styles.clearButton, { borderColor: colors.error }]}
                onPress={handleClearCart}
              >
                <Text style={[styles.clearButtonText, { color: colors.error }]}>
                  Clear
                </Text>
              </TouchableOpacity>
              
              <Button
                variant="primary"
                onPress={handleCheckout}
              >
                Checkout
              </Button>
            </View>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  cartContainer: {
    margin: 16,
    marginBottom: 0,
    padding: 16,
    borderRadius: 12,
  },
  zoneHeader: {
    marginBottom: 12,
  },
  zoneInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  zoneName: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 26,
  },
  deliveryText: {
    fontSize: 14,
    marginLeft: 4,
  },
  divider: {
    height: 1,
    marginBottom: 16,
  },
  farmHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  farmName: {
    fontSize: 16,
    fontWeight: '600',
  },
  viewFarmButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  viewFarmText: {
    fontSize: 14,
    fontWeight: '500',
  },
  farmDivider: {
    height: 1,
    marginVertical: 16,
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    margin: 16,
    borderRadius: 8,
  },
  noteText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  footer: {
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: '700',
  },
  footerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clearButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 12,
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
});