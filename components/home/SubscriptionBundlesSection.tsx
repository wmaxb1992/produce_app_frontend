import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import useSubscriptionStore from '@/store/useSubscriptionStore';
import SubscriptionBundleCard from '@/components/subscription/SubscriptionBundleCard';
import LoadingState from '@/components/ui/LoadingState';

interface SubscriptionBundlesSectionProps {
  style?: any;
}

const SubscriptionBundlesSection: React.FC<SubscriptionBundlesSectionProps> = ({ style }) => {
  const router = useRouter();
  const { colors } = useTheme();
  let bundles: any[] = [];
  let fetchBundles: any;
  
  try {
    const subscriptionStore = useSubscriptionStore();
    bundles = subscriptionStore?.bundles || [];
    fetchBundles = subscriptionStore?.fetchBundles;
  } catch (error) {
    console.warn("Error using subscription store in SubscriptionBundlesSection:", error);
  }

  // Add useEffect to fetch bundles if they're not already loaded
  useEffect(() => {
    if (bundles.length === 0 && typeof fetchBundles === 'function') {
      console.log("Fetching bundles from inside SubscriptionBundlesSection");
      fetchBundles().catch((err: Error) => console.error("Error fetching bundles:", err));
    }
  }, [bundles.length, fetchBundles]);

  const handleBundlePress = (bundleId: string) => {
    router.push({
      pathname: "/subscription/[id]",
      params: { id: bundleId }
    } as any);
  };

  // Debug: Check if bundles is actually empty
  console.log("Subscription bundles:", bundles);
  
  // Return loading state if bundles is empty
  if (!bundles || !bundles.length) {
    return (
      <View style={[styles.section, style]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Subscription Bundles
        </Text>
        <LoadingState message="Loading bundles..." size="small" />
      </View>
    );
  }

  return (
    <View style={[styles.section, style]}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Subscription Bundles
      </Text>
      
      <ScrollView 
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.bundlesContainer}
        contentContainerStyle={styles.bundlesContent}
      >
        {bundles.map(bundle => (
          <SubscriptionBundleCard 
            key={bundle.id}
            bundle={bundle}
            onPress={() => handleBundlePress(bundle.id)}
            style={undefined}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    marginHorizontal: 16,
  },
  bundlesContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  bundlesContent: {
    paddingRight: 16,
  }
});

export default SubscriptionBundlesSection; 