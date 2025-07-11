import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { fonts, fontSizes } from '@/theme/fonts';
import { metrics } from '@/theme/metrics';

export const useFastOptionsMenuStyles = () => {
  const { colors } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        backdrop: {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          zIndex: 999,
        },
        menuContainer: {
          backgroundColor: colors.cardBackground,
          borderRadius: metrics.borderRadiusMedium,
          paddingVertical: metrics.xs,
          minWidth: 200,
          maxWidth: 250,
          elevation: 8,
          shadowColor: colors.black,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          zIndex: 1000,
          borderWidth: 1,
          borderColor: colors.border,
        },
        menuItem: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: metrics.md,
          paddingVertical: metrics.sm,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        lastMenuItem: {
          borderBottomWidth: 0,
        },
        menuIcon: {
          marginRight: metrics.sm,
          width: 20,
        },
        menuText: {
          fontSize: fontSizes.md,
          fontFamily: fonts.Regular,
          flex: 1,
        },
      }),
    [colors],
  );
};
