import React from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import VarietyChip from '@/components/product/VarietyChip';
import { varietiesSectionStyles } from '@/styles/components/home/varietiesSection';
import { useTheme } from '@/hooks/useTheme';
import type { Variety } from '@/types';

interface VarietiesSectionProps {
  varieties: Variety[];
  selectedVariety: string | null;
  title?: string;
}

const VarietiesSection: React.FC<VarietiesSectionProps> = ({
  varieties,
  selectedVariety,
  title = "Popular Varieties"
}) => {
  const router = useRouter();
  const { colors } = useTheme();
  
  if (!varieties.length) return null;

  const navigateToVarietiesScreen = () => {
    router.push('/browse');
  };

  return (
    <View style={[varietiesSectionStyles.section, { marginTop: 0 }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        <TouchableOpacity 
          style={styles.viewAllButton}
          onPress={navigateToVarietiesScreen}
        >
          <Text style={[styles.viewAllText, { color: colors.primary }]}>See All</Text>
          <ChevronRight size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={varietiesSectionStyles.container}
      >
        {varieties.map((variety: Variety) => (
          <VarietyChip
            key={variety.id}
            variety={variety}
            isSelected={selectedVariety === variety.id}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
  }
});

export default VarietiesSection; 