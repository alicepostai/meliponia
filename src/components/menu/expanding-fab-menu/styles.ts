import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { fonts, fontSizes } from '@/theme/fonts';
import { metrics } from '@/theme/metrics';
export const useExpandingFabMenuStyles = () => {
  const { colors } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          position: 'absolute',
          bottom: metrics.xl,
          right: metrics.lg,
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
        },
        fab: {
          width: 60,
          height: 60,
          borderRadius: 30,
          justifyContent: 'center',
          alignItems: 'center',
          elevation: 6,
          shadowColor: colors.black,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
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
        optionContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          position: 'absolute',
          right: 6,
          bottom: 6,
        },
        hiddenOption: {
          pointerEvents: 'none',
        },
        labelContainer: {
          backgroundColor: colors.cardBackground,
          paddingHorizontal: metrics.md,
          paddingVertical: metrics.sm,
          borderRadius: metrics.borderRadiusSmall,
          marginRight: metrics.md,
          elevation: 4,
          shadowColor: colors.black,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.15,
          shadowRadius: 2,
        },
        labelText: {
          color: colors.text,
          fontFamily: fonts.Medium,
          fontSize: fontSizes.md,
        },
        optionButton: {
          width: 48,
          height: 48,
          borderRadius: 24,
          justifyContent: 'center',
          alignItems: 'center',
          elevation: 4,
        },
      }),
    [colors],
  );
};
