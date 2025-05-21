import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Category } from '@/types';
import useThemeStore from '@/store/useThemeStore';
import defaultColors from '@/constants/colors';

interface CategoryCardProps {
  category: Category;
  isSelected: boolean;
  onPress?: (id: string) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, isSelected, onPress }) => {
  const themeStore = useThemeStore();
  const theme = themeStore.getThemeValues ? themeStore.getThemeValues() : { colors: defaultColors };
  const colors = theme.colors || defaultColors;
  
  const handlePress = () => {
    onPress?.(category.id);
  };
  
  return (
    <View style={styles.wrapper}>
      <TouchableOpacity 
        style={[
          styles.container, 
          { 
            backgroundColor: 'transparent'
          }
        ]}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <View style={[
          styles.imageContainer,
          isSelected && {
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 4,
          }
        ]}>
          <Image 
            source={category.image.startsWith('http') 
              ? { uri: category.image }
              : {
                  '/assets/images/cat_vegetables.png': require('../../assets/images/cat_vegetables.png'),
                  '/assets/images/cat_herbs.png': require('../../assets/images/cat_herbs.png'),
                  '/assets/images/cat_eggs_dairy.png': require('../../assets/images/cat_eggs_dairy.png'),
                  '/assets/images/cat_jams.png': require('../../assets/images/cat_jams.png'),
                  '/assets/images/cat_fruits.png': require('../../assets/images/cat_fruits.png'),
                }[category.image] || require('../../assets/images/cat_fruits.png')
            }
            style={styles.image}
            resizeMode="cover"
          />
        </View>
      </TouchableOpacity>

      <Text 
        style={[
          styles.name, 
          { 
            color: colors.text || defaultColors.text,
            textDecorationLine: isSelected ? 'underline' : 'none'
          }
        ]}
        numberOfLines={1}
      >
        {category.name}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: 72, // Reduced from 80 by 10%
    alignItems: 'center',
    marginRight: 12,
  },
  container: {
    width: 72, // Reduced from 80 by 10%
    height: 72, // Reduced from 80 by 10%
    borderRadius: 11, // Slightly reduced to maintain proportions
    overflow: 'hidden',
    marginBottom: 2,
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  name: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },

});

export default CategoryCard;