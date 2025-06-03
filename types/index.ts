// Theme Types
export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  card: string;
  text: string;
  subtext: string;
  border: string;
  success: string;
  error: string;
  warning: string;
  info: string;
  white: string;
  black: string;
  gray: {
    [key: string]: string;
  };
  seasonal?: string; // New seasonal accent color
  spring: string;
  summer: string;
  fall: string;
  winter: string;
}

export interface Theme {
  colors: ThemeColors;
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  fontSizes: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
    xxxl: number;
  };
  fontWeights: {
    regular: string;
    medium: string;
    semibold: string;
    bold: string;
  };
  borderRadius: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    round: number;
  };
  shadows: any;
  themeType: 'light' | 'dark';
  season?: 'spring' | 'summer' | 'fall' | 'winter';
}

// Product Types
export interface Variety {
  id: string;
  name: string;
  subcategoryId: string;
  emoji: string;
  description: string;
  cardImage: string;
}

/**
 * Enhanced variety type with rich nutritional and taste profile information
 */
export interface EnhancedVariety extends Variety {
  longDescription?: string;
  origin?: string;
  history?: string;
  seasonality?: string[];
  nutritionalInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fiber: number;
    sugar: number;
    fat: number;
    vitamins: { name: string; percentage: number }[];
    minerals: { name: string; percentage: number }[];
  };
  tasteProfile?: {
    sweetness: number; // 1-5 scale
    tartness: number;
    crispness: number;
    juiciness: number;
  };
  culinaryUses?: string[];
  storageInfo?: string;
  images?: {
    hero: string;
    detail: string[];
    growing?: string;
  };
  // The most common substitutes for this variety
  substitutes?: string[];
}

export interface Subcategory {
  id: string;
  categoryId: string;
  name: string;
  image: string;
  varieties: Variety[];
}

export interface Category {
  id: string;
  name: string;
  image: string;
  subcategories: Subcategory[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  subcategory?: string;
  variety?: string;
  farmId: string;
  farmName: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  availableForInstantDelivery?: boolean;
  isOrganic?: boolean;
  unit: string;
  weight?: number;
  freshness?: number;
  harvestDate?: string;
  estimatedHarvestDate?: string;
  preHarvest: boolean;
  inSeason: boolean;
  organic: boolean;
  seasons?: ('spring' | 'summer' | 'fall' | 'winter' | 'year-round')[];
}

/**
 * Represents a relationship between a farm and a product/variety
 * This allows multiple farms to offer the same product variety
 */
export interface FarmProduct {
  id: string;
  farmId: string;
  productId: string;
  varietyId: string;
  price: number;
  organic: boolean;
  available: boolean;
  stock: number;
  harvestDate?: string;
  estimatedHarvestDate?: string;
  freshness?: number;
  distance?: number; // Distance from user's location
  deliveryDays?: string[]; // Days farm delivers this product
  deliveryFee?: number;
  deliveryMinimum?: number;
  discount?: number; // Any special discount on this product
}

// Farm Types
export interface Farm {
  id: string;
  name: string;
  description: string;
  logo: string;
  coverImage: string;
  location: {
    address: string;
    city: string;
    state: string;
    zip: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  deliveryZones: DeliveryZone[];
  rating: number;
  reviewCount: number;
  followers: number;
  certifications: string[];
  specialties: string[];
  foundedYear: number;
  contactInfo: {
    phone: string;
    email: string;
    website: string;
  };
  socialMedia: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
}

export interface DeliveryZone {
  id: string;
  name: string;
  deliveryDays: string[];
  deliveryFee: number;
  minimumOrder: number;
  estimatedDeliveryTime: string;
  areas: string[];
}

// Social Types
export interface FarmPost {
  id: string;
  farmId: string;
  farmName: string;
  farmLogo: string;
  content: string;
  images: string[];
  createdAt: string;
  likes: number;
  comments: number;
  tags: string[];
  products?: string[];
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
  likes: number;
}

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  addresses?: Address[];
  paymentMethods?: PaymentMethod[];
  preferences?: {
    favoriteProducts?: string[];
    favoriteStores?: string[];
    dietaryRestrictions?: string[];
    allergies?: string[];
  };
}

export interface Address {
  id: string;
  userId?: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  default: boolean;
  instructions?: string;
}

export interface PaymentMethod {
  id: string;
  type: 'visa' | 'card' | 'paypal' | 'applepay' | 'googlepay';
  name?: string;
  last4?: string;
  expiryMonth?: number;
  expiryYear?: number;
  expiryDate?: string;
  default: boolean;
}

// Cart Types
export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  farmId: string;
  farmName: string;
  unit: string;
  type?: 'product' | 'subscription'; // Type of item
  metadata?: {
    frequency?: 'weekly' | 'monthly';
    deliveryDay?: string;
    bundleId?: string;
    [key: string]: any; // Allow for other metadata
  };
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
}

export interface CartGroup {
  name: string;
  items: CartItem[];
  farms: Record<string, { name: string; items: CartItem[] }>;
}

// Order Types
export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  deliveryAddress: Address;
  paymentMethod: PaymentMethod;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  estimatedDelivery?: string;
  trackingNumber?: string;
}

// Subscription Types
export interface SubscriptionBundle {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  weeklyPrice: number;
  monthlyPrice: number;
  discountPercentage: number; // How much is saved compared to buying items individually
  items: {
    vegetables: number;
    fruits: number;
    herbs: number;
  };
  products: string[]; // IDs of products included in the bundle
  farmId?: string; // Optional: if from a specific farm
  farmName?: string; // Optional: if from a specific farm
}