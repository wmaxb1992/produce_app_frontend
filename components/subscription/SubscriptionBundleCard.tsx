import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ViewStyle } from 'react-native';
import { useRouter } from 'expo-router';
import { SubscriptionBundle } from '@/types';
import { Tag, Leaf, Apple, Flower2 } from 'lucide-react-native';
import Card from '@/components/ui/Card';
import { useTheme } from '@/hooks/useTheme';

interface SubscriptionBundleCardProps {
  bundle: SubscriptionBundle;
  onPress?: () => void;
  style?: ViewStyle;
}

const SubscriptionBundleCard: React.FC<SubscriptionBundleCardProps> = ({ 
  bundle, 
  onPress,
  style
}) => {
  const router = useRouter();
  const { colors } = useTheme();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push({
        pathname: `/subscription/[id]`,
        params: { id: bundle.id }
      });
    }
  };

  return (
    <Card style={[styles.card, style]}>
      <TouchableOpacity 
        activeOpacity={0.8}
        onPress={handlePress}
        style={styles.container}
      >
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: bundle.image }} 
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.itemsBadgeOverlay}>
            <View style={styles.itemRowOverlay}>
              <Leaf size={12} color={colors.success} />
              <Text style={styles.itemTextOverlay}>{bundle.items.vegetables}</Text>
            </View>
            <View style={styles.itemRowOverlay}>
              <Apple size={12} color={colors.warning} />
              <Text style={styles.itemTextOverlay}>{bundle.items.fruits}</Text>
            </View>
            <View style={styles.itemRowOverlay}>
              <Flower2 size={12} color={colors.info} />
              <Text style={styles.itemTextOverlay}>{bundle.items.herbs}</Text>
            </View>
          </View>
          <View style={[styles.discountBadge, { backgroundColor: colors.primary }]}>
            <Text style={styles.discountText}>Save {bundle.discountPercentage}%</Text>
          </View>
        </View>
        
        <View style={styles.contentContainer}>
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
            {bundle.name}
          </Text>
          
          {bundle.farmName && (
            <Text style={[styles.farmName, { color: colors.subtext }]} numberOfLines={1}>
              From {bundle.farmName}
            </Text>
          )}
          
          <View style={styles.priceContainer}>
            <Text style={[styles.price, { color: colors.text }]}>
              ${bundle.price.toFixed(2)}
            </Text>
            <View style={[styles.badge, { backgroundColor: colors.primary + '20' }]}>
              <Text style={[styles.badgeText, { color: colors.primary }]}>
                From ${bundle.monthlyPrice.toFixed(2)}/box
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginRight: 12,
    width: 160,
    borderRadius: 12,
    overflow: 'hidden',
    padding: 0,
  },
  container: {
    width: '100%',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 80,
  },
  image: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  itemsBadgeOverlay: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
    zIndex: 2,
  },
  itemRowOverlay: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 1,
  },
  itemTextOverlay: {
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 2,
    color: '#333',
  },
  discountBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  discountText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 10,
  },
  contentContainer: {
    padding: 8,
  },
  name: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  farmName: {
    fontSize: 9,
    marginBottom: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 13,
    fontWeight: '700',
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '500',
  },
});

export default SubscriptionBundleCard; 