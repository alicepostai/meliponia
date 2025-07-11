import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { fonts, fontSizes } from '@/theme/fonts';
import { metrics } from '@/theme/metrics';
export const useMainButtonStyles = () => {
  const { colors } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        button: {
          backgroundColor: colors.honey,
          borderRadius: metrics.borderRadiusMedium,
          paddingVertical: metrics.md,
          paddingHorizontal: metrics.xl,
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 50,
          marginVertical: metrics.sm,
          borderWidth: 1,
          borderColor: colors.honeyDark + '40',
          shadowColor: colors.honey,
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 4,
        },
        disabledButton: {
          backgroundColor: colors.disabledBackground,
        },
        buttonText: {
          color: colors.white,
          fontSize: fontSizes.lg,
          fontFamily: fonts.SemiBold,
          textAlign: 'center',
        },
      }),
    [colors],
  );
};
