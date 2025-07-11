import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { fonts, fontSizes } from '@/theme/fonts';
import { metrics } from '@/theme/metrics';
export const useQRScannerScreenStyles = () => {
  const { colors } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: 'black',
        },
        camera: {
          ...StyleSheet.absoluteFillObject,
        },
        feedbackContainer: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: metrics.xl,
          backgroundColor: colors.background,
        },
        feedbackText: {
          fontFamily: fonts.Regular,
          fontSize: fontSizes.lg,
          color: colors.textSecondary,
          textAlign: 'center',
          marginTop: metrics.lg,
        },
        rescanButtonContainer: {
          position: 'absolute',
          bottom: 50,
          alignSelf: 'center',
        },
        rescanButton: {
          backgroundColor: colors.honey,
          paddingVertical: metrics.md,
          paddingHorizontal: metrics.xl,
          borderRadius: metrics.borderRadiusPill,
        },
        rescanButtonText: {
          color: colors.white,
          fontFamily: fonts.SemiBold,
          fontSize: fontSizes.md,
        },
      }),
    [colors],
  );
};
