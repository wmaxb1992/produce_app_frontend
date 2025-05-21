import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { CreditCard, Plus } from 'lucide-react-native';
import useThemeStore from '@/store/useThemeStore';
import { PaymentMethod } from '@/types';

interface PaymentMethodSelectorProps {
  paymentMethods: PaymentMethod[];
  selectedPaymentMethodId: string | null;
  onSelectPaymentMethod: (id: string) => void;
  onAddPaymentMethod: () => void;
  style?: any;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  paymentMethods,
  selectedPaymentMethodId,
  onSelectPaymentMethod,
  onAddPaymentMethod,
  style,
}) => {
  const { getThemeValues } = useThemeStore();
  const theme = getThemeValues();
  const { colors } = theme;
  
  // Get card brand icon
  const getCardBrandIcon = (type: string) => {
    // In a real app, you would use actual card brand icons
    switch (type) {
      case 'visa':
        return <CreditCard size={24} color="#1A1F71" />;
      case 'mastercard':
        return <CreditCard size={24} color="#EB001B" />;
      case 'amex':
        return <CreditCard size={24} color="#006FCF" />;
      case 'discover':
        return <CreditCard size={24} color="#FF6600" />;
      default:
        return <CreditCard size={24} color={colors.primary} />;
    }
  };
  
  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.title, { color: colors.text }]}>
        Payment Method
      </Text>
      
      <View style={styles.methodsContainer}>
        {paymentMethods.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={[
              styles.methodCard,
              { borderColor: colors.border, backgroundColor: colors.card },
              selectedPaymentMethodId === method.id && { 
                borderColor: colors.primary,
                backgroundColor: `${colors.primary}10`,
              },
            ]}
            onPress={() => onSelectPaymentMethod(method.id)}
          >
            <View style={styles.methodContent}>
              {getCardBrandIcon(method.type)}
              
              <View style={styles.methodInfo}>
                <Text style={[styles.methodTitle, { color: colors.text }]}>
                  {method.type.toUpperCase()} •••• {method.last4}
                </Text>
                
                <Text style={[styles.methodSubtitle, { color: colors.subtext }]}>
                  Expires {method.expiryMonth}/{method.expiryYear}
                </Text>
              </View>
            </View>
            
            {selectedPaymentMethodId === method.id && (
              <View style={[styles.checkmark, { backgroundColor: colors.primary }]}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
        
        <TouchableOpacity
          style={[
            styles.addMethodCard,
            { borderColor: colors.primary, backgroundColor: colors.card },
          ]}
          onPress={onAddPaymentMethod}
        >
          <Plus size={20} color={colors.primary} />
          <Text style={[styles.addMethodText, { color: colors.primary }]}>
            Add Payment Method
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  methodsContainer: {
    marginBottom: 8,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 12,
  },
  methodContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  methodInfo: {
    marginLeft: 12,
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  methodSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  addMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 12,
  },
  addMethodText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
});

export default PaymentMethodSelector;