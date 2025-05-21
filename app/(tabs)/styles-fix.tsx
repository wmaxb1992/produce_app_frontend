import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Search } from 'lucide-react-native';
import useThemeStore from '@/store/useThemeStore';
import defaultColors from '@/constants/colors';

// Component to fix the gap between address bar and search bar
const NoGapContainer = ({ children }) => {
  return (
    <View style={noGapStyles.container}>
      {children}
    </View>
  );
};

// Styles with no gap
const noGapStyles = StyleSheet.create({
  container: {
    marginVertical: 0,
    paddingVertical: 0,
  },
});

export default NoGapContainer;
