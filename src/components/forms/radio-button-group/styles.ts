import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { fonts, fontSizes } from '@/theme/fonts';
import { metrics } from '@/theme/metrics';
export const useRadioButtonGroupStyles = () => {
  const { colors } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        groupContainer: {
          marginBottom: metrics.md,
        },
        groupLabel: {
          fontSize: fontSizes.md,
          fontFamily: fonts.Medium,
          color: colors.text,
          marginBottom: metrics.sm,
        },
        optionContainer: {
          borderRadius: metrics.borderRadiusSmall,
          marginVertical: metrics.xs / 2,
        },
        innerOptionContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: metrics.sm - 2,
          paddingHorizontal: metrics.xs,
        },
        optionLabel: {
          marginLeft: metrics.sm,
          fontFamily: fonts.Regular,
          fontSize: fontSizes.lg,
          color: colors.text,
          flexShrink: 1,
        },
        disabledLabel: {
          color: colors.textSecondary,
          opacity: 0.7,
        },
      }),
    [colors],
  );
};
