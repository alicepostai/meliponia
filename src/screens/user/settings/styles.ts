import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { fonts, fontSizes } from '@/theme/fonts';
import { metrics } from '@/theme/metrics';
export const useAppSettingsScreenStyles = () => {
  const { colors } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        dataSection: {
          marginTop: metrics.lg,
          marginHorizontal: metrics.lg,
          backgroundColor: colors.cardBackground,
          borderRadius: metrics.borderRadiusMedium,
          overflow: 'hidden',
        },
        themeSelectorContainer: {
          flexDirection: 'row',
          backgroundColor: colors.background,
          borderRadius: metrics.borderRadiusSmall,
          padding: metrics.xs,
        },
        themeButton: {
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: metrics.sm,
          borderRadius: metrics.borderRadiusSmall - 2,
        },
        themeButtonText: {
          fontSize: fontSizes.sm,
          fontFamily: fonts.Medium,
          marginLeft: metrics.xs,
        },
      }),
    [colors],
  );
};
export const useSettingsActionRowStyles = () => {
  const { colors } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        actionRow: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: metrics.md + 2,
          paddingHorizontal: metrics.md,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.border,
        },
        actionRowLast: {
          borderBottomWidth: 0,
        },
        actionIconContainer: {
          width: metrics.iconSizeLarge + metrics.sm,
          alignItems: 'center',
          marginRight: metrics.xs,
        },
        actionIcon: {},
        actionText: {
          flex: 1,
          fontSize: fontSizes.lg,
          fontFamily: fonts.Regular,
          color: colors.text,
        },
        actionValueText: {
          fontSize: fontSizes.md,
          fontFamily: fonts.Regular,
          color: colors.textSecondary,
          marginRight: metrics.sm,
        },
        chevronIcon: {
          marginLeft: metrics.xs,
        },
        valueComponentContainer: {},
        themeOptionContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: metrics.lg,
          paddingHorizontal: metrics.md,
          backgroundColor: colors.cardBackground,
        },
        themeIconContainer: {
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: colors.background,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: metrics.md,
        },
        themeTextContainer: {
          flex: 1,
          marginRight: metrics.md,
        },
        themeLabel: {
          fontSize: fontSizes.lg,
          fontFamily: fonts.Medium,
          color: colors.text,
          marginBottom: metrics.xs,
        },
        themeDescription: {
          fontSize: fontSizes.sm,
          fontFamily: fonts.Regular,
          color: colors.textSecondary,
        },
      }),
    [colors],
  );
};
