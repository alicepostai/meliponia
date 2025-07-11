import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { fonts, fontSizes } from '@/theme/fonts';
import { metrics } from '@/theme/metrics';
export const useHiveScreenStyles = () => {
  const { colors } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: colors.background,
        },
        centeredMessage: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: metrics.xl,
        },
        loadingText: {
          marginTop: metrics.md,
          fontSize: fontSizes.md,
          fontFamily: fonts.Regular,
          color: colors.textSecondary,
        },
        errorText: {
          fontSize: fontSizes.lg,
          fontFamily: fonts.Medium,
          color: colors.error,
          textAlign: 'center',
          marginBottom: metrics.md,
        },
        headerMenuButton: {
          paddingHorizontal: metrics.md,
          paddingVertical: metrics.sm,
        },
        retryButton: {
          marginTop: metrics.lg,
          paddingVertical: metrics.sm,
          paddingHorizontal: metrics.xl,
          borderRadius: metrics.borderRadiusPill,
        },
        retryButtonText: {
          fontFamily: fonts.SemiBold,
          fontSize: fontSizes.md,
        },
        timelineTitle: {
          fontSize: fontSizes.xl,
          fontFamily: fonts.SemiBold,
          color: colors.text,
          marginTop: metrics.xl,
          marginBottom: metrics.sm,
          paddingHorizontal: metrics.lg,
        },
      }),
    [colors],
  );
};
