import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { fonts, fontSizes, lineHeights } from '@/theme/fonts';
import { metrics } from '@/theme/metrics';
export const useHiveDetailInfoStyles = () => {
  const { colors } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        detailsContainer: {
          padding: metrics.lg,
          backgroundColor: colors.cardBackground,
        },
        title: {
          fontSize: fontSizes['3xl'],
          fontFamily: fonts.SemiBold,
          color: colors.text,
          marginBottom: metrics.xs,
        },
        code: {
          fontFamily: fonts.Bold,
          color: colors.text,
        },
        subtitle: {
          fontSize: fontSizes.lg,
          fontFamily: fonts.Light,
          fontStyle: 'italic',
          color: colors.secondary,
          marginBottom: metrics.lg,
        },
        infoBlock: {
          marginTop: metrics.sm,
          padding: metrics.md,
          backgroundColor: colors.background,
          borderRadius: metrics.borderRadiusMedium,
        },
        infoText: {
          fontSize: fontSizes.md,
          marginBottom: metrics.sm,
          lineHeight: fontSizes.md * lineHeights.normal,
        },
        infoLabel: {
          fontFamily: fonts.Medium,
          color: colors.secondary,
        },
        infoValue: {
          fontFamily: fonts.Regular,
          color: colors.text,
        },
      }),
    [colors],
  );
};
export const useHiveDetailInfoSkeletonStyles = () => {
  const { colors } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          padding: metrics.lg,
          backgroundColor: colors.cardBackground,
        },
        placeholder: {
          backgroundColor: colors.lightGray,
          borderRadius: metrics.borderRadiusSmall,
        },
        title: {
          height: fontSizes['3xl'],
          width: '80%',
          marginBottom: metrics.sm,
        },
        subtitle: {
          height: fontSizes.lg,
          width: '60%',
          marginBottom: metrics.xl,
        },
        infoBlock: {
          marginTop: metrics.sm,
          padding: metrics.md,
          backgroundColor: colors.background,
          borderRadius: metrics.borderRadiusMedium,
        },
        infoRow: {
          height: fontSizes.md,
          width: '70%',
          marginBottom: metrics.md,
        },
      }),
    [colors],
  );
};
