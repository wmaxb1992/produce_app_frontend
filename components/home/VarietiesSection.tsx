import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import VarietyCompactCard from '@/components/product/VarietyCompactCard';
import { varietiesSectionStyles } from '@/styles/components/home/varietiesSection';
import { useTheme } from '@/hooks/useTheme';
import useProductStore from '@/store/useProductStore';
import type { Variety } from '@/types';

interface VarietiesSectionProps {
  varieties: Variety[];
  selectedVariety: string | null;
  title?: string;
}

const VarietiesSection: React.FC<VarietiesSectionProps> = ({
  varieties,
  selectedVariety,
  title = "Popular Varieties"
}) => {
  const router = useRouter();
  const { colors } = useTheme();
  const { products } = useProductStore();

  // Group products by variety
  const varietyGroups = useMemo(() => {
    return varieties.map(variety => ({
      variety,
      products: products.filter(p => p.variety === variety.id)
    }));
  }, [varieties, products]);

  if (!varietyGroups.length) return null;

  const navigateToVarietiesScreen = () => {
    router.push('/browse');
  };

  return (
    <View style={[varietiesSectionStyles.section, { marginTop: 0 }]}> 
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          {varietyGroups[0]?.variety?.emoji ? `${varietyGroups[0].variety.emoji} ` : ''}{title}
        </Text>
        <TouchableOpacity 
          style={styles.viewAllButton}
          onPress={navigateToVarietiesScreen}
        >
          <Text style={[styles.viewAllText, { color: colors.primary }]}>See All</Text>
          <ChevronRight size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={varietyGroups}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={varietiesSectionStyles.container}
        renderItem={({ item }) => (
          <VarietyCompactCard 
            variety={item.variety}
            products={item.products}
            onPress={() => {}}
          />
        )}
        keyExtractor={(item) => item.variety.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
  }
});

export default VarietiesSection; 