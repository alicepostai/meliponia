import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { fonts, fontSizes, lineHeights } from '@/theme/fonts';
import { metrics } from '@/theme/metrics';
export const useHiveTimelineItemCardStyles = () => {
  const { colors } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        card: {
          flexDirection: 'row',
          marginBottom: metrics.lg,
          alignItems: 'flex-start',
        },
        timelineLineContainer: {
          alignItems: 'center',
          marginRight: metrics.md,
          width: 20,
          paddingTop: metrics.xs,
        },
        timelineDot: {
          width: 12,
          height: 12,
          borderRadius: 6,
          backgroundColor: colors.honey,
          borderWidth: 1,
          borderColor: colors.honeyDark,
          shadowColor: colors.honey,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.3,
          shadowRadius: 2,
          elevation: 2,
        },
        timelineLine: {
          flex: 1,
          width: 2,
          backgroundColor: colors.border,
          marginTop: metrics.xs,
        },
        contentContainer: {
          flex: 1,
          backgroundColor: colors.cardBackground,
          borderRadius: metrics.borderRadiusMedium,
          borderLeftWidth: 3,
          borderLeftColor: colors.honeyLight,
          padding: metrics.md,
          borderWidth: 1,
          borderColor: colors.border,
        },
        header: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: metrics.sm,
        },
        dateText: {
          fontSize: fontSizes.sm,
          fontFamily: fonts.Medium,
          color: colors.secondary,
        },
        deleteButton: {
          margin: -metrics.sm,
          width: 30,
          height: 30,
        },
        body: {
          flexDirection: 'row',
          alignItems: 'flex-start',
        },
        typeIcon: {
          marginRight: metrics.md,
          marginTop: 2,
        },
        detailsContainer: {
          flex: 1,
        },
        typeText: {
          fontSize: fontSizes.xl,
          fontFamily: fonts.SemiBold,
          color: colors.primary,
          marginBottom: metrics.md,
        },
        observationText: {
          fontSize: fontSizes.md,
          fontFamily: fonts.Light,
          fontStyle: 'italic',
          color: colors.secondary,
          marginTop: metrics.sm,
          lineHeight: fontSizes.md * lineHeights.normal,
        },
        detailLabel: {
          fontFamily: fonts.Medium,
          color: colors.secondary,
        },
      }),
    [colors],
  );
};
export const useDetailRowStyles = () => {
  const { colors } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        detailText: {
          fontSize: fontSizes.md,
          fontFamily: fonts.Regular,
          color: colors.primary,
          marginBottom: metrics.sm,
          lineHeight: fontSizes.md * lineHeights.normal,
        },
        detailLabel: {
          fontFamily: fonts.Medium,
          color: colors.secondary,
        },
      }),
    [colors],
  );
};
