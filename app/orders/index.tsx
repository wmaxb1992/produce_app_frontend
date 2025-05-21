import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator 
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { ShoppingBag, Filter, ChevronDown } from 'lucide-react-native';

import useThemeStore from '@/store/useThemeStore';
import useUserStore from '@/store/useUserStore';
import useOrderStore from '@/store/useOrderStore';
import OrderCard, { Order } from '@/components/user/OrderCard';

// Order status filter options
const STATUS_FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Processing', value: 'processing' },
  { label: 'Shipped', value: 'shipped' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Cancelled', value: 'cancelled' },
];

export default function OrdersScreen() {
  const router = useRouter();
  
  // Get theme values
  const { getThemeValues } = useThemeStore();
  const theme = getThemeValues();
  const { colors } = theme;
  
  // Get user data
  const { user } = useUserStore();
  
  // Get orders from the order store
  const { getOrdersByUserId } = useOrderStore();
  
  // State
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('date-desc');
  
  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Get user orders from the store
        if (user) {
          const userOrders = getOrdersByUserId(user.id);
          setOrders(userOrders);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrders();
  }, [user, getOrdersByUserId]);
  
  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...orders];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }
    
    // Apply sorting
    if (sortBy === 'date-desc') {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'date-asc') {
      filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (sortBy === 'price-desc') {
      filtered.sort((a, b) => b.total - a.total);
    } else if (sortBy === 'price-asc') {
      filtered.sort((a, b) => a.total - b.total);
    }
    
    setFilteredOrders(filtered);
  }, [orders, statusFilter, sortBy]);
  
  // Handle order press
  const handleOrderPress = (order: Order) => {
    router.push(`/orders/${order.id}`);
  };
  
  // Toggle filters
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  // Render empty state
  if (!isLoading && filteredOrders.length === 0) {
    return (
      <>
        <Stack.Screen options={{ 
          title: 'My Orders',
        }} />
        
        <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
          <ShoppingBag size={64} color={colors.gray[300]} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            No orders found
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.subtext }]}>
            {statusFilter !== 'all' 
              ? `You don't have any ${statusFilter} orders yet`
              : "You haven't placed any orders yet"}
          </Text>
          <TouchableOpacity 
            style={[styles.shopButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/')}
          >
            <Text style={styles.shopButtonText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }
  
  return (
    <>
      <Stack.Screen options={{ 
        title: 'My Orders',
      }} />
      
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Filters */}
        <View style={styles.filtersContainer}>
          <TouchableOpacity 
            style={[styles.filterButton, { borderColor: colors.border }]}
            onPress={toggleFilters}
          >
            <Filter size={16} color={colors.primary} />
            <Text style={[styles.filterButtonText, { color: colors.text }]}>
              {STATUS_FILTERS.find(f => f.value === statusFilter)?.label || 'All'}
            </Text>
            <ChevronDown size={16} color={colors.subtext} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.sortButton, { borderColor: colors.border }]}
            onPress={() => {
              // Cycle through sort options
              if (sortBy === 'date-desc') setSortBy('date-asc');
              else if (sortBy === 'date-asc') setSortBy('price-desc');
              else if (sortBy === 'price-desc') setSortBy('price-asc');
              else setSortBy('date-desc');
            }}
          >
            <Text style={[styles.sortButtonText, { color: colors.text }]}>
              Sort: {sortBy.includes('date') 
                ? `Date ${sortBy.includes('desc') ? '(Newest)' : '(Oldest)'}` 
                : `Price ${sortBy.includes('desc') ? '(Highest)' : '(Lowest)'}`}
            </Text>
            <ChevronDown size={16} color={colors.subtext} />
          </TouchableOpacity>
        </View>
        
        {/* Filter dropdown */}
        {showFilters && (
          <View style={[styles.filterDropdown, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {STATUS_FILTERS.map((filter) => (
              <TouchableOpacity
                key={filter.value}
                style={[
                  styles.filterOption,
                  statusFilter === filter.value && { backgroundColor: `${colors.primary}15` }
                ]}
                onPress={() => {
                  setStatusFilter(filter.value);
                  setShowFilters(false);
                }}
              >
                <Text 
                  style={[
                    styles.filterOptionText, 
                    { color: colors.text },
                    statusFilter === filter.value && { color: colors.primary, fontWeight: '600' }
                  ]}
                >
                  {filter.label}
                </Text>
                {statusFilter === filter.value && (
                  <View style={[styles.activeFilterDot, { backgroundColor: colors.primary }]} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
        
        {/* Orders list */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.subtext }]}>
              Loading your orders...
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredOrders}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <OrderCard 
                order={item} 
                onPress={handleOrderPress}
                style={styles.orderCard}
              />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </>
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
    marginBottom: 24,
  },
  shopButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shopButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  filtersContainer: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 8,
    marginRight: 8,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    marginHorizontal: 8,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 8,
    flex: 1,
  },
  sortButtonText: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  filterDropdown: {
    marginHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 8,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  filterOptionText: {
    fontSize: 14,
  },
  activeFilterDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
  orderCard: {
    marginBottom: 16,
  },
});