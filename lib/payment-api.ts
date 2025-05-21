import { Platform } from 'react-native';

// Types for payment API
export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'applepay' | 'googlepay';
  last4?: string;
  expiryMonth?: number;
  expiryYear?: number;
  cardholderName?: string;
  billingAddress?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'processing' | 'succeeded' | 'canceled';
  clientSecret: string;
}

// Mock API endpoints for payment processing
// In a real app, these would call your backend which would interact with Stripe, PayPal, etc.

/**
 * Create a payment method token
 * In a real app, this would tokenize card details with Stripe.js or similar
 */
export const createPaymentMethod = async (
  paymentDetails: {
    type: 'card';
    card: {
      number: string;
      expMonth: number;
      expYear: number;
      cvc: string;
      name?: string;
    };
    billingDetails?: {
      name?: string;
      email?: string;
      phone?: string;
      address?: {
        line1: string;
        line2?: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
      };
    };
  }
): Promise<PaymentMethod> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Validate card number using Luhn algorithm
  const cardNumber = paymentDetails.card.number.replace(/\D/g, '');
  if (!isValidCardNumber(cardNumber)) {
    throw new Error('Invalid card number');
  }
  
  // Validate expiry date
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  
  if (
    paymentDetails.card.expYear < currentYear ||
    (paymentDetails.card.expYear === currentYear && paymentDetails.card.expMonth < currentMonth)
  ) {
    throw new Error('Card has expired');
  }
  
  // Determine card type
  let cardType: 'visa' | 'mastercard' | 'amex' | 'discover' = 'visa';
  if (/^4/.test(cardNumber)) cardType = 'visa';
  else if (/^5[1-5]/.test(cardNumber)) cardType = 'mastercard';
  else if (/^3[47]/.test(cardNumber)) cardType = 'amex';
  else if (/^6(?:011|5)/.test(cardNumber)) cardType = 'discover';
  
  // Return tokenized payment method
  return {
    id: `pm_${Date.now()}`,
    type: 'card',
    last4: cardNumber.slice(-4),
    expiryMonth: paymentDetails.card.expMonth,
    expiryYear: paymentDetails.card.expYear,
    cardholderName: paymentDetails.card.name,
  };
};

/**
 * Create a payment intent
 * In a real app, this would create a PaymentIntent with your payment processor
 */
export const createPaymentIntent = async (
  amount: number,
  currency: string = 'usd',
  paymentMethodId?: string,
  metadata?: Record<string, string>
): Promise<PaymentIntent> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    id: `pi_${Date.now()}`,
    amount,
    currency,
    status: paymentMethodId ? 'requires_confirmation' : 'requires_payment_method',
    clientSecret: `pi_${Date.now()}_secret_${Math.random().toString(36).substring(2, 15)}`,
  };
};

/**
 * Confirm a payment intent
 * In a real app, this would confirm a PaymentIntent with your payment processor
 */
export const confirmPaymentIntent = async (
  paymentIntentId: string,
  paymentMethodId: string
): Promise<{ status: string; error?: string }> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Simulate success with 90% probability
  const isSuccess = Math.random() < 0.9;
  
  if (isSuccess) {
    return { status: 'succeeded' };
  } else {
    return { 
      status: 'failed',
      error: 'Your card was declined. Please try a different payment method.'
    };
  }
};

/**
 * Get available payment methods based on platform
 */
export const getAvailablePaymentMethods = (): ('card' | 'paypal' | 'applepay' | 'googlepay')[] => {
  const methods: ('card' | 'paypal' | 'applepay' | 'googlepay')[] = ['card', 'paypal'];
  
  if (Platform.OS === 'ios') {
    methods.push('applepay');
  } else if (Platform.OS === 'android') {
    methods.push('googlepay');
  }
  
  return methods;
};

/**
 * Check if a specific payment method is available on this device
 */
export const isPaymentMethodAvailable = (method: 'card' | 'paypal' | 'applepay' | 'googlepay'): boolean => {
  if (method === 'card' || method === 'paypal') return true;
  if (method === 'applepay') return Platform.OS === 'ios';
  if (method === 'googlepay') return Platform.OS === 'android';
  return false;
};

// Utility function to validate card number using Luhn algorithm
function isValidCardNumber(cardNumber: string): boolean {
  let sum = 0;
  let shouldDouble = false;
  
  // Loop through values starting from the rightmost digit
  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber.charAt(i));
    
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  
  return sum % 10 === 0;
}