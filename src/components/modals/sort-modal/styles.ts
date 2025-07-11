import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { fonts, fontSizes } from '@/theme/fonts';
import { metrics } from '@/theme/metrics';
export const useSortModalStyles = () => {
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
          paddingVertical: metrics.xl,
          paddingHorizontal: metrics.lg,
          borderTopLeftRadius: metrics.borderRadiusLarge,
          borderTopRightRadius: metrics.borderRadiusLarge,
          shadowColor: colors.black,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 5,
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
          paddingVertical: metrics.sm,
        },
        modalOptionText: {
          fontSize: fontSizes.lg,
          fontFamily: fonts.Regular,
          marginLeft: metrics.md,
          color: colors.text,
        },
      }),
    [colors],
  );
};
