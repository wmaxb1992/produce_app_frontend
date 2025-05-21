import React, { ReactNode } from 'react';
import { TouchableOpacity, Text, View, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import useThemeStore from '@/store/useThemeStore';
import defaultColors from '@/constants/colors';

interface RoundButtonProps {
  label: string;
  icon?: ReactNode;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  style?: ViewStyle;
  labelStyle?: TextStyle;
  disabled?: boolean;
}

const RoundButton: React.FC<RoundButtonProps> = ({
  label,
  icon,
  onPress,
  variant = 'primary',
  style,
  labelStyle,
  disabled = false,
}) => {
  const { theme } = useThemeStore();
  const themeColors = theme?.colors || defaultColors.light;
  
  const getButtonStyle = () => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: themeColors.secondary,
          borderColor: themeColors.secondary,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: themeColors.primary,
          borderWidth: 1,
        };
      default:
        return {
          backgroundColor: themeColors.primary,
          borderColor: themeColors.primary,
        };
    }
  };
  
  const getLabelStyle = () => {
    switch (variant) {
      case 'outline':
        return {
          color: themeColors.primary,
        };
      default:
        return {
          color: themeColors.white,
        };
    }
  };
  
  return (
    <TouchableOpacity
      style={[
        styles.button,
        getButtonStyle(),
        disabled && styles.disabledButton,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text
        style={[
          styles.label,
          getLabelStyle(),
          disabled && styles.disabledLabel,
          labelStyle,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 50,
    borderWidth: 0,
  },
  disabledButton: {
    opacity: 0.6,
  },
  iconContainer: {
    marginRight: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  disabledLabel: {
    opacity: 0.8,
  },
});

export default RoundButton; 