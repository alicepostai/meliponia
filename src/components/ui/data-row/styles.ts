import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { fonts, fontSizes } from '@/theme/fonts';
import { metrics } from '@/theme/metrics';
export const useDataRowStyles = () => {
  const { colors } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        dataRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: metrics.sm,
          paddingVertical: metrics.xs / 2,
        },
        label: {
          fontSize: fontSizes.lg,
          fontFamily: fonts.Regular,
          color: colors.secondary,
          marginRight: metrics.sm,
        },
        value: {
          fontSize: fontSizes.lg,
          fontFamily: fonts.SemiBold,
          color: colors.honeyDark,
          textAlign: 'right',
          flexShrink: 1,
        },
      }),
    [colors],
  );
};
