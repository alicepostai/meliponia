import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { metrics } from '@/theme/metrics';
import { fonts, fontSizes } from '@/theme/fonts';
export const useFabWithOptionsStyles = () => {
  const { colors } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          position: 'absolute',
          bottom: metrics.xl,
          right: metrics.lg,
          alignItems: 'flex-end',
        },
        optionsContainer: {
          alignItems: 'flex-end',
          marginBottom: metrics.lg,
        },
        fab: {
          width: 60,
          height: 60,
          borderRadius: 30,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.honey,
          borderWidth: 2,
          borderColor: colors.white,
          shadowColor: colors.honey,
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.3,
          shadowRadius: 5,
          elevation: 8,
        },
      }),
    [colors],
  );
};
export const useFabOptionItemStyles = () => {
  const { colors } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        optionRow: {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: metrics.md,
        },
        labelContainer: {
          backgroundColor: colors.cardBackground,
          paddingHorizontal: metrics.md,
          paddingVertical: metrics.xs,
          borderRadius: metrics.borderRadiusSmall,
          marginRight: metrics.md,
          elevation: 2,
          shadowColor: colors.honey,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.15,
          shadowRadius: 1.5,
        },
        labelText: {
          color: colors.text,
          fontFamily: fonts.Medium,
          fontSize: fontSizes.sm,
        },
        optionButton: {
          width: 48,
          height: 48,
          borderRadius: 24,
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: colors.black,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.2,
          shadowRadius: 2,
          elevation: 3,
        },
      }),
    [colors],
  );
};
