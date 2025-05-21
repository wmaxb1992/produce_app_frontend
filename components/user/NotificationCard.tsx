import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Bell, ShoppingBag, Truck, Heart, MessageCircle, Calendar, Star } from 'lucide-react-native';
import { useTheme } from '@/store/useThemeStore';
import { formatTimeAgo } from '@/utils/formatters';

export type NotificationType = 
  | 'order' 
  | 'delivery' 
  | 'promotion' 
  | 'favorite' 
  | 'message'
  | 'event'
  | 'review';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  data?: {
    orderId?: string;
    productId?: string;
    farmId?: string;
    eventId?: string;
    reviewId?: string;
  };
}

interface NotificationCardProps {
  notification: Notification;
  onPress?: (notification: Notification) => void;
  onMarkAsRead?: (id: string) => void;
  style?: any;
}

export const NotificationCard = ({
  notification,
  onPress,
  onMarkAsRead,
  style,
}: NotificationCardProps) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const getNotificationIcon = () => {
    switch (notification.type) {
      case 'order':
        return <ShoppingBag size={24} color={theme.colors.primary} />;
      case 'delivery':
        return <Truck size={24} color={theme.colors.success} />;
      case 'promotion':
        return <Bell size={24} color={theme.colors.warning} />;
      case 'favorite':
        return <Heart size={24} color={theme.colors.error} />;
      case 'message':
        return <MessageCircle size={24} color={theme.colors.info} />;
      case 'event':
        return <Calendar size={24} color={theme.colors.secondary} />;
      case 'review':
        return <Star size={24} color={theme.colors.warning} />;
      default:
        return <Bell size={24} color={theme.colors.primary} />;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        !notification.isRead && styles.unreadContainer,
        style,
      ]}
      onPress={() => onPress && onPress(notification)}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>{getNotificationIcon()}</View>
      <View style={styles.content}>
        <Text style={styles.title}>{notification.title}</Text>
        <Text style={styles.message} numberOfLines={2}>
          {notification.message}
        </Text>
        <Text style={styles.time}>{formatTimeAgo(notification.createdAt)}</Text>
      </View>
      {!notification.isRead && (
        <View style={styles.unreadIndicator}>
          {onMarkAsRead && (
            <TouchableOpacity
              style={styles.markReadButton}
              onPress={(e) => {
                e.stopPropagation();
                onMarkAsRead(notification.id);
              }}
            >
              <Text style={styles.markReadText}>Mark as read</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

export const NotificationPreferences = ({
  preferences,
  onToggle,
  style,
}: {
  preferences: {
    orders: boolean;
    deliveries: boolean;
    promotions: boolean;
    favorites: boolean;
    messages: boolean;
    events: boolean;
    reviews: boolean;
  };
  onToggle: (key: keyof typeof preferences, value: boolean) => void;
  style?: any;
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  
  const preferencesConfig = [
    { key: 'orders', label: 'Order Updates', icon: <ShoppingBag size={20} color={theme.colors.primary} /> },
    { key: 'deliveries', label: 'Delivery Updates', icon: <Truck size={20} color={theme.colors.success} /> },
    { key: 'promotions', label: 'Promotions & Deals', icon: <Bell size={20} color={theme.colors.warning} /> },
    { key: 'favorites', label: 'Favorites & Wishlist', icon: <Heart size={20} color={theme.colors.error} /> },
    { key: 'messages', label: 'Messages', icon: <MessageCircle size={20} color={theme.colors.info} /> },
    { key: 'events', label: 'Farm Events', icon: <Calendar size={20} color={theme.colors.secondary} /> },
    { key: 'reviews', label: 'Reviews & Ratings', icon: <Star size={20} color={theme.colors.warning} /> },
  ];
  
  return (
    <View style={[styles.preferencesContainer, style]}>
      <Text style={styles.preferencesTitle}>Notification Preferences</Text>
      
      {preferencesConfig.map((item) => (
        <View key={item.key} style={styles.preferenceItem}>
          <View style={styles.preferenceInfo}>
            {item.icon}
            <Text style={styles.preferenceLabel}>{item.label}</Text>
          </View>
          
          <TouchableOpacity
            style={[
              styles.toggleButton,
              preferences[item.key as keyof typeof preferences] ? styles.toggleActive : styles.toggleInactive
            ]}
            onPress={() => onToggle(
              item.key as keyof typeof preferences, 
              !preferences[item.key as keyof typeof preferences]
            )}
          >
            <View style={[
              styles.toggleKnob,
              preferences[item.key as keyof typeof preferences] ? styles.toggleKnobActive : styles.toggleKnobInactive
            ]} />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
    },
    unreadContainer: {
      backgroundColor: theme.colors.primary + '08',
      borderLeftWidth: 3,
      borderLeftColor: theme.colors.primary,
    },
    iconContainer: {
      marginRight: 16,
      alignSelf: 'flex-start',
    },
    content: {
      flex: 1,
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 4,
    },
    message: {
      fontSize: 14,
      color: theme.colors.gray[600],
      marginBottom: 8,
    },
    time: {
      fontSize: 12,
      color: theme.colors.gray[500],
    },
    unreadIndicator: {
      alignItems: 'flex-end',
      justifyContent: 'center',
    },
    markReadButton: {
      paddingVertical: 4,
      paddingHorizontal: 8,
    },
    markReadText: {
      fontSize: 12,
      color: theme.colors.primary,
      fontWeight: '500',
    },
    preferencesContainer: {
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
    },
    preferencesTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 16,
    },
    preferenceItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.gray[200],
    },
    preferenceInfo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    preferenceLabel: {
      fontSize: 16,
      color: theme.colors.text,
      marginLeft: 12,
    },
    toggleButton: {
      width: 50,
      height: 28,
      borderRadius: 14,
      padding: 2,
    },
    toggleActive: {
      backgroundColor: theme.colors.primary,
    },
    toggleInactive: {
      backgroundColor: theme.colors.gray[300],
    },
    toggleKnob: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: '#fff',
    },
    toggleKnobActive: {
      alignSelf: 'flex-end',
    },
    toggleKnobInactive: {
      alignSelf: 'flex-start',
    },
  });

export default NotificationCard;