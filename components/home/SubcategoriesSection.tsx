import React from 'react';
import { View, ScrollView } from 'react-native';
import SubcategoryCard from '@/components/product/SubcategoryCard';
import { subcategoriesSectionStyles } from '@/styles/components/home/subcategoriesSection';
import type { Subcategory } from '@/types';

interface SubcategoriesSectionProps {
  subcategories: Subcategory[];
  selectedSubcategory: string | null;
  onSubcategoryPress: (subcategoryId: string) => void;
}

const SubcategoriesSection: React.FC<SubcategoriesSectionProps> = ({
  subcategories,
  selectedSubcategory,
  onSubcategoryPress,
}) => {
  if (!subcategories.length) return null;

  return (
    <View style={[subcategoriesSectionStyles.section, { marginTop: 0 }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={subcategoriesSectionStyles.container}
        contentContainerStyle={subcategoriesSectionStyles.content}
      >
        {subcategories.map((subcategory: Subcategory) => (
          <SubcategoryCard
            key={subcategory.id}
            subcategory={subcategory}
            isSelected={selectedSubcategory === subcategory.id}
            onPress={() => onSubcategoryPress(subcategory.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default SubcategoriesSection; 