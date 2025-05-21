import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Heart } from 'lucide-react-native';
import { useTheme } from '@/store/useThemeStore';

interface LikeButtonProps {
  isLiked: boolean;
  count: number;
  onLike: () => void;
  size?: 'small' | 'medium' | 'large';
  showCount?: boolean;
  style?: any;
}

export const LikeButton = ({
  isLiked,
  count,
  onLike,
  size = 'medium',
  showCount = true,
  style,
}: LikeButtonProps) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const sizeMap = {
    small: { icon: 16, container: styles.containerSmall, text: styles.textSmall },
    medium: { icon: 20, container: styles.containerMedium, text: styles.textMedium },
    large: { icon: 24, container: styles.containerLarge, text: styles.textLarge },
  };

  const handlePress = () => {
    // Animate heart when liked
    if (!isLiked) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.3,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
    
    onLike();
  };

  return (
    <TouchableOpacity
      style={[sizeMap[size].container, style]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Heart
          size={sizeMap[size].icon}
          color={isLiked ? theme.colors.error : theme.colors.gray[500]}
          fill={isLiked ? theme.colors.error : 'none'}
        />
      </Animated.View>
      
      {showCount && count > 0 && (
        <Text
          style={[
            sizeMap[size].text,
            isLiked && styles.likedText,
          ]}
        >
          {count}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export const LikeButtonWithLabel = ({
  isLiked,
  count,
  onLike,
  style,
}: {
  isLiked: boolean;
  count: number;
  onLike: () => void;
  style?: any;
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  
  return (
    <TouchableOpacity
      style={[styles.buttonWithLabel, style]}
      onPress={onLike}
      activeOpacity={0.7}
    >
      <Heart
        size={20}
        color={isLiked ? theme.colors.error : theme.colors.gray[500]}
        fill={isLiked ? theme.colors.error : 'none'}
      />
      <Text
        style={[
          styles.labelText,
          isLiked && styles.likedText,
        ]}
      >
        {isLiked ? 'Liked' : 'Like'} {count > 0 ? `(${count})` : ''}
      </Text>
    </TouchableOpacity>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    containerSmall: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 4,
      paddingHorizontal: 8,
    },
    containerMedium: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 6,
      paddingHorizontal: 10,
    },
    containerLarge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
      paddingHorizontal: 12,
    },
    textSmall: {
      fontSize: 12,
      color: theme.colors.gray[500],
      marginLeft: 4,
    },
    textMedium: {
      fontSize: 14,
      color: theme.colors.gray[500],
      marginLeft: 6,
    },
    textLarge: {
      fontSize: 16,
      color: theme.colors.gray[500],
      marginLeft: 8,
    },
    likedText: {
      color: theme.colors.error,
    },
    buttonWithLabel: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 20,
      backgroundColor: theme.colors.gray[200],
    },
    labelText: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.gray[700],
      marginLeft: 6,
    },
  });

export default LikeButton;