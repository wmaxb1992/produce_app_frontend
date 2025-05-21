import { Platform } from 'react-native';

/**
 * Format a date to a readable string
 * @param date Date to format
 * @param options Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export const formatDate = (date: Date | string, options?: Intl.DateTimeFormatOptions): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Default options
  const defaultOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: undefined,
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  
  try {
    // Use Intl.DateTimeFormat if available (most platforms)
    return new Intl.DateTimeFormat('en-US', mergedOptions).format(dateObj);
  } catch (error) {
    // Fallback for platforms without full Intl support
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    const day = dateObj.getDate();
    const month = months[dateObj.getMonth()];
    const weekday = days[dateObj.getDay()];
    const year = dateObj.getFullYear();
    
    let formatted = '';
    
    if (mergedOptions.weekday) {
      formatted += `${weekday}, `;
    }
    
    formatted += `${month} ${day}`;
    
    if (mergedOptions.year) {
      formatted += `, ${year}`;
    }
    
    return formatted;
  }
};

/**
 * Format a currency value
 * @param amount Amount to format
 * @param currency Currency code (default: USD)
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  if (amount === undefined || amount === null) return '';
  
  try {
    // Use Intl.NumberFormat if available
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    // Fallback for platforms without full Intl support
    const symbol = currency === 'USD' ? '$' : currency;
    return `${symbol}${amount.toFixed(2)}`;
  }
};

/**
 * Format a number with commas
 * @param num Number to format
 * @returns Formatted number string
 */
export const formatNumber = (num: number): string => {
  if (num === undefined || num === null) return '';
  
  try {
    return new Intl.NumberFormat('en-US').format(num);
  } catch (error) {
    // Fallback
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
};

/**
 * Format a phone number to (XXX) XXX-XXXX
 * @param phone Phone number to format
 * @returns Formatted phone number
 */
export const formatPhoneNumber = (phone: string): string => {
  if (!phone) return '';
  
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format as (XXX) XXX-XXXX
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
  }
  
  // Return original if not 10 digits
  return phone;
};

/**
 * Format a time string (HH:MM) to 12-hour format
 * @param time Time string in 24-hour format (HH:MM)
 * @returns Formatted time string in 12-hour format
 */
export const formatTime = (time: string): string => {
  if (!time) return '';
  
  const [hours, minutes] = time.split(':').map(Number);
  
  if (isNaN(hours) || isNaN(minutes)) {
    return time;
  }
  
  const period = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  
  return `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`;
};

/**
 * Format a distance in miles
 * @param distance Distance in miles
 * @returns Formatted distance string
 */
export const formatDistance = (distance: number): string => {
  if (distance === undefined || distance === null) return '';
  
  if (distance < 0.1) {
    return 'Nearby';
  }
  
  if (distance < 1) {
    return `${(distance * 10).toFixed(0) / 10} mi`;
  }
  
  return `${distance.toFixed(1)} mi`;
};

/**
 * Format a relative time (e.g., "2 hours ago")
 * @param date Date to format
 * @returns Formatted relative time string
 */
export const formatRelativeTime = (date: Date | string): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  
  const diffMs = now.getTime() - dateObj.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffMonth / 12);
  
  if (diffSec < 60) {
    return 'Just now';
  }
  
  if (diffMin < 60) {
    return `${diffMin} ${diffMin === 1 ? 'minute' : 'minutes'} ago`;
  }
  
  if (diffHour < 24) {
    return `${diffHour} ${diffHour === 1 ? 'hour' : 'hours'} ago`;
  }
  
  if (diffDay < 30) {
    return `${diffDay} ${diffDay === 1 ? 'day' : 'days'} ago`;
  }
  
  if (diffMonth < 12) {
    return `${diffMonth} ${diffMonth === 1 ? 'month' : 'months'} ago`;
  }
  
  return `${diffYear} ${diffYear === 1 ? 'year' : 'years'} ago`;
};