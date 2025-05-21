import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Cart } from '@/types';
import useThemeStore from '@/store/useThemeStore';

interface CartSummaryProps {
  cart: Cart;
}

const CartSummary: React.FC<CartSummaryProps> = ({ cart }) => {
  const { getThemeValues } = useThemeStore();
  const theme = getThemeValues();
  const { colors } = theme;
  
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.subtext }]}>Subtotal</Text>
        <Text style={[styles.value, { color: colors.text }]}>${cart.subtotal.toFixed(2)}</Text>
      </View>
      
      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.subtext }]}>Delivery Fee</Text>
        <Text style={[styles.value, { color: colors.text }]}>${cart.deliveryFee.toFixed(2)}</Text>
      </View>
      
      <View style={[styles.divider, { backgroundColor: colors.border }]} />
      
      <View style={styles.row}>
        <Text style={[styles.totalLabel, { color: colors.text }]}>Total</Text>
        <Text style={[styles.totalValue, { color: colors.text }]}>${cart.total.toFixed(2)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
  },
});

export default CartSummary;