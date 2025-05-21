import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { Product } from '@/types';
import ProductCard from '@/components/product/ProductCard';
import { SeasonalBadge } from '@/components/product/SeasonalBadge';

interface SeasonalProductsSectionProps {
  products: Product[];
  loading?: boolean;
}

const SeasonalProductsSection: React.FC<SeasonalProductsSectionProps> = ({ 
  products,
  loading = false,
}) => {
  const router = useRouter();
  const { colors, season, isUsingSeasonalTheme } = useTheme();
  
  // If seasonal theme is not enabled or no products, don't render
  if (!isUsingSeasonalTheme || !products || products.length === 0) return null;
  
  // Filter products that are in season based on current season
  // This is simplified - in a real app, you'd have more sophisticated season matching
  const inSeasonProducts = products.filter(product => {
    if (!product.seasons) return false;
    return product.seasons.includes(season);
  });
  
  // If no in-season products after filtering, don't render
  if (inSeasonProducts.length === 0) return null;
  
  const handleViewAll = () => {
    // Navigate to a filtered screen showing all seasonal products
    router.push({
      pathname: '/search',
      params: { filter: 'seasonal', season }
    });
  };
  
  // Make sure colors object is available before using
  if (!colors) return null;
  
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: colors.text }]}>
            In Season Now
          </Text>
          <View style={styles.badgeContainer}>
            <SeasonalBadge 
              season={season}
              isInSeason={true}
              size="small"
            />
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.viewAllButton}
          onPress={handleViewAll}
        >
          <Text style={[styles.viewAllText, { color: colors.seasonal || colors.primary }]}>
            View All
          </Text>
          <ChevronRight size={16} color={colors.seasonal || colors.primary} />
        </TouchableOpacity>
      </View>
      
      <FlatList
        horizontal
        data={inSeasonProducts.slice(0, 10)} // Limit to 10 products
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.productContainer}>
            <ProductCard 
              product={item}
              onPress={() => router.push(`/product/${item.id}`)}
            />
          </View>
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  badgeContainer: {
    marginLeft: 4,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
  listContent: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  productContainer: {
    width: 160,
    marginRight: 12,
  },
});

export default SeasonalProductsSection; 