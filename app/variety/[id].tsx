import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Calendar, ArrowLeft, Star } from 'lucide-react-native';
import { EnhancedVariety, Farm, FarmProduct, Product } from '@/types';
import { useTheme } from '@/hooks/useTheme';
import useProductStore from '@/store/useProductStore';
import useFarmStore from '@/store/useFarmStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import NutritionalInfo from '@/components/product/NutritionalInfo';
import FarmProductCard from '@/components/product/FarmProductCard';

interface FarmProductItem {
  farm: Farm;
  farmProduct: FarmProduct;
  product: Product;
}

const VarietyDetailPage = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colors, isUsingSeasonalTheme, season } = useTheme();
  const productStore = useProductStore();
  const farmStore = useFarmStore();
  
  const [variety, setVariety] = useState<EnhancedVariety | null>(null);
  const [availableFarms, setAvailableFarms] = useState<FarmProductItem[]>([]);
  
  useEffect(() => {
    // In a real app, you would fetch this data from an API
    // For now, we'll simulate by getting the variety from the product store
    const varietyId = Array.isArray(id) ? id[0] : id;
    
    // Use mock data for this demo since we don't have real methods yet
    // In a real implementation, this would be a proper API call
    const mockVarieties: EnhancedVariety[] = [
      {
        id: "honeycrisp",
        name: "Honeycrisp Apple",
        subcategoryId: "apples",
        emoji: "🍎",
        description: "Sweet and incredibly crisp, perfect for snacking",
        longDescription: "Honeycrisp apples are known for their sweetness and extraordinary crispness. They have a complex flavor that's both sweet and tart, making them ideal for both fresh eating and cooking.",
        origin: "University of Minnesota, USA",
        history: "Developed in the 1960s and released commercially in 1991, Honeycrisp has quickly become one of the most popular modern apple varieties.",
        seasonality: ["fall", "winter"],
        nutritionalInfo: {
          calories: 80,
          protein: 0.5,
          carbs: 22,
          fiber: 4.5,
          sugar: 16,
          fat: 0.3,
          vitamins: [
            { name: "Vitamin C", percentage: 14 },
            { name: "Vitamin A", percentage: 2 }
          ],
          minerals: [
            { name: "Potassium", percentage: 5 },
            { name: "Calcium", percentage: 1 }
          ]
        },
        tasteProfile: {
          sweetness: 4,
          tartness: 2,
          crispness: 5,
          juiciness: 4
        },
        culinaryUses: [
          "Fresh eating",
          "Salads",
          "Baking",
          "Applesauce"
        ],
        storageInfo: "Store in the refrigerator for up to 6-7 months. Honeycrisp apples maintain their quality longer than many varieties.",
        substitutes: ["gala", "fuji", "pink-lady"]
      },
      {
        id: "granny-smith",
        name: "Granny Smith",
        subcategoryId: "apples",
        emoji: "🍏",
        description: "Bright green and tart, perfect for baking",
        longDescription: "Granny Smith apples are known for their bright green flesh and tart flavor. They maintain their shape when cooked, making them perfect for pies and baked goods.",
        origin: "Australia",
        history: "Discovered in 1868 in Australia as a chance seedling by Maria Ann Smith, after whom the apple is named.",
        seasonality: ["fall", "winter", "spring"],
        nutritionalInfo: {
          calories: 70,
          protein: 0.3,
          carbs: 19,
          fiber: 3.8,
          sugar: 13,
          fat: 0.2,
          vitamins: [
            { name: "Vitamin C", percentage: 12 },
            { name: "Vitamin A", percentage: 1 }
          ],
          minerals: [
            { name: "Potassium", percentage: 4 },
            { name: "Calcium", percentage: 1 }
          ]
        },
        tasteProfile: {
          sweetness: 2,
          tartness: 5,
          crispness: 4,
          juiciness: 3
        },
        culinaryUses: [
          "Baking",
          "Pies",
          "Salads",
          "Sauces"
        ],
        storageInfo: "Can be stored in the refrigerator for 3-4 months without significant loss of quality.",
        substitutes: ["pink-lady", "braeburn"]
      }
    ];

    const foundVariety = mockVarieties.find(v => v.id === varietyId);
    
    if (foundVariety) {
      setVariety(foundVariety);
      
      // Simulate getting farms that carry this variety
      const farms = farmStore.farms || [];
      
      // For now we'll pretend all farms have this variety with different prices
      // In a real implementation, we would have proper relationships
      const mockFarmProducts: FarmProductItem[] = farms.slice(0, 3).map((farm, index) => {
        return {
          farm,
          farmProduct: {
            id: `fp-${farm.id}-${varietyId}`,
            farmId: farm.id,
            productId: `p-${farm.id}-${varietyId}`,
            varietyId: varietyId as string,
            price: 2.99 + (index * 0.5), // Simulate different prices
            organic: index % 2 === 0,
            available: true,
            stock: 50 - (index * 10),
            harvestDate: new Date().toISOString(),
            distance: 1.5 + (index * 2),
            deliveryDays: ['Monday', 'Thursday', 'Saturday']
          },
          product: {
            id: `p-${farm.id}-${varietyId}`,
            name: foundVariety.name,
            description: foundVariety.description,
            price: 2.99 + (index * 0.5),
            image: `https://example.com/products/${varietyId}.jpg`,
            category: 'Fruits',
            subcategory: 'Apples',
            variety: varietyId as string,
            farmId: farm.id,
            farmName: farm.name,
            rating: 4.5,
            reviewCount: 120,
            inStock: true,
            unit: 'lb',
            organic: index % 2 === 0,
            inSeason: true,
            preHarvest: false,
            seasons: foundVariety.seasonality as ('spring' | 'summer' | 'fall' | 'winter')[]
          }
        };
      });
      
      // Sort by price from lowest to highest
      mockFarmProducts.sort((a, b) => a.farmProduct.price - b.farmProduct.price);
      
      setAvailableFarms(mockFarmProducts);
    }
  }, [id, productStore, farmStore]);
  
  // If variety isn't found, show a not found message
  if (!variety) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Variety Not Found</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.notFoundContainer}>
          <Text style={[styles.notFoundText, { color: colors.text }]}>
            Sorry, the variety you're looking for could not be found.
          </Text>
          <TouchableOpacity 
            style={[styles.backButton, { backgroundColor: colors.primary }]}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  
  // Check if this variety is in season for seasonal styling
  const isInSeason = variety.seasonality?.includes(season);
  
  const tasteProfile = variety.tasteProfile;
  
  // Format the nutritional info for the component
  const nutritionalData = variety.nutritionalInfo ? {
    servingSize: "100g (approx. 1 medium)",
    calories: variety.nutritionalInfo.calories,
    nutrients: {
      macros: [
        { name: "Protein", amount: `${variety.nutritionalInfo.protein}g` },
        { name: "Carbohydrates", amount: `${variety.nutritionalInfo.carbs}g` },
        { name: "Fiber", amount: `${variety.nutritionalInfo.fiber}g` },
        { name: "Sugar", amount: `${variety.nutritionalInfo.sugar}g` },
        { name: "Fat", amount: `${variety.nutritionalInfo.fat}g` },
      ],
      vitamins: variety.nutritionalInfo.vitamins.map(v => ({
        name: v.name,
        amount: "",
        dailyValue: `${v.percentage}`
      })),
      minerals: variety.nutritionalInfo.minerals.map(m => ({
        name: m.name,
        amount: "",
        dailyValue: `${m.percentage}`
      }))
    }
  } : null;
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <Image 
            source={{ uri: variety.images?.hero || `https://example.com/varieties/${variety.id}.jpg` }} 
            style={styles.heroImage}
            resizeMode="cover"
          />
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <ChevronLeft size={24} color="#FFF" />
          </TouchableOpacity>
          
          {/* Variety name overlay */}
          <View style={styles.heroOverlay}>
            <View style={styles.emojiContainer}>
              <Text style={styles.emoji}>{variety.emoji}</Text>
            </View>
            <Text style={styles.varietyName}>{variety.name}</Text>
            <Text style={styles.varietySubtitle}>{variety.origin || 'Classic Variety'}</Text>
          </View>
        </View>
        
        <View style={styles.contentContainer}>
          {/* Seasonality */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Calendar size={18} color={isInSeason && isUsingSeasonalTheme ? colors.seasonal : colors.text} />
              <Text style={[styles.sectionTitle, { 
                color: isInSeason && isUsingSeasonalTheme ? colors.seasonal : colors.text 
              }]}>
                Seasonality
              </Text>
            </View>
            <View style={styles.seasonalityContainer}>
              {['spring', 'summer', 'fall', 'winter'].map((s) => (
                <View 
                  key={s} 
                  style={[
                    styles.seasonTag, 
                    { 
                      backgroundColor: variety.seasonality?.includes(s) 
                        ? isUsingSeasonalTheme 
                          ? colors[s as 'spring' | 'summer' | 'fall' | 'winter'] 
                          : colors.primary 
                        : colors.gray[200],
                      opacity: variety.seasonality?.includes(s) ? 1 : 0.5
                    }
                  ]}
                >
                  <Text style={[
                    styles.seasonText, 
                    { color: variety.seasonality?.includes(s) ? colors.white : colors.gray[500] }
                  ]}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
          
          {/* Description */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              About {variety.name}
            </Text>
            <Text style={[styles.descriptionText, { color: colors.text }]}>
              {variety.longDescription || variety.description}
            </Text>
            
            {variety.history && (
              <Text style={[styles.historyText, { color: colors.subtext }]}>
                {variety.history}
              </Text>
            )}
          </View>
          
          {/* Taste Profile */}
          {tasteProfile && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Taste Profile
              </Text>
              <View style={styles.tasteProfileContainer}>
                {Object.entries(tasteProfile).map(([key, value]) => (
                  <View key={key} style={styles.tasteAttribute}>
                    <View style={styles.tasteAttributeHeader}>
                      <Text style={[styles.tasteAttributeName, { color: colors.text }]}>
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </Text>
                      <Text style={[styles.tasteAttributeValue, { color: colors.primary }]}>
                        {value}/5
                      </Text>
                    </View>
                    <View style={styles.tasteBar}>
                      <View 
                        style={[
                          styles.tasteIndicator, 
                          { 
                            width: `${value * 20}%`,
                            backgroundColor: isUsingSeasonalTheme && isInSeason 
                              ? colors.seasonal 
                              : getAttributeColor(key as string, value as number, colors)
                          }
                        ]} 
                      />
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}
          
          {/* Nutritional Information */}
          {nutritionalData && (
            <View style={styles.section}>
              <NutritionalInfo 
                servingSize={nutritionalData.servingSize}
                calories={nutritionalData.calories}
                nutrients={nutritionalData.nutrients}
              />
            </View>
          )}
          
          {/* Culinary Uses */}
          {variety.culinaryUses && variety.culinaryUses.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Culinary Uses
              </Text>
              <View style={styles.culinaryUsesContainer}>
                {variety.culinaryUses.map((use, index) => (
                  <View key={index} style={styles.culinaryUseItem}>
                    <Text style={[styles.culinaryUseText, { color: colors.text }]}>
                      • {use}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
          
          {/* Storage Information */}
          {variety.storageInfo && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Storage Tips
              </Text>
              <Text style={[styles.storageText, { color: colors.text }]}>
                {variety.storageInfo}
              </Text>
            </View>
          )}
          
          {/* Available From These Farms */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Available From These Farms
            </Text>
            {availableFarms.length > 0 ? (
              <View style={styles.farmsContainer}>
                {availableFarms.map((item, index) => (
                  <View key={index} style={styles.farmCardContainer}>
                    <FarmProductCard 
                      product={item.product}
                      farm={item.farm}
                      farmProduct={item.farmProduct}
                    />
                  </View>
                ))}
              </View>
            ) : (
              <Text style={[styles.noFarmsText, { color: colors.subtext }]}>
                This variety is currently not available from any farms.
              </Text>
            )}
          </View>
          
          {/* Substitute Varieties */}
          {variety.substitutes && variety.substitutes.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Similar Varieties
              </Text>
              <Text style={[styles.substitutesText, { color: colors.subtext }]}>
                Can't find {variety.name}? Try these similar varieties:
              </Text>
              <View style={styles.substitutesContainer}>
                {variety.substitutes.map((subId, index) => {
                  const sub = productStore.getVarietyById(subId);
                  return sub ? (
                    <TouchableOpacity 
                      key={index}
                      style={styles.substituteItem}
                      onPress={() => router.push(`/variety/${sub.id}`)}
                    >
                      <Text style={styles.substituteEmoji}>{sub.emoji}</Text>
                      <Text style={[styles.substituteName, { color: colors.text }]}>
                        {sub.name}
                      </Text>
                    </TouchableOpacity>
                  ) : null;
                })}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Helper function to get colors for taste attributes
const getAttributeColor = (attribute: string, value: number, colors: any) => {
  switch (attribute.toLowerCase()) {
    case 'sweetness':
      return colors.success;
    case 'tartness':
      return colors.warning;
    case 'crispness':
      return colors.info;
    case 'juiciness':
      return colors.secondary;
    default:
      return colors.primary;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  notFoundText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  heroContainer: {
    position: 'relative',
    height: 300,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  emojiContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  emoji: {
    fontSize: 24,
  },
  varietyName: {
    color: 'white',
    fontSize: 28,
    fontWeight: '700',
  },
  varietySubtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginLeft: 12,
  },
  contentContainer: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 6,
    marginBottom: 8,
  },
  seasonalityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  seasonTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    minWidth: 70,
    alignItems: 'center',
  },
  seasonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
  },
  historyText: {
    fontSize: 14,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  tasteProfileContainer: {
    marginTop: 8,
  },
  tasteAttribute: {
    marginBottom: 12,
  },
  tasteAttributeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  tasteAttributeName: {
    fontSize: 14,
    fontWeight: '500',
  },
  tasteAttributeValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  tasteBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  tasteIndicator: {
    height: '100%',
    borderRadius: 4,
  },
  culinaryUsesContainer: {
    marginTop: 8,
  },
  culinaryUseItem: {
    marginBottom: 8,
  },
  culinaryUseText: {
    fontSize: 14,
    lineHeight: 20,
  },
  storageText: {
    fontSize: 14,
    lineHeight: 22,
  },
  farmsContainer: {
    marginTop: 8,
  },
  farmCardContainer: {
    marginBottom: 16,
  },
  noFarmsText: {
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 8,
  },
  substitutesText: {
    fontSize: 14,
    marginBottom: 12,
  },
  substitutesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  substituteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  substituteEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  substituteName: {
    fontSize: 14,
    fontWeight: '500',
  },
  backButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default VarietyDetailPage; 