import { Dimensions, Platform } from 'react-native';

export const isIos = Platform.OS === "ios";

export const width = Dimensions.get('screen').width;

export const height = Dimensions.get('screen').height;

export const drobeAccent = '#8C64ff';

export const successColor = '#23D160';

export const dangerColor = '#FF3860';

export const grey = '#f3f3f5'

export const iconSize = 35;

export const animationScale = 1;