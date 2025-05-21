import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Calendar, ChevronRight, Edit2, MoreVertical, Trash } from 'lucide-react-native';
import useThemeStore from '@/store/useThemeStore';
import useSubscriptionStore from '@/store/useSubscriptionStore';
import defaultColors from '@/constants/colors';
import { SubscriptionBundle } from '@/types';

interface ActiveSubscription {
  id: string;
  bundleId: string;
  frequency: 'weekly' | 'monthly';
  deliveryDay: string;
  nextDelivery: string; // ISO date
  bundle: SubscriptionBundle;
}

export default function SubscriptionsScreen() {
  const router = useRouter();
  const { theme } = useThemeStore();
  const colors = theme?.colors || defaultColors.light;
  const { bundles, userSubscriptions, unsubscribe } = useSubscriptionStore();
  
  const [activeSubscriptions, setActiveSubscriptions] = useState<ActiveSubscription[]>([]);
  
  // Mock function to get active subscriptions
  useEffect(() => {
    // In a real app, this would fetch from an API
    const mockSubscriptions: ActiveSubscription[] = userSubscriptions.map(bundleId => {
      const bundle = bundles.find(b => b.id === bundleId);
      
      if (!bundle) {
        return null;
      }
      
      // Generate a random delivery day
      const days = ['Monday', 'Wednesday', 'Friday'];
      const randomDay = days[Math.floor(Math.random() * days.length)];
      
      // Generate next delivery date
      const now = new Date();
      const deliveryDate = new Date();
      const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const targetDay = dayOfWeek.indexOf(randomDay);
      
      if (targetDay > 0) {
        const daysToAdd = (targetDay - now.getDay() + 7) % 7;
        deliveryDate.setDate(now.getDate() + daysToAdd);
      }
      
      return {
        id: `sub-${bundleId}-${Math.random().toString(36).substring(2, 9)}`,
        bundleId,
        frequency: Math.random() > 0.5 ? 'weekly' : 'monthly',
        deliveryDay: randomDay,
        nextDelivery: deliveryDate.toISOString(),
        bundle,
      };
    }).filter(Boolean) as ActiveSubscription[];
    
    setActiveSubscriptions(mockSubscriptions);
  }, [bundles, userSubscriptions]);
  
  const handleSubscriptionPress = (subscription: ActiveSubscription) => {
    router.push({
      pathname: '/subscription/[id]',
      params: { id: subscription.bundleId }
    } as any);
  };
  
  const handleEditSubscription = (subscription: ActiveSubscription) => {
    Alert.alert('Edit Subscription', 'This would open a modal to edit delivery frequency and day.');
  };
  
  const handleCancelSubscription = (subscription: ActiveSubscription) => {
    Alert.alert(
      'Cancel Subscription',
      'Are you sure you want to cancel this subscription?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => {
            // Call unsubscribe function
            unsubscribe(subscription.bundleId);
            // Remove from local state
            setActiveSubscriptions(prev => 
              prev.filter(sub => sub.id !== subscription.id)
            );
          },
        },
      ]
    );
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };
  
  const renderItem = ({ item }: { item: ActiveSubscription }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card }]}
      onPress={() => handleSubscriptionPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <Image 
          source={{ uri: item.bundle.image }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.cardInfo}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            {item.bundle.name}
          </Text>
          <Text style={[styles.cardSubtitle, { color: colors.subtext }]}>
            {item.frequency === 'weekly' ? 'Weekly' : 'Monthly'} delivery on {item.deliveryDay}s
          </Text>
          <View style={[styles.deliveryBadge, { backgroundColor: colors.primary + '20' }]}>
            <Calendar size={14} color={colors.primary} style={styles.calendarIcon} />
            <Text style={[styles.deliveryText, { color: colors.primary }]}>
              Next delivery: {formatDate(item.nextDelivery)}
            </Text>
          </View>
        </View>
        <ChevronRight size={20} color={colors.subtext} />
      </View>
      
      <View style={[styles.cardActions, { borderTopColor: colors.border }]}>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => handleEditSubscription(item)}
        >
          <Edit2 size={16} color={colors.primary} style={styles.actionIcon} />
          <Text style={[styles.actionText, { color: colors.primary }]}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => handleCancelSubscription(item)}
        >
          <Trash size={16} color={colors.error} style={styles.actionIcon} />
          <Text style={[styles.actionText, { color: colors.error }]}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
  
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: "My Subscriptions",
          headerShadowVisible: false,
        }} 
      />
      
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {activeSubscriptions.length > 0 ? (
          <FlatList
            data={activeSubscriptions}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContainer}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No Active Subscriptions
            </Text>
            <Text style={[styles.emptyText, { color: colors.subtext }]}>
              You don't have any active subscriptions.
              Browse our bundles to find fresh produce delivered to your door.
            </Text>
            <TouchableOpacity
              style={[styles.browseButton, { backgroundColor: colors.primary }]}
              onPress={() => router.push('/')}
            >
              <Text style={[styles.browseButtonText, { color: colors.white }]}>
                Browse Subscription Bundles
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
  },
  card: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    marginBottom: 8,
  },
  deliveryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  calendarIcon: {
    marginRight: 4,
  },
  deliveryText: {
    fontSize: 12,
    fontWeight: '500',
  },
  cardActions: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  actionIcon: {
    marginRight: 6,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  browseButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  browseButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 