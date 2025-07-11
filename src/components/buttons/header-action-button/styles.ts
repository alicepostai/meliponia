import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { metrics } from '@/theme/metrics';
export const useHeaderActionButtonStyles = () => {
  const { colors } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        button: {
          padding: metrics.sm,
          marginLeft: metrics.sm,
          justifyContent: 'center',
          alignItems: 'center',
        },
        disabledButton: {
          opacity: 0.6,
        },
      }),
    [colors],
  );
};
