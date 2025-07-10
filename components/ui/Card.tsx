import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useSeasonalStyles } from '@/utils/seasonalStyles';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'elevated' | 'outlined' | 'filled';
  seasonal?: boolean;
  intensity?: 'subtle' | 'medium' | 'strong';
}

const Card: React.FC<CardProps> = ({ 
  children, 
  style,
  variant = 'elevated',
  seasonal = true,
  intensity = 'medium'
}) => {
  const { colors, isUsingSeasonalTheme } = useTheme();
  const seasonalStyles = useSeasonalStyles();

  const getVariantStyle = (): ViewStyle => {
    if (seasonal && seasonalStyles.isSeasonalActive) {
      const seasonalVariant = 
        variant === 'elevated' ? 'subtle' : 
        variant === 'outlined' ? 'bordered' : 'filled';
      
      const bgOpacity = intensity === 'subtle' ? 0.05 : 
                        intensity === 'medium' ? 0.15 : 0.25;
      
      const borderOpacity = intensity === 'subtle' ? 0.3 : 
                          intensity === 'medium' ? 0.6 : 0.9;
      
      return {
        backgroundColor: seasonalStyles.getBackgroundColor(bgOpacity),
        borderColor: seasonalStyles.getBorderColor(borderOpacity),
        borderWidth: variant === 'outlined' ? 2 : 1,
        ...seasonalStyles.getShadow(variant === 'elevated' ? 'md' : 'sm')
      };
    }
    
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: colors.card,
          shadowColor: colors.black,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 2,
          borderWidth: 0,
        };
      case 'outlined':
        return {
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
        };
      case 'filled':
        return {
          backgroundColor: colors.gray[100],
          borderWidth: 0,
        };
      default:
        return {
          backgroundColor: colors.card,
          shadowColor: colors.black,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 2,
          borderWidth: 0,
        };
    }
  };

  return (
    <View 
      style={[
        styles.card, 
        { borderRadius: 8 },
        getVariantStyle(),
        style
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    overflow: 'hidden',
  },
});

export default Card;