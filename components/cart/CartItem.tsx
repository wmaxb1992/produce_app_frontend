import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Minus, Plus, Trash2, Calendar, RefreshCw } from 'lucide-react-native';
import { CartItem as CartItemType } from '@/types';
import { useTheme } from '@/hooks/useTheme';
import useCartStore from '@/store/useCartStore';

interface CartItemProps {
  item: CartItemType;
  cartId?: string; // Make optional since CartItem in our store doesn't have this
}

const CartItem: React.FC<CartItemProps> = ({ item, cartId = '' }) => {
  const { colors } = useTheme();
  
  // Safely access the cart store functions
  const { updateQuantity, removeItem } = useCartStore();
  
  const handleIncrement = () => {
    updateQuantity(item.id, item.quantity + 1);
  };
  
  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    } else {
      removeItem(item.id);
    }
  };
  
  const handleRemove = () => {
    removeItem(item.id);
  };
  
  // Check if this is a subscription item
  const isSubscription = item.type === 'subscription' && item.metadata;
  
  return (
    <View style={[styles.container, { borderBottomColor: colors.border }]}>
      <Image 
        source={{ uri: item.image }} 
        style={styles.image}
        resizeMode="cover"
      />
      
      <View style={styles.content}>
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
          {item.name}
        </Text>
        
        <Text style={[styles.farmName, { color: colors.subtext }]} numberOfLines={1}>
          From {item.farmName || 'Unknown Farm'}
        </Text>
        
        <Text style={[styles.price, { color: colors.text }]}>
          ${item.price.toFixed(2)} / {item.unit || 'item'}
        </Text>
        
        {isSubscription && (
          <View style={[styles.subscriptionInfo, { backgroundColor: colors.primary + '10' }]}>
            <View style={[styles.subscriptionBadge, { backgroundColor: colors.primary }]}>
              <Text style={styles.subscriptionBadgeText}>Subscription</Text>
            </View>
            
            {item.metadata?.deliveryDay && (
              <View style={styles.deliveryInfoRow}>
                <Calendar size={14} color={colors.primary} style={styles.infoIcon} />
                <Text style={[styles.deliveryInfoText, { color: colors.text }]}>
                  Delivered on {item.metadata.deliveryDay}s
                </Text>
              </View>
            )}
            
            {item.metadata?.frequency && (
              <View style={styles.deliveryInfoRow}>
                <RefreshCw size={14} color={colors.primary} style={styles.infoIcon} />
                <Text style={[styles.deliveryInfoText, { color: colors.text }]}>
                  {item.metadata.frequency === 'weekly' ? 'Weekly' : 'Monthly'} delivery
                </Text>
              </View>
            )}
          </View>
        )}
        
        <View style={styles.actions}>
          <View style={[styles.quantityContainer, { borderColor: colors.border }]}>
            <TouchableOpacity 
              style={[styles.quantityButton, { borderRightColor: colors.border }]}
              onPress={handleDecrement}
            >
              <Minus size={16} color={colors.text} />
            </TouchableOpacity>
            
            <Text style={[styles.quantity, { color: colors.text }]}>
              {item.quantity}
            </Text>
            
            <TouchableOpacity 
              style={[styles.quantityButton, { borderLeftColor: colors.border }]}
              onPress={handleIncrement}
            >
              <Plus size={16} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.removeButton}
            onPress={handleRemove}
          >
            <Trash2 size={18} color={colors.error} />
          </TouchableOpacity>
        </View>
      </View>
      
      <Text style={[styles.totalPrice, { color: colors.text }]}>
        ${(item.price * item.quantity).toFixed(2)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  content: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  farmName: {
    fontSize: 12,
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    height: 32,
  },
  quantityButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantity: {
    width: 32,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
  },
  removeButton: {
    marginLeft: 12,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 'auto',
    alignSelf: 'center',
  },
  subscriptionInfo: {
    marginTop: 4,
    marginBottom: 8,
    padding: 8,
    borderRadius: 8,
  },
  subscriptionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  subscriptionBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  deliveryInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  infoIcon: {
    marginRight: 6,
  },
  deliveryInfoText: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default CartItem;