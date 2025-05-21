import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { useTheme } from '@/store/useThemeStore';
import { formatCurrency } from '@/utils/formatters';

interface CheckoutSummaryProps {
  subtotal: number;
  tax: number;
  shipping: number;
  discount?: number;
  total: number;
  onCheckout?: () => void;
  style?: any;
}

export const CheckoutSummary = ({
  subtotal,
  tax,
  shipping,
  discount = 0,
  total,
  onCheckout,
  style,
}: CheckoutSummaryProps) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>Order Summary</Text>
      
      <View style={styles.row}>
        <Text style={styles.label}>Subtotal</Text>
        <Text style={styles.value}>{formatCurrency(subtotal)}</Text>
      </View>
      
      <View style={styles.row}>
        <Text style={styles.label}>Shipping</Text>
        <Text style={styles.value}>
          {shipping === 0 ? 'Free' : formatCurrency(shipping)}
        </Text>
      </View>
      
      <View style={styles.row}>
        <Text style={styles.label}>Tax</Text>
        <Text style={styles.value}>{formatCurrency(tax)}</Text>
      </View>
      
      {discount > 0 && (
        <View style={styles.row}>
          <Text style={styles.label}>Discount</Text>
          <Text style={[styles.value, styles.discount]}>
            -{formatCurrency(discount)}
          </Text>
        </View>
      )}
      
      <View style={styles.divider} />
      
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
      </View>
      
      {onCheckout && (
        <TouchableOpacity 
          style={styles.checkoutButton}
          onPress={onCheckout}
          activeOpacity={0.8}
        >
          <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
          <ChevronRight size={20} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export const PromoCodeInput = ({
  onApply,
  style,
}: {
  onApply: (code: string) => void;
  style?: any;
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [promoCode, setPromoCode] = React.useState('');
  
  return (
    <View style={[styles.promoContainer, style]}>
      <Text style={styles.promoTitle}>Have a promo code?</Text>
      
      <View style={styles.promoInputContainer}>
        <TextInput
          style={styles.promoInput}
          value={promoCode}
          onChangeText={setPromoCode}
          placeholder="Enter promo code"
          placeholderTextColor={theme.colors.gray[400]}
        />
        <TouchableOpacity 
          style={[
            styles.promoButton,
            !promoCode ? styles.promoButtonDisabled : null
          ]}
          onPress={() => promoCode && onApply(promoCode)}
          disabled={!promoCode}
        >
          <Text style={styles.promoButtonText}>Apply</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      padding: 16,
      marginVertical: 16,
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 16,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    label: {
      fontSize: 16,
      color: theme.colors.gray[600],
    },
    value: {
      fontSize: 16,
      color: theme.colors.text,
    },
    discount: {
      color: theme.colors.success,
    },
    divider: {
      height: 1,
      backgroundColor: theme.colors.gray[200],
      marginVertical: 12,
    },
    totalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    totalLabel: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
    },
    totalValue: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
    },
    checkoutButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 8,
      paddingVertical: 14,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    checkoutButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
      marginRight: 8,
    },
    promoContainer: {
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
    },
    promoTitle: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.colors.text,
      marginBottom: 12,
    },
    promoInputContainer: {
      flexDirection: 'row',
    },
    promoInput: {
      flex: 1,
      height: 44,
      borderWidth: 1,
      borderColor: theme.colors.gray[300],
      borderRadius: 8,
      paddingHorizontal: 12,
      fontSize: 16,
      color: theme.colors.text,
      marginRight: 8,
    },
    promoButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 8,
      paddingHorizontal: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    promoButtonDisabled: {
      backgroundColor: theme.colors.gray[400],
    },
    promoButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '500',
    },
  });

export default CheckoutSummary;