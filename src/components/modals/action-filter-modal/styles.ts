import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { fonts, fontSizes } from '@/theme/fonts';
import { metrics } from '@/theme/metrics';
export const useActionFilterModalStyles = () => {
  const { colors } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        modal: {
          justifyContent: 'flex-end',
          margin: 0,
        },
        modalContent: {
          backgroundColor: colors.cardBackground,
          paddingTop: metrics.xl,
          paddingHorizontal: metrics.lg,
          borderTopLeftRadius: metrics.borderRadiusLarge,
          borderTopRightRadius: metrics.borderRadiusLarge,
          maxHeight: '70%',
        },
        modalTitle: {
          fontSize: fontSizes.xl,
          fontFamily: fonts.SemiBold,
          marginBottom: metrics.lg,
          color: colors.text,
          textAlign: 'center',
        },
        modalOption: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: metrics.xs,
        },
        modalOptionText: {
          fontSize: fontSizes.lg,
          fontFamily: fonts.Regular,
          marginLeft: metrics.md,
          color: colors.text,
        },
        buttonContainer: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical: metrics.lg,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          marginTop: metrics.md,
        },
        clearButton: {
          padding: metrics.sm,
        },
        clearButtonText: {
          color: colors.honey,
          fontFamily: fonts.SemiBold,
          fontSize: fontSizes.md,
        },
        applyButton: {
          flex: 1,
          marginLeft: metrics.lg,
          marginVertical: 0,
        },
      }),
    [colors],
  );
};
