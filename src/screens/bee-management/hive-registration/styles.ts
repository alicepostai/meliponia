import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { fonts, fontSizes } from '@/theme/fonts';
import { metrics } from '@/theme/metrics';
export const useHiveRegistrationScreenStyles = () => {
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
          minHeight: 80,
          textAlignVertical: 'top',
          paddingTop: metrics.sm,
        },
        submitButton: {
          marginTop: metrics.lg,
        },
        coordinatesDisplay: {
          fontSize: fontSizes.sm,
          fontFamily: fonts.Regular,
          color: colors.textSecondary,
          textAlign: 'center',
          marginBottom: metrics.md,
          fontStyle: 'italic',
        },
        mapPickerButton: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.primary,
          paddingVertical: metrics.sm,
          borderRadius: metrics.borderRadiusSmall,
          height: 40,
          marginBottom: metrics.sm,
        },
        locationButton: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.secondary,
          paddingVertical: metrics.sm,
          borderRadius: metrics.borderRadiusSmall,
          height: 40,
        },
        locationButtonIcon: {
          marginRight: metrics.sm,
        },
        locationButtonText: {
          color: colors.white,
          fontFamily: fonts.Medium,
          fontSize: fontSizes.md,
        },
      }),
    [colors],
  );
};
