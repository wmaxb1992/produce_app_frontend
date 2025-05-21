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
import { CreditCard, Check } from 'lucide-react-native';

import useThemeStore from '@/store/useThemeStore';
import useUserStore from '@/store/useUserStore';
import Button from '@/components/ui/Button';
import { createPaymentMethod } from '@/lib/payment-api';

export default function AddPaymentMethodScreen() {
  const router = useRouter();
  
  // Get theme values
  const { getThemeValues } = useThemeStore();
  const theme = getThemeValues();
  const { colors } = theme;
  
  // Get user store
  const { user, addPaymentMethod } = useUserStore();
  
  // Form state
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [isDefault, setIsDefault] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };
  
  // Format expiry date (MM/YY)
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (v.length >= 3) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    
    return v;
  };
  
  // Handle card number change
  const handleCardNumberChange = (value: string) => {
    const formatted = formatCardNumber(value);
    setCardNumber(formatted);
  };
  
  // Handle expiry date change
  const handleExpiryDateChange = (value: string) => {
    const formatted = formatExpiryDate(value);
    setExpiryDate(formatted);
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    // Validate form
    if (!cardNumber || cardNumber.replace(/\s+/g, '').length < 16) {
      Alert.alert('Invalid Card Number', 'Please enter a valid card number');
      return;
    }
    
    if (!expiryDate || expiryDate.length < 5) {
      Alert.alert('Invalid Expiry Date', 'Please enter a valid expiry date (MM/YY)');
      return;
    }
    
    if (!cvv || cvv.length < 3) {
      Alert.alert('Invalid CVV', 'Please enter a valid CVV code');
      return;
    }
    
    if (!cardholderName) {
      Alert.alert('Missing Name', 'Please enter the cardholder name');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Parse expiry date
      const [expMonth, expYear] = expiryDate.split('/');
      const expiryMonth = parseInt(expMonth, 10);
      const expiryYear = parseInt(`20${expYear}`, 10);
      
      // Create payment method
      const paymentMethod = await createPaymentMethod({
        type: 'card',
        card: {
          number: cardNumber.replace(/\s+/g, ''),
          expMonth: expiryMonth,
          expYear: expiryYear,
          cvc: cvv,
          name: cardholderName,
        },
      });
      
      // Add payment method to user
      addPaymentMethod({
        id: paymentMethod.id,
        type: determineCardType(cardNumber),
        last4: paymentMethod.last4 || cardNumber.slice(-4),
        expiryMonth: expiryMonth,
        expiryYear: expiryYear,
        default: isDefault,
      });
      
      // Navigate back to checkout
      router.back();
    } catch (error) {
      console.error('Error adding payment method:', error);
      Alert.alert(
        'Error',
        'There was an error adding your payment method. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  // Determine card type based on card number
  const determineCardType = (number: string): 'visa' | 'mastercard' | 'amex' | 'discover' => {
    const cleanNumber = number.replace(/\s+/g, '');
    
    if (/^4/.test(cleanNumber)) return 'visa';
    if (/^5[1-5]/.test(cleanNumber)) return 'mastercard';
    if (/^3[47]/.test(cleanNumber)) return 'amex';
    if (/^6(?:011|5)/.test(cleanNumber)) return 'discover';
    
    return 'visa'; // Default to visa
  };
  
  return (
    <>
      <Stack.Screen options={{ 
        title: 'Add Payment Method',
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
          <View style={styles.cardContainer}>
            <View style={[styles.card, { backgroundColor: colors.primary }]}>
              <View style={styles.cardHeader}>
                <CreditCard size={32} color="#FFFFFF" />
                <Text style={styles.cardType}>
                  {determineCardType(cardNumber).toUpperCase()}
                </Text>
              </View>
              
              <Text style={styles.cardNumber}>
                {cardNumber || '•••• •••• •••• ••••'}
              </Text>
              
              <View style={styles.cardFooter}>
                <View>
                  <Text style={styles.cardLabel}>CARDHOLDER NAME</Text>
                  <Text style={styles.cardValue}>
                    {cardholderName || 'YOUR NAME'}
                  </Text>
                </View>
                
                <View>
                  <Text style={styles.cardLabel}>EXPIRES</Text>
                  <Text style={styles.cardValue}>
                    {expiryDate || 'MM/YY'}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>
                Card Number
              </Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  color: colors.text,
                }]}
                placeholder="1234 5678 9012 3456"
                placeholderTextColor={colors.subtext}
                value={cardNumber}
                onChangeText={handleCardNumberChange}
                keyboardType="number-pad"
                maxLength={19} // 16 digits + 3 spaces
              />
            </View>
            
            <View style={styles.inputRow}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 12 }]}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>
                  Expiry Date
                </Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    color: colors.text,
                  }]}
                  placeholder="MM/YY"
                  placeholderTextColor={colors.subtext}
                  value={expiryDate}
                  onChangeText={handleExpiryDateChange}
                  keyboardType="number-pad"
                  maxLength={5} // MM/YY
                />
              </View>
              
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>
                  CVV
                </Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    color: colors.text,
                  }]}
                  placeholder="123"
                  placeholderTextColor={colors.subtext}
                  value={cvv}
                  onChangeText={setCvv}
                  keyboardType="number-pad"
                  maxLength={4} // 3-4 digits
                  secureTextEntry
                />
              </View>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>
                Cardholder Name
              </Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  color: colors.text,
                }]}
                placeholder="John Doe"
                placeholderTextColor={colors.subtext}
                value={cardholderName}
                onChangeText={setCardholderName}
                autoCapitalize="words"
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
                Set as default payment method
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
              Add Payment Method
            </Button>
            
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
  cardContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  card: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    padding: 24,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardType: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  cardNumber: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '600',
    letterSpacing: 2,
    marginVertical: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 10,
    marginBottom: 4,
  },
  cardValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
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
});