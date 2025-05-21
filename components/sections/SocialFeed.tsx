import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import useThemeStore from '@/store/useThemeStore';
import useFarmStore from '@/store/useFarmStore';
import FarmPostCard from '@/components/farm/FarmPostCard';
import defaultColors from '@/constants/colors';
import { homeStyles } from '@/styles/layouts/home';
import { FarmPost } from '@/types';

interface SocialFeedProps {
  style?: any;
}

const SocialFeed: React.FC<SocialFeedProps> = ({ style }) => {
  const router = useRouter();
  const themeStore = useThemeStore();
  const theme = themeStore.getThemeValues ? themeStore.getThemeValues() : { colors: defaultColors.light };
  const themeColors = theme.colors || defaultColors.light;
  const { farmPosts } = useFarmStore();

  const handlePostPress = (postId: string) => {
    const post = farmPosts.find((p: FarmPost) => p.id === postId);
    if (post) {
      router.push(`/farm/${post.farmId}`);
    }
  };

  return (
    <View style={[homeStyles.section, style]}>
      <Text style={[homeStyles.sectionTitle, { color: themeColors.text }]}>
        From Your Farms
      </Text>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={homeStyles.carouselContainer}
        data={farmPosts.slice(0, 5)}
        keyExtractor={(post) => post.id}
        renderItem={({ item: post }) => (
          <FarmPostCard
            post={post}
            onPress={() => handlePostPress(post.id)}
            style={undefined}
          />
        )}
      />
    </View>
  );
};

export default SocialFeed;
