import { Animated, Easing } from 'react-native';
import { animationDuration, animationEasing } from './constants';

export const startAnimation = (animation: Animated.Value, value: any, callback?: () => void) =>
    Animated.timing(animation, { toValue: value, duration: animationDuration, easing: animationEasing, useNativeDriver: true }).start(callback);