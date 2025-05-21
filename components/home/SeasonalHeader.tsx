import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Leaf, Sun, Flame, Snowflake } from 'lucide-react-native';

const SeasonalHeader: React.FC = () => {
  const { colors, season, isUsingSeasonalTheme } = useTheme();
  
  // Only render if seasonal theme is enabled and colors are available
  if (!isUsingSeasonalTheme || !colors) return null;
  
  const getSeasonIcon = () => {
    switch (season) {
      case 'spring':
        return <Leaf size={24} color="#fff" />;
      case 'summer':
        return <Sun size={24} color="#fff" />;
      case 'fall':
        return <Flame size={24} color="#fff" />;
      case 'winter':
        return <Snowflake size={24} color="#fff" />;
      default:
        return <Leaf size={24} color="#fff" />;
    }
  };
  
  const getSeasonMessage = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const seasonName = season.charAt(0).toUpperCase() + season.slice(1);
    
    const messages = {
      spring: `Spring ${year} – Fresh and vibrant produce is here!`,
      summer: `Summer ${year} – Peak season for local fruits and vegetables!`,
      fall: `Fall ${year} – Enjoy the harvest of autumn flavors!`,
      winter: `Winter ${year} – Seasonal roots and hearty greens available now!`
    };
    
    return messages[season] || `${seasonName} ${year}`;
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.seasonal || colors.primary }]}>
      <View style={styles.iconContainer}>
        {getSeasonIcon()}
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.seasonText}>
          {getSeasonMessage()}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderRadius: 0,
  },
  iconContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  seasonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  }
});

export default SeasonalHeader; 