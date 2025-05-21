import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Product } from '@/types';
import { useRouter, Stack } from 'expo-router';
import { Sparkles, ShoppingBasket, Check, X, MapPin } from 'lucide-react-native';
import useThemeStore from '@/store/useThemeStore';
import useProductStore from '@/store/useProductStore';
import useCartStore from '@/store/useCartStore';
import useUserStore from '@/store/useUserStore';
import Button from '@/components/ui/Button';
import { mockFarms } from '@/mocks/farmData';

export default function MagicBasketScreen() {
  const router = useRouter();
  
  // Add error handling for theme store
  let theme;
  let colors: any;
  
  try {
    const { getThemeValues } = useThemeStore();
    theme = getThemeValues();
    colors = theme.colors;
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
      success: '#4CAF50',
      error: '#F44336',
      info: '#2196F3',
      white: '#FFFFFF',
      gray: {
        100: '#F5F5F5',
        300: '#E0E0E0',
        500: '#9E9E9E',
      }
    };
  }
  
  // Add error handling for product store
  let products: Array<Product> = [];
  try {
    const productStore = useProductStore();
    products = productStore.products || [];
  } catch (error) {
    console.error("Error accessing product store:", error);
  }
  
  // Add error handling for cart store
  let generateMagicCart = (productIds: string[], allProducts: Product[]) => {
    console.warn("generateMagicCart function not available");
  };
  
  try {
    const cartStore = useCartStore();
    if (cartStore && typeof cartStore.generateMagicCart === 'function') {
      generateMagicCart = cartStore.generateMagicCart;
    } else if (cartStore && typeof cartStore.addItem === 'function') {
      // Fallback implementation if generateMagicCart doesn't exist
      generateMagicCart = (productIds: string[], allProducts: Product[]) => {
        try {
          // Clear cart first (if clearCart exists)
          if (typeof cartStore.clearCart === 'function') {
            cartStore.clearCart();
          }
          
          // Add each product to cart
          productIds.forEach(productId => {
            const product = allProducts.find(p => p.id === productId);
            if (product) {
              cartStore.addItem(product as Product, 1);
            }
          });
        } catch (error) {
          console.error("Error in fallback generateMagicCart:", error);
        }
      };
    }
  } catch (error) {
    console.error("Error accessing cart store:", error);
  }
  
  // Add error handling for user store
  let user = null;
  try {
    const userStore = useUserStore();
    user = userStore.user;
  } catch (error) {
    console.error("Error accessing user store:", error);
  }
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [generatedProducts, setGeneratedProducts] = useState<string[]>([]);
  const [selectedZipCode, setSelectedZipCode] = useState('94107'); // Default to SF zip code
  
  // Group products by farm and delivery zone
  const productsByFarmAndZone = React.useMemo(() => {
    if (generatedProducts.length === 0) return {};
    
    const result: Record<string, {
      zoneName: string,
      farms: Record<string, {
        farmName: string,
        products: Array<{
          id: string,
          name: string,
          price: number,
          unit: string,
          image: string,
          organic: boolean
        }>
      }>
    }> = {};
    
    generatedProducts.forEach(productId => {
      const product = products.find(p => p.id === productId);
      if (!product) return;
      
      const farm = mockFarms.find(f => f.id === product.farmId);
      if (!farm) return;
      
      // Find a delivery zone that serves the selected zip code
      const deliveryZone = farm.deliveryZones && farm.deliveryZones.find(zone => 
        zone.areas && zone.areas.includes(selectedZipCode)
      );
      
      if (!deliveryZone) return; // Skip if farm doesn't deliver to this zip code
      
      if (!result[deliveryZone.id]) {
        result[deliveryZone.id] = {
          zoneName: deliveryZone.name,
          farms: {}
        };
      }
      
      if (!result[deliveryZone.id].farms[farm.id]) {
        result[deliveryZone.id].farms[farm.id] = {
          farmName: farm.name,
          products: []
        };
      }
      
      result[deliveryZone.id].farms[farm.id].products.push({
        id: product.id,
        name: product.name,
        price: product.price,
        unit: product.unit,
        image: product.image,
        organic: product.organic
      });
    });
    
    return result;
  }, [generatedProducts, products, selectedZipCode]);
  
  const handleGenerateMagicBasket = () => {
    setIsGenerating(true);
    
    // Simulate API call to generate basket
    setTimeout(() => {
      // Use user preferences to select products
      const dietaryRestrictions = user?.preferences?.dietaryRestrictions || [];
      
      // Filter products based on preferences
      let recommendedProducts = products.filter(product => {
        // Match categories
        const matchesCategory = true; // Since we don't have favoriteCategories in the user type
        
        // Match dietary restrictions (e.g., organic)
        const matchesDietary = !dietaryRestrictions.includes('organic') || product.organic;
        
        // Prioritize fresh products
        const isFresh = (product.freshness ?? 0) > 80;
        
        // Prioritize in-season products
        const isInSeason = product.inSeason;
        
        // Check if the farm delivers to the selected zip code
        const farm = mockFarms.find(f => f.id === product.farmId);
        const deliversToZip = farm?.deliveryZones?.some(zone => 
          zone.areas?.includes(selectedZipCode)
        );
        
        return matchesCategory && matchesDietary && (isFresh || isInSeason) && deliversToZip;
      });
      
      // Limit to 10 products
      recommendedProducts = recommendedProducts.slice(0, 10);
      
      // Get product IDs
      const productIds = recommendedProducts.map(p => p.id);
      
      setGeneratedProducts(productIds);
      setSelectedProducts(productIds);
      setIsGenerating(false);
    }, 2000);
  };
  
  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };
  
  const handleAddToCart = () => {
    generateMagicCart(selectedProducts, products);
    router.push('/cart');
  };
  

  
  return (
    <>
      <Stack.Screen options={{ title: 'Magic Basket' }} />
      
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {isGenerating ? (
          <View style={styles.loadingContainer}>
            <Sparkles size={48} color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.text }]}>
              Generating your magic basket...
            </Text>
            <Text style={[styles.loadingSubtext, { color: colors.subtext }]}>
              We're finding the freshest produce from farms near you
            </Text>
            <ActivityIndicator 
              size="large" 
              color={colors.primary} 
              style={styles.loadingIndicator}
            />
          </View>
        ) : generatedProducts.length > 0 ? (
          <>
            <Text style={[styles.title, { color: colors.text }]}>
              Your Magic Basket
            </Text>
            <Text style={[styles.subtitle, { color: colors.subtext }]}>
              We've selected these items based on your preferences and what's fresh and in season.
              Tap items to add or remove them from your basket.
            </Text>
            
            <ScrollView style={styles.productsList}>
              {Object.entries(productsByFarmAndZone).map(([zoneId, zoneData]) => (
                <View 
                  key={zoneId}
                  style={[styles.zoneContainer, { backgroundColor: colors.card }]}
                >
                  <View style={styles.zoneHeader}>
                    <MapPin size={18} color={colors.primary} />
                    <Text style={[styles.zoneName, { color: colors.text }]}>
                      {zoneData.zoneName} Delivery Zone
                    </Text>
                  </View>
                  
                  {Object.entries(zoneData.farms).map(([farmId, farmData]) => (
                    <View key={farmId} style={styles.farmContainer}>
                      <Text style={[styles.farmName, { color: colors.text }]}>
                        {farmData.farmName}
                      </Text>
                      
                      {farmData.products.map(product => {
                        const isSelected = selectedProducts.includes(product.id);
                        
                        return (
                          <TouchableOpacity 
                            key={product.id}
                            style={[
                              styles.productItem,
                              { 
                                backgroundColor: isSelected ? colors.primary + '10' : colors.background,
                                borderColor: isSelected ? colors.primary : colors.border,
                              }
                            ]}
                            onPress={() => toggleProductSelection(product.id)}
                          >
                            <Image 
                              source={{ uri: product.image }} 
                              style={styles.productImage}
                              resizeMode="cover"
                            />
                            
                            <View style={styles.productInfo}>
                              <Text style={[styles.productName, { color: colors.text }]}>
                                {product.name}
                              </Text>
                              <Text style={[styles.productPrice, { color: colors.text }]}>
                                ${product.price.toFixed(2)} / {product.unit}
                              </Text>
                              {product.organic && (
                                <Text style={[styles.organicLabel, { color: colors.success }]}>
                                  Organic
                                </Text>
                              )}
                            </View>
                            
                            <View 
                              style={[
                                styles.checkboxContainer, 
                                { 
                                  backgroundColor: isSelected ? colors.primary : colors.gray[100],
                                  borderColor: isSelected ? colors.primary : colors.gray[300],
                                }
                              ]}
                            >
                              {isSelected ? (
                                <Check size={16} color={colors.white} />
                              ) : (
                                <X size={16} color={colors.gray[500]} />
                              )}
                            </View>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  ))}
                </View>
              ))}
            </ScrollView>
            
            <View style={styles.footer}>
              <Button
                variant="outline"
                style={styles.regenerateButton}
                leftIcon={<Sparkles size={18} color={colors.primary} />}
                onPress={handleGenerateMagicBasket}
              >
                Regenerate
              </Button>
              
              <Button
                variant="primary"
                style={styles.addButton}
                leftIcon={<ShoppingBasket size={18} color={colors.white} />}
                onPress={handleAddToCart}
                disabled={selectedProducts.length === 0}
              >
                Add to Cart ({selectedProducts.length})
              </Button>
            </View>
          </>
        ) : (
          <View style={styles.initialContainer}>
            <Sparkles size={64} color={colors.primary} />
            <Text style={[styles.initialTitle, { color: colors.text }]}>
              Create Your Magic Basket
            </Text>
            <Text style={[styles.initialSubtitle, { color: colors.subtext }]}>
              Let us curate a basket of fresh, seasonal produce from local farms based on your preferences.
            </Text>
            <Button
              variant="primary"
              style={styles.generateButton}
              leftIcon={<Sparkles size={18} color={colors.white} />}
              onPress={handleGenerateMagicBasket}
            >
              Generate Magic Basket
            </Button>
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  loadingSubtext: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  loadingIndicator: {
    marginTop: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
  },
  productsList: {
    flex: 1,
  },
  zoneContainer: {
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
  },
  zoneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  zoneName: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  farmContainer: {
    marginBottom: 16,
  },
  farmName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 4,
  },
  productItem: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    marginBottom: 4,
  },
  organicLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  checkboxContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderWidth: 1,
  },
  footer: {
    flexDirection: 'row',
    marginTop: 16,
  },
  regenerateButton: {
    flex: 1,
    marginRight: 8,
  },
  addButton: {
    flex: 2,
  },
  initialContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  initialTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  initialSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  generateButton: {
    paddingHorizontal: 24,
  },
});