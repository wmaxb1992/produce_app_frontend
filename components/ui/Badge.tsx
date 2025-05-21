import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info' | 'seasonal';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  text: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  style?: ViewStyle;
  textStyle?: TextStyle;
  customColor?: string;
}

const Badge: React.FC<BadgeProps> = ({
  text,
  variant = 'default',
  size = 'md',
  style,
  textStyle,
  customColor,
}) => {
  const { colors } = useTheme();

  const getVariantColors = (): { bg: string; text: string } => {
    if (customColor) {
      return { bg: customColor, text: colors.white };
    }
    
    switch (variant) {
      case 'primary':
        return { bg: colors.primary, text: colors.white };
      case 'secondary':
        return { bg: colors.secondary, text: colors.white };
      case 'success':
        return { bg: colors.success, text: colors.white };
      case 'error':
        return { bg: colors.error, text: colors.white };
      case 'warning':
        return { bg: colors.warning, text: colors.black };
      case 'info':
        return { bg: colors.info, text: colors.white };
      case 'seasonal':
        return { bg: colors.seasonal || colors.primary, text: colors.white };
      default:
        return { bg: colors.gray[200], text: colors.gray[800] };
    }
  };

  const getSizeStyles = (): { container: ViewStyle; text: TextStyle } => {
    switch (size) {
      case 'sm':
        return {
          container: {
            paddingVertical: 2,
            paddingHorizontal: 6,
            borderRadius: 4,
          },
          text: { fontSize: 10 },
        };
      case 'lg':
        return {
          container: {
            paddingVertical: 6,
            paddingHorizontal: 12,
            borderRadius: 8,
          },
          text: { fontSize: 14 },
        };
      default: // md
        return {
          container: {
            paddingVertical: 4,
            paddingHorizontal: 8,
            borderRadius: 6,
          },
          text: { fontSize: 12 },
        };
    }
  };

  const variantColors = getVariantColors();
  const sizeStyles = getSizeStyles();

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: variantColors.bg },
        sizeStyles.container,
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: variantColors.text },
          sizeStyles.text,
          textStyle,
        ]}
        numberOfLines={1}
      >
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '500',
  },
});

export default Badge;