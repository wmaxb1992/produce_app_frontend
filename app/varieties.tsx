import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, SectionList } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Search, Filter, X, ChevronDown, ChevronUp } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import useProductStore from '@/store/useProductStore';
import { EnhancedVariety, Variety } from '@/types';
import VarietyGrid from '@/components/product/VarietyGrid';

interface CategoryData {
  id: string;
  name: string;
  expanded: boolean;
  varieties: (Variety | EnhancedVariety)[];
}

const VarietiesScreen = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const productStore = useProductStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [filters, setFilters] = useState({
    inSeason: false,
    organic: false,
    attributes: {
      sweetness: false,
      tartness: false,
      crispness: false,
      juiciness: false,
    }
  });

  // Fetch varieties and organize by category
  useEffect(() => {
    // In a real app, we would fetch this data from an API
    // For this demo, let's create some mock data
    const mockData: CategoryData[] = [
      {
        id: 'apples',
        name: 'Apples',
        expanded: true,
        varieties: [
          {
            id: "honeycrisp",
            name: "Honeycrisp",
            subcategoryId: "apples",
            emoji: "🍎",
            description: "Sweet and incredibly crisp, perfect for snacking",
            longDescription: "Honeycrisp apples are known for their sweetness and extraordinary crispness.",
            origin: "University of Minnesota, USA",
            seasonality: ["fall", "winter"],
            tasteProfile: {
              sweetness: 4,
              tartness: 2,
              crispness: 5,
              juiciness: 4
            }
          } as EnhancedVariety,
          {
            id: "granny-smith",
            name: "Granny Smith",
            subcategoryId: "apples",
            emoji: "🍏",
            description: "Bright green and tart, perfect for baking",
            longDescription: "Granny Smith apples are known for their bright green flesh and tart flavor.",
            origin: "Australia",
            seasonality: ["fall", "winter", "spring"],
            tasteProfile: {
              sweetness: 2,
              tartness: 5,
              crispness: 4,
              juiciness: 3
            }
          } as EnhancedVariety,
          {
            id: "gala",
            name: "Gala",
            subcategoryId: "apples",
            emoji: "🍎",
            description: "Sweet and aromatic with a mild flavor",
            longDescription: "Gala apples have a mildly sweet flavor and a distinctive aroma.",
            origin: "New Zealand",
            seasonality: ["fall", "winter"],
            tasteProfile: {
              sweetness: 4,
              tartness: 1,
              crispness: 3,
              juiciness: 3
            }
          } as EnhancedVariety,
          {
            id: "fuji",
            name: "Fuji",
            subcategoryId: "apples",
            emoji: "🍎",
            description: "Sweet, crisp and stores very well",
            longDescription: "Fuji apples are very sweet with firm flesh that holds up well in storage.",
            origin: "Japan",
            seasonality: ["fall", "winter", "spring"],
            tasteProfile: {
              sweetness: 5,
              tartness: 1,
              crispness: 4,
              juiciness: 3
            }
          } as EnhancedVariety
        ]
      },
      {
        id: 'tomatoes',
        name: 'Tomatoes',
        expanded: true,
        varieties: [
          {
            id: "beefsteak",
            name: "Beefsteak",
            subcategoryId: "tomatoes",
            emoji: "🍅",
            description: "Large, meaty tomatoes perfect for sandwiches",
            longDescription: "The classic slicing tomato, beefsteaks are large, juicy, and flavorful.",
            origin: "Heirloom variety",
            seasonality: ["summer"],
            tasteProfile: {
              sweetness: 3,
              tartness: 3,
              crispness: 2,
              juiciness: 4
            }
          } as EnhancedVariety,
          {
            id: "cherry",
            name: "Cherry",
            subcategoryId: "tomatoes",
            emoji: "🍒",
            description: "Small, sweet tomatoes perfect for snacking",
            longDescription: "Cherry tomatoes are small, round, and have an intensely sweet flavor.",
            origin: "Worldwide",
            seasonality: ["spring", "summer", "fall"],
            tasteProfile: {
              sweetness: 5,
              tartness: 2,
              crispness: 1,
              juiciness: 4
            }
          } as EnhancedVariety,
          {
            id: "heirloom",
            name: "Heirloom",
            subcategoryId: "tomatoes",
            emoji: "🍅",
            description: "Colorful, flavorful varieties passed down generations",
            longDescription: "Heirloom tomatoes come in many colors, shapes, and flavors.",
            origin: "Various regions",
            seasonality: ["summer"],
            tasteProfile: {
              sweetness: 4,
              tartness: 3,
              crispness: 2,
              juiciness: 4
            }
          } as EnhancedVariety
        ]
      },
      {
        id: 'berries',
        name: 'Berries',
        expanded: true,
        varieties: [
          {
            id: "strawberry",
            name: "Strawberry",
            subcategoryId: "berries",
            emoji: "🍓",
            description: "Sweet, juicy berries with vibrant red color",
            longDescription: "Strawberries are plump, red, and known for their sweet-tart flavor.",
            origin: "Worldwide",
            seasonality: ["spring", "summer"],
            tasteProfile: {
              sweetness: 4,
              tartness: 2,
              juiciness: 4
            }
          } as EnhancedVariety,
          {
            id: "blueberry",
            name: "Blueberry",
            subcategoryId: "berries",
            emoji: "🫐",
            description: "Small, sweet-tart berries packed with antioxidants",
            longDescription: "Blueberries are known for their health benefits and versatility.",
            origin: "North America",
            seasonality: ["summer"],
            tasteProfile: {
              sweetness: 3,
              tartness: 3,
              juiciness: 3
            }
          } as EnhancedVariety
        ]
      }
    ];
    
    setCategories(mockData);
  }, []);

  // Filter varieties based on search term and selected filters
  const filteredCategories = categories.map(category => {
    // Filter varieties in this category by search term
    let filteredVarieties = category.varieties.filter(variety => 
      variety.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      variety.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Apply additional filters if they are active
    if (filters.inSeason) {
      const enhancedVarieties = filteredVarieties as EnhancedVariety[];
      filteredVarieties = enhancedVarieties.filter(v => 
        v.seasonality?.includes(getSeasonName())
      );
    }
    
    // For attribute filters, we need to check the taste profile
    if (Object.values(filters.attributes).some(Boolean)) {
      const enhancedVarieties = filteredVarieties as EnhancedVariety[];
      filteredVarieties = enhancedVarieties.filter(v => {
        if (!v.tasteProfile) return false;
        
        let passesFilter = false;
        if (filters.attributes.sweetness && v.tasteProfile.sweetness >= 4) passesFilter = true;
        if (filters.attributes.tartness && v.tasteProfile.tartness >= 4) passesFilter = true;
        if (filters.attributes.crispness && v.tasteProfile.crispness >= 4) passesFilter = true;
        if (filters.attributes.juiciness && v.tasteProfile.juiciness >= 4) passesFilter = true;
        
        return passesFilter;
      });
    }
    
    return {
      ...category,
      varieties: filteredVarieties
    };
  }).filter(category => category.varieties.length > 0);

  // Get current season
  function getSeasonName(): string {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return "spring";
    if (month >= 5 && month <= 7) return "summer";
    if (month >= 8 && month <= 10) return "fall";
    return "winter";
  }

  const toggleCategoryExpansion = (id: string) => {
    setCategories(prev => 
      prev.map(category => 
        category.id === id 
          ? { ...category, expanded: !category.expanded }
          : category
      )
    );
  };

  const toggleFilter = (filterType: string, value?: string) => {
    if (value && filterType === 'attributes') {
      setFilters(prev => ({
        ...prev,
        attributes: {
          ...prev.attributes,
          [value]: !prev.attributes[value as keyof typeof prev.attributes]
        }
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        [filterType]: !prev[filterType as keyof typeof prev]
      }));
    }
  };

  const clearFilters = () => {
    setFilters({
      inSeason: false,
      organic: false,
      attributes: {
        sweetness: false,
        tartness: false,
        crispness: false,
        juiciness: false,
      }
    });
    setSearchTerm('');
  };

  const hasActiveFilters = () => {
    return searchTerm !== '' || 
           filters.inSeason || 
           filters.organic || 
           Object.values(filters.attributes).some(Boolean);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          title: "Browse Varieties",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: colors.background },
        }}
      />

      {/* Search and filter bar */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchInputContainer, { backgroundColor: colors.card }]}>
          <Search size={20} color={colors.gray[400]} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search varieties..."
            placeholderTextColor={colors.gray[400]}
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
          {searchTerm ? (
            <TouchableOpacity onPress={() => setSearchTerm('')}>
              <X size={18} color={colors.gray[400]} />
            </TouchableOpacity>
          ) : null}
        </View>
        
        <TouchableOpacity 
          style={[
            styles.filterButton, 
            { 
              backgroundColor: filtersVisible || hasActiveFilters() ? colors.primary : colors.card 
            }
          ]}
          onPress={() => setFiltersVisible(!filtersVisible)}
        >
          <Filter 
            size={20} 
            color={filtersVisible || hasActiveFilters() ? colors.white : colors.gray[500]} 
          />
        </TouchableOpacity>
      </View>

      {/* Filters panel */}
      {filtersVisible && (
        <View style={[styles.filtersPanel, { backgroundColor: colors.card }]}>
          <View style={styles.filtersPanelHeader}>
            <Text style={[styles.filtersPanelTitle, { color: colors.text }]}>Filters</Text>
            <TouchableOpacity onPress={clearFilters}>
              <Text style={[styles.clearFiltersText, { color: colors.primary }]}>Clear All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.filtersGrid}>
            <TouchableOpacity 
              style={[
                styles.filterOption,
                filters.inSeason && { backgroundColor: `${colors.primary}20` }
              ]}
              onPress={() => toggleFilter('inSeason')}
            >
              <Text style={[
                styles.filterOptionText, 
                { color: filters.inSeason ? colors.primary : colors.text }
              ]}>
                In Season
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.filterOption,
                filters.organic && { backgroundColor: `${colors.primary}20` }
              ]}
              onPress={() => toggleFilter('organic')}
            >
              <Text style={[
                styles.filterOptionText, 
                { color: filters.organic ? colors.primary : colors.text }
              ]}>
                Organic
              </Text>
            </TouchableOpacity>
          </View>
          
          <Text style={[styles.filterCategoryTitle, { color: colors.text }]}>Taste Profile</Text>
          <View style={styles.filtersGrid}>
            <TouchableOpacity 
              style={[
                styles.filterOption,
                filters.attributes.sweetness && { backgroundColor: `${colors.primary}20` }
              ]}
              onPress={() => toggleFilter('attributes', 'sweetness')}
            >
              <Text style={[
                styles.filterOptionText, 
                { color: filters.attributes.sweetness ? colors.primary : colors.text }
              ]}>
                Sweet
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.filterOption,
                filters.attributes.tartness && { backgroundColor: `${colors.primary}20` }
              ]}
              onPress={() => toggleFilter('attributes', 'tartness')}
            >
              <Text style={[
                styles.filterOptionText, 
                { color: filters.attributes.tartness ? colors.primary : colors.text }
              ]}>
                Tart
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.filterOption,
                filters.attributes.crispness && { backgroundColor: `${colors.primary}20` }
              ]}
              onPress={() => toggleFilter('attributes', 'crispness')}
            >
              <Text style={[
                styles.filterOptionText, 
                { color: filters.attributes.crispness ? colors.primary : colors.text }
              ]}>
                Crisp
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.filterOption,
                filters.attributes.juiciness && { backgroundColor: `${colors.primary}20` }
              ]}
              onPress={() => toggleFilter('attributes', 'juiciness')}
            >
              <Text style={[
                styles.filterOptionText, 
                { color: filters.attributes.juiciness ? colors.primary : colors.text }
              ]}>
                Juicy
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Main content - replaced ScrollView with SectionList */}
      {filteredCategories.length > 0 ? (
        <SectionList
          sections={filteredCategories.map(category => ({
            title: category.name,
            expanded: category.expanded,
            id: category.id,
            data: category.expanded ? [category.varieties] : []
          }))}
          keyExtractor={(item, index) => `section-${index}`}
          renderSectionHeader={({ section }) => (
            <TouchableOpacity 
              style={styles.categoryHeader}
              onPress={() => toggleCategoryExpansion(section.id)}
            >
              <Text style={[styles.categoryTitle, { color: colors.text }]}>{section.title}</Text>
              {section.expanded ? (
                <ChevronUp size={20} color={colors.text} />
              ) : (
                <ChevronDown size={20} color={colors.text} />
              )}
            </TouchableOpacity>
          )}
          renderItem={({ item }) => (
            <VarietyGrid 
              varieties={item}
              numColumns={2}
            />
          )}
          stickySectionHeadersEnabled={false}
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}
        />
      ) : (
        <View style={styles.noResultsContainer}>
          <Text style={[styles.noResultsText, { color: colors.text }]}>
            No varieties found matching your criteria.
          </Text>
          <TouchableOpacity 
            style={[styles.resetButton, { backgroundColor: colors.primary }]}
            onPress={clearFilters}
          >
            <Text style={styles.resetButtonText}>Reset Filters</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 22,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filtersPanel: {
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  filtersPanelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  filtersPanelTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  clearFiltersText: {
    fontSize: 14,
  },
  filtersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  filterOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
  },
  filterOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  filterCategoryTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  scrollView: {
    flex: 1,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  noResultsContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noResultsText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  resetButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  resetButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default VarietiesScreen; 