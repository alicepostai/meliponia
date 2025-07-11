import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { fonts, fontSizes } from '@/theme/fonts';
import { metrics } from '@/theme/metrics';
export const useHiveHarvestScreenStyles = () => {
  const { colors } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        formContainer: {
          paddingVertical: metrics.lg,
        },
        formSection: {
          marginBottom: metrics.xl,
        },
        sectionTitle: {
          fontSize: fontSizes.lg,
          fontFamily: fonts.SemiBold,
          color: colors.text,
          marginBottom: metrics.sm,
          paddingHorizontal: metrics.xs,
        },
        fieldsGroupContainer: {
          backgroundColor: colors.cardBackground,
          borderRadius: metrics.borderRadiusMedium,
          borderWidth: 1,
          borderColor: colors.border,
          overflow: 'hidden',
        },
        fieldWrapper: {
          paddingHorizontal: metrics.md,
          paddingVertical: metrics.sm,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        lastFieldWrapper: {
          borderBottomWidth: 0,
        },
        conditionalInputContainer: {
          paddingTop: metrics.sm,
        },
        textArea: {
          minHeight: 80,
          textAlignVertical: 'top',
          paddingTop: metrics.sm,
        },
        submitButton: {
          marginTop: metrics.lg,
        },
        errorSummary: {
          color: colors.error,
          fontFamily: fonts.Regular,
          fontSize: fontSizes.sm,
          textAlign: 'center',
          paddingHorizontal: metrics.md,
          marginTop: metrics.sm,
        },
      }),
    [colors],
  );
};
