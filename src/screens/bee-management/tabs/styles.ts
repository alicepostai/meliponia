import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { metrics } from '@/theme/metrics';

export const useTabsLayoutStyle = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        headerRightContainer: {
          flexDirection: 'row',
          marginRight: metrics.sm,
        },
      }),
    [],
  );
};
