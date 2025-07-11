import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { fonts, fontSizes } from '@/theme/fonts';
import { metrics } from '@/theme/metrics';
export const useLoginScreenStyles = () => {
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
        header: {
          marginBottom: metrics.lg,
        },
        formContainer: {
          width: '100%',
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
        forgotPasswordButton: {
          alignSelf: 'flex-end',
          paddingVertical: metrics.sm,
          marginBottom: metrics.lg,
        },
        forgotPasswordText: {
          textAlign: 'right',
          color: colors.honey,
          fontFamily: fonts.SemiBold,
          fontSize: fontSizes.md,
        },
        loginButton: {
          marginTop: metrics.sm,
        },
        footer: {
          alignSelf: 'center',
          marginTop: metrics.xs,
        },
      }),
    [colors],
  );
};
