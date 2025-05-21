import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import useThemeStore from '@/store/useThemeStore';
import defaultColors from '@/constants/colors';

interface RadioButtonProps {
  label: string;
  selected: boolean;
  onSelect: () => void;
}

export const RadioButton: React.FC<RadioButtonProps> = ({ 
  label, 
  selected, 
  onSelect 
}) => {
  const { theme } = useThemeStore();
  const colors = theme?.colors || defaultColors.light;

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onSelect}
      activeOpacity={0.7}
    >
      <View 
        style={[
          styles.radio, 
          { borderColor: selected ? colors.primary : colors.border }
        ]}
      >
        {selected && (
          <View 
            style={[
              styles.selected,
              { backgroundColor: colors.primary }
            ]} 
          />
        )}
      </View>
      <Text style={[styles.label, { color: colors.text }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  radio: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: {
    height: 10,
    width: 10,
    borderRadius: 5,
  },
  label: {
    marginLeft: 10,
    fontSize: 16,
  },
}); 