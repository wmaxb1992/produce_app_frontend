import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { 
  Package, 
  Truck, 
  MapPin, 
  CreditCard, 
  ArrowLeft,
  MessageCircle,
  ShoppingBag
} from 'lucide-react-native';

import useThemeStore from '@/store/useThemeStore';
import OrderCard, { Order, OrderDetailHeader } from '@/components/user/OrderCard';
import Button from '@/components/ui/Button';
import { mockOrders } from '@/mocks/orderData';
import { formatDate, formatCurrency } from '@/utils/formatters';

export default function OrderDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  
  // Get theme values
  const { getThemeValues } = useThemeStore();
  const theme = getThemeValues();
  const { colors } = theme;
  
  // State
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch order
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // In a real app, you would fetch the order from an API
        // For now, we'll use mock data
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
        
        const foundOrder = mockOrders.find(o => o.id === id);
        if (foundOrder) {
          setOrder(foundOrder);
        } else {
          Alert.alert('Error', 'Order not found');
          router.back();
        }
      } catch (error) {
        console.error('Error fetching order:', error);
        Alert.alert('Error', 'Failed to load order details');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) {
      fetchOrder();
    }
  }, [id]);
  
  // Handle contact seller
  const handleContactSeller = () => {
    // In a real app, this would open a chat with the seller
    Alert.alert('Contact Seller', 'This feature is not implemented yet');
  };
  
  // Handle reorder
  const handleReorder = () => {
    // In a real app, this would add all items to cart
    Alert.alert('Reorder', 'Items have been added to your cart');
    router.push('/cart');
  };
  
  if (isLoading) {
    return (
      <>
        <Stack.Screen options={{ 
          title: 'Order Details',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }} />
        
        <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.subtext }]}>
            Loading order details...
          </Text>
        </View>
      </>
    );
  }
  
  if (!order) {
    return (
      <>
        <Stack.Screen options={{ 
          title: 'Order Details',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }} />
        
        <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
          <Package size={64} color={colors.gray[300]} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            Order not found
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.subtext }]}>
            The order you're looking for doesn't exist or has been removed
          </Text>
          <TouchableOpacity 
            style={[styles.backButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/orders')}
          >
            <Text style={styles.backButtonText}>View All Orders</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }
  
  return (
    <>
      <Stack.Screen options={{ 
        title: `Order #${order.id.slice(-6)}`,
        headerLeft: () => (
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
        ),
      }} />
      
      <ScrollView 
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Order Header */}
        <OrderDetailHeader order={order} />
        
        {/* Order Items */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Order Items
          </Text>
          
          {order.items.map((item) => (
            <View key={item.id} style={styles.orderItem}>
              <View style={styles.itemImageContainer}>
                {item.productImage ? (
                  <Image source={{ uri: item.productImage }} style={styles.itemImage} />
                ) : (
                  <View style={[styles.itemImagePlaceholder, { backgroundColor: colors.gray[200] }]} />
                )}
              </View>
              
              <View style={styles.itemDetails}>
                <Text style={[styles.itemName, { color: colors.text }]}>
                  {item.productName}
                </Text>
                <Text style={[styles.itemFarm, { color: colors.subtext }]}>
                  {item.farmName}
                </Text>
                <View style={styles.itemPriceRow}>
                  <Text style={[styles.itemQuantity, { color: colors.subtext }]}>
                    {item.quantity} × {formatCurrency(item.price)}
                  </Text>
                  <Text style={[styles.itemTotal, { color: colors.text }]}>
                    {formatCurrency(item.price * item.quantity)}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
        
        {/* Shipping Information */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Shipping Information
          </Text>
          
          <View style={styles.infoRow}>
            <View style={[styles.infoIcon, { backgroundColor: `${colors.primary}15` }]}>
              <MapPin size={18} color={colors.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: colors.subtext }]}>
                Delivery Address
              </Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {order.shippingAddress.name}
              </Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {order.shippingAddress.street}
              </Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
              </Text>
            </View>
          </View>
          
          {order.trackingNumber && (
            <View style={styles.infoRow}>
              <View style={[styles.infoIcon, { backgroundColor: `${colors.primary}15` }]}>
                <Truck size={18} color={colors.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: colors.subtext }]}>
                  Tracking Number
                </Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                  {order.trackingNumber}
                </Text>
              </View>
            </View>
          )}
        </View>
        
        {/* Payment Information */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Payment Information
          </Text>
          
          <View style={styles.infoRow}>
            <View style={[styles.infoIcon, { backgroundColor: `${colors.primary}15` }]}>
              <CreditCard size={18} color={colors.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: colors.subtext }]}>
                Payment Method
              </Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                •••• 4242
              </Text>
            </View>
          </View>
          
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.subtext }]}>
              Subtotal
            </Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              {formatCurrency(order.total * 0.9)} {/* Simplified calculation */}
            </Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.subtext }]}>
              Shipping
            </Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              {formatCurrency(order.total * 0.05)} {/* Simplified calculation */}
            </Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.subtext }]}>
              Tax
            </Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              {formatCurrency(order.total * 0.05)} {/* Simplified calculation */}
            </Text>
          </View>
          
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          
          <View style={styles.summaryRow}>
            <Text style={[styles.totalLabel, { color: colors.text }]}>
              Total
            </Text>
            <Text style={[styles.totalValue, { color: colors.text }]}>
              {formatCurrency(order.total)}
            </Text>
          </View>
        </View>
        
        {/* Actions */}
        <View style={styles.actions}>
          <Button
            variant="outline"
            onPress={handleContactSeller}
            style={[styles.actionButton, { marginRight: 8 }]}
          >
            <MessageCircle size={18} color={colors.primary} style={{ marginRight: 8 }} />
            <Text style={[styles.actionButtonText, { color: colors.primary }]}>
              Contact Seller
            </Text>
          </Button>
          
          <Button
            variant="primary"
            onPress={handleReorder}
            style={styles.actionButton}
          >
            <ShoppingBag size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.reorderButtonText}>
              Reorder
            </Text>
          </Button>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
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
    marginBottom: 24,
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  orderItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  itemImageContainer: {
    marginRight: 12,
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  itemImagePlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  itemFarm: {
    fontSize: 14,
    marginBottom: 8,
  },
  itemPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemQuantity: {
    fontSize: 14,
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    marginBottom: 2,
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 14,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  reorderButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});