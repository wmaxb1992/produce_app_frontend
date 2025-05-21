import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Variety } from '@/types';
import { useTheme } from '@/hooks/useTheme';
import useProductStore from '@/store/useProductStore';

interface VarietyChipProps {
  variety: Variety;
  isSelected?: boolean;
  enableSelect?: boolean;
  onPress?: (variety: Variety) => void;
}

const VarietyChip: React.FC<VarietyChipProps> = ({ 
  variety, 
  isSelected = false,
  enableSelect = true,
  onPress
}) => {
  const router = useRouter();
  const { colors } = useTheme();
  const { setSelectedVariety } = useProductStore();
  
  const handlePress = () => {
    if (onPress) {
      onPress(variety);
    } else if (enableSelect) {
      setSelectedVariety(isSelected ? null : variety.id);
    } else {
      // Navigate to variety detail page
      router.push(`/variety/${variety.id}`);
    }
  };
  
  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        { 
          backgroundColor: isSelected ? colors.primary : colors.card,
          borderColor: isSelected ? colors.primary : colors.border,
        }
      ]}
      activeOpacity={0.7}
      onPress={handlePress}
    >
      <Text style={styles.emoji}>{variety.emoji}</Text>
      <Text 
        style={[
          styles.name, 
          { color: isSelected ? colors.white : colors.text }
        ]}
        numberOfLines={2}
      >
        {variety.name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 64,  // 80 * 0.8
    height: 64, // 80 * 0.8
    borderRadius: 10,  // 12 * 0.8
    marginRight: 10,
    overflow: 'hidden',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  name: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default VarietyChip;