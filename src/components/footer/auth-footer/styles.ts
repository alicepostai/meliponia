import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { fonts, fontSizes } from '@/theme/fonts';
import { metrics } from '@/theme/metrics';
export const useAuthFooterStyles = () => {
  const { colors } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        footerContainer: {
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: metrics.sm,
        },
        footerText: {
          color: colors.primary,
          fontFamily: fonts.Regular,
          fontSize: fontSizes.md,
        },
        footerActionText: {
          color: colors.honey,
          fontFamily: fonts.SemiBold,
          fontSize: fontSizes.md,
          marginLeft: metrics.xs,
        },
      }),
    [colors],
  );
};
