import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { fonts, fontSizes } from '@/theme/fonts';
import { metrics } from '@/theme/metrics';

export const useLocationSelectorStyles = () => {
  const { colors } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        inputLabel: {
          fontSize: fontSizes.md,
          fontFamily: fonts.Medium,
          color: colors.text,
          marginBottom: metrics.sm,
        },
        locationContainer: {
          flexDirection: 'row',
          gap: metrics.sm,
          marginBottom: metrics.sm,
        },
        locationButton: {
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.background,
          borderWidth: 1,
          borderColor: colors.secondary,
          borderRadius: metrics.borderRadiusSmall,
          paddingVertical: metrics.sm,
          paddingHorizontal: metrics.md,
          gap: metrics.xs,
        },
        locationButtonText: {
          fontSize: fontSizes.sm,
          fontFamily: fonts.Medium,
          color: colors.secondary,
        },
        mapPickerButton: {
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.secondary,
          borderRadius: metrics.borderRadiusSmall,
          paddingVertical: metrics.sm,
          paddingHorizontal: metrics.md,
          gap: metrics.xs,
        },
        mapPickerButtonText: {
          fontSize: fontSizes.sm,
          fontFamily: fonts.Medium,
          color: colors.background,
        },
        coordinatesText: {
          fontSize: fontSizes.sm,
          fontFamily: fonts.Regular,
          color: colors.textSecondary,
          textAlign: 'center',
          marginTop: metrics.xs,
        },
      }),
    [colors],
  );
};
