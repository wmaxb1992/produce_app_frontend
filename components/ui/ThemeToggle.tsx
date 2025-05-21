import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Sun, Moon } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

interface ThemeToggleProps {
  style?: any;
  showLabel?: boolean;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  style,
  showLabel = false
}) => {
  const { theme, colors, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <View style={[styles.container, style]}>
      {showLabel && (
        <Text style={[styles.label, { color: colors.text }]}>
          {isDark ? 'Dark Mode' : 'Light Mode'}
        </Text>
      )}
      
      <TouchableOpacity
        style={[
          styles.toggle,
          { backgroundColor: isDark ? colors.gray[800] : colors.gray[200] }
        ]}
        onPress={toggleTheme}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.thumb,
            { 
              backgroundColor: isDark ? colors.gray[300] : colors.white,
              transform: [{ translateX: isDark ? 24 : 0 }]
            }
          ]}
        >
          {isDark ? (
            <Moon size={16} color={colors.primary} />
          ) : (
            <Sun size={16} color={colors.warning} />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    marginRight: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  toggle: {
    width: 56,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    padding: 4,
  },
  thumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default ThemeToggle; 