import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { CheckCircle, Home, Package, Clock, ShoppingBag } from 'lucide-react-native';

import useThemeStore from '@/store/useThemeStore';
import Button from '@/components/ui/Button';

export default function OrderConfirmationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ orderId: string; total: string }>();
  
  // Get theme values
  const { getThemeValues } = useThemeStore();
  const theme = getThemeValues();
  const { colors } = theme;
  
  // Get order details from params
  const orderId = params.orderId || `ORD-${Date.now()}`;
  const total = params.total || '0.00';
  
  // Generate estimated delivery date (5 days from now)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 5);
  const formattedDeliveryDate = deliveryDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
  
  // Set header title
  return (
    <>
      <Stack.Screen options={{ 
        title: 'Order Confirmation',
        headerBackVisible: false,
      }} />
      
      <ScrollView 
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.successContainer}>
          <CheckCircle size={80} color={colors.primary} />
          <Text style={[styles.successTitle, { color: colors.text }]}>
            Order Confirmed!
          </Text>
          <Text style={[styles.successMessage, { color: colors.subtext }]}>
            Your order has been placed successfully. We'll start preparing your items right away.
          </Text>
        </View>
        
        <View style={[styles.orderInfoContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.orderInfoRow}>
            <Text style={[styles.orderInfoLabel, { color: colors.subtext }]}>
              Order Number
            </Text>
            <Text style={[styles.orderInfoValue, { color: colors.text }]}>
              {orderId}
            </Text>
          </View>
          
          <View style={styles.orderInfoRow}>
            <Text style={[styles.orderInfoLabel, { color: colors.subtext }]}>
              Order Total
            </Text>
            <Text style={[styles.orderInfoValue, { color: colors.text }]}>
              ${total}
            </Text>
          </View>
          
          <View style={styles.orderInfoRow}>
            <Text style={[styles.orderInfoLabel, { color: colors.subtext }]}>
              Payment Method
            </Text>
            <Text style={[styles.orderInfoValue, { color: colors.text }]}>
              •••• 4242
            </Text>
          </View>
        </View>
        
        <View style={styles.deliveryInfoContainer}>
          <View style={styles.deliveryInfoHeader}>
            <Clock size={20} color={colors.primary} />
            <Text style={[styles.deliveryInfoTitle, { color: colors.text }]}>
              Estimated Delivery
            </Text>
          </View>
          
          <Text style={[styles.deliveryDate, { color: colors.text }]}>
            {formattedDeliveryDate}
          </Text>
          
          <View style={[styles.deliveryTimeline, { borderLeftColor: colors.border }]}>
            <View style={styles.timelineItem}>
              <View style={[styles.timelineDot, { backgroundColor: colors.primary }]} />
              <View style={styles.timelineContent}>
                <Text style={[styles.timelineTitle, { color: colors.text }]}>
                  Order Confirmed
                </Text>
                <Text style={[styles.timelineSubtitle, { color: colors.subtext }]}>
                  Your order has been received
                </Text>
              </View>
            </View>
            
            <View style={styles.timelineItem}>
              <View style={[styles.timelineDot, { backgroundColor: colors.gray[300] }]} />
              <View style={styles.timelineContent}>
                <Text style={[styles.timelineTitle, { color: colors.text }]}>
                  Processing
                </Text>
                <Text style={[styles.timelineSubtitle, { color: colors.subtext }]}>
                  We're preparing your items
                </Text>
              </View>
            </View>
            
            <View style={styles.timelineItem}>
              <View style={[styles.timelineDot, { backgroundColor: colors.gray[300] }]} />
              <View style={styles.timelineContent}>
                <Text style={[styles.timelineTitle, { color: colors.text }]}>
                  Shipped
                </Text>
                <Text style={[styles.timelineSubtitle, { color: colors.subtext }]}>
                  Your order is on the way
                </Text>
              </View>
            </View>
            
            <View style={styles.timelineItem}>
              <View style={[styles.timelineDot, { backgroundColor: colors.gray[300] }]} />
              <View style={styles.timelineContent}>
                <Text style={[styles.timelineTitle, { color: colors.text }]}>
                  Delivered
                </Text>
                <Text style={[styles.timelineSubtitle, { color: colors.subtext }]}>
                  Enjoy your fresh products!
                </Text>
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.actionsContainer}>
          <Button
            variant="primary"
            onPress={() => router.push('/')}
            style={styles.actionButton}
          >
            <Home size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.actionButtonText}>Continue Shopping</Text>
          </Button>
          
          <Button
            variant="outline"
            onPress={() => router.push(`/orders/${orderId}`)}
            style={styles.actionButton}
          >
            <Package size={18} color={colors.primary} style={{ marginRight: 8 }} />
            <Text style={[styles.outlineButtonText, { color: colors.primary }]}>
              Track Order
            </Text>
          </Button>
          
          <View style={{ marginTop: 12 }}>
            <Button
              variant="outline"
              onPress={() => router.push('/orders')}
              style={styles.actionButton}
            >
              <ShoppingBag size={18} color={colors.primary} style={{ marginRight: 8 }} />
              <Text style={[styles.outlineButtonText, { color: colors.primary }]}>
                View All Orders
              </Text>
            </Button>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  successContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  successMessage: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  orderInfoContainer: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
  },
  orderInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  orderInfoLabel: {
    fontSize: 16,
  },
  orderInfoValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  deliveryInfoContainer: {
    marginBottom: 32,
  },
  deliveryInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  deliveryInfoTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  deliveryDate: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  deliveryTimeline: {
    paddingLeft: 24,
    borderLeftWidth: 2,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
    position: 'relative',
  },
  timelineDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    position: 'absolute',
    left: -9,
    top: 0,
  },
  timelineContent: {
    marginLeft: 16,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  timelineSubtitle: {
    fontSize: 14,
  },
  actionsContainer: {
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  outlineButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});