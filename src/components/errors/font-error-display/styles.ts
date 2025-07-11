import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
export const useFontErrorDisplayStyles = () => {
  const { colors } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
          backgroundColor: colors.background,
        },
        icon: {
          marginBottom: 16,
        },
        titleText: {
          fontSize: 22,
          fontWeight: '600',
          textAlign: 'center',
          marginBottom: 10,
          color: colors.error,
        },
        messageText: {
          fontSize: 16,
          textAlign: 'center',
          lineHeight: 24,
          paddingHorizontal: 10,
          color: colors.textSecondary,
        },
        detailText: {
          fontSize: 12,
          textAlign: 'center',
          marginTop: 15,
          opacity: 0.7,
          color: colors.textSecondary,
        },
      }),
    [colors],
  );
};
