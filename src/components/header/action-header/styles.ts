import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { fonts, fontSizes, lineHeights } from '@/theme/fonts';
import { metrics } from '@/theme/metrics';
export const useActionHeaderStyles = () => {
  const { colors } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        headerContainer: {
          alignItems: 'center',
          marginVertical: metrics.lg,
          paddingHorizontal: metrics.lg,
          paddingVertical: metrics.md,
          backgroundColor: colors.honeySubtle,
          borderRadius: metrics.borderRadiusMedium,
          marginHorizontal: metrics.sm,
          borderWidth: 1,
          borderColor: colors.honey + '25',
          shadowColor: colors.honey,
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.08,
          shadowRadius: 6,
          elevation: 2,
        },
        icon: {
          marginBottom: metrics.sm,
        },
        titleText: {
          fontSize: fontSizes['2xl'],
          color: colors.honey,
          fontFamily: fonts.SemiBold,
          textAlign: 'center',
          marginBottom: metrics.xs,
        },
        subtitleText: {
          fontSize: fontSizes.md,
          color: colors.secondary,
          fontFamily: fonts.Regular,
          textAlign: 'center',
          marginTop: metrics.xs,
          lineHeight: fontSizes.md * lineHeights.normal,
        },
      }),
    [colors],
  );
};
