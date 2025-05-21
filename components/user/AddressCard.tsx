import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MapPin, Edit, Trash, Check } from 'lucide-react-native';
import useThemeStore from '@/store/useThemeStore';

export interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
  phone?: string;
  instructions?: string;
}

interface AddressCardProps {
  address: Address;
  onEdit?: (address: Address) => void;
  onDelete?: (addressId: string) => void;
  onSetDefault?: (addressId: string) => void;
  isSelected?: boolean;
  onSelect?: (address: Address) => void;
  style?: any;
}

export const AddressCard = ({
  address,
  onEdit,
  onDelete,
  onSetDefault,
  isSelected,
  onSelect,
  style,
}: AddressCardProps) => {
  const themeStore = useThemeStore();
  const theme = themeStore.getThemeValues();
  const { colors } = theme;

  const handlePress = () => {
    if (onSelect) {
      onSelect(address);
    }
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
        <View style={styles.nameContainer}>
          <MapPin size={16} color={colors.primary} style={styles.icon} />
          <Text style={[styles.name, { color: colors.text }]}>{address.name}</Text>
        </View>
        {address.isDefault && (
          <View style={[styles.defaultBadge, { backgroundColor: colors.success + '20' }]}>
            <Text style={[styles.defaultText, { color: colors.success }]}>Default</Text>
          </View>
        )}
      </View>

      <View style={styles.addressContent}>
        <Text style={[styles.addressLine, { color: colors.text }]}>{address.street}</Text>
        <Text style={[styles.addressLine, { color: colors.text }]}>
          {address.city}, {address.state} {address.zipCode}
        </Text>
        <Text style={[styles.addressLine, { color: colors.text }]}>{address.country}</Text>
        {address.phone && <Text style={[styles.addressLine, { color: colors.text }]}>{address.phone}</Text>}
        {address.instructions && (
          <Text style={[styles.instructions, { color: colors.gray[600] }]}>
            Instructions: {address.instructions}
          </Text>
        )}
      </View>

      <View style={styles.actions}>
        {onEdit && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onEdit(address)}
          >
            <Edit size={16} color={colors.text} />
            <Text style={[styles.actionText, { color: colors.text }]}>Edit</Text>
          </TouchableOpacity>
        )}

        {onDelete && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onDelete(address.id)}
          >
            <Trash size={16} color={colors.error} />
            <Text style={[styles.actionText, styles.deleteText, { color: colors.error }]}>Delete</Text>
          </TouchableOpacity>
        )}

        {onSetDefault && !address.isDefault && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onSetDefault(address.id)}
          >
            <Check size={16} color={colors.success} />
            <Text style={[styles.actionText, styles.defaultActionText, { color: colors.success }]}>
              Set as Default
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {isSelected && <View style={[styles.selectedIndicator, { borderTopColor: colors.primary }]} />}
    </TouchableOpacity>
  );
};

export const AddressForm = ({
  address,
  onSave,
  onCancel,
  style,
}: {
  address?: Address;
  onSave: (address: Address) => void;
  onCancel: () => void;
  style?: any;
}) => {
  const themeStore = useThemeStore();
  const theme = themeStore.getThemeValues();
  const { colors } = theme;
  
  // Form implementation would go here
  // This is a placeholder for the actual form component
  
  return (
    <View style={[
      styles.formContainer, 
      { backgroundColor: colors.card },
      style
    ]}>
      <Text style={[styles.formTitle, { color: colors.text }]}>
        {address ? 'Edit Address' : 'Add New Address'}
      </Text>
      
      {/* Form fields would go here */}
      
      <View style={styles.formActions}>
        <TouchableOpacity 
          style={[styles.formButton, styles.cancelButton, { backgroundColor: colors.gray[200] }]} 
          onPress={onCancel}
        >
          <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.formButton, styles.saveButton, { backgroundColor: colors.primary }]} 
          onPress={() => onSave(address as Address)}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
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
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
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
  addressContent: {
    marginBottom: 16,
  },
  addressLine: {
    fontSize: 14,
    marginBottom: 4,
  },
  instructions: {
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
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
  deleteText: {},
  defaultActionText: {},
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
  formContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  formButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 12,
  },
  cancelButton: {},
  cancelButtonText: {
    fontWeight: '500',
  },
  saveButton: {},
  saveButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
});

export default AddressCard;