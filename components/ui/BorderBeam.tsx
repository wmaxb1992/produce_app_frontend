import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, ViewStyle } from 'react-native';

interface BorderBeamProps {
  duration?: number;
  delay?: number;
  width?: number;
  height?: number;
  color?: string;
  style?: ViewStyle;
  thickness?: number;
  opacity?: number;
  borderRadius?: number;
}

export const BorderBeam = ({
  duration = 6,
  delay = 0,
  width = 300,
  height = 130,
  color = '#FF4500',
  style,
  thickness = 2,
  opacity = 0.7,
  borderRadius = 12
}: BorderBeamProps) => {
  const animation = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // Only start animation after the specified delay
    const delayTimer = setTimeout(() => {
      // Create infinite animation
      Animated.loop(
        Animated.timing(animation, {
          toValue: 1,
          duration: duration * 1000,
          useNativeDriver: false, // We need to animate non-transform properties
        })
      ).start();
    }, delay * 1000);
    
    return () => clearTimeout(delayTimer);
  }, []);

  // Path animation: Moving a point around the border
  const pathLength = 2 * (width + height); // Perimeter of the rectangle
  const animatedValue = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, pathLength]
  });

  // Calculate position based on the animated path value
  const getPositionOnPath = (pathPosition: Animated.AnimatedInterpolation<number>) => {
    return {
      top: pathPosition.interpolate({
        inputRange: [
          0,                    // Top-left corner
          width,                // Top-right corner
          width + height,       // Bottom-right corner
          2 * width + height,   // Bottom-left corner
          pathLength            // Back to top-left
        ],
        outputRange: [
          0,                    // At top when starting at top-left
          0,                    // Still at top at top-right
          height,               // At bottom at bottom-right
          height,               // Still at bottom at bottom-left
          0                     // Back to top
        ]
      }),
      left: pathPosition.interpolate({
        inputRange: [
          0,                    // Top-left corner
          width,                // Top-right corner
          width + height,       // Bottom-right corner
          2 * width + height,   // Bottom-left corner
          pathLength            // Back to top-left
        ],
        outputRange: [
          0,                    // At left when starting at top-left
          width,                // At right at top-right
          width,                // Still at right at bottom-right
          0,                    // Back to left at bottom-left
          0                     // Still at left
        ]
      })
    };
  };

  const positionStyle = getPositionOnPath(animatedValue);
  
  return (
    <View style={[styles.container, style]}>
      {/* Static border to define the shape */}
      <View style={[
        styles.staticBorder,
        {
          width,
          height,
          borderRadius,
          borderWidth: thickness,
          borderColor: color,
          opacity: opacity * 0.3,
        }
      ]} />
      
      {/* Animated dot that travels along the border */}
      <Animated.View
        style={[
          styles.dot,
          {
            width: thickness * 4,
            height: thickness * 4,
            borderRadius: thickness * 4,
            backgroundColor: color,
            opacity: opacity * 1.5,
            shadowColor: color,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 1,
            shadowRadius: 8,
            top: positionStyle.top,
            left: positionStyle.left,
          }
        ]}
      />
      
      {/* Glow effect trail following the dot */}
      <Animated.View
        style={[
          styles.trail,
          {
            top: positionStyle.top,
            left: positionStyle.left,
            width: thickness * 12,
            height: thickness * 12,
            borderRadius: thickness * 12,
            backgroundColor: color,
            opacity: opacity * 0.2,
            shadowColor: color,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.8,
            shadowRadius: 16,
          }
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'visible',
  },
  staticBorder: {
    position: 'absolute',
  },
  dot: {
    position: 'absolute',
    zIndex: 10,
  },
  trail: {
    position: 'absolute',
    zIndex: 9,
  }
});

export default BorderBeam; 