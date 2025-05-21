import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import useProductStore from '@/store/useProductStore';
import useThemeStore from '@/store/useThemeStore';
import ProductCard from '@/components/product/ProductCard';
import defaultColors from '@/constants/colors';
import { homeStyles } from '@/styles/layouts/home';

interface FreshPicksProps {
  style?: any;
}

const FreshPicks: React.FC<FreshPicksProps> = ({ style }) => {
  const router = useRouter();
  const { products } = useProductStore();
  const themeStore = useThemeStore();
  const theme = themeStore.getThemeValues ? themeStore.getThemeValues() : { colors: defaultColors.light };
  const themeColors = theme.colors || defaultColors.light;

  const handleProductPress = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  return (
    <View style={[homeStyles.section, style]}>
      <Text style={[homeStyles.sectionTitle, { color: themeColors.text }]}>
        Fresh Picks
      </Text>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={homeStyles.carouselContainer}
        style={homeStyles.sectionContent}
        data={products.filter(p => (p.freshness || 0) >= 90)}
        keyExtractor={(product) => product.id}
        renderItem={({ item: product }) => (
          <ProductCard
            product={product}
            onPress={() => handleProductPress(product.id)}
            style={undefined}
          />
        )}
      />
    </View>
  );
};

export default FreshPicks;
