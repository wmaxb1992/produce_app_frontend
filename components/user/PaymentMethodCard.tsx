import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CreditCard, Trash, Check } from 'lucide-react-native';
import useThemeStore from '@/store/useThemeStore';

export type CardType = 'visa' | 'mastercard' | 'amex' | 'discover' | 'other';

export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'applepay' | 'googlepay';
  isDefault?: boolean;
  // Card specific
  cardType?: CardType;
  last4?: string;
  expiryMonth?: string;
  expiryYear?: string;
  cardholderName?: string;
  // PayPal specific
  email?: string;
}

interface PaymentMethodCardProps {
  paymentMethod: PaymentMethod;
  onDelete?: (id: string) => void;
  onSetDefault?: (id: string) => void;
  isSelected?: boolean;
  onSelect?: (paymentMethod: PaymentMethod) => void;
  style?: any;
}

export const PaymentMethodCard = ({
  paymentMethod,
  onDelete,
  onSetDefault,
  isSelected,
  onSelect,
  style,
}: PaymentMethodCardProps) => {
  const themeStore = useThemeStore();
  const theme = themeStore.getThemeValues();
  const { colors } = theme;

  const handlePress = () => {
    if (onSelect) {
      onSelect(paymentMethod);
    }
  };

  const getCardTypeIcon = () => {
    // In a real app, you would use actual card brand icons
    return <CreditCard size={24} color={colors.primary} />;
  };

  const getCardTypeColor = (cardType?: CardType) => {
    switch (cardType) {
      case 'visa':
        return '#1A1F71'; // Visa blue
      case 'mastercard':
        return '#EB001B'; // Mastercard red
      case 'amex':
        return '#006FCF'; // Amex blue
      case 'discover':
        return '#FF6600'; // Discover orange
      default:
        return colors.primary;
    }
  };

  const getPaymentMethodTitle = () => {
    switch (paymentMethod.type) {
      case 'card':
        return `${paymentMethod.cardType?.toUpperCase() || 'Card'} •••• ${paymentMethod.last4}`;
      case 'paypal':
        return `PayPal - ${paymentMethod.email}`;
      case 'applepay':
        return 'Apple Pay';
      case 'googlepay':
        return 'Google Pay';
      default:
        return 'Payment Method';
    }
  };

  const getPaymentMethodSubtitle = () => {
    if (paymentMethod.type === 'card' && paymentMethod.expiryMonth && paymentMethod.expiryYear) {
      return `Expires ${paymentMethod.expiryMonth}/${paymentMethod.expiryYear}`;
    }
    return null;
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isSelected && styles.selectedContainer,
        { 
          backgroundColor: colors.card,
          borderColor: isSelected ? colors.primary : colors.gray[200],
        },
        style,
      ]}
      onPress={handlePress}
      activeOpacity={onSelect ? 0.7 : 1}
    >
      <View style={styles.header}>
        <View style={styles.methodInfo}>
          {paymentMethod.type === 'card' ? (
            getCardTypeIcon()
          ) : (
            <CreditCard size={24} color={colors.primary} />
          )}
          <View style={styles.methodDetails}>
            <Text style={[styles.methodTitle, { color: colors.text }]}>{getPaymentMethodTitle()}</Text>
            {getPaymentMethodSubtitle() && (
              <Text style={[styles.methodSubtitle, { color: colors.gray[500] }]}>{getPaymentMethodSubtitle()}</Text>
            )}
          </View>
        </View>
        {paymentMethod.isDefault && (
          <View style={[styles.defaultBadge, { backgroundColor: colors.success + '20' }]}>
            <Text style={[styles.defaultText, { color: colors.success }]}>Default</Text>
          </View>
        )}
      </View>

      <View style={styles.actions}>
        {onDelete && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onDelete(paymentMethod.id)}
          >
            <Trash size={16} color={colors.error} />
            <Text style={[styles.actionText, { color: colors.error }]}>Remove</Text>
          </TouchableOpacity>
        )}

        {onSetDefault && !paymentMethod.isDefault && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onSetDefault(paymentMethod.id)}
          >
            <Check size={16} color={colors.success} />
            <Text style={[styles.actionText, { color: colors.success }]}>
              Set as Default
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {isSelected && <View style={[styles.selectedIndicator, { borderTopColor: colors.primary }]} />}
    </TouchableOpacity>
  );
};

export const AddPaymentMethodButton = ({
  onPress,
  style,
}: {
  onPress: () => void;
  style?: any;
}) => {
  const themeStore = useThemeStore();
  const theme = themeStore.getThemeValues();
  const { colors } = theme;
  
  return (
    <TouchableOpacity 
      style={[
        styles.addButton, 
        { 
          backgroundColor: colors.card,
          borderColor: colors.primary 
        }, 
        style
      ]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <CreditCard size={24} color={colors.primary} />
      <Text style={[styles.addButtonText, { color: colors.primary }]}>Add Payment Method</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    position: 'relative',
  },
  selectedContainer: {
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  methodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  methodDetails: {
    marginLeft: 12,
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  methodSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  defaultBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  defaultText: {
    fontSize: 12,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    paddingVertical: 4,
  },
  actionText: {
    fontSize: 14,
    marginLeft: 4,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderRightWidth: 24,
    borderTopWidth: 24,
    borderRightColor: 'transparent',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    marginBottom: 16,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
  },
});

export default PaymentMethodCard;