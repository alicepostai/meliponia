import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { metrics } from '@/theme/metrics';
export const useHiveInspectionScreenStyles = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        formContainer: {
          paddingHorizontal: metrics.md,
          paddingTop: metrics.lg,
          paddingBottom: metrics.xl,
        },
        textArea: {
          minHeight: 100,
          textAlignVertical: 'top',
          paddingTop: metrics.sm,
        },
        submitButton: {
          marginTop: metrics.xl,
        },
      }),
    [],
  );
};
