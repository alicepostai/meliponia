import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { fonts, fontSizes, lineHeights } from '@/theme/fonts';
import { metrics } from '@/theme/metrics';
export const useActionHistoryCardStyles = () => {
  const { colors } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        card: {
          backgroundColor: colors.cardBackground,
          borderRadius: metrics.borderRadiusMedium,
          borderLeftWidth: 3,
          borderLeftColor: colors.honeyLight,
          marginBottom: metrics.lg,
          padding: metrics.md,
          shadowColor: colors.black,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 3.84,
          elevation: 5,
        },
        cardHeader: {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: metrics.md,
        },
        actionIcon: {
          marginRight: metrics.md,
        },
        headerTextContainer: {
          flex: 1,
        },
        actionTitle: {
          fontSize: fontSizes.xl,
          fontFamily: fonts.SemiBold,
          color: colors.primary,
          marginBottom: metrics.xs / 2,
        },
        actionDate: {
          fontSize: fontSizes.sm,
          fontFamily: fonts.Light,
          color: colors.secondary,
        },
        hiveInfoContainer: {
          marginBottom: metrics.sm,
          paddingVertical: metrics.sm,
          paddingHorizontal: metrics.md,
          backgroundColor: colors.background,
          borderRadius: metrics.borderRadiusSmall,
        },
        hiveInfoText: {
          fontSize: fontSizes.md,
          fontFamily: fonts.Regular,
          color: colors.primary,
          lineHeight: fontSizes.md * lineHeights.normal,
        },
        hiveCodeText: {
          fontFamily: fonts.SemiBold,
        },
        speciesText: {
          fontFamily: fonts.Light,
          fontStyle: 'italic',
        },
        detailsContainer: {
          marginTop: metrics.sm,
        },
      }),
    [colors],
  );
};
export const useDetailFieldStyles = () => {
  const { colors } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        detailItem: {
          flexDirection: 'row',
          marginBottom: metrics.xs,
        },
        detailLabel: {
          fontFamily: fonts.Medium,
          color: colors.secondary,
          marginRight: metrics.xs,
          fontSize: fontSizes.md,
        },
        detailValue: {
          fontFamily: fonts.Regular,
          color: colors.primary,
          flexShrink: 1,
          fontSize: fontSizes.md,
          lineHeight: fontSizes.md * lineHeights.normal,
        },
      }),
    [colors],
  );
};
