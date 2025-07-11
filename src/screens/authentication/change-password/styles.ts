import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { metrics } from '@/theme/metrics';

export const useChangePasswordScreenStyles = () => {
  const { colors } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        scrollContent: {
          flexGrow: 1,
          justifyContent: 'center',
          paddingHorizontal: metrics.lg,
          paddingVertical: metrics.lg,
        },
        headerContainer: {
          marginBottom: metrics.xl,
        },
        actionHeader: {
          marginVertical: 0,
          paddingHorizontal: 0,
        },
        header: {
          marginBottom: metrics.lg,
        },
        formContainer: {
          backgroundColor: colors.cardBackground,
          borderRadius: metrics.borderRadiusMedium,
          padding: metrics.lg,
          marginBottom: metrics.lg,
          shadowColor: colors.honey,
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.15,
          shadowRadius: 6,
          elevation: 4,
          borderWidth: 1,
          borderColor: colors.border,
        },
        submitButton: {
          marginTop: metrics.lg,
        },
        footer: {
          alignSelf: 'center',
          marginTop: metrics.lg,
        },
      }),
    [colors],
  );
};
