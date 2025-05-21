import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Star } from 'lucide-react-native';
import { useTheme } from '@/store/useThemeStore';

interface RatingProps {
  value: number;
  maxValue?: number;
  size?: number;
  readonly?: boolean;
  showValue?: boolean;
  onChange?: (value: number) => void;
  style?: any;
}

export const Rating = ({
  value,
  maxValue = 5,
  size = 20,
  readonly = false,
  showValue = false,
  onChange,
  style,
}: RatingProps) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handlePress = (newValue: number) => {
    if (!readonly && onChange) {
      onChange(newValue);
    }
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.starsContainer}>
        {Array.from({ length: maxValue }).map((_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= value;
          const isHalfFilled = !isFilled && starValue <= value + 0.5;

          return (
            <TouchableOpacity
              key={index}
              onPress={() => handlePress(starValue)}
              disabled={readonly}
              style={styles.starButton}
            >
              <Star
                size={size}
                color={isFilled ? theme.colors.warning : theme.colors.gray[300]}
                fill={isFilled ? theme.colors.warning : 'none'}
              />
            </TouchableOpacity>
          );
        })}
      </View>
      {showValue && (
        <Text style={styles.ratingValue}>
          {value.toFixed(1)}
        </Text>
      )}
    </View>
  );
};

export const RatingWithCount = ({
  value,
  count,
  size = 16,
  style,
}: {
  value: number;
  count: number;
  size?: number;
  style?: any;
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={[styles.ratingWithCount, style]}>
      <Rating value={value} size={size} readonly showValue={false} />
      <Text style={styles.ratingCount}>({count})</Text>
    </View>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    starsContainer: {
      flexDirection: 'row',
    },
    starButton: {
      padding: 2,
    },
    ratingValue: {
      marginLeft: 8,
      fontSize: 16,
      fontWeight: '500',
      color: theme.colors.text,
    },
    ratingWithCount: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    ratingCount: {
      marginLeft: 4,
      fontSize: 14,
      color: theme.colors.gray[500],
    },
  });

export default Rating;