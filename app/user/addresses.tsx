import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { MapPin, Plus, Edit2, Trash2 } from 'lucide-react-native';

import useThemeStore from '@/store/useThemeStore';
import useUserStore from '@/store/useUserStore';
import Button from '@/components/ui/Button';
import { Address } from '@/types';

export default function AddressesScreen() {
  const router = useRouter();
  
  // Get theme values
  const { getThemeValues } = useThemeStore();
  const theme = getThemeValues();
  const { colors } = theme;
  
  // Get user data
  const { user, removeAddress, setDefaultAddress } = useUserStore();
  
  // State
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load addresses
  useEffect(() => {
    const loadAddresses = async () => {
      try {
        // In a real app, you might fetch addresses from an API
        // For now, we'll use the addresses from the user store
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
        
        if (user && user.addresses) {
          setAddresses(user.addresses);
        }
      } catch (error) {
        console.error('Error loading addresses:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAddresses();
  }, [user]);
  
  // Handle add address
  const handleAddAddress = () => {
    router.push('/user/add-address');
  };
  
  // Handle edit address
  const handleEditAddress = (address: Address) => {
    router.push({
      pathname: '/user/edit-address',
      params: { id: address.id }
    });
  };
  
  // Handle delete address
  const handleDeleteAddress = (address: Address) => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            removeAddress(address.id);
            setAddresses(addresses.filter(a => a.id !== address.id));
          },
        },
      ]
    );
  };
  
  // Handle set as default
  const handleSetDefault = (address: Address) => {
    setDefaultAddress(address.id);
    setAddresses(
      addresses.map(a => ({
        ...a,
        default: a.id === address.id,
      }))
    );
  };
  
  return (
    <>
      <Stack.Screen options={{ 
        title: 'My Addresses',
      }} />
      
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.subtext }]}>
              Loading your addresses...
            </Text>
          </View>
        ) : (
          <>
            <ScrollView 
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {addresses.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <MapPin size={64} color={colors.gray[300]} />
                  <Text style={[styles.emptyTitle, { color: colors.text }]}>
                    No addresses saved
                  </Text>
                  <Text style={[styles.emptySubtitle, { color: colors.subtext }]}>
                    Add a delivery address to get started
                  </Text>
                </View>
              ) : (
                addresses.map((address) => (
                  <View 
                    key={address.id} 
                    style={[
                      styles.addressCard, 
                      { 
                        backgroundColor: colors.card,
                        borderColor: address.default ? colors.primary : colors.border,
                      }
                    ]}
                  >
                    <View style={styles.addressHeader}>
                      <View style={styles.addressTitleContainer}>
                        <MapPin size={18} color={colors.primary} />
                        <Text style={[styles.addressTitle, { color: colors.text }]}>
                          {address.street}
                        </Text>
                      </View>
                      
                      {address.default && (
                        <View style={[styles.defaultBadge, { backgroundColor: `${colors.primary}20` }]}>
                          <Text style={[styles.defaultText, { color: colors.primary }]}>
                            Default
                          </Text>
                        </View>
                      )}
                    </View>
                    
                    <Text style={[styles.addressDetails, { color: colors.text }]}>
                      {address.city}, {address.state} {address.zip}
                    </Text>
                    
                    {address.instructions && (
                      <Text style={[styles.addressInstructions, { color: colors.subtext }]}>
                        Note: {address.instructions}
                      </Text>
                    )}
                    
                    <View style={styles.addressActions}>
                      {!address.default && (
                        <TouchableOpacity 
                          style={[styles.setDefaultButton, { borderColor: colors.primary }]}
                          onPress={() => handleSetDefault(address)}
                        >
                          <Text style={[styles.setDefaultText, { color: colors.primary }]}>
                            Set as Default
                          </Text>
                        </TouchableOpacity>
                      )}
                      
                      <View style={styles.actionButtons}>
                        <TouchableOpacity 
                          style={[styles.actionButton, { backgroundColor: `${colors.primary}15` }]}
                          onPress={() => handleEditAddress(address)}
                        >
                          <Edit2 size={16} color={colors.primary} />
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                          style={[styles.actionButton, { backgroundColor: `${colors.error}15` }]}
                          onPress={() => handleDeleteAddress(address)}
                        >
                          <Trash2 size={16} color={colors.error} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))
              )}
            </ScrollView>
            
            <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
              <Button
                variant="primary"
                onPress={handleAddAddress}
                style={styles.addButton}
              >
                <Plus size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.addButtonText}>Add New Address</Text>
              </Button>
            </View>
          </>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100, // Extra padding for footer
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
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
  addressCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
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
  addressDetails: {
    fontSize: 14,
    marginBottom: 8,
  },
  addressInstructions: {
    fontSize: 14,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  addressActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  setDefaultButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
  },
  setDefaultText: {
    fontSize: 12,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
  },
  addButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});