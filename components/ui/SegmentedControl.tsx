import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import useThemeStore from '@/store/useThemeStore';
import defaultColors from '@/constants/colors';

interface SegmentOption {
  label: string;
  value: string;
}

interface SegmentedControlProps {
  options: SegmentOption[];
  selectedValue: string;
  onChange: (value: string) => void;
  style?: ViewStyle;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  options,
  selectedValue,
  onChange,
  style
}) => {
  const { theme } = useThemeStore();
  const colors = theme?.colors || defaultColors.light;

  return (
    <View style={[styles.container, style]}>
      {options.map((option, index) => {
        const isSelected = option.value === selectedValue;
        
        return (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.option,
              index === 0 && styles.firstOption,
              index === options.length - 1 && styles.lastOption,
              isSelected && [styles.selectedOption, { backgroundColor: colors.primary }],
              { borderColor: colors.border }
            ]}
            onPress={() => onChange(option.value)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.optionText,
                isSelected ? { color: colors.white } : { color: colors.text }
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
  },
  option: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderLeftWidth: 0,
  },
  firstOption: {
    borderLeftWidth: 1,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  lastOption: {
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  selectedOption: {
    borderColor: 'transparent',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
  },
}); 