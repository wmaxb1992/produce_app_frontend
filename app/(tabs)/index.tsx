import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList, Image, Animated, StyleSheet, Easing, Dimensions, TextInput, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Filter, Plus, Minus, Grid, List, ArrowUp, Home, Search, X } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { useSeasonalStyles } from '@/utils/seasonalStyles';
import useProductStore from '@/store/useProductStore';
import useFarmStore from '@/store/useFarmStore';
import useSubscriptionStore from '@/store/useSubscriptionStore';
import useUserStore from '@/store/useUserStore';
import type { Category, Subcategory, Variety, Product, Farm, FarmPost, Address } from '@/types';
import { ScrollView as GestureScrollView } from 'react-native-gesture-handler';
import { ScrollView as RNScrollView } from 'react-native';
import ProductCard from '@/components/product/ProductCard';
import FarmPostCard from '@/components/farm/FarmPostCard';
import { homeStyles } from '@/styles/layouts/home';
import { 
  Skeleton, 
  ProductCardSkeleton, 
  FarmCardSkeleton,
  CategoryCardSkeleton,
  BannerSkeleton,
  AddressBarSkeleton,
  SearchBarSkeleton
} from '@/components/ui/Skeleton';
import LoadingState from '@/components/ui/LoadingState';
import { LinearGradient } from 'expo-linear-gradient';

// Import our extracted components
import AddressBar from '@/components/home/AddressBar';
import SearchBar from '@/components/home/SearchBar';
import MagicBasketBanner from '@/components/home/MagicBasketBanner';
import CategoriesSection from '@/components/home/CategoriesSection';
import SubcategoriesSection from '@/components/home/SubcategoriesSection';
import VarietiesSection from '@/components/home/VarietiesSection';
import FeaturedFarmsSection from '@/components/home/FeaturedFarmsSection';
import SubscriptionBundlesSection from '@/components/home/SubscriptionBundlesSection';
import SeasonalHeader from '@/components/home/SeasonalHeader';
import SeasonalProductsSection from '@/components/home/SeasonalProductsSection';
import InstantlyAvailableSection from '@/components/home/InstantlyAvailableSection';
import CategoryCard from '@/components/product/CategoryCard';
import SubcategoryCard from '@/components/product/SubcategoryCard';
import FarmCard from '@/components/farm/FarmCard';

// Local styles for components not yet moved to separate style files
const styles = StyleSheet.create({
  container: homeStyles.container,
  filterButton: {
    marginLeft: 8,
  },
  section: {
    marginBottom: 4,
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 16,
    marginHorizontal: -16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  viewToggle: {
    padding: 8,
  },
  featuredContainer: {
    marginLeft: -16,
  },
  featuredContent: {
    paddingHorizontal: 6,
    gap: 16,
  },
  featuredCard: {
    width: 120,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
  },
  featuredImage: {
    width: '100%',
    height: 70,
    resizeMode: 'cover',
  },
  featuredImageStepper: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    padding: 8,
  },
  stepper: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 4,
    overflow: 'hidden',
    paddingHorizontal: 4,
  },
  stepperButton: {
    padding: 2,
  },
  stepperText: {
    paddingHorizontal: 4,
    alignSelf: 'center',
  },
  featuredInfo: {
    padding: 6,
  },
  featuredTitle: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 2,
  },
  featuredMeta: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  featuredRating: {
    fontSize: 9,
    color: '#666',
  },
  featuredTime: {
    fontSize: 9,
    color: '#666',
  },
  farmInfo: {
    marginBottom: 2,
  },
  farmName: {
    fontSize: 9,
    fontWeight: '500',
    color: '#333',
  },
  farmLocation: {
    fontSize: 8,
    color: '#666',
  },
  addToCartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  featuredPrice: {
    fontSize: 10,
    fontWeight: '700',
  },
  filteredProductsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 12,
    paddingHorizontal: 16,
  },
  filteredProductCard: {
    width: '31%',
    marginBottom: 12,
  },
  varietyListContainer: {
    paddingHorizontal: 16,
  },
  varietySection: {
    marginBottom: 16,
  },
  varietyTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  varietyCount: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
  },
  varietyRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  varietyName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  varietyDescription: {
    fontSize: 14,
    color: '#666',
  },
  // Header styles
  headerContainer: {
    backgroundColor: 'white',
    paddingTop: 8, 
    paddingBottom: 0,
    borderBottomWidth: 0,
    borderBottomColor: '#E5E5E5',
  },
  addressBarWrapper: {
    marginBottom: 0,
  },
  searchBarWrapper: {
    marginTop: 0,
    marginBottom: 0,
    paddingTop: 0,
  },
  mainContainer: {
    flex: 1,
  },
  mainContent: {
    paddingTop: 0,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: Dimensions.get('window').height * 0.5,
    zIndex: 0,
  },
});

// Add a helper function to format the address
const formatAddress = (address: Address | undefined) => {
  if (!address) return 'No address available';
  return `${address.street}, ${address.city}, ${address.state} ${address.zip}`;
};

interface HomeScreenProps {}

const HomeScreen: React.FC<HomeScreenProps> = () => {
  const router = useRouter();
  const { colors, theme: themeType, isUsingSeasonalTheme, season } = useTheme();
  const seasonalStyles = useSeasonalStyles();
  const isDark = themeType === 'dark';
  
  // Get user data and default address
  const { user } = useUserStore();
  const defaultAddress = user?.addresses?.find(addr => addr.default) || user?.addresses?.[0];
  const formattedAddress = defaultAddress ? formatAddress(defaultAddress) : 'Add delivery address';
  
  const floatingAnim = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const [isAddressVisible, setIsAddressVisible] = useState(true);
  
  // Animated values for fade-in effects
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  // Add loading state to force skeleton to show for a minimum time
  const [isLocalLoading, setIsLocalLoading] = useState(true);
  
  // Get data and loading states from stores
  let products: Product[] = [];
  let categories: Category[] = [];
  let isProductsLoading = false;
  let fetchProducts: () => Promise<{products: Product[]; categories: Category[]}> = 
    () => Promise.resolve({products: [], categories: []});
  
  let farms: Farm[] = [];
  let farmPosts: FarmPost[] = [];
  let isFarmsLoading = false;
  let fetchFarmData: () => Promise<{farms: Farm[]; farmPosts: FarmPost[]}> = 
    () => Promise.resolve({farms: [], farmPosts: []});
  
  let subscriptionBundles: any[] = [];
  let isSubscriptionsLoading = false;
  let fetchBundles: () => Promise<any> = 
    () => Promise.resolve({bundles: []});
  
  try {
    const productStore = useProductStore();
    products = productStore.products;
    categories = productStore.categories;
    isProductsLoading = productStore.isLoading;
    fetchProducts = productStore.fetchProducts;
  } catch (error) {
    console.warn("Error using product store:", error);
  }
  
  try {
    const farmStore = useFarmStore();
    farms = farmStore.farms;
    farmPosts = farmStore.farmPosts;
    isFarmsLoading = farmStore.isLoading;
    fetchFarmData = farmStore.fetchFarmData;
  } catch (error) {
    console.warn("Error using farm store:", error);
  }

  try {
    const subscriptionStore = useSubscriptionStore();
    subscriptionBundles = subscriptionStore?.bundles || [];
    isSubscriptionsLoading = subscriptionStore?.isLoading || false;
    fetchBundles = subscriptionStore?.fetchBundles || (() => Promise.resolve({bundles: []}));
  } catch (error) {
    console.warn("Error using subscription store:", error);
  }

  // Check if everything is loading
  const isLoading = isProductsLoading || isFarmsLoading || isSubscriptionsLoading || isLocalLoading;

  // Log loading states for debugging
  useEffect(() => {
    console.log('Loading states:', { 
      isProductsLoading, 
      isFarmsLoading, 
      isSubscriptionsLoading, 
      isLocalLoading, 
      isLoading 
    });
  }, [isProductsLoading, isFarmsLoading, isSubscriptionsLoading, isLocalLoading, isLoading]);

  // Fetch data in parallel on mount
  useEffect(() => {
    // Create an array of fetch promises
    const fetchPromises = [];
    
    // Add product fetch promise if the function exists
    if (typeof fetchProducts === 'function') {
      fetchPromises.push(
        fetchProducts().catch(err => {
          console.error("Error fetching products:", err);
          return { products: [], categories: [] };
        })
      );
    }
    
    // Add farm data fetch promise if the function exists
    if (typeof fetchFarmData === 'function') {
      fetchPromises.push(
        fetchFarmData().catch(err => {
          console.error("Error fetching farm data:", err);
          return { farms: [], farmPosts: [] };
        })
      );
    }
    
    // Add subscription bundles fetch promise
    if (typeof fetchBundles === 'function') {
      fetchPromises.push(
        fetchBundles().catch(err => {
          console.error("Error fetching bundles:", err);
          return { bundles: [] };
        })
      );
    }
    
    // Execute all fetches in parallel
    Promise.all(fetchPromises)
      .then(() => {
        console.log("All data fetched successfully");
        
        // Force loading state for a minimum time to ensure skeleton is visible
        setTimeout(() => {
          setIsLocalLoading(false);
          
          // Start fade-in animation when loading is complete
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }).start();
        }, 1000);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setIsLocalLoading(false);
      });
      
    return () => {
      // Cleanup
    };
  }, []);

  // Create floating animation
  useEffect(() => {
    const floatLoop = () => {
      Animated.sequence([
        Animated.timing(floatingAnim, {
          toValue: 1,
          duration: 3500,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(floatingAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ]).start(() => floatLoop());
    };

    floatLoop();
    return () => {
      floatingAnim.setValue(0);
    };
  }, []);

  const animatedStyle = {
    transform: [{
      translateY: floatingAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -15],
      })
    }]
  };

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [selectedVariety, setSelectedVariety] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter state for carousels
  const [selectedFilter, setSelectedFilter] = useState<string>('mostPopular');

  // Define filter options (now with emoji)
  const filterOptions = [
    { key: 'mostPopular', label: 'Most Popular', emoji: '🔥' },
    { key: 'stoneFruit', label: 'Stone Fruit', emoji: '🍑' },
    { key: 'citrus', label: 'Citrus', emoji: '🍊' },
    { key: 'berries', label: 'Berries', emoji: '🫐' },
    { key: 'recentlyBought', label: 'Recently Bought', emoji: '🛒' },
  ];

  // Get subcategories for the selected category
  const subcategories = selectedCategory
    ? categories.find(cat => cat.id === selectedCategory)?.subcategories ?? []
    : [];

  // Filter subcategories based on selected filter (must be after subcategories is defined)
  const filteredSubcategories = selectedFilter === 'mostPopular'
    ? subcategories
    : subcategories.filter(sub =>
        sub.name.toLowerCase().includes(
          selectedFilter === 'stoneFruit' ? 'stone' :
          selectedFilter === 'citrus' ? 'citrus' :
          selectedFilter === 'berries' ? 'berr' :
          selectedFilter === 'recentlyBought' ? 'recent' : ''
        )
      );

  const [freshProducts, setFreshProducts] = useState<Product[]>([]);
  const [preHarvestProducts, setPreHarvestProducts] = useState<Product[]>([]);
  const [inSeasonProducts, setInSeasonProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isListView, setIsListView] = useState(false);
  // Instantly show/hide banner based on selectedCategory
  const showBanner = !selectedCategory;

  const getFreshProducts = useCallback(() => {
    return products.filter(product => product.freshness != null && product.freshness >= 90 && product.inStock);
  }, [products]);

  const getPreHarvestProducts = useCallback(() => {
    return products.filter(product => product.preHarvest);
  }, [products]);

  const getInSeasonProducts = useCallback(() => {
    return products.filter(product => product.inSeason);
  }, [products]);

  // Update filtered products when filters change
  useEffect(() => {
    let filtered = [...products];
    
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    if (selectedSubcategory) {
      filtered = filtered.filter(product => product.subcategory === selectedSubcategory);
    }
    
    if (selectedVariety) {
      filtered = filtered.filter(product => product.variety === selectedVariety);
    }
    
    setFilteredProducts(filtered);
  }, [selectedCategory, selectedSubcategory, selectedVariety, products]);

  // Add mock seasonal data for testing
  useEffect(() => {
    if (products.length > 0) {
      // Add seasons to first few products for testing seasonal section
      const currentSeason = new Date().getMonth() >= 2 && new Date().getMonth() <= 4 ? 'spring' :
                           new Date().getMonth() >= 5 && new Date().getMonth() <= 7 ? 'summer' :
                           new Date().getMonth() >= 8 && new Date().getMonth() <= 10 ? 'fall' : 'winter';
      
      // Modify first 5 products to have current season
      products.slice(0, 5).forEach(product => {
        if (!product.seasons) {
          (product as any).seasons = [currentSeason, 'year-round'];
        }
      });
      
      console.log(`Added ${currentSeason} season to first 5 products`, products[0]);
    }
  }, [products]);

  useEffect(() => {
    setFreshProducts(getFreshProducts());
    setPreHarvestProducts(getPreHarvestProducts());
    setInSeasonProducts(getInSeasonProducts());
  }, [getFreshProducts, getPreHarvestProducts, getInSeasonProducts]);

  // Get the selected category object
  const selectedCategoryObj = selectedCategory
    ? categories.find(cat => cat.id === selectedCategory)
    : null;

  // Get the selected subcategory object
  const selectedSubcategoryObj = selectedSubcategory
    ? subcategories.find(sub => sub.id === selectedSubcategory)
    : null;

  // Get varieties for the selected subcategory
  const varieties = selectedSubcategoryObj?.varieties ?? [];

  const handleClearFilters = () => {
    console.log('Clearing all filters');
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setSelectedVariety(null);
  };

  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(null);
    setSelectedVariety(null);
  };

  const handleSubcategoryPress = (subcategoryId: string) => {
    setSelectedSubcategory(subcategoryId);
    setSelectedVariety(null);
  };

  const handleSearchPress = () => {
    router.push('/search');
  };

  const handleProductPress = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  const handleFarmPress = (farmId: string) => {
    router.push(`/farm/${farmId}`);
  };

  const handlePostPress = (postId: string) => {
    // Navigate to post detail or farm page
    const post = farmPosts.find((p: FarmPost) => p.id === postId);
    if (post) {
      router.push(`/farm/${post.farmId}`);
    }
  };

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.y;
    if (scrollPosition > 20 && isAddressVisible) {
      setIsAddressVisible(false);
    } else if (scrollPosition <= 20 && !isAddressVisible) {
      setIsAddressVisible(true);
    }
  };

  // Skeleton loaders for each section
  const renderSkeletonLoader = () => {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Address and Search Bar Skeleton */}
        <View style={[styles.headerContainer, { backgroundColor: colors.background }]}>
          <View style={styles.addressBarWrapper}>
            <AddressBarSkeleton />
          </View>
          <View style={styles.searchBarWrapper}>
            <SearchBarSkeleton />
          </View>
        </View>

        {/* Main content */}
        <ScrollView contentContainerStyle={styles.mainContent}>
          {/* Magic Basket Banner Skeleton */}
          <BannerSkeleton />

          {/* Categories Skeleton */}
          <View style={styles.section}>
            <Skeleton height={24} width={120} style={{ marginHorizontal: 16, marginBottom: 12 }} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft: 16 }}>
              <View style={{ flexDirection: 'row', gap: 12 }}>
                {[1, 2, 3, 4, 5].map((_, index) => (
                  <CategoryCardSkeleton key={index} />
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Featured Farms Skeleton */}
          <View style={styles.section}>
            <Skeleton height={24} width={150} style={{ marginHorizontal: 16, marginBottom: 12 }} />
            <ScrollView 
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.featuredContainer}
              contentContainerStyle={styles.featuredContent}
            >
              {[1, 2, 3].map((_, index) => (
                <FarmCardSkeleton key={index} />
              ))}
            </ScrollView>
          </View>

          {/* Fresh Picks Skeleton */}
          <View style={styles.section}>
            <Skeleton height={24} width={120} style={{ marginHorizontal: 16, marginBottom: 12 }} />
            <ScrollView 
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.featuredContainer}
              contentContainerStyle={styles.featuredContent}
            >
              {[1, 2, 3, 4].map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </ScrollView>
          </View>

          {/* Farm Posts Skeleton */}
          <View style={styles.section}>
            <Skeleton height={24} width={150} style={{ marginHorizontal: 16, marginBottom: 12 }} />
            {[1, 2].map((_, index) => (
              <View key={index} style={{ marginHorizontal: 16, marginBottom: 16 }}>
                <Skeleton height={200} width="100%" borderRadius={8} />
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  };

  // Helper to get most popular varieties for the selected category
  const getMostPopularVarieties = () => {
    if (!selectedCategory) return [];
    const cat = categories.find(cat => cat.id === selectedCategory);
    if (!cat) return [];
    // Flatten all varieties in all subcategories
    const allVarieties = cat.subcategories.flatMap(sub => sub.varieties);
    // Get review counts for each variety from products
    const varietyReviewCounts = allVarieties.map(variety => {
      const productsForVariety = products.filter(p => p.variety === variety.id);
      const totalReviews = productsForVariety.reduce((sum, p) => sum + (p.reviewCount || 0), 0);
      return { ...variety, _reviewCount: totalReviews };
    });
    // Sort by review count descending and take top 8
    return varietyReviewCounts.sort((a, b) => b._reviewCount - a._reviewCount).slice(0, 8);
  };

  if (isLoading) {
    return renderSkeletonLoader();
  }

  // Get seasonal background styling for the main container
  const seasonalBackgroundStyle = seasonalStyles.isSeasonalActive 
    ? seasonalStyles.getPageBackground() 
    : { backgroundColor: colors.background };
  
  // Get header background with seasonal tint
  const headerBackgroundStyle = {
    ...styles.headerContainer,
    backgroundColor: seasonalStyles.isSeasonalActive 
      ? seasonalStyles.getBackgroundColor(0.08) 
      : colors.background,
    borderBottomColor: seasonalStyles.isSeasonalActive 
      ? seasonalStyles.getBorderColor(0.2) 
      : styles.headerContainer.borderBottomColor,
    borderBottomWidth: seasonalStyles.isSeasonalActive ? 1 : 0,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  };

  return (
    <View style={[styles.container, seasonalBackgroundStyle]}>
      {/* Gradient as background */}
      <LinearGradient
        colors={['rgba(0,0,0,0.8)', 'rgba(255,255,121,0)']}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 232, zIndex: 0 }}
        start={{ x: 0, y: 0.2 }}
        end={{ x: 0, y: 0.91 }}
      />
      {/* Header (Address bar and Search) */}
      <Animated.View style={headerBackgroundStyle}>
        <View style={styles.addressBarWrapper}>
          <AddressBar address={formattedAddress} />
        </View>
        <View style={styles.searchBarWrapper}>
          <SearchBar onPress={handleSearchPress} />
        </View>
      </Animated.View>

      {/* Main Content */}
      <View style={styles.mainContainer}>
        <ScrollView 
          ref={scrollViewRef}
          style={styles.mainContent}
          contentContainerStyle={seasonalStyles.isSeasonalActive ? { paddingBottom: 120 } : { paddingBottom: 100 }}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false, listener: handleScroll }
          )}
          scrollEventThrottle={16}
        >
          {/* Categories - should be first under search bar */}
          <View style={homeStyles.section}>
            <View style={homeStyles.sectionHeader}>
              <Text style={[homeStyles.sectionTitle, { color: colors.text }]}>
                Categories
              </Text>
              {selectedCategory && (
                <TouchableOpacity
                  style={[homeStyles.clearButton, { backgroundColor: colors.card }]}
                  onPress={handleClearFilters}
                >
                  <Home size={20} color={colors.primary} />
                </TouchableOpacity>
              )}
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={homeStyles.categoriesContainer}
            >
              {categories.map((category: Category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  isSelected={selectedCategory === category.id}
                  onPress={() => handleCategoryPress(category.id)}
                />
              ))}
            </ScrollView>
          </View>

          {/* Filter Buttons - Only show if a category is selected */}
          {selectedCategory && (
            <View style={[homeStyles.section, { marginTop: 10 }]}>
              <RNScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginLeft: 8 }}
                contentContainerStyle={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
              >
                {filterOptions.map(option => (
                  <TouchableOpacity
                    key={option.key}
                    style={{
                      backgroundColor: selectedFilter === option.key ? colors.primary : colors.gray[200],
                      borderRadius: 8,
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      marginRight: 6,
                    }}
                    onPress={() => setSelectedFilter(option.key)}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={{ fontSize: 13, marginRight: 4 }}>{option.emoji}</Text>
                      <Text style={{ color: selectedFilter === option.key ? colors.white : colors.text, fontWeight: '500', fontSize: 12 }}>
                        {option.label}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </RNScrollView>
            </View>
          )}

          {/* Magic Basket Banner */}
          {showBanner && (
            <MagicBasketBanner />
          )}

          {/* Featured Farms */}
          {(!selectedCategory && farms.length > 0) && (
            <FeaturedFarmsSection farms={farms} />
          )}

          {/* Instantly Available Section */}
          <InstantlyAvailableSection />

          {/* Subcategories - Only show if a category is selected and isListView is true */}
          {selectedCategory && subcategories.length > 0 && isListView && (
            <SubcategoriesSection 
              subcategories={subcategories}
              selectedSubcategory={selectedSubcategory}
              onSubcategoryPress={handleSubcategoryPress}
            />
          )}

          {/* Varieties Carousels - Show a carousel for each subcategory if a category is selected and not in list view */}
          {selectedCategory && selectedFilter === 'mostPopular' && !isListView && (
            <VarietiesSection
              varieties={getMostPopularVarieties()}
              selectedVariety={selectedVariety}
              title={'🔥 Most Popular'}
            />
          )}
          {selectedCategory && filteredSubcategories.length > 0 && !isListView && (
            filteredSubcategories.map((subcategory, idx) => (
              <React.Fragment key={subcategory.id}>
                {idx > 0 && (
                  <View style={{
                    height: 1,
                    backgroundColor: '#E5E5E5',
                    marginVertical: 16,
                    marginHorizontal: 16,
                    borderRadius: 1,
                  }} />
                )}
                <VarietiesSection
                  varieties={subcategory.varieties}
                  selectedVariety={selectedVariety}
                  title={subcategory.name}
                />
              </React.Fragment>
            ))
          )}
          
          {/* Seasonal Products Section */}
          {seasonalStyles.isSeasonalActive && (
            <SeasonalProductsSection
              products={products.filter(p => p.seasons?.includes(season))}
              loading={false}
            />
          )}
          
          {/* Fresh Picks - Only show when no category is selected */}
          {!selectedCategory && freshProducts.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Fresh Picks
                </Text>
              </View>
              
              <ScrollView 
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.featuredContainer}
                contentContainerStyle={styles.featuredContent}
              >
                {freshProducts.map(product => (
                  <TouchableOpacity 
                    key={product.id} 
                    style={styles.featuredCard}
                    onPress={() => handleProductPress(product.id)}
                  >
                    <View>
                      <Image
                        source={{ uri: product.image }}
                        style={styles.featuredImage}
                      />
                      <View style={styles.featuredImageStepper}>
                        <View style={styles.stepper}>
                          <TouchableOpacity 
                            style={styles.stepperButton}
                            onPress={() => {
                              // Handle decrease quantity
                            }}
                          >
                            <Minus size={16} color={colors.text} />
                          </TouchableOpacity>
                          <Text style={styles.stepperText}>1</Text>
                          <TouchableOpacity 
                            style={styles.stepperButton}
                            onPress={() => {
                              // Handle increase quantity
                            }}
                          >
                            <Plus size={16} color={colors.text} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                    <View style={styles.featuredInfo}>
                      <Text style={styles.featuredTitle} numberOfLines={1}>
                        {product.name}
                      </Text>
                      <View style={styles.featuredMeta}>
                        <Text style={styles.featuredRating}>
                          {product.rating} ★ ({product.reviewCount})
                        </Text>
                        <Text style={styles.featuredTime}>
                          • {Math.round(Math.random() * 20 + 20)} min
                        </Text>
                      </View>
                      <View style={styles.farmInfo}>
                        <Text style={styles.farmName}>{product.farmName}</Text>
                        <Text style={styles.farmLocation}>San Francisco, CA</Text>
                      </View>
                      
                      <View style={styles.addToCartContainer}>
                        <Text style={styles.featuredPrice}>
                          ${product.price.toFixed(2)}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
          
          {/* Pre-Harvest Products - Only show when no category is selected */}
          {!selectedCategory && preHarvestProducts.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Coming Soon (Pre-Harvest)
              </Text>
              
              <ScrollView 
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.featuredContainer}
                contentContainerStyle={styles.featuredContent}
              >
                {preHarvestProducts.map(product => (
                  <TouchableOpacity 
                    key={product.id} 
                    style={styles.featuredCard}
                    onPress={() => handleProductPress(product.id)}
                  >
                    <View>
                      <Image
                        source={{ uri: product.image }}
                        style={styles.featuredImage}
                      />
                      <View style={styles.featuredImageStepper}>
                        <View style={[styles.stepper, { backgroundColor: '#e8f5e9' }]}>
                          <Text style={[styles.stepperText, { color: '#43a047' }]}>Reserve</Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.featuredInfo}>
                      <Text style={styles.featuredTitle} numberOfLines={1}>
                        {product.name}
                      </Text>
                      <View style={styles.featuredMeta}>
                        <Text style={styles.featuredRating}>
                          Available in {product.estimatedHarvestDate ? Math.ceil((new Date(product.estimatedHarvestDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : '?'} days
                        </Text>
                      </View>
                      <View style={styles.farmInfo}>
                        <Text style={styles.farmName}>{product.farmName}</Text>
                        <Text style={styles.farmLocation}>San Francisco, CA</Text>
                      </View>
                      
                      <View style={styles.addToCartContainer}>
                        <Text style={styles.featuredPrice}>
                          ${product.price.toFixed(2)}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
          
          {/* Filtered Products - Show when a filter is applied */}
          {(selectedCategory || selectedSubcategory || selectedVariety) && (
            <View style={styles.section}>
              <View style={[styles.separator, { backgroundColor: colors.border }]} />
              <View style={[styles.sectionHeader, { marginHorizontal: 16 }]}>
                <Text style={[styles.sectionTitle, { marginHorizontal: 0, marginBottom: 0 }]}>
                  {filteredProducts.length} Products
                </Text>
                <TouchableOpacity
                  onPress={() => setIsListView(!isListView)}
                  style={styles.viewToggle}
                >
                  {isListView ? (
                    <Grid size={24} color={colors.text} />
                  ) : (
                    <List size={24} color={colors.text} />
                  )}
                </TouchableOpacity>
              </View>
              
              {isListView ? (
                <ScrollView
                  style={styles.varietyListContainer}
                  showsVerticalScrollIndicator={false}
                >
                  {subcategories.map(subcategory => (
                    <View key={subcategory.id} style={styles.varietySection}>
                      <Text style={[styles.varietyTitle, { color: colors.text }]}>
                        {subcategory.name}
                      </Text>
                      <Text style={styles.varietyCount}>
                        {subcategory.varieties?.length || 0} varieties
                      </Text>
                      {subcategory.varieties?.map(variety => (
                        <TouchableOpacity
                          key={variety.id}
                          style={styles.varietyRow}
                          onPress={() => {
                            setSelectedSubcategory(subcategory.id);
                            // You might want to handle variety selection here
                          }}
                        >
                          <Text style={[styles.varietyName, { color: colors.text }]}>
                            {variety.emoji} {variety.name}
                          </Text>
                          <Text style={styles.varietyDescription}>
                            {variety.description}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  ))}
                </ScrollView>
              ) : (
                <View style={styles.filteredProductsContainer}>
                  {filteredProducts.map(product => (
                    <View key={product.id} style={styles.filteredProductCard}>
                      <ProductCard 
                        product={product}
                        onPress={() => handleProductPress(product.id)}
                      />
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}
          
          {/* From the Farms - Only show when no category is selected */}
          {!selectedCategory && farmPosts.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                From the Farms
              </Text>
              
              {farmPosts.slice(0, 3).map(post => (
                <FarmPostCard 
                  key={post.id}
                  post={post}
                  onPress={() => handlePostPress(post.id)}
                />
              ))}
            </View>
          )}

          {/* Subscription Bundles - Only show when no category is selected */}
          {!selectedCategory && (
            <SubscriptionBundlesSection />
          )}
        </ScrollView>
      </View>

      {/* Floating Home Button at the bottom */}
      <Animated.View style={[
        homeStyles.floatingHomeButton, 
        animatedStyle
      ]}>
        <BlurView intensity={30} tint={isDark ? "dark" : "light"} style={homeStyles.blurContainer} />
        <TouchableOpacity
          style={homeStyles.buttonContent}
          onPress={() => {
            // Scroll to top and reset scroll position
            scrollViewRef.current?.scrollTo({ y: 0, animated: true });
          }}
        >
          <ArrowUp size={20} color={colors.white} />
        </TouchableOpacity>
      </Animated.View>

      {/* Floating Home Button in top right that stays fixed */}
      {selectedCategory && (
        <View style={[
          homeStyles.floatingTopRightButton
        ]}>
          <BlurView intensity={30} tint={isDark ? "dark" : "light"} style={homeStyles.blurContainer} />
          <TouchableOpacity 
            style={[
              homeStyles.buttonContent, 
              { backgroundColor: colors.primary }
            ]}
            onPress={() => {
              // Navigate to home or perform other action
              router.push('/');
            }}
          >
            <Home size={20} color={colors.white} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default HomeScreen;