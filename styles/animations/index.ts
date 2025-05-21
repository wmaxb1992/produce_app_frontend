import { Animated, Easing } from 'react-native';

export const fadeIn = (animValue: Animated.Value, duration = 300) => {
  return Animated.timing(animValue, {
    toValue: 1,
    duration,
    easing: Easing.ease,
    useNativeDriver: true,
  });
};

export const fadeOut = (animValue: Animated.Value, duration = 300) => {
  return Animated.timing(animValue, {
    toValue: 0,
    duration,
    easing: Easing.ease,
    useNativeDriver: true,
  });
};

export const slideIn = (animValue: Animated.Value, duration = 300) => {
  return Animated.spring(animValue, {
    toValue: 1,
    speed: 2,
    bounciness: 8,
    useNativeDriver: true,
  });
};
