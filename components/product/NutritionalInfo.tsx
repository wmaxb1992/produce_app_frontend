import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronDown, ChevronUp, Info } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

interface NutrientInfo {
  name: string;
  amount: string;
  dailyValue?: string;
}

interface NutritionalInfoProps {
  servingSize: string;
  calories: number;
  nutrients: {
    macros: NutrientInfo[];
    vitamins: NutrientInfo[];
    minerals: NutrientInfo[];
  };
  style?: any;
}

export const NutritionalInfo = ({
  servingSize,
  calories,
  nutrients,
  style,
}: NutritionalInfoProps) => {
  const { colors, theme } = useTheme();
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={[styles.container, style, { backgroundColor: colors.card }]}>
      <TouchableOpacity 
        style={styles.header} 
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
      >
        <View style={styles.headerLeft}>
          <Info size={20} color={colors.primary} style={styles.icon} />
          <Text style={[styles.title, { color: colors.text }]}>Nutritional Information</Text>
        </View>
        {expanded ? (
          <ChevronUp size={20} color={colors.text} />
        ) : (
          <ChevronDown size={20} color={colors.text} />
        )}
      </TouchableOpacity>

      {expanded && (
        <View style={styles.content}>
          <View style={styles.servingInfo}>
            <Text style={[styles.servingText, { color: colors.text }]}>Serving Size: {servingSize}</Text>
            <Text style={[styles.caloriesText, { color: colors.text }]}>{calories} Calories</Text>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.gray[200] }]} />

          <Text style={[styles.sectionTitle, { color: colors.text }]}>Macronutrients</Text>
          {nutrients.macros.map((nutrient, index) => (
            <View key={index} style={styles.nutrientRow}>
              <Text style={[styles.nutrientName, { color: colors.text }]}>{nutrient.name}</Text>
              <View style={styles.nutrientValues}>
                <Text style={[styles.nutrientAmount, { color: colors.text }]}>{nutrient.amount}</Text>
                {nutrient.dailyValue && (
                  <Text style={[styles.dailyValue, { color: colors.gray[500] }]}>{nutrient.dailyValue}%</Text>
                )}
              </View>
            </View>
          ))}

          <View style={[styles.divider, { backgroundColor: colors.gray[200] }]} />

          <Text style={[styles.sectionTitle, { color: colors.text }]}>Vitamins</Text>
          {nutrients.vitamins.map((nutrient, index) => (
            <View key={index} style={styles.nutrientRow}>
              <Text style={[styles.nutrientName, { color: colors.text }]}>{nutrient.name}</Text>
              <View style={styles.nutrientValues}>
                <Text style={[styles.nutrientAmount, { color: colors.text }]}>{nutrient.amount}</Text>
                {nutrient.dailyValue && (
                  <Text style={[styles.dailyValue, { color: colors.gray[500] }]}>{nutrient.dailyValue}%</Text>
                )}
              </View>
            </View>
          ))}

          <View style={[styles.divider, { backgroundColor: colors.gray[200] }]} />

          <Text style={[styles.sectionTitle, { color: colors.text }]}>Minerals</Text>
          {nutrients.minerals.map((nutrient, index) => (
            <View key={index} style={styles.nutrientRow}>
              <Text style={[styles.nutrientName, { color: colors.text }]}>{nutrient.name}</Text>
              <View style={styles.nutrientValues}>
                <Text style={[styles.nutrientAmount, { color: colors.text }]}>{nutrient.amount}</Text>
                {nutrient.dailyValue && (
                  <Text style={[styles.dailyValue, { color: colors.gray[500] }]}>{nutrient.dailyValue}%</Text>
                )}
              </View>
            </View>
          ))}

          <Text style={[styles.disclaimer, { color: colors.gray[500] }]}>
            * Percent Daily Values are based on a 2,000 calorie diet. Your daily values may be higher or lower depending on your calorie needs.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    padding: 16,
    paddingTop: 0,
  },
  servingInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  servingText: {
    fontSize: 14,
  },
  caloriesText: {
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  nutrientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  nutrientName: {
    fontSize: 14,
  },
  nutrientValues: {
    flexDirection: 'row',
  },
  nutrientAmount: {
    fontSize: 14,
    marginRight: 8,
  },
  dailyValue: {
    fontSize: 14,
  },
  disclaimer: {
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 16,
  },
});

export default NutritionalInfo;