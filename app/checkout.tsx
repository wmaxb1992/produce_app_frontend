import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  Platform,
  ActivityIndicator
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { ChevronRight, CreditCard, MapPin, ShoppingBag, Check } from 'lucide-react-native';

import useThemeStore from '@/store/useThemeStore';
import useCartStore from '@/store/useCartStore';
import useUserStore from '@/store/useUserStore';
import useOrderStore from '@/store/useOrderStore';
import Button from '@/components/ui/Button';
import AddressCard from '@/components/user/AddressCard';
import PaymentMethodCard from '@/components/user/PaymentMethodCard';
import CheckoutSummary from '@/components/checkout/CheckoutSummary';
import DeliveryOptions from '@/components/checkout/DeliveryOptions';
import { Order } from '@/components/user/OrderCard';

// Define delivery option types if they don't exist in types
type DeliveryMethod = 'standard' | 'express' | 'pickup';

interface DeliveryOption {
  id: string;
  type: DeliveryMethod;
  name: string;
  description: string;
  price: number;
  estimatedDelivery: string;
  pickupLocation?: {
    name: string;
    address: string;
  };
  availableTimeSlots?: string[];
}

// Mock delivery options
const DELIVERY_OPTIONS: DeliveryOption[] = [
  {
    id: 'standard',
    type: 'standard' as DeliveryMethod,
    name: 'Standard Delivery',
    description: 'Delivery within 3-5 days',
    price: 4.99,
    estimatedDelivery: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'express',
    type: 'express' as DeliveryMethod,
    name: 'Express Delivery',
    description: 'Delivery within 1-2 days',
    price: 9.99,
    estimatedDelivery: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'pickup',
    type: 'pickup' as DeliveryMethod,
    name: 'Local Pickup',
    description: 'Pick up from our distribution center',
    price: 0,
    estimatedDelivery: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    pickupLocation: {
      name: 'Farm Fresh Distribution Center',
      address: '123 Harvest Lane, Farmville, CA 94107',
    },
    availableTimeSlots: [
      '9:00 AM - 12:00 PM',
      '12:00 PM - 3:00 PM',
      '3:00 PM - 6:00 PM',
    ],
  },
];

export default function CheckoutScreen() {
  const router = useRouter();
  
  // Get theme values
  const { getThemeValues } = useThemeStore();
  const theme = getThemeValues();
  const { colors } = theme;
  
  // Get cart data
  const { items, getTotalPrice, clearCart } = useCartStore();
  
  // Get user data
  const { user, isLoggedIn } = useUserStore();
  
  // Get order store
  const { addOrder } = useOrderStore();
  
  // State for checkout
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string | null>(null);
  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState<string>('standard');
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [isAddingPayment, setIsAddingPayment] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Calculate order totals
  const subtotal = getTotalPrice();
  const deliveryFee = DELIVERY_OPTIONS.find(option => option.id === selectedDeliveryOption)?.price || 0;
  const tax = subtotal * 0.08; // 8% tax rate
  const total = subtotal + deliveryFee + tax;
  
  // Set default selections on load
  useEffect(() => {
    if (user) {
      // Set default address
      const defaultAddress = user.addresses && user.addresses.find(addr => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
      } else if (user.addresses && user.addresses.length > 0) {
        setSelectedAddressId(user.addresses[0].id);
      }
      
      // Set default payment method
      const defaultPayment = user.paymentMethods && user.paymentMethods.find(pm => pm.isDefault);
      if (defaultPayment) {
        setSelectedPaymentMethodId(defaultPayment.id);
      } else if (user.paymentMethods && user.paymentMethods.length > 0) {
        setSelectedPaymentMethodId(user.paymentMethods[0].id);
      }
    }
  }, [user]);
  
  // Redirect to login if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      router.replace('/auth/login');
    }
  }, [isLoggedIn, router]);
  
  // Redirect to cart if no items
  useEffect(() => {
    if (items.length === 0) {
      router.replace('/cart');
    }
  }, [items, router]);
  
  const handlePlaceOrder = async () => {
    // Validate required selections
    if (!selectedAddressId) {
      Alert.alert('Missing Address', 'Please select a delivery address');
      return;
    }
    
    if (!selectedPaymentMethodId) {
      Alert.alert('Missing Payment', 'Please select a payment method');
      return;
    }
    
    if (!user) {
      Alert.alert('User Error', 'You must be logged in to place an order');
      return;
    }
    
    try {
      setIsProcessing(true);
      
      // Find selected address and payment method
      const selectedAddress = user.addresses?.find(addr => addr.id === selectedAddressId);
      const selectedPaymentMethod = user.paymentMethods?.find(pm => pm.id === selectedPaymentMethodId);
      
      if (!selectedAddress || !selectedPaymentMethod) {
        throw new Error('Missing address or payment method');
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create new order ID
      const orderId = `ORD-${Date.now()}`;
      
      // Map cart items to order items
      const orderItems = items.map(item => ({
        id: `item-${Date.now()}-${item.id}`,
        productId: item.productId || item.id,
        productName: item.name,
        productImage: item.image,
        quantity: item.quantity,
        price: item.price,
        farmId: item.farmId,
        farmName: item.farmName,
      }));
      
      // Create new order
      const newOrder: Order = {
        id: orderId,
        userId: user.id,
        status: 'pending',
        total: total,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        items: orderItems,
        shippingAddress: {
          name: selectedAddress.name || selectedAddress.street,
          street: selectedAddress.street,
          city: selectedAddress.city,
          state: selectedAddress.state,
          zipCode: selectedAddress.zip,
        },
      };
      
      // Add order to store
      addOrder(newOrder);
      
      // Success - clear cart and navigate to confirmation
      clearCart();
      
      // Navigate to confirmation
      router.replace({
        pathname: '/payment/confirmation',
        params: { 
          orderId: orderId,
          total: total.toFixed(2)
        }
      });
    } catch (error) {
      console.error('Error processing order:', error);
      Alert.alert(
        'Payment Failed',
        'There was an error processing your payment. Please try again.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddAddress = () => {
    // Navigate to add address screen
    router.push('/user/add-address');
  };

  const handleAddPaymentMethod = () => {
    // Navigate to add payment method screen
    router.push('/payment/add-method');
  };
  
  // Set header title
  return (
    <>
      <Stack.Screen options={{ 
        title: 'Checkout',
        headerBackTitle: 'Cart'
      }} />
      
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Delivery Address Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <MapPin size={20} color={colors.primary} />
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Delivery Address
                </Text>
              </View>
              
              <TouchableOpacity 
                style={styles.addButton}
                onPress={handleAddAddress}
              >
                <Text style={[styles.addButtonText, { color: colors.primary }]}>
                  + Add New
                </Text>
              </TouchableOpacity>
            </View>
            
            {!user?.addresses || user.addresses.length === 0 ? (
              <View style={[styles.emptyState, { borderColor: colors.border }]}>
                <Text style={[styles.emptyStateText, { color: colors.subtext }]}>
                  No addresses saved. Add a delivery address to continue.
                </Text>
              </View>
            ) : (
              <View style={styles.addressList}>
                {user.addresses.map(address => (
                  <AddressCard
                    key={address.id}
                    address={{
                      id: address.id,
                      name: address.street,
                      street: address.street,
                      city: address.city,
                      state: address.state,
                      zipCode: address.zip,
                      country: 'United States',
                      isDefault: address.isDefault,
                      instructions: address.instructions,
                    }}
                    isSelected={selectedAddressId === address.id}
                    onSelect={(addr) => setSelectedAddressId(addr.id)}
                    style={styles.addressCard}
                  />
                ))}
              </View>
            )}
          </View>
          
          {/* Delivery Options Section */}
          <View style={styles.section}>
            <DeliveryOptions
              options={DELIVERY_OPTIONS}
              selectedOption={selectedDeliveryOption}
              onSelect={setSelectedDeliveryOption}
            />
          </View>
          
          {/* Payment Method Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <CreditCard size={20} color={colors.primary} />
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Payment Method
                </Text>
              </View>
              
              <TouchableOpacity 
                style={styles.addButton}
                onPress={handleAddPaymentMethod}
              >
                <Text style={[styles.addButtonText, { color: colors.primary }]}>
                  + Add New
                </Text>
              </TouchableOpacity>
            </View>
            
            {!user?.paymentMethods || user.paymentMethods.length === 0 ? (
              <View style={[styles.emptyState, { borderColor: colors.border }]}>
                <Text style={[styles.emptyStateText, { color: colors.subtext }]}>
                  No payment methods saved. Add a payment method to continue.
                </Text>
              </View>
            ) : (
              <View style={styles.paymentList}>
                {user.paymentMethods.map((payment) => (
                  <PaymentMethodCard
                    key={payment.id}
                    paymentMethod={{
                      id: payment.id,
                      type: 'card',
                      isDefault: payment.isDefault,
                      cardType: payment.type as any,
                      last4: payment.last4,
                      expiryMonth: '12', // Default month if not available
                      expiryYear: '2025', // Default year if not available
                    }}
                    isSelected={selectedPaymentMethodId === payment.id}
                    onSelect={(pm) => setSelectedPaymentMethodId(pm.id)}
                    style={styles.paymentCard}
                  />
                ))}
              </View>
            )}
          </View>
          
          {/* Order Summary Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <ShoppingBag size={20} color={colors.primary} />
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Order Summary
                </Text>
              </View>
            </View>
            
            <View style={[styles.summaryContainer, { backgroundColor: colors.card }]}>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.subtext }]}>
                  Subtotal ({items.length} items)
                </Text>
                <Text style={[styles.summaryValue, { color: colors.text }]}>
                  ${subtotal.toFixed(2)}
                </Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.subtext }]}>
                  Delivery Fee
                </Text>
                <Text style={[styles.summaryValue, { color: colors.text }]}>
                  {deliveryFee === 0 ? 'Free' : `$${deliveryFee.toFixed(2)}`}
                </Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.subtext }]}>
                  Tax
                </Text>
                <Text style={[styles.summaryValue, { color: colors.text }]}>
                  ${tax.toFixed(2)}
                </Text>
              </View>
              
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              
              <View style={styles.summaryRow}>
                <Text style={[styles.totalLabel, { color: colors.text }]}>
                  Total
                </Text>
                <Text style={[styles.totalValue, { color: colors.text }]}>
                  ${total.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
          
          {/* Spacing for fixed button */}
          <View style={{ height: 100 }} />
        </ScrollView>
        
        {/* Fixed Place Order Button */}
        <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
          <Button
            variant="primary"
            onPress={handlePlaceOrder}
            disabled={isProcessing || !selectedAddressId || !selectedPaymentMethodId}
            style={styles.placeOrderButton}
          >
            {isProcessing ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Text style={styles.placeOrderText}>Place Order</Text>
                <ChevronRight size={20} color="#FFFFFF" />
              </>
            )}
          </Button>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  addButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  emptyState: {
    padding: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    textAlign: 'center',
  },
  addressList: {
    marginBottom: 8,
  },
  addressCard: {
    marginBottom: 12,
  },
  paymentList: {
    marginBottom: 8,
  },
  paymentCard: {
    marginBottom: 12,
  },
  summaryContainer: {
    padding: 16,
    borderRadius: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
  },
  placeOrderButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeOrderText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 4,
  },
});