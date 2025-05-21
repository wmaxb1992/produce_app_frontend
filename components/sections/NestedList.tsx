import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { homeStyles } from '@/styles/layouts/home';
import useProductStore from '@/store/useProductStore';
import SubcategoryList from './SubcategoryList';
import VarietyList from './VarietyList';

interface NestedListProps {
  style?: any;
}

const NestedList: React.FC<NestedListProps> = ({ style }) => {
  const {
    selectedCategory,
    selectedSubcategory,
    selectedVariety,
    setSelectedSubcategory,
    setSelectedVariety,
    getCategoryById,
    getSubcategoryById,
  } = useProductStore();

  const handleSubcategoryPress = (subcategoryId: string) => {
    setSelectedSubcategory(subcategoryId);
    setSelectedVariety(null);
  };

  const handleVarietyPress = (varietyId: string) => {
    setSelectedVariety(varietyId);
  };

  const selectedCategoryData = selectedCategory ? getCategoryById(selectedCategory) : null;
  const selectedSubcategoryData = selectedSubcategory ? getSubcategoryById(selectedSubcategory) : null;

  if (!selectedCategoryData) return null;

  return (
    <View style={[homeStyles.section, style]}>
      <Text style={homeStyles.sectionTitle}>
        {selectedCategoryData.name}
      </Text>
      <SubcategoryList
        subcategories={selectedCategoryData.subcategories}
        selectedSubcategory={selectedSubcategory}
        onSubcategoryPress={handleSubcategoryPress}
      />
      {selectedSubcategoryData && (
        <View style={{ marginTop: 16 }}>
          <Text style={homeStyles.sectionTitle}>
            {selectedSubcategoryData.name} Varieties
          </Text>
          <VarietyList
            varieties={selectedSubcategoryData.varieties}
            selectedVariety={selectedVariety}
            onVarietyPress={handleVarietyPress}
          />
        </View>
      )}
    </View>
  );
};

export default NestedList;
