import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import useProductStore from '@/store/useProductStore';
import useCartStore from '@/store/useCartStore';
import { Product, Variety } from '@/types';
import VarietyCompactCard from '../product/VarietyCompactCard';
import { useTheme } from '@/hooks/useTheme';
import defaultColors from '@/constants/colors';
import { Zap } from 'lucide-react-native';

interface InstantlyAvailableSectionProps {
  style?: any;
}

interface VarietyGroup {
  variety: Variety;
  products: Product[];
}

const InstantlyAvailableSection: React.FC<InstantlyAvailableSectionProps> = ({ style }) => {
  const router = useRouter();
  const { colors } = useTheme();
  const { products, varieties } = useProductStore();
  const { addVarietyToCart } = useCartStore();

  // Group instant products by variety
  const varietyGroups = useMemo(() => {
    // Filter for products that are in stock and available for instant delivery
    const instantProducts = products.filter((p: Product) => 
      p.inStock && 
      !p.preHarvest && 
      p.availableForInstantDelivery
    );

    // Group products by variety
    const groups = new Map<string, VarietyGroup>();
    
    instantProducts.forEach((product: Product) => {
      if (!product.variety) return;
      
      const variety = varieties.find((v: Variety) => v.id === product.variety);
      if (!variety) return;

      if (!groups.has(variety.id)) {
        groups.set(variety.id, {
          variety,
          products: []
        });
      }
      groups.get(variety.id)?.products.push(product);
    });

    return Array.from(groups.values());
  }, [products, varieties]);

  const handleProductPress = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  if (varietyGroups.length === 0) return null;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.titleContainer}>
        <Zap size={18} color="#4CAF50" fill="#A5D6A7" stroke="#1B5E20" strokeWidth={1.0} />
        <Text style={[styles.title, { color: colors.text }]}>
          Instant Delivery
        </Text>
      </View>
      <FlatList
        data={varietyGroups}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <VarietyCompactCard 
            variety={item.variety}
            products={item.products}
            onPress={() => addVarietyToCart(item.variety, item.products)}
          />
        )}
        keyExtractor={(item) => item.variety.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    marginTop: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 12,
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
});

export default InstantlyAvailableSection;
