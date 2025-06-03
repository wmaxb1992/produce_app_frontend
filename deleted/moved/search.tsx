import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  FlatList, 
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Search as SearchIcon, Filter, X } from 'lucide-react-native';
import useThemeStore from '@/store/useThemeStore';
import useProductStore from '@/store/useProductStore';
import ProductCard from '@/components/product/ProductCard';

export default function SearchScreen() {
  const { getThemeValues } = useThemeStore();
  const theme = getThemeValues();
  const { colors, borderRadius } = theme;
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    organic: false,
    inSeason: false,
    preHarvest: false,
  });
  
  const { products } = useProductStore();
  
  // Filter products based on search query and filters
  const filteredProducts = products.filter(product => {
    // Search query filter
    const matchesQuery = searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Additional filters
    const matchesOrganic = !filters.organic || product.organic;
    const matchesInSeason = !filters.inSeason || product.inSeason;
    const matchesPreHarvest = !filters.preHarvest || product.preHarvest;
    
    return matchesQuery && matchesOrganic && matchesInSeason && matchesPreHarvest;
  });
  
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.length > 0) {
      setIsSearching(true);
      // Simulate search delay
      setTimeout(() => {
        setIsSearching(false);
      }, 500);
    } else {
      setIsSearching(false);
    }
  };
  
  const clearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
  };
  
  const toggleFilter = (filterName: keyof typeof filters) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={[
          styles.searchBar, 
          { 
            backgroundColor: colors.card,
            borderColor: colors.border,
          }
        ]}>
          <SearchIcon size={20} color={colors.gray[400]} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search products, farms..."
            placeholderTextColor={colors.gray[400]}
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <X size={20} color={colors.gray[400]} />
            </TouchableOpacity>
          )}
        </View>
        
        <TouchableOpacity 
          style={[
            styles.filterButton, 
            { 
              backgroundColor: showFilters ? colors.primary : colors.card,
              borderColor: colors.border,
            }
          ]}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Filter size={20} color={showFilters ? colors.white : colors.gray[600]} />
        </TouchableOpacity>
      </View>
      
      {/* Filters */}
      {showFilters && (
        <View style={[styles.filtersContainer, { backgroundColor: colors.card }]}>
          <Text style={[styles.filtersTitle, { color: colors.text }]}>Filters</Text>
          
          <View style={styles.filterOptions}>
            <TouchableOpacity 
              style={[
                styles.filterOption, 
                { 
                  backgroundColor: filters.organic ? colors.primary : colors.gray[100],
                  borderColor: filters.organic ? colors.primary : colors.gray[300],
                }
              ]}
              onPress={() => toggleFilter('organic')}
            >
              <Text 
                style={[
                  styles.filterOptionText, 
                  { color: filters.organic ? colors.white : colors.text }
                ]}
              >
                Organic
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.filterOption, 
                { 
                  backgroundColor: filters.inSeason ? colors.primary : colors.gray[100],
                  borderColor: filters.inSeason ? colors.primary : colors.gray[300],
                }
              ]}
              onPress={() => toggleFilter('inSeason')}
            >
              <Text 
                style={[
                  styles.filterOptionText, 
                  { color: filters.inSeason ? colors.white : colors.text }
                ]}
              >
                In Season
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.filterOption, 
                { 
                  backgroundColor: filters.preHarvest ? colors.primary : colors.gray[100],
                  borderColor: filters.preHarvest ? colors.primary : colors.gray[300],
                }
              ]}
              onPress={() => toggleFilter('preHarvest')}
            >
              <Text 
                style={[
                  styles.filterOptionText, 
                  { color: filters.preHarvest ? colors.white : colors.text }
                ]}
              >
                Pre-Harvest
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      
      {/* Search Results */}
      {isSearching ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : searchQuery.length > 0 || Object.values(filters).some(value => value) ? (
        <>
          <Text style={[styles.resultsText, { color: colors.text }]}>
            {filteredProducts.length} results found
          </Text>
          
          <FlatList
            data={filteredProducts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.productItem}>
                <ProductCard product={item} showFarm />
              </View>
            )}
            numColumns={2}
            contentContainerStyle={styles.productsList}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={[styles.emptyText, { color: colors.text }]}>
                  No products found matching your criteria
                </Text>
              </View>
            }
          />
        </>
      ) : (
        <View style={styles.initialContainer}>
          <Text style={[styles.initialText, { color: colors.text }]}>
            Search for products, farms, or categories
          </Text>
          <Text style={[styles.initialSubtext, { color: colors.subtext }]}>
            Try searching for "organic", "apples", or "dairy"
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  filterButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
  },
  filtersContainer: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  filtersTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  filterOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  resultsText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  productsList: {
    paddingBottom: 16,
  },
  productItem: {
    width: '50%',
    paddingHorizontal: 4,
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 8,
  },
  initialContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  initialText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  initialSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
});