import { useMemo } from 'react';
import { StyleSheet, StatusBar } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { fonts, fontSizes } from '@/theme/fonts';
import { metrics } from '@/theme/metrics';
export const useSimpleOptionsMenuStyles = () => {
  const { colors } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        modalOverlay: {
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          justifyContent: 'flex-start',
          alignItems: 'flex-end',
          paddingTop: (StatusBar.currentHeight || 0) + metrics.md,
          paddingRight: metrics.md,
        },
        menuContainer: {
          backgroundColor: colors.cardBackground,
          borderRadius: metrics.borderRadiusMedium,
          paddingVertical: metrics.sm,
          minWidth: 200,
          elevation: 5,
          shadowColor: colors.black,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
        },
        menuItem: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: metrics.lg,
          paddingVertical: metrics.md,
        },
        menuIcon: {
          marginRight: metrics.md,
        },
        menuText: {
          fontSize: fontSizes.md,
          fontFamily: fonts.Regular,
          color: colors.text,
        },
        destructiveText: {
          color: colors.error,
        },
      }),
    [colors],
  );
};
