import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { fonts, fontSizes } from '@/theme/fonts';
import { metrics } from '@/theme/metrics';
export const useHiveDetailTimelineStyles = () => {
  const { colors } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        listContent: {
          paddingVertical: metrics.lg,
          paddingHorizontal: metrics.lg,
          flexGrow: 1,
        },
        centeredMessageContainer: {
          flex: 1,
          padding: metrics.xl,
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 200,
        },
        emptyText: {
          fontSize: fontSizes.md,
          fontFamily: fonts.Regular,
          color: colors.secondary,
          textAlign: 'center',
        },
        errorText: {
          fontSize: fontSizes.md,
          fontFamily: fonts.Regular,
          color: colors.error,
          textAlign: 'center',
        },
        loadingText: {
          fontSize: fontSizes.md,
          fontFamily: fonts.Regular,
          color: colors.secondary,
          textAlign: 'center',
          marginTop: metrics.sm,
        },
      }),
    [colors],
  );
};
