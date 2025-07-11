import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { fonts, fontSizes } from '@/theme/fonts';
import { metrics } from '@/theme/metrics';
export const useQRCodesScreenStyles = () => {
  const { colors } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        feedbackContainer: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: metrics.xl,
        },
        feedbackText: {
          fontSize: fontSizes.lg,
          fontFamily: fonts.Medium,
          color: colors.textSecondary,
          textAlign: 'center',
          marginTop: metrics.md,
        },
        errorText: {
          color: colors.error,
        },
        retryButton: {
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: metrics.xl,
          backgroundColor: colors.primary,
          paddingVertical: metrics.sm,
          paddingHorizontal: metrics.md,
          borderRadius: metrics.borderRadiusSmall,
        },
        retryButtonText: {
          color: colors.white,
          fontFamily: fonts.Medium,
          fontSize: fontSizes.sm,
          marginLeft: metrics.xs,
        },
        listContentContainer: {
          paddingHorizontal: metrics.lg,
          paddingVertical: metrics.xl,
          flexGrow: 1,
        },
      }),
    [colors],
  );
};
export const useQRCodeItemStyles = () => {
  const { colors } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        hiveItemContainer: {
          backgroundColor: colors.cardBackground,
          borderRadius: metrics.borderRadiusMedium,
          padding: metrics.xl,
          marginBottom: metrics.lg,
          elevation: 3,
          shadowColor: colors.black,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.12,
          shadowRadius: 4,
          borderWidth: 1,
          borderColor: colors.honeyLight + '20',
        },
        qrCodeContainer: {
          width: 120,
          height: 120,
          justifyContent: 'center',
          alignItems: 'center',
          padding: metrics.sm,
          backgroundColor: colors.white,
          borderRadius: metrics.borderRadiusMedium,
          marginBottom: metrics.lg,
          alignSelf: 'center',
          elevation: 1,
          shadowColor: colors.black,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.08,
          shadowRadius: 2,
        },
        qrPlaceholder: {
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.lightGray,
          borderRadius: metrics.borderRadiusSmall,
        },
        qrPlaceholderText: {
          marginTop: metrics.xs,
          fontSize: fontSizes.xs,
          color: colors.textSecondary,
          fontFamily: fonts.Medium,
        },
        snapshotView: {
          backgroundColor: 'white',
          alignSelf: 'center',
        },
        hiveInfoContainer: {
          alignItems: 'center',
          paddingHorizontal: metrics.md,
        },
        hiveCodeText: {
          fontSize: fontSizes['2xl'],
          fontFamily: fonts.Bold,
          color: colors.text,
          marginBottom: metrics.xs,
          textAlign: 'center',
        },
        speciesText: {
          fontSize: fontSizes.md,
          fontFamily: fonts.Regular,
          color: colors.textSecondary,
          marginBottom: metrics.xl,
          textAlign: 'center',
          lineHeight: 20,
        },
        buttonsRow: {
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: metrics.md,
          width: '100%',
        },
        actionButton: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: metrics.md,
          paddingHorizontal: metrics.lg,
          borderRadius: metrics.borderRadiusPill,
          flex: 1,
          justifyContent: 'center',
          elevation: 2,
          shadowColor: colors.black,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
        },
        printButton: {
          marginLeft: 0,
        },
        actionButtonText: {
          color: colors.white,
          fontFamily: fonts.SemiBold,
          fontSize: fontSizes.sm,
          marginLeft: metrics.xs,
        },
      }),
    [colors],
  );
};
