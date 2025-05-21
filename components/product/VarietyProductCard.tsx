import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Heart, Sparkles, Info } from 'lucide-react-native';
import { Product, Variety, EnhancedVariety } from '@/types';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { useTheme } from '@/hooks/useTheme';
import { useSeasonalStyles } from '@/utils/seasonalStyles';
import useCartStore from '@/store/useCartStore';
import useUserStore from '@/store/useUserStore';
import useProductStore from '@/store/useProductStore';

interface VarietyProductCardProps {
  product: Product;
  variety?: Variety | EnhancedVariety;
  onPress?: () => void;
  onInfoPress?: () => void;
}

const VarietyProductCard: React.FC<VarietyProductCardProps> = ({ 
  product, 
  variety,
  onPress,
  onInfoPress
}) => {
  const router = useRouter();
  const { colors, isUsingSeasonalTheme, season } = useTheme();
  const seasonalStyles = useSeasonalStyles();
  const productStore = useProductStore();
  
  // If variety is not passed, try to get it from the store
  const resolvedVariety = variety || (product.variety ? productStore.getVarietyById(product.variety) : undefined);
  
  // Check if this product is in season for seasonal styling
  const isProductInSeason = product.seasons?.includes(season);
  
  // Add error handling for cart store
  let addToCart = (product: Product, quantity: number) => {
    console.warn("addToCart function not available");
  };
  
  try {
    const cartStore = useCartStore();
    if (cartStore && typeof cartStore.addItem === 'function') {
      addToCart = cartStore.addItem;
    }
  } catch (error) {
    console.error("Error accessing cart store:", error);
  }
  
  // Add error handling for user store
  let user = null;
  let addFavoriteProduct = (id: string) => {};
  let removeFavoriteProduct = (id: string) => {};
  let isFavorite = false;
  
  try {
    const userStore = useUserStore();
    user = userStore.user;
    if (typeof userStore.addFavoriteProduct === 'function') {
      addFavoriteProduct = userStore.addFavoriteProduct;
    }
    if (typeof userStore.removeFavoriteProduct === 'function') {
      removeFavoriteProduct = userStore.removeFavoriteProduct;
    }
    isFavorite = user?.preferences?.favoriteProducts?.includes(product.id) || false;
  } catch (error) {
    console.error("Error accessing user store:", error);
  }
  
  const handlePress = () => {
    // Navigate to variety detail page if variety exists, otherwise go to product
    if (resolvedVariety) {
      router.push(`/variety/${resolvedVariety.id}`);
    } else {
      router.push(`/product/${product.id}`);
    }
  };
  
  const handleAddToCart = () => {
    addToCart(product, 1);
  };
  
  const toggleFavorite = () => {
    if (isFavorite) {
      removeFavoriteProduct(product.id);
    } else {
      addFavoriteProduct(product.id);
    }
  };
  
  const handleInfoPress = () => {
    if (onInfoPress) {
      onInfoPress();
    } else if (resolvedVariety) {
      router.push(`/variety/${resolvedVariety.id}`);
    }
  };
  
  // Use seasonal card styles if product is in season
  const cardVariant = isUsingSeasonalTheme && isProductInSeason ? 'outlined' : 'elevated';
  
  // Cast to enhanced variety if it has the properties
  const enhancedVariety = resolvedVariety as EnhancedVariety;
  const hasTasteProfile = enhancedVariety?.tasteProfile !== undefined;
  
  return (
    <Card 
      style={styles.card} 
      variant={cardVariant}
      seasonal={isProductInSeason} 
      intensity="strong" // Always use strong intensity for variety cards
    >
      <TouchableOpacity 
        activeOpacity={0.8}
        onPress={onPress || handlePress}
        style={styles.container}
      >
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: product.image }} 
            style={styles.image}
            resizeMode="cover"
          />
          
          {/* Variety emoji badge */}
          {resolvedVariety?.emoji && (
            <View style={styles.emojiContainer}>
              <Text style={styles.emoji}>{resolvedVariety.emoji}</Text>
            </View>
          )}
          
          {/* Favorite button */}
          <TouchableOpacity 
            style={[
              styles.favoriteButton, 
              { 
                backgroundColor: colors.card,
                ...(isUsingSeasonalTheme && isProductInSeason ? seasonalStyles.getShadow('sm') : {})
              }
            ]}
            onPress={toggleFavorite}
          >
            <Heart 
              size={18} 
              color={isFavorite ? colors.error : colors.gray[400]} 
              fill={isFavorite ? colors.error : 'none'}
            />
          </TouchableOpacity>
          
          {/* Info button */}
          <TouchableOpacity
            style={[
              styles.infoButton,
              {
                backgroundColor: colors.card,
                ...(isUsingSeasonalTheme && isProductInSeason ? seasonalStyles.getShadow('sm') : {})
              }
            ]}
            onPress={handleInfoPress}
          >
            <Info size={18} color={colors.primary} />
          </TouchableOpacity>
          
          {/* Badges */}
          <View style={styles.badgeContainer}>
            {product.organic && (
              <View style={styles.badgeItem}>
                <Badge 
                  text="Organic" 
                  variant="success" 
                  size="sm"
                />
              </View>
            )}
            
            {product.preHarvest && (
              <View style={styles.badgeItem}>
                <Badge 
                  text="Pre-Harvest" 
                  variant="info" 
                  size="sm"
                />
              </View>
            )}
            
            {isUsingSeasonalTheme && isProductInSeason && (
              <View style={styles.badgeItem}>
                <Badge 
                  text="In Season" 
                  variant="seasonal" 
                  size="sm"
                  customColor={colors.seasonal}
                />
              </View>
            )}
          </View>
        </View>
        
        <View style={styles.contentContainer}>
          {/* Variety Name (larger) */}
          <Text 
            style={[
              styles.varietyName, 
              { 
                color: isUsingSeasonalTheme && isProductInSeason 
                  ? colors.seasonal
                  : colors.text
              }
            ]} 
            numberOfLines={1}
          >
            {resolvedVariety?.name || product.name}
          </Text>
          
          {/* Product description */}
          <Text style={[styles.description, { color: colors.subtext }]} numberOfLines={2}>
            {resolvedVariety?.description || product.description}
          </Text>
          
          {/* Taste profile if available */}
          {hasTasteProfile && (
            <View style={styles.tasteProfileContainer}>
              {enhancedVariety.tasteProfile?.sweetness && (
                <View style={styles.tasteAttribute}>
                  <View style={styles.tasteBar}>
                    <View 
                      style={[
                        styles.tasteIndicator, 
                        { 
                          width: `${enhancedVariety.tasteProfile.sweetness * 20}%`,
                          backgroundColor: colors.success
                        }
                      ]} 
                    />
                  </View>
                  <Text style={[styles.tasteLabel, { color: colors.subtext }]}>Sweetness</Text>
                </View>
              )}
              
              {enhancedVariety.tasteProfile?.tartness && (
                <View style={styles.tasteAttribute}>
                  <View style={styles.tasteBar}>
                    <View 
                      style={[
                        styles.tasteIndicator, 
                        { 
                          width: `${enhancedVariety.tasteProfile.tartness * 20}%`,
                          backgroundColor: colors.warning
                        }
                      ]} 
                    />
                  </View>
                  <Text style={[styles.tasteLabel, { color: colors.subtext }]}>Tartness</Text>
                </View>
              )}
            </View>
          )}
          
          <View style={styles.bottomRow}>
            {/* Price */}
            <View>
              <Text style={[styles.priceLabel, { color: colors.subtext }]}>From</Text>
              <Text style={[styles.price, { 
                color: isUsingSeasonalTheme && isProductInSeason 
                  ? colors.seasonal 
                  : colors.text 
              }]}>
                ${product.price.toFixed(2)} <Text style={styles.unit}>/ {product.unit}</Text>
              </Text>
            </View>
            
            {/* Add to cart button */}
            <TouchableOpacity 
              style={[
                styles.addButton, 
                { 
                  backgroundColor: isUsingSeasonalTheme && isProductInSeason
                    ? colors.seasonal
                    : colors.primary 
                }
              ]}
              onPress={handleAddToCart}
            >
              <Sparkles size={18} color={colors.white} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 0,
    overflow: 'hidden',
    marginRight: 0,
    width: '100%',
    borderRadius: 16,
  },
  container: {
    width: '100%',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 140,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  emojiContainer: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  emoji: {
    fontSize: 24,
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  infoButton: {
    position: 'absolute',
    top: 12,
    right: 52,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  badgeContainer: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    flexDirection: 'row',
    gap: 4,
  },
  badgeItem: {
    marginBottom: 4,
  },
  contentContainer: {
    padding: 16,
  },
  varietyName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  tasteProfileContainer: {
    marginBottom: 12,
  },
  tasteAttribute: {
    marginBottom: 6,
  },
  tasteBar: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  tasteIndicator: {
    height: '100%',
    borderRadius: 2,
  },
  tasteLabel: {
    fontSize: 12,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  priceLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
  },
  unit: {
    fontSize: 12,
    fontWeight: '500',
    opacity: 0.8,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
});

export default VarietyProductCard; 