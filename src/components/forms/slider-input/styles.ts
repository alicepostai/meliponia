import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { fonts, fontSizes } from '@/theme/fonts';
import { metrics } from '@/theme/metrics';
export const useSliderInputStyles = () => {
  const { colors } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        fieldContainer: {
          marginVertical: metrics.sm,
          marginBottom: metrics.lg,
        },
        labelContainer: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: metrics.md,
        },
        sliderLabel: {
          fontSize: fontSizes.md,
          fontFamily: fonts.Medium,
          color: colors.text,
          flex: 1,
        },
        valueContainer: {
          backgroundColor: colors.honey,
          paddingHorizontal: metrics.md,
          paddingVertical: metrics.xs,
          borderRadius: metrics.borderRadiusLarge,
          shadowColor: colors.honey,
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 4,
        },
        valueText: {
          fontSize: fontSizes.sm,
          fontFamily: fonts.SemiBold,
          color: colors.white,
          textAlign: 'center',
          minWidth: 60,
        },
        sliderContainer: {
          paddingHorizontal: metrics.xs,
        },
        slider: {
          width: '100%',
          height: 40,
        },
      }),
    [colors],
  );
};
