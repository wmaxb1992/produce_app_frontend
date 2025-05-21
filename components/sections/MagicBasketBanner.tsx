import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { homeStyles } from '@/styles/layouts/home';

interface MagicBasketBannerProps {
  style?: any;
}

const MagicBasketBanner: React.FC<MagicBasketBannerProps> = ({ style }) => {
  const router = useRouter();

  return (
    <TouchableOpacity 
      style={[homeStyles.bannerContainer, style]}
      onPress={() => router.push('/magic-basket')}
    >
      <Image 
        source={require('@/assets/images/banner_gif.gif')}
        style={homeStyles.bannerBackground}
        resizeMode="cover"
      />
      <View style={homeStyles.bannerContent}>
        <View style={homeStyles.bannerTextContent}>
          <Text style={homeStyles.bannerTitle}>Magic Basket</Text>
          <Text style={homeStyles.bannerSubtitle}>
            Get a personalized basket curated just for you
          </Text>
        </View>
        <View style={homeStyles.bannerButton}>
          <Text style={homeStyles.bannerButtonText}>Try Now</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default MagicBasketBanner;
