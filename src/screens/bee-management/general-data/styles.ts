import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { fonts, fontSizes } from '@/theme/fonts';
import { metrics } from '@/theme/metrics';
export const useGeneralDataScreenStyles = () => {
  const { colors } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        feedbackContainer: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: metrics.xl,
          minHeight: 300,
        },
        loadingText: {
          marginTop: metrics.md,
          fontSize: fontSizes.lg,
          fontFamily: fonts.Regular,
          color: colors.secondary,
          textAlign: 'center',
        },
        errorText: {
          fontSize: fontSizes.lg,
          fontFamily: fonts.Medium,
          color: colors.error,
          textAlign: 'center',
          marginTop: metrics.lg,
          marginBottom: metrics.lg,
        },
        emptyText: {
          fontSize: fontSizes.lg,
          fontFamily: fonts.Medium,
          color: colors.secondary,
          textAlign: 'center',
          marginTop: metrics.lg,
        },
        emptySubText: {
          fontSize: fontSizes.md,
          fontFamily: fonts.Regular,
          color: colors.secondary,
          textAlign: 'center',
          marginTop: metrics.sm,
        },
        retryButton: {
          marginTop: metrics.xl,
          backgroundColor: colors.honey,
          paddingVertical: metrics.sm,
          paddingHorizontal: metrics.xl,
          borderRadius: metrics.borderRadiusPill,
        },
        retryButtonText: {
          color: colors.white,
          fontFamily: fonts.SemiBold,
          fontSize: fontSizes.md,
        },
      }),
    [colors],
  );
};
