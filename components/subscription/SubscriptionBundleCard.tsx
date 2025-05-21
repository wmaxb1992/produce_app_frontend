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
          
          <View style={styles.itemsContainer}>
            <View style={styles.itemRow}>
              <Leaf size={16} color={colors.success} style={styles.icon} />
              <Text style={[styles.itemText, { color: colors.text }]}>
                {bundle.items.vegetables} vegetables
              </Text>
            </View>
            
            <View style={styles.itemRow}>
              <Apple size={16} color={colors.warning} style={styles.icon} />
              <Text style={[styles.itemText, { color: colors.text }]}>
                {bundle.items.fruits} fruits
              </Text>
            </View>
            
            <View style={styles.itemRow}>
              <Flower2 size={16} color={colors.info} style={styles.icon} />
              <Text style={[styles.itemText, { color: colors.text }]}>
                {bundle.items.herbs} herbs
              </Text>
            </View>
          </View>
          
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
    width: 250,
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
    height: 140,
  },
  image: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  discountBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  discountText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 12,
  },
  contentContainer: {
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  farmName: {
    fontSize: 12,
    marginBottom: 10,
  },
  itemsContainer: {
    marginBottom: 10,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  icon: {
    marginRight: 6,
  },
  itemText: {
    fontSize: 13,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default SubscriptionBundleCard; 