import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');
export const metrics = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  borderRadiusSmall: 4,
  borderRadiusMedium: 8,
  borderRadiusLarge: 16,
  borderRadiusRound: 50,
  borderRadiusPill: 100,
  iconSizeSmall: 16,
  iconSizeMedium: 24,
  iconSizeLarge: 32,
  inputHeight: 50,
  buttonHeight: 50,
  headerHeight: 56,
  screenWidth: width < height ? width : height,
  screenHeight: width < height ? height : width,
  borderWidth: 1,
};
