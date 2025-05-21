import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import useThemeStore from '@/store/useThemeStore';
import defaultColors from '@/constants/colors';
import CategoryCard from '@/components/product/CategoryCard';
import { categoriesSectionStyles } from '@/styles/components/home/categoriesSection';
import type { Category } from '@/types';

interface CategoriesSectionProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategoryPress: (categoryId: string) => void;
  onClearFilters: () => void;
}

const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  categories,
  selectedCategory,
  onCategoryPress,
  onClearFilters,
}) => {
  const { theme } = useThemeStore();
  const themeColors = theme?.colors || defaultColors.light;

  return (
    <View style={categoriesSectionStyles.section}>
      <View style={categoriesSectionStyles.sectionHeader}>
        <Text style={[categoriesSectionStyles.sectionTitle, { color: themeColors.text }]}>
          Categories
        </Text>
        {selectedCategory && (
          <TouchableOpacity
            style={[categoriesSectionStyles.clearButton, { backgroundColor: themeColors.card }]}
            onPress={onClearFilters}
          >
            <ChevronLeft size={20} color={themeColors.primary} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={categoriesSectionStyles.categoriesContainer}
      >
        {categories.map((category: Category) => (
          <CategoryCard
            key={category.id}
            category={category}
            isSelected={selectedCategory === category.id}
            onPress={() => onCategoryPress(category.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default CategoriesSection; 