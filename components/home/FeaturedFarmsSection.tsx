import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import useThemeStore from '@/store/useThemeStore';
import defaultColors from '@/constants/colors';
import FarmCard from '@/components/farm/FarmCard';
import { farmsSectionStyles } from '@/styles/components/home/farmsSection';
import type { Farm } from '@/types';

interface FeaturedFarmsSectionProps {
  farms: Farm[];
}

const FeaturedFarmsSection: React.FC<FeaturedFarmsSectionProps> = ({ farms }) => {
  const { theme } = useThemeStore();
  const themeColors = theme?.colors || defaultColors.light;
  const router = useRouter();

  if (!farms.length) return null;
  
  const handleSeeAllPress = () => {
    router.push('/farms-map');
  };

  return (
    <View style={farmsSectionStyles.section}>
      <View style={farmsSectionStyles.sectionHeader}>
        <Text style={[farmsSectionStyles.sectionTitle, { color: themeColors.text }]}>
          Featured Farms
        </Text>
        
        <TouchableOpacity 
          style={farmsSectionStyles.seeAllButton}
          onPress={handleSeeAllPress}
        >
          <Text style={[farmsSectionStyles.seeAllText, { color: themeColors.primary }]}>
            See All
          </Text>
          <ChevronRight size={16} color={themeColors.primary} />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        horizontal
        showsHorizontalScrollIndicator={false}
        style={farmsSectionStyles.farmsContainer}
        contentContainerStyle={farmsSectionStyles.farmContentContainer}
      >
        {farms.map(farm => (
          <FarmCard 
            key={farm.id}
            farm={farm}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default FeaturedFarmsSection; 