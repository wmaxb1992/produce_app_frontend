import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Sun, Moon, Leaf, Umbrella, Snowflake, Flame } from 'lucide-react-native';

const ThemeControls: React.FC = () => {
  const { 
    colors, 
    theme, 
    season, 
    toggleTheme, 
    setSeason, 
    isUsingSeasonalTheme, 
    toggleSeasonalTheme 
  } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Theme</Text>
        <TouchableOpacity 
          style={[styles.themeButton, { backgroundColor: colors.background }]} 
          onPress={toggleTheme}
        >
          {theme === 'light' ? (
            <Sun size={20} color={colors.text} />
          ) : (
            <Moon size={20} color={colors.text} />
          )}
          <Text style={[styles.buttonText, { color: colors.text }]}>
            {theme === 'light' ? 'Light' : 'Dark'}
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Seasonal Accent</Text>
          <Switch
            value={isUsingSeasonalTheme}
            onValueChange={toggleSeasonalTheme}
            trackColor={{ false: colors.gray[300], true: colors.primary }}
            thumbColor={colors.white}
          />
        </View>
        
        {/* Show all seasonal colors for preview */}
        <View style={styles.colorPreviewRow}>
          <View style={[styles.colorSwatch, { backgroundColor: colors.spring }]}>
            <Text style={styles.swatchLabel}>Spring</Text>
          </View>
          <View style={[styles.colorSwatch, { backgroundColor: colors.summer }]}>
            <Text style={styles.swatchLabel}>Summer</Text>
          </View>
          <View style={[styles.colorSwatch, { backgroundColor: colors.fall }]}>
            <Text style={styles.swatchLabel}>Fall</Text>
          </View>
          <View style={[styles.colorSwatch, { backgroundColor: colors.winter }]}>
            <Text style={styles.swatchLabel}>Winter</Text>
          </View>
        </View>
        
        {isUsingSeasonalTheme && (
          <View style={styles.seasonsRow}>
            <TouchableOpacity 
              style={[
                styles.seasonButton, 
                { 
                  backgroundColor: colors.background,
                  borderColor: season === 'spring' ? colors.spring : colors.border,
                  borderWidth: season === 'spring' ? 3 : 2,
                }
              ]} 
              onPress={() => setSeason('spring')}
            >
              <Leaf size={20} color={colors.spring} />
              <Text style={[styles.buttonText, { color: colors.text }]}>Spring</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.seasonButton, 
                { 
                  backgroundColor: colors.background,
                  borderColor: season === 'summer' ? colors.summer : colors.border,
                  borderWidth: season === 'summer' ? 3 : 2,
                }
              ]} 
              onPress={() => setSeason('summer')}
            >
              <Sun size={20} color={colors.summer} />
              <Text style={[styles.buttonText, { color: colors.text }]}>Summer</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.seasonButton, 
                { 
                  backgroundColor: colors.background,
                  borderColor: season === 'fall' ? colors.fall : colors.border,
                  borderWidth: season === 'fall' ? 3 : 2,
                }
              ]} 
              onPress={() => setSeason('fall')}
            >
              <Flame size={20} color={colors.fall} />
              <Text style={[styles.buttonText, { color: colors.text }]}>Fall</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.seasonButton, 
                { 
                  backgroundColor: colors.background,
                  borderColor: season === 'winter' ? colors.winter : colors.border,
                  borderWidth: season === 'winter' ? 3 : 2,
                }
              ]} 
              onPress={() => setSeason('winter')}
            >
              <Snowflake size={20} color={colors.winter} />
              <Text style={[styles.buttonText, { color: colors.text }]}>Winter</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      {isUsingSeasonalTheme && (
        <View style={[styles.currentSeasonContainer, { borderColor: colors.border }]}>
          <Text style={[styles.currentSeasonTitle, { color: colors.text }]}>
            Current Season: {season.charAt(0).toUpperCase() + season.slice(1)}
          </Text>
          <View style={[styles.seasonalColorPreview, { backgroundColor: colors.seasonal }]}>
            <Text style={styles.previewText}>
              Seasonal Accent Color
            </Text>
          </View>
          
          {/* Example UI elements using seasonal color */}
          <View style={styles.exampleRow}>
            <TouchableOpacity 
              style={[styles.exampleButton, { backgroundColor: colors.seasonal }]}
            >
              <Text style={styles.exampleButtonText}>Button</Text>
            </TouchableOpacity>
            
            <View style={[styles.exampleBadge, { borderColor: colors.seasonal }]}>
              <Text style={[styles.exampleBadgeText, { color: colors.seasonal }]}>Badge</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  themeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  colorPreviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  colorSwatch: {
    width: 70,
    height: 30,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  swatchLabel: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  seasonsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  seasonButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    width: '48%',
  },
  currentSeasonContainer: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
  },
  currentSeasonTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  seasonalColorPreview: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  previewText: {
    color: 'white',
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  exampleRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 8,
  },
  exampleButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  exampleButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  exampleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  exampleBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default ThemeControls; 