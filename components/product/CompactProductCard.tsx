import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Product } from '@/types';
import { useTheme } from '@/hooks/useTheme';

interface CompactProductCardProps {
  product: Product;
  onPress: () => void;
}

const CARD_WIDTH = (Dimensions.get('window').width - 32 - 20) / 4; // 4 cards per row with padding

const CompactProductCard: React.FC<CompactProductCardProps> = ({ product, onPress }) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: colors.card }]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image 
        source={{ uri: product.image }} 
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
          {product.name}
        </Text>
        <Text style={[styles.price, { color: colors.text }]}>
          ${product.price.toFixed(2)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    marginRight: 8,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  image: {
    width: CARD_WIDTH,
    height: CARD_WIDTH,
  },
  content: {
    padding: 8,
  },
  name: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 2,
  },
  price: {
    fontSize: 12,
    fontWeight: '600',
  }
});

export default CompactProductCard;
