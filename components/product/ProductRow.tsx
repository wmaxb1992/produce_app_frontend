import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import useThemeStore from '@/store/useThemeStore';
import defaultColors from '@/constants/colors';

interface ProductRowProps {
  name: string;
  quantity: string;
}

const ProductRow: React.FC<ProductRowProps> = ({ name, quantity }) => {
  const { theme } = useThemeStore();
  const colors = theme?.colors || defaultColors.light;
  
  return (
    <View style={styles.productRow}>
      <Text style={[styles.productName, { color: colors.text }]}>{name}</Text>
      <Text style={[styles.productQuantity, { color: colors.subtext }]}>{quantity}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  productName: {
    fontSize: 14,
  },
  productQuantity: {
    fontSize: 14,
  },
});

export default ProductRow; 