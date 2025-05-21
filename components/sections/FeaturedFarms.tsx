import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import useThemeStore from '@/store/useThemeStore';
import useFarmStore from '@/store/useFarmStore';
import FarmCard from '@/components/farm/FarmCard';
import defaultColors from '@/constants/colors';
import { homeStyles } from '@/styles/layouts/home';

interface FeaturedFarmsProps {
  style?: any;
}

const FeaturedFarms: React.FC<FeaturedFarmsProps> = ({ style }) => {
  const router = useRouter();
  const themeStore = useThemeStore();
  const theme = themeStore.getThemeValues ? themeStore.getThemeValues() : { colors: defaultColors.light };
  const themeColors = theme.colors || defaultColors.light;
  const { farms } = useFarmStore();

  const handleFarmPress = (farmId: string) => {
    router.push(`/farm/${farmId}`);
  };

  return (
    <View style={[homeStyles.section, style]}>
      <Text style={[homeStyles.sectionTitle, { color: themeColors.text }]}>
        Featured Farms
      </Text>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={homeStyles.carouselContainer}
        data={farms.filter(farm => farm.rating >= 4.5)}
        keyExtractor={(farm) => farm.id}
        renderItem={({ item: farm }) => (
          <FarmCard
            farm={farm}
            onPress={() => handleFarmPress(farm.id)}
            style={undefined}
          />
        )}
      />
    </View>
  );
};

export default FeaturedFarms;
