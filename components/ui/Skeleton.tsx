import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, ViewStyle, DimensionValue, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import useThemeStore from '@/store/useThemeStore';
import defaultColors from '@/constants/colors';

interface SkeletonProps {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  style?: ViewStyle;
}

export const Skeleton = ({ 
  width = '100%', 
  height = 20, 
  borderRadius = 4,
  style 
}: SkeletonProps) => {
  const { theme, themeType: isDark } = useThemeStore();
  const themeColors = theme?.colors || defaultColors.light;
  const styles = createStyles(themeColors);
  
  // Log when Skeleton is rendered
  useEffect(() => {
    console.log('Skeleton rendered with props:', { width, height, borderRadius });
  }, []);
  
  const translateX = useRef(new Animated.Value(-300)).current;
  
  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(translateX, {
        toValue: 300,
        duration: 1500,
        useNativeDriver: true,
      })
    );
    
    animation.start();
    
    return () => {
      animation.stop();
    };
  }, [translateX]);
  
  const baseColor = isDark === 'dark' ? themeColors.gray[800] : themeColors.gray[200];
  const highlightColor = isDark === 'dark' ? themeColors.gray[700] : themeColors.gray[100];
  
  return (
    <View 
      style={[
        styles.container, 
        { width, height, borderRadius },
        style
      ]}
    >
      <Animated.View
        style={[
          styles.shimmer,
          {
            transform: [{ translateX }]
          }
        ]}
      >
        <LinearGradient
          colors={[baseColor, highlightColor, baseColor]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        />
      </Animated.View>
    </View>
  );
};

export const ProductCardSkeleton = () => {
  const { theme } = useThemeStore();
  const themeColors = theme?.colors || defaultColors.light;
  const styles = createStyles(themeColors);
  
  return (
    <View style={styles.productCard}>
      <Skeleton height={160} borderRadius={8} />
      <View style={styles.productContent}>
        <Skeleton width="70%" height={18} style={styles.mb8} />
        <Skeleton width="40%" height={16} style={styles.mb8} />
        <Skeleton width="60%" height={16} style={styles.mb8} />
        <Skeleton width="30%" height={20} />
      </View>
    </View>
  );
};

export const FarmCardSkeleton = () => {
  const { theme } = useThemeStore();
  const themeColors = theme?.colors || defaultColors.light;
  const styles = createStyles(themeColors);
  
  return (
    <View style={styles.farmCard}>
      <Skeleton height={120} borderRadius={8} />
      <View style={styles.farmContent}>
        <Skeleton width="80%" height={18} style={styles.mb8} />
        <Skeleton width="60%" height={16} style={styles.mb8} />
        <Skeleton width="90%" height={14} />
      </View>
    </View>
  );
};

export const CategoryCardSkeleton = () => {
  const { theme } = useThemeStore();
  const themeColors = theme?.colors || defaultColors.light;
  const styles = createStyles(themeColors);
  
  return (
    <View style={styles.categoryCard}>
      <Skeleton height={80} width={80} borderRadius={12} />
      <View style={styles.categoryLabel}>
        <Skeleton width={60} height={16} />
      </View>
    </View>
  );
};

export const BannerSkeleton = () => {
  const { theme } = useThemeStore();
  const themeColors = theme?.colors || defaultColors.light;
  const styles = createStyles(themeColors);
  
  return (
    <View style={styles.banner}>
      <Skeleton height={160} width="100%" borderRadius={8} />
    </View>
  );
};

export const AddressBarSkeleton = () => {
  const { theme } = useThemeStore();
  const themeColors = theme?.colors || defaultColors.light;
  const styles = createStyles(themeColors);
  
  return (
    <View style={styles.addressBar}>
      <Skeleton height={40} width="100%" borderRadius={6} />
    </View>
  );
};

export const SearchBarSkeleton = () => {
  const { theme } = useThemeStore();
  const themeColors = theme?.colors || defaultColors.light;
  const styles = createStyles(themeColors);
  
  return (
    <View style={styles.searchBar}>
      <Skeleton height={46} width="100%" borderRadius={8} />
    </View>
  );
};

const createStyles = (themeColors: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: themeColors.gray[200],
      overflow: 'hidden',
    },
    shimmer: {
      width: '100%',
      height: '100%',
    },
    gradient: {
      flex: 1,
    },
    productCard: {
      width: 200,
      borderRadius: 8,
      backgroundColor: themeColors.card,
      overflow: 'hidden',
      marginBottom: 16,
    },
    productContent: {
      padding: 12,
    },
    farmCard: {
      width: 200,
      borderRadius: 8,
      backgroundColor: themeColors.card,
      overflow: 'hidden',
      marginBottom: 16,
    },
    farmContent: {
      padding: 12,
    },
    mb8: {
      marginBottom: 8,
    },
    categoryCard: {
      marginRight: 12,
      alignItems: 'center',
    },
    categoryLabel: {
      marginTop: 8,
      alignItems: 'center',
    },
    banner: {
      marginHorizontal: 16,
      marginBottom: 16,
      borderRadius: 8,
      overflow: 'hidden',
    },
    addressBar: {
      marginHorizontal: 16,
      marginBottom: 8,
    },
    searchBar: {
      marginHorizontal: 16,
      marginBottom: 8,
    },
  });

export default Skeleton;