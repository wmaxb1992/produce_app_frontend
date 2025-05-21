import React from 'react';
import { View, Text, FlatList } from 'react-native';
import useThemeStore from '@/store/useThemeStore';
import useProductStore from '@/store/useProductStore';
import CategoryCard from '@/components/product/CategoryCard';
import defaultColors from '@/constants/colors';
import { homeStyles } from '@/styles/layouts/home';
import { Category } from '@/types';

interface CategoryListProps {
  style?: any;
  selectedCategory?: string | null;
  onCategoryPress?: (categoryId: string) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({ 
  style,
  selectedCategory,
  onCategoryPress 
}) => {
  const themeStore = useThemeStore();
  const theme = themeStore.getThemeValues ? themeStore.getThemeValues() : { colors: defaultColors.light };
  const themeColors = theme.colors || defaultColors.light;
  const { categories } = useProductStore();

  return (
    <View style={[homeStyles.section, style]}>
      <Text style={[homeStyles.sectionTitle, { color: themeColors.text }]}>
        Categories
      </Text>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        style={homeStyles.categoriesContainer}
        data={categories}
        keyExtractor={(category: Category) => category.id}
        renderItem={({ item: category }) => (
          <CategoryCard
            category={category}
            isSelected={selectedCategory === category.id}
            onPress={() => onCategoryPress?.(category.id)}
          />
        )}
      />
    </View>
  );
};

export default CategoryList;
