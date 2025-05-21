import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Variety, EnhancedVariety } from '@/types';
import { useTheme } from '@/hooks/useTheme';
import VarietyChip from './VarietyChip';

interface VarietyGridProps {
  varieties: (Variety | EnhancedVariety)[];
  title?: string;
  numColumns?: number;
  onVarietyPress?: (variety: Variety | EnhancedVariety) => void;
}

const { width } = Dimensions.get('window');

const VarietyGrid: React.FC<VarietyGridProps> = ({ 
  varieties, 
  title,
  numColumns = 2,
  onVarietyPress 
}) => {
  const router = useRouter();
  const { colors, isUsingSeasonalTheme, season } = useTheme();
  
  const handleVarietyPress = (variety: Variety | EnhancedVariety) => {
    if (onVarietyPress) {
      onVarietyPress(variety);
    } else {
      router.push(`/variety/${variety.id}`);
    }
  };

  // Calculate item width based on screen width and number of columns
  const itemWidth = (width - 40 - (numColumns - 1) * 12) / numColumns;
  
  const renderVarietyItem = ({ item }: { item: Variety | EnhancedVariety }) => {
    // Check if this variety is in season (if it's an EnhancedVariety with seasonality)
    const enhancedItem = item as EnhancedVariety;
    const isInSeason = enhancedItem.seasonality ? enhancedItem.seasonality.includes(season) : false;
    
    return (
      <TouchableOpacity
        key={item.id}
        style={[
          styles.itemContainer,
          { 
            width: itemWidth,
            marginBottom: 12,
            backgroundColor: isUsingSeasonalTheme && isInSeason 
              ? `${colors.seasonal}10` // 10% opacity of seasonal color 
              : colors.card
          }
        ]}
        onPress={() => handleVarietyPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.emojiContainer}>
          <Text style={styles.emoji}>{item.emoji}</Text>
        </View>
        
        <Text 
          style={[
            styles.varietyName, 
            { 
              color: isUsingSeasonalTheme && isInSeason ? colors.seasonal : colors.text,
              fontWeight: isInSeason ? '700' : '600'
            }
          ]}
          numberOfLines={1}
        >
          {item.name}
        </Text>
        
        <Text style={[styles.description, { color: colors.subtext }]} numberOfLines={2}>
          {item.description}
        </Text>
        
        {/* Show taste profile if available */}
        {enhancedItem.tasteProfile && (
          <View style={styles.tasteContainer}>
            {Object.entries(enhancedItem.tasteProfile).slice(0, 2).map(([key, value]) => (
              <View key={key} style={styles.tasteChip}>
                <Text style={[styles.tasteLabel, { color: colors.text }]}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </Text>
                <View style={styles.dots}>
                  {[1, 2, 3, 4, 5].map((dot) => (
                    <View 
                      key={dot} 
                      style={[
                        styles.dot, 
                        { 
                          backgroundColor: dot <= value 
                            ? isUsingSeasonalTheme && isInSeason 
                              ? colors.seasonal 
                              : getAttributeColor(key, colors)
                            : colors.gray[200] 
                        }
                      ]} 
                    />
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}
        
        {/* Show seasonal badge if this variety is currently in season */}
        {isInSeason && (
          <View style={styles.seasonBadge}>
            <Text style={[styles.seasonText, { color: colors.white }]}>In Season</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };
  
  return (
    <View style={styles.container}>
      {title && (
        <Text style={[styles.title, { color: colors.text }]}>
          {title}
        </Text>
      )}
      
      {/* Using regular View with mapping instead of FlatList for better compatibility with SectionList */}
      <View style={styles.gridContainer}>
        {varieties.map((item) => renderVarietyItem({ item }))}
      </View>
    </View>
  );
};

// Helper function to get colors for taste attributes
const getAttributeColor = (attribute: string, colors: any) => {
  switch (attribute.toLowerCase()) {
    case 'sweetness':
      return colors.success;
    case 'tartness':
      return colors.warning;
    case 'crispness':
      return colors.info;
    case 'juiciness':
      return colors.secondary;
    default:
      return colors.primary;
  }
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  itemContainer: {
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 3,
    position: 'relative',
    overflow: 'hidden',
  },
  emojiContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(240, 240, 240, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  emoji: {
    fontSize: 22,
  },
  varietyName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 8,
  },
  tasteContainer: {
    marginTop: 4,
  },
  tasteChip: {
    marginBottom: 6,
  },
  tasteLabel: {
    fontSize: 10,
    marginBottom: 2,
  },
  dots: {
    flexDirection: 'row',
    gap: 3,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  seasonBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: 'rgba(80, 150, 80, 0.8)',
  },
  seasonText: {
    fontSize: 10,
    fontWeight: '600',
  }
});

export default VarietyGrid; 