import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { fonts, fontSizes } from '@/theme/fonts';
import { metrics } from '@/theme/metrics';
export const useSwitchInputStyles = () => {
  const { colors } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        fieldContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: metrics.xs,
          marginBottom: metrics.xs,
        },
        disabledContainerOpacity: {
          opacity: 0.6,
        },
        switchLabel: {
          fontFamily: fonts.Regular,
          fontSize: fontSizes.lg,
          color: colors.text,
          marginRight: metrics.md,
          flexShrink: 1,
        },
        disabledLabelColor: {
          color: colors.textSecondary,
          opacity: 0.7,
        },
        switchStyle: {},
      }),
    [colors],
  );
};
