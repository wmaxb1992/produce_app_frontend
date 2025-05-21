import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { ChevronRight, Package, Truck, Clock } from 'lucide-react-native';
import { useTheme } from '@/store/useThemeStore';
import { formatDate, formatCurrency } from '@/utils/formatters';

export type OrderStatus = 
  | 'pending' 
  | 'processing' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage?: string;
  quantity: number;
  price: number;
  farmId: string;
  farmName: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
  createdAt: string;
  updatedAt: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

interface OrderCardProps {
  order: Order;
  onPress?: (order: Order) => void;
  style?: any;
}

export const OrderCard = ({ order, onPress, style }: OrderCardProps) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return theme.colors.warning;
      case 'processing':
        return theme.colors.info;
      case 'shipped':
        return theme.colors.primary;
      case 'delivered':
        return theme.colors.success;
      case 'cancelled':
        return theme.colors.error;
      default:
        return theme.colors.gray[500];
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} color={getStatusColor(status)} />;
      case 'processing':
        return <Package size={16} color={getStatusColor(status)} />;
      case 'shipped':
      case 'delivered':
        return <Truck size={16} color={getStatusColor(status)} />;
      case 'cancelled':
        return <Clock size={16} color={getStatusColor(status)} />;
      default:
        return <Package size={16} color={getStatusColor(status)} />;
    }
  };

  const formatStatus = (status: OrderStatus) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={() => onPress && onPress(order)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.orderId}>Order #{order.id.slice(-6)}</Text>
          <Text style={styles.date}>{formatDate(order.createdAt)}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) + '20' }]}>
          <View style={styles.statusIconContainer}>
            {getStatusIcon(order.status)}
          </View>
          <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
            {formatStatus(order.status)}
          </Text>
        </View>
      </View>

      <View style={styles.itemsContainer}>
        {order.items.slice(0, 2).map((item) => (
          <View key={item.id} style={styles.itemRow}>
            {item.productImage ? (
              <Image source={{ uri: item.productImage }} style={styles.itemImage} />
            ) : (
              <View style={styles.itemImagePlaceholder} />
            )}
            <View style={styles.itemInfo}>
              <Text style={styles.itemName} numberOfLines={1}>
                {item.productName}
              </Text>
              <Text style={styles.itemMeta}>
                {item.quantity} × {formatCurrency(item.price)}
              </Text>
            </View>
          </View>
        ))}
        {order.items.length > 2 && (
          <Text style={styles.moreItems}>
            +{order.items.length - 2} more items
          </Text>
        )}
      </View>

      <View style={styles.footer}>
        <View>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>{formatCurrency(order.total)}</Text>
        </View>
        <View style={styles.viewDetailsButton}>
          <Text style={styles.viewDetailsText}>View Details</Text>
          <ChevronRight size={16} color={theme.colors.primary} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const OrderDetailHeader = ({ 
  order,
  style,
}: { 
  order: Order,
  style?: any,
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  
  return (
    <View style={[styles.detailHeader, style]}>
      <View style={styles.detailHeaderRow}>
        <Text style={styles.detailHeaderTitle}>Order #{order.id.slice(-6)}</Text>
        <View style={[
          styles.statusBadge, 
          { backgroundColor: getStatusColor(order.status) + '20' }
        ]}>
          <Text style={[
            styles.statusText, 
            { color: getStatusColor(order.status) }
          ]}>
            {formatStatus(order.status)}
          </Text>
        </View>
      </View>
      
      <Text style={styles.detailHeaderDate}>
        Placed on {formatDate(order.createdAt)}
      </Text>
      
      {order.estimatedDelivery && (
        <View style={styles.estimatedDelivery}>
          <Truck size={16} color={theme.colors.primary} style={styles.deliveryIcon} />
          <Text style={styles.estimatedDeliveryText}>
            Estimated delivery: {formatDate(order.estimatedDelivery)}
          </Text>
        </View>
      )}
    </View>
  );
};

// Helper functions
const getStatusColor = (status: OrderStatus, theme: any) => {
  switch (status) {
    case 'pending':
      return theme.colors.warning;
    case 'processing':
      return theme.colors.info;
    case 'shipped':
      return theme.colors.primary;
    case 'delivered':
      return theme.colors.success;
    case 'cancelled':
      return theme.colors.error;
    default:
      return theme.colors.gray[500];
  }
};

const formatStatus = (status: OrderStatus) => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 16,
    },
    orderId: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
    },
    date: {
      fontSize: 14,
      color: theme.colors.gray[500],
      marginTop: 2,
    },
    statusBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 16,
    },
    statusIconContainer: {
      marginRight: 4,
    },
    statusText: {
      fontSize: 12,
      fontWeight: '500',
    },
    itemsContainer: {
      marginBottom: 16,
    },
    itemRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    itemImage: {
      width: 40,
      height: 40,
      borderRadius: 4,
      marginRight: 12,
    },
    itemImagePlaceholder: {
      width: 40,
      height: 40,
      borderRadius: 4,
      backgroundColor: theme.colors.gray[200],
      marginRight: 12,
    },
    itemInfo: {
      flex: 1,
    },
    itemName: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.text,
    },
    itemMeta: {
      fontSize: 13,
      color: theme.colors.gray[500],
      marginTop: 2,
    },
    moreItems: {
      fontSize: 13,
      color: theme.colors.primary,
      marginTop: 4,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: theme.colors.gray[200],
    },
    totalLabel: {
      fontSize: 14,
      color: theme.colors.gray[500],
    },
    totalAmount: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
    },
    viewDetailsButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    viewDetailsText: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.primary,
      marginRight: 4,
    },
    detailHeader: {
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
    },
    detailHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    detailHeaderTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
    },
    detailHeaderDate: {
      fontSize: 14,
      color: theme.colors.gray[500],
      marginBottom: 12,
    },
    estimatedDelivery: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
      backgroundColor: theme.colors.primary + '10',
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 6,
    },
    deliveryIcon: {
      marginRight: 8,
    },
    estimatedDeliveryText: {
      fontSize: 14,
      color: theme.colors.primary,
    },
  });

export default OrderCard;