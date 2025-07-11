import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { fonts, fontSizes } from '@/theme/fonts';
import { metrics } from '@/theme/metrics';
export const useInputFieldStyles = () => {
  const { colors } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        fieldContainer: {
          marginBottom: metrics.md,
        },
        label: {
          fontSize: fontSizes.md,
          fontFamily: fonts.Medium,
          color: colors.text,
          marginBottom: metrics.xs,
          marginLeft: metrics.xs,
        },
        inputContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: metrics.borderWidth,
          borderColor: colors.border,
          borderRadius: metrics.borderRadiusMedium,
          backgroundColor: colors.cardBackground,
          minHeight: metrics.inputHeight,
          paddingHorizontal: metrics.md,
        },
        errorBorder: {
          borderColor: colors.error,
        },
        icon: {
          marginRight: metrics.sm,
        },
        textInput: {
          flex: 1,
          fontFamily: fonts.Regular,
          fontSize: fontSizes.lg,
          color: colors.text,
          paddingVertical: metrics.md,
        },
        toggleButton: {
          paddingLeft: metrics.sm,
        },
      }),
    [colors],
  );
};
