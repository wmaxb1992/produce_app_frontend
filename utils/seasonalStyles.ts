import { Platform } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

/**
 * Gets seasonal styles for various UI elements based on current theme and season
 * @returns Object with seasonal style utilities
 */
export const useSeasonalStyles = () => {
  const { colors, theme, season, isUsingSeasonalTheme } = useTheme();

  /**
   * Gets seasonal border color with correct opacity
   * @param opacity Optional opacity (0-1)
   * @returns Border color with seasonal accent
   */
  const getBorderColor = (opacity = 1) => {
    if (!isUsingSeasonalTheme || !colors) {
      return colors?.border || '#E0E0E0';
    }
    
    // For very light opacity borders, mix with the border color
    if (opacity < 0.3) {
      return colors.seasonal + Math.round(opacity * 100).toString(16).padStart(2, '0');
    }
    
    return colors.seasonal;
  };

  /**
   * Gets seasonal shadow style
   * @param size 'sm' | 'md' | 'lg'
   * @returns Shadow style object
   */
  const getShadow = (size: 'sm' | 'md' | 'lg' = 'md') => {
    if (!isUsingSeasonalTheme || !colors) {
      // Return default shadow
      return Platform.select({
        ios: {
          shadowColor: theme === 'dark' ? '#000' : '#000',
          shadowOffset: { width: 0, height: size === 'sm' ? 2 : size === 'md' ? 4 : 6 },
          shadowOpacity: size === 'sm' ? 0.1 : size === 'md' ? 0.15 : 0.2,
          shadowRadius: size === 'sm' ? 2 : size === 'md' ? 4 : 8,
        },
        android: {
          elevation: size === 'sm' ? 2 : size === 'md' ? 4 : 8,
        },
        default: {}
      });
    }
    
    // Get a shadow color based on the seasonal color
    const shadowColor = colors.seasonal;
    
    return Platform.select({
      ios: {
        shadowColor: shadowColor,
        shadowOffset: { width: 0, height: size === 'sm' ? 2 : size === 'md' ? 4 : 6 },
        shadowOpacity: size === 'sm' ? 0.15 : size === 'md' ? 0.2 : 0.25,
        shadowRadius: size === 'sm' ? 2 : size === 'md' ? 4 : 8,
      },
      android: {
        elevation: size === 'sm' ? 2 : size === 'md' ? 4 : 8,
      },
      default: {}
    });
  };

  /**
   * Gets seasonal background color for cards, buttons, etc.
   * @param opacity Optional opacity (0-1)
   * @returns Background color with seasonal accent
   */
  const getBackgroundColor = (opacity = 0.1) => {
    if (!isUsingSeasonalTheme || !colors) {
      return colors?.card || '#FFFFFF';
    }
    
    // Blend the seasonal color with background at specified opacity
    return colors.seasonal + Math.round(opacity * 100).toString(16).padStart(2, '0');
  };

  /**
   * Gets seasonal text color that complements the current theme
   * @param variant 'primary' | 'secondary' | 'accent'
   * @returns Text color with seasonal accent
   */
  const getTextColor = (variant: 'primary' | 'secondary' | 'accent' = 'primary') => {
    if (!isUsingSeasonalTheme || !colors) {
      return variant === 'primary' ? colors?.text : 
             variant === 'secondary' ? colors?.subtext : 
             colors?.primary;
    }
    
    // Return different seasonal text colors based on variant
    switch (variant) {
      case 'primary':
        return colors.text; // Keep primary text the same for readability
      case 'secondary':
        return colors.subtext; // Keep secondary text the same for readability
      case 'accent':
        return colors.seasonal; // Use seasonal color for accent text
    }
  };

  /**
   * Gets styles for a card with seasonal accents
   * @param variant 'subtle' | 'bordered' | 'filled'
   * @returns Style object for the card
   */
  const getCardStyle = (variant: 'subtle' | 'bordered' | 'filled' = 'subtle') => {
    if (!isUsingSeasonalTheme || !colors) {
      return {
        backgroundColor: colors?.card || '#FFFFFF',
        borderColor: colors?.border || '#E0E0E0',
        borderWidth: variant === 'bordered' ? 1 : 0,
        ...getShadow('md')
      };
    }
    
    switch (variant) {
      case 'subtle':
        return {
          backgroundColor: colors.card,
          borderColor: getBorderColor(0.3),
          borderWidth: 1,
          ...getShadow('md')
        };
      case 'bordered':
        return {
          backgroundColor: colors.card,
          borderColor: getBorderColor(0.8),
          borderWidth: 2,
          ...getShadow('sm')
        };
      case 'filled':
        return {
          backgroundColor: getBackgroundColor(0.15),
          borderColor: getBorderColor(0.3),
          borderWidth: 1,
          ...getShadow('sm')
        };
    }
  };

  /**
   * Gets styles for buttons with seasonal accents
   * @param variant 'primary' | 'secondary' | 'outline'
   * @returns Style object for the button
   */
  const getButtonStyle = (variant: 'primary' | 'secondary' | 'outline' = 'primary') => {
    if (!isUsingSeasonalTheme || !colors) {
      return {
        backgroundColor: variant === 'primary' ? colors?.primary : 
                          variant === 'secondary' ? colors?.secondary : 'transparent',
        borderColor: variant === 'outline' ? colors?.primary : 'transparent',
        borderWidth: variant === 'outline' ? 1 : 0,
      };
    }
    
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: colors.seasonal,
          borderColor: 'transparent',
          borderWidth: 0,
        };
      case 'secondary':
        return {
          backgroundColor: getBackgroundColor(0.2),
          borderColor: 'transparent',
          borderWidth: 0,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: colors.seasonal,
          borderWidth: 1,
        };
    }
  };

  /**
   * Gets a seasonal page background color with the right opacity
   * @returns Background style object suitable for page backgrounds
   */
  const getPageBackground = () => {
    if (!isUsingSeasonalTheme || !colors) {
      return { backgroundColor: colors?.background || '#FFFFFF' };
    }
    
    // Very subtle seasonal tint for the page background
    return { backgroundColor: getBackgroundColor(0.05) };
  };

  return {
    getBorderColor,
    getShadow,
    getBackgroundColor,
    getTextColor,
    getCardStyle,
    getButtonStyle,
    getPageBackground,
    // Export the current season so components can check if products are in season
    currentSeason: season,
    // If we're not using seasonal theme, return null to fall back to default styling
    isSeasonalActive: isUsingSeasonalTheme
  };
}; 