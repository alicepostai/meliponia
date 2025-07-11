import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { fonts, fontSizes } from '@/theme/fonts';
import { metrics } from '@/theme/metrics';
export const useAuthHeaderStyles = () => {
  const { colors } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        headerContainer: {
          alignItems: 'center',
          marginTop: metrics['3xl'],
          marginBottom: metrics.xl,
        },
        logo: {
          width: 150,
          height: 150,
          marginBottom: metrics.lg,
        },
        title: {
          fontSize: fontSizes['3xl'],
          color: colors.primary,
          fontFamily: fonts.SemiBold,
          textAlign: 'center',
        },
        subtitle: {
          fontSize: fontSizes.lg,
          color: colors.primary,
          fontFamily: fonts.Regular,
          marginTop: metrics.sm,
          textAlign: 'center',
          paddingHorizontal: metrics.xl,
        },
      }),
    [colors],
  );
};
