import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { metrics } from '@/theme/metrics';
export const useHiveOutgoingScreenStyles = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        headerContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: metrics.sm,
          marginBottom: metrics.md,
          marginTop: metrics.sm,
        },
        formContainer: {
          paddingHorizontal: metrics.sm,
        },
        textArea: {
          height: 80,
          textAlignVertical: 'top',
          paddingTop: metrics.md,
        },
        textAreaSmall: {
          height: 60,
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
