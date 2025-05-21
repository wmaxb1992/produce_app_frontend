import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { productStyles } from '@/styles/components/product';
import { Variety } from '@/types';
import useThemeStore from '@/store/useThemeStore';
import defaultColors from '@/constants/colors';

interface VarietyCardProps {
  variety: Variety;
  isSelected?: boolean;
  onPress?: () => void;
}

const VarietyCard: React.FC<VarietyCardProps> = ({
  variety,
  isSelected,
  onPress
}) => {
  const { theme } = useThemeStore();
  const colors = theme?.colors || defaultColors.light;

  return (
    <TouchableOpacity
      style={[
        productStyles.varietyCard,
        isSelected && { backgroundColor: colors.primary },
      ]}
      onPress={onPress}
    >
      <Text style={productStyles.varietyEmoji}>{variety.emoji}</Text>
      <Text
        style={[
          productStyles.varietyName,
          isSelected && { color: colors.white }
        ]}
      >
        {variety.name}
      </Text>
    </TouchableOpacity>
  );
};

export default VarietyCard;
