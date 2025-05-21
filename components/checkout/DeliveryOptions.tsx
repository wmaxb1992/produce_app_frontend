import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Truck, Clock, MapPin, Calendar } from 'lucide-react-native';
import useThemeStore from '@/store/useThemeStore';
import { formatDate } from '@/utils/formatters';
import { DeliveryMethod, DeliveryOption } from '@/types';

interface DeliveryOptionsProps {
  options: DeliveryOption[];
  selectedOption: string;
  onSelect: (optionId: string) => void;
  style?: any;
}

const DeliveryOptions: React.FC<DeliveryOptionsProps> = ({
  options,
  selectedOption,
  onSelect,
  style,
}) => {
  const { getThemeValues } = useThemeStore();
  const theme = getThemeValues();
  const { colors } = theme;

  const getDeliveryIcon = (type: DeliveryMethod) => {
    switch (type) {
      case 'standard':
        return <Truck size={24} color={colors.primary} />;
      case 'express':
        return <Clock size={24} color={colors.warning || '#f59e0b'} />;
      case 'pickup':
        return <MapPin size={24} color={colors.success || '#10b981'} />;
      default:
        return <Truck size={24} color={colors.primary} />;
    }
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.title, { color: colors.text }]}>Delivery Options</Text>
      
      {options.map((option) => (
        <TouchableOpacity
          key={option.id}
          style={[
            styles.optionCard,
            { 
              borderColor: colors.border || colors.gray[200], 
              backgroundColor: colors.card 
            },
            selectedOption === option.id && {
              borderColor: colors.primary,
              backgroundColor: `${colors.primary}08`,
            },
          ]}
          onPress={() => onSelect(option.id)}
          activeOpacity={0.7}
        >
          <View style={styles.optionHeader}>
            <View style={styles.optionIconContainer}>
              {getDeliveryIcon(option.type)}
            </View>
            <View style={styles.optionInfo}>
              <Text style={[styles.optionName, { color: colors.text }]}>
                {option.name}
              </Text>
              <Text style={[styles.optionDescription, { color: colors.subtext || colors.gray[600] }]}>
                {option.description}
              </Text>
            </View>
            <View style={styles.optionPrice}>
              <Text style={[styles.priceText, { color: colors.primary }]}>
                {option.price === 0 ? 'Free' : formatCurrency(option.price)}
              </Text>
            </View>
          </View>
          
          <View style={styles.optionDetails}>
            <View style={styles.deliveryDetail}>
              <Calendar size={16} color={colors.subtext || colors.gray[500]} style={styles.detailIcon} />
              <Text style={[styles.deliveryDate, { color: colors.subtext || colors.gray[600] }]}>
                Estimated: {formatDate(new Date(option.estimatedDelivery))}
              </Text>
            </View>
            
            {option.type === 'pickup' && option.pickupLocation && (
              <View style={styles.deliveryDetail}>
                <MapPin size={16} color={colors.subtext || colors.gray[500]} style={styles.detailIcon} />
                <Text style={[styles.deliveryLocation, { color: colors.subtext || colors.gray[600] }]}>
                  {option.pickupLocation.name}: {option.pickupLocation.address}
                </Text>
              </View>
            )}
          </View>
          
          {option.type === 'pickup' && option.availableTimeSlots && (
            <View style={styles.timeSlots}>
              <Text style={[styles.timeSlotsTitle, { color: colors.text }]}>
                Available Time Slots:
              </Text>
              <View style={styles.timeSlotsContainer}>
                {option.availableTimeSlots.map((slot, index) => (
                  <View 
                    key={index} 
                    style={[styles.timeSlot, { backgroundColor: colors.gray[200] || '#e5e7eb' }]}
                  >
                    <Text style={[styles.timeSlotText, { color: colors.text }]}>
                      {slot}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
          
          {selectedOption === option.id && (
            <View style={[styles.selectedIndicator, { borderTopColor: colors.primary }]} />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  optionCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    position: 'relative',
  },
  selectedOption: {
    borderColor: '#3b82f6',
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIconContainer: {
    marginRight: 12,
  },
  optionInfo: {
    flex: 1,
  },
  optionName: {
    fontSize: 16,
    fontWeight: '600',
  },
  optionDescription: {
    fontSize: 14,
    marginTop: 2,
  },
  optionPrice: {
    marginLeft: 8,
  },
  priceText: {
    fontSize: 16,
    fontWeight: '500',
  },
  optionDetails: {
    marginTop: 12,
  },
  deliveryDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailIcon: {
    marginRight: 8,
  },
  deliveryDate: {
    fontSize: 14,
  },
  deliveryLocation: {
    fontSize: 14,
  },
  timeSlots: {
    marginTop: 12,
  },
  timeSlotsTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  timeSlotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  timeSlot: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  timeSlotText: {
    fontSize: 12,
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
});

export default DeliveryOptions;