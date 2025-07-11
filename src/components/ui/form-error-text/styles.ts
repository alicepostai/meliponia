import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { fonts, fontSizes } from '@/theme/fonts';
import { metrics } from '@/theme/metrics';
export const useFormErrorTextStyles = () => {
  const { colors } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        errorText: {
          color: colors.error,
          fontSize: fontSizes.sm,
          fontFamily: fonts.Regular,
          marginTop: metrics.xs,
          marginBottom: metrics.sm,
          marginLeft: metrics.xl,
          alignSelf: 'flex-start',
        },
      }),
    [colors],
  );
};
