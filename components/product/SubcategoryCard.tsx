import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Subcategory } from '@/types';
import useThemeStore, { defaultColors } from '@/store/useThemeStore';
import useProductStore from '@/store/useProductStore';

type ThemeColors = typeof defaultColors;

interface SubcategoryCardProps {
  subcategory: Subcategory;
  isSelected?: boolean;
  onPress?: () => void;
}

const SubcategoryCard: React.FC<SubcategoryCardProps> = ({ subcategory, isSelected, onPress }) => {
  const themeStore = useThemeStore();
  const theme = themeStore.getThemeValues ? themeStore.getThemeValues() : { colors: defaultColors };
  const colors = theme.colors || defaultColors;
  
  const { setSelectedSubcategory } = useProductStore();
  
  const handlePress = () => {
    setSelectedSubcategory(isSelected ? null : subcategory.id);
  };
  
  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        { 
          backgroundColor: isSelected ? colors.primary || defaultColors.primary : 'transparent',
          borderColor: isSelected ? colors.primary || defaultColors.primary : colors.border || defaultColors.border,
        }
      ]}
      activeOpacity={0.7}
      onPress={onPress || handlePress}
    >
      {subcategory.image && (
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: subcategory.image }} 
            style={styles.image}
          />
        </View>
      )}
      <Text style={[
        styles.name,
        { 
          color: isSelected ? 
            colors.white || defaultColors.white : 
            colors.text || defaultColors.text 
        }
      ]}>
        {subcategory.name}
      </Text>

    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  imageContainer: {
    width: 16,
    height: 16,
    marginRight: 6,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  name: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default SubcategoryCard;