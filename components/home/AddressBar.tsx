import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import useThemeStore from '@/store/useThemeStore';
import defaultColors from '@/constants/colors';
import { addressBarStyles } from '@/styles/components/home/addressBar';

interface AddressBarProps {
  address: string;
}

const AddressBar: React.FC<AddressBarProps> = ({ address }) => {
  const router = useRouter();
  const { theme } = useThemeStore();
  const themeColors = theme?.colors || defaultColors.light;

  return (
    <TouchableOpacity 
      style={[addressBarStyles.container, { backgroundColor: themeColors.card }]}
      onPress={() => router.push('/user/addresses')}
    >
      <View style={addressBarStyles.content}>
        <Text style={[addressBarStyles.label, { color: themeColors.subtext }]}>
          Deliver to
        </Text>
        <Text style={[addressBarStyles.text, { color: themeColors.text }]} numberOfLines={1}>
          {address}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default AddressBar; 