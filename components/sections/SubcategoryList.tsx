import React, { useRef } from 'react';
import { View, FlatList, ViewToken, Animated } from 'react-native';
import SubcategoryCard from '@/components/product/SubcategoryCard';
import { homeStyles } from '@/styles/layouts/home';
import { Subcategory } from '@/types';
import { padding } from '@/constants/spacing';

interface SubcategoryListProps {
  style?: any;
  subcategories: Subcategory[];
  selectedSubcategory?: string | null;
  onSubcategoryPress?: (subcategoryId: string) => void;
}

const SubcategoryList: React.FC<SubcategoryListProps> = ({
  style,
  subcategories,
  selectedSubcategory,
  onSubcategoryPress
}) => {
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [centerIndex, setCenterIndex] = React.useState<number>(0);
  const itemWidth = 66; // card width (50) + margin (16)

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      const centerItem = viewableItems.find(item => item.isViewable);
      if (centerItem) {
        setCenterIndex(centerItem.index || 0);
      }

      const selectedItem = viewableItems.find(item => item.item.id === selectedSubcategory);
      if (selectedItem) {
        // Scroll to center if selected item is at the edge
        flatListRef.current?.scrollToIndex({
          index: selectedItem.index || 0,
          animated: true,
          viewPosition: 0.5
        });
      }
    }
  }).current;

  React.useEffect(() => {
    if (selectedSubcategory) {
      const selectedIndex = subcategories.findIndex(s => s.id === selectedSubcategory);
      if (selectedIndex !== -1) {
        flatListRef.current?.scrollToIndex({
          index: selectedIndex,
          animated: true,
          viewPosition: 0.5
        });
      }
    }
  }, [selectedSubcategory]);

  const getItemLayout = React.useCallback((data: any, index: number) => ({
    length: itemWidth,
    offset: itemWidth * index,
    index,
  }), []);

  const renderItem = React.useCallback(({ item: subcategory, index }: { item: Subcategory; index: number }) => (
    <SubcategoryCard
      subcategory={subcategory}
      isSelected={selectedSubcategory === subcategory.id}
      isCenter={index === centerIndex}
      onPress={() => onSubcategoryPress?.(subcategory.id)}
    />
  ), [selectedSubcategory, centerIndex, onSubcategoryPress]);

  return (
    <View style={[homeStyles.section, { marginTop: 0 }, style]}>
      <FlatList
        ref={flatListRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={homeStyles.subcategoriesContainer}
        contentContainerStyle={{ paddingHorizontal: padding.md }}
        data={subcategories}
        keyExtractor={(subcategory) => subcategory.id}
        renderItem={renderItem}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{
          viewAreaCoveragePercentThreshold: 50,
          minimumViewTime: 0
        }}
        snapToInterval={itemWidth}
        snapToAlignment="center"
        decelerationRate="fast"
        getItemLayout={getItemLayout}
      />
    </View>
  );
};

export default SubcategoryList;
