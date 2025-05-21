import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Heart, Sparkles } from 'lucide-react-native';
import { Product } from '@/types';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { useTheme } from '@/hooks/useTheme';
import { useSeasonalStyles } from '@/utils/seasonalStyles';
import useCartStore from '@/store/useCartStore';
import useUserStore from '@/store/useUserStore';

interface ProductCardProps {
  product: Product;
  onPress?: () => void;
  showFarm?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onPress, showFarm = false }) => {
  const router = useRouter();
  const { colors, isUsingSeasonalTheme, season } = useTheme();
  const seasonalStyles = useSeasonalStyles();
  
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
  
  // Calculate days since harvest
  const daysSinceHarvest = product.preHarvest 
    ? 0 
    : Math.floor((new Date().getTime() - new Date(product.harvestDate || new Date()).getTime()) / (1000 * 3600 * 24));
  
  const handlePress = () => {
    router.push(`/product/${product.id}`);
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
  
  // Use seasonal card styles if product is in season
  const cardVariant = isUsingSeasonalTheme && isProductInSeason ? 'outlined' : 'elevated';
  
  return (
    <Card 
      style={styles.card} 
      variant={cardVariant}
      seasonal={isProductInSeason} // Only apply seasonal styling if product is in season
      intensity={isProductInSeason ? 'strong' : 'subtle'} // Stronger styling for in-season products
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
          
          {product.organic && (
            <View style={styles.badgeContainer}>
              <Badge 
                text="Organic" 
                variant="success" 
                size="sm"
              />
            </View>
          )}
          
          {product.preHarvest && (
            <View style={[styles.badgeContainer, { top: product.organic ? 28 : 8 }]}>
              <Badge 
                text="Pre-Harvest" 
                variant="info" 
                size="sm"
              />
            </View>
          )}
          
          {/* Add seasonal badge if product is in season */}
          {isUsingSeasonalTheme && isProductInSeason && (
            <View style={[styles.badgeContainer, { top: product.organic && product.preHarvest ? 48 : product.organic || product.preHarvest ? 28 : 8 }]}>
              <Badge 
                text="In Season" 
                variant="seasonal" 
                size="sm"
                customColor={colors.seasonal}
              />
            </View>
          )}
        </View>
        
        <View style={styles.contentContainer}>
          <Text 
            style={[
              styles.name, 
              { 
                color: isUsingSeasonalTheme && isProductInSeason 
                  ? colors.seasonal
                  : colors.text,
                fontWeight: isProductInSeason ? '700' : '600' // Make in-season products bolder
              }
            ]} 
            numberOfLines={1}
          >
            {product.name}
          </Text>
          
          {showFarm && product.farmName && (
            <Text style={[styles.farmName, { color: colors.subtext }]} numberOfLines={1}>
              From {product.farmName}
            </Text>
          )}
          
          <View style={styles.priceRow}>
            <Text style={[styles.price, { 
              color: isUsingSeasonalTheme && isProductInSeason 
                ? colors.seasonal 
                : colors.text 
            }]}>
              ${product.price.toFixed(2)} <Text style={styles.unit}>/ {product.unit}</Text>
            </Text>
            
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
          
          {!product.preHarvest && product.freshness !== undefined && (
            <View style={styles.freshnessContainer}>
              <View style={styles.freshnessBar}>
                <View 
                  style={[
                    styles.freshnessIndicator, 
                    { 
                      width: `${product.freshness}%`,
                      backgroundColor: isUsingSeasonalTheme && isProductInSeason
                        ? colors.seasonal
                        : product.freshness > 70 
                          ? colors.success 
                          : product.freshness > 40 
                            ? colors.warning 
                            : colors.error
                    }
                  ]} 
                />
              </View>
              <Text style={[styles.freshnessText, { color: colors.subtext }]}>
                {daysSinceHarvest === 0 ? 'Harvested today' : `${daysSinceHarvest} day${daysSinceHarvest !== 1 ? 's' : ''} ago`}
              </Text>
            </View>
          )}
          
          {product.preHarvest && product.estimatedHarvestDate && (
            <Text style={[styles.preHarvestText, { 
              color: isUsingSeasonalTheme && isProductInSeason 
                ? colors.seasonal 
                : colors.info 
            }]}>
              Est. harvest: {new Date(product.estimatedHarvestDate).toLocaleDateString()}
            </Text>
          )}
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
    borderRadius: 12,
  },
  container: {
    width: '100%',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 130,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
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
  badgeContainer: {
    position: 'absolute',
    top: 8,
    left: 8,
  },
  contentContainer: {
    padding: 12,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  farmName: {
    fontSize: 12,
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
  },
  unit: {
    fontSize: 12,
    fontWeight: '500',
    opacity: 0.8,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  freshnessContainer: {
    marginTop: 4,
  },
  freshnessBar: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  freshnessIndicator: {
    height: '100%',
    borderRadius: 2,
  },
  freshnessText: {
    fontSize: 12,
  },
  preHarvestText: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default ProductCard;