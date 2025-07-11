import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { fonts, fontSizes } from '@/theme/fonts';
import { metrics } from '@/theme/metrics';

export const useMapScreenStyles = () => {
  const { colors } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: colors.background,
        },
        map: {
          ...StyleSheet.absoluteFillObject,
          backgroundColor: colors.background,
        },
        feedbackContainer: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: metrics.xl,
          backgroundColor: colors.background,
        },
        feedbackText: {
          marginTop: metrics.md,
          fontSize: fontSizes.md,
          color: colors.textSecondary,
          fontFamily: fonts.Regular,
          textAlign: 'center',
        },
        permissionButton: {
          backgroundColor: colors.honey,
          paddingVertical: metrics.md,
          paddingHorizontal: metrics.xl,
          borderRadius: metrics.borderRadiusPill,
          marginTop: metrics.xl,
        },
        permissionButtonText: {
          color: colors.white,
          fontFamily: fonts.SemiBold,
          fontSize: fontSizes.md,
        },
        actionButton: {
          position: 'absolute',
          bottom: metrics.xl,
          right: metrics.lg,
          width: 56,
          height: 56,
          borderRadius: 28,
          justifyContent: 'center',
          alignItems: 'center',
          elevation: 6,
          shadowColor: colors.black,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 3,
        },
      }),
    [colors],
  );
};
