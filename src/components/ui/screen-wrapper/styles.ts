import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { metrics } from '@/theme/metrics';
export const useScreenWrapperStyles = () => {
  const { colors } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        safeArea: {
          flex: 1,
          backgroundColor: colors.background,
        },
        container: {
          flex: 1,
        },
        withPadding: {
          padding: metrics.lg,
        },
        scrollContentContainer: {
          flexGrow: 1,
        },
      }),
    [colors],
  );
};
