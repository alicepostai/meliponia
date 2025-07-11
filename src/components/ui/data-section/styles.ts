import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { fonts, fontSizes } from '@/theme/fonts';
import { metrics } from '@/theme/metrics';
export const useDataSectionStyles = () => {
  const { colors } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        section: {
          marginBottom: metrics.lg,
          marginHorizontal: metrics.lg,
        },
        sectionTitle: {
          fontSize: fontSizes.xl,
          fontFamily: fonts.SemiBold,
          color: colors.text,
          marginBottom: metrics.sm,
          paddingHorizontal: metrics.xs,
        },
        contentContainer: {
          backgroundColor: colors.cardBackground,
          borderRadius: metrics.borderRadiusMedium,
          borderWidth: 1,
          borderColor: colors.border,
          elevation: 2,
          shadowColor: colors.black,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
          padding: metrics.md,
        },
      }),
    [colors],
  );
};
