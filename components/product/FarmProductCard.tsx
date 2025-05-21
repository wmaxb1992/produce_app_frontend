import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Heart, Sparkles, MapPin, Truck } from 'lucide-react-native';
import { Product, Farm, FarmProduct } from '@/types';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { useTheme } from '@/hooks/useTheme';
import { useSeasonalStyles } from '@/utils/seasonalStyles';
import useCartStore from '@/store/useCartStore';
import useUserStore from '@/store/useUserStore';

interface FarmProductCardProps {
  product: Product;
  farm: Farm;
  farmProduct?: FarmProduct;
  onPress?: () => void;
  onFarmPress?: () => void;
}

const FarmProductCard: React.FC<FarmProductCardProps> = ({ 
  product, 
  farm, 
  farmProduct,
  onPress,
  onFarmPress 
}) => {
  const router = useRouter();
  const { colors, isUsingSeasonalTheme, season } = useTheme();
  const seasonalStyles = useSeasonalStyles();
  
  // Combine product and farmProduct data
  const price = farmProduct?.price || product.price;
  const isOrganic = farmProduct?.organic || product.organic;
  const isAvailable = farmProduct ? farmProduct.available : product.inStock;
  
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
  let addFavoriteFarm = (id: string) => {};
  let removeFavoriteFarm = (id: string) => {};
  let isFarmFavorite = false;
  
  try {
    const userStore = useUserStore();
    user = userStore.user;
    if (typeof userStore.addFavoriteFarm === 'function') {
      addFavoriteFarm = userStore.addFavoriteFarm;
    }
    if (typeof userStore.removeFavoriteFarm === 'function') {
      removeFavoriteFarm = userStore.removeFavoriteFarm;
    }
    isFarmFavorite = user?.preferences?.favoriteStores?.includes(farm.id) || false;
  } catch (error) {
    console.error("Error accessing user store:", error);
  }
  
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/product/${product.id}?farmId=${farm.id}`);
    }
  };
  
  const handleFarmPress = () => {
    if (onFarmPress) {
      onFarmPress();
    } else {
      router.push(`/farm/${farm.id}`);
    }
  };
  
  const handleAddToCart = () => {
    // Create a modified product with farm information
    const farmSpecificProduct = {
      ...product,
      farmId: farm.id,
      farmName: farm.name,
      price: price
    };
    
    addToCart(farmSpecificProduct, 1);
  };
  
  const toggleFarmFavorite = () => {
    if (isFarmFavorite) {
      removeFavoriteFarm(farm.id);
    } else {
      addFavoriteFarm(farm.id);
    }
  };
  
  // Use seasonal card styles if product is in season
  const cardVariant = isUsingSeasonalTheme && isProductInSeason ? 'outlined' : 'elevated';
  
  // Calculate distance to display
  const distance = farmProduct?.distance ? 
    farmProduct.distance < 1 ? 
      `${(farmProduct.distance * 1000).toFixed(0)}m` : 
      `${farmProduct.distance.toFixed(1)}km` :
    `${farm.location.city}, ${farm.location.state}`;
  
  return (
    <Card 
      style={styles.card} 
      variant={cardVariant}
      seasonal={isProductInSeason} 
      intensity="medium"
    >
      <View style={styles.container}>
        {/* Product image section */}
        <TouchableOpacity 
          activeOpacity={0.8}
          onPress={handlePress}
          style={styles.imageSection}
        >
          <Image 
            source={{ uri: product.image }} 
            style={styles.productImage}
            resizeMode="cover"
          />
          
          {/* Product badges */}
          <View style={styles.productBadgeContainer}>
            {isOrganic && (
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
            
            {isProductInSeason && (
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
          
          {/* Product name overlay */}
          <View style={styles.productNameContainer}>
            <Text style={styles.productName} numberOfLines={1}>
              {product.name}
            </Text>
          </View>
        </TouchableOpacity>
        
        {/* Farm section */}
        <TouchableOpacity 
          activeOpacity={0.8}
          onPress={handleFarmPress}
          style={styles.farmSection}
        >
          {/* Farm header */}
          <View style={styles.farmHeader}>
            <Image 
              source={{ uri: farm.logo }} 
              style={styles.farmLogo}
              resizeMode="cover"
            />
            
            <View style={styles.farmNameContainer}>
              <Text style={styles.farmName} numberOfLines={1}>
                {farm.name}
              </Text>
              
              <View style={styles.farmMetaContainer}>
                <MapPin size={12} color={colors.subtext} />
                <Text style={styles.farmMetaText} numberOfLines={1}>
                  {distance}
                </Text>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.favoriteButton}
              onPress={toggleFarmFavorite}
            >
              <Heart 
                size={18} 
                color={isFarmFavorite ? colors.error : colors.gray[400]} 
                fill={isFarmFavorite ? colors.error : 'none'}
              />
            </TouchableOpacity>
          </View>
          
          {/* Farm certifications */}
          {farm.certifications && farm.certifications.length > 0 && (
            <View style={styles.certificationsContainer}>
              {farm.certifications.slice(0, 2).map((cert, index) => (
                <Text key={index} style={styles.certification}>
                  {cert}
                </Text>
              ))}
              {farm.certifications.length > 2 && (
                <Text style={styles.certificationCount}>
                  +{farm.certifications.length - 2}
                </Text>
              )}
            </View>
          )}
          
          {/* Delivery info */}
          {farmProduct?.deliveryDays && (
            <View style={styles.deliveryInfoContainer}>
              <Truck size={14} color={colors.primary} />
              <Text style={styles.deliveryInfo}>
                Delivers: {farmProduct.deliveryDays.slice(0, 2).join(', ')}
                {farmProduct.deliveryDays.length > 2 ? ' +' + (farmProduct.deliveryDays.length - 2) : ''}
              </Text>
            </View>
          )}
        </TouchableOpacity>
        
        {/* Bottom section */}
        <View style={styles.bottomSection}>
          <View>
            <Text style={styles.priceLabel}>Price</Text>
            <Text style={[styles.price, { 
              color: isUsingSeasonalTheme && isProductInSeason 
                ? colors.seasonal 
                : colors.text 
            }]}>
              ${price.toFixed(2)} <Text style={styles.unit}>/ {product.unit}</Text>
            </Text>
          </View>
          
          <TouchableOpacity 
            style={[
              styles.addButton, 
              { 
                backgroundColor: isUsingSeasonalTheme && isProductInSeason
                  ? colors.seasonal
                  : colors.primary,
                opacity: isAvailable ? 1 : 0.5 
              }
            ]}
            onPress={handleAddToCart}
            disabled={!isAvailable}
          >
            <Sparkles size={18} color={colors.white} />
          </TouchableOpacity>
        </View>
      </View>
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
  imageSection: {
    position: 'relative',
    width: '100%',
    height: 130,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productBadgeContainer: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    gap: 4,
  },
  badgeItem: {
    marginBottom: 4,
  },
  productNameContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  productName: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  farmSection: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  farmHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  farmLogo: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  farmNameContainer: {
    flex: 1,
  },
  farmName: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 2,
  },
  farmMetaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  farmMetaText: {
    fontSize: 12,
    color: '#666',
  },
  favoriteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
  },
  certificationsContainer: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 6,
  },
  certification: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  certificationCount: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  deliveryInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },
  deliveryInfo: {
    fontSize: 12,
    color: '#666',
  },
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  priceLabel: {
    fontSize: 12,
    color: '#666',
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
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
});

export default FarmProductCard; 