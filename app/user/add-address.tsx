import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { MapPin, Check } from 'lucide-react-native';

import useThemeStore from '@/store/useThemeStore';
import useUserStore from '@/store/useUserStore';
import Button from '@/components/ui/Button';

export default function AddAddressScreen() {
  const router = useRouter();
  
  // Get theme values
  const { getThemeValues } = useThemeStore();
  const theme = getThemeValues();
  const { colors } = theme;
  
  // Get user store
  const { addAddress } = useUserStore();
  
  // Form state
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [instructions, setInstructions] = useState('');
  const [isDefault, setIsDefault] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  // Handle form submission
  const handleSubmit = async () => {
    // Validate form
    if (!street) {
      Alert.alert('Missing Street', 'Please enter a street address');
      return;
    }
    
    if (!city) {
      Alert.alert('Missing City', 'Please enter a city');
      return;
    }
    
    if (!state) {
      Alert.alert('Missing State', 'Please enter a state');
      return;
    }
    
    if (!zip) {
      Alert.alert('Missing ZIP Code', 'Please enter a ZIP code');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Add address to user
      addAddress({
        id: `addr-${Date.now()}`,
        userId: 'user1', // This would come from the authenticated user
        street,
        city,
        state,
        zip,
        instructions,
        default: isDefault,
      });
      
      // Navigate back to checkout
      router.back();
    } catch (error) {
      console.error('Error adding address:', error);
      Alert.alert(
        'Error',
        'There was an error adding your address. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <>
      <Stack.Screen options={{ 
        title: 'Add Address',
        headerBackTitle: 'Back'
      }} />
      
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView 
          style={[styles.container, { backgroundColor: colors.background }]}
          contentContainerStyle={styles.contentContainer}
        >
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>
                Street Address
              </Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  color: colors.text,
                }]}
                placeholder="123 Main St"
                placeholderTextColor={colors.subtext}
                value={street}
                onChangeText={setStreet}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>
                City
              </Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  color: colors.text,
                }]}
                placeholder="San Francisco"
                placeholderTextColor={colors.subtext}
                value={city}
                onChangeText={setCity}
              />
            </View>
            
            <View style={styles.inputRow}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 12 }]}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>
                  State
                </Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    color: colors.text,
                  }]}
                  placeholder="CA"
                  placeholderTextColor={colors.subtext}
                  value={state}
                  onChangeText={setState}
                  maxLength={2}
                  autoCapitalize="characters"
                />
              </View>
              
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>
                  ZIP Code
                </Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    color: colors.text,
                  }]}
                  placeholder="94107"
                  placeholderTextColor={colors.subtext}
                  value={zip}
                  onChangeText={setZip}
                  keyboardType="number-pad"
                  maxLength={5}
                />
              </View>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>
                Delivery Instructions (Optional)
              </Text>
              <TextInput
                style={[styles.textArea, { 
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  color: colors.text,
                }]}
                placeholder="E.g., Leave at the front door, gate code, etc."
                placeholderTextColor={colors.subtext}
                value={instructions}
                onChangeText={setInstructions}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
            
            <TouchableOpacity 
              style={styles.checkboxContainer}
              onPress={() => setIsDefault(!isDefault)}
            >
              <View style={[
                styles.checkbox, 
                { borderColor: colors.primary },
                isDefault && { backgroundColor: colors.primary }
              ]}>
                {isDefault && <Check size={16} color="#FFFFFF" />}
              </View>
              <Text style={[styles.checkboxLabel, { color: colors.text }]}>
                Set as default address
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.buttonContainer}>
            <Button
              variant="primary"
              onPress={handleSubmit}
              isLoading={isLoading}
              style={styles.submitButton}
            >
              Add Address
            </Button>
            
            {/* Quick fill button for LA address */}
            <TouchableOpacity
              style={[styles.quickFillButton, { backgroundColor: colors.gray[200] }]}
              onPress={() => {
                setStreet('109 S Flores St');
                setCity('Los Angeles');
                setState('CA');
                setZip('90048');
              }}
            >
              <Text style={[styles.quickFillText, { color: colors.text }]}>
                Fill with LA Address
              </Text>
            </TouchableOpacity>
            
            <Button
              variant="outline"
              onPress={() => router.back()}
              style={styles.cancelButton}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  formContainer: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingTop: 12,
    fontSize: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderRadius: 4,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxLabel: {
    fontSize: 16,
  },
  buttonContainer: {
    marginBottom: 24,
  },
  submitButton: {
    marginBottom: 12,
  },
  cancelButton: {},
  quickFillButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  quickFillText: {
    fontSize: 14,
    fontWeight: '500',
  },
});