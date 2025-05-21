import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Heart } from 'lucide-react-native';
import useThemeStore from '@/store/useThemeStore';
import useUserStore from '@/store/useUserStore';
import useProductStore from '@/store/useProductStore';
import useFarmStore from '@/store/useFarmStore';
import ProductCard from '@/components/product/ProductCard';
import FarmCard from '@/components/farm/FarmCard';

export default function FavoritesScreen() {
  const router = useRouter();
  const { getThemeValues } = useThemeStore();
  const theme = getThemeValues();
  const { colors } = theme;
  
  const { user } = useUserStore();
  const { products } = useProductStore();
  const { farms } = useFarmStore();
  
  const [activeTab, setActiveTab] = React.useState<'products' | 'farms'>('products');
  
  // Get favorite products
  const favoriteProducts = products.filter(product => 
    user?.preferences.favoriteProducts.includes(product.id)
  );
  
  // Get favorite farms
  const favoriteFarms = farms.filter(farm => 
    user?.preferences.favoriteFarms.includes(farm.id)
  );
  
  if (!user) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
        <Heart size={64} color={colors.gray[300]} />
        <Text style={[styles.emptyTitle, { color: colors.text }]}>
          Sign in to see your favorites
        </Text>
        <Text style={[styles.emptySubtitle, { color: colors.subtext }]}>
          Save your favorite products and farms
        </Text>
      </View>
    );
  }
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Tabs */}
      <View style={[styles.tabsContainer, { backgroundColor: colors.card }]}>
        <TouchableOpacity 
          style={[
            styles.tab, 
            activeTab === 'products' && [styles.activeTab, { borderBottomColor: colors.primary }]
          ]}
          onPress={() => setActiveTab('products')}
        >
          <Text 
            style={[
              styles.tabText, 
              { color: activeTab === 'products' ? colors.primary : colors.subtext }
            ]}
          >
            Products ({favoriteProducts.length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.tab, 
            activeTab === 'farms' && [styles.activeTab, { borderBottomColor: colors.primary }]
          ]}
          onPress={() => setActiveTab('farms')}
        >
          <Text 
            style={[
              styles.tabText, 
              { color: activeTab === 'farms' ? colors.primary : colors.subtext }
            ]}
          >
            Farms ({favoriteFarms.length})
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Content */}
      {activeTab === 'products' ? (
        favoriteProducts.length > 0 ? (
          <FlatList
            data={favoriteProducts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.productItem}>
                <ProductCard product={item} showFarm />
              </View>
            )}
            numColumns={2}
            contentContainerStyle={styles.productsList}
          />
        ) : (
          <View style={styles.emptyTabContainer}>
            <Heart size={48} color={colors.gray[300]} />
            <Text style={[styles.emptyTabTitle, { color: colors.text }]}>
              No favorite products yet
            </Text>
            <Text style={[styles.emptyTabSubtitle, { color: colors.subtext }]}>
              Tap the heart icon on products you love
            </Text>
            <TouchableOpacity 
              style={[styles.browseButton, { backgroundColor: colors.primary }]}
              onPress={() => router.push('/')}
            >
              <Text style={[styles.browseButtonText, { color: colors.white }]}>
                Browse Products
              </Text>
            </TouchableOpacity>
          </View>
        )
      ) : (
        favoriteFarms.length > 0 ? (
          <ScrollView contentContainerStyle={styles.farmsList}>
            {favoriteFarms.map(farm => (
              <FarmCard key={farm.id} farm={farm} />
            ))}
          </ScrollView>
        ) : (
          <View style={styles.emptyTabContainer}>
            <Heart size={48} color={colors.gray[300]} />
            <Text style={[styles.emptyTabTitle, { color: colors.text }]}>
              No favorite farms yet
            </Text>
            <Text style={[styles.emptyTabSubtitle, { color: colors.subtext }]}>
              Follow farms to see their latest products and updates
            </Text>
            <TouchableOpacity 
              style={[styles.browseButton, { backgroundColor: colors.primary }]}
              onPress={() => router.push('/')}
            >
              <Text style={[styles.browseButtonText, { color: colors.white }]}>
                Discover Farms
              </Text>
            </TouchableOpacity>
          </View>
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
  },
  productsList: {
    padding: 8,
  },
  productItem: {
    width: '50%',
    padding: 8,
  },
  farmsList: {
    padding: 16,
  },
  emptyTabContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTabTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyTabSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  browseButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  browseButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});