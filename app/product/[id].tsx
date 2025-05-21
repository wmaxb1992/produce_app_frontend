import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { 
  Heart, 
  Truck, 
  Calendar, 
  Leaf, 
  Award, 
  Sparkles,
  ChevronLeft,
  Share2,
} from 'lucide-react-native';
import useThemeStore from '@/store/useThemeStore';
import useProductStore from '@/store/useProductStore';
import useFarmStore from '@/store/useFarmStore';
import useCartStore from '@/store/useCartStore';
import useUserStore from '@/store/useUserStore';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  
  // Add error handling for theme store
  let theme;
  let colors;
  let borderRadius = 8; // Default value
  
  try {
    const { getThemeValues } = useThemeStore();
    theme = getThemeValues();
    colors = theme.colors;
    borderRadius = theme.borderRadius || 8;
  } catch (error) {
    console.error("Error accessing theme store:", error);
    // Fallback to light theme colors
    colors = {
      background: '#FFFFFF',
      card: '#F9F9F9',
      text: '#333333',
      subtext: '#666666',
      border: '#EEEEEE',
      primary: '#4CAF50',
      secondary: '#FF9800',
      success: '#4CAF50',
      error: '#F44336',
      warning: '#FFC107',
      info: '#2196F3',
      white: '#FFFFFF',
      gray: {
        100: '#F5F5F5',
        200: '#EEEEEE',
        300: '#E0E0E0',
        500: '#9E9E9E',
      }
    };
  }
  
  // Add error handling for product store
  let product;
  try {
    const productStore = useProductStore();
    if (productStore && typeof productStore.getProductById === 'function') {
      product = productStore.getProductById(id);
    }
  } catch (error) {
    console.error("Error accessing product store:", error);
    product = null;
  }
  
  // Add error handling for farm store
  let farm;
  try {
    const farmStore = useFarmStore();
    if (farmStore && typeof farmStore.getFarmById === 'function' && product) {
      farm = farmStore.getFarmById(product.farmId);
    }
  } catch (error) {
    console.error("Error accessing farm store:", error);
    farm = null;
  }
  
  // Add error handling for cart store
  let addToCart = (product, quantity) => {
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
  let addFavoriteProduct = (id) => {};
  let removeFavoriteProduct = (id) => {};
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
    isFavorite = user?.preferences.favoriteProducts.includes(id) || false;
  } catch (error) {
    console.error("Error accessing user store:", error);
  }
  
  const [quantity, setQuantity] = React.useState(1);
  
  // Calculate days since harvest
  const daysSinceHarvest = product?.preHarvest 
    ? 0 
    : product 
      ? Math.floor((new Date().getTime() - new Date(product.harvestDate).getTime()) / (1000 * 3600 * 24))
      : 0;
  
  if (!product || !farm) {
    return (
      <View style={[styles.notFound, { backgroundColor: colors.background }]}>
        <Text style={[styles.notFoundText, { color: colors.text }]}>
          Product not found
        </Text>
        <Button
          variant="primary"
          onPress={() => router.back()}
        >
          Go Back
        </Button>
      </View>
    );
  }
  
  const handleAddToCart = () => {
    addToCart(product, quantity);
    // Show success message or navigate to cart
  };
  
  const toggleFavorite = () => {
    if (isFavorite) {
      removeFavoriteProduct(id);
    } else {
      addFavoriteProduct(id);
    }
  };
  
  const handleIncrement = () => {
    setQuantity(prev => prev + 1);
  };
  
  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };
  
  return (
    <>
      <Stack.Screen 
        options={{
          headerTitle: '',
          headerTransparent: true,
          headerLeft: () => (
            <TouchableOpacity 
              style={[styles.headerButton, { backgroundColor: colors.white + 'CC' }]}
              onPress={() => router.back()}
            >
              <ChevronLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity 
              style={[styles.headerButton, { backgroundColor: colors.white + 'CC' }]}
            >
              <Share2 size={20} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Product Image */}
        <Image 
          source={{ uri: product.image }} 
          style={styles.image}
          resizeMode="cover"
        />
        
        {/* Badges */}
        <View style={styles.badgesContainer}>
          {product.organic && (
            <Badge 
              text="Organic" 
              variant="success" 
              size="md"
              style={styles.badge}
            />
          )}
          
          {product.preHarvest && (
            <Badge 
              text="Pre-Harvest" 
              variant="info" 
              size="md"
              style={styles.badge}
            />
          )}
          
          {product.inSeason && (
            <Badge 
              text="In Season" 
              variant="secondary" 
              size="md"
              style={styles.badge}
            />
          )}
        </View>
        
        {/* Product Info */}
        <View style={styles.infoContainer}>
          <View style={styles.nameRow}>
            <Text style={[styles.name, { color: colors.text }]}>
              {product.name}
            </Text>
            <TouchableOpacity 
              style={[
                styles.favoriteButton, 
                { 
                  backgroundColor: isFavorite ? colors.error + '20' : colors.gray[100],
                  borderColor: isFavorite ? colors.error : colors.gray[300],
                }
              ]}
              onPress={toggleFavorite}
            >
              <Heart 
                size={20} 
                color={isFavorite ? colors.error : colors.gray[500]} 
                fill={isFavorite ? colors.error : 'none'}
              />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.farmRow}
            onPress={() => router.push(`/farm/${farm.id}`)}
          >
            <Image 
              source={{ uri: farm.logo }} 
              style={styles.farmLogo}
              resizeMode="cover"
            />
            <Text style={[styles.farmName, { color: colors.text }]}>
              {farm.name}
            </Text>
          </TouchableOpacity>
          
          <Text style={[styles.price, { color: colors.text }]}>
            ${product.price.toFixed(2)} <Text style={styles.unit}>/ {product.unit}</Text>
          </Text>
          
          <Text style={[styles.description, { color: colors.text }]}>
            {product.description}
          </Text>
          
          {/* Freshness Indicator */}
          {!product.preHarvest && (
            <View style={styles.freshnessContainer}>
              <View style={styles.freshnessLabelRow}>
                <Text style={[styles.freshnessLabel, { color: colors.text }]}>
                  Freshness
                </Text>
                <Text style={[styles.freshnessScore, { color: colors.text }]}>
                  {product.freshness}/100
                </Text>
              </View>
              
              <View style={[styles.freshnessBar, { backgroundColor: colors.gray[200] }]}>
                <View 
                  style={[
                    styles.freshnessIndicator, 
                    { 
                      width: `${product.freshness}%`,
                      backgroundColor: product.freshness > 70 
                        ? colors.success 
                        : product.freshness > 40 
                          ? colors.warning 
                          : colors.error
                    }
                  ]} 
                />
              </View>
              
              <Text style={[styles.harvestDate, { color: colors.subtext }]}>
                {daysSinceHarvest === 0 
                  ? 'Harvested today' 
                  : `Harvested ${daysSinceHarvest} day${daysSinceHarvest !== 1 ? 's' : ''} ago`
                }
              </Text>
            </View>
          )}
          
          {/* Pre-Harvest Info */}
          {product.preHarvest && product.estimatedHarvestDate && (
            <View style={[styles.infoBox, { backgroundColor: colors.info + '10', borderColor: colors.info }]}>
              <Calendar size={20} color={colors.info} />
              <View style={styles.infoBoxContent}>
                <Text style={[styles.infoBoxTitle, { color: colors.text }]}>
                  Pre-Harvest Item
                </Text>
                <Text style={[styles.infoBoxText, { color: colors.subtext }]}>
                  Estimated harvest date: {new Date(product.estimatedHarvestDate).toLocaleDateString()}
                </Text>
              </View>
            </View>
          )}
          
          {/* Additional Info */}
          <View style={styles.additionalInfo}>
            <View style={styles.infoItem}>
              <Truck size={20} color={colors.primary} />
              <Text style={[styles.infoText, { color: colors.text }]}>
                Delivery available
              </Text>
            </View>
            
            {product.organic && (
              <View style={styles.infoItem}>
                <Leaf size={20} color={colors.success} />
                <Text style={[styles.infoText, { color: colors.text }]}>
                  Certified Organic
                </Text>
              </View>
            )}
            
            <View style={styles.infoItem}>
              <Award size={20} color={colors.secondary} />
              <Text style={[styles.infoText, { color: colors.text }]}>
                {farm.certifications && farm.certifications.length > 0 
                  ? farm.certifications[0] 
                  : "Quality Certified"}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      
      {/* Add to Cart Footer */}
      <View style={[styles.footer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <View style={styles.quantityContainer}>
          <TouchableOpacity 
            style={[styles.quantityButton, { borderColor: colors.border }]}
            onPress={handleDecrement}
          >
            <Text style={[styles.quantityButtonText, { color: colors.text }]}>-</Text>
          </TouchableOpacity>
          
          <Text style={[styles.quantity, { color: colors.text }]}>
            {quantity}
          </Text>
          
          <TouchableOpacity 
            style={[styles.quantityButton, { borderColor: colors.border }]}
            onPress={handleIncrement}
          >
            <Text style={[styles.quantityButtonText, { color: colors.text }]}>+</Text>
          </TouchableOpacity>
        </View>
        
        <Button
          variant="primary"
          style={styles.addButton}
          leftIcon={<Sparkles size={18} color={colors.white} />}
          onPress={handleAddToCart}
        >
          Add to Cart - ${(product.price * quantity).toFixed(2)}
        </Button>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  notFoundText: {
    fontSize: 18,
    marginBottom: 16,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  image: {
    width: width,
    height: width * 0.8,
  },
  badgesContainer: {
    flexDirection: 'row',
    position: 'absolute',
    top: 16,
    left: 16,
  },
  badge: {
    marginRight: 8,
  },
  infoContainer: {
    padding: 16,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    flex: 1,
    marginRight: 16,
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  farmRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  farmLogo: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  farmName: {
    fontSize: 16,
    fontWeight: '500',
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
  unit: {
    fontSize: 16,
    fontWeight: '400',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  freshnessContainer: {
    marginBottom: 24,
  },
  freshnessLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  freshnessLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  freshnessScore: {
    fontSize: 16,
    fontWeight: '600',
  },
  freshnessBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  freshnessIndicator: {
    height: '100%',
    borderRadius: 4,
  },
  harvestDate: {
    fontSize: 14,
  },
  infoBox: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 24,
  },
  infoBoxContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoBoxTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  infoBoxText: {
    fontSize: 14,
  },
  additionalInfo: {
    marginBottom: 24,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    marginLeft: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  quantity: {
    fontSize: 16,
    fontWeight: '600',
    width: 40,
    textAlign: 'center',
  },
  addButton: {
    flex: 1,
  },
});