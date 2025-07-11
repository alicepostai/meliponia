import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { fonts, fontSizes } from '@/theme/fonts';
import { metrics } from '@/theme/metrics';
export const useHiveDivisionScreenStyles = () => {
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
        emptyListContainer: {
          padding: metrics.lg,
          alignItems: 'center',
        },
        emptyListText: {
          fontSize: fontSizes.md,
          fontFamily: fonts.Regular,
          color: colors.textSecondary,
          textAlign: 'center',
        },
        inputLabel: {
          fontSize: fontSizes.md,
          fontFamily: fonts.Medium,
          color: colors.text,
          marginBottom: metrics.sm,
        },
        locationContainer: {
          flexDirection: 'row',
          gap: metrics.sm,
          marginBottom: metrics.sm,
        },
        locationButton: {
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.background,
          borderWidth: 1,
          borderColor: colors.primary,
          borderRadius: metrics.borderRadiusSmall,
          paddingVertical: metrics.sm,
          paddingHorizontal: metrics.md,
          gap: metrics.xs,
        },
        locationButtonText: {
          fontSize: fontSizes.sm,
          fontFamily: fonts.Medium,
          color: colors.primary,
        },
        mapPickerButton: {
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.primary,
          borderRadius: metrics.borderRadiusSmall,
          paddingVertical: metrics.sm,
          paddingHorizontal: metrics.md,
          gap: metrics.xs,
        },
        mapPickerButtonText: {
          fontSize: fontSizes.sm,
          fontFamily: fonts.Medium,
          color: colors.background,
        },
        coordinatesText: {
          fontSize: fontSizes.sm,
          fontFamily: fonts.Regular,
          color: colors.textSecondary,
          textAlign: 'center',
          marginTop: metrics.xs,
        },
      }),
    [colors],
  );
};
