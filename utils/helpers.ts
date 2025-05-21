import { Dimensions, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Get the screen dimensions
 * @returns Object with width and height
 */
export const getScreenDimensions = () => {
  return Dimensions.get('window');
};

/**
 * Check if the device is a tablet based on screen size
 * @returns Boolean indicating if device is a tablet
 */
export const isTablet = (): boolean => {
  const { width, height } = Dimensions.get('window');
  const screenSize = Math.sqrt(width * width + height * height);
  return screenSize >= 1000; // Approximate diagonal size in points for tablet
};

/**
 * Check if the app is running on iOS
 * @returns Boolean indicating if platform is iOS
 */
export const isIOS = (): boolean => {
  return Platform.OS === 'ios';
};

/**
 * Check if the app is running on Android
 * @returns Boolean indicating if platform is Android
 */
export const isAndroid = (): boolean => {
  return Platform.OS === 'android';
};

/**
 * Check if the app is running on web
 * @returns Boolean indicating if platform is web
 */
export const isWeb = (): boolean => {
  return Platform.OS === 'web';
};

/**
 * Generate a random ID
 * @param length Length of the ID (default: 10)
 * @returns Random ID string
 */
export const generateId = (length = 10): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Debounce a function call
 * @param func Function to debounce
 * @param wait Wait time in milliseconds
 * @returns Debounced function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;
  
  return function(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle a function call
 * @param func Function to throttle
 * @param limit Limit time in milliseconds
 * @returns Throttled function
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean = false;
  
  return function(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

/**
 * Store data in AsyncStorage
 * @param key Storage key
 * @param value Value to store
 * @returns Promise that resolves when storage is complete
 */
export const storeData = async (key: string, value: any): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.error('Error storing data:', e);
  }
};

/**
 * Retrieve data from AsyncStorage
 * @param key Storage key
 * @returns Promise that resolves with the stored value
 */
export const getData = async <T>(key: string): Promise<T | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Error retrieving data:', e);
    return null;
  }
};

/**
 * Remove data from AsyncStorage
 * @param key Storage key
 * @returns Promise that resolves when removal is complete
 */
export const removeData = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.error('Error removing data:', e);
  }
};

/**
 * Group an array of objects by a key
 * @param array Array to group
 * @param key Key to group by
 * @returns Object with groups
 */
export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
};

/**
 * Deep clone an object
 * @param obj Object to clone
 * @returns Cloned object
 */
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Calculate distance between two coordinates in kilometers
 * @param lat1 Latitude of first point
 * @param lon1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lon2 Longitude of second point
 * @returns Distance in kilometers
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
};

/**
 * Convert degrees to radians
 * @param deg Degrees
 * @returns Radians
 */
const deg2rad = (deg: number): number => {
  return deg * (Math.PI / 180);
};