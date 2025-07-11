import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { fonts, fontSizes } from '@/theme/fonts';
import { metrics } from '@/theme/metrics';
export const useHiveMaintenanceScreenStyles = () => {
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
        textArea: {
          minHeight: 100,
          textAlignVertical: 'top',
          paddingTop: metrics.sm,
        },
        submitButton: {
          marginTop: metrics.lg,
        },
      }),
    [colors],
  );
};
