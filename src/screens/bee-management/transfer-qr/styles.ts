import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { fonts, fontSizes } from '@/theme/fonts';
import { metrics } from '@/theme/metrics';
export const useTransferQRScreenStyles = () => {
  const { colors } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          paddingHorizontal: metrics.lg,
          paddingVertical: metrics.md,
        },
        header: {
          alignItems: 'center',
          marginBottom: metrics.xl,
        },
        title: {
          fontSize: fontSizes['2xl'],
          fontFamily: fonts.Bold,
          color: colors.text,
          textAlign: 'center',
          marginTop: metrics.md,
          marginBottom: metrics.xs,
        },
        subtitle: {
          fontSize: fontSizes.md,
          fontFamily: fonts.Regular,
          color: colors.textSecondary,
          textAlign: 'center',
        },
        hiveInfo: {
          backgroundColor: colors.cardBackground,
          borderRadius: metrics.borderRadiusMedium,
          padding: metrics.lg,
          alignItems: 'center',
          marginBottom: metrics.xl,
        },
        hiveCode: {
          fontSize: fontSizes.xl,
          fontFamily: fonts.Bold,
          color: colors.text,
          marginBottom: metrics.xs,
        },
        species: {
          fontSize: fontSizes.lg,
          fontFamily: fonts.Medium,
          color: colors.textSecondary,
          marginBottom: metrics.xs,
        },
        transferType: {
          fontSize: fontSizes.md,
          fontFamily: fonts.Regular,
          color: colors.honey,
        },
        qrContainer: {
          alignItems: 'center',
          marginBottom: metrics.xl,
        },
        qrWrapper: {
          backgroundColor: 'white',
          padding: metrics.lg,
          borderRadius: metrics.borderRadiusMedium,
          elevation: 4,
          shadowColor: colors.black,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 4,
        },
        qrBackground: {
          backgroundColor: 'white',
          padding: metrics.md,
          borderRadius: metrics.borderRadiusSmall,
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 240,
          minWidth: 240,
        },
        qrPlaceholder: {
          alignItems: 'center',
          justifyContent: 'center',
          width: 200,
          height: 200,
        },
        instructions: {
          backgroundColor: colors.cardBackground,
          borderRadius: metrics.borderRadiusMedium,
          padding: metrics.lg,
          marginBottom: metrics.md,
        },
        instructionTitle: {
          fontSize: fontSizes.lg,
          fontFamily: fonts.SemiBold,
          color: colors.text,
          marginBottom: metrics.md,
        },
        instructionText: {
          fontSize: fontSizes.md,
          fontFamily: fonts.Regular,
          color: colors.textSecondary,
          marginBottom: metrics.xs,
          lineHeight: 20,
        },
        warning: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.cardBackground,
          borderRadius: metrics.borderRadiusSmall,
          padding: metrics.md,
          marginBottom: metrics.xl,
        },
        warningText: {
          fontSize: fontSizes.sm,
          fontFamily: fonts.Medium,
          color: colors.textSecondary,
          marginLeft: metrics.xs,
        },
        actions: {
          gap: metrics.md,
        },
        shareButton: {
          backgroundColor: colors.primary,
        },
      }),
    [colors],
  );
};
