import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Animated, Modal, FlatList, Alert } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Leaf, Apple, Flower2, Calendar, Clock, Check, Info, ShoppingBag, X, ChevronRight, Dot } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import useSubscriptionStore from '@/store/useSubscriptionStore';
import useCartStore from '@/store/useCartStore';
import RoundButton from '@/components/ui/RoundButton';
import { RadioButton } from '@/components/ui/RadioButton';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { SubscriptionBundle } from '@/types';
import LoadingState from '@/components/ui/LoadingState';
import ErrorState from '@/components/ui/ErrorState';

export default function SubscriptionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  
  const { bundles, isLoading, error, fetchBundles } = useSubscriptionStore();
  const { addItem } = useCartStore();
  
  const [bundle, setBundle] = useState<SubscriptionBundle | null>(null);
  const [frequency, setFrequency] = useState<'weekly' | 'monthly'>('weekly');
  const [deliveryDay, setDeliveryDay] = useState<string>('Wednesday');
  const [showModal, setShowModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showExpandedImage, setShowExpandedImage] = useState(false);
  const [mockImages, setMockImages] = useState<string[]>([]);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const modalAnim = useRef(new Animated.Value(0)).current;
  const successAnim = useRef(new Animated.Value(0)).current;
  
  // Find the bundle based on the id
  useEffect(() => {
    if (id && bundles.length > 0) {
      const foundBundle = bundles.find(b => b.id === id);
      if (foundBundle) {
        setBundle(foundBundle);
      } else {
        console.warn(`Bundle with id ${id} not found in bundles array:`, bundles);
      }
    } else if (bundles.length === 0 && !isLoading) {
      // If bundles are empty but not loading, try to fetch them
      fetchBundles().catch(err => console.error("Error fetching bundles in detail view:", err));
    }
  }, [id, bundles, isLoading, fetchBundles]);
  
  // Generate mock images based on bundle image
  useEffect(() => {
    if (bundle?.image) {
      // In a real app, we would fetch actual images from the API
      // For demo, we're using the same image multiple times
      setMockImages([
        bundle.image,
        bundle.image, // In real app, these would be different images
        bundle.image,
        bundle.image
      ]);
    }
  }, [bundle]);
  
  useEffect(() => {
    if (showModal) {
      Animated.timing(modalAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(modalAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [showModal, modalAnim]);
  
  // For success toast animation
  useEffect(() => {
    if (showSuccess) {
      Animated.sequence([
        Animated.timing(successAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(4000),
        Animated.timing(successAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start(() => {
        setShowSuccess(false);
      });
    }
  }, [showSuccess, successAnim]);
  
  const handleGoBack = () => {
    router.back();
  };
  
  const handleOpenSubscribeModal = () => {
    setShowModal(true);
  };
  
  const handleCloseModal = () => {
    setShowModal(false);
  };
  
  const handleSubscribe = () => {
    if (bundle) {
      setIsAddingToCart(true);
      
      // Add the subscription bundle to cart
      addItem({
        id: bundle.id,
        name: `${frequency === 'weekly' ? 'Weekly' : 'Monthly'} ${bundle.name}`,
        price: frequency === 'weekly' ? bundle.weeklyPrice : bundle.monthlyPrice,
        image: bundle.image,
        quantity: 1,
        type: 'subscription',
        metadata: {
          frequency,
          deliveryDay,
          bundleId: bundle.id
        }
      }, 1);
      
      // Show success animation
      setTimeout(() => {
        setIsAddingToCart(false);
        setShowModal(false);
        setShowSuccess(true);
      }, 500);
    }
  };
  
  const handleImagePress = () => {
    setShowExpandedImage(true);
  };
  
  const handleCloseExpandedImage = () => {
    setShowExpandedImage(false);
  };
  
  // Loading state
  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <LoadingState message="Loading subscription details..." />
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ErrorState 
          message="Could not load subscription details" 
          onRetry={() => fetchBundles()}
        />
      </View>
    );
  }
  
  // No bundle found state
  if (!bundle) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ErrorState 
          message={`Subscription bundle not found. ID: ${id}`} 
          onRetry={() => router.back()}
        />
      </View>
    );
  }
  
  const price = frequency === 'weekly' ? bundle.weeklyPrice : bundle.monthlyPrice;
  const regularPrice = bundle.price;
  const savings = regularPrice - price;
  const savingsPercentage = Math.round((savings / regularPrice) * 100);
  
  // Modal transform based on animation
  const modalTranslateY = modalAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [500, 0]
  });
  
  // Background opacity for overlay
  const overlayOpacity = modalAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.5]
  });
  
  // Success toast animation values
  const successOpacity = successAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1]
  });
  
  const successTranslateY = successAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-50, 0]
  });
  
  const renderCarouselItem = ({ item, index }: { item: string; index: number }) => (
    <TouchableOpacity 
      activeOpacity={0.9} 
      onPress={handleImagePress}
      style={styles.carouselItemContainer}
    >
      <Image 
        source={{ uri: item }}
        style={styles.carouselImage}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );
  
  return (
    <>
      <Stack.Screen 
        options={{ 
          headerShown: false,
        }} 
      />
      
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={[styles.backButton, { backgroundColor: colors.card }]} 
            onPress={handleGoBack}
          >
            <ChevronLeft size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.imageContainer}>
            {mockImages.length > 0 && (
              <>
                <FlatList
                  data={mockImages}
                  renderItem={renderCarouselItem}
                  keyExtractor={(_, index) => index.toString()}
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  onMomentumScrollEnd={(event) => {
                    const slideIndex = Math.round(
                      event.nativeEvent.contentOffset.x / width
                    );
                    setCurrentImageIndex(slideIndex);
                  }}
                />
              </>
            )}
            
            <View style={[styles.discountBadge, { backgroundColor: colors.primary }]}>
              <Text style={styles.discountText}>Save {bundle.discountPercentage}%</Text>
            </View>
            
            {/* Floating stats container */}
            <View style={[styles.statsContainer]}>
              {[
                { 
                  count: bundle.items.vegetables, 
                  label: 'Veg', 
                  icon: <Leaf size={14} color="white" />,
                  color: colors.success + 'CC',
                  key: 'vegetables'
                },
                { 
                  count: bundle.items.fruits, 
                  label: 'Fruit', 
                  icon: <Apple size={14} color="white" />,
                  color: colors.warning + 'CC',
                  key: 'fruits'
                },
                { 
                  count: bundle.items.herbs, 
                  label: 'Herbs', 
                  icon: <Flower2 size={14} color="white" />,
                  color: colors.info + 'CC',
                  key: 'herbs'
                }
              ]
              .sort((a, b) => b.count - a.count)
              .map(item => (
                <View 
                  key={item.key}
                  style={[
                    styles.statItem, 
                    { 
                      backgroundColor: item.count > 0 ? item.color : colors.gray[500] + 'CC'
                    }
                  ]}
                >
                  {React.cloneElement(item.icon, { 
                    color: "white" 
                  })}
                  <Text style={[
                    styles.statValue, 
                    { 
                      color: "white",
                      textShadowColor: 'rgba(0, 0, 0, 0.3)',
                      textShadowOffset: { width: 0, height: 1 },
                      textShadowRadius: 1
                    }
                  ]}>
                    {item.count}
                  </Text>
                  <Text style={[
                    styles.statLabel, 
                    { 
                      color: "white",
                      textShadowColor: 'rgba(0, 0, 0, 0.3)',
                      textShadowOffset: { width: 0, height: 1 },
                      textShadowRadius: 1
                    }
                  ]}>
                    {item.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>
          
          <View style={styles.content}>
            <Text style={[styles.title, { color: colors.text }]}>{bundle.name}</Text>
            
            {bundle.farmName && (
              <Text style={[styles.farmName, { color: colors.subtext }]}>
                From {bundle.farmName}
              </Text>
            )}
            
            <Text style={[styles.description, { color: colors.text }]}>
              {bundle.description}
            </Text>
            
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                What's Included
              </Text>
              
              <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
                <View style={styles.infoRow}>
                  <Calendar size={18} color={colors.primary} style={styles.infoIcon} />
                  <Text style={[styles.infoText, { color: colors.text }]}>
                    Flexible delivery schedule options
                  </Text>
                </View>
                
                <View style={styles.infoRow}>
                  <Clock size={18} color={colors.primary} style={styles.infoIcon} />
                  <Text style={[styles.infoText, { color: colors.text }]}>
                    Flexible subscription - skip, pause, or cancel anytime
                  </Text>
                </View>
                
                <View style={styles.infoRow}>
                  <Check size={18} color={colors.primary} style={styles.infoIcon} />
                  <Text style={[styles.infoText, { color: colors.text }]}>
                    Peak freshness guaranteed, harvested within 24-48 hours
                  </Text>
                </View>
                
                <View style={styles.infoRow}>
                  <Info size={18} color={colors.primary} style={styles.infoIcon} />
                  <Text style={[styles.infoText, { color: colors.text }]}>
                    Contents may vary slightly based on seasonal availability
                  </Text>
                </View>
              </View>
              
              <Text style={[styles.bundleItems, { color: colors.text }]}>
                Current Bundle Contents:
              </Text>
              
              {/* This would ideally map through actual product data */}
              <View style={styles.productsContainer}>
                <ProductRow name="Carrots" quantity="1 bunch" />
                <ProductRow name="Red Potatoes" quantity="1.5 lbs" />
                <ProductRow name="Cucumbers" quantity="2 medium" />
                <ProductRow name="Broccoli" quantity="1 head" />
                <ProductRow name="Yellow Squash" quantity="2 medium" />
                <ProductRow name="Zucchini" quantity="2 medium" />
                <ProductRow name="Lettuce" quantity="1 head" />
                <ProductRow name="Fennel" quantity="1 bulb" />
                <ProductRow name="Bok Choy" quantity="1 bunch" />
                <ProductRow name="Kohlrabi" quantity="1 medium" />
                {bundle.items.herbs > 0 && <ProductRow name="Fresh Herbs" quantity="assorted" />}
              </View>
            </View>
          </View>
        </ScrollView>
        
        <View style={[styles.bottomBar, { backgroundColor: colors.card }]}>
          <View style={styles.priceColumn}>
            <Text style={[styles.bottomPrice, { color: colors.text }]}>
              ${price.toFixed(2)}
            </Text>
            <Text style={[styles.bottomPriceLabel, { color: colors.subtext }]}>
              per {frequency === 'weekly' ? 'week' : 'month'}
            </Text>
          </View>
          
          <RoundButton 
            onPress={handleOpenSubscribeModal}
            label="Subscribe Now"
            icon={<ShoppingBag size={18} color="white" />}
            style={{ flex: 1 }}
          />
        </View>
        
        {/* Modal Overlay */}
        {showModal && (
          <Animated.View 
            style={[
              styles.overlay,
              { backgroundColor: colors.black, opacity: overlayOpacity }
            ]}
          >
            <TouchableOpacity 
              style={styles.overlayTouchable}
              onPress={handleCloseModal}
              activeOpacity={1}
            />
          </Animated.View>
        )}
        
        {/* Success Notification */}
        <Animated.View 
          style={[
            styles.successToast, 
            { 
              backgroundColor: colors.success,
              opacity: successOpacity,
              transform: [{ translateY: successTranslateY }]
            }
          ]}
          pointerEvents="box-none"
        >
          <TouchableOpacity 
            style={styles.successTouchable}
            onPress={() => router.push('/cart')}
            activeOpacity={0.8}
          >
            <ShoppingBag size={20} color="white" style={{ marginRight: 8 }} />
            <Text style={styles.successText}>Added to cart!</Text>
            <ChevronRight size={16} color="white" style={{ marginLeft: 8, opacity: 0.8 }} />
          </TouchableOpacity>
        </Animated.View>
        
        {/* Subscription Options Modal */}
        <Animated.View 
          style={[
            styles.modal,
            { 
              backgroundColor: colors.card,
              transform: [{ translateY: modalTranslateY }]
            }
          ]}
        >
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Subscription Options
            </Text>
            <TouchableOpacity onPress={handleCloseModal}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.optionContainer}>
            <Text style={[styles.optionLabel, { color: colors.text }]}>
              Delivery Frequency
            </Text>
            
            <SegmentedControl
              options={[
                { label: 'Weekly', value: 'weekly' },
                { label: 'Monthly', value: 'monthly' }
              ]}
              selectedValue={frequency}
              onChange={(value: string) => setFrequency(value as 'weekly' | 'monthly')}
              style={{ marginTop: 8 }}
            />
          </View>
          
          <View style={styles.optionContainer}>
            <Text style={[styles.optionLabel, { color: colors.text }]}>
              Delivery Day
            </Text>
            
            <View style={styles.radioGroup}>
              {['Monday', 'Wednesday', 'Friday'].map((day) => (
                <RadioButton
                  key={day}
                  label={day}
                  selected={deliveryDay === day}
                  onSelect={() => setDeliveryDay(day)}
                />
              ))}
            </View>
          </View>
          
          <View style={[styles.pricingCard, { backgroundColor: colors.background }]}>
            <View style={styles.pricingRow}>
              <View style={styles.priceContainer}>
                <Text style={[styles.priceLabel, { color: colors.subtext }]}>
                  {frequency === 'weekly' ? 'Weekly Price' : 'Monthly Price'}
                </Text>
                <Text style={[styles.price, { color: colors.text }]}>
                  ${price.toFixed(2)}
                </Text>
              </View>
              
              <View style={styles.savingsContainer}>
                <Text style={[styles.savingsLabel, { color: colors.subtext }]}>
                  Regular Price
                </Text>
                <Text style={[styles.regularPrice, { color: colors.error }]}>
                  ${regularPrice.toFixed(2)}
                </Text>
              </View>
            </View>
            
            <View style={[styles.savingsBadge, { backgroundColor: colors.success + '20' }]}>
              <Text style={[styles.savingsText, { color: colors.success }]}>
                You save ${savings.toFixed(2)} ({savingsPercentage}%)
              </Text>
            </View>
          </View>
          
          <RoundButton 
            onPress={handleSubscribe}
            label={isAddingToCart ? "Adding..." : "Add to Cart"}
            icon={<ShoppingBag size={18} color="white" />}
            style={styles.confirmButton}
            disabled={isAddingToCart}
          />
        </Animated.View>
        
        {/* Expanded Image Modal */}
        <Modal
          visible={showExpandedImage}
          transparent={true}
          animationType="fade"
          onRequestClose={handleCloseExpandedImage}
        >
          <View style={styles.expandedImageContainer}>
            <TouchableOpacity 
              style={styles.closeExpandedButton}
              onPress={handleCloseExpandedImage}
            >
              <X size={24} color="white" />
            </TouchableOpacity>
            
            <Image
              source={{ uri: mockImages[currentImageIndex] }}
              style={styles.expandedImage}
              resizeMode="contain"
            />
          </View>
        </Modal>
      </View>
    </>
  );
}

// Define ProductRow component inline
const ProductRow = ({ name, quantity }: { name: string; quantity: string }) => {
  const { colors } = useTheme();
  
  return (
    <View style={styles.productRow}>
      <Text style={[styles.productName, { color: colors.text }]}>{name}</Text>
      <Text style={[styles.productQuantity, { color: colors.subtext }]}>{quantity}</Text>
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  imageContainer: {
    width: '100%',
    height: 250,
    position: 'relative',
  },
  carouselItemContainer: {
    width: width,
    height: 250,
  },
  carouselImage: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: 50,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  discountText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 2,
  },
  farmName: {
    fontSize: 16,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 16,
    left: 16,
    width: '50%',
    gap: 4,
  },
  statItem: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  statValue: {
    fontSize: 12,
    fontWeight: '700',
    marginVertical: 1,
  },
  statLabel: {
    fontSize: 8,
  },
  section: {
    marginTop: 16,
  },
  subscriptionSection: {
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  optionContainer: {
    marginBottom: 16,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  radioGroup: {
    marginTop: 8,
  },
  pricingCard: {
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  priceContainer: {},
  priceLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
  },
  savingsContainer: {
    alignItems: 'flex-end',
  },
  savingsLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  regularPrice: {
    fontSize: 18,
    fontWeight: '500',
    textDecorationLine: 'line-through',
  },
  savingsBadge: {
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  savingsText: {
    fontSize: 14,
    fontWeight: '600',
  },
  infoCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoIcon: {
    marginRight: 12,
  },
  infoText: {
    fontSize: 14,
    flex: 1,
  },
  bundleItems: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  productsContainer: {
    marginTop: 8,
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  productName: {
    fontSize: 14,
  },
  productQuantity: {
    fontSize: 14,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  priceColumn: {
    marginRight: 16,
  },
  bottomPrice: {
    fontSize: 18,
    fontWeight: '700',
  },
  bottomPriceLabel: {
    fontSize: 12,
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 100,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  overlayTouchable: {
    width: '100%',
    height: '100%',
  },
  modal: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 30,
    zIndex: 11,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  confirmButton: {
    marginTop: 20,
  },
  indicatorContainer: {
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  indicator: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
  expandedImageContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  expandedImage: {
    width: width,
    height: height * 0.7,
  },
  closeExpandedButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  expandedImageIndicator: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successToast: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    marginHorizontal: 40,
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    zIndex: 1000,
  },
  successText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  successTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 4,
  },
}); 