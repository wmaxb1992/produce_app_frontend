import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Sun, Cloud, Leaf, Snowflake } from 'lucide-react-native';
import useThemeStore from '../../store/useThemeStore';
import { ThemeColors } from '../../types';
import colors from '../../constants/colors';

type Season = 'spring' | 'summer' | 'fall' | 'winter' | 'year-round';

interface SeasonalBadgeProps {
  season: Season;
  isInSeason?: boolean;
  showLabel?: boolean;
  size?: 'small' | 'medium' | 'large';
  style?: any;
}

export const SeasonalBadge = ({
  season,
  isInSeason = true,
  showLabel = true,
  size = 'medium',
  style,
}: SeasonalBadgeProps) => {
  const themeStore = useThemeStore();
  
  // Ensure we have a theme, falling back to defaults if not available
  let theme;
  try {
    theme = themeStore?.getThemeValues ? themeStore.getThemeValues() : { colors: colors.light };
  } catch (error) {
    console.warn("Error getting theme values:", error);
    theme = { colors: colors.light };
  }
  
  // Safely get theme colors with fallback
  const themeColors = theme?.colors || colors.light;
  
  // Create styles with safe defaults
  const styles = createStyles(themeColors, size);

  const getSeasonIcon = () => {
    const iconStyle = getIconStyle();
    const iconColor = iconStyle?.color || '#000000';
    const iconSize = styles?.icon?.width || 16;
    
    switch (season) {
      case 'spring':
        return <Leaf size={iconSize} color={iconColor} />;
      case 'summer':
        return <Sun size={iconSize} color={iconColor} />;
      case 'fall':
        return <Leaf size={iconSize} color={iconColor} />;
      case 'winter':
        return <Snowflake size={iconSize} color={iconColor} />;
      case 'year-round':
        return <Cloud size={iconSize} color={iconColor} />;
      default:
        return <Sun size={iconSize} color={iconColor} />;
    }
  };

  const getIconStyle = () => {
    // Make sure themeColors properties exist
    if (!themeColors) return { color: '#000000' };
    
    switch (season) {
      case 'spring':
        return { color: themeColors.success || '#4CAF50' };
      case 'summer':
        return { color: themeColors.warning || '#FFC107' };
      case 'fall':
        return { color: themeColors.secondary || '#795548' };
      case 'winter':
        return { color: themeColors.info || '#2196F3' };
      default:
        return { color: themeColors.text || '#000000' };
    }
  };

  const getSeasonColor = () => {
    // Default gray color if theme is missing
    if (!themeColors || !themeColors.gray) return '#9E9E9E';
    
    if (!isInSeason) return themeColors.gray[400] || '#BDBDBD';
    
    switch (season) {
      case 'spring':
        return themeColors.success || '#4CAF50';
      case 'summer':
        return themeColors.warning || '#FFC107';
      case 'fall':
        return themeColors.secondary || '#795548';
      case 'winter':
        return themeColors.info || '#2196F3';
      default:
        return themeColors.text || '#000000';
    }
  };

  const getSeasonLabel = () => {
    const seasonName = season === 'year-round' ? 'Year-Round' : 
      season.charAt(0).toUpperCase() + season.slice(1);
    
    return isInSeason ? `In Season: ${seasonName}` : `Out of Season: ${seasonName}`;
  };

  // Safely build styles with fallbacks
  const badgeStyle = {
    ...styles.badge,
    backgroundColor: isInSeason 
      ? (getSeasonColor() + '20') 
      : ((themeColors?.gray && themeColors.gray[200]) || '#EEEEEE'),
  };

  return (
    <View style={[badgeStyle, style]}>
      <View style={styles.iconContainer}>{getSeasonIcon()}</View>
      {showLabel && <Text style={[styles.label, { color: getSeasonColor() }]}>{getSeasonLabel()}</Text>}
    </View>
  );
};

interface SeasonalAvailabilityProps {
  seasons: Season[];
  currentSeason: Season;
  style?: any;
}

export const SeasonalAvailability: React.FC<SeasonalAvailabilityProps> = ({ 
  seasons, 
  currentSeason, 
  style 
}) => {
  const themeStore = useThemeStore();
  
  // Ensure we have a theme, falling back to defaults if not available
  let theme;
  try {
    theme = themeStore?.getThemeValues ? themeStore.getThemeValues() : { colors: colors.light };
  } catch (error) {
    console.warn("Error getting theme values:", error);
    theme = { colors: colors.light };
  }
  
  // Safely get theme colors with fallback
  const themeColors = theme?.colors || colors.light;
  
  // Create styles with safe defaults
  const styles = createStyles(themeColors, 'small');

  const allSeasons: Season[] = ['spring', 'summer', 'fall', 'winter'];
  
  // If seasons array is not defined, use empty array
  const validSeasons = Array.isArray(seasons) ? seasons : [];
  
  return (
    <View style={[styles.availabilityContainer, style]}>
      <Text style={[styles.availabilityTitle, { color: themeColors.text || '#000000' }]}>
        Seasonal Availability
      </Text>
      <View style={styles.seasonsRow}>
        {allSeasons.map((season) => {
          const isAvailable = validSeasons.includes(season);
          const isCurrent = season === currentSeason;
          
          return (
            <View 
              key={season} 
              style={[
                styles.seasonItem,
                isAvailable ? styles.seasonAvailable : styles.seasonUnavailable,
                isCurrent ? styles.seasonCurrent : null,
              ]}
            >
              <SeasonalBadge 
                season={season} 
                isInSeason={isAvailable} 
                showLabel={false} 
                size="small" 
              />
              <Text 
                style={[
                  styles.seasonLabel,
                  isAvailable ? styles.seasonLabelAvailable : styles.seasonLabelUnavailable,
                ]}
              >
                {season.charAt(0).toUpperCase() + season.slice(1)}
              </Text>
              {isCurrent && <View style={styles.currentIndicator} />}
            </View>
          );
        })}
      </View>
      {validSeasons.includes('year-round') && (
        <View style={styles.yearRoundBadge}>
          <SeasonalBadge season="year-round" size="small" />
        </View>
      )}
    </View>
  );
};

const createStyles = (theme: any, size: 'small' | 'medium' | 'large') => {
  // Ensure we have valid theme object with colors
  const safeTheme = theme || { colors: colors.light };
  const safeColors = safeTheme.colors || colors.light;
  
  // Get safe color values
  const textColor = safeColors.text || '#000000';
  const primaryColor = safeColors.primary || '#4CAF50';
  const successColor = safeColors.success || '#4CAF50';
  const grayColors = safeColors.gray || {
    200: '#EEEEEE',
    500: '#9E9E9E'
  };
  
  const sizeMap = {
    small: {
      badge: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 4,
      },
      icon: {
        width: 14,
        height: 14,
      },
      label: {
        fontSize: 12,
        marginLeft: 4,
      },
    },
    medium: {
      badge: {
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 6,
      },
      icon: {
        width: 16,
        height: 16,
      },
      label: {
        fontSize: 14,
        marginLeft: 6,
      },
    },
    large: {
      badge: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
      },
      icon: {
        width: 20,
        height: 20,
      },
      label: {
        fontSize: 16,
        marginLeft: 8,
      },
    },
  };

  return StyleSheet.create({
    badge: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      ...sizeMap[size].badge,
    },
    iconContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    icon: {
      ...sizeMap[size].icon,
    },
    label: {
      fontWeight: '500',
      ...sizeMap[size].label,
    },
    availabilityContainer: {
      marginVertical: 12,
    },
    availabilityTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: textColor,
      marginBottom: 12,
    },
    seasonsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    seasonItem: {
      alignItems: 'center',
      padding: 8,
      borderRadius: 8,
      flex: 1,
      marginHorizontal: 4,
      position: 'relative',
    },
    seasonAvailable: {
      backgroundColor: successColor + '10',
    },
    seasonUnavailable: {
      backgroundColor: grayColors[200],
    },
    seasonCurrent: {
      borderWidth: 1,
      borderColor: primaryColor,
    },
    seasonLabel: {
      marginTop: 4,
      fontSize: 12,
      fontWeight: '500',
    },
    seasonLabelAvailable: {
      color: textColor,
    },
    seasonLabelUnavailable: {
      color: grayColors[500],
    },
    currentIndicator: {
      position: 'absolute',
      top: 0,
      right: 0,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: primaryColor,
    },
    yearRoundBadge: {
      marginTop: 12,
      alignSelf: 'center',
    },
  });
};

export default SeasonalBadge;