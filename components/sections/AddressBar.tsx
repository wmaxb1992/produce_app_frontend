import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import useThemeStore from '@/store/useThemeStore';
import useUserStore from '@/store/useUserStore';
import defaultColors from '@/constants/colors';
import { homeStyles } from '@/styles/layouts/home';
import { Address } from '@/types';

interface AddressBarProps {
  style?: any;
}

const AddressBar: React.FC<AddressBarProps> = ({ style }) => {
  const router = useRouter();
  const themeStore = useThemeStore();
  const theme = themeStore.getThemeValues ? themeStore.getThemeValues() : { colors: defaultColors.light };
  const themeColors = theme.colors || defaultColors.light;
  const { user } = useUserStore();

  // Get default address
  const defaultAddress = user?.addresses?.find((addr: Address) => addr.isDefault);

  return (
    <View style={[homeStyles.addressBarContainer, style]}>
      <TouchableOpacity 
        style={[homeStyles.addressBar, { backgroundColor: themeColors.card }]}
        onPress={() => router.push('/user/addresses')}
      >
        <View style={homeStyles.addressContent}>
          <Text style={[homeStyles.addressLabel, { color: themeColors.subtext }]}>
            Deliver to
          </Text>
          <Text style={[homeStyles.addressText, { color: themeColors.text }]} numberOfLines={1}>
            {defaultAddress ? `${defaultAddress.street}, ${defaultAddress.city}, ${defaultAddress.state} ${defaultAddress.zip}` : 'Add delivery address'}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default AddressBar;
