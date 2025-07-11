import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { fonts, fontSizes } from '@/theme/fonts';
import { metrics } from '@/theme/metrics';
export const usePickerInputStyles = () => {
  const { colors } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        label: {
          fontSize: fontSizes.md,
          fontFamily: fonts.Medium,
          color: colors.text,
          marginBottom: metrics.sm,
          marginLeft: metrics.lg,
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
          marginBottom: metrics.md,
          overflow: 'hidden',
        },
        errorBorder: {
          borderColor: colors.error,
        },
        icon: {
          marginRight: metrics.sm,
        },
        picker: {
          flex: 1,
          height: metrics.inputHeight,
          color: colors.text,
          backgroundColor: 'transparent',
        },
        placeholderItem: {
          color: colors.secondary,
          fontFamily: fonts.Regular,
          fontSize: fontSizes.lg,
        },
        pickerItem: {
          fontFamily: fonts.Regular,
          fontSize: fontSizes.lg,
          color: colors.text,
        },
      }),
    [colors],
  );
};
