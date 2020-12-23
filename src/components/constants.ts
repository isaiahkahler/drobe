import { Platform, Dimensions, Easing } from 'react-native';

// ---------- UI ----------

// basics

export const isIos = Platform.OS === 'ios';

export const width = Dimensions.get('screen').width;

export const height = Dimensions.get('screen').height;

// colors

export const accentColor = '#8c64ff';

export const successColor = '#23D160';

export const dangerColor = '#FF3860';

export const grey = '#f3f3f5';

// icons

export const iconSize = 35;

// animations

export const animationDuration = 250;

export const animationEasing = Easing.ease;