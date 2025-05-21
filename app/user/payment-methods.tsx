import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { CreditCard, Plus, Edit2, Trash2 } from 'lucide-react-native';

import useThemeStore from '@/store/useThemeStore';
import useUserStore from '@/store/useUserStore';
import Button from '@/components/ui/Button';
import { PaymentMethod } from '@/types';

export default function PaymentMethodsScreen() {
  const router = useRouter();
  
  // Get theme values
  const { getThemeValues } = useThemeStore();
  const theme = getThemeValues();
  const { colors } = theme;
  
  // Get user data
  const { user, removePaymentMethod, setDefaultPaymentMethod } = useUserStore();
  
  // State
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load payment methods
  useEffect(() => {
    const loadPaymentMethods = async () => {
      try {
        // In a real app, you might fetch payment methods from an API
        // For now, we'll use the payment methods from the user store
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
        
        if (user && user.paymentMethods) {
          setPaymentMethods(user.paymentMethods);
        }
      } catch (error) {
        console.error('Error loading payment methods:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPaymentMethods();
  }, [user]);
  
  // Handle add payment method
  const handleAddPaymentMethod = () => {
    router.push('/payment/add-method');
  };
  
  // Handle delete payment method
  const handleDeletePaymentMethod = (paymentMethod: PaymentMethod) => {
    Alert.alert(
      'Delete Payment Method',
      'Are you sure you want to delete this payment method?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            removePaymentMethod(paymentMethod.id);
            setPaymentMethods(paymentMethods.filter(pm => pm.id !== paymentMethod.id));
          },
        },
      ]
    );
  };
  
  // Handle set as default
  const handleSetDefault = (paymentMethod: PaymentMethod) => {
    setDefaultPaymentMethod(paymentMethod.id);
    setPaymentMethods(
      paymentMethods.map(pm => ({
        ...pm,
        default: pm.id === paymentMethod.id,
      }))
    );
  };
  
  // Get card brand icon color
  const getCardBrandColor = (type: string) => {
    switch (type) {
      case 'visa':
        return '#1A1F71';
      case 'mastercard':
        return '#EB001B';
      case 'amex':
        return '#006FCF';
      case 'discover':
        return '#FF6600';
      default:
        return colors.primary;
    }
  };
  
  return (
    <>
      <Stack.Screen options={{ 
        title: 'Payment Methods',
      }} />
      
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.subtext }]}>
              Loading your payment methods...
            </Text>
          </View>
        ) : (
          <>
            <ScrollView 
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {paymentMethods.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <CreditCard size={64} color={colors.gray[300]} />
                  <Text style={[styles.emptyTitle, { color: colors.text }]}>
                    No payment methods saved
                  </Text>
                  <Text style={[styles.emptySubtitle, { color: colors.subtext }]}>
                    Add a payment method to get started
                  </Text>
                </View>
              ) : (
                paymentMethods.map((paymentMethod) => (
                  <View 
                    key={paymentMethod.id} 
                    style={[
                      styles.paymentCard, 
                      { 
                        backgroundColor: colors.card,
                        borderColor: paymentMethod.default ? colors.primary : colors.border,
                      }
                    ]}
                  >
                    <View style={styles.paymentHeader}>
                      <View style={styles.paymentTitleContainer}>
                        <CreditCard 
                          size={20} 
                          color={getCardBrandColor(paymentMethod.type)} 
                        />
                        <Text style={[styles.paymentTitle, { color: colors.text }]}>
                          {paymentMethod.type.toUpperCase()} •••• {paymentMethod.last4}
                        </Text>
                      </View>
                      
                      {paymentMethod.default && (
                        <View style={[styles.defaultBadge, { backgroundColor: `${colors.primary}20` }]}>
                          <Text style={[styles.defaultText, { color: colors.primary }]}>
                            Default
                          </Text>
                        </View>
                      )}
                    </View>
                    
                    <Text style={[styles.paymentDetails, { color: colors.text }]}>
                      Expires {paymentMethod.expiryMonth}/{paymentMethod.expiryYear}
                    </Text>
                    
                    <View style={styles.paymentActions}>
                      {!paymentMethod.default && (
                        <TouchableOpacity 
                          style={[styles.setDefaultButton, { borderColor: colors.primary }]}
                          onPress={() => handleSetDefault(paymentMethod)}
                        >
                          <Text style={[styles.setDefaultText, { color: colors.primary }]}>
                            Set as Default
                          </Text>
                        </TouchableOpacity>
                      )}
                      
                      <View style={styles.actionButtons}>
                        <TouchableOpacity 
                          style={[styles.actionButton, { backgroundColor: `${colors.error}15` }]}
                          onPress={() => handleDeletePaymentMethod(paymentMethod)}
                        >
                          <Trash2 size={16} color={colors.error} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))
              )}
            </ScrollView>
            
            <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
              <Button
                variant="primary"
                onPress={handleAddPaymentMethod}
                style={styles.addButton}
              >
                <Plus size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.addButtonText}>Add Payment Method</Text>
              </Button>
            </View>
          </>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100, // Extra padding for footer
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
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
  paymentCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  paymentTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  defaultBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  defaultText: {
    fontSize: 12,
    fontWeight: '500',
  },
  paymentDetails: {
    fontSize: 14,
    marginBottom: 16,
  },
  paymentActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  setDefaultButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
  },
  setDefaultText: {
    fontSize: 12,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
  },
  addButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});