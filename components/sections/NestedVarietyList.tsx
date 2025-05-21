import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { homeStyles } from '@/styles/layouts/home';
import useProductStore from '@/store/useProductStore';
import useThemeStore from '@/store/useThemeStore';
import defaultColors from '@/constants/colors';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import VarietyCard from '@/components/product/VarietyCard';

interface NestedVarietyListProps {
  style?: any;
}

const NestedVarietyList: React.FC<NestedVarietyListProps> = ({ style }) => {
  const {
    selectedCategory,
    selectedSubcategory,
    selectedVariety,
    setSelectedSubcategory,
    setSelectedVariety,
    getCategoryById,
    getSubcategoryById,
  } = useProductStore();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const themeStore = useThemeStore();
  const theme = themeStore.getThemeValues ? themeStore.getThemeValues() : { colors: defaultColors.light };
  const colors = theme.colors || defaultColors.light;

  const handleSubcategoryPress = (subcategoryId: string) => {
    setSelectedSubcategory(subcategoryId);
    setSelectedVariety(null);
    setCurrentPage(1); // Reset page when changing subcategory
  };

  const handleVarietyPress = (varietyId: string) => {
    setSelectedVariety(varietyId);
  };

  const selectedCategoryData = selectedCategory ? getCategoryById(selectedCategory) : null;
  const selectedSubcategoryData = selectedSubcategory ? getSubcategoryById(selectedSubcategory) : null;

  if (!selectedCategoryData) return null;

  const varieties = selectedSubcategoryData?.varieties || [];
  const totalPages = Math.ceil(varieties.length / itemsPerPage);
  const paginatedVarieties = varieties.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <View style={[homeStyles.section, style]}>
      <Text style={homeStyles.sectionTitle}>
        {selectedCategoryData.name}
      </Text>
      
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        style={homeStyles.subcategoriesContainer}
        data={selectedCategoryData.subcategories}
        keyExtractor={(subcategory) => subcategory.id}
        renderItem={({ item: subcategory }) => (
          <TouchableOpacity
            style={[
              homeStyles.subcategoryButton,
              selectedSubcategory === subcategory.id && {
                backgroundColor: colors.primary,
                borderColor: colors.primary,
              },
            ]}
            onPress={() => handleSubcategoryPress(subcategory.id)}
          >
            <Text
              style={[
                homeStyles.subcategoryText,
                selectedSubcategory === subcategory.id && {
                  color: colors.white,
                },
              ]}
            >
              {subcategory.name}
            </Text>
          </TouchableOpacity>
        )}
      />

      {selectedSubcategoryData && (
        <View style={{ marginTop: 16 }}>
          <View style={homeStyles.sectionHeader}>
            <Text style={homeStyles.sectionTitle}>
              {selectedSubcategoryData.name} Varieties
            </Text>
            {totalPages > 1 && (
              <View style={homeStyles.pagination}>
                <TouchableOpacity
                  onPress={handlePrevPage}
                  disabled={currentPage === 1}
                  style={[
                    homeStyles.paginationButton,
                    currentPage === 1 && homeStyles.paginationButtonDisabled,
                  ]}
                >
                  <ChevronLeft size={20} color={currentPage === 1 ? colors.subtext : colors.text} />
                </TouchableOpacity>
                <Text style={homeStyles.paginationText}>
                  {currentPage} / {totalPages}
                </Text>
                <TouchableOpacity
                  onPress={handleNextPage}
                  disabled={currentPage === totalPages}
                  style={[
                    homeStyles.paginationButton,
                    currentPage === totalPages && homeStyles.paginationButtonDisabled,
                  ]}
                >
                  <ChevronRight size={20} color={currentPage === totalPages ? colors.subtext : colors.text} />
                </TouchableOpacity>
              </View>
            )}
          </View>

          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            style={homeStyles.varietiesContainer}
            data={paginatedVarieties}
            keyExtractor={(variety) => variety.id}
            renderItem={({ item: variety }) => (
              <VarietyCard
                variety={variety}
                isSelected={selectedVariety === variety.id}
                onPress={() => handleVarietyPress(variety.id)}
              />
            )}
          />
        </View>
      )}
    </View>
  );
};

export default NestedVarietyList;
